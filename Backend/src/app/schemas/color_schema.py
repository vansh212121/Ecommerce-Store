import re
import uuid
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field, ConfigDict, field_validator, model_validator
from app.core.exceptions import ValidationError


class ColorBase(BaseModel):
    name: str = Field(
        ...,
        min_length=1,
        max_length=50,
        description="Color name",
        examples=["Red", "Ocean Blue"],
    )
    hex_code: str = Field(
        ...,
        min_length=4,
        max_length=7,
        description="Color Hex Code (e.g., #FFFFFF)",
        examples=["#FFFFFF"],
    )

    @field_validator("name")
    @classmethod
    def validate_names(cls, v: str) -> str:
        """Validate and clean color names."""
        v = " ".join(v.strip().split())
        if not re.match(r"^[A-Za-z0-9\s&.'-]+$", v):
            raise ValidationError("Name contains invalid characters")
        return v

    @field_validator("hex_code")
    @classmethod
    def validate_hex_code(cls, v: str) -> str:
        """Ensure hex code starts with '#' and is valid."""
        v = v.strip().upper()
        if not re.match(r"^#(?:[0-9A-F]{3}|[0-9A-F]{6})$", v):
            raise ValidationError("Invalid hex color format")
        return v


class ColorCreate(ColorBase):
    pass


class ColorUpdate(BaseModel):
    name: Optional[str] = Field(
        None,
        min_length=1,
        max_length=50,
        description="Color name",
        examples=["Red", "Ocean Blue"],
    )
    hex_code: Optional[str] = Field(
        None,
        min_length=4,
        max_length=7,
        description="Color Hex Code",
        examples=["#FFFFFF"],
    )

    @field_validator("name")
    @classmethod
    def validate_names(cls, v: str) -> str:
        v = " ".join(v.strip().split())
        if not re.match(r"^[A-Za-z0-9\s&.'-]+$", v):
            raise ValidationError("Name contains invalid characters")
        return v

    @field_validator("hex_code")
    @classmethod
    def validate_hex_code(cls, v: str) -> str:
        v = v.strip().upper()
        if not re.match(r"^#(?:[0-9A-F]{3}|[0-9A-F]{6})$", v):
            raise ValidationError("Invalid hex color format")
        return v

    @model_validator(mode="before")
    @classmethod
    def validate_at_least_one_field(cls, values: Dict[str, Any]) -> Dict[str, Any]:
        if isinstance(values, dict) and not any(v is not None for v in values.values()):
            raise ValidationError("At least one field must be provided for update")
        return values


# ======== Response Schemas =========
class ColorResponse(ColorBase):
    """Basic color response schema."""

    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID = Field(..., description="Color ID")


# ======== List and Search Schemas =========
class ColorListResponse(BaseModel):
    """Response for paginated color list."""

    items: List[ColorResponse] = Field(..., description="List of colors")
    total: int = Field(..., ge=0, description="Total number of colors")
    page: int = Field(..., ge=1, description="Current page number")
    pages: int = Field(..., ge=0, description="Total number of pages")
    size: int = Field(..., ge=1, le=100, description="Number of items per page")

    @property
    def has_next(self) -> bool:
        return self.page < self.pages

    @property
    def has_previous(self) -> bool:
        return self.page > 1


class ColorSearchParams(BaseModel):
    """Parameters for searching colors."""

    search: Optional[str] = Field(
        None,
        min_length=1,
        max_length=100,
        description="Search in name or hex_code",
    )

    @field_validator("search")
    @classmethod
    def clean_search(cls, v: Optional[str]) -> Optional[str]:
        return v.strip() if v else v


__all__ = [
    "ColorBase",
    "ColorCreate",
    "ColorUpdate",
    "ColorResponse",
    "ColorListResponse",
    "ColorSearchParams",
]
