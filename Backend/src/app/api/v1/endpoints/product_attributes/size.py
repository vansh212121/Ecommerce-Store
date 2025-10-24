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
from app.schemas.size_schema import (
    SizeResponse,
    SizeListResponse,
    SizeSearchParams,
    SizeCreate,
    SizeUpdate,
)
from app.models.user_model import User
from app.services.product_attributes.size_service import size_service

logger = logging.getLogger(__name__)

router = APIRouter(
    tags=["Size"],
    prefix=f"{settings.API_V1_STR}/sizes",
)

@router.get(
    "/all",
    response_model=SizeListResponse,
    status_code=status.HTTP_200_OK,
    summary="Get all sizes",
    description="Get all sizes with pagination and filtering",
    dependencies=[Depends(require_admin), Depends(rate_limit_api)],
)
async def get_all_sizes(
    *,
    db: AsyncSession = Depends(get_session),
    current_user: User = Depends(get_current_active_user),
    pagination: PaginationParams = Depends(get_pagination_params),
    search_params: SizeSearchParams = Depends(SizeSearchParams),
):

    return await size_service.get_all_sizes(
        db=db,
        current_user=current_user,
        skip=pagination.skip,
        limit=pagination.limit,
        filters=search_params.model_dump(exclude_none=True),
    )


@router.get(
    "/{size_id}",
    response_model=SizeResponse,
    status_code=status.HTTP_200_OK,
    summary="Get size",
    description="Get a size by its ID",
    dependencies=[Depends(require_admin), Depends(rate_limit_api)],
)
async def get_size_by_id(
    size_id: uuid.UUID,
    *,
    db: AsyncSession = Depends(get_session),
    current_user: User = Depends(get_current_active_user),
):
    return await size_service.get_size_by_id(
        db=db, current_user=current_user, size_id=size_id
    )


@router.post(
    "/",
    response_model=SizeResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a size",
    description="Create a  size",
    dependencies=[Depends(require_admin), Depends(rate_limit_api)],
)
async def create_size(
    *,
    size_data: SizeCreate,
    db: AsyncSession = Depends(get_session),
    current_user: User = Depends(get_current_active_user),
):
    return await size_service.create(
        db=db, current_user=current_user, size_in=size_data
    )


@router.patch(
    "/{size_id}",
    response_model=SizeResponse,
    status_code=status.HTTP_200_OK,
    summary="Update a size",
    description="Update a  size by it's ID",
    dependencies=[Depends(require_admin), Depends(rate_limit_api)],
)
async def update_size(
    *,
    size_id: uuid.UUID,
    size_data: SizeUpdate,
    db: AsyncSession = Depends(get_session),
    current_user: User = Depends(get_current_active_user),
):
    return await size_service.update(
        db=db, current_user=current_user, size_data=size_data, size_id=size_id
    )


@router.delete(
    "/{size_id}",
    response_model=Dict[str, str],
    status_code=status.HTTP_200_OK,
    summary="Delete a size",
    description="Delete a  size by it's ID",
    dependencies=[Depends(require_admin), Depends(rate_limit_api)],
)
async def delet_size(
    *,
    size_id: uuid.UUID,
    db: AsyncSession = Depends(get_session),
    current_user: User = Depends(get_current_active_user),
):
    await size_service.delete(db=db, current_user=current_user, size_id=size_id)

    return {"message": "Size deleted successfully!"}


