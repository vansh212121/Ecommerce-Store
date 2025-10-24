import logging
import uuid
from typing import Dict

from fastapi import APIRouter, Depends, status, Query
from sqlmodel.ext.asyncio.session import AsyncSession

from app.core.config import settings
from app.db.session import get_session
from app.utils.deps import (
    get_current_active_user,
    rate_limit_api,
    require_user,
)
from app.schemas.address_schema import (
    AddressCreate,
    AddressUpdate,
    AddressResponse,
)
from app.models.user_model import User
from app.services.address_service import address_service

logger = logging.getLogger(__name__)

router = APIRouter(
    tags=["Address"],
    prefix=f"{settings.API_V1_STR}/addresses",
)


@router.get(
    "/{address_id}",
    response_model=AddressResponse,
    status_code=status.HTTP_200_OK,
    summary="Get address",
    description="Get a address by its ID",
    dependencies=[Depends(require_user), Depends(rate_limit_api)],
)
async def get_address_by_id(
    address_id: uuid.UUID,
    *,
    db: AsyncSession = Depends(get_session),
    current_user: User = Depends(get_current_active_user),
):
    return await address_service.get_address_by_id(
        db=db, current_user=current_user, address_id=address_id
    )


@router.post(
    "/",
    response_model=AddressResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a address",
    description="Create a  address",
    dependencies=[Depends(require_user), Depends(rate_limit_api)],
)
async def create_address(
    *,
    address_data: AddressCreate,
    db: AsyncSession = Depends(get_session),
    current_user: User = Depends(get_current_active_user),
):
    return await address_service.create(
        db=db, current_user=current_user, address_in=address_data
    )


@router.patch(
    "/{address_id}",
    response_model=AddressUpdate,
    status_code=status.HTTP_200_OK,
    summary="Update a address",
    description="Update a  address by it's ID",
    dependencies=[Depends(require_user), Depends(rate_limit_api)],
)
async def update_address(
    *,
    address_id: uuid.UUID,
    address_data: AddressUpdate,
    db: AsyncSession = Depends(get_session),
    current_user: User = Depends(get_current_active_user),
):
    return await address_service.update(
        db=db,
        current_user=current_user,
        address_data=address_data,
        address_id=address_id,
    )


@router.delete(
    "/{address_id}",
    response_model=Dict[str, str],
    status_code=status.HTTP_200_OK,
    summary="Delete a address",
    description="Delete a  address by it's ID",
    dependencies=[Depends(require_user), Depends(rate_limit_api)],
)
async def delet_address(
    *,
    address_id: uuid.UUID,
    db: AsyncSession = Depends(get_session),
    current_user: User = Depends(get_current_active_user),
):
    await address_service.delete(
        db=db, current_user=current_user, address_id=address_id
    )

    return {"message": "Address deleted successfully!"}
