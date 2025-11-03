# app/services/wishlist_service.py
"""
Wishlist service module.

This module provides the business logic layer for Wishlist operations,
handling authorization, validation, and orchestrating repository calls.
"""
import logging
from typing import Dict, Any
import uuid

from sqlmodel.ext.asyncio.session import AsyncSession
from app.schemas.wishlist_schema import (
    WishlistListResponse,
)
from app.models.user_model import User
from app.models.wishlist_model import Wishlist
from app.crud.wishlist_crud import wishlist_repository
from app.crud.product_crud import product_repository
from app.core.exception_utils import raise_for_status
from app.core.exceptions import (
    ResourceNotFound,
    ValidationError,
    ResourceAlreadyExists,
)

logger = logging.getLogger(__name__)


class WishlistService:
    """Handles all wishlist-related business logic."""

    def __init__(self):
        """
        Initializes the WishlistService.
        This version has no arguments, making it easy for FastAPI to use,
        while still allowing for dependency injection during tests.
        """
        self.wishlist_repository = wishlist_repository
        self.product_repository = product_repository
        self._logger = logging.getLogger(f"{__name__}.{self.__class__.__name__}")

    async def get_full_wishlist(
        self,
        db: AsyncSession,
        *,
        current_user: User,
        skip: int = 0,
        limit: int = 50,
        order_by: str = "created_at",
        order_desc: bool = True,
    ) -> WishlistListResponse:

        # Input validation
        if skip < 0:
            raise ValidationError("Skip parameter must be non-negative")
        if limit <= 0 or limit > 100:
            raise ValidationError("Limit must be between 1 and 100")

        # Delegate fetching to the repository
        wishlist, total = await self.wishlist_repository.get_full_wishlist(
            db=db,
            skip=skip,
            limit=limit,
            user_id=current_user.id,
            order_by=order_by,
            order_desc=order_desc,
        )

        # Calculate pagination info
        page = (skip // limit) + 1
        total_pages = (total + limit - 1) // limit  # Ceiling division

        # Construct the response schema
        response = WishlistListResponse(
            items=wishlist, total=total, page=page, pages=total_pages, size=limit
        )

        self._logger.info(
            f"Wishlist list retrieved by {current_user.id}: {len(wishlist)} items returned"
        )
        return response

    async def add_product_to_wishlist(
        self,
        db: AsyncSession,
        *,
        current_user: User,
        product_id: uuid.UUID,
    ) -> Wishlist:
        """Add a product to wishlist"""

        product = await self.product_repository.get(db=db, obj_id=product_id)
        raise_for_status(
            condition=(product is None),
            exception=ResourceNotFound,
            detail=f"Product with id {product_id} not found.",
            resource_type="Product",
        )

        wishlist = await self.wishlist_repository.get_by_user_and_product(
            db=db, user_id=current_user.id, product_id=product_id
        )
        raise_for_status(
            condition=(wishlist is not None),
            exception=ResourceAlreadyExists,
            detail=f"Product already in wishlist",
            resource_type="Wishlist",
        )

        wishlist_to_create = Wishlist(
            user_id=current_user.id,
            product_id=product_id,
            # 'created_at' is handled by the database
        )

        # 3. Delegate creation to the repository
        new_item = await self.wishlist_repository.create(
            db=db, obj_in=wishlist_to_create
        )
        self._logger.info(f"New product added to wishlist: {new_item.product_id}")

        full_new_item = await self.wishlist_repository.get_by_user_and_product(
            db=db, user_id=current_user.id, product_id=product_id
        )

        return full_new_item

    async def remove_item_from_wishlist(
        self, db: AsyncSession, *, current_user: User, product_id: uuid.UUID
    ) -> Dict[str, str]:
        """remove an item from wishlist"""

        wishlist_item = await self.wishlist_repository.get_by_user_and_product(
            db=db, user_id=current_user.id, product_id=product_id
        )
        raise_for_status(
            condition=(wishlist_item is None),
            exception=ResourceNotFound,
            detail=f"Wishlist Item {product_id} not Found",
            resource_type="Wishlist",
        )

        await self.wishlist_repository.delete_by_user_and_product(
            db=db, user_id=current_user.id, product_id=product_id
        )

        return {"message": "Item removed from wishlist"}


wishlist_service = WishlistService()
