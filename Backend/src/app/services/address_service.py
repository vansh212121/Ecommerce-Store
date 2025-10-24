import logging
from typing import Optional, Dict, Any
import uuid
from datetime import datetime, timezone
from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession
from app.crud.address_crud import address_repository
from app.schemas.address_schema import (
    AddressCreate,
    AddressResponse,
    AddressListResponse,
    AddressUpdate,
)
from app.models.user_model import User
from app.models.address_model import Address
from app.services.cache_service import cache_service
from app.core.exception_utils import raise_for_status
from app.core.exceptions import (
    ResourceNotFound,
    NotAuthorized,
    ValidationError,
)

logger = logging.getLogger(__name__)


class AddressService:
    """Handles all address-related business logic."""

    def __init__(self):
        """
        Initializes the AddressService.
        This version has no arguments, making it easy for FastAPI to use,
        while still allowing for dependency injection during tests.
        """
        self.address_repository = address_repository
        self._logger = logging.getLogger(f"{__name__}.{self.__class__.__name__}")

    def _check_authorization(
        self, *, current_user: User, target_user_address: Address, action: str
    ) -> None:
        """
        Central authorization check. An admin can do anything.
        A non-admin can only perform actions on their own account.

        Args:
            current_user: The user performing the action
            target_user: The user being acted upon
            action: Description of the action for error messages

        Raises:
            NotAuthorized: If user lacks permission for the action
        """

        # Admins have super powers
        if current_user.is_admin:
            return

        is_not_self = str(current_user.id) != str(target_user_address.user_id)
        raise_for_status(
            condition=(is_not_self),
            exception=NotAuthorized,
            detail=f"You are not allowed to perform {action} to this adress",
        )

    async def _load_address_schema_from_db(
        self, *, db: AsyncSession, address_id: uuid.UUID
    ) -> Optional[AddressResponse]:
        """Private helper to load a address from the DB and convert it to a Pydantic schema.
        This is our "loader" function for the cache."""

        address_model = await self.address_repository.get(db=db, obj_id=address_id)
        raise_for_status(
            condition=address_model is None,
            exception=ResourceNotFound,
            detail=f"Address with ID {address_id} not Found.",
            resource_type="Address",
        )
        return AddressResponse.model_validate(address_model)

    async def get_address_by_id(
        self, db: AsyncSession, *, address_id: uuid.UUID, current_user: User
    ) -> Optional[AddressResponse]:
        """Retrieve address by it's ID"""

        address = await cache_service.get_or_set(
            schema_type=AddressResponse,
            obj_id=address_id,
            loader=lambda: self._load_address_schema_from_db(
                db=db, address_id=address_id
            ),
            ttl=300,  # Cache for 5 minutes
        )

        self._check_authorization(
            current_user=current_user,
            target_user_address=address,
            action="Fetch",
        )

        self._logger.debug(f"Address {address_id} retrieved by user {current_user.id}")
        return address

    async def get_all_user_addresses(
        self,
        db: AsyncSession,
        *,
        current_user: User,
        skip: int = 0,
        limit: int = 50,
        filters: Optional[Dict[str, Any]] = None,
        order_by: str = "created_at",
        order_desc: bool = True,
    ) -> AddressListResponse:
        """
        Lists addresses with pagination and filtering.

        Args:
            db: Database session
            current_user: User making the request
            skip: Number of records to skip
            limit: Maximum number of records to return
            filters: Optional filters to apply
        Returns:
            SizeListResponse: Paginated list of users

        Raises:
            NotAuthorized: If user lacks permission to list users
            ValidationError: If pagination parameters are invalid
        """

        # Input validation
        if skip < 0:
            raise ValidationError("Skip parameter must be non-negative")
        if limit <= 0 or limit > 100:
            raise ValidationError("Limit must be between 1 and 100")

        # Delegate fetching to the repository
        addresses, total = await self.address_repository.get_all_by_user(
            db=db,
            skip=skip,
            limit=limit,
            user_id=current_user.id,
            filters=filters,
            order_by=order_by,
            order_desc=order_desc,
        )

        # Calculate pagination info
        page = (skip // limit) + 1
        total_pages = (total + limit - 1) // limit  # Ceiling division

        # Construct the response schema
        response = AddressListResponse(
            items=addresses, total=total, page=page, pages=total_pages, size=limit
        )

        self._logger.info(
            f"Address list retrieved by {current_user.id}: {len(addresses)} addresses returned"
        )
        return response

    async def create(
        self, db: AsyncSession, *, address_in: AddressCreate, current_user: User
    ) -> Address:
        """
        Handles the business logic of creating a new address.
        """
        # . Prepare the user model
        address_dict = address_in.model_dump()
        address_dict["user_id"] = current_user.id
        address_dict["created_at"] = datetime.now(timezone.utc)

        address_to_create = Address(**address_dict)

        if address_to_create.is_default:
            await self.address_repository.unset_other_defaults(
                db=db,
                user_id=current_user.id,
                current_default_id=uuid.uuid4(),  # Pass dummy ID, won't match anything
            )
        else:
            addresses_list, _ = await self.address_repository.get_all_by_user(
                db=db,
                user_id=current_user.id,
                skip=0,
                limit=100,
                filters=None,
                order_by="desc",
                order_desc=True,
            )
            if not addresses_list:
                self._logger.info("Setting first address as default.")
                address_to_create.is_default = True

        # 3. Delegate creation to the repository
        new_address = await self.address_repository.create(
            db=db, db_obj=address_to_create
        )

        if new_address.is_default:
            await self.address_repository.unset_other_defaults(
                db=db, user_id=current_user.id, current_default_id=new_address.id
            )
            await db.commit()
            await db.refresh(new_address)

        self._logger.info(
            f"New address created for user {current_user.id}: {new_address.id}"
        )
        return new_address

    async def update(
        self,
        db: AsyncSession,
        *,
        address_id: uuid.UUID,
        address_data: AddressUpdate,
        current_user: User,
    ) -> Address:
        """Update a address"""

        address_to_update = await self.address_repository.get(db=db, obj_id=address_id)
        raise_for_status(
            condition=(address_to_update is None),
            exception=ResourceNotFound,
            detail=f"Address with id {address_id} not found.",
            resource_type="Address",
        )

        self._check_authorization(
            current_user=current_user,
            target_user_address=address_to_update,
            action="Update",
        )

        update_dict = address_data.model_dump(exclude_unset=True, exclude_none=True)

        setting_to_default = update_dict.get("is_default") is True
        unsetting_default = update_dict.get("is_default") is False

        if setting_to_default and not address_to_update.is_default:
            self._logger.info(
                f"Setting address {address_id} as default for user {current_user.id}. Unsetting others."
            )
            await self.address_repository.unset_other_defaults(
                db=db, user_id=current_user.id, current_default_id=address_id
            )

        elif unsetting_default and address_to_update.is_default:
            # Check if this is the ONLY address, if so, cannot unset default
            all_addresses, _ = await self.address_repository.get_all_by_user(
                db=db,
                user_id=current_user.id,
                skip=0,
                limit=100,
                filters=None,
                order_by="desc",
                order_desc=True,
            )
            if len(all_addresses) <= 1:
                raise ValidationError(
                    "Cannot unset the default status of your only address."
                )

        updated_address = await self.address_repository.update(
            db=db,
            db_obj=address_to_update,
            fields_to_update=update_dict,
        )

        await cache_service.invalidate(Address, address_id)

        self._logger.info(
            f"Address {address_id} updated by user {current_user.id}",
            extra={"updated_fields": list(update_dict.keys())},
        )
        return updated_address

    async def delete(
        self, db: AsyncSession, *, address_id: uuid.UUID, current_user: User
    ) -> Dict[str, str]:
        """Permanently deletes a address."""

        address_to_delete = await self.address_repository.get(db=db, obj_id=address_id)
        raise_for_status(
            condition=(address_to_delete is None),
            exception=ResourceNotFound,
            detail=f"Address with ID {address_id} not found.",
            resource_type="Address",
        )

        self._check_authorization(
            current_user=current_user,
            target_user_address=address_to_delete,
            action="Delete",
        )

        if address_to_delete.is_default:
            all_addresses, _ = await self.address_repository.get_all_by_user(
                db=db,
                user_id=current_user.id,
                skip=0,
                limit=100,
                filters=None,
                order_by="desc",
                order_desc=True,
            )
            if len(all_addresses) <= 1:
                raise ValidationError(
                    "Cannot delete your only address, especially if it's the default."
                )
            else:
                next_default_query = (
                    select(Address)
                    .where(
                        Address.user_id == current_user.id,
                        Address.id != address_id,  # Exclude the one being deleted
                    )
                    .order_by(
                        Address.created_at.asc()
                    )  # Promote the oldest remaining one
                    .limit(1)
                )
                next_default = (
                    await db.execute(next_default_query)
                ).scalar_one_or_none()

                if next_default:
                    # 2. Update the chosen address to be the new default
                    await self.address_repository.update(
                        db=db,
                        db_obj=next_default,
                        fields_to_update={"is_default": True},
                    )
                    self._logger.info(
                        f"Promoted address {next_default.id} to new default after deletion of {address_id}."
                    )

        # 3. Perform the deletion
        await self.address_repository.delete(db=db, obj_id=address_id)

        # 4. Clean up cache and tokens
        await cache_service.invalidate(Address, address_id)

        self._logger.warning(  # Use warning for deletions
            f"Address {address_id} permanently deleted by user {current_user.id}",
            extra={"deleted_address_id": address_id, "deleter_id": current_user.id},
        )
        return {"message": "Address deleted successfully"}


address_service = AddressService()
