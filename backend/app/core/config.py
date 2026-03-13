from pydantic_settings import BaseSettings
from pydantic import field_validator, model_validator
from typing import Optional, List
import os
import secrets


class Settings(BaseSettings):
    # Database
    DATABASE_URL: str = "postgresql://postgres:postgres@localhost:5432/cursor_market"

    # Database pool settings
    DB_POOL_SIZE: int = 10
    DB_MAX_OVERFLOW: int = 20
    DB_POOL_TIMEOUT: int = 30

    # JWT - SECRET_KEY .env dan o'qilishi SHART
    SECRET_KEY: str = ""
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60  # 1 soat
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # CORS - Ruxsat etilgan domainlar (localhost faqat DEBUG=true yoki ALLOW_LOCALHOST=true da)
    CORS_ORIGINS: List[str] = [
        # Frontend
        "https://aytix.uz",
        "https://www.aytix.uz",
        # Admin panel
        "https://admin.aytix.uz",
        # Backend API (o'z-o'ziga so'rov)
        "https://api.aytix.uz",
        # Seller va boshqa subdomains
        "https://seller.aytix.uz",
        "https://app.aytix.uz",
        "https://dashboard.aytix.uz",
    ]

    # Localhost ni CORS ga qo'shish uchun (staging/testing uchun)
    ALLOW_LOCALHOST: bool = False

    # App
    PROJECT_NAME: str = "AyTiX Marketplace API"
    API_V1_PREFIX: str = "/api/v1"
    DEBUG: bool = False

    @model_validator(mode="after")
    def build_cors_origins(self):
        """DEBUG=true yoki ALLOW_LOCALHOST=true bo'lganda localhost originlarni qo'shish."""
        if self.DEBUG or self.ALLOW_LOCALHOST:
            dev_origins = [
                "http://localhost:3000",
                "http://localhost:3001",
                "http://localhost:3002",
                "http://localhost:3003",
                "http://localhost:3004",
                "http://localhost:3005",
                "http://localhost:3006",
                "http://localhost:3007",
                "http://localhost:3008",
                "http://localhost:3009",
                "http://localhost:3010",
                "http://127.0.0.1:3000",
                "http://127.0.0.1:3001",
                "http://127.0.0.1:3002",
                "http://127.0.0.1:3003",
                "http://127.0.0.1:3004",
                "http://127.0.0.1:3005",
                "http://127.0.0.1:3006",
                "http://127.0.0.1:3007",
                "http://127.0.0.1:3008",
                "http://127.0.0.1:3009",
                "http://127.0.0.1:3010",
            ]
            self.CORS_ORIGINS = list(set(self.CORS_ORIGINS + dev_origins))
        return self

    # Upload settings
    MAX_UPLOAD_SIZE: int = 50 * 1024 * 1024  # 50MB
    ALLOWED_IMAGE_TYPES: List[str] = ["image/jpeg", "image/png", "image/gif", "image/webp"]
    ALLOWED_VIDEO_TYPES: List[str] = ["video/mp4", "video/webm", "video/quicktime"]

    # Telegram Bot settings
    TELEGRAM_BOT_TOKEN: str = ""
    TELEGRAM_BOT_USERNAME: str = "aytixuz_bot"

    # OpenAI settings
    OPENAI_API_KEY: str = ""

    @field_validator("SECRET_KEY", mode="before")
    @classmethod
    def validate_secret_key(cls, v):
        if not v:
            import warnings
            warnings.warn("SECRET_KEY .env faylda o'rnatilmagan! Random key ishlatilmoqda.")
            return secrets.token_urlsafe(64)
        return v

    class Config:
        env_file = ".env"
        case_sensitive = True
        extra = "ignore"


settings = Settings()



