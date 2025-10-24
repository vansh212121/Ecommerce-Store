import logging
from typing import Optional, Dict, Any
import uuid

from sqlmodel.ext.asyncio.session import AsyncSession
from app.crud.product_attributes.color_crud import color_repository
from app.schemas.color_schema import (
    ColorCreate,
    ColorUpdate,
    ColorResponse,
    ColorListResponse,
)
from app.models.user_model import User, UserRole
from app.models.product_model import Color
from app.services.cache_service import cache_service
from app.core.exception_utils import raise_for_status
from app.core.exceptions import (
    ResourceNotFound,
    NotAuthorized,
    ValidationError,
    ResourceAlreadyExists,
)

logger = logging.getLogger(__name__)


class ColorService:
    """Handles all color-related business logic."""

    def __init__(self):
        """
        Initializes the ColorService.
        This version has no arguments, making it easy for FastAPI to use,
        while still allowing for dependency injection during tests.
        """
        self.color_repository = color_repository
        self._logger = logging.getLogger(f"{__name__}.{self.__class__.__name__}")

    def _check_authorization(self, *, current_user: User, action: str) -> None:
        """
        Central authorization check. An admin can do anything.
        A non-admin can only perform actions on their own account.

        Args:
            current_user: The user performing the action
            target_user: The user being acted upon
            action: Description of the action for error messages

        Raises:
            NotAuthorized: If user lacks permission for the action
        """
        raise_for_status(
            condition=(current_user.role != UserRole.ADMIN),
            exception=NotAuthorized,
            detail=f"You are not authorized to {action} this color.",
        )

        # Admins have super powers
        if current_user.is_admin:
            return

    async def _load_color_schema_from_db(
        self, *, db: AsyncSession, color_id: uuid.UUID
    ) -> Optional[ColorResponse]:
        """Private helper to load a size from the DB and convert it to a Pydantic schema.
        This is our "loader" function for the cache."""

        color_model = await self.color_repository.get(db=db, obj_id=color_id)
        raise_for_status(
            condition=color_model is None,
            exception=ResourceNotFound,
            detail=f"Color with ID {color_id} not Found.",
            resource_type="Color",
        )
        return ColorResponse.model_validate(color_model)

    async def get_color_by_id(
        self, db: AsyncSession, *, color_id: uuid.UUID, current_user: User
    ) -> Optional[ColorResponse]:
        """Retrieve color by it's ID"""

        self._check_authorization(
            current_user=current_user,
            action="Fetch",
        )

        color = await cache_service.get_or_set(
            schema_type=ColorResponse,
            obj_id=color_id,
            loader=lambda: self._load_color_schema_from_db(db=db, color_id=color_id),
            ttl=300,  # Cache for 5 minutes
        )

        self._logger.debug(f"Color {color_id} retrieved by user {current_user.id}")
        return color

    async def get_all_colors(
        self,
        db: AsyncSession,
        *,
        current_user: User,
        skip: int = 0,
        limit: int = 50,
        filters: Optional[Dict[str, Any]] = None,
    ) -> ColorListResponse:
        """
        Lists colors with pagination and filtering.

        Args:
            db: Database session
            current_user: User making the request
            skip: Number of records to skip
            limit: Maximum number of records to return
            filters: Optional filters to apply
        Returns:
            SizeListResponse: Paginated list of users

        Raises:
            NotAuthorized: If user lacks permission to list users
            ValidationError: If pagination parameters are invalid
        """

        self._check_authorization(current_user=current_user, action="list")

        # Input validation
        if skip < 0:
            raise ValidationError("Skip parameter must be non-negative")
        if limit <= 0 or limit > 100:
            raise ValidationError("Limit must be between 1 and 100")

        # Delegate fetching to the repository
        colors, total = await self.color_repository.get_all(
            db=db,
            skip=skip,
            limit=limit,
            filters=filters,
        )

        # Calculate pagination info
        page = (skip // limit) + 1
        total_pages = (total + limit - 1) // limit  # Ceiling division

        # Construct the response schema
        response = ColorListResponse(
            items=colors, total=total, page=page, pages=total_pages, size=limit
        )

        self._logger.info(
            f"Color list retrieved by {current_user.id}: {len(colors)} colors returned"
        )
        return response

    async def create(
        self, db: AsyncSession, *, color_in: ColorCreate, current_user: User
    ) -> Color:
        """
        Handles the business logic of creating a new color.
        """
        self._check_authorization(current_user=current_user, action="Create")

        # 1. Check for conflicts
        existing_color = await self.color_repository.get_by_name(
            db=db, name=color_in.name
        )
        raise_for_status(
            condition=(existing_color),
            exception=ResourceAlreadyExists,
            detail=f"Color already exists with {color_in.name}",
            resource_type="Color",
        )
        existing_hex = await self.color_repository.get_by_hex(
            db=db, hex_code=color_in.hex_code
        )
        raise_for_status(
            condition=(existing_hex),
            exception=ResourceAlreadyExists,
            detail=f"Color already exists with {color_in.hex_code}",
            resource_type="Color",
        )

        # 2. Prepare the color model
        color_dict = color_in.model_dump()

        color_to_create = Color(**color_dict)

        # 3. Delegate creation to the repository
        new_color = await self.color_repository.create(db=db, db_obj=color_to_create)
        self._logger.info(f"New color created: {new_color.name}")

        return new_color

    async def update(
        self,
        db: AsyncSession,
        *,
        color_id: uuid.UUID,
        color_data: ColorUpdate,
        current_user: User,
    ) -> Color:
        """Update a color"""

        color_to_update = await self.color_repository.get(db=db, obj_id=color_id)
        raise_for_status(
            condition=(color_to_update is None),
            exception=ResourceNotFound,
            detail=f"Color with id {color_id} not found.",
            resource_type="Color",
        )

        self._check_authorization(current_user=current_user, action="Update")

        await self._validate_color_update(
            db=db, color_data=color_data, existing_color=color_to_update
        )

        update_dict = color_data.model_dump(exclude_unset=True, exclude_none=True)

        updated_color = await self.color_repository.update(
            db=db,
            color=color_to_update,
            fields_to_update=update_dict,
        )

        await cache_service.invalidate(Color, color_id)

        self._logger.info(
            f"Color {color_id} updated by {current_user.id}",
            extra={
                "updated_color_id": color_id,
                "updater_id": current_user.id,
                "updated_fields": list(update_dict.keys()),
            },
        )
        return updated_color

    async def delete(
        self, db: AsyncSession, *, color_id: uuid.UUID, current_user: User
    ) -> Dict[str, str]:
        """Permanently deletes a color."""

        color_to_delete = await self.color_repository.get(db=db, obj_id=color_id)
        raise_for_status(
            condition=(color_to_delete is None),
            exception=ResourceNotFound,
            detail=f"Color with ID {color_id} not found.",
            resource_type="Color",
        )

        self._check_authorization(current_user=current_user, action="Delete")

        # 3. Perform the deletion
        await self.color_repository.delete(db=db, obj_id=color_id)

        # 4. Clean up cache and tokens
        await cache_service.invalidate(Color, color_id)

        self._logger.warning(
            f"Color {color_id} permanently deleted by {current_user.id}",
            extra={
                "deleted_color_id": color_id,
                "deleter_id": current_user.id,
            },
        )
        return {"message": f"Color '{color_to_delete.name}' deleted successfully"}

    async def _validate_color_update(
        self, db: AsyncSession, color_data: ColorUpdate, existing_color: Color
    ) -> None:
        """Validates color update data for potential conflicts."""

        if color_data.name and color_data.name.strip() != existing_color.name:
            # --- FIX: Check if conflicting color is not the same as existing ---
            conflicting_name = await self.color_repository.get_by_name(
                db=db, name=color_data.name
            )
            if conflicting_name and conflicting_name.id != existing_color.id:
                raise ResourceAlreadyExists(
                    f"A color with the name '{color_data.name}' already exists."
                )

        if (
            color_data.hex_code
            and color_data.hex_code.strip().upper() != existing_color.hex_code
        ):
            # --- FIX: Use correct parameter and check ID ---
            conflicting_hex = await self.color_repository.get_by_hex(
                db=db, hex_code=color_data.hex_code
            )
            if conflicting_hex and conflicting_hex.id != existing_color.id:
                raise ResourceAlreadyExists(
                    f"A color with the hex code '{color_data.hex_code}' already exists."
                )


color_service = ColorService()
