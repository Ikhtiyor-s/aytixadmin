from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


# ============== FOOTER SECTION SCHEMAS ==============

class FooterSectionBase(BaseModel):
    title_uz: str
    title_ru: Optional[str] = None
    title_en: Optional[str] = None
    slug: str
    order: Optional[int] = 0
    is_active: Optional[bool] = True


class FooterSectionCreate(FooterSectionBase):
    pass


class FooterSectionUpdate(BaseModel):
    title_uz: Optional[str] = None
    title_ru: Optional[str] = None
    title_en: Optional[str] = None
    slug: Optional[str] = None
    order: Optional[int] = None
    is_active: Optional[bool] = None


class FooterItemBase(BaseModel):
    section_id: int
    title_uz: str
    title_ru: Optional[str] = None
    title_en: Optional[str] = None
    link_url: Optional[str] = None
    icon: Optional[str] = None
    icon_type: Optional[str] = "fontawesome"
    new_tab: Optional[bool] = False
    order: Optional[int] = 0
    is_active: Optional[bool] = True


class FooterItemCreate(FooterItemBase):
    pass


class FooterItemUpdate(BaseModel):
    section_id: Optional[int] = None
    title_uz: Optional[str] = None
    title_ru: Optional[str] = None
    title_en: Optional[str] = None
    link_url: Optional[str] = None
    icon: Optional[str] = None
    icon_type: Optional[str] = None
    new_tab: Optional[bool] = None
    order: Optional[int] = None
    is_active: Optional[bool] = None


class FooterItemResponse(FooterItemBase):
    id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class FooterSectionResponse(FooterSectionBase):
    id: int
    items: List[FooterItemResponse] = []
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class FooterSectionSimpleResponse(FooterSectionBase):
    id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# ============== SOCIAL LINKS SCHEMAS ==============

class FooterSocialLinkBase(BaseModel):
    platform: str  # telegram, instagram, facebook, youtube, tiktok, linkedin
    title_uz: Optional[str] = None
    title_ru: Optional[str] = None
    title_en: Optional[str] = None
    link_url: str
    icon: Optional[str] = None
    order: Optional[int] = 0
    is_active: Optional[bool] = True


class FooterSocialLinkCreate(FooterSocialLinkBase):
    pass


class FooterSocialLinkUpdate(BaseModel):
    platform: Optional[str] = None
    title_uz: Optional[str] = None
    title_ru: Optional[str] = None
    title_en: Optional[str] = None
    link_url: Optional[str] = None
    icon: Optional[str] = None
    order: Optional[int] = None
    is_active: Optional[bool] = None


class FooterSocialLinkResponse(FooterSocialLinkBase):
    id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# ============== CONTACT SCHEMAS ==============

class FooterContactBase(BaseModel):
    contact_type: str  # phone, email, address, telegram, whatsapp
    label_uz: Optional[str] = None
    label_ru: Optional[str] = None
    label_en: Optional[str] = None
    value: str
    link_url: Optional[str] = None
    icon: Optional[str] = None
    order: Optional[int] = 0
    is_active: Optional[bool] = True


class FooterContactCreate(FooterContactBase):
    pass


class FooterContactUpdate(BaseModel):
    contact_type: Optional[str] = None
    label_uz: Optional[str] = None
    label_ru: Optional[str] = None
    label_en: Optional[str] = None
    value: Optional[str] = None
    link_url: Optional[str] = None
    icon: Optional[str] = None
    order: Optional[int] = None
    is_active: Optional[bool] = None


class FooterContactResponse(FooterContactBase):
    id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# ============== FULL FOOTER RESPONSE ==============

class FooterFullResponse(BaseModel):
    """To'liq footer ma'lumotlari - public endpoint uchun"""
    sections: List[FooterSectionResponse] = []
    social_links: List[FooterSocialLinkResponse] = []
    contacts: List[FooterContactResponse] = []

    class Config:
        from_attributes = True


# ============== REORDER SCHEMAS ==============

class ReorderItem(BaseModel):
    id: int
    order: int


class ReorderRequest(BaseModel):
    items: List[ReorderItem]
