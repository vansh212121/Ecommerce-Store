import uuid
from datetime import datetime
from typing import TYPE_CHECKING, List
from sqlalchemy import (
    func,
    Column,
    DateTime,
    UniqueConstraint,
    Integer,
    CheckConstraint,
)
from sqlalchemy.dialects.postgresql import (
    UUID as PG_UUID,
)
from sqlmodel import Field, SQLModel, Relationship

if TYPE_CHECKING:
    from .user_model import User
    from .product_model import ProductVariant


class Cart(SQLModel, table=True):
    __tablename__ = "carts"

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

    user_id: uuid.UUID = Field(
        foreign_key="users.id", unique=True, nullable=False, index=True
    )

    # Relationship
    user: "User" = Relationship(back_populates="cart")
    items: List["CartItem"] = Relationship(
        back_populates="cart", sa_relationship_kwargs={"cascade": "all, delete-orphan"}
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


class CartItem(SQLModel, table=True):
    __tablename__ = "cart_items"

    __table_args__ = (
        # --- FIX: Added Data Integrity Rules ---
        # Ensures a user can't have the same variant in their cart twice
        UniqueConstraint("cart_id", "product_variant_id", name="uq_cart_variant"),
        # Ensures quantity is always a positive number
        CheckConstraint("quantity > 0", name="check_quantity_positive"),
    )

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
    quantity: int = Field(sa_column=Column(Integer, nullable=False, default=1))

    cart_id: uuid.UUID = Field(foreign_key="carts.id", nullable=False, index=True)
    product_variant_id: uuid.UUID = Field(
        foreign_key="product_variants.id", nullable=False, index=True
    )

    # Relationship
    cart: "Cart" = Relationship(back_populates="items")
    product_variant: "ProductVariant" = Relationship(back_populates="cart_items")

    # Timestamps
    created_at: datetime = Field(
        sa_column=Column(
            DateTime(timezone=True), server_default=func.now(), nullable=False
        )
    )
