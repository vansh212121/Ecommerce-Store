import re
import uuid
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field, ConfigDict, field_validator, model_validator
from app.core.exceptions import ValidationError


class SizeBase(BaseModel):
    name: str = Field(
        ...,
        min_length=1,
        max_length=50,
        description="Size name",
        examples=["XL", "XXL", "Small"],
    )

    @field_validator("name")
    @classmethod
    def validate_names(cls, v: str) -> str:
        """Validate and clean size names."""
        v = v.strip().upper()
        # Allow alphanumeric and slash (like '30/32' or 'L/XL')
        if not re.match(r"^[A-Za-z0-9/+\s-]+$", v):
            raise ValidationError("Invalid size format")
        return v


class SizeCreate(SizeBase):
    pass


class SizeUpdate(BaseModel):
    name: Optional[str] = Field(
        None,
        min_length=1,
        max_length=50,
        description="Size name",
        examples=["XL", "XXL"],
    )

    @field_validator("name")
    @classmethod
    def validate_names(cls, v: str) -> str:
        """Validate and clean size names."""
        v = v.strip().upper()
        if not re.match(r"^[A-Za-z0-9/+\s-]+$", v):
            raise ValidationError("Invalid size format")
        return v

    @model_validator(mode="before")
    @classmethod
    def validate_at_least_one_field(cls, values: Dict[str, Any]) -> Dict[str, Any]:
        """Ensure at least one field is provided for update."""
        if isinstance(values, dict) and not any(v is not None for v in values.values()):
            raise ValidationError("At least one field must be provided for update")
        return values


# ======== Response Schemas =========
class SizeResponse(SizeBase):
    """Basic size response schema."""

    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID = Field(..., description="Size ID")


# ======== List and Search Schemas =========
class SizeListResponse(BaseModel):
    """Response for paginated size list."""

    items: List[SizeResponse] = Field(..., description="List of sizes")
    total: int = Field(..., ge=0, description="Total number of sizes")
    page: int = Field(..., ge=1, description="Current page number")
    pages: int = Field(..., ge=0, description="Total number of pages")
    size: int = Field(..., ge=1, le=100, description="Number of items per page")

    @property
    def has_next(self) -> bool:
        return self.page < self.pages

    @property
    def has_previous(self) -> bool:
        return self.page > 1


class SizeSearchParams(BaseModel):
    """Parameters for searching sizes."""

    search: Optional[str] = Field(
        None,
        min_length=1,
        max_length=100,
        description="Search in name",
    )

    @field_validator("search")
    @classmethod
    def clean_search(cls, v: Optional[str]) -> Optional[str]:
        return v.strip() if v else v


__all__ = [
    "SizeBase",
    "SizeCreate",
    "SizeUpdate",
    "SizeResponse",
    "SizeListResponse",
    "SizeSearchParams",
]
