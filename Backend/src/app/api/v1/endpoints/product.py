import logging
import uuid
from typing import Dict
from fastapi import APIRouter, Depends, status, Query

from sqlmodel.ext.asyncio.session import AsyncSession

from app.core.config import settings
from app.schemas.product_schema import (
    ProductCreate,
    ProductUpdate,
    ProductResponse,
    ProductListResponse,
    ProductSearchParams,
    # PRODUCT VARIANT
    ProductVariantCreate,
    ProductVariantResponse,
    ProductVariantUpdate,
    ProductVariantListResponse,
    ProductVariantSearchParams,
    # PRODUCT IMAGE
    ProductImageCreate,
    ProductImageResponse,
)
from app.models.user_model import User
from app.db.session import get_session
from app.utils.deps import (
    get_current_active_user,
    rate_limit_api,
    require_admin,
    require_user,
    PaginationParams,
    get_pagination_params,
)
from app.services.product_service import product_service

logger = logging.getLogger(__name__)

router = APIRouter(
    tags=["Product"],
    prefix=f"{settings.API_V1_STR}/products",
)


# ------ Admin Operations ------
@router.get(
    "/all",
    status_code=status.HTTP_200_OK,
    response_model=ProductListResponse,
    summary="Get all products",
    description="Get product bwith pagination and filtering support admin only",
    dependencies=[Depends(rate_limit_api), Depends(require_admin)],
)
async def get_all_products(
    *,
    db: AsyncSession = Depends(get_session),
    current_user: User = Depends(get_current_active_user),
    pagination: PaginationParams = Depends(get_pagination_params),
    search_params: ProductSearchParams = Depends(ProductSearchParams),
    order_by: str = Query("created_at", description="Field to order by"),
    order_desc: bool = Query(True, description="Order descending"),
):

    return await product_service.get_all_products(
        db=db,
        current_user=current_user,
        skip=pagination.skip,
        limit=pagination.limit,
        filters=search_params.model_dump(exclude_none=True),
        order_by=order_by,
        order_desc=order_desc,
    )


@router.get(
    "/{product_id}/variants",
    status_code=status.HTTP_200_OK,
    response_model=ProductVariantListResponse,
    summary="Get all product variants",
    description="Get produc_variants with pagination and filtering support admin only",
    dependencies=[Depends(rate_limit_api), Depends(require_admin)],
)
async def get_all_variants(
    product_id: uuid.UUID,
    *,
    db: AsyncSession = Depends(get_session),
    current_user: User = Depends(get_current_active_user),
    pagination: PaginationParams = Depends(get_pagination_params),
    search_params: ProductVariantSearchParams = Depends(ProductVariantSearchParams),
):
    return await product_service.get_all_variants(
        db=db,
        current_user=current_user,
        product_id=product_id,
        skip=pagination.skip,
        limit=pagination.limit,
        filters=search_params.model_dump(exclude_none=True),
    )


@router.get(
    "/{product_id}",
    status_code=status.HTTP_200_OK,
    response_model=ProductResponse,
    summary="Get product",
    description="Get product by it's ID for the admin only",
    dependencies=[Depends(rate_limit_api), Depends(require_admin)],
)
async def get_product_by_id(
    product_id: uuid.UUID,
    *,
    db: AsyncSession = Depends(get_session),
    current_user: User = Depends(get_current_active_user),
):
    """Fetch a product by it's ID"""

    return await product_service.get_product_by_id(
        db=db, current_user=current_user, product_id=product_id
    )


@router.post(
    "/",
    status_code=status.HTTP_201_CREATED,
    response_model=ProductResponse,
    summary="Create product",
    description="Create a product admin only",
    dependencies=[Depends(rate_limit_api), Depends(require_admin)],
)
async def create_product(
    *,
    product_data: ProductCreate,
    db: AsyncSession = Depends(get_session),
    current_user: User = Depends(get_current_active_user),
):
    return await product_service.create_product(
        db=db, product_data=product_data, current_user=current_user
    )


@router.patch(
    "/{product_id}",
    status_code=status.HTTP_200_OK,
    response_model=ProductResponse,
    summary="Update product",
    description="Update a product by it's ID admin only",
    dependencies=[Depends(rate_limit_api), Depends(require_admin)],
)
async def update_product(
    *,
    product_id: uuid.UUID,
    product_data: ProductUpdate,
    db: AsyncSession = Depends(get_session),
    current_user: User = Depends(get_current_active_user),
):

    return await product_service.update_product(
        db=db,
        current_user=current_user,
        product_data=product_data,
        product_id=product_id,
    )


@router.delete(
    "/{product_id}/delete",
    status_code=status.HTTP_200_OK,
    response_model=Dict[str, str],
    summary="Deactivate product",
    description="Deactivate a product by it's ID admin only",
    dependencies=[Depends(rate_limit_api), Depends(require_admin)],
)
async def deactivate_product(
    *,
    product_id: uuid.UUID,
    db: AsyncSession = Depends(get_session),
    current_user: User = Depends(get_current_active_user),
):

    return await product_service.soft_delete_product(
        db=db, current_user=current_user, product_id=product_id
    )


@router.delete(
    "/{product_id}",
    status_code=status.HTTP_200_OK,
    response_model=Dict[str, str],
    summary="Delete product",
    description="Delete a product by it's ID admin only",
    dependencies=[Depends(rate_limit_api), Depends(require_admin)],
)
async def delete_product(
    *,
    product_id: uuid.UUID,
    db: AsyncSession = Depends(get_session),
    current_user: User = Depends(get_current_active_user),
):

    return await product_service.delete_product(
        db=db,
        current_user=current_user,
        product_id=product_id,
    )


# ==================PRODUCT IMAGE==================


@router.get(
    "/images/{image_id}",
    status_code=status.HTTP_200_OK,
    response_model=ProductImageResponse,
    summary="Get product_image",
    description="Get a product_image by it's ID admin only",
    dependencies=[Depends(rate_limit_api), Depends(require_admin)],
)
async def get_image_by_id(
    image_id: uuid.UUID,
    *,
    db: AsyncSession = Depends(get_session),
    current_user: User = Depends(get_current_active_user),
):

    return await product_service.get_image_by_id(
        db=db, current_user=current_user, image_id=image_id
    )


@router.post(
    "/{product_id}/images",
    status_code=status.HTTP_201_CREATED,
    response_model=ProductImageResponse,
    summary="Create a product_image",
    description="Create a product_image by it's Product ID admin only",
    dependencies=[Depends(rate_limit_api), Depends(require_admin)],
)
async def add_image_to_product(
    product_id: uuid.UUID,
    image_data: ProductImageCreate,
    *,
    db: AsyncSession = Depends(get_session),
    current_user: User = Depends(get_current_active_user),
):

    return await product_service.add_image_to_product(
        db=db, current_user=current_user, product_id=product_id, image_data=image_data
    )


@router.delete(
    "/images/{image_id}",
    status_code=status.HTTP_201_CREATED,
    response_model=Dict[str, str],
    summary="Delete a product_image",
    description="Delete a product_image by it's ID admin only",
    dependencies=[Depends(rate_limit_api), Depends(require_admin)],
)
async def delete_image(
    image_id: uuid.UUID,
    *,
    db: AsyncSession = Depends(get_session),
    current_user: User = Depends(get_current_active_user),
):

    return await product_service.delete_image(
        db=db, current_user=current_user, image_id=image_id
    )


# ==================PRODUCT VARIANT IMAGE==================


@router.get(
    "/variants/{variant_id}",
    status_code=status.HTTP_200_OK,
    response_model=ProductVariantResponse,
    summary="Get product_variant",
    description="Get a product_variant by it's ID admin only",
    dependencies=[Depends(rate_limit_api), Depends(require_admin)],
)
async def get_variant_by_id(
    variant_id: uuid.UUID,
    *,
    db: AsyncSession = Depends(get_session),
    current_user: User = Depends(get_current_active_user),
):

    return await product_service.get_product_variant_by_id(
        db=db, current_user=current_user, product_variant_id=variant_id
    )


@router.post(
    "/{product_id}/variants",
    status_code=status.HTTP_201_CREATED,
    response_model=ProductVariantResponse,
    summary="Create a product_variant",
    description="Create a product_variant by it's Product ID admin only",
    dependencies=[Depends(rate_limit_api), Depends(require_admin)],
)
async def add_variant_to_product(
    product_id: uuid.UUID,
    variant_data: ProductVariantCreate,
    *,
    db: AsyncSession = Depends(get_session),
    current_user: User = Depends(get_current_active_user),
):

    return await product_service.add_variant_to_product(
        db=db,
        current_user=current_user,
        product_id=product_id,
        variant_data=variant_data,
    )


@router.patch(
    "/{product_id}/variants/{variant_id}",
    status_code=status.HTTP_200_OK,
    response_model=ProductVariantResponse,
    summary="Update a product_variant",
    description="Update a product_variant by it's Product ID admin only",
    dependencies=[Depends(rate_limit_api), Depends(require_admin)],
)
async def update_variant(
    *,
    variant_id: uuid.UUID,
    product_id: uuid.UUID,
    variant_data: ProductVariantUpdate,
    db: AsyncSession = Depends(get_session),
    current_user: User = Depends(get_current_active_user),
):

    return await product_service.update_variant(
        db=db,
        current_user=current_user,
        variant_data=variant_data,
        variant_id=variant_id,
        product_id=product_id,
    )


@router.patch(
    "/{product_id}/variants/{variant_id}",
    status_code=status.HTTP_200_OK,
    response_model=Dict[str, str],
    summary="Delete a product_variant",
    description="Delete a product_variant by it's Product ID admin only",
    dependencies=[Depends(rate_limit_api), Depends(require_admin)],
)
async def delete_variant(
    *,
    variant_id: uuid.UUID,
    product_id: uuid.UUID,
    db: AsyncSession = Depends(get_session),
    current_user: User = Depends(get_current_active_user),
):

    return await product_service.delete_variant(
        db=db, current_user=current_user, variant_id=variant_id, product_id=product_id
    )
