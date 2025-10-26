import uuid
from typing import Optional, List, Dict, Any
from datetime import datetime, date
from pydantic import (
    BaseModel,
    Field,
    ConfigDict,
    field_validator,
    model_validator,
)
from app.core.exceptions import ValidationError
from app.models.product_model import ProductGender, ProductStatus
from app.schemas.color_schema import ColorResponse
from app.schemas.size_schema import SizeResponse
from app.schemas.category_schema import CategoryResponse


# ===========PRODUCT IMAGES================
class ProductImageBase(BaseModel):
    url: str = Field(..., description="Image URL")
    alt_text: Optional[str] = Field(
        None, max_length=255, description="Alt text for the image"
    )
    order_index: int = Field(0, ge=0, description="Order of image in product gallery")


class ProductImageCreate(ProductImageBase):
    """Schema for creating a product image."""

    pass


class ProductImageUpdate(BaseModel):
    url: Optional[str] = Field(None, description="Image URL")
    alt_text: Optional[str] = Field(
        None, max_length=255, description="Alt text for the image"
    )
    order_index: Optional[int] = Field(None, ge=0, description="Order index")

    @model_validator(mode="before")
    @classmethod
    def validate_at_least_one_field(cls, values: Dict[str, Any]) -> Dict[str, Any]:
        if not any(v is not None for v in values.values()):
            raise ValidationError("At least one field must be provided for update")
        return values


class ProductImageResponse(ProductImageBase):

    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID = Field(..., description="Product Image ID")


# ==============PRODUCT ===============
class ProductBase(BaseModel):
    """Base schema for Product shared fields."""

    name: str = Field(..., min_length=1, max_length=200, description="Product name")
    description: str = Field(
        ..., min_length=1, max_length=10000, description="Product description"
    )
    brand: str = Field(..., min_length=1, max_length=100, description="Brand name")
    status: ProductStatus = Field(..., description="Product status")
    gender: ProductGender = Field(..., description="Product target gender")
    category_id: uuid.UUID = Field(
        ..., description="Category ID this product belongs to"
    )

    @field_validator("name", "brand")
    @classmethod
    def clean_strings(cls, v: str) -> str:
        return " ".join(v.strip().split())


class ProductCreate(ProductBase):
    """Schema for creating a product."""

    images: List[ProductImageCreate] = Field(
        default_factory=list, description="List of images for the product."
    )
    variants: List["ProductVariantCreate"] = Field(
        ..., description="List of variants (at least one required)."
    )  # Use forward ref

    # ------ Optional: Add validator to ensure at least one variant ---
    @field_validator("variants")
    @classmethod
    def check_at_least_one_variant(cls, v):
        if not v:
            raise ValueError("At least one product variant must be provided.")
        return v


class ProductUpdate(BaseModel):
    """Schema for updating a product. At least one field required."""

    name: Optional[str] = Field(
        None, min_length=1, max_length=200, description="Product name"
    )
    description: Optional[str] = Field(
        None, min_length=1, max_length=10000, description="Product description"
    )
    brand: Optional[str] = Field(
        None, min_length=1, max_length=100, description="Brand name"
    )
    status: Optional[ProductStatus] = Field(None, description="Product status")
    gender: Optional[ProductGender] = Field(None, description="Product target gender")
    category_id: Optional[uuid.UUID] = Field(None, description="Category ID")

    @field_validator("name", "brand")
    @classmethod
    def clean_strings(cls, v: Optional[str]) -> Optional[str]:
        if v:
            return " ".join(v.strip().split())
        return v

    @model_validator(mode="before")
    @classmethod
    def validate_at_least_one_field(cls, values: Dict[str, Any]) -> Dict[str, Any]:
        if not any(v is not None for v in values.values()):
            raise ValidationError("At least one field must be provided for update")
        return values


class ProductResponse(ProductBase):
    """Response schema for Product."""

    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID = Field(..., description="Product ID")
    created_at: datetime = Field(..., description="Creation timestamp")
    updated_at: datetime = Field(..., description="Last update timestamp")
    images: List[ProductImageResponse] = Field(
        default_factory=list, description="Product images"
    )
    variants: List["ProductVariantResponse"] = Field(
        default_factory=list, description="Product variants"
    )  # Use forward ref

    # --- FIX 2: Added nested Category details ---
    category: CategoryResponse = Field(..., description="Category details")


# =============PRODUCT VARIANT======================
class ProductVariantBase(BaseModel):
    price_in_cents: int = Field(..., ge=0, description="Price in cents")
    discount_price_in_cents: Optional[int] = Field(
        None, ge=0, description="Discount price in cents"
    )
    stock: int = Field(..., ge=0, description="Stock available")
    sku: str = Field(..., min_length=1, max_length=100, description="Unique SKU")
    size_id: uuid.UUID = Field(..., description="Size ID")
    color_id: uuid.UUID = Field(..., description="Color ID")

    @model_validator(mode="after")
    # --- FIX 2: Use 'self' for mode='after' ---
    def validate_discount(self) -> "ProductVariantBase":
        if self.discount_price_in_cents is not None:
            if self.discount_price_in_cents > self.price_in_cents:
                raise ValidationError("Discount price cannot be greater than price")
        return self

    @field_validator("sku")
    @classmethod
    def clean_sku(cls, v: str) -> str:
        return v.strip()


class ProductVariantCreate(ProductVariantBase):
    """Schema for creating a product variant."""

    pass


class ProductVariantUpdate(BaseModel):
    price_in_cents: Optional[int] = Field(None, ge=0, description="Price in cents")
    discount_price_in_cents: Optional[int] = Field(
        None, ge=0, description="Discount price in cents"
    )
    stock: Optional[int] = Field(None, ge=0, description="Stock available")
    sku: Optional[str] = Field(None, min_length=1, max_length=100, description="SKU")
    size_id: Optional[uuid.UUID] = Field(None, description="Size ID")
    color_id: Optional[uuid.UUID] = Field(None, description="Color ID")

    @model_validator(mode="before")
    @classmethod
    def validate_at_least_one_field(cls, values: Dict[str, Any]) -> Dict[str, Any]:
        if not any(v is not None for v in values.values()):
            raise ValidationError("At least one field must be provided for update")
        return values


class ProductVariantResponse(BaseModel):

    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID = Field(..., description="Product Variant ID")
    product_id: uuid.UUID = Field(..., description="Associated Product ID")
    price_in_cents: int = Field(..., ge=0, description="Price in cents")
    discount_price_in_cents: Optional[int] = Field(
        None, ge=0, description="Discount price in cents"
    )
    stock: int = Field(..., ge=0, description="Stock available")
    sku: str = Field(..., min_length=1, max_length=100, description="Unique SKU")

    size: SizeResponse = Field(..., description="Size details")
    color: ColorResponse = Field(..., description="Color details")


# ======== LIST & SEARCH SCHEMAS ========
class ProductListResponse(BaseModel):
    """Paginated response for products."""

    items: List[ProductResponse] = Field(..., description="List of products")
    total: int = Field(..., ge=0, description="Total number of products")
    page: int = Field(..., ge=1, description="Current page number")
    pages: int = Field(..., ge=0, description="Total pages")
    size: int = Field(..., ge=1, le=100, description="Items per page")

    @property
    def has_next(self) -> bool:
        return self.page < self.pages

    @property
    def has_previous(self) -> bool:
        return self.page > 1


class ProductSearchParams(BaseModel):
    """Parameters for searching products."""

    search: Optional[str] = Field(
        None,
        min_length=1,
        max_length=100,
        description="Search in name, description, brand",
    )
    product_id: Optional[uuid.UUID] = Field(None, description="Filter by product_id")
    category_id: Optional[uuid.UUID] = Field(None, description="Filter by product_id")
    status: Optional[ProductStatus] = Field(None, description="Filter by status")
    gender: Optional[ProductGender] = Field(None, description="Filter by gender")
    created_after: Optional[date] = Field(None, description="Created after date")
    created_before: Optional[date] = Field(None, description="Created before date")

    @field_validator("search")
    @classmethod
    def clean_search(cls, v: Optional[str]) -> Optional[str]:
        return v.strip() if v else v

    @model_validator(mode="after")
    def validate_date_range(self) -> "ProductSearchParams":
        if self.created_after and self.created_before:
            if self.created_after > self.created_before:
                raise ValidationError("created_after must be before created_before")
        return self


class ProductVariantListResponse(BaseModel):
    """Paginated response for products."""

    items: List[ProductVariantResponse] = Field(..., description="List of products")
    total: int = Field(..., ge=0, description="Total number of products")
    page: int = Field(..., ge=1, description="Current page number")
    pages: int = Field(..., ge=0, description="Total pages")
    size: int = Field(..., ge=1, le=100, description="Items per page")

    @property
    def has_next(self) -> bool:
        return self.page < self.pages

    @property
    def has_previous(self) -> bool:
        return self.page > 1


class ProductVariantSearchParams(BaseModel):
    """Parameters for searching products."""

    search: Optional[str] = Field(
        None,
        min_length=1,
        max_length=100,
        description="Search in sku",
    )
    size_id: Optional[uuid.UUID] = Field(None, description="Filter by size_id")
    color_id: Optional[uuid.UUID] = Field(None, description="Filter by color_id")

    @field_validator("search")
    @classmethod
    def clean_search(cls, v: Optional[str]) -> Optional[str]:
        return v.strip() if v else v


__all__ = [
    # Product
    "ProductBase",
    "ProductCreate",
    "ProductUpdate",
    "ProductResponse",
    "ProductListResponse",
    "ProductSearchParams",
    # Product Images
    "ProductImageBase",
    "ProductImageCreate",
    "ProductImageUpdate",
    "ProductImageResponse",
    # Product Variants
    "ProductVariantBase",
    "ProductVariantCreate",
    "ProductVariantUpdate",
    "ProductVariantResponse",
]
