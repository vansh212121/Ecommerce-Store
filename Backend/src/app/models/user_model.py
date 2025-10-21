import uuid
from datetime import datetime
from typing import Optional
from enum import Enum as PyEnum
from sqlalchemy import Enum as SAEnum
from sqlalchemy import func, Column, String, DateTime
from sqlalchemy.dialects.postgresql import (
    UUID as PG_UUID,
)
from sqlmodel import Field, SQLModel, Relationship


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

    # Relationships

    # --- Computed properties (data-focused) ---
    def __repr__(self) -> str:
        return f"<User(id='{self.id}', email='{self.email}')>"
