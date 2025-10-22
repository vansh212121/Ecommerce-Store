import uuid
from datetime import datetime
from typing import Optional, List, TYPE_CHECKING
from enum import Enum as PyEnum
from sqlalchemy import Enum as SAEnum
from sqlalchemy import (
    func,
    Column,
    String,
    DateTime,
    Integer,
)
from sqlalchemy.dialects.postgresql import (
    UUID as PG_UUID,
)
from sqlmodel import Field, SQLModel, Relationship

if TYPE_CHECKING:
    from .order_model import Order


class PromotionType(str, PyEnum):
    FIXED = "fixed"
    PERCENTAGE = "percentage"


class PromotionStatus(str, PyEnum):
    ACTIVE = "active"
    INACTIVE = "inactive"


class Promotion(SQLModel, table=True):
    __tablename__ = "promotions"

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
    code: str = Field(
        sa_column=Column(String(50), unique=True, nullable=False, index=True)
    )
    status: PromotionStatus = Field(
        sa_column=Column(
            SAEnum(PromotionStatus),
            nullable=False,
            index=True,
            default=PromotionStatus.ACTIVE,
        )
    )
    discount_type: PromotionType = Field(
        sa_column=Column(
            SAEnum(PromotionType),
            nullable=False,
            index=True,
            default=PromotionType.PERCENTAGE,
        )
    )
    value: int = Field(sa_column=Column(Integer, nullable=False, default=1))

    # Relationships
    orders: List["Order"] = Relationship(
        back_populates="promotion",
        sa_relationship_kwargs={"cascade": "save-update"},  # Don't cascade delete
    )

    # timestamps
    created_at: datetime = Field(
        sa_column=Column(
            DateTime(timezone=True), server_default=func.now(), nullable=False
        )
    )
    expires_at: Optional[datetime] = Field(
        default=None,
        sa_column=Column(DateTime(timezone=True), nullable=True),
    )
