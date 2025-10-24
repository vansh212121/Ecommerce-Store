import logging
import uuid
from typing import Optional, List, Dict, Any, TypeVar, Generic, Tuple
from abc import ABC, abstractmethod
from datetime import datetime, timezone
from sqlmodel.ext.asyncio.session import AsyncSession

from sqlmodel import select, func, and_, delete, update, or_

from app.core.exception_utils import handle_exceptions
from app.core.exceptions import InternalServerError

from app.models.address_model import Address

logger = logging.getLogger(__name__)

T = TypeVar("T")


# --- BaseRepository remains the same ---
class BaseRepository(ABC, Generic[T]):
    """Abstract base repository providing consistent interface for database operations."""

    def __init__(self, model: type[T]):
        self.model = model

    @abstractmethod
    async def get(self, db: AsyncSession, *, obj_id: Any) -> Optional[T]:
        pass

    @abstractmethod
    async def create(
        self, db: AsyncSession, *, db_obj: T
    ) -> T:  # Corrected obj_in to db_obj for consistency
        pass

    @abstractmethod
    async def update(
        self, db: AsyncSession, *, db_obj: T, fields_to_update: Dict[str, Any]
    ) -> T:  # Corrected obj_in signature
        pass

    @abstractmethod
    async def delete(self, db: AsyncSession, *, obj_id: Any) -> None:
        pass


class AddressRepository(BaseRepository[Address]):
    """Repository for all database operations related to the Address model."""

    def __init__(self):
        super().__init__(Address)
        self._logger = logging.getLogger(f"{__name__}.{self.__class__.__name__}")

    @handle_exceptions(
        default_exception=InternalServerError,
        message="An unexpected database error occurred.",
    )
    async def get(self, db: AsyncSession, *, obj_id: uuid.UUID) -> Optional[Address]:
        """Get address by its ID"""
        statement = select(self.model).where(self.model.id == obj_id)
        result = await db.execute(statement)
        return result.scalar_one_or_none()

    @handle_exceptions(
        default_exception=InternalServerError,
        message="An unexpected database error occurred.",
    )
    async def get_all_by_user(
        self,
        db: AsyncSession,
        *,
        skip: int = 0,
        user_id: uuid.UUID,
        limit: int = 100,
        filters: Optional[Dict[str, Any]] = None,
        order_by: str = "created_at",
        order_desc: bool = True,
    ) -> Tuple[List[Address], int]:
        """Get multiple users with filtering and pagination."""
        query = select(self.model).where(self.model.user_id == user_id)

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
        addresses = result.scalars().all()

        return addresses, total

    @handle_exceptions(
        default_exception=InternalServerError,
        message="An unexpected database error occurred.",
    )
    async def create(self, db: AsyncSession, *, db_obj: Address) -> Address:
        """Create a new address. Expects a pre-constructed Address model object."""
        db.add(db_obj)
        await db.commit()
        await db.refresh(db_obj)
        self._logger.info(f"Address created: {db_obj.id} for user {db_obj.user_id}")
        return db_obj

    @handle_exceptions(
        default_exception=InternalServerError,
        message="An unexpected database error occurred.",
    )
    async def update(
        self, db: AsyncSession, *, db_obj: Address, fields_to_update: Dict[str, Any]
    ) -> Address:
        """Updates specific fields of an Address object."""

        for field, value in fields_to_update.items():
            if field in {"created_at"} and isinstance(value, str):
                try:
                    value = datetime.fromisoformat(value.replace("Z", "+00:00"))
                except ValueError:
                    value = datetime.now(timezone.utc)

            setattr(db_obj, field, value)

        db.add(db_obj)
        await db.commit()
        await db.refresh(db_obj)
        self._logger.info(
            f"Address {db_obj.id} updated for user {db_obj.user_id}: {list(fields_to_update.keys())}"
        )
        return db_obj

    @handle_exceptions(
        default_exception=InternalServerError,
        message="An unexpected database error occurred.",
    )
    async def delete(self, db: AsyncSession, *, obj_id: uuid.UUID) -> None:
        """Permanently delete an Address by ID. Assumes ownership check done in service."""

        statement = delete(self.model).where(self.model.id == obj_id)
        await db.execute(statement)
        await db.commit()
        self._logger.info(f"Address hard deleted: {obj_id}")
        return

    @handle_exceptions(
        default_exception=InternalServerError,
        message="An unexpected database error occurred.",
    )
    async def unset_other_defaults(
        self, db: AsyncSession, *, user_id: uuid.UUID, current_default_id: uuid.UUID
    ) -> None:
        """Sets is_default=False for all addresses of a user EXCEPT the current_default_id."""
        statement = (
            update(self.model)  # Use sqlmodel.update here
            .where(
                and_(
                    self.model.user_id == user_id,
                    self.model.id != current_default_id,
                    self.model.is_default == True,
                )
            )
            .values(is_default=False)
            # synchronize_session=False might be needed if objects are in session
            .execution_options(synchronize_session="fetch")  # Or False
        )
        result = await db.execute(statement)
        # No commit here - expect service layer to manage the transaction
        self._logger.info(
            f"Unset default flags for user {user_id}, except for {current_default_id}. Rows affected: {result.rowcount}"
        )

    def _apply_filters(self, query, filters: Dict[str, Any]):
        """Apply filters to query."""
        conditions = []

        if "search" in filters and filters["search"]:
            search_term = f"%{filters['search']}%"
            conditions.append(
                or_(
                    Address.state.ilike(search_term),
                    Address.city.ilike(search_term),
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


address_repository = AddressRepository()
