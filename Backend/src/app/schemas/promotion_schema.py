import re
import uuid
from datetime import datetime, date, timezone
from typing import Optional, List, Dict, Any
from pydantic import (
    BaseModel,
    Field,
    ConfigDict,
    field_validator,
    model_validator,
)
from app.core.exceptions import ValidationError
from app.models.promotion_model import PromotionStatus, PromotionType


class PromotionBase(BaseModel):
    """
    Shared attributes for promotion creation and updates.
    """

    code: str = Field(
        ...,
        min_length=3,
        max_length=50,
        pattern=r"^[A-Z0-9_-]+$",
        description="Unique promotion code (uppercase letters, numbers, underscores, hyphens allowed).",
        examples=["FIFTYMORE", "SAVE_2025"],
    )
    discount_type: PromotionType = Field(
        ...,
        description="Type of discount (e.g., percentage or fixed).",
        examples=["percentage"],
    )
    value: int = Field(
        ...,
        ge=1,
        description="Discount value. If type is percentage, max is 100.",
        examples=[10],
    )
    expires_at: datetime = Field(
        ...,
        description="Date and time when the promotion code expires.",
        examples=["2025-12-31T23:59:59"],
    )

    # --- Field-level validation ---
    @field_validator("code")
    @classmethod
    def validate_code_format(cls, v: str) -> str:
        """Ensure code is uppercase and alphanumeric."""
        if not re.match(r"^[A-Z0-9_-]+$", v):
            raise ValidationError(
                "Code must contain only uppercase letters, numbers, underscores, or hyphens."
            )
        return v.upper()

    @field_validator("expires_at")
    @classmethod
    def validate_expiry_date(cls, v: Optional[datetime]) -> Optional[datetime]:
        if v:
            aware_now_utc = datetime.now(timezone.utc)
            naive_now_utc = aware_now_utc.replace(tzinfo=None)

            v_naive = v.replace(tzinfo=None) if v.tzinfo else v

            if v_naive <= naive_now_utc:
                raise ValueError("Expiry date must be in the future.")
        return v

    @model_validator(mode="after")
    def check_value_based_on_type(self) -> "PromotionBase":
        if self.discount_type == PromotionType.PERCENTAGE and (
            self.value < 1 or self.value > 100
        ):
            raise ValidationError("Percentage value must be between 1 and 100.")
        if self.discount_type == PromotionType.FIXED and self.value < 1:
            raise ValidationError("Fixed discount value must be positive.")
        return self


class PromotionCreate(PromotionBase):
    """Schema for creating a new promotion."""

    pass


class PromotionUpdate(BaseModel):
    """
    Schema for updating existing promotions.
    At least one field must be provided.
    """

    code: Optional[str] = Field(
        None,
        min_length=3,
        max_length=50,
        pattern=r"^[A-Z0-9_-]+$",
        description="Promotion code to update.",
        examples=["FIFTYMORE"],
    )
    discount_type: Optional[PromotionType] = Field(
        None,
        description="Updated discount type.",
        examples=["fixed"],
    )
    value: Optional[int] = Field(
        None,
        ge=1,
        description="Updated discount value.",
        examples=[15],
    )
    expires_at: Optional[datetime] = Field(
        None,
        description="Updated expiry date.",
        examples=["2026-01-01T00:00:00"],
    )

    # --- Field-level validation ---
    @field_validator("code")
    @classmethod
    def validate_code_format(cls, v: str) -> str:
        """Ensure code is uppercase and alphanumeric."""
        if not re.match(r"^[A-Z0-9_-]+$", v):
            raise ValidationError(
                "Code must contain only uppercase letters, numbers, underscores, or hyphens."
            )
        return v.upper()

    @model_validator(mode="before")
    @classmethod
    def validate_at_least_one_field(cls, values: Dict[str, Any]) -> Dict[str, Any]:
        """Ensure at least one field is provided for update."""
        if isinstance(values, dict) and not any(v is not None for v in values.values()):
            raise ValidationError("At least one field must be provided for update.")
        return values

    @field_validator("expires_at")
    @classmethod
    def validate_expiry_date(cls, v: Optional[datetime]) -> Optional[datetime]:
        if v:

            aware_now_utc = datetime.now(timezone.utc)
            naive_now_utc = aware_now_utc.replace(tzinfo=None)

            v_naive = v.replace(tzinfo=None) if v.tzinfo else v

            if v_naive <= naive_now_utc:
                raise ValueError("Expiry date must be in the future.")
        return v

    @model_validator(mode="after")
    def check_value_based_on_type(self) -> "PromotionUpdate":
        """Validate value based on discount_type if both are provided."""
        discount_type = self.discount_type
        value = self.value

        # Only validate if value is actually being updated
        if value is not None:
            if discount_type == PromotionType.PERCENTAGE and (value < 1 or value > 100):
                raise ValidationError("Percentage value must be between 1 and 100.")
            if discount_type == PromotionType.FIXED and value < 1:
                raise ValidationError("Fixed discount value must be positive.")
        return self


class PromotionResponse(PromotionBase):
    """Response schema for returning promotion data."""

    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID = Field(..., description="Unique promotion ID.")
    status: PromotionStatus = Field(
        ...,
        description="Current status of the promotion code.",
        examples=["active", "inactive"],
    )
    created_at: datetime = Field(
        ..., description="Timestamp when the promotion was created."
    )


class PromotionListResponse(BaseModel):
    """Response for paginated promotions list."""

    items: List[PromotionResponse] = Field(..., description="List of promotions.")
    total: int = Field(..., ge=0, description="Total number of promotions.")
    page: int = Field(..., ge=1, description="Current page number.")
    pages: int = Field(..., ge=0, description="Total number of pages.")
    size: int = Field(..., ge=1, le=100, description="Number of items per page.")

    @property
    def has_next(self) -> bool:
        """Check if there is a next page."""
        return self.page < self.pages

    @property
    def has_previous(self) -> bool:
        """Check if there is a previous page."""
        return self.page > 1


class PromotionSearchParams(BaseModel):
    """Parameters for filtering and searching promotions."""

    search: Optional[str] = Field(
        None,
        min_length=1,
        max_length=100,
        description="Search promotions by code or type.",
        examples=["SAVE", "WELCOME10"],
    )
    status: Optional[PromotionStatus] = Field(
        default=None, description="Filter by promotion status."
    )
    discount_type: Optional[PromotionType] = Field(
        default=None, description="Filter by discount type."
    )
    created_after: Optional[date] = Field(
        None,
        description="Filter promotions created after this date.",
        examples=["2025-01-01"],
    )
    created_before: Optional[date] = Field(
        None,
        description="Filter promotions created before this date.",
        examples=["2025-12-31"],
    )

    @field_validator("search")
    @classmethod
    def clean_search(cls, v: Optional[str]) -> Optional[str]:
        """Trim and normalize search input."""
        return v.strip() if v else v

    @model_validator(mode="after")
    def validate_date_range(self) -> "PromotionSearchParams":
        """Ensure valid chronological date range."""
        if self.created_after and self.created_before:
            if self.created_after > self.created_before:
                raise ValidationError("created_after must be before created_before.")
        return self


__all__ = [
    "PromotionBase",
    "PromotionCreate",
    "PromotionUpdate",
    "PromotionResponse",
    "PromotionListResponse",
    "PromotionSearchParams",
]
