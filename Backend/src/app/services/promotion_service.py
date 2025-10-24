import logging
from typing import Optional, Dict, Any
import uuid

from sqlmodel.ext.asyncio.session import AsyncSession
from app.crud.promotion_crud import promotion_repository
from app.schemas.promotion_schema import (
    PromotionCreate,
    PromotionUpdate,
    PromotionResponse,
    PromotionListResponse,
)
from app.models.user_model import User, UserRole
from app.models.promotion_model import Promotion, PromotionStatus
from app.services.cache_service import cache_service
from app.core.exception_utils import raise_for_status
from app.core.exceptions import (
    ResourceNotFound,
    NotAuthorized,
    ValidationError,
    ResourceAlreadyExists,
)

logger = logging.getLogger(__name__)


class PromotionService:
    """Handles all promotion-related business logic."""

    def __init__(self):
        """
        Initializes the PromotionService.
        This version has no arguments, making it easy for FastAPI to use,
        while still allowing for dependency injection during tests.
        """
        self.promotion_repository = promotion_repository
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
            detail=f"You are not authorized to {action} this promotion.",
        )

        # Admins have super powers
        if current_user.is_admin:
            return

    async def _load_user_schema_from_db(
        self, *, db: AsyncSession, promotion_id: uuid.UUID
    ) -> Optional[PromotionResponse]:
        """Private helper to load a size from the DB and convert it to a Pydantic schema.
        This is our "loader" function for the cache."""

        promotion_model = await self.promotion_repository.get(
            db=db, obj_id=promotion_id
        )
        raise_for_status(
            condition=promotion_model is None,
            exception=ResourceNotFound,
            detail=f"Promotion with ID {promotion_id} not Found.",
            resource_type="Promotion",
        )
        return PromotionResponse.model_validate(promotion_model)

    async def get_promotion_by_id(
        self, db: AsyncSession, *, promotion_id: uuid.UUID, current_user: User
    ) -> Optional[PromotionResponse]:
        """Retrieve promotion by it's ID"""

        self._check_authorization(
            current_user=current_user,
            action="Fetch",
        )

        size = await cache_service.get_or_set(
            schema_type=PromotionResponse,
            obj_id=promotion_id,
            loader=lambda: self._load_user_schema_from_db(
                db=db, promotion_id=promotion_id
            ),
            ttl=300,  # Cache for 5 minutes
        )

        self._logger.debug(
            f"Promotion {promotion_id} retrieved by user {current_user.id}"
        )
        return size

    async def get_all_promotions(
        self,
        db: AsyncSession,
        *,
        current_user: User,
        skip: int = 0,
        limit: int = 50,
        filters: Optional[Dict[str, Any]] = None,
        order_by: str = "created_at",
        order_desc: bool = True,
    ) -> PromotionListResponse:
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
        promotions, total = await self.promotion_repository.get_all(
            db=db,
            skip=skip,
            limit=limit,
            filters=filters,
            order_by=order_by,
            order_desc=order_desc,
        )

        # Calculate pagination info
        page = (skip // limit) + 1
        total_pages = (total + limit - 1) // limit  # Ceiling division

        # Construct the response schema
        response = PromotionListResponse(
            items=promotions, total=total, page=page, pages=total_pages, size=limit
        )

        self._logger.info(
            f"Promotion list retrieved by {current_user.id}: {len(promotions)} promotions returned"
        )
        return response

    async def create(
        self, db: AsyncSession, *, promotion_in: PromotionCreate, current_user: User
    ) -> Promotion:
        """
        Handles the business logic of creating a new promotion.
        """
        self._check_authorization(current_user=current_user, action="Create")

        # 1. Check for conflicts
        existing_promotion = await self.promotion_repository.get_by_code(
            db=db, code=promotion_in.code
        )
        raise_for_status(
            condition=(existing_promotion),
            exception=ResourceAlreadyExists,
            detail=f"Promotion already exists with {promotion_in.code}",
            resource_type="Promotion",
        )

        # 2. Prepare the promotion model
        promotion_dict = promotion_in.model_dump()

        promotion_to_create = Promotion(**promotion_dict)

        # 3. Delegate creation to the repository
        new_promotion = await self.promotion_repository.create(
            db=db, db_obj=promotion_to_create
        )
        self._logger.info(f"New promotion created: {new_promotion.code}")

        return new_promotion

    async def update(
        self,
        db: AsyncSession,
        *,
        promotion_id: uuid.UUID,
        promotion_data: PromotionUpdate,
        current_user: User,
    ) -> Promotion:
        """Update a promotion"""

        promotion_to_update = await self.promotion_repository.get(
            db=db, obj_id=promotion_id
        )
        raise_for_status(
            condition=(promotion_to_update is None),
            exception=ResourceNotFound,
            detail=f"Promotion with id {promotion_id} not found.",
            resource_type="Promotion",
        )

        self._check_authorization(current_user=current_user, action="Update")

        await self._validate_promotion_update(
            db=db, promotion_data=promotion_data, existing_promotion=promotion_to_update
        )

        update_dict = promotion_data.model_dump(exclude_unset=True, exclude_none=True)

        updated_promotion = await self.promotion_repository.update(
            db=db,
            promotion=promotion_to_update,
            fields_to_update=update_dict,
        )

        await cache_service.invalidate(Promotion, promotion_id)

        self._logger.info(
            f"Promotion {promotion_id} updated by {current_user.id}",
            extra={
                "updated_promotion_id": promotion_id,
                "updater_id": current_user.id,
                "updated_fields": list(update_dict.keys()),
            },
        )
        return updated_promotion

    async def activate(
        self, db: AsyncSession, *, promotion_id: uuid.UUID, current_user: User
    ) -> Promotion:
        """Activates a promotion's account. (Admin only)"""

        self._check_authorization(current_user=current_user, action="activate")

        promotion_to_activate = await self.promotion_repository.get(
            db=db, obj_id=promotion_id
        )
        raise_for_status(
            condition=(promotion_to_activate is None),
            exception=ResourceNotFound,
            detail=f"Promotion with id {promotion_id} not found.",
            resource_type="Promotion",
        )

        raise_for_status(
            condition=(promotion_to_activate.status == PromotionStatus.ACTIVE),
            exception=ValidationError,  # Or a more specific BadRequestException
            detail="Promotion is already active.",
        )

        activated_promotoin = await self.promotion_repository.update(
            db=db,
            promotion=promotion_to_activate,
            fields_to_update={"status": PromotionStatus.ACTIVE},
        )

        await cache_service.invalidate(Promotion, promotion_id)
        self._logger.info(f"Promotion {promotion_id} activated by {current_user.id}")
        return activated_promotoin

    async def deactivate(
        self, db: AsyncSession, *, promotion_id: uuid.UUID, current_user: User
    ) -> Promotion:
        """Deactivates a promotion's account. (Admin only)"""

        self._check_authorization(current_user=current_user, action="deactivate")

        promotion_to_deactivate = await self.promotion_repository.get(
            db=db, obj_id=promotion_id
        )
        raise_for_status(
            condition=(promotion_to_deactivate is None),
            exception=ResourceNotFound,
            detail=f"Promotion with id {promotion_id} not found.",
            resource_type="Promotion",
        )

        raise_for_status(
            condition=(promotion_to_deactivate.status == PromotionStatus.INACTIVE),
            exception=ValidationError,  # Or a more specific BadRequestException
            detail="Promotion is already inactive.",
        )

        deactivated_promotoin = await self.promotion_repository.update(
            db=db,
            promotion=promotion_to_deactivate,
            fields_to_update={"status": PromotionStatus.INACTIVE},
        )

        await cache_service.invalidate(Promotion, promotion_id)
        self._logger.info(f"Promotion {promotion_id} activated by {current_user.id}")
        return deactivated_promotoin

    async def delete(
        self, db: AsyncSession, *, promotion_id: uuid.UUID, current_user: User
    ) -> Dict[str, str]:
        """Permanently deletes a promotion account."""

        promotion_to_delete = await self.promotion_repository.get(
            db=db, obj_id=promotion_id
        )
        raise_for_status(
            condition=(promotion_to_delete is None),
            exception=ResourceNotFound,
            detail=f"Promotion with ID {promotion_id} not found.",
            resource_type="Promotion",
        )

        self._check_authorization(current_user=current_user, action="Delete")

        # 3. Perform the deletion
        await self.promotion_repository.delete(db=db, obj_id=promotion_id)

        # 4. Clean up cache and tokens
        await cache_service.invalidate(Promotion, promotion_id)

        self._logger.warning(
            f"Promotion {promotion_id} permanently deleted by {current_user.id}",
            extra={
                "deleted_promotion_id": promotion_id,
                "deleter_id": current_user.id,
            },
        )
        return {
            "message": f"Promotion '{promotion_to_delete.code}' deleted successfully"
        }

    async def _validate_promotion_update(
        self,
        db: AsyncSession,
        promotion_data: PromotionUpdate,
        existing_promotion: Promotion,
    ) -> None:
        """Validates promotion update data for potential conflicts."""

        if (
            promotion_data.code
            and promotion_data.code.strip().upper() != existing_promotion.code
        ):

            conflicting_promo = await self.promotion_repository.get_by_code(
                db=db, code=promotion_data.code
            )
            if conflicting_promo and conflicting_promo.id != existing_promotion.id:
                raise ResourceAlreadyExists(
                    f"A promotion with the code '{promotion_data.code}' already exists."
                )


promotion_service = PromotionService()
