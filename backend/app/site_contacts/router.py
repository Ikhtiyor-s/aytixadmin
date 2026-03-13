from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models import SiteContacts
from app.dependencies import get_current_admin
from .schemas import SiteContactsResponse, SiteContactsUpdate

router = APIRouter(prefix="/site-contacts", tags=["site-contacts"])


# ============== PUBLIC ENDPOINTS ==============

@router.get("/public", response_model=SiteContactsResponse)
def get_public_site_contacts(db: Session = Depends(get_db)):
    """Public aloqa ma'lumotlarini olish"""
    contacts = db.query(SiteContacts).first()

    if not contacts:
        # Agar yo'q bo'lsa, default yaratamiz
        contacts = SiteContacts(
            phone_primary="+998 90 123 45 67",
            telegram_username="@aytixuz",
            telegram_url="https://t.me/aytixuz",
            email_primary="info@aytix.uz"
        )
        db.add(contacts)
        db.commit()
        db.refresh(contacts)

    return contacts


# ============== ADMIN ENDPOINTS ==============

@router.get("", response_model=SiteContactsResponse)
def get_site_contacts(
    db: Session = Depends(get_db),
    current_admin = Depends(get_current_admin)
):
    """Admin - aloqa ma'lumotlarini olish"""
    contacts = db.query(SiteContacts).first()

    if not contacts:
        # Agar yo'q bo'lsa, default yaratamiz
        contacts = SiteContacts(
            phone_primary="+998 90 123 45 67",
            telegram_username="@aytixuz",
            telegram_url="https://t.me/aytixuz",
            email_primary="info@aytix.uz"
        )
        db.add(contacts)
        db.commit()
        db.refresh(contacts)

    return contacts


@router.put("", response_model=SiteContactsResponse)
def update_site_contacts(
    data: SiteContactsUpdate,
    db: Session = Depends(get_db),
    current_admin = Depends(get_current_admin)
):
    """Admin - aloqa ma'lumotlarini yangilash"""
    contacts = db.query(SiteContacts).first()

    if not contacts:
        raise HTTPException(status_code=404, detail="Aloqa ma'lumotlari topilmadi")

    update_data = data.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(contacts, field, value)

    db.commit()
    db.refresh(contacts)
    return contacts
