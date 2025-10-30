import logging
import uuid
from typing import Optional, List, Dict, Any, TypeVar, Generic, Tuple
from abc import ABC, abstractmethod
from datetime import datetime, timezone

from sqlmodel.ext.asyncio.session import AsyncSession
from sqlalchemy.orm import selectinload
from sqlmodel import select, func, and_, or_, delete

from app.core.exception_utils import handle_exceptions
from app.core.exceptions import InternalServerError

from app.models.product_model import Product, ProductImage, ProductVariant

logger = logging.getLogger(__name__)

T = TypeVar("T")


class BaseRepository(ABC, Generic[T]):
    """Abstract base repository providing consistent interface for database operations."""

    def __init__(self, model: type[T]):
        self.model = model

    @abstractmethod
    async def get(self, db: AsyncSession, *, obj_id: Any) -> Optional[T]:
        """Get entity by its primary key."""
        pass

    @abstractmethod
    async def create(self, db: AsyncSession, *, obj_in: Any) -> T:
        """Create a new entity."""
        pass

    @abstractmethod
    async def update(self, db: AsyncSession, *, db_obj: T, obj_in: Any) -> T:
        """Update an existing entity."""
        pass

    @abstractmethod
    async def delete(self, db: AsyncSession, *, obj_id: Any) -> None:
        """Delete an entity by its primary key."""


class ProductRepository(BaseRepository[Product]):
    """Repository for all database operations related to the Product model."""

    def __init__(self):
        super().__init__(Product)
        self._logger = logging.getLogger(f"{__name__}.{self.__class__.__name__}")

    @handle_exceptions(
        default_exception=InternalServerError,
        message="An unexpected database error occurred.",
    )
    async def get(self, db: AsyncSession, *, obj_id: uuid.UUID) -> Optional[Product]:
        """get a product by it's ID"""

        statement = (
            select(self.model)
            .where(self.model.id == obj_id)
            .options(
                selectinload(self.model.images),
                selectinload(self.model.category),
                selectinload(self.model.variants).options(
                    selectinload(ProductVariant.size),
                    selectinload(ProductVariant.color),
                ),
            )
        )
        result = await db.execute(statement)
        return result.scalar_one_or_none()

    @handle_exceptions(
        default_exception=InternalServerError,
        message="An unexpected database error occurred.",
    )
    async def get_by_name(self, db: AsyncSession, *, name: str) -> Optional[Product]:
        """Get a product by it's Name"""

        statement = select(self.model).where(self.model.name == name)
        result = await db.execute(statement)
        return result.scalar_one_or_none()

    @handle_exceptions(
        default_exception=InternalServerError,
        message="An unexpected database error occurred.",
    )
    async def get_all(
        self,
        db: AsyncSession,
        *,
        skip: int = 0,
        limit: int = 100,
        filters: Optional[Dict[str, Any]] = None,
        order_by: str = "created_at",
        order_desc: bool = True,
    ) -> Tuple[List[Product], int]:
        """Get multiple products with filtering and pagination."""

        query = select(self.model).options(
            selectinload(self.model.images),
            selectinload(self.model.category),
            selectinload(self.model.variants).options(
                selectinload(ProductVariant.size),
                selectinload(ProductVariant.color),
            ),
        )

        # Apply filters
        if filters:
            query = self._apply_filters(query, filters)

        # Count total
        count_query = select(func.count()).select_from(query.subquery())
        total = (await db.execute(count_query)).scalar_one()

        # Apply ordering
        query = self._apply_ordering(query, order_by, order_desc)

        # Apply pagination
        paginated_query = query.offset(skip).limit(limit)
        result = await db.execute(paginated_query)
        products = result.scalars().all()

        return products, total

    @handle_exceptions(
        default_exception=InternalServerError,
        message="An unexpected database error occurred.",
    )
    async def create(self, db: AsyncSession, *, db_obj: Product) -> Product:
        """create a product"""

        db.add(db_obj)
        await db.commit()
        await db.refresh(db_obj)
        self._logger.info(f"Product created: {db_obj.id}")
        return db_obj

    @handle_exceptions(
        default_exception=InternalServerError,
        message="An unexpected database error occurred.",
    )
    async def update(
        self, db: AsyncSession, *, product: Product, fields_to_update: Dict[str, Any]
    ) -> Product:
        """Updates specific fields of a prodcut object."""

        for field, value in fields_to_update.items():
            if field in {"created_at", "updated_at"} and isinstance(value, str):
                try:
                    value = datetime.fromisoformat(value.replace("Z", "+00:00"))
                except ValueError:
                    value = datetime.now(timezone.utc)

            setattr(product, field, value)

        db.add(product)
        await db.commit()
        await db.refresh(product)
        self._logger.info(
            f"Product fields updated for {product.id}: {list(fields_to_update.keys())}"
        )
        return product

    @handle_exceptions(
        default_exception=InternalServerError,
        message="An unexpected database error occurred.",
    )
    async def delete(self, db: AsyncSession, *, obj_id: uuid.UUID) -> None:
        """Delete a product by its ID"""

        statement = delete(self.model).where(self.model.id == obj_id)
        await db.execute(statement)
        await db.commit()
        self._logger.info(f"Product hard deleted: {obj_id}")
        return

    # ===========PRODUCT IMAGE OPERATIONS==============
    @handle_exceptions(
        default_exception=InternalServerError,
        message="An unexpected database error occurred.",
    )
    async def get_image(
        self, db: AsyncSession, *, image_id: uuid.UUID
    ) -> Optional[ProductImage]:
        """Get an image by its ID"""

        statement = select(ProductImage).where(ProductImage.id == image_id)
        result = await db.execute(statement)
        return result.scalar_one_or_none()

    @handle_exceptions(
        default_exception=InternalServerError,
        message="An unexpected database error occurred.",
    )
    async def create_image(
        self, db: AsyncSession, *, image: ProductImage
    ) -> ProductImage:
        """create an Image"""

        db.add(image)
        await db.commit()
        await db.refresh(image)
        return image

    @handle_exceptions(
        default_exception=InternalServerError,
        message="An unexpected database error occurred.",
    )
    async def delete_image(self, db: AsyncSession, *, image_id: uuid.UUID) -> None:
        """Delete an image by its ID"""
        statement = delete(ProductImage).where(ProductImage.id == image_id)
        await db.execute(statement)
        await db.commit()
        self._logger.info(f"Image hard deleted: {image_id}")
        return

    # ==============PRODUCT VARIANT OPERATIONS======================
    @handle_exceptions(
        default_exception=InternalServerError,
        message="An unexpected database error occurred.",
    )
    async def get_variant(
        self, db: AsyncSession, *, variant_id: uuid.UUID
    ) -> Optional[ProductVariant]:
        """Get a variant by it's ID"""

        statement = (
            select(ProductVariant)
            .where(ProductVariant.id == variant_id)
            .options(
                selectinload(ProductVariant.size),
                selectinload(ProductVariant.color),
            )
        )
        result = await db.execute(statement)
        return result.scalar_one_or_none()

    @handle_exceptions(
        default_exception=InternalServerError,
        message="An unexpected database error occurred.",
    )
    async def get_by_sku(
        self, db: AsyncSession, *, sku: str
    ) -> Optional[ProductVariant]:
        """Get a variant by it's sku"""

        statement = select(ProductVariant).where(ProductVariant.sku == sku)
        result = await db.execute(statement)
        return result.scalar_one_or_none()

    @handle_exceptions(
        default_exception=InternalServerError,
        message="An unexpected database error occurred.",
    )
    async def get_by_product_size_color(
        self,
        db: AsyncSession,
        *,
        product_id: uuid.UUID,
        size_id: uuid.UUID,
        color_id: uuid.UUID,
    ) -> Optional[ProductVariant]:

        statement = select(ProductVariant).where(
            ProductVariant.product_id == product_id,
            ProductVariant.color_id == color_id,
            ProductVariant.size_id == size_id,
        )
        result = await db.execute(statement)
        return result.scalar_one_or_none()

    @handle_exceptions(
        default_exception=InternalServerError,
        message="An unexpected database error occurred.",
    )
    async def get_all_variants(
        self,
        db: AsyncSession,
        *,
        product_id: uuid.UUID,
        skip: int = 0,
        limit: int = 100,
        filters: Optional[Dict[str, Any]] = None,
    ) -> Tuple[List[ProductVariant], int]:
        """Get multiple products with filtering and pagination."""
        query = (
            select(ProductVariant)
            .where(ProductVariant.product_id == product_id)
            .options(
                selectinload(ProductVariant.size),
                selectinload(ProductVariant.color),
            )
        )

        # Apply filters
        if filters:
            query = self._apply_variant_filters(query, filters)

        # Count total
        count_query = select(func.count()).select_from(query.subquery())
        total = (await db.execute(count_query)).scalar_one()

        # Apply pagination
        paginated_query = query.offset(skip).limit(limit)
        result = await db.execute(paginated_query)
        variants = result.scalars().all()

        return variants, total

    @handle_exceptions(
        default_exception=InternalServerError,
        message="An unexpected database error occurred.",
    )
    async def create_variant(
        self, db: AsyncSession, *, variant: ProductVariant
    ) -> ProductVariant:
        """create a variant for a product"""

        db.add(variant)
        await db.commit()
        await db.refresh(variant)
        self._logger.info(f"Product Variant created : {variant.id}")
        return variant

    @handle_exceptions(
        default_exception=InternalServerError,
        message="An unexpected database error occurred.",
    )
    async def update_variant(
        self,
        db: AsyncSession,
        *,
        variant: ProductVariant,
        fields_to_update: Dict[str, Any],
    ) -> ProductVariant:
        """Update a variant"""

        for field, value in fields_to_update.items():
            if field in {"created_at", "updated_at"} and isinstance(value, str):
                try:
                    value = datetime.fromisoformat(value.replace("Z", "+00:00"))
                except ValueError:
                    value = datetime.now(timezone.utc)

            setattr(variant, field, value)

        db.add(variant)
        await db.commit()
        await db.refresh(variant)
        self._logger.info(
            f"Product Variant fields updated for {variant.id}: {list(fields_to_update.keys())}"
        )
        return variant

    @handle_exceptions(
        default_exception=InternalServerError,
        message="An unexpected database error occurred.",
    )
    async def delete_variant(self, db: AsyncSession, *, variant_id: uuid.UUID) -> None:
        """Delete a variant by its ID"""

        statement = delete(ProductVariant).where(ProductVariant.id == variant_id)
        await db.execute(statement)
        await db.commit()
        self._logger.info(f"Product Variant Hard Deleted {variant_id}")
        return

    # Helpers
    @handle_exceptions(
        default_exception=InternalServerError,
        message="An unexpected database error occurred while deleting product images.",
    )
    async def delete_images_by_product_id(
        self, db: AsyncSession, *, product_id: uuid.UUID
    ) -> int:
        """Deletes all ProductImage entries associated with a product_id."""
        statement = delete(ProductImage).where(ProductImage.product_id == product_id)
        result = await db.execute(statement)
        # We don't commit here; let the service handle the transaction.
        self._logger.info(f"Deleted {result.rowcount} images for product {product_id}")
        return result.rowcount

    @handle_exceptions(
        default_exception=InternalServerError,
        message="An unexpected database error occurred while deleting product variants.",
    )
    async def delete_variants_by_product_id(
        self, db: AsyncSession, *, product_id: uuid.UUID
    ) -> int:
        """Deletes all ProductVariant entries associated with a product_id."""
        statement = delete(ProductVariant).where(
            ProductVariant.product_id == product_id
        )
        result = await db.execute(statement)
        self._logger.info(
            f"Deleted {result.rowcount} variants for product {product_id}"
        )
        return result.rowcount

    # @handle_exceptions(
    #     default_exception=InternalServerError,
    #     message="An unexpected database error occurred while deleting wishlist items.",
    # )
    # async def delete_wishlist_items_by_product_id(self, db: AsyncSession, *, product_id: uuid.UUID) -> int:
    #     """Deletes all Wishlist entries associated with a product_id."""
    #     # Need to import Wishlist model at the top of the file
    #     from app.models.wishlist_model import Wishlist
    #     statement = delete(Wishlist).where(Wishlist.product_id == product_id)
    #     result = await db.execute(statement)
    #     self._logger.info(f"Deleted {result.rowcount} wishlist items for product {product_id}")
    #     return result.rowcount

    def _apply_filters(self, query, filters: Dict[str, Any]):
        """Apply filters to query."""
        conditions = []

        if "status" in filters and filters["status"]:
            conditions.append(Product.status == filters["status"])

        if "gender" in filters and filters["gender"]:
            conditions.append(Product.gender == filters["gender"])

        if "product_id" in filters and filters["product_id"]:
            conditions.append(Product.id == filters["product_id"])

        if "category_id" in filters and filters["category_id"]:
            conditions.append(Product.category_id == filters["category_id"])

        if "search" in filters and filters["search"]:
            search_term = f"%{filters['search']}%"
            conditions.append(
                or_(
                    Product.name.ilike(search_term),
                    Product.brand.ilike(search_term),
                )
            )

        if conditions:
            query = query.where(and_(*conditions))

        return query

    def _apply_variant_filters(self, query, filters: Dict[str, Any]):
        """Apply filters to query."""
        conditions = []

        if "color_id" in filters and filters["color_id"]:
            conditions.append(ProductVariant.color_id == filters["color_id"])

        if "size_id" in filters and filters["size_id"]:
            conditions.append(ProductVariant.size_id == filters["size_id"])

        if "search" in filters and filters["search"]:
            search_term = f"%{filters['search']}%"
            conditions.append(
                or_(
                    ProductVariant.sku.ilike(search_term),
                )
            )

        if conditions:
            query = query.where(and_(*conditions))

        return query

    def _apply_ordering(self, query, order_by: str, order_desc: bool):
        """Apply ordering to query."""
        order_column = getattr(self.model, order_by, self.model.created_at)
        if order_desc:
            return query.order_by(order_column.desc())
        else:
            return query.order_by(order_column.asc())


product_repository = ProductRepository()
