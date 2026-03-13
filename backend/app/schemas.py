from pydantic import BaseModel, EmailStr
from typing import Optional, List, Any, Union, Literal
from datetime import datetime
from app.models import UserRole, OrderStatus, ProductStatus, ProjectStatus, ContentStatus, TargetAudience, MessageStatus, PartnerStatus, IntegrationStatus


# User Schemas
class UserBase(BaseModel):
    phone: str
    username: str
    full_name: Optional[str] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: Optional[str] = None


class UserCreate(UserBase):
    password: str


class UserUpdate(BaseModel):
    phone: Optional[str] = None
    username: Optional[str] = None
    full_name: Optional[str] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: Optional[str] = None
    profile_image: Optional[str] = None


class UserResponse(UserBase):
    id: int
    role: UserRole
    is_active: bool
    profile_image: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


class UserAdminResponse(UserBase):
    """Admin uchun foydalanuvchi ma'lumotlari - parol bilan"""
    id: int
    role: UserRole
    is_active: bool
    profile_image: Optional[str] = None
    hashed_password: str
    created_at: datetime

    class Config:
        from_attributes = True


# Auth Schemas
class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    user_id: Optional[int] = None
    username: Optional[str] = None


class RefreshTokenRequest(BaseModel):
    refresh_token: str


# OTP Schemas
class OTPRequest(BaseModel):
    """OTP so'rash uchun"""
    method: str  # 'telegram' yoki 'email'
    phone: Optional[str] = None
    email: Optional[str] = None


class OTPVerify(BaseModel):
    """OTP tasdiqlash uchun"""
    method: str
    phone: Optional[str] = None
    email: Optional[str] = None
    otp_code: str


class PasswordResetRequest(BaseModel):
    """Parolni qayta tiklash uchun"""
    method: str
    phone: Optional[str] = None
    email: Optional[str] = None
    otp_code: str
    new_password: str
    confirm_password: str


class OTPResponse(BaseModel):
    """OTP javob"""
    success: bool
    message: str
    expires_in: Optional[int] = None  # Sekundlarda


class TelegramStatusRequest(BaseModel):
    """Telegram holat so'rash uchun"""
    phone: str


class TelegramStatusResponse(BaseModel):
    """Telegram holat javobi"""
    is_connected: bool
    phone: str
    message: str


# Registration OTP Schemas
class RegisterInitRequest(BaseModel):
    """Ro'yxatdan o'tish boshlash - OTP yuborish uchun"""
    first_name: str
    last_name: str
    phone: str
    email: Optional[str] = None


class RegisterInitResponse(BaseModel):
    """Ro'yxatdan o'tish boshlash javobi"""
    success: bool
    message: str
    session_id: str  # OTP sessiya ID
    expires_in: int  # Sekundlarda


class RegisterVerifyOTPRequest(BaseModel):
    """Ro'yxatdan o'tish OTP tasdiqlash"""
    session_id: str
    otp_code: str


class RegisterCompleteRequest(BaseModel):
    """Ro'yxatdan o'tishni yakunlash - parol kiritish"""
    session_id: str
    password: str
    password_confirm: str


# Category Schemas
class CategoryBase(BaseModel):
    name: str
    description: Optional[str] = None


class CategoryCreate(CategoryBase):
    pass


class CategoryResponse(CategoryBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


# Product Schemas
class ProductBase(BaseModel):
    name: str
    description: Optional[str] = None
    price: float
    stock: int = 0
    image_url: Optional[str] = None
    category_id: Optional[int] = None


class ProductCreate(ProductBase):
    pass


class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    stock: Optional[int] = None
    image_url: Optional[str] = None
    category_id: Optional[int] = None


class ProductResponse(ProductBase):
    id: int
    seller_id: int
    status: ProductStatus
    created_at: datetime
    updated_at: Optional[datetime] = None
    seller: Optional[UserResponse] = None
    category: Optional[CategoryResponse] = None

    class Config:
        from_attributes = True


# Order Schemas
class OrderItemCreate(BaseModel):
    product_id: int
    quantity: int


class OrderItemResponse(BaseModel):
    id: int
    product_id: int
    quantity: int
    price: float
    product: Optional[ProductResponse] = None

    class Config:
        from_attributes = True


class OrderCreate(BaseModel):
    items: List[OrderItemCreate]


class OrderResponse(BaseModel):
    id: int
    buyer_id: int
    total_amount: float
    status: OrderStatus
    created_at: datetime
    updated_at: Optional[datetime] = None
    buyer: Optional[UserResponse] = None
    items: List[OrderItemResponse] = []

    class Config:
        from_attributes = True


# Admin Schemas
class ProductModeration(BaseModel):
    status: ProductStatus


class StatsResponse(BaseModel):
    total_users: int
    total_sellers: int
    total_products: int
    total_orders: int


# Pagination
class PaginationParams(BaseModel):
    page: int = 1
    page_size: int = 20


class PaginatedResponse(BaseModel):
    items: List
    total: int
    page: int
    page_size: int
    pages: int


# Project Schemas
class ProjectBase(BaseModel):
    name_uz: str
    name_ru: Optional[str] = None
    name_en: Optional[str] = None
    description_uz: str
    description_ru: Optional[str] = None
    description_en: Optional[str] = None
    category: str
    subcategory: Optional[str] = None
    technologies: Optional[List[str]] = []
    features: Optional[Any] = []  # Can be List[str] or List[{uz, ru, en}]
    integrations: Optional[List[str]] = []
    color: Optional[str] = "from-primary-500 to-primary-600"
    image_url: Optional[str] = None
    video_url: Optional[str] = None
    images: Optional[List[str]] = []
    status: Optional[ProjectStatus] = ProjectStatus.ACTIVE
    is_top: Optional[bool] = False
    is_new: Optional[bool] = False
    is_verified: Optional[bool] = False


class ProjectCreate(ProjectBase):
    pass


class ProjectUpdate(BaseModel):
    name_uz: Optional[str] = None
    name_ru: Optional[str] = None
    name_en: Optional[str] = None
    description_uz: Optional[str] = None
    description_ru: Optional[str] = None
    description_en: Optional[str] = None
    category: Optional[str] = None
    subcategory: Optional[str] = None
    technologies: Optional[List[str]] = None
    features: Optional[Any] = None  # Can be List[str] or List[{uz, ru, en}]
    integrations: Optional[List[str]] = None
    color: Optional[str] = None
    image_url: Optional[str] = None
    video_url: Optional[str] = None
    images: Optional[List[str]] = None
    status: Optional[ProjectStatus] = None
    is_top: Optional[bool] = None
    is_new: Optional[bool] = None
    is_verified: Optional[bool] = None


class ProjectResponse(ProjectBase):
    id: int
    views: int
    favorites: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# CategoryProject Schemas
class CategoryProjectBase(BaseModel):
    name_uz: str
    name_ru: Optional[str] = None
    name_en: Optional[str] = None
    description_uz: Optional[str] = None
    description_ru: Optional[str] = None
    description_en: Optional[str] = None
    icon: Optional[str] = None
    order: Optional[int] = 0
    is_active: Optional[bool] = True


class CategoryProjectCreate(CategoryProjectBase):
    pass


class CategoryProjectUpdate(BaseModel):
    name_uz: Optional[str] = None
    name_ru: Optional[str] = None
    name_en: Optional[str] = None
    description_uz: Optional[str] = None
    description_ru: Optional[str] = None
    description_en: Optional[str] = None
    icon: Optional[str] = None
    order: Optional[int] = None
    is_active: Optional[bool] = None


class SubcategoryProjectResponse(BaseModel):
    id: int
    name_uz: str
    name_ru: Optional[str] = None
    name_en: Optional[str] = None
    category_id: int  # This stays for response
    order: int
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class CategoryProjectResponse(CategoryProjectBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# SubcategoryProject Schemas
class SubcategoryProjectBase(BaseModel):
    name_uz: str
    name_ru: Optional[str] = None
    name_en: Optional[str] = None
    order: Optional[int] = 0
    is_active: Optional[bool] = True


class SubcategoryProjectCreate(SubcategoryProjectBase):
    # category_id will be set from URL path parameter
    pass


class SubcategoryProjectUpdate(BaseModel):
    name_uz: Optional[str] = None
    name_ru: Optional[str] = None
    name_en: Optional[str] = None
    category_id: Optional[int] = None
    order: Optional[int] = None
    is_active: Optional[bool] = None


# News Schemas
class NewsBase(BaseModel):
    title_uz: str
    title_ru: Optional[str] = None
    title_en: Optional[str] = None
    content_uz: str
    content_ru: Optional[str] = None
    content_en: Optional[str] = None
    image_url: Optional[str] = None
    target: Optional[TargetAudience] = TargetAudience.ALL
    status: Optional[ContentStatus] = ContentStatus.ACTIVE


class NewsCreate(NewsBase):
    pass


class NewsUpdate(BaseModel):
    title_uz: Optional[str] = None
    title_ru: Optional[str] = None
    title_en: Optional[str] = None
    content_uz: Optional[str] = None
    content_ru: Optional[str] = None
    content_en: Optional[str] = None
    image_url: Optional[str] = None
    target: Optional[TargetAudience] = None
    status: Optional[ContentStatus] = None


class NewsResponse(NewsBase):
    id: int
    views: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# Banner Schemas
class BannerBase(BaseModel):
    title_uz: str
    title_ru: Optional[str] = None
    title_en: Optional[str] = None
    description_uz: Optional[str] = None
    description_ru: Optional[str] = None
    description_en: Optional[str] = None
    image_url: Optional[str] = None
    video_url: Optional[str] = None
    link_url: Optional[str] = None
    project_id: Optional[int] = None
    order: Optional[int] = 0
    status: Optional[ContentStatus] = ContentStatus.ACTIVE


class BannerCreate(BannerBase):
    pass


class BannerUpdate(BaseModel):
    title_uz: Optional[str] = None
    title_ru: Optional[str] = None
    title_en: Optional[str] = None
    description_uz: Optional[str] = None
    description_ru: Optional[str] = None
    description_en: Optional[str] = None
    image_url: Optional[str] = None
    video_url: Optional[str] = None
    link_url: Optional[str] = None
    project_id: Optional[int] = None
    order: Optional[int] = None
    status: Optional[ContentStatus] = None


class BannerResponse(BannerBase):
    id: int
    video_url: Optional[str] = None  # Explicitly include video_url
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# Notification Schemas
class NotificationBase(BaseModel):
    title_uz: str
    title_ru: Optional[str] = None
    title_en: Optional[str] = None
    message_uz: Optional[str] = None
    message_ru: Optional[str] = None
    message_en: Optional[str] = None
    icon: Optional[str] = None
    target: Optional[TargetAudience] = TargetAudience.ALL
    scheduled_at: Optional[datetime] = None
    status: Optional[ContentStatus] = ContentStatus.ACTIVE


class NotificationCreate(NotificationBase):
    pass


class NotificationUpdate(BaseModel):
    title_uz: Optional[str] = None
    title_ru: Optional[str] = None
    title_en: Optional[str] = None
    message_uz: Optional[str] = None
    message_ru: Optional[str] = None
    message_en: Optional[str] = None
    icon: Optional[str] = None
    target: Optional[TargetAudience] = None
    scheduled_at: Optional[datetime] = None
    status: Optional[ContentStatus] = None


class NotificationResponse(NotificationBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# Message Schemas
class MessageBase(BaseModel):
    name: str
    email: str
    phone: Optional[str] = None
    subject: str
    message: str


class MessageCreate(MessageBase):
    pass


class MessageUpdate(BaseModel):
    status: Optional[MessageStatus] = None
    reply: Optional[str] = None


class MessageResponse(MessageBase):
    id: int
    status: MessageStatus
    reply: Optional[str] = None
    replied_at: Optional[datetime] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# Partner Schemas
class PartnerBase(BaseModel):
    name: str
    logo_url: Optional[str] = None
    website: Optional[str] = None
    description_uz: Optional[str] = None
    description_ru: Optional[str] = None
    description_en: Optional[str] = None
    partner_type: Optional[str] = None
    order: Optional[int] = 0
    status: Optional[PartnerStatus] = PartnerStatus.ACTIVE


class PartnerCreate(PartnerBase):
    pass


class PartnerUpdate(BaseModel):
    name: Optional[str] = None
    logo_url: Optional[str] = None
    website: Optional[str] = None
    description_uz: Optional[str] = None
    description_ru: Optional[str] = None
    description_en: Optional[str] = None
    partner_type: Optional[str] = None
    order: Optional[int] = None
    status: Optional[PartnerStatus] = None


class PartnerResponse(PartnerBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# Integration Schemas
class IntegrationBase(BaseModel):
    name: str
    icon: Optional[str] = None
    description_uz: Optional[str] = None
    description_ru: Optional[str] = None
    description_en: Optional[str] = None
    category: Optional[str] = None
    docs_url: Optional[str] = None
    status: Optional[IntegrationStatus] = IntegrationStatus.ACTIVE


class IntegrationCreate(IntegrationBase):
    pass


class IntegrationUpdate(BaseModel):
    name: Optional[str] = None
    icon: Optional[str] = None
    description_uz: Optional[str] = None
    description_ru: Optional[str] = None
    description_en: Optional[str] = None
    category: Optional[str] = None
    docs_url: Optional[str] = None
    status: Optional[IntegrationStatus] = None


class IntegrationResponse(IntegrationBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# ============== Integration Project Schemas (Aytix Integration Service Clients) ==============
# Bu marketplace loyihalari (Project) bilan bog'liq EMAS - alohida servis!

class IntegrationProjectBase(BaseModel):
    """Integratsiya loyihasi - Aytix integratsiya xizmati mijozlari"""
    name_uz: str
    name_ru: Optional[str] = None
    name_en: Optional[str] = None
    description_uz: Optional[str] = None
    description_ru: Optional[str] = None
    description_en: Optional[str] = None
    # Business info
    phone: Optional[str] = None
    email: Optional[EmailStr] = None
    website: Optional[str] = None
    address: Optional[str] = None
    inn: Optional[str] = None
    company_type: Optional[Literal['individual', 'llc', 'jsc', 'sole_proprietor', 'other']] = None
    # Contact person
    contact_person: Optional[str] = None
    contact_phone: Optional[str] = None
    # Additional
    logo_url: Optional[str] = None
    notes: Optional[str] = None
    is_active: Optional[bool] = True


class IntegrationProjectCreate(IntegrationProjectBase):
    pass


class IntegrationProjectUpdate(BaseModel):
    name_uz: Optional[str] = None
    name_ru: Optional[str] = None
    name_en: Optional[str] = None
    description_uz: Optional[str] = None
    description_ru: Optional[str] = None
    description_en: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[EmailStr] = None
    website: Optional[str] = None
    address: Optional[str] = None
    inn: Optional[str] = None
    company_type: Optional[Literal['individual', 'llc', 'jsc', 'sole_proprietor', 'other']] = None
    contact_person: Optional[str] = None
    contact_phone: Optional[str] = None
    logo_url: Optional[str] = None
    notes: Optional[str] = None
    is_active: Optional[bool] = None


class IntegrationProjectResponse(IntegrationProjectBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class IntegrationProjectMinimal(BaseModel):
    """Minimal integration project info for connected integration response"""
    id: int
    name_uz: str
    name_ru: Optional[str] = None
    name_en: Optional[str] = None

    class Config:
        from_attributes = True


# Connected Integration Schemas (IntegrationProject + Service integration)
class ConnectedIntegrationBase(BaseModel):
    integration_project_id: Optional[int] = None  # Qaysi integratsiya loyihasiga ulanadi (Nonbor, etc)
    integration_id: str  # Servis nomi (yandex_delivery, click, amocrm)
    name: str
    config: dict = {}
    is_active: bool = True


class ConnectedIntegrationCreate(ConnectedIntegrationBase):
    pass


class ConnectedIntegrationUpdate(BaseModel):
    integration_project_id: Optional[int] = None
    integration_id: Optional[str] = None
    name: Optional[str] = None
    config: Optional[dict] = None
    is_active: Optional[bool] = None


class ConnectedIntegrationResponse(ConnectedIntegrationBase):
    id: int
    integration_project: Optional[IntegrationProjectMinimal] = None  # Loyiha ma'lumotlari
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class IntegrationTestRequest(BaseModel):
    integration_id: str
    config: dict


class IntegrationTestResponse(BaseModel):
    success: bool
    message: str


# AI Feature Schemas
class AIFeatureBase(BaseModel):
    name_uz: str
    name_ru: Optional[str] = None
    name_en: Optional[str] = None
    description_uz: Optional[str] = None
    description_ru: Optional[str] = None
    description_en: Optional[str] = None
    icon: Optional[str] = None
    category: Optional[str] = None
    is_available: Optional[bool] = True
    order: Optional[int] = 0


class AIFeatureCreate(AIFeatureBase):
    pass


class AIFeatureUpdate(BaseModel):
    name_uz: Optional[str] = None
    name_ru: Optional[str] = None
    name_en: Optional[str] = None
    description_uz: Optional[str] = None
    description_ru: Optional[str] = None
    description_en: Optional[str] = None
    icon: Optional[str] = None
    category: Optional[str] = None
    is_available: Optional[bool] = None
    order: Optional[int] = None


class AIFeatureResponse(AIFeatureBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# ============ FAQ SCHEMAS ============

class FAQBase(BaseModel):
    question_uz: str
    question_ru: Optional[str] = None
    question_en: Optional[str] = None
    answer_uz: str
    answer_ru: Optional[str] = None
    answer_en: Optional[str] = None
    category: Optional[str] = None
    order: Optional[int] = 0
    status: Optional[str] = "active"


class FAQCreate(FAQBase):
    pass


class FAQUpdate(BaseModel):
    question_uz: Optional[str] = None
    question_ru: Optional[str] = None
    question_en: Optional[str] = None
    answer_uz: Optional[str] = None
    answer_ru: Optional[str] = None
    answer_en: Optional[str] = None
    category: Optional[str] = None
    order: Optional[int] = None
    status: Optional[str] = None


class FAQResponse(FAQBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True



