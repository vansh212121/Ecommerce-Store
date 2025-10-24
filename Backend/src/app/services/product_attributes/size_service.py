import logging
from typing import Optional, Dict, Any
import uuid

from sqlmodel.ext.asyncio.session import AsyncSession
from app.crud.product_attributes.size_crud import size_repository
from app.schemas.size_schema import (
    SizeCreate,
    SizeUpdate,
    SizeResponse,
    SizeListResponse,
)
from app.models.user_model import User, UserRole
from app.models.product_model import Size
from app.services.cache_service import cache_service
from app.core.exception_utils import raise_for_status
from app.core.exceptions import (
    ResourceNotFound,
    NotAuthorized,
    ValidationError,
    ResourceAlreadyExists,
)

logger = logging.getLogger(__name__)


class SizeService:
    """Handles all size-related business logic."""

    def __init__(self):
        """
        Initializes the SizeService.
        This version has no arguments, making it easy for FastAPI to use,
        while still allowing for dependency injection during tests.
        """
        self.size_repository = size_repository
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
            detail=f"You are not authorized to {action} this size.",
        )

        # Admins have super powers
        if current_user.is_admin:
            return

    async def _load_user_schema_from_db(
        self, *, db: AsyncSession, size_id: uuid.UUID
    ) -> Optional[SizeResponse]:
        """Private helper to load a size from the DB and convert it to a Pydantic schema.
        This is our "loader" function for the cache."""

        size_model = await self.size_repository.get(db=db, obj_id=size_id)
        raise_for_status(
            condition=size_model is None,
            exception=ResourceNotFound,
            detail=f"Size with ID {size_id} not Found.",
            resource_type="Size",
        )
        return SizeResponse.model_validate(size_model)

    async def get_size_by_id(
        self, db: AsyncSession, *, size_id: uuid.UUID, current_user: User
    ) -> Optional[SizeResponse]:
        """Retrieve size by it's ID"""

        self._check_authorization(
            current_user=current_user,
            action="Fetch",
        )

        size = await cache_service.get_or_set(
            schema_type=SizeResponse,
            obj_id=size_id,
            loader=lambda: self._load_user_schema_from_db(db=db, size_id=size_id),
            ttl=300,  # Cache for 5 minutes
        )

        self._logger.debug(f"Size {size_id} retrieved by user {current_user.id}")
        return size

    async def get_all_sizes(
        self,
        db: AsyncSession,
        *,
        current_user: User,
        skip: int = 0,
        limit: int = 50,
        filters: Optional[Dict[str, Any]] = None,
    ) -> SizeListResponse:
        """
        Lists sizes with pagination and filtering.

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
        sizes, total = await self.size_repository.get_all(
            db=db,
            skip=skip,
            limit=limit,
            filters=filters,
        )

        # Calculate pagination info
        page = (skip // limit) + 1
        total_pages = (total + limit - 1) // limit  # Ceiling division

        # Construct the response schema
        response = SizeListResponse(
            items=sizes, total=total, page=page, pages=total_pages, size=limit
        )

        self._logger.info(
            f"Size list retrieved by {current_user.id}: {len(sizes)} sizes returned"
        )
        return response

    async def create(
        self, db: AsyncSession, *, size_in: SizeCreate, current_user: User
    ) -> Size:
        """
        Handles the business logic of creating a new user.
        """
        self._check_authorization(current_user=current_user, action="Create")

        # 1. Check for conflicts
        existing_size = await self.size_repository.get_by_name(db=db, name=size_in.name)
        raise_for_status(
            condition=(existing_size),
            exception=ResourceAlreadyExists,
            detail=f"Size already exists with {size_in.name}",
            resource_type="Size",
        )

        # 2. Prepare the user model
        size_dict = size_in.model_dump()

        size_to_create = Size(**size_dict)

        # 3. Delegate creation to the repository
        new_size = await self.size_repository.create(db=db, db_obj=size_to_create)
        self._logger.info(f"New size created: {new_size.name}")

        return new_size

    async def update(
        self,
        db: AsyncSession,
        *,
        size_id: uuid.UUID,
        size_data: SizeUpdate,
        current_user: User,
    ) -> Size:
        """Update a size"""

        size_to_update = await self.size_repository.get(db=db, obj_id=size_id)
        raise_for_status(
            condition=(size_to_update is None),
            exception=ResourceNotFound,
            detail=f"Size with id {size_id} not found.",
            resource_type="Size",
        )

        self._check_authorization(current_user=current_user, action="Update")

        await self._validate_size_update(
            db=db, size_data=size_data, existing_size=size_to_update
        )

        update_dict = size_data.model_dump(exclude_unset=True, exclude_none=True)

        updated_size = await self.size_repository.update(
            db=db,
            size=size_to_update,
            fields_to_update=update_dict,
        )

        await cache_service.invalidate(Size, size_id)

        self._logger.info(
            f"Size {size_id} updated by {current_user.id}",
            extra={
                "updated_size_id": size_id,
                "updater_id": current_user.id,
                "updated_fields": list(update_dict.keys()),
            },
        )
        return updated_size

    async def delete(
        self, db: AsyncSession, *, size_id: uuid.UUID, current_user: User
    ) -> Dict[str, str]:
        """Permanently deletes a user account."""

        size_to_delete = await self.size_repository.get(db=db, obj_id=size_id)
        raise_for_status(
            condition=(size_to_delete is None),
            exception=ResourceNotFound,
            detail=f"Size with ID {size_id} not found.",
            resource_type="Size",
        )

        self._check_authorization(current_user=current_user, action="Delete")

        # 3. Perform the deletion
        await self.size_repository.delete(db=db, obj_id=size_id)

        # 4. Clean up cache and tokens
        await cache_service.invalidate(Size, size_id)

        self._logger.warning(
            f"Size {size_id} permanently deleted by {current_user.id}",
            extra={
                "deleted_size_id": size_id,
                "deleter_id": current_user.id,
            },
        )
        return {"message": f"Size '{size_to_delete.name}' deleted successfully"}

    async def _validate_size_update(
        self, db: AsyncSession, size_data: SizeUpdate, existing_size: Size
    ) -> None:
        """Validates size update data for potential conflicts."""

        if size_data.name and size_data.name != existing_size.name:
            if await self.size_repository.get_by_name(db=db, name=size_data.name):
                raise ResourceAlreadyExists("Size is already in use")


size_service = SizeService()
