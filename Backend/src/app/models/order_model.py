import uuid
from datetime import datetime
from typing import TYPE_CHECKING, List, Optional
from enum import Enum as PyEnum
from sqlalchemy import Enum as SAEnum
from sqlalchemy import (
    func,
    Column,
    DateTime,
    Integer,
    CheckConstraint,
)
from sqlalchemy.dialects.postgresql import (
    UUID as PG_UUID,
)
from sqlmodel import Field, SQLModel, Relationship

if TYPE_CHECKING:
    from .product_model import ProductVariant
    from .user_model import User
    from .promotion_model import Promotion
    from .adress_model import Address


class OrderStatus(str, PyEnum):
    PROCESSING = "processing"
    SHIPPED = "shipped"
    DELIVERED = "delivered"
    CANCELLED = "cancelled"


class Order(SQLModel, table=True):
    __tablename__ = "orders"

    __table_args__ = (
        CheckConstraint(
            "total_amount_in_cents >= 0", name="check_total_amount_positive"
        ),
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
    user_id: uuid.UUID = Field(foreign_key="users.id", nullable=False, index=True)
    status: OrderStatus = Field(
        sa_column=Column(
            SAEnum(OrderStatus),
            nullable=False,
            index=True,
            default=OrderStatus.PROCESSING,
        )
    )
    total_amount_in_cents: int = Field(
        sa_column=Column(Integer, default=1, nullable=False)
    )
    address_id: uuid.UUID = Field(
        foreign_key="addresses.id", nullable=False, index=True
    )
    promotion_id: Optional[uuid.UUID] = Field(
        foreign_key="promotions.id", default=None, index=True
    )

    # Relationships
    items: List["OrderItem"] = Relationship(
        back_populates="order", sa_relationship_kwargs={"cascade": "all, delete-orphan"}
    )
    user: "User" = Relationship(
        back_populates="orders",
        sa_relationship_kwargs={
            "passive_deletes": False
        },  # Prevent user deletion if orders exist
    )
    promotion: Optional["Promotion"] = Relationship(
        back_populates="orders",
        sa_relationship_kwargs={
            "passive_deletes": True
        },  # Allow promotion deletion, set to NULL
    )
    shipping_address: "Address" = Relationship(
        back_populates="orders",
        sa_relationship_kwargs={"passive_deletes": False},  # Prevent address deletion
    )

    # Timestamps
    created_at: datetime = Field(
        sa_column=Column(
            DateTime(timezone=True), server_default=func.now(), nullable=False
        )
    )


class OrderItem(SQLModel, table=True):
    __tablename__ = "order_items"

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
    price_at_purchase_in_cents: int = Field(
        sa_column=Column(Integer, nullable=False, default=1)
    )

    order_id: uuid.UUID = Field(foreign_key="orders.id", nullable=False, index=True)
    product_variant_id: uuid.UUID = Field(
        foreign_key="product_variants.id", nullable=False, index=True
    )

    # Relationships
    order: "Order" = Relationship(back_populates="items")
    product_variant: "ProductVariant" = Relationship(back_populates="order_items")
