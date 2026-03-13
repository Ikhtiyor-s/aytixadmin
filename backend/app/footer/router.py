from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.dependencies import get_current_admin
from app.models import User, FooterSection, FooterItem, FooterSocialLink, FooterContact
from app.footer.schemas import (
    FooterSectionCreate, FooterSectionUpdate, FooterSectionResponse, FooterSectionSimpleResponse,
    FooterItemCreate, FooterItemUpdate, FooterItemResponse,
    FooterSocialLinkCreate, FooterSocialLinkUpdate, FooterSocialLinkResponse,
    FooterContactCreate, FooterContactUpdate, FooterContactResponse,
    FooterFullResponse, ReorderRequest
)

router = APIRouter(prefix="/footer", tags=["footer"])


# ============== PUBLIC ENDPOINTS ==============

@router.get("/public", response_model=FooterFullResponse)
async def get_public_footer(db: Session = Depends(get_db)):
    """Get all footer data for public display (no auth required)."""
    sections = db.query(FooterSection).filter(
        FooterSection.is_active == True
    ).order_by(FooterSection.order).all()

    social_links = db.query(FooterSocialLink).filter(
        FooterSocialLink.is_active == True
    ).order_by(FooterSocialLink.order).all()

    contacts = db.query(FooterContact).filter(
        FooterContact.is_active == True
    ).order_by(FooterContact.order).all()

    return FooterFullResponse(
        sections=sections,
        social_links=social_links,
        contacts=contacts
    )


# ============== FOOTER SECTIONS ==============

@router.get("/sections", response_model=List[FooterSectionResponse])
async def get_all_sections(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    """Get all footer sections with items (admin only)."""
    sections = db.query(FooterSection).order_by(FooterSection.order).all()
    return sections


@router.get("/sections/{section_id}", response_model=FooterSectionResponse)
async def get_section(
    section_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    """Get a single footer section by ID."""
    section = db.query(FooterSection).filter(FooterSection.id == section_id).first()
    if not section:
        raise HTTPException(status_code=404, detail="Bo'lim topilmadi")
    return section


@router.post("/sections", response_model=FooterSectionResponse, status_code=status.HTTP_201_CREATED)
async def create_section(
    section_data: FooterSectionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    """Create a new footer section."""
    # Check slug uniqueness
    existing = db.query(FooterSection).filter(FooterSection.slug == section_data.slug).first()
    if existing:
        raise HTTPException(status_code=400, detail="Bu slug allaqachon mavjud")

    section = FooterSection(**section_data.model_dump())
    db.add(section)
    db.commit()
    db.refresh(section)
    return section


@router.put("/sections/{section_id}", response_model=FooterSectionResponse)
async def update_section(
    section_id: int,
    section_data: FooterSectionUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    """Update a footer section."""
    section = db.query(FooterSection).filter(FooterSection.id == section_id).first()
    if not section:
        raise HTTPException(status_code=404, detail="Bo'lim topilmadi")

    # Check slug uniqueness if changed
    if section_data.slug and section_data.slug != section.slug:
        existing = db.query(FooterSection).filter(FooterSection.slug == section_data.slug).first()
        if existing:
            raise HTTPException(status_code=400, detail="Bu slug allaqachon mavjud")

    update_data = section_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(section, field, value)

    db.commit()
    db.refresh(section)
    return section


@router.delete("/sections/{section_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_section(
    section_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    """Delete a footer section and all its items."""
    section = db.query(FooterSection).filter(FooterSection.id == section_id).first()
    if not section:
        raise HTTPException(status_code=404, detail="Bo'lim topilmadi")

    db.delete(section)
    db.commit()
    return None


@router.post("/sections/reorder")
async def reorder_sections(
    reorder_data: ReorderRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    """Reorder footer sections."""
    for item in reorder_data.items:
        section = db.query(FooterSection).filter(FooterSection.id == item.id).first()
        if section:
            section.order = item.order
    db.commit()
    return {"message": "Tartib yangilandi"}


# ============== FOOTER ITEMS ==============

@router.get("/items", response_model=List[FooterItemResponse])
async def get_all_items(
    section_id: int = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    """Get all footer items, optionally filtered by section."""
    query = db.query(FooterItem)
    if section_id:
        query = query.filter(FooterItem.section_id == section_id)
    items = query.order_by(FooterItem.order).all()
    return items


@router.get("/items/{item_id}", response_model=FooterItemResponse)
async def get_item(
    item_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    """Get a single footer item by ID."""
    item = db.query(FooterItem).filter(FooterItem.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Element topilmadi")
    return item


@router.post("/items", response_model=FooterItemResponse, status_code=status.HTTP_201_CREATED)
async def create_item(
    item_data: FooterItemCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    """Create a new footer item."""
    # Check section exists
    section = db.query(FooterSection).filter(FooterSection.id == item_data.section_id).first()
    if not section:
        raise HTTPException(status_code=404, detail="Bo'lim topilmadi")

    item = FooterItem(**item_data.model_dump())
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


@router.put("/items/{item_id}", response_model=FooterItemResponse)
async def update_item(
    item_id: int,
    item_data: FooterItemUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    """Update a footer item."""
    item = db.query(FooterItem).filter(FooterItem.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Element topilmadi")

    # Check section exists if changed
    if item_data.section_id and item_data.section_id != item.section_id:
        section = db.query(FooterSection).filter(FooterSection.id == item_data.section_id).first()
        if not section:
            raise HTTPException(status_code=404, detail="Bo'lim topilmadi")

    update_data = item_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(item, field, value)

    db.commit()
    db.refresh(item)
    return item


@router.delete("/items/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_item(
    item_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    """Delete a footer item."""
    item = db.query(FooterItem).filter(FooterItem.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Element topilmadi")

    db.delete(item)
    db.commit()
    return None


@router.post("/items/reorder")
async def reorder_items(
    reorder_data: ReorderRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    """Reorder footer items."""
    for item in reorder_data.items:
        footer_item = db.query(FooterItem).filter(FooterItem.id == item.id).first()
        if footer_item:
            footer_item.order = item.order
    db.commit()
    return {"message": "Tartib yangilandi"}


# ============== SOCIAL LINKS ==============

@router.get("/social-links", response_model=List[FooterSocialLinkResponse])
async def get_all_social_links(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    """Get all social links (admin only)."""
    links = db.query(FooterSocialLink).order_by(FooterSocialLink.order).all()
    return links


@router.get("/social-links/{link_id}", response_model=FooterSocialLinkResponse)
async def get_social_link(
    link_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    """Get a single social link by ID."""
    link = db.query(FooterSocialLink).filter(FooterSocialLink.id == link_id).first()
    if not link:
        raise HTTPException(status_code=404, detail="Ijtimoiy tarmoq linki topilmadi")
    return link


@router.post("/social-links", response_model=FooterSocialLinkResponse, status_code=status.HTTP_201_CREATED)
async def create_social_link(
    link_data: FooterSocialLinkCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    """Create a new social link."""
    # Auto-generate icon based on platform if not provided
    if not link_data.icon:
        platform_icons = {
            'telegram': 'fab fa-telegram',
            'instagram': 'fab fa-instagram',
            'facebook': 'fab fa-facebook',
            'youtube': 'fab fa-youtube',
            'tiktok': 'fab fa-tiktok',
            'linkedin': 'fab fa-linkedin',
            'twitter': 'fab fa-twitter',
            'whatsapp': 'fab fa-whatsapp',
        }
        link_data_dict = link_data.model_dump()
        link_data_dict['icon'] = platform_icons.get(link_data.platform.lower(), 'fas fa-link')
        link = FooterSocialLink(**link_data_dict)
    else:
        link = FooterSocialLink(**link_data.model_dump())

    db.add(link)
    db.commit()
    db.refresh(link)
    return link


@router.put("/social-links/{link_id}", response_model=FooterSocialLinkResponse)
async def update_social_link(
    link_id: int,
    link_data: FooterSocialLinkUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    """Update a social link."""
    link = db.query(FooterSocialLink).filter(FooterSocialLink.id == link_id).first()
    if not link:
        raise HTTPException(status_code=404, detail="Ijtimoiy tarmoq linki topilmadi")

    update_data = link_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(link, field, value)

    db.commit()
    db.refresh(link)
    return link


@router.delete("/social-links/{link_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_social_link(
    link_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    """Delete a social link."""
    link = db.query(FooterSocialLink).filter(FooterSocialLink.id == link_id).first()
    if not link:
        raise HTTPException(status_code=404, detail="Ijtimoiy tarmoq linki topilmadi")

    db.delete(link)
    db.commit()
    return None


@router.post("/social-links/reorder")
async def reorder_social_links(
    reorder_data: ReorderRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    """Reorder social links."""
    for item in reorder_data.items:
        link = db.query(FooterSocialLink).filter(FooterSocialLink.id == item.id).first()
        if link:
            link.order = item.order
    db.commit()
    return {"message": "Tartib yangilandi"}


# ============== CONTACTS ==============

@router.get("/contacts", response_model=List[FooterContactResponse])
async def get_all_contacts(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    """Get all contacts (admin only)."""
    contacts = db.query(FooterContact).order_by(FooterContact.order).all()
    return contacts


@router.get("/contacts/{contact_id}", response_model=FooterContactResponse)
async def get_contact(
    contact_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    """Get a single contact by ID."""
    contact = db.query(FooterContact).filter(FooterContact.id == contact_id).first()
    if not contact:
        raise HTTPException(status_code=404, detail="Kontakt topilmadi")
    return contact


@router.post("/contacts", response_model=FooterContactResponse, status_code=status.HTTP_201_CREATED)
async def create_contact(
    contact_data: FooterContactCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    """Create a new contact."""
    # Auto-generate icon and link based on contact type if not provided
    contact_dict = contact_data.model_dump()

    if not contact_dict.get('icon'):
        type_icons = {
            'phone': 'fas fa-phone',
            'email': 'fas fa-envelope',
            'address': 'fas fa-map-marker-alt',
            'telegram': 'fab fa-telegram',
            'whatsapp': 'fab fa-whatsapp',
        }
        contact_dict['icon'] = type_icons.get(contact_data.contact_type.lower(), 'fas fa-info-circle')

    if not contact_dict.get('link_url'):
        if contact_data.contact_type.lower() == 'phone':
            contact_dict['link_url'] = f"tel:{contact_data.value.replace(' ', '').replace('-', '')}"
        elif contact_data.contact_type.lower() == 'email':
            contact_dict['link_url'] = f"mailto:{contact_data.value}"
        elif contact_data.contact_type.lower() == 'telegram':
            contact_dict['link_url'] = f"https://t.me/{contact_data.value.replace('@', '')}"
        elif contact_data.contact_type.lower() == 'whatsapp':
            contact_dict['link_url'] = f"https://wa.me/{contact_data.value.replace('+', '').replace(' ', '')}"

    contact = FooterContact(**contact_dict)
    db.add(contact)
    db.commit()
    db.refresh(contact)
    return contact


@router.put("/contacts/{contact_id}", response_model=FooterContactResponse)
async def update_contact(
    contact_id: int,
    contact_data: FooterContactUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    """Update a contact."""
    contact = db.query(FooterContact).filter(FooterContact.id == contact_id).first()
    if not contact:
        raise HTTPException(status_code=404, detail="Kontakt topilmadi")

    update_data = contact_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(contact, field, value)

    db.commit()
    db.refresh(contact)
    return contact


@router.delete("/contacts/{contact_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_contact(
    contact_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    """Delete a contact."""
    contact = db.query(FooterContact).filter(FooterContact.id == contact_id).first()
    if not contact:
        raise HTTPException(status_code=404, detail="Kontakt topilmadi")

    db.delete(contact)
    db.commit()
    return None


@router.post("/contacts/reorder")
async def reorder_contacts(
    reorder_data: ReorderRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    """Reorder contacts."""
    for item in reorder_data.items:
        contact = db.query(FooterContact).filter(FooterContact.id == item.id).first()
        if contact:
            contact.order = item.order
    db.commit()
    return {"message": "Tartib yangilandi"}
