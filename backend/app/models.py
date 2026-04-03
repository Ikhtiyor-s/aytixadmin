from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey, DateTime, Enum as SQLEnum, Text, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base
import enum


class UserRole(str, enum.Enum):
    USER = "user"
    SELLER = "seller"
    ADMIN = "admin"


class OrderStatus(str, enum.Enum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    SHIPPED = "shipped"
    DELIVERED = "delivered"
    CANCELLED = "cancelled"


class ProductStatus(str, enum.Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"


class ProjectStatus(str, enum.Enum):
    active = "active"
    inactive = "inactive"
    # backward compat aliases
    ACTIVE = "active"
    INACTIVE = "inactive"


class ContentStatus(str, enum.Enum):
    active = "active"
    inactive = "inactive"
    ACTIVE = "active"
    INACTIVE = "inactive"


class TargetAudience(str, enum.Enum):
    all = "all"
    users = "users"
    sellers = "sellers"
    admins = "admins"
    ALL = "all"
    USERS = "users"
    SELLERS = "sellers"
    ADMINS = "admins"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    phone = Column(String, unique=True, index=True, nullable=False)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=True)
    first_name = Column(String, nullable=True)
    last_name = Column(String, nullable=True)
    email = Column(String, nullable=True)
    profile_image = Column(String, nullable=True)
    role = Column(SQLEnum(UserRole), default=UserRole.USER, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    products = relationship("Product", back_populates="seller")
    orders = relationship("Order", back_populates="buyer")


class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True, nullable=False)
    description = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    products = relationship("Product", back_populates="category")


class CategoryProject(Base):
    """Categories for Projects (Dasturlar va Xizmatlar)"""
    __tablename__ = "category_projects"

    id = Column(Integer, primary_key=True, index=True)

    # Multilingual fields
    name_uz = Column(String, nullable=False, index=True)
    name_ru = Column(String, nullable=True)
    name_en = Column(String, nullable=True)

    description_uz = Column(Text, nullable=True)
    description_ru = Column(Text, nullable=True)
    description_en = Column(Text, nullable=True)

    # Icon/emoji for category
    icon = Column(String, nullable=True)

    # Ordering
    order = Column(Integer, default=0)

    # Status
    is_active = Column(Boolean, default=True)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


class SubcategoryProject(Base):
    """Subcategories for Project Categories"""
    __tablename__ = "subcategory_projects"

    id = Column(Integer, primary_key=True, index=True)

    # Multilingual fields
    name_uz = Column(String, nullable=False)
    name_ru = Column(String, nullable=True)
    name_en = Column(String, nullable=True)

    # Foreign key
    category_id = Column(Integer, ForeignKey("category_projects.id", ondelete="CASCADE"), nullable=False)

    # Ordering
    order = Column(Integer, default=0)

    # Status
    is_active = Column(Boolean, default=True)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, index=True)
    description = Column(Text, nullable=True)
    price = Column(Float, nullable=False)
    stock = Column(Integer, default=0, nullable=False)
    image_url = Column(String, nullable=True)
    
    # Video/GIF
    video_url = Column(String, nullable=True)
    status = Column(SQLEnum(ProductStatus), default=ProductStatus.PENDING, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Foreign keys
    seller_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=True)

    # Relationships
    seller = relationship("User", back_populates="products")
    category = relationship("Category", back_populates="products")
    order_items = relationship("OrderItem", back_populates="product")


class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    total_amount = Column(Float, nullable=False)
    status = Column(SQLEnum(OrderStatus), default=OrderStatus.PENDING, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Foreign keys
    buyer_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    # Relationships
    buyer = relationship("User", back_populates="orders")
    items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")


class OrderItem(Base):
    __tablename__ = "order_items"

    id = Column(Integer, primary_key=True, index=True)
    quantity = Column(Integer, nullable=False)
    price = Column(Float, nullable=False)

    # Foreign keys
    order_id = Column(Integer, ForeignKey("orders.id"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)

    # Relationships
    order = relationship("Order", back_populates="items")
    product = relationship("Product", back_populates="order_items")


class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)

    # Multilingual fields
    name_uz = Column(String, nullable=False)
    name_ru = Column(String, nullable=True)
    name_en = Column(String, nullable=True)

    description_uz = Column(Text, nullable=False)
    description_ru = Column(Text, nullable=True)
    description_en = Column(Text, nullable=True)

    # Project details
    category = Column(String, nullable=False, index=True)
    subcategory = Column(String, nullable=True)
    technologies = Column(JSON, nullable=True)  # Array of technologies
    features = Column(JSON, nullable=True)  # Array of features
    integrations = Column(JSON, nullable=True)  # Array of integrations

    # Visual
    color = Column(String, default="from-primary-500 to-primary-600")
    image_url = Column(String, nullable=True)
    
    # Video/GIF
    video_url = Column(String, nullable=True)
    images = Column(JSON, nullable=True)  # Array of additional image URLs

    # Stats
    views = Column(Integer, default=0)
    favorites = Column(Integer, default=0)

    # Status
    status = Column(SQLEnum(ProjectStatus), default=ProjectStatus.ACTIVE, nullable=False)
    is_top = Column(Boolean, default=False)
    is_new = Column(Boolean, default=False)
    is_verified = Column(Boolean, default=False)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


class News(Base):
    """Yangiliklar - News/Articles"""
    __tablename__ = "news"

    id = Column(Integer, primary_key=True, index=True)

    # Multilingual title
    title_uz = Column(String, nullable=False)
    title_ru = Column(String, nullable=True)
    title_en = Column(String, nullable=True)

    # Multilingual content
    content_uz = Column(Text, nullable=False)
    content_ru = Column(Text, nullable=True)
    content_en = Column(Text, nullable=True)

    # Image
    image_url = Column(String, nullable=True)
    
    # Video/GIF
    video_url = Column(String, nullable=True)

    # Target audience
    target = Column(SQLEnum(TargetAudience), default=TargetAudience.ALL)

    # Stats
    views = Column(Integer, default=0)

    # Status
    status = Column(SQLEnum(ContentStatus), default=ContentStatus.ACTIVE)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


class Banner(Base):
    """Bannerlar - Promotional banners"""
    __tablename__ = "banners"

    id = Column(Integer, primary_key=True, index=True)

    # Multilingual title
    title_uz = Column(String, nullable=False)
    title_ru = Column(String, nullable=True)
    title_en = Column(String, nullable=True)

    # Multilingual description
    description_uz = Column(Text, nullable=True)
    description_ru = Column(Text, nullable=True)
    description_en = Column(Text, nullable=True)

    # Image
    image_url = Column(String, nullable=True)
    
    # Video/GIF
    video_url = Column(String, nullable=True)

    # Link
    link_url = Column(String, nullable=True)

    # Project ID for linking to a project
    project_id = Column(Integer, nullable=True)

    # Order/priority
    order = Column(Integer, default=0)

    # Status
    status = Column(SQLEnum(ContentStatus), default=ContentStatus.ACTIVE)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


class Notification(Base):
    """Xabarnomalar - Push notifications"""
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)

    # Multilingual title
    title_uz = Column(String, nullable=False)
    title_ru = Column(String, nullable=True)
    title_en = Column(String, nullable=True)

    # Multilingual message
    message_uz = Column(Text, nullable=True)
    message_ru = Column(Text, nullable=True)
    message_en = Column(Text, nullable=True)

    # Icon
    icon = Column(String, nullable=True)

    # Target audience
    target = Column(SQLEnum(TargetAudience), default=TargetAudience.ALL)

    # Schedule date
    scheduled_at = Column(DateTime(timezone=True), nullable=True)

    # Status
    status = Column(SQLEnum(ContentStatus), default=ContentStatus.ACTIVE)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


class MessageStatus(str, enum.Enum):
    NEW = "new"
    READ = "read"
    REPLIED = "replied"
    ARCHIVED = "archived"


class Message(Base):
    """Xabarlar - Contact messages from users"""
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True, index=True)

    # Sender info
    name = Column(String, nullable=False)
    email = Column(String, nullable=False)
    phone = Column(String, nullable=True)

    # Message content
    subject = Column(String, nullable=False)
    message = Column(Text, nullable=False)

    # Status
    status = Column(SQLEnum(MessageStatus), default=MessageStatus.NEW)

    # Admin reply
    reply = Column(Text, nullable=True)
    replied_at = Column(DateTime(timezone=True), nullable=True)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


class PartnerStatus(str, enum.Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"
    PENDING = "pending"


class Partner(Base):
    """Hamkorlar - Partners/Clients"""
    __tablename__ = "partners"

    id = Column(Integer, primary_key=True, index=True)

    # Partner info
    name = Column(String, nullable=False)
    logo_url = Column(String, nullable=True)
    website = Column(String, nullable=True)

    # Description
    description_uz = Column(Text, nullable=True)
    description_ru = Column(Text, nullable=True)
    description_en = Column(Text, nullable=True)

    # Type (client, technology partner, etc)
    partner_type = Column(String, nullable=True)

    # Order/priority
    order = Column(Integer, default=0)

    # Status
    status = Column(SQLEnum(PartnerStatus), default=PartnerStatus.ACTIVE)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


class IntegrationStatus(str, enum.Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"
    COMING_SOON = "coming_soon"


class Integration(Base):
    """Integratsiyalar - Available integrations"""
    __tablename__ = "integrations"

    id = Column(Integer, primary_key=True, index=True)

    # Integration info
    name = Column(String, nullable=False)
    icon = Column(String, nullable=True)

    # Description
    description_uz = Column(Text, nullable=True)
    description_ru = Column(Text, nullable=True)
    description_en = Column(Text, nullable=True)

    # Category (payment, crm, analytics, etc)
    category = Column(String, nullable=True)

    # Documentation/API link
    docs_url = Column(String, nullable=True)

    # Status
    status = Column(SQLEnum(IntegrationStatus), default=IntegrationStatus.ACTIVE)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


class IntegrationProject(Base):
    """Integratsiya loyihalari - Aytix integratsiya xizmati mijozlari (Nonbor, va boshqalar)
    Bu marketplace loyihalari (Project) bilan bog'liq EMAS - alohida servis!"""
    __tablename__ = "integration_projects"

    id = Column(Integer, primary_key=True, index=True)

    # Multilingual fields
    name_uz = Column(String, nullable=False)
    name_ru = Column(String, nullable=True)
    name_en = Column(String, nullable=True)

    description_uz = Column(Text, nullable=True)
    description_ru = Column(Text, nullable=True)
    description_en = Column(Text, nullable=True)

    # Business info
    phone = Column(String, nullable=True)
    email = Column(String, nullable=True)
    website = Column(String, nullable=True)
    address = Column(String, nullable=True)
    inn = Column(String, nullable=True)
    company_type = Column(String, nullable=True)  # individual, llc, jsc, sole_proprietor, other

    # Contact person
    contact_person = Column(String, nullable=True)
    contact_phone = Column(String, nullable=True)

    # Additional
    logo_url = Column(String, nullable=True)
    notes = Column(Text, nullable=True)

    # Status
    is_active = Column(Boolean, default=True)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationship - ulangan integratsiyalar
    connected_integrations = relationship("ConnectedIntegration", back_populates="integration_project")


class ConnectedIntegration(Base):
    """Ulangan integratsiyalar - loyiha + servis konfiguratsiyasi bilan"""
    __tablename__ = "connected_integrations"

    id = Column(Integer, primary_key=True, index=True)

    # Which integration project this belongs to (Nonbor, etc) - NOT marketplace project!
    integration_project_id = Column(Integer, ForeignKey("integration_projects.id"), nullable=True, index=True)

    # Integration identifier (amocrm, zadarma, telegram, etc)
    integration_id = Column(String, nullable=False, index=True)

    # Display name
    name = Column(String, nullable=False)

    # Configuration (JSON - API keys, tokens, etc)
    config = Column(JSON, nullable=False, default={})

    # Status
    is_active = Column(Boolean, default=True)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationship
    integration_project = relationship("IntegrationProject", back_populates="connected_integrations")


class FAQ(Base):
    """Ko'p so'raladigan savollar - Frequently Asked Questions"""
    __tablename__ = "faqs"

    id = Column(Integer, primary_key=True, index=True)

    # Multilingual question
    question_uz = Column(String, nullable=False)
    question_ru = Column(String, nullable=True)
    question_en = Column(String, nullable=True)

    # Multilingual answer
    answer_uz = Column(Text, nullable=False)
    answer_ru = Column(Text, nullable=True)
    answer_en = Column(Text, nullable=True)

    # Category for grouping
    category = Column(String, nullable=True)

    # Order/priority
    order = Column(Integer, default=0, index=True)

    # Status (active/inactive as string for DB compatibility)
    status = Column(String, default="active")

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


class AuthMethod(str, enum.Enum):
    TELEGRAM = "telegram"
    EMAIL = "email"


class OTPRequest(Base):
    """OTP so'rovlari - Rate limiting uchun"""
    __tablename__ = "otp_requests"

    id = Column(Integer, primary_key=True, index=True)
    phone = Column(String, nullable=True, index=True)
    email = Column(String, nullable=True, index=True)
    otp_code = Column(String(6), nullable=False)
    expires_at = Column(DateTime(timezone=True), nullable=False)
    is_used = Column(Boolean, default=False)
    attempts = Column(Integer, default=0)  # Noto'g'ri urinishlar soni
    blocked_until = Column(DateTime(timezone=True), nullable=True)  # Bloklangan vaqt
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class PasswordReset(Base):
    """Parolni qayta tiklash so'rovlari"""
    __tablename__ = "password_resets"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    otp_code = Column(String(6), nullable=False)
    expires_at = Column(DateTime(timezone=True), nullable=False)
    is_used = Column(Boolean, default=False)
    attempts = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationship
    user = relationship("User")


class TelegramUser(Base):
    """Telegram foydalanuvchilari - chat_id saqlash uchun"""
    __tablename__ = "telegram_users"

    id = Column(Integer, primary_key=True, index=True)
    phone = Column(String, unique=True, index=True, nullable=False)  # +998XXXXXXXXX formatda
    chat_id = Column(String, unique=True, nullable=False)  # Telegram chat ID
    telegram_username = Column(String, nullable=True)  # @username
    first_name = Column(String, nullable=True)
    last_name = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


class AIFeature(Base):
    """AI xususiyatlari - AI Features and capabilities"""
    __tablename__ = "ai_features"

    id = Column(Integer, primary_key=True, index=True)

    # Feature info
    name_uz = Column(String, nullable=False)
    name_ru = Column(String, nullable=True)
    name_en = Column(String, nullable=True)

    # Description
    description_uz = Column(Text, nullable=True)
    description_ru = Column(Text, nullable=True)
    description_en = Column(Text, nullable=True)

    # Icon/emoji
    icon = Column(String, nullable=True)

    # Category (chatbot, analytics, automation, etc)
    category = Column(String, nullable=True)

    # Is it available
    is_available = Column(Boolean, default=True)

    # Order
    order = Column(Integer, default=0)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


# ============== FOOTER MODELS ==============

class FooterSection(Base):
    """Footer bo'limlari - Ijtimoiy tarmoqlar, Hamkorlar, Sahifalar, Bog'lanish"""
    __tablename__ = "footer_sections"

    id = Column(Integer, primary_key=True, index=True)

    # Multilingual title
    title_uz = Column(String, nullable=False)
    title_ru = Column(String, nullable=True)
    title_en = Column(String, nullable=True)

    # Slug for URL
    slug = Column(String(100), unique=True, nullable=False, index=True)

    # Order/priority
    order = Column(Integer, default=0, index=True)

    # Status
    is_active = Column(Boolean, default=True)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    items = relationship("FooterItem", back_populates="section", cascade="all, delete-orphan", order_by="FooterItem.order")


class FooterItem(Base):
    """Footer elementlari - har bir bo'limdagi linklar"""
    __tablename__ = "footer_items"

    id = Column(Integer, primary_key=True, index=True)

    # Section relation
    section_id = Column(Integer, ForeignKey("footer_sections.id", ondelete="CASCADE"), nullable=False, index=True)

    # Multilingual title
    title_uz = Column(String, nullable=False)
    title_ru = Column(String, nullable=True)
    title_en = Column(String, nullable=True)

    # Link URL
    link_url = Column(String(500), nullable=True)

    # Icon (FontAwesome class yoki emoji)
    icon = Column(String(100), nullable=True)

    # Icon type: 'fontawesome', 'emoji', 'image', 'svg'
    icon_type = Column(String(20), default='fontawesome')

    # Open in new tab
    new_tab = Column(Boolean, default=False)

    # Order/priority
    order = Column(Integer, default=0, index=True)

    # Status
    is_active = Column(Boolean, default=True)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    section = relationship("FooterSection", back_populates="items")


class FooterSocialLink(Base):
    """Ijtimoiy tarmoq linklari - alohida jadval"""
    __tablename__ = "footer_social_links"

    id = Column(Integer, primary_key=True, index=True)

    # Platform name
    platform = Column(String(50), nullable=False)  # telegram, instagram, facebook, youtube, tiktok, linkedin

    # Multilingual title (optional override)
    title_uz = Column(String, nullable=True)
    title_ru = Column(String, nullable=True)
    title_en = Column(String, nullable=True)

    # Link URL
    link_url = Column(String(500), nullable=False)

    # Icon (auto-generated based on platform or custom)
    icon = Column(String(100), nullable=True)

    # Order/priority
    order = Column(Integer, default=0, index=True)

    # Status
    is_active = Column(Boolean, default=True)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


class FooterContact(Base):
    """Bog'lanish ma'lumotlari"""
    __tablename__ = "footer_contacts"

    id = Column(Integer, primary_key=True, index=True)

    # Contact type: phone, email, address, telegram, whatsapp
    contact_type = Column(String(50), nullable=False)

    # Multilingual label
    label_uz = Column(String, nullable=True)
    label_ru = Column(String, nullable=True)
    label_en = Column(String, nullable=True)

    # Value (phone number, email, address, etc)
    value = Column(String(500), nullable=False)

    # Link URL (tel:, mailto:, https://)
    link_url = Column(String(500), nullable=True)

    # Icon
    icon = Column(String(100), nullable=True)

    # Order/priority
    order = Column(Integer, default=0, index=True)

    # Status
    is_active = Column(Boolean, default=True)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


class SiteContacts(Base):
    """Sayt aloqa ma'lumotlari (ContactModal uchun)"""
    __tablename__ = "site_contacts"

    id = Column(Integer, primary_key=True, index=True)

    # Phone numbers
    phone_primary = Column(String(50), nullable=False)
    phone_secondary = Column(String(50), nullable=True)

    # Telegram
    telegram_username = Column(String(100), nullable=True)
    telegram_url = Column(String(255), nullable=True)

    # WhatsApp
    whatsapp_number = Column(String(50), nullable=True)

    # Email
    email_primary = Column(String(100), nullable=True)
    email_secondary = Column(String(100), nullable=True)

    # Address (multilingual)
    address_uz = Column(Text, nullable=True)
    address_ru = Column(Text, nullable=True)
    address_en = Column(Text, nullable=True)

    # Working hours (multilingual)
    working_hours_uz = Column(String(255), nullable=True)
    working_hours_ru = Column(String(255), nullable=True)
    working_hours_en = Column(String(255), nullable=True)

    # Additional info (multilingual)
    additional_info_uz = Column(Text, nullable=True)
    additional_info_ru = Column(Text, nullable=True)
    additional_info_en = Column(Text, nullable=True)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())



