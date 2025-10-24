import logging
import uuid
from typing import Dict

from fastapi import APIRouter, Depends, status, Query
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
from app.schemas.promotion_schema import (
    PromotionCreate,
    PromotionResponse,
    PromotionListResponse,
    PromotionUpdate,
    PromotionSearchParams,
)
from app.models.user_model import User
from app.services.promotion_service import promotion_service

logger = logging.getLogger(__name__)

router = APIRouter(
    tags=["Promotion"],
    prefix=f"{settings.API_V1_STR}/promotions",
)


@router.get(
    "/all",
    response_model=PromotionListResponse,
    status_code=status.HTTP_200_OK,
    summary="Get all promotions",
    description="Get all promotions with pagination and filtering",
    dependencies=[Depends(require_admin), Depends(rate_limit_api)],
)
async def get_all_promotions(
    *,
    db: AsyncSession = Depends(get_session),
    current_user: User = Depends(get_current_active_user),
    pagination: PaginationParams = Depends(get_pagination_params),
    search_params: PromotionSearchParams = Depends(PromotionSearchParams),
    order_by: str = Query("created_at", description="Field to order by"),
    order_desc: bool = Query(True, description="Order descending"),
):

    return await promotion_service.get_all_promotions(
        db=db,
        current_user=current_user,
        skip=pagination.skip,
        limit=pagination.limit,
        filters=search_params.model_dump(exclude_none=True),
        order_by=order_by,
        order_desc=order_desc,
    )


@router.get(
    "/{promotion_id}",
    response_model=PromotionResponse,
    status_code=status.HTTP_200_OK,
    summary="Get promotion",
    description="Get a promotion by its ID",
    dependencies=[Depends(require_admin), Depends(rate_limit_api)],
)
async def get_promotion_by_id(
    promotion_id: uuid.UUID,
    *,
    db: AsyncSession = Depends(get_session),
    current_user: User = Depends(get_current_active_user),
):
    return await promotion_service.get_promotion_by_id(
        db=db, current_user=current_user, promotion_id=promotion_id
    )


@router.post(
    "/",
    response_model=PromotionResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a promotion",
    description="Create a  promotion",
    dependencies=[Depends(require_admin), Depends(rate_limit_api)],
)
async def create_promotion(
    *,
    promotion_data: PromotionCreate,
    db: AsyncSession = Depends(get_session),
    current_user: User = Depends(get_current_active_user),
):
    return await promotion_service.create(
        db=db, current_user=current_user, promotion_in=promotion_data
    )


@router.patch(
    "/{promotion_id}",
    response_model=PromotionResponse,
    status_code=status.HTTP_200_OK,
    summary="Update a promotion",
    description="Update a  promotion by it's ID",
    dependencies=[Depends(require_admin), Depends(rate_limit_api)],
)
async def update_promotion(
    *,
    promotion_id: uuid.UUID,
    promotion_data: PromotionUpdate,
    db: AsyncSession = Depends(get_session),
    current_user: User = Depends(get_current_active_user),
):
    return await promotion_service.update(
        db=db,
        current_user=current_user,
        promotion_data=promotion_data,
        promotion_id=promotion_id,
    )


@router.patch(
    "/{promotion_id}/activate",
    response_model=PromotionResponse,
    status_code=status.HTTP_200_OK,
    summary="Update a promotion status",
    description="Update a  promotion status by it's ID",
    dependencies=[Depends(require_admin), Depends(rate_limit_api)],
)
async def activate_promotion(
    *,
    promotion_id: uuid.UUID,
    db: AsyncSession = Depends(get_session),
    current_user: User = Depends(get_current_active_user),
):
    return await promotion_service.activate(
        db=db,
        current_user=current_user,
        promotion_id=promotion_id,
    )


@router.patch(
    "/{promotion_id}/deactivate",
    response_model=PromotionResponse,
    status_code=status.HTTP_200_OK,
    summary="Update a promotion status",
    description="Update a  promotion status by it's ID",
    dependencies=[Depends(require_admin), Depends(rate_limit_api)],
)
async def deactivate_promotion(
    *,
    promotion_id: uuid.UUID,
    db: AsyncSession = Depends(get_session),
    current_user: User = Depends(get_current_active_user),
):
    return await promotion_service.deactivate(
        db=db,
        current_user=current_user,
        promotion_id=promotion_id,
    )


@router.delete(
    "/{promotion_id}",
    response_model=Dict[str, str],
    status_code=status.HTTP_200_OK,
    summary="Delete a promotion",
    description="Delete a  promotion by it's ID",
    dependencies=[Depends(require_admin), Depends(rate_limit_api)],
)
async def delete_promotion(
    *,
    promotion_id: uuid.UUID,
    db: AsyncSession = Depends(get_session),
    current_user: User = Depends(get_current_active_user),
):
    await promotion_service.delete(
        db=db, current_user=current_user, promotion_id=promotion_id
    )

    return {"message": "Promotion deleted successfully!"}
