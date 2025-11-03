import uuid
from datetime import datetime
from typing import List
from pydantic import BaseModel, Field, ConfigDict
from .product_schema import ProductResponse


class WishlistResponse(BaseModel):

    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID = Field(..., description="Wishlist Id")
    created_at: datetime = Field(..., description="Date item was added")
    product: ProductResponse = Field(...)


class WishlistListResponse(BaseModel):
    """Response for paginated wishlist list."""

    items: List[WishlistResponse] = Field(..., description="List of wishlist items")
    total: int = Field(..., ge=0, description="Total number of wishlist items")
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


__all__ = ["WishlistResponse", "WishlistListResponse"]
