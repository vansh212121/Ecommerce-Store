import uuid
from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field, ConfigDict, field_validator, model_validator
from app.core.exceptions import ValidationError


class AddressBase(BaseModel):
    """Base schema for address shared fields."""

    street_address: str = Field(
        ..., min_length=1, max_length=200, description="Street address line"
    )
    city: str = Field(..., min_length=1, max_length=50, description="City")
    state: str = Field(
        ..., min_length=1, max_length=50, description="State or Province"
    )
    zip_code: str = Field(
        ..., min_length=1, max_length=20, description="ZIP or Postal Code"
    )
    is_default: bool = Field(False, description="Is this the default address?")

    @field_validator("street_address", "city", "state", "zip_code")
    @classmethod
    def clean_strings(cls, v: str) -> str:
        """Trim extra spaces from string fields."""
        return " ".join(v.strip().split())


class AddressCreate(AddressBase):
    """Schema for creating a new address. User ID is set in the service."""

    pass


class AddressUpdate(BaseModel):
    """Schema for updating an address. All fields are optional."""

    street_address: Optional[str] = Field(
        None, min_length=1, max_length=200, description="Street address line"
    )
    city: Optional[str] = Field(None, min_length=1, max_length=50, description="City")
    state: Optional[str] = Field(
        None, min_length=1, max_length=50, description="State or Province"
    )
    zip_code: Optional[str] = Field(
        None, min_length=1, max_length=20, description="ZIP or Postal Code"
    )
    is_default: Optional[bool] = Field(None, description="Set as default address?")

    @model_validator(mode="before")
    @classmethod
    def validate_at_least_one_field(cls, values: Dict[str, Any]) -> Dict[str, Any]:
        """Ensure at least one field is provided for update."""
        if isinstance(values, dict) and not any(v is not None for v in values.values()):
            raise ValidationError("At least one field must be provided for update")
        return values

    @field_validator("street_address", "city", "state", "zip_code")
    @classmethod
    def clean_strings(cls, v: Optional[str]) -> Optional[str]:
        """Trim extra spaces for optional fields."""
        return " ".join(v.strip().split()) if v else v


class AddressResponse(AddressBase):
    """Response schema for returning address data."""

    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID = Field(..., description="Address ID")
    user_id: uuid.UUID = Field(..., description="User ID associated with this address")
    created_at: datetime = Field(..., description="Registration timestamp")


class AddressListResponse(BaseModel):
    """Response for paginated Address list."""

    items: List[AddressResponse] = Field(..., description="List of addresses")
    total: int = Field(..., ge=0, description="Total number of addresses")
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


class AddressSearchParams(BaseModel):
    """Parameters for searching addresses."""

    search: Optional[str] = Field(
        None,
        min_length=1,
        max_length=100,
        description="Search in city or state",
    )

    @field_validator("search")
    @classmethod
    def clean_search(cls, v: Optional[str]) -> Optional[str]:
        """Trim and normalize search input."""
        return v.strip() if v else v


__all__ = [
    "AddressBase",
    "AddressCreate",
    "AddressUpdate",
    "AddressResponse",
    "AddressListResponse",
    "AddressSearchParams",
]
