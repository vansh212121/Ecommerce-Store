import uuid
from datetime import datetime
from typing import TYPE_CHECKING, List
from sqlalchemy import func, Column, String, DateTime, Text
from sqlalchemy.dialects.postgresql import (
    UUID as PG_UUID,
)
from sqlmodel import Field, SQLModel, Relationship

if TYPE_CHECKING:
    from .user_model import User
    from .order_model import Order


class Address(SQLModel, table=True):
    __tablename__ = "addresses"

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
    street_address: str = Field(sa_column=Column(Text, nullable=False))
    city: str = Field(sa_column=Column(String(50), nullable=False))
    state: str = Field(sa_column=Column(String(50), nullable=False))
    zip_code: str = Field(sa_column=Column(String(20), nullable=False))
    is_default: bool = Field(nullable=False, default=False)

    # Relationships
    user: "User" = Relationship(back_populates="addresses")
    orders: List["Order"] = Relationship(back_populates="shipping_address")

    # Timestamps
    created_at: datetime = Field(
        sa_column=Column(
            DateTime(timezone=True), server_default=func.now(), nullable=False
        )
    )
