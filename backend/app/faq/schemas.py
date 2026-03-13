from pydantic import BaseModel
from typing import Optional
from datetime import datetime


# ============== FAQ SCHEMAS ==============

class FAQBase(BaseModel):
    """FAQ bazaviy schema"""
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
    """FAQ yaratish uchun schema"""
    pass


class FAQUpdate(BaseModel):
    """FAQ yangilash uchun schema"""
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
    """FAQ javob schema"""
    id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class FAQPublicResponse(BaseModel):
    """Public FAQ response - faqat faol savollar"""
    id: int
    question_uz: str
    question_ru: Optional[str] = None
    question_en: Optional[str] = None
    answer_uz: str
    answer_ru: Optional[str] = None
    answer_en: Optional[str] = None
    category: Optional[str] = None
    order: int

    class Config:
        from_attributes = True


class ReorderItem(BaseModel):
    """Tartibni o'zgartirish uchun"""
    id: int
    order: int


class ReorderRequest(BaseModel):
    """Tartibni o'zgartirish so'rovi"""
    items: list[ReorderItem]
