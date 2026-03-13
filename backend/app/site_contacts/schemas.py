from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class SiteContactsBase(BaseModel):
    """Site contacts bazaviy schema"""
    phone_primary: str
    phone_secondary: Optional[str] = None
    telegram_username: Optional[str] = None
    telegram_url: Optional[str] = None
    whatsapp_number: Optional[str] = None
    email_primary: Optional[str] = None
    email_secondary: Optional[str] = None
    address_uz: Optional[str] = None
    address_ru: Optional[str] = None
    address_en: Optional[str] = None
    working_hours_uz: Optional[str] = None
    working_hours_ru: Optional[str] = None
    working_hours_en: Optional[str] = None
    additional_info_uz: Optional[str] = None
    additional_info_ru: Optional[str] = None
    additional_info_en: Optional[str] = None


class SiteContactsUpdate(BaseModel):
    """Site contacts yangilash schema"""
    phone_primary: Optional[str] = None
    phone_secondary: Optional[str] = None
    telegram_username: Optional[str] = None
    telegram_url: Optional[str] = None
    whatsapp_number: Optional[str] = None
    email_primary: Optional[str] = None
    email_secondary: Optional[str] = None
    address_uz: Optional[str] = None
    address_ru: Optional[str] = None
    address_en: Optional[str] = None
    working_hours_uz: Optional[str] = None
    working_hours_ru: Optional[str] = None
    working_hours_en: Optional[str] = None
    additional_info_uz: Optional[str] = None
    additional_info_ru: Optional[str] = None
    additional_info_en: Optional[str] = None


class SiteContactsResponse(SiteContactsBase):
    """Site contacts javob schema"""
    id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
