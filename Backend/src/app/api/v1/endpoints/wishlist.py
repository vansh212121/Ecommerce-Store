import logging
import uuid
from typing import Dict
from fastapi import APIRouter, Depends, status

from sqlmodel.ext.asyncio.session import AsyncSession

from app.core.config import settings
from app.schemas.wishlist_schema import WishlistResponse
from app.services.wishlist_service import wishlist_service
from app.models.user_model import User
from app.db.session import get_session
from app.utils.deps import (
    get_current_active_user,
    rate_limit_api,
    require_user,
)


logger = logging.getLogger(__name__)

router = APIRouter(
    tags=["Wishlist"],
    prefix=f"{settings.API_V1_STR}/wishlists",
)


@router.post(
    "/{product_id}",
    response_model=WishlistResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Add products to wishlist",
    description="Add products to wishlist",
    dependencies=[Depends(require_user), Depends(rate_limit_api)],
)
async def add_item_to_wishlist(
    *,
    product_id: uuid.UUID,
    db: AsyncSession = Depends(get_session),
    current_user: User = Depends(get_current_active_user),
):

    return await wishlist_service.add_product_to_wishlist(
        db=db, current_user=current_user, product_id=product_id
    )


@router.delete(
    "/{product_id}",
    response_model=Dict[str, str],
    status_code=status.HTTP_200_OK,
    summary="Delete products to wishlist",
    description="Delete products to wishlist",
    dependencies=[Depends(require_user), Depends(rate_limit_api)],
)
async def remove_product_from_wishlist(
    *,
    product_id: uuid.UUID,
    db: AsyncSession = Depends(get_session),
    current_user: User = Depends(get_current_active_user),
):

    return await wishlist_service.remove_item_from_wishlist(
        db=db, current_user=current_user, product_id=product_id
    )
