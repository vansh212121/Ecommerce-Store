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
    Text,
    Integer,
    CheckConstraint,
    UniqueConstraint,
)
from sqlalchemy.dialects.postgresql import (
    UUID as PG_UUID,
)
from sqlmodel import Field, SQLModel, Relationship

if TYPE_CHECKING:
    from .wishlist_model import Wishlist
    from .cart_model import CartItem
    from .order_model import OrderItem


class ProductGender(str, PyEnum):
    MEN = "men"
    WOMEN = "women"
    UNISEX = "unisex"


class ProductStatus(str, PyEnum):
    ACTIVE = "active"
    INACTIVE = "inactive"


class Size(SQLModel, table=True):
    __tablename__ = "sizes"

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
    name: str = Field(
        sa_column=Column(String(100), unique=True, index=True, nullable=False)
    )


class Color(SQLModel, table=True):
    __tablename__ = "colors"

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
    name: str = Field(
        sa_column=Column(String(100), unique=True, index=True, nullable=False)
    )
    hex_code: Optional[str] = Field(
        sa_column=Column(
            String(7),  # Tighter constraint for hex codes (e.g., #FFFFFF)
            unique=True,  # A hex code should also be unique
            default=None,
        )
    )


class Category(SQLModel, table=True):
    __tablename__ = "categories"
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
    name: str = Field(
        sa_column=Column(String(200), unique=True, index=True, nullable=False)
    )
    slug: str = Field(
        sa_column=Column(String(255), unique=True, index=True, nullable=False)
    )

    # Relationship: A category can have many products
    products: List["Product"] = Relationship(
        back_populates="category",
        sa_relationship_kwargs={
            "passive_deletes": False
        },  # Will raise error if products exist
    )


class Product(SQLModel, table=True):
    __tablename__ = "products"

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
    name: str = Field(
        sa_column=Column(String(200), unique=True, index=True, nullable=False)
    )
    description: str = Field(sa_column=Column(Text, nullable=False))
    brand: str = Field(sa_column=Column(String(100), index=True, nullable=False))

    status: ProductStatus = Field(
        sa_column=Column(
            SAEnum(ProductStatus),
            nullable=False,
            index=True,
            default=ProductStatus.ACTIVE,
        )
    )
    gender: ProductGender = Field(
        sa_column=Column(
            SAEnum(ProductGender), nullable=False, index=True, default=ProductGender.MEN
        )
    )

    category_id: uuid.UUID = Field(
        foreign_key="categories.id", index=True, nullable=False
    )

    # Relationships
    images: List["ProductImage"] = Relationship(
        back_populates="product",
        sa_relationship_kwargs={"cascade": "all, delete-orphan"},
    )
    variants: List["ProductVariant"] = Relationship(
        back_populates="product",
        sa_relationship_kwargs={"cascade": "all, delete-orphan"},
    )
    category: "Category" = Relationship(back_populates="products")
    wishlisted_by: List["Wishlist"] = Relationship(
        back_populates="product",
        sa_relationship_kwargs={"cascade": "all, delete-orphan"},
    )

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


class ProductImage(SQLModel, table=True):
    __tablename__ = "product_images"

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
    url: str = Field(sa_column=Column(String(1024), nullable=False))
    alt_text: Optional[str] = Field(sa_column=Column(String(255), default=None))
    order_index: int = Field(default=0)

    # Relationships
    product_id: uuid.UUID = Field(foreign_key="products.id", index=True, nullable=False)
    product: "Product" = Relationship(back_populates="images")


class ProductVariant(SQLModel, table=True):
    __tablename__ = "product_variants"

    __table_args__ = (
        # Ensures you can't have two rows for the same product/size/color combination
        UniqueConstraint(
            "product_id", "size_id", "color_id", name="uq_product_size_color"
        ),
        CheckConstraint(
            "discount_price_in_cents <= price_in_cents", name="check_discount_valid"
        ),
    )

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
    
    # --- Price & Stock (The fields you asked about) ---
    price_in_cents: int = Field(sa_column=Column(Integer, default=0, nullable=False))
    discount_price_in_cents: Optional[int] = Field(
        sa_column=Column(Integer, default=None)
    )
    stock: int = Field(sa_column=Column(Integer, default=0, nullable=False))

    # --- Unique Identifier ---
    sku: str = Field(
        sa_column=Column(String(100), unique=True, index=True, nullable=False)
    )

    product_id: uuid.UUID = Field(foreign_key="products.id", index=True, nullable=False)
    size_id: uuid.UUID = Field(foreign_key="sizes.id", index=True, nullable=False)
    color_id: uuid.UUID = Field(foreign_key="colors.id", index=True, nullable=False)

    # Relationship
    product: "Product" = Relationship(back_populates="variants")
    size: "Size" = Relationship()
    color: "Color" = Relationship()
    cart_items: List["CartItem"] = Relationship(
        back_populates="product_variant",
        sa_relationship_kwargs={"passive_deletes": False},  # Prevent deletion
    )
    order_items: List["OrderItem"] = Relationship(
        back_populates="product_variant",
        sa_relationship_kwargs={"passive_deletes": False},  # Prevent deletion
    )

