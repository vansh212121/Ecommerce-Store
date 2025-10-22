import uuid
from datetime import datetime
from typing import TYPE_CHECKING
from sqlalchemy import func, Column, DateTime, UniqueConstraint
from sqlalchemy.dialects.postgresql import (
    UUID as PG_UUID,
)
from sqlmodel import Field, SQLModel, Relationship

if TYPE_CHECKING:
    from .user_model import User
    from .product_model import Product


class Wishlist(SQLModel, table=True):
    __tablename__ = "wishlist_items"

    __table_args__ = (
        # Ensures a user cannot add the same product to their wishlist twice
        UniqueConstraint("user_id", "product_id", name="uq_user_product_wishlist"),
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
    product_id: uuid.UUID = Field(foreign_key="products.id", nullable=False, index=True)

    # Relationship
    user: "User" = Relationship(back_populates="wishlist_items")
    product: "Product" = Relationship(back_populates="wishlisted_by")

    # Timestamps
    created_at: datetime = Field(
        sa_column=Column(
            DateTime(timezone=True), server_default=func.now(), nullable=False
        )
    )
