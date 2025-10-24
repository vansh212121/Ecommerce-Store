import logging
import uuid
from slugify import slugify
from typing import Optional, Dict, Any

from sqlmodel.ext.asyncio.session import AsyncSession
from app.crud.product_attributes.category_crud import category_repository
from app.schemas.category_schema import (
    CategoryCreate,
    CategoryUpdate,
    CategoryResponse,
    CategoryListResponse,
)
from app.models.user_model import User, UserRole
from app.models.product_model import Category
from app.services.cache_service import cache_service
from app.core.exception_utils import raise_for_status
from app.core.exceptions import (
    ResourceNotFound,
    NotAuthorized,
    ValidationError,
    ResourceAlreadyExists,
)

logger = logging.getLogger(__name__)


class CategoryService:
    """Handles all category-related business logic."""

    def __init__(self):
        """
        Initializes the SizeService.
        This version has no arguments, making it easy for FastAPI to use,
        while still allowing for dependency injection during tests.
        """
        self.category_repository = category_repository
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
            detail=f"You are not authorized to {action} this category.",
        )

        # Admins have super powers
        if current_user.is_admin:
            return

    def _generate_slug(self, name: str) -> str:
        """Generates a URL-friendly slug from a name."""
        # Use slugify library for robust slug generation
        # It handles unicode, removes special chars, converts to lowercase, replaces spaces with hyphens
        slug = slugify(
            name, max_length=250
        )  # Use max_length slightly less than DB column
        if not slug:  # Handle cases where name results in empty slug (e.g., name="---")
            slug = uuid.uuid4().hex[:8]  # Fallback to a short random slug
        return slug

    async def _load_category_schema_from_db(
        self, *, db: AsyncSession, category_id: uuid.UUID
    ) -> Optional[CategoryResponse]:
        """Private helper to load a size from the DB and convert it to a Pydantic schema.
        This is our "loader" function for the cache."""

        category_model = await self.category_repository.get(db=db, obj_id=category_id)
        raise_for_status(
            condition=category_model is None,
            exception=ResourceNotFound,
            detail=f"Category with ID {category_id} not Found.",
            resource_type="Category",
        )
        return CategoryResponse.model_validate(category_model)

    async def get_category_by_id(
        self, db: AsyncSession, *, category_id: uuid.UUID, current_user: User
    ) -> Optional[CategoryResponse]:
        """Retrieve category by it's ID"""

        self._check_authorization(
            current_user=current_user,
            action="Fetch",
        )

        category = await cache_service.get_or_set(
            schema_type=CategoryResponse,
            obj_id=category_id,
            loader=lambda: self._load_category_schema_from_db(
                db=db, category_id=category_id
            ),
            ttl=300,  # Cache for 5 minutes
        )

        self._logger.debug(
            f"Category {category_id} retrieved by user {current_user.id}"
        )
        return category

    async def get_all_categories(
        self,
        db: AsyncSession,
        *,
        current_user: User,
        skip: int = 0,
        limit: int = 50,
        filters: Optional[Dict[str, Any]] = None,
    ) -> CategoryListResponse:
        """
        Lists categories with pagination and filtering.

        Args:
            db: Database session
            current_user: User making the request
            skip: Number of records to skip
            limit: Maximum number of records to return
            filters: Optional filters to apply
        Returns:
            CategoryListResponse: Paginated list of users

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
        categories, total = await self.category_repository.get_all(
            db=db,
            skip=skip,
            limit=limit,
            filters=filters,
        )

        # Calculate pagination info
        page = (skip // limit) + 1
        total_pages = (total + limit - 1) // limit  # Ceiling division

        # Construct the response schema
        response = CategoryListResponse(
            items=categories, total=total, page=page, pages=total_pages, size=limit
        )

        self._logger.info(
            f"Category list retrieved by {current_user.id}: {len(categories)} categories returned"
        )
        return response

    async def create(
        self, db: AsyncSession, *, category_in: CategoryCreate, current_user: User
    ) -> Category:
        """
        Handles the business logic of creating a new user.
        """
        self._check_authorization(current_user=current_user, action="Create")

        # 1. Check for conflicts
        existing_category = await self.category_repository.get_by_name(
            db=db, name=category_in.name
        )
        raise_for_status(
            condition=(existing_category),
            exception=ResourceAlreadyExists,
            detail=f"Category already exists with {category_in.name}",
            resource_type="Category",
        )

        generated_slug = self._generate_slug(category_in.name)

        existing_category_slug = await self.category_repository.get_by_slug(
            db=db, slug=generated_slug
        )
        raise_for_status(
            condition=existing_category_slug,
            exception=ResourceAlreadyExists,
            detail=f"A category resulting in the slug '{generated_slug}' already exists.",
            resource_type="Category",
        )

        # 2. Prepare the user model
        category_dict = category_in.model_dump()
        category_dict["slug"] = generated_slug

        category_to_create = Category(**category_dict)

        # 3. Delegate creation to the repository
        new_category = await self.category_repository.create(
            db=db, db_obj=category_to_create
        )
        self._logger.info(f"New category created: {new_category.name}")

        return new_category

    async def update(
        self,
        db: AsyncSession,
        *,
        category_id: uuid.UUID,
        category_data: CategoryUpdate,
        current_user: User,
    ) -> Category:
        """Update a category"""

        category_to_update = await self.category_repository.get(
            db=db, obj_id=category_id
        )
        raise_for_status(
            condition=(category_to_update is None),
            exception=ResourceNotFound,
            detail=f"Category with id {category_id} not found.",
            resource_type="Category",
        )

        self._check_authorization(current_user=current_user, action="Update")

        update_dict = category_data.model_dump(exclude_unset=True, exclude_none=True)
        new_slug = None

        # Check if name is being updated
        if (
            update_dict.get("name")
            and update_dict["name"].strip() != category_to_update.name
        ):
            new_name = update_dict["name"].strip()
            # Generate new slug from the new name
            new_slug = self._generate_slug(new_name)
            update_dict["slug"] = new_slug  # Add slug to update dict

            # Validate the *new* name and *new* slug for conflicts
            await self._validate_category_update(
                db=db,
                new_name=new_name,
                new_slug=new_slug,
                existing_category=category_to_update,
            )
        else:
            # If name isn't changing, no need to validate or update slug
            update_dict.pop(
                "name", None
            )  # Remove name if it wasn't actually changed after stripping
            await self._validate_category_update(  # Still call validate in case other fields need checks later
                db=db,
                new_name=None,
                new_slug=None,
                existing_category=category_to_update,
            )

        updated_category = await self.category_repository.update(
            db=db,
            category=category_to_update,
            fields_to_update=update_dict,
        )

        await cache_service.invalidate(Category, category_id)

        self._logger.info(
            f"Category {category_id} updated by {current_user.id}",
            extra={
                "updated_category_id": category_id,
                "updater_id": current_user.id,
                "updated_fields": list(update_dict.keys()),
            },
        )
        return updated_category

    async def delete(
        self, db: AsyncSession, *, category_id: uuid.UUID, current_user: User
    ) -> Dict[str, str]:
        """Permanently deletes a user account."""

        category_to_delete = await self.category_repository.get(
            db=db, obj_id=category_id
        )
        raise_for_status(
            condition=(category_to_delete is None),
            exception=ResourceNotFound,
            detail=f"Category with ID {category_id} not found.",
            resource_type="Category",
        )

        self._check_authorization(current_user=current_user, action="Delete")

        # 3. Perform the deletion
        await self.category_repository.delete(db=db, obj_id=category_id)

        # 4. Clean up cache and tokens
        await cache_service.invalidate(Category, category_id)

        self._logger.warning(
            f"Category {category_id} permanently deleted by {current_user.id}",
            extra={
                "deleted_category_id": category_id,
                "deleter_id": current_user.id,
            },
        )
        return {"message": f"Category '{category_to_delete.name}' deleted successfully"}

    async def _validate_category_update(
        self,
        db: AsyncSession,
        existing_category: Category,
        *,
        new_name: Optional[str] = None,  # Pass new name/slug explicitly
        new_slug: Optional[str] = None,
    ) -> None:
        """Validates category update data for potential conflicts (name and slug)."""

        if new_name:  # Only check name if it's actually changing
            conflicting_name = await self.category_repository.get_by_name(
                db=db, name=new_name
            )
            if conflicting_name and conflicting_name.id != existing_category.id:
                raise ResourceAlreadyExists(
                    f"A category with the name '{new_name}' already exists."
                )

        if new_slug:  # Only check slug if it's actually changing
            conflicting_slug = await self.category_repository.get_by_slug(
                db=db, slug=new_slug
            )
            if conflicting_slug and conflicting_slug.id != existing_category.id:
                raise ResourceAlreadyExists(
                    f"A category resulting in the slug '{new_slug}' already exists."
                )


category_service = CategoryService()
