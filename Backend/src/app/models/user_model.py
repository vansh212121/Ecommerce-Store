import uuid
from datetime import datetime
from typing import Optional, TYPE_CHECKING, List
from enum import Enum as PyEnum
from sqlalchemy import Enum as SAEnum
from sqlalchemy import func, Column, String, DateTime
from sqlalchemy.dialects.postgresql import (
    UUID as PG_UUID,
)
from sqlmodel import Field, SQLModel, Relationship

if TYPE_CHECKING:
    from .wishlist_model import Wishlist
    from .cart_model import Cart
    from .order_model import Order
    from .adress_model import Address


class UserRole(str, PyEnum):
    USER = "user"
    ADMIN = "admin"

    @property
    def priority(self) -> int:
        priorities = {self.USER: 1, self.ADMIN: 2}
        return priorities.get(self, 0)

    def __lt__(self, other: "UserRole") -> bool:
        if not isinstance(other, UserRole):
            return NotImplemented
        return self.priority < other.priority


class UserBase(SQLModel):
    name: str = Field(
        sa_column=Column(
            String(40),
            nullable=False,
            index=True,
        )
    )
    email: str = Field(
        sa_column=Column(String(200), unique=True, nullable=False, index=True)
    )
    role: UserRole = Field(
        sa_column=Column(SAEnum(UserRole), nullable=False, index=True),
        default=UserRole.USER,
    )
    is_active: bool = Field(default=True, nullable=False)


class User(UserBase, table=True):
    __tablename__ = "users"

    id: uuid.UUID = Field(
        default_factory=uuid.uuid4,
        sa_column=Column(
            PG_UUID(as_uuid=True),
            server_default=func.gen_random_uuid(),
            primary_key=True,
            index=True,
            nullable=False,
        ),
    )

    hashed_password: str = Field(nullable=False, exclude=True)

    # Relationships
    wishlist_items: list["Wishlist"] = Relationship(
        back_populates="user", sa_relationship_kwargs={"cascade": "all, delete-orphan"}
    )
    cart: Optional["Cart"] = Relationship(
        back_populates="user", sa_relationship_kwargs={"cascade": "all, delete-orphan"}
    )
    orders: List["Order"] = Relationship(
        back_populates="user", sa_relationship_kwargs={"cascade": "all, delete-orphan"}
    )
    addresses: List["Address"] = Relationship(
        back_populates="user", sa_relationship_kwargs={"cascade": "all, delete-orphan"}
    )

    # Timestamps
    created_at: datetime = Field(
        sa_column=Column(
            DateTime(timezone=True), server_default=func.now(), nullable=False
        )
    )
    updated_at: datetime = Field(
        sa_column=Column(
            DateTime(timezone=True),
            server_default=func.now(),
            onupdate=func.now(),
            nullable=False,
        )
    )
    tokens_valid_from_utc: Optional[datetime] = Field(
        default=None, sa_column=Column(DateTime(timezone=True))
    )

    # --- Computed properties (data-focused) ---
    @property
    def is_admin(self) -> bool:
        return UserRole(self.role) == UserRole.ADMIN

    def __repr__(self) -> str:
        return f"<User(id='{self.id}', email='{self.email}')>"
