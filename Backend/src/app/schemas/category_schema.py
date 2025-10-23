import re
import uuid
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field, ConfigDict, field_validator, model_validator
from app.core.exceptions import ValidationError


class CategoryBase(BaseModel):
    name: str = Field(
        ...,
        min_length=1,
        max_length=200,
        description="Category name",
        examples=["Tshirt"],
    )

    @field_validator("name")
    @classmethod
    def validate_names(cls, v: str) -> str:
        """Validate and clean category names."""
        v = " ".join(v.strip().split())
        # Allow letters, numbers, spaces, apostrophes, hyphens, ampersand (for names like 'T-Shirts & Tops')
        if not re.match(r"^[A-Za-z0-9\s&.'-]+$", v):
            raise ValidationError("Name contains invalid characters")
        return v


class CategoryCreate(CategoryBase):
    pass


class CategoryUpdate(BaseModel):
    name: Optional[str] = Field(
        None,
        min_length=1,
        max_length=200,
        description="Category name",
        examples=["Tshirt"],
    )

    @field_validator("name")
    @classmethod
    def validate_names(cls, v: str) -> str:
        """Validate and clean names."""
        v = " ".join(v.strip().split())
        if not re.match(r"^[A-Za-z0-9\s&.'-]+$", v):
            raise ValidationError("Name contains invalid characters")
        return v

    @model_validator(mode="before")
    @classmethod
    def validate_at_least_one_field(cls, values: Dict[str, Any]) -> Dict[str, Any]:
        """Ensure at least one field is provided for update."""
        if isinstance(values, dict) and not any(v is not None for v in values.values()):
            raise ValidationError("At least one field must be provided for update")
        return values


# ======== Response Schemas =========
class CategoryResponse(CategoryBase):
    """Basic category response schema."""

    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID = Field(..., description="Category ID")
    slug: str = Field(..., description="SEO friendly generated name")


# ======== List and Search Schemas =========
class CategoryListResponse(BaseModel):
    """Response for paginated category list."""

    items: List[CategoryResponse] = Field(..., description="List of categories")
    total: int = Field(..., ge=0, description="Total number of categories")
    page: int = Field(..., ge=1, description="Current page number")
    pages: int = Field(..., ge=0, description="Total number of pages")
    size: int = Field(..., ge=1, le=100, description="Number of items per page")

    @property
    def has_next(self) -> bool:
        """Check if there's a next page."""
        return self.page < self.pages

    @property
    def has_previous(self) -> bool:
        """Check if there's a previous page."""
        return self.page > 1


class CategorySearchParams(BaseModel):
    """Parameters for searching categories."""

    search: Optional[str] = Field(
        None,
        min_length=1,
        max_length=100,
        description="Search in name, slug",
    )

    @field_validator("search")
    @classmethod
    def clean_search(cls, v: Optional[str]) -> Optional[str]:
        """Trim and clean search query."""
        return v.strip() if v else v


__all__ = [
    "CategoryBase",
    "CategoryCreate",
    "CategoryUpdate",
    "CategoryResponse",
    "CategoryListResponse",
    "CategorySearchParams",
]
