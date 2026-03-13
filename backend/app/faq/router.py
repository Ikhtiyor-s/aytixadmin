from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from app.core.database import get_db
from app.models import FAQ
from app.dependencies import get_current_admin
from .schemas import (
    FAQCreate, FAQUpdate, FAQResponse, FAQPublicResponse,
    ReorderRequest
)

router = APIRouter(prefix="/faq", tags=["faq"])


# ============== PUBLIC ENDPOINTS ==============

@router.get("/public", response_model=List[FAQPublicResponse])
def get_public_faqs(
    category: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Barcha faol FAQ larni olish (public)"""
    query = db.query(FAQ).filter(FAQ.status == "active")

    if category:
        query = query.filter(FAQ.category == category)

    faqs = query.order_by(FAQ.order.asc(), FAQ.id.asc()).all()
    return faqs


@router.get("/categories", response_model=List[str])
def get_faq_categories(db: Session = Depends(get_db)):
    """Barcha FAQ kategoriyalarini olish (public)"""
    categories = db.query(FAQ.category).filter(
        FAQ.category != None,
        FAQ.category != "",
        FAQ.status == "active"
    ).distinct().all()
    return [c[0] for c in categories if c[0]]


# ============== ADMIN ENDPOINTS ==============

@router.get("", response_model=List[FAQResponse])
def get_all_faqs(
    category: Optional[str] = None,
    status: Optional[str] = None,
    db: Session = Depends(get_db),
    current_admin = Depends(get_current_admin)
):
    """Barcha FAQ larni olish (admin)"""
    query = db.query(FAQ)

    if category:
        query = query.filter(FAQ.category == category)

    if status is not None:
        query = query.filter(FAQ.status == status)

    faqs = query.order_by(FAQ.order.asc(), FAQ.id.asc()).all()
    return faqs


@router.get("/{faq_id}", response_model=FAQResponse)
def get_faq(
    faq_id: int,
    db: Session = Depends(get_db),
    current_admin = Depends(get_current_admin)
):
    """Bitta FAQ ni olish"""
    faq = db.query(FAQ).filter(FAQ.id == faq_id).first()
    if not faq:
        raise HTTPException(status_code=404, detail="FAQ topilmadi")
    return faq


@router.post("", response_model=FAQResponse, status_code=status.HTTP_201_CREATED)
def create_faq(
    data: FAQCreate,
    db: Session = Depends(get_db),
    current_admin = Depends(get_current_admin)
):
    """Yangi FAQ yaratish"""
    # Get max order
    max_order = db.query(FAQ).order_by(FAQ.order.desc()).first()
    new_order = (max_order.order + 1) if max_order else 0

    faq = FAQ(
        question_uz=data.question_uz,
        question_ru=data.question_ru,
        question_en=data.question_en,
        answer_uz=data.answer_uz,
        answer_ru=data.answer_ru,
        answer_en=data.answer_en,
        category=data.category,
        order=data.order if data.order else new_order,
        status=data.status if data.status else "active"
    )

    db.add(faq)
    db.commit()
    db.refresh(faq)
    return faq


@router.put("/{faq_id}", response_model=FAQResponse)
def update_faq(
    faq_id: int,
    data: FAQUpdate,
    db: Session = Depends(get_db),
    current_admin = Depends(get_current_admin)
):
    """FAQ ni yangilash"""
    faq = db.query(FAQ).filter(FAQ.id == faq_id).first()
    if not faq:
        raise HTTPException(status_code=404, detail="FAQ topilmadi")

    update_data = data.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(faq, field, value)

    db.commit()
    db.refresh(faq)
    return faq


@router.delete("/{faq_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_faq(
    faq_id: int,
    db: Session = Depends(get_db),
    current_admin = Depends(get_current_admin)
):
    """FAQ ni o'chirish"""
    faq = db.query(FAQ).filter(FAQ.id == faq_id).first()
    if not faq:
        raise HTTPException(status_code=404, detail="FAQ topilmadi")

    db.delete(faq)
    db.commit()
    return None


@router.post("/reorder", status_code=status.HTTP_200_OK)
def reorder_faqs(
    data: ReorderRequest,
    db: Session = Depends(get_db),
    current_admin = Depends(get_current_admin)
):
    """FAQ tartibini o'zgartirish"""
    for item in data.items:
        faq = db.query(FAQ).filter(FAQ.id == item.id).first()
        if faq:
            faq.order = item.order

    db.commit()
    return {"message": "Tartib muvaffaqiyatli yangilandi"}


@router.patch("/{faq_id}/toggle", response_model=FAQResponse)
def toggle_faq_status(
    faq_id: int,
    db: Session = Depends(get_db),
    current_admin = Depends(get_current_admin)
):
    """FAQ holatini o'zgartirish (faol/nofaol)"""
    faq = db.query(FAQ).filter(FAQ.id == faq_id).first()
    if not faq:
        raise HTTPException(status_code=404, detail="FAQ topilmadi")

    faq.status = "inactive" if faq.status == "active" else "active"
    db.commit()
    db.refresh(faq)
    return faq
