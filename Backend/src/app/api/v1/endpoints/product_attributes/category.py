import logging
import uuid
from typing import Dict

from fastapi import APIRouter, Depends, status
from sqlmodel.ext.asyncio.session import AsyncSession

from app.core.config import settings
from app.db.session import get_session
from app.utils.deps import (
    get_current_active_user,
    get_pagination_params,
    rate_limit_api,
    require_admin,
    PaginationParams,
)
from app.schemas.category_schema import (
    CategoryCreate,
    CategoryResponse,
    CategoryListResponse,
    CategoryUpdate,
    CategorySearchParams,
)
from app.models.user_model import User
from app.services.product_attributes.category_service import category_service

logger = logging.getLogger(__name__)

router = APIRouter(
    tags=["Category"],
    prefix=f"{settings.API_V1_STR}/categories",
)


@router.get(
    "/all",
    response_model=CategoryListResponse,
    status_code=status.HTTP_200_OK,
    summary="Get all categories",
    description="Get all categories with pagination and filtering",
    dependencies=[Depends(require_admin), Depends(rate_limit_api)],
)
async def get_all_categories(
    *,
    db: AsyncSession = Depends(get_session),
    current_user: User = Depends(get_current_active_user),
    pagination: PaginationParams = Depends(get_pagination_params),
    search_params: CategorySearchParams = Depends(CategorySearchParams),
):

    return await category_service.get_all_categories(
        db=db,
        current_user=current_user,
        skip=pagination.skip,
        limit=pagination.limit,
        filters=search_params.model_dump(exclude_none=True),
    )


@router.get(
    "/{category_id}",
    response_model=CategoryResponse,
    status_code=status.HTTP_200_OK,
    summary="Get category",
    description="Get a category by its ID",
    dependencies=[Depends(require_admin), Depends(rate_limit_api)],
)
async def get_category_by_id(
    category_id: uuid.UUID,
    *,
    db: AsyncSession = Depends(get_session),
    current_user: User = Depends(get_current_active_user),
):
    return await category_service.get_category_by_id(
        db=db, current_user=current_user, category_id=category_id
    )


@router.post(
    "/",
    response_model=CategoryResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a category",
    description="Create a  category",
    dependencies=[Depends(require_admin), Depends(rate_limit_api)],
)
async def create_category(
    *,
    category_data: CategoryCreate,
    db: AsyncSession = Depends(get_session),
    current_user: User = Depends(get_current_active_user),
):
    return await category_service.create(
        db=db, current_user=current_user, category_in=category_data
    )


@router.patch(
    "/{category_id}",
    response_model=CategoryResponse,
    status_code=status.HTTP_200_OK,
    summary="Update a category",
    description="Update a  category by it's ID",
    dependencies=[Depends(require_admin), Depends(rate_limit_api)],
)
async def update_category(
    *,
    category_id: uuid.UUID,
    category_data: CategoryUpdate,
    db: AsyncSession = Depends(get_session),
    current_user: User = Depends(get_current_active_user),
):
    return await category_service.update(
        db=db,
        current_user=current_user,
        category_data=category_data,
        category_id=category_id,
    )


@router.delete(
    "/{category_id}",
    response_model=Dict[str, str],
    status_code=status.HTTP_200_OK,
    summary="Delete a category",
    description="Delete a  category by it's ID",
    dependencies=[Depends(require_admin), Depends(rate_limit_api)],
)
async def delet_category(
    *,
    category_id: uuid.UUID,
    db: AsyncSession = Depends(get_session),
    current_user: User = Depends(get_current_active_user),
):
    await category_service.delete(
        db=db, current_user=current_user, category_id=category_id
    )

    return {"message": "Category deleted successfully!"}
