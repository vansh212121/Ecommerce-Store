# app/services/product_service.py
"""
Product service module.

This module provides the business logic layer for product operations,
handling authorization, validation, and orchestrating repository calls.
"""
import logging
from typing import Optional, Dict, Any
import uuid

from sqlmodel.ext.asyncio.session import AsyncSession
from datetime import datetime, timezone
from app.crud.product_crud import product_repository
from app.schemas.product_schema import (
    ProductCreate,
    ProductUpdate,
    ProductResponse,
    ProductListResponse,
    ProductImageCreate,
    ProductVariantCreate,
    ProductVariantUpdate,
    ProductVariantResponse,
    ProductVariantListResponse,
)
from app.models.user_model import User, UserRole
from app.models.product_model import (
    Product,
    ProductVariant,
    ProductImage,
    ProductStatus,
)
from app.services.cache_service import cache_service
from app.core.exception_utils import raise_for_status
from app.core.exceptions import (
    ResourceNotFound,
    NotAuthorized,
    ValidationError,
    ResourceAlreadyExists,
    InternalServerError,
)

logger = logging.getLogger(__name__)


class ProductService:
    """Handles all product-related business logic."""

    def __init__(self):
        """
        Initializes the ProductService.
        This version has no arguments, making it easy for FastAPI to use,
        while still allowing for dependency injection during tests.
        """
        self.product_repository = product_repository
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
            detail=f"You are not authorized to {action} this product.",
        )

        # Admins have super powers
        if current_user.is_admin:
            return

    # ==========PRODUCT OPERATIONS====================
    async def _load_product_schema_from_db(
        self, *, db: AsyncSession, product_id: uuid.UUID
    ) -> Optional[ProductResponse]:
        """Private helper to load a size from the DB and convert it to a Pydantic schema.
        This is our "loader" function for the cache."""

        product_model = await self.product_repository.get(db=db, obj_id=product_id)
        raise_for_status(
            condition=product_model is None,
            exception=ResourceNotFound,
            detail=f"Product with ID {product_id} not Found.",
            resource_type="Product",
        )
        return ProductResponse.model_validate(product_model)

    async def get_product_by_id(
        self, db: AsyncSession, *, product_id: uuid.UUID, current_user: User
    ) -> Optional[ProductResponse]:
        """Retrieve product by it's ID"""

        self._check_authorization(
            current_user=current_user,
            action="Fetch",
        )

        product = await cache_service.get_or_set(
            schema_type=ProductResponse,
            obj_id=product_id,
            loader=lambda: self._load_product_schema_from_db(
                db=db, product_id=product_id
            ),
            ttl=300,  # Cache for 5 minutes
        )

        self._logger.debug(f"Product {product_id} retrieved by user {current_user.id}")
        return product

    async def get_all_products(
        self,
        db: AsyncSession,
        *,
        current_user: User,
        skip: int = 0,
        limit: int = 50,
        filters: Optional[Dict[str, Any]] = None,
        order_by: str = "created_at",
        order_desc: bool = True,
    ) -> ProductListResponse:
        """Lists users with pagination and filtering."""

        self._check_authorization(current_user=current_user, action="List")

        # Input validation
        if skip < 0:
            raise ValidationError("Skip parameter must be non-negative")
        if limit <= 0 or limit > 100:
            raise ValidationError("Limit must be between 1 and 100")

        # Delegate fetching to the repository
        products, total = await self.product_repository.get_all(
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
        response = ProductListResponse(
            items=products, total=total, page=page, pages=total_pages, size=limit
        )

        self._logger.info(
            f"Product list retrieved by {current_user.id}: {len(products)} products returned"
        )
        return response

    async def create_product(
        self, db: AsyncSession, *, product_data: ProductCreate, current_user: User
    ) -> Product:

        self._check_authorization(current_user=current_user, action="Create")

        existing_product = await self.product_repository.get_by_name(
            db=db, name=product_data.name
        )
        raise_for_status(
            condition=(existing_product),
            exception=ResourceAlreadyExists,
            detail=f"Product with name {product_data.name} already exists.",
            resource_type="Product",
        )

        product_dict = product_data.model_dump(exclude={"variants", "images"})
        product_dict["created_at"] = datetime.now(timezone.utc)
        product_dict["updated_at"] = datetime.now(timezone.utc)
        variants_data = product_data.variants
        images_data = product_data.images

        product_to_create = Product(**product_dict)

        try:
            # 4. Add parent product to session, flush to get ID
            db.add(product_to_create)
            await db.flush()
            await db.refresh(product_to_create)

            product_id = product_to_create.id

            # 5. Create and add Product Images
            for image_in in images_data:
                image_obj = ProductImage(**image_in.model_dump(), product_id=product_id)
                db.add(image_obj)

            # 6. Create and add Product Variants (with conflict checks)
            for variant_in in variants_data:
                existing_sku = await self.product_repository.get_by_sku(
                    db=db, sku=variant_in.sku
                )
                raise_for_status(
                    condition=existing_sku is not None,
                    exception=ResourceAlreadyExists,
                    detail=f"Variant SKU '{variant_in.sku}' already exists.",
                    resource_type="ProductVariant",
                )

                existing_combo = (
                    await self.product_repository.get_by_product_size_color(
                        db=db,
                        product_id=product_id,
                        size_id=variant_in.size_id,
                        color_id=variant_in.color_id,
                    )
                )
                raise_for_status(
                    condition=existing_combo is not None,
                    exception=ResourceAlreadyExists,
                    detail="Variant with this Size and Color already exists.",
                    resource_type="ProductVariant",
                )
                variant_dict = variant_in.model_dump()
                variant_dict["product_id"] = product_id
                variant_obj = ProductVariant(
                    **variant_in.model_dump(), product_id=product_id
                )
                db.add(variant_obj)

            # 7. Commit the whole transaction
            await db.commit()

            # 8. Refresh the parent to load relations
            await db.refresh(product_to_create)

            self._logger.info(
                f"New product created: {product_to_create.name} (ID: {product_to_create.id})"
            )
            return product_to_create

        except Exception as e:
            await db.rollback()  # Rollback on failure
            self._logger.error(f"Failed to create product: {e}", exc_info=True)
            if isinstance(e, ResourceAlreadyExists):
                raise e
            raise InternalServerError(detail=f"Failed to create product: {str(e)}")

    async def update_product(
        self,
        db: AsyncSession,
        *,
        product_id: uuid.UUID,
        product_data: ProductUpdate,
        current_user: User,
    ) -> Product:
        """update  a product"""

        product_to_update = await self.product_repository.get(db=db, obj_id=product_id)
        raise_for_status(
            condition=(product_to_update is None),
            exception=ResourceNotFound,
            detail=f"Product with id {product_id} not found.",
            resource_type="Product",
        )

        self._check_authorization(current_user=current_user, action="Update")

        await self._validate_product_update(
            db=db, product_data=product_data, existing_product=product_to_update
        )

        update_dict = product_data.model_dump(exclude_unset=True, exclude_none=True)

        # Remove timestamp fields that should not be manually updated
        for ts_field in {"created_at", "updated_at"}:
            update_dict.pop(ts_field, None)

        updated_product = await self.product_repository.update(
            db=db, product=product_to_update, fields_to_update=update_dict
        )

        await cache_service.invalidate(Product, product_id)

        self._logger.info(
            f"Product {product_id} updated by {current_user.id}",
            extra={
                "updated_product_id": product_id,
                "updater_id": current_user.id,
                "updated_fields": list(update_dict.keys()),
            },
        )
        return updated_product

    async def soft_delete_product(
        self, db: AsyncSession, *, product_id: uuid.UUID, current_user: User
    ) -> Dict[str, str]:

        product_to_delete = await self.product_repository.get(db=db, obj_id=product_id)
        raise_for_status(
            condition=(product_to_delete is None),
            exception=ResourceNotFound,
            detail=f"Product with id {product_id} not found.",
            resource_type="Product",
        )

        self._check_authorization(current_user=current_user, action="Delete")

        raise_for_status(
            condition=(product_to_delete.status == ProductStatus.INACTIVE),
            exception=ValidationError,
            detail=f"Product is already inactive",
        )

        await self.product_repository.update(
            db=db,
            fields_to_update={"status": ProductStatus.INACTIVE},
            product=product_to_delete,
        )

        await cache_service.invalidate(Product, product_id)

        self._logger.warning(
            f"Product {product_id} soft deleted by {current_user.id}",
            extra={
                "deleted_product_id": product_id,
                "deleter_id": current_user.id,
                "deleted_product_name": product_to_delete.name,
            },
        )

        return {"message": "Product deactivated succesfully"}

    async def delete_product(
        self, db: AsyncSession, *, product_id: uuid.UUID, current_user: User
    ) -> Dict[str, str]:

        product_to_delete = await self.product_repository.get(db=db, obj_id=product_id)
        raise_for_status(
            condition=(product_to_delete is None),
            exception=ResourceNotFound,
            detail=f"Product with id {product_id} not found.",
            resource_type="Product",
        )

        self._check_authorization(current_user=current_user, action="Delete")

        await self.product_repository.delete(db=db, obj_id=product_id)

        await cache_service.invalidate(Product, product_id)

        self._logger.warning(
            f"Product {product_id} permanently deleted by {current_user.id}",
            extra={
                "deleted_product_id": product_id,
                "deleter_id": current_user.id,
                "deleted_product_name": product_to_delete.name,
            },
        )

        return {"message": "Product deleted succesfully"}

    async def _validate_product_update(
        self, db: AsyncSession, product_data: ProductUpdate, existing_product: Product
    ) -> None:
        if product_data.name and product_data.name.strip() != existing_product.name:
            # --- FIX: Check for self-conflict ---
            conflicting_product = await self.product_repository.get_by_name(
                db=db, name=product_data.name
            )
            if conflicting_product and conflicting_product.id != existing_product.id:
                raise ResourceAlreadyExists(
                    f"A product with the name '{product_data.name}' already exists."
                )

    # ==========PRODUCT IMAGE OPERATIONS====================
    async def get_image_by_id(
        self, db: AsyncSession, *, current_user: User, image_id: uuid.UUID
    ) -> Optional[ProductImage]:
        """get an image by its ID"""

        product_image = await self.product_repository.get_image(
            db=db, image_id=image_id
        )
        raise_for_status(
            condition=(product_image is None),
            exception=ResourceNotFound,
            detail=f"Image with id {image_id} not found.",
            resource_type="ProductImage",
        )

        self._check_authorization(current_user=current_user, action="Fetch")

        return product_image

    async def add_image_to_product(
        self,
        db: AsyncSession,
        *,
        image_data: ProductImageCreate,
        product_id: uuid.UUID,
        current_user: User,
    ) -> ProductImage:
        """create an image"""

        self._check_authorization(current_user=current_user, action="Create")

        await self.get_product_by_id(db=db, current_user=current_user, product_id=product_id)

        image_dict = image_data.model_dump()
        image_dict["product_id"] = product_id

        image_to_create = ProductImage(**image_dict)

        new_image = await self.product_repository.create_image(
            db=db, image=image_to_create
        )
        self._logger.info(f"New product_image created: {new_image.url}")

        await cache_service.invalidate(Product, product_id)

        return new_image

    async def delete_image(
        self, db: AsyncSession, *, current_user: User, image_id: uuid.UUID
    ) -> Dict[str, str]:
        """delete an image by it's ID"""

        self._check_authorization(current_user=current_user, action="Delete")

        image_to_delete = await self.get_image_by_id(
            db=db, current_user=current_user, image_id=image_id
        )

        product_id = image_to_delete.product_id

        await self.product_repository.delete_image(db=db, image_id=image_id)

        await cache_service.invalidate(Product, product_id)

        self._logger.warning(
            f"ProductImage {image_id} permanently deleted by {current_user.id}",
            extra={
                "deleted_image_id": image_id,
                "deleter_id": current_user.id,
            },
        )

        return {"message": "Image deleted successfully"}

    # ==========PRODUCT IMAGE OPERATIONS====================
    async def _load_product_variant_schema_from_db(
        self, *, db: AsyncSession, product_variant_id: uuid.UUID
    ) -> Optional[ProductVariantResponse]:
        """Private helper to load a size from the DB and convert it to a Pydantic schema.
        This is our "loader" function for the cache."""

        product_variant_model = await self.product_repository.get_variant(
            db=db, variant_id=product_variant_id
        )
        raise_for_status(
            condition=product_variant_model is None,
            exception=ResourceNotFound,
            detail=f"ProductVariant with ID {product_variant_id} not Found.",
            resource_type="ProductVariant",
        )
        return ProductVariantResponse.model_validate(product_variant_model)

    async def get_product_variant_by_id(
        self, db: AsyncSession, *, product_variant_id: uuid.UUID, current_user: User
    ) -> Optional[ProductVariantResponse]:
        """Retrieve product_variant by it's ID"""

        self._check_authorization(
            current_user=current_user,
            action="Fetch",
        )

        variant = await cache_service.get_or_set(
            schema_type=ProductVariantResponse,
            obj_id=product_variant_id,
            loader=lambda: self._load_product_variant_schema_from_db(
                db=db, product_variant_id=product_variant_id
            ),
            ttl=300,  # Cache for 5 minutes
        )

        self._logger.debug(
            f"ProductVariant {product_variant_id} retrieved by user {current_user.id}"
        )
        return variant

    async def get_all_variants(
        self,
        db: AsyncSession,
        current_user: User,
        product_id: uuid.UUID,
        skip: int = 0,
        limit: int = 50,
        filters: Optional[Dict[str, Any]] = None,
    ) -> ProductVariantListResponse:

        self._check_authorization(current_user=current_user, action="List")

        # Input validation
        if skip < 0:
            raise ValidationError("Skip parameter must be non-negative")
        if limit <= 0 or limit > 100:
            raise ValidationError("Limit must be between 1 and 100")

        # Delegate fetching to the repository
        variants, total = await self.product_repository.get_all_variants(
            db=db,
            skip=skip,
            limit=limit,
            product_id=product_id,
            filters=filters,
        )

        # Calculate pagination info
        page = (skip // limit) + 1
        total_pages = (total + limit - 1) // limit  # Ceiling division

        # Construct the response schema
        response = ProductVariantListResponse(
            items=variants, total=total, page=page, pages=total_pages, size=limit
        )

        self._logger.info(
            f"ProductVariants list retrieved by {current_user.id}: {len(variants)} variants returned"
        )
        return response

    async def add_variant_to_product(
        self,
        db: AsyncSession,
        *,
        product_id: uuid.UUID,
        current_user: User,
        variant_data: ProductVariantCreate,
    ) -> ProductVariant:
        """create a variant for a product"""

        self._check_authorization(current_user=current_user, action="Create")

        await self.get_product_by_id(
            db=db, current_user=current_user, product_id=product_id
        )

        existing_sku = await self.product_repository.get_by_sku(
            db=db, sku=variant_data.sku
        )
        raise_for_status(
            condition=(existing_sku is not None),  # <-- FIX: Check not None
            exception=ResourceAlreadyExists,
            detail=f"Variant already exists with SKU {variant_data.sku}",
            resource_type="ProductVariant",  # <-- FIX: Typo
        )

        existing_combo = await self.product_repository.get_by_product_size_color(
            db=db,
            product_id=product_id,
            size_id=variant_data.size_id,
            color_id=variant_data.color_id,
        )
        raise_for_status(
            condition=existing_combo is not None,
            exception=ResourceAlreadyExists,
            detail="Variant with this Size and Color already exists for this product.",
            resource_type="ProductVariant",
        )

        variant_dict = variant_data.model_dump()
        variant_dict["product_id"] = product_id

        variant_to_create = ProductVariant(**variant_dict)

        new_variant = await self.product_repository.create_variant(
            db=db, variant=variant_to_create
        )
        self._logger.info(f"New product_variant created: {new_variant.sku}")

        await cache_service.invalidate(Product, product_id)

        return new_variant

    async def update_variant(
        self,
        db: AsyncSession,
        *,
        product_id: uuid.UUID,
        variant_id: uuid.UUID,
        variant_data: ProductVariantUpdate,
        current_user: User,
    ) -> ProductVariant:
        """Update a variant"""

        self._check_authorization(current_user=current_user, action="Update")

        product = await self.get_product_by_id(
            db=db, product_id=product_id, current_user=current_user
        )

        variant_to_update = await self.product_repository.get_variant(
            db=db, variant_id=variant_id
        )
        raise_for_status(
            condition=(variant_to_update is None),
            exception=ResourceNotFound,
            detail=f"Variant with id {variant_id} not found.",
            resource_type="ProductVariant",
        )

        if variant_to_update.product_id != product.id:
            raise NotAuthorized(
                detail="This variant does not belong to the specified product."
            )

        await self._validate_product_variant_update(
            db=db, variant_data=variant_data, existing_variant=variant_to_update
        )

        update_dict = variant_data.model_dump(exclude_unset=True, exclude_none=True)

        updated_product_variant = await self.product_repository.update_variant(
            db=db, variant=variant_to_update, fields_to_update=update_dict
        )

        await cache_service.invalidate(ProductVariant, variant_id)
        await cache_service.invalidate(Product, product_id)

        self._logger.info(
            f"ProductVariant {variant_id} updated by {current_user.id}",
            extra={
                "updated_product_variant_id": variant_id,
                "updater_id": current_user.id,
                "updated_fields": list(update_dict.keys()),
            },
        )
        return updated_product_variant

    async def delete_variant(
        self,
        db: AsyncSession,
        *,
        product_id: uuid.UUID,
        variant_id: uuid.UUID,
        current_user: User,
    ) -> Dict[str, str]:
        """delete a variant"""

        self._check_authorization(current_user=current_user, action="Delete")

        product = await self.get_product_by_id(
            db=db, current_user=current_user, product_id=product_id
        )

        variant_to_delete = await self.product_repository.get_variant(
            db=db, variant_id=variant_id
        )
        raise_for_status(
            condition=(variant_to_delete is None),
            exception=ResourceNotFound,
            detail=f"Variant with id {variant_id} not found.",
            resource_type="ProductVariant",
        )

        if variant_to_delete.product_id != product.id:
            raise NotAuthorized(
                detail="This variant does not belong to the specified product."
            )

        await self.product_repository.delete_variant(db=db, variant_id=variant_id)

        await cache_service.invalidate(ProductVariant, variant_id)
        await cache_service.invalidate(Product, product_id)

        self._logger.warning(
            f"ProductVariant {variant_id} permanently deleted by {current_user.id}",
            extra={
                "deleted_product_variant_id": variant_id,
                "deleter_id": current_user.id,
            },
        )

        return {"message": "Product Variant deleted succesfully"}

    async def _validate_product_variant_update(
        self,
        db: AsyncSession,
        variant_data: ProductVariantUpdate,
        existing_variant: ProductVariant,
    ) -> None:
        """Validates product update data for potential conflicts."""

        if variant_data.sku and variant_data.sku.strip() != existing_variant.sku:
            # --- FIX: Check for self-conflict ---
            conflicting_sku = await self.product_repository.get_by_sku(
                db=db, sku=variant_data.sku
            )
            if conflicting_sku and conflicting_sku.id != existing_variant.id:
                raise ResourceAlreadyExists(
                    f"A variant with SKU '{variant_data.sku}' already exists."
                )

        # --- FIX: Add combo uniqueness check ---
        new_size_id = variant_data.size_id or existing_variant.size_id
        new_color_id = variant_data.color_id or existing_variant.color_id

        if (
            new_size_id != existing_variant.size_id
            or new_color_id != existing_variant.color_id
        ):

            conflicting_combo = await self.product_repository.get_by_product_size_color(
                db=db,
                product_id=existing_variant.product_id,
                size_id=new_size_id,
                color_id=new_color_id,
            )
            if conflicting_combo and conflicting_combo.id != existing_variant.id:
                raise ResourceAlreadyExists(
                    "A variant with this Size and Color combination already exists for this product."
                )


product_service = ProductService()
