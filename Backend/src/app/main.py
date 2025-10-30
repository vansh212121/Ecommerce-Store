from contextlib import asynccontextmanager
from fastapi import FastAPI, Depends
from typing import Dict, Any
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.exception_handler import register_exception_handlers
from app.db.session import db
from app.db.redis_conn import redis_client_instance
from app.utils.deps import get_health_status
from app.api.v1.endpoints import user, auth, admin, promotion, address, product
from app.api.v1.endpoints.product_attributes import size, color, category
from app.db import base

@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Handles application startup and shutdown events.
    Connects to the database and redis.
    """
    await db.connect()
    await redis_client_instance.connect()
    yield
    await redis_client_instance.disconnect()
    await db.disconnect()


def create_application() -> FastAPI:
    """Create and configure the FastAPI application."""

    app = FastAPI(
        title=settings.PROJECT_NAME,
        version=settings.VERSION,
        description=settings.DESCRIPTION,
        lifespan=lifespan,
    )
    # This function is not yet defined, we can comment it out for now
    register_exception_handlers(app)

    # --- API Router Will Go Here ---
    app.include_router(auth.router)
    app.include_router(user.router)
    app.include_router(admin.router)
    app.include_router(color.router)
    app.include_router(category.router)
    app.include_router(size.router)
    app.include_router(promotion.router)
    app.include_router(address.router)
    app.include_router(product.router)

    app.add_middleware(
        CORSMiddleware,
        allow_origins=[str(origin) for origin in settings.CORS_ORIGINS],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    return app


app = create_application()


@app.get("/health", response_model=Dict[str, Any])
async def health_check(health: Dict[str, Any] = Depends(get_health_status)):
    """
    Health check endpoint that provides status and version info.
    """
    return health
