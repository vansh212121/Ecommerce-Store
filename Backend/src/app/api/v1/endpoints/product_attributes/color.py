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
from app.schemas.color_schema import (
    ColorResponse,
    ColorListResponse,
    ColorSearchParams,
    ColorCreate,
    ColorUpdate,
)
from app.models.user_model import User
from app.services.product_attributes.color_service import color_service

logger = logging.getLogger(__name__)

router = APIRouter(
    tags=["Color"],
    prefix=f"{settings.API_V1_STR}/colors",
)


@router.get(
    "/all",
    response_model=ColorListResponse,
    status_code=status.HTTP_200_OK,
    summary="Get all colors",
    description="Get all colors with pagination and filtering",
    dependencies=[Depends(require_admin), Depends(rate_limit_api)],
)
async def get_all_colors(
    *,
    db: AsyncSession = Depends(get_session),
    current_user: User = Depends(get_current_active_user),
    pagination: PaginationParams = Depends(get_pagination_params),
    search_params: ColorSearchParams = Depends(ColorSearchParams),
):

    return await color_service.get_all_colors(
        db=db,
        current_user=current_user,
        skip=pagination.skip,
        limit=pagination.limit,
        filters=search_params.model_dump(exclude_none=True),
    )


@router.get(
    "/{color_id}",
    response_model=ColorResponse,
    status_code=status.HTTP_200_OK,
    summary="Get color",
    description="Get a color by its ID",
    dependencies=[Depends(require_admin), Depends(rate_limit_api)],
)
async def get_color_by_id(
    color_id: uuid.UUID,
    *,
    db: AsyncSession = Depends(get_session),
    current_user: User = Depends(get_current_active_user),
):
    return await color_service.get_color_by_id(
        db=db, current_user=current_user, color_id=color_id
    )


@router.post(
    "/",
    response_model=ColorResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a color",
    description="Create a  color",
    dependencies=[Depends(require_admin), Depends(rate_limit_api)],
)
async def create_color(
    *,
    color_data: ColorCreate,
    db: AsyncSession = Depends(get_session),
    current_user: User = Depends(get_current_active_user),
):
    return await color_service.create(
        db=db, current_user=current_user, color_in=color_data
    )


@router.patch(
    "/{color_id}",
    response_model=ColorResponse,
    status_code=status.HTTP_200_OK,
    summary="Update a color",
    description="Update a  color by it's ID",
    dependencies=[Depends(require_admin), Depends(rate_limit_api)],
)
async def update_color(
    *,
    color_id: uuid.UUID,
    color_data: ColorUpdate,
    db: AsyncSession = Depends(get_session),
    current_user: User = Depends(get_current_active_user),
):
    return await color_service.update(
        db=db, current_user=current_user, color_data=color_data, color_id=color_id
    )


@router.delete(
    "/{color_id}",
    response_model=Dict[str, str],
    status_code=status.HTTP_200_OK,
    summary="Delete a color",
    description="Delete a  color by it's ID",
    dependencies=[Depends(require_admin), Depends(rate_limit_api)],
)
async def delet_color(
    *,
    color_id: uuid.UUID,
    db: AsyncSession = Depends(get_session),
    current_user: User = Depends(get_current_active_user),
):
    await color_service.delete(db=db, current_user=current_user, color_id=color_id)

    return {"message": "Color deleted successfully!"}
