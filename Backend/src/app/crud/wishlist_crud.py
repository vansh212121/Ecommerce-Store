import logging
import uuid
from typing import Optional, List, Any, TypeVar, Generic, Tuple
from abc import ABC, abstractmethod

from sqlmodel.ext.asyncio.session import AsyncSession
from sqlmodel import select, func, delete
from sqlalchemy.orm import selectinload

from app.models.product_model import Product, ProductVariant
from app.core.exception_utils import handle_exceptions
from app.core.exceptions import InternalServerError

from app.models.wishlist_model import Wishlist

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
    async def delete(self, db: AsyncSession, *, obj_id: Any) -> None:
        """Delete an entity by its primary key."""


class WishlistRepository(BaseRepository[Wishlist]):
    """Repository for all database operations related to the Wishlist model."""

    def __init__(self):
        super().__init__(Wishlist)
        self._logger = logging.getLogger(f"{__name__}.{self.__class__.__name__}")

    @handle_exceptions(
        default_exception=InternalServerError,
        message="An unexpected database error occurred.",
    )
    async def get(self, db: AsyncSession, *, obj_id: Any) -> Optional[Wishlist]:
        """Get wishlist item by its own ID (Not typically used, but required by Base)."""
        statement = select(self.model).where(self.model.id == obj_id)
        result = await db.execute(statement)
        return result.scalar_one_or_none()

    @handle_exceptions(
        default_exception=InternalServerError,
        message="An unexpected database error occurred.",
    )
    async def get_by_user_and_product(
        self, db: AsyncSession, *, user_id: uuid.UUID, product_id: uuid.UUID
    ) -> Optional[Wishlist]:
        """"""

        statement = (
            select(self.model)
            .where(self.model.user_id == user_id, self.model.product_id == product_id)
            .options(
                selectinload(self.model.product).options(
                    selectinload(Product.images),
                    selectinload(Product.category),
                    selectinload(Product.variants).options(
                        selectinload(ProductVariant.size),
                        selectinload(ProductVariant.color),
                    ),
                )
            )
        )
        result = await db.execute(statement)
        return result.scalar_one_or_none()

    @handle_exceptions(
        default_exception=InternalServerError,
        message="An unexpected database error occurred.",
    )
    async def get_full_wishlist(
        self,
        db: AsyncSession,
        *,
        user_id: uuid.UUID,
        skip: int = 0,
        limit: int = 100,
        order_by: str = "created_at",
        order_desc: bool = True,
    ) -> Tuple[List[Wishlist], int]:
        """get full wishlist for a user"""

        query = (
            select(self.model)
            .where(self.model.user_id == user_id)
            .options(
                selectinload(self.model.product).options(
                    selectinload(Product.images),
                    selectinload(Product.category),
                    selectinload(Product.variants).options(
                        selectinload(ProductVariant.size),
                        selectinload(ProductVariant.color),
                    ),
                )
            )
        )

        # Count total
        count_query = select(func.count()).select_from(query.subquery())
        total = (await db.execute(count_query)).scalar_one()

        # Apply ordering
        query = self._apply_ordering(query, order_by, order_desc)

        # Apply pagination
        paginated_query = query.offset(skip).limit(limit)
        result = await db.execute(paginated_query)
        wishlist_products = result.scalars().all()

        return wishlist_products, total

    @handle_exceptions(
        default_exception=InternalServerError,
        message="An unexpected database error occurred.",
    )
    async def create(self, db: AsyncSession, *, obj_in: Wishlist) -> Wishlist:
        """add a product in wishlist"""

        db.add(obj_in)
        await db.commit()
        await db.refresh(obj_in)
        return obj_in

    @handle_exceptions(
        default_exception=InternalServerError,
        message="An unexpected database error occurred.",
    )
    async def update(
        self, db: AsyncSession, *, db_obj: Wishlist, obj_in: Any
    ) -> Wishlist:
        """Wishlist items are not updatable. Method required by Base."""
        self._logger.warning("Update operation is not supported for Wishlist.")
        raise NotImplementedError("Wishlist items cannot be updated.")

    @handle_exceptions(
        default_exception=InternalServerError,
        message="An unexpected database error occurred.",
    )
    async def delete(self, db: AsyncSession, *, obj_id: Any) -> None:
        """Deletes a wishlist item by its own ID. Use delete_by_user_and_product instead."""
        statement = delete(self.model).where(self.model.id == obj_id)
        await db.execute(statement)
        await db.commit()
        self._logger.info(f"Wishlist item hard deleted by ID: {obj_id}")
        return

    @handle_exceptions(
        default_exception=InternalServerError,
        message="An unexpected database error occurred.",
    )
    async def delete_by_user_and_product(
        self, db: AsyncSession, *, user_id: uuid.UUID, product_id: uuid.UUID
    ) -> None:
        """remove a  product from wishlist"""

        statement = delete(self.model).where(
            self.model.user_id == user_id, self.model.product_id == product_id
        )
        await db.execute(statement)
        await db.commit()
        return

    def _apply_ordering(self, query, order_by: str, order_desc: bool):
        """Apply ordering to query."""
        order_column = getattr(self.model, order_by, self.model.created_at)
        if order_desc:
            return query.order_by(order_column.desc())
        else:
            return query.order_by(order_column.asc())


wishlist_repository = WishlistRepository()
