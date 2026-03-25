"""
AyTiX Marketplace API
Production-ready FastAPI backend
"""
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from app.core.config import settings
from app.core.database import engine, Base
import logging
import os
import time

# Logger setup
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Import routers
from app.auth.router import router as auth_router
from app.users.router import router as users_router
from app.products.router import router as products_router
from app.categories.router import router as categories_router
from app.categories.project_router import router as project_categories_router
from app.orders.router import router as orders_router
from app.admin.router import router as admin_router
from app.stats.router import router as stats_router
from app.projects.router import router as projects_router
from app.uploads.router import router as uploads_router
from app.content.router import router as content_router
from app.messages.router import router as messages_router
from app.partners.router import router as partners_router
from app.integrations.router import router as integrations_router
from app.ai_features.router import router as ai_features_router
from app.translate.router import router as translate_router
from app.footer.router import router as footer_router
from app.faq.router import router as faq_router
from app.site_contacts.router import router as site_contacts_router

# Import models for table creation
from app.models import SiteContacts

# Create database tables
Base.metadata.create_all(bind=engine)

# Auto-migration: mavjud jadvallarga yangi ustunlar qo'shish
def auto_migrate():
    """SQLAlchemy create_all faqat yangi jadvallar yaratadi.
    Bu funksiya mavjud jadvallarga yangi ustunlarni qo'shadi."""
    from sqlalchemy import text, inspect
    try:
        inspector = inspect(engine)
        # Projects jadvaliga yangi ustunlar
        if inspector.has_table("projects"):
            existing_cols = {col["name"] for col in inspector.get_columns("projects")}
            migrations = [
                ("is_verified", "ALTER TABLE projects ADD COLUMN is_verified BOOLEAN DEFAULT FALSE"),
                ("video_url", "ALTER TABLE projects ADD COLUMN video_url VARCHAR"),
            ]
            with engine.begin() as conn:
                for col_name, sql in migrations:
                    if col_name not in existing_cols:
                        conn.execute(text(sql))
                        logger.info(f"Migration: projects.{col_name} ustuni qo'shildi")
    except Exception as e:
        logger.warning(f"Auto-migration xatolik (davom etiladi): {e}")

auto_migrate()

# Rate Limiter - DDoS va brute force himoyasi
limiter = Limiter(key_func=get_remote_address, default_limits=["200/minute"])

# FastAPI app
app = FastAPI(
    title=settings.PROJECT_NAME,
    description="AyTiX Marketplace - Professional API for Projects and Services",
    version="2.0.0",
    docs_url="/docs" if settings.DEBUG else None,
    redoc_url="/redoc" if settings.DEBUG else None,
    openapi_url="/openapi.json" if settings.DEBUG else None,
)

# Rate limiter state
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)


# CORS middleware - eng birinchi qo'shilishi kerak (LIFO: birinchi ishlaydi)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["Content-Disposition", "X-Total-Count"],
    max_age=3600
)

# GZip compression
app.add_middleware(GZipMiddleware, minimum_size=1000)

# Trusted Host himoyasi - faqat ruxsat etilgan hostlar
if not settings.DEBUG:
    app.add_middleware(
        TrustedHostMiddleware,
        allowed_hosts=["api.aytix.uz", "*.aytix.uz", "localhost"]
    )


# Security headers middleware
SECURITY_HEADERS = {
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "X-XSS-Protection": "1; mode=block",
    "Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
}

@app.middleware("http")
async def security_headers_middleware(request: Request, call_next):
    # OPTIONS preflight requestlarni skip
    if request.method == "OPTIONS":
        response = await call_next(request)
        return response

    # CSRF himoyasi - POST/PUT/DELETE uchun Origin tekshirish
    if request.method in ("POST", "PUT", "DELETE", "PATCH") and not settings.DEBUG:
        origin = request.headers.get("origin", "")
        referer = request.headers.get("referer", "")
        allowed = any(
            origin.startswith(o) or referer.startswith(o)
            for o in settings.CORS_ORIGINS
        )
        # API-to-API (no origin) yoki ruxsat etilgan origin
        if origin and not allowed:
            return JSONResponse(
                status_code=403,
                content={"detail": "CSRF: Origin ruxsat etilmagan"}
            )

    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    response.headers["X-Process-Time"] = str(round(process_time * 1000, 2)) + "ms"
    for header_name, header_value in SECURITY_HEADERS.items():
        response.headers[header_name] = header_value
    return response


# Upload directories setup
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOAD_DIR = os.path.join(os.path.dirname(BASE_DIR), "uploads")
IMAGES_DIR = os.path.join(UPLOAD_DIR, "images")
VIDEOS_DIR = os.path.join(UPLOAD_DIR, "videos")

# Create directories
os.makedirs(IMAGES_DIR, exist_ok=True)
os.makedirs(VIDEOS_DIR, exist_ok=True)
logger.info(f"Upload directory: {UPLOAD_DIR}")

# Mount static files
try:
    app.mount("/uploads/images", StaticFiles(directory=IMAGES_DIR), name="images")
    app.mount("/uploads/videos", StaticFiles(directory=VIDEOS_DIR), name="videos")
    app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")
except Exception as e:
    logger.warning(f"Could not mount static files: {e}")

# Include routers
app.include_router(auth_router, prefix=settings.API_V1_PREFIX)
app.include_router(users_router, prefix=settings.API_V1_PREFIX)
app.include_router(products_router, prefix=settings.API_V1_PREFIX)
app.include_router(categories_router, prefix=settings.API_V1_PREFIX)
app.include_router(project_categories_router, prefix=settings.API_V1_PREFIX)
app.include_router(orders_router, prefix=settings.API_V1_PREFIX)
app.include_router(admin_router, prefix=settings.API_V1_PREFIX)
app.include_router(stats_router, prefix=settings.API_V1_PREFIX)
app.include_router(projects_router, prefix=settings.API_V1_PREFIX)
app.include_router(uploads_router, prefix=settings.API_V1_PREFIX)
app.include_router(content_router, prefix=settings.API_V1_PREFIX)
app.include_router(messages_router, prefix=settings.API_V1_PREFIX)
app.include_router(partners_router, prefix=settings.API_V1_PREFIX)
app.include_router(integrations_router, prefix=settings.API_V1_PREFIX)
app.include_router(ai_features_router, prefix=settings.API_V1_PREFIX)
app.include_router(translate_router, prefix=settings.API_V1_PREFIX)
app.include_router(footer_router, prefix=settings.API_V1_PREFIX)
app.include_router(faq_router, prefix=settings.API_V1_PREFIX)
app.include_router(site_contacts_router, prefix=settings.API_V1_PREFIX)


# Root endpoint
@app.get("/")
def root():
    """Root endpoint with API info."""
    return {
        "message": "AyTiX Marketplace API",
        "version": "2.0.0",
        "docs": "/docs",
        "health": "/health"
    }


# Health check endpoint
@app.get("/health")
def health():
    """Health check endpoint for monitoring and load balancers."""
    return {
        "status": "healthy",
        "version": "2.0.0",
        "timestamp": time.time()
    }


# API v1 health check
@app.get("/api/v1/health")
def api_health():
    """API v1 health check endpoint."""
    return {"status": "healthy", "version": "2.0.0", "timestamp": time.time()}


# CORS headerlarini response ga qo'shish uchun helper
def _add_cors_headers(request: Request, response: JSONResponse) -> JSONResponse:
    """Error response larga ham CORS headerlarini qo'shish."""
    origin = request.headers.get("origin", "")
    if origin in settings.CORS_ORIGINS:
        response.headers["access-control-allow-origin"] = origin
        response.headers["access-control-allow-credentials"] = "true"
        response.headers["vary"] = "Origin"
    return response


# HTTP Exception handler
@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request: Request, exc: StarletteHTTPException):
    response = JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail}
    )
    return _add_cors_headers(request, response)


# Validation Exception handler
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    logger.warning(f"Validation error: {exc.errors()}")
    response = JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "detail": "Validation error",
            "errors": exc.errors()
        }
    )
    return _add_cors_headers(request, response)


# Global Exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Handle all unhandled exceptions."""
    logger.error(f"Unhandled exception on {request.url}: {str(exc)}", exc_info=True)
    response = JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "detail": "Internal server error",
            "message": "An unexpected error occurred"
        }
    )
    return _add_cors_headers(request, response)


# Startup event
@app.on_event("startup")
async def startup_event():
    """Log startup information."""
    logger.info("=" * 50)
    logger.info("AyTiX Marketplace API starting...")
    logger.info(f"Version: 2.0.0")
    logger.info(f"Debug mode: {settings.DEBUG}")
    logger.info(f"API prefix: {settings.API_V1_PREFIX}")
    logger.info(f"Upload directory: {UPLOAD_DIR}")
    logger.info(f"API docs available at /docs")
    logger.info("=" * 50)


# Shutdown event
@app.on_event("shutdown")
async def shutdown_event():
    """Cleanup on shutdown."""
    logger.info("AyTiX Marketplace API shutting down...")
