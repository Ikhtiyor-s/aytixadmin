from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import func, text
from typing import List, Optional, Dict
from app.core.database import get_db
from app.dependencies import get_current_user, get_current_admin
from app.models import Project, User, ProjectStatus, CategoryProject, SubcategoryProject
from app.schemas import ProjectCreate, ProjectUpdate, ProjectResponse
from app.core.sanitizer import sanitize_html
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/projects", tags=["projects"])


def project_to_dict(p) -> dict:
    """Project obyektini xavfsiz dict ga aylantirish."""
    try:
        data = {
            "id": p.id,
            "name_uz": p.name_uz or "",
            "name_ru": getattr(p, "name_ru", None),
            "name_en": getattr(p, "name_en", None),
            "description_uz": p.description_uz or "",
            "description_ru": getattr(p, "description_ru", None),
            "description_en": getattr(p, "description_en", None),
            "category": p.category or "",
            "subcategory": getattr(p, "subcategory", None),
            "technologies": p.technologies if isinstance(p.technologies, list) else [],
            "features": p.features if isinstance(p.features, list) else [],
            "integrations": p.integrations if isinstance(p.integrations, list) else [],
            "color": getattr(p, "color", None) or "from-primary-500 to-primary-600",
            "image_url": getattr(p, "image_url", None),
            "video_url": getattr(p, "video_url", None),
            "images": p.images if isinstance(p.images, list) else [],
            "status": p.status.value if p.status else "active",
            "is_top": bool(getattr(p, "is_top", False)),
            "is_new": bool(getattr(p, "is_new", False)),
            "is_verified": bool(getattr(p, "is_verified", False)),
            "views": getattr(p, "views", 0) or 0,
            "favorites": getattr(p, "favorites", 0) or 0,
            "created_at": p.created_at.isoformat() if p.created_at else None,
            "updated_at": p.updated_at.isoformat() if p.updated_at else None,
        }
        return data
    except Exception as e:
        logger.error(f"Project {getattr(p, 'id', '?')} dict error: {e}")
        return {"id": getattr(p, "id", 0), "name_uz": getattr(p, "name_uz", "Error"), "error": str(e)}


def find_matching_subcategory(project_subcat: str, subcategories_list: list, category_name: str) -> str:
    """Find correct subcategory name from database."""
    if not project_subcat:
        return project_subcat
    project_subcat_lower = project_subcat.lower().strip()
    for sub_name, cat_name in subcategories_list:
        if cat_name != category_name:
            continue
        sub_name_lower = sub_name.lower()
        if project_subcat_lower == sub_name_lower:
            return sub_name
        if project_subcat_lower in sub_name_lower:
            return sub_name
        project_first_word = project_subcat_lower.split()[0] if project_subcat_lower else ""
        sub_first_word = sub_name_lower.split()[0] if sub_name_lower else ""
        if project_first_word and project_first_word == sub_first_word:
            return sub_name
    return project_subcat


@router.get("/counts")
def get_project_counts(db: Session = Depends(get_db)):
    """Get project counts by category and subcategory."""
    # Category ID → name_uz mapping
    all_cats = db.query(CategoryProject).all()
    cat_id_to_name = {str(c.id): c.name_uz for c in all_cats}

    category_counts = db.query(
        Project.category, func.count(Project.id).label("count")
    ).filter(Project.status == ProjectStatus.ACTIVE).group_by(Project.category).all()

    # If category is stored as ID, map to name
    categories = {}
    for cat, count in category_counts:
        name = cat_id_to_name.get(cat, cat) if cat else cat
        if name:
            categories[name] = categories.get(name, 0) + count

    all_subcategories = db.query(
        SubcategoryProject.name_uz, CategoryProject.name_uz.label("category_name")
    ).join(CategoryProject, SubcategoryProject.category_id == CategoryProject.id
    ).filter(SubcategoryProject.is_active == True).all()

    subcategory_counts = db.query(
        Project.category, Project.subcategory, func.count(Project.id).label("count")
    ).filter(
        Project.status == ProjectStatus.ACTIVE,
        Project.subcategory.isnot(None), Project.subcategory != ""
    ).group_by(Project.category, Project.subcategory).all()

    subcategories = {}
    for cat, subcat, count in subcategory_counts:
        if subcat:
            cat_name = cat_id_to_name.get(cat, cat) if cat else cat
            correct_name = find_matching_subcategory(subcat, all_subcategories, cat_name)
            key = f"{cat_name}:{correct_name}"
            if key in subcategories:
                subcategories[key] += count
            else:
                subcategories[key] = count
    return {"categories": categories, "subcategories": subcategories}


@router.get("/")
def list_projects(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    category: Optional[str] = None,
    subcategory: Optional[str] = None,
    status: Optional[ProjectStatus] = None,
    is_top: Optional[bool] = None,
    is_new: Optional[bool] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """List all projects with filtering and pagination."""
    try:
        # Raw SQL bilan so'rov - DB dagi haqiqiy ustunlarni ishlatamiz
        # Bu SQLAlchemy model va DB o'rtasidagi farqni hal qiladi
        query = db.query(Project)
        if category:
            # Category nom yoki ID bo'lishi mumkin - ikkisini ham tekshiramiz
            cat_obj = db.query(CategoryProject).filter(
                CategoryProject.name_uz.ilike(f"%{category}%")
            ).first()
            if cat_obj:
                query = query.filter(
                    (Project.category == str(cat_obj.id)) |
                    (Project.category.ilike(f"%{category}%"))
                )
            else:
                query = query.filter(Project.category.ilike(f"%{category}%"))
        if subcategory:
            query = query.filter(Project.subcategory.ilike(f"%{subcategory}%"))
        if status:
            query = query.filter(Project.status == status)
        if is_top is not None:
            query = query.filter(Project.is_top == is_top)
        if is_new is not None:
            query = query.filter(Project.is_new == is_new)
        if search:
            search_filter = f"%{search}%"
            query = query.filter(
                (Project.name_uz.ilike(search_filter)) |
                (Project.name_ru.ilike(search_filter)) |
                (Project.name_en.ilike(search_filter)) |
                (Project.description_uz.ilike(search_filter)) |
                (Project.description_ru.ilike(search_filter)) |
                (Project.description_en.ilike(search_filter))
            )
        query = query.order_by(Project.created_at.desc())
        projects = query.offset(skip).limit(limit).all()
        return [project_to_dict(p) for p in projects]
    except Exception as e:
        logger.error(f"Projects list error: {e}", exc_info=True)
        # Agar ustun xatosi bo'lsa - raw SQL bilan qayta urinish
        if "does not exist" in str(e).lower() or "undefined" in str(e).lower():
            try:
                db.rollback()
                result = db.execute(text(
                    "SELECT id, name_uz, name_ru, name_en, description_uz, description_ru, "
                    "description_en, category, subcategory, technologies, features, integrations, "
                    "color, image_url, images, views, favorites, status, is_top, is_new, "
                    "created_at, updated_at FROM projects ORDER BY created_at DESC LIMIT :limit OFFSET :skip"
                ), {"limit": limit, "skip": skip})
                rows = result.fetchall()
                projects_list = []
                for row in rows:
                    projects_list.append({
                        "id": row[0],
                        "name_uz": row[1] or "",
                        "name_ru": row[2],
                        "name_en": row[3],
                        "description_uz": row[4] or "",
                        "description_ru": row[5],
                        "description_en": row[6],
                        "category": row[7] or "",
                        "subcategory": row[8],
                        "technologies": row[9] if isinstance(row[9], list) else [],
                        "features": row[10] if isinstance(row[10], list) else [],
                        "integrations": row[11] if isinstance(row[11], list) else [],
                        "color": row[12] or "from-primary-500 to-primary-600",
                        "image_url": row[13],
                        "video_url": None,
                        "images": row[14] if isinstance(row[14], list) else [],
                        "views": row[15] or 0,
                        "favorites": row[16] or 0,
                        "status": row[17] or "active",
                        "is_top": bool(row[18]),
                        "is_new": bool(row[19]),
                        "is_verified": False,
                        "created_at": row[20].isoformat() if row[20] else None,
                        "updated_at": row[21].isoformat() if row[21] else None,
                    })
                return projects_list
            except Exception as e2:
                logger.error(f"Fallback SQL ham xato: {e2}", exc_info=True)
                raise HTTPException(status_code=500, detail=f"Projects xatolik: {str(e2)}")
        raise HTTPException(status_code=500, detail=f"Projects list xatolik: {str(e)}")


@router.get("/{project_id}")
def get_project(project_id: int, db: Session = Depends(get_db)):
    """Get a single project by ID."""
    try:
        project = db.query(Project).filter(Project.id == project_id).first()
        if not project:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")
        # Views count
        try:
            project.views = (project.views or 0) + 1
            db.commit()
            db.refresh(project)
        except Exception:
            db.rollback()
        return project_to_dict(project)
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Project get error: {e}", exc_info=True)
        # Fallback: raw SQL
        if "does not exist" in str(e).lower() or "undefined" in str(e).lower():
            try:
                db.rollback()
                result = db.execute(text(
                    "SELECT id, name_uz, name_ru, name_en, description_uz, description_ru, "
                    "description_en, category, subcategory, technologies, features, integrations, "
                    "color, image_url, images, views, favorites, status, is_top, is_new, "
                    "created_at, updated_at FROM projects WHERE id = :pid"
                ), {"pid": project_id})
                row = result.fetchone()
                if not row:
                    raise HTTPException(status_code=404, detail="Project not found")
                return {
                    "id": row[0],
                    "name_uz": row[1] or "",
                    "name_ru": row[2],
                    "name_en": row[3],
                    "description_uz": row[4] or "",
                    "description_ru": row[5],
                    "description_en": row[6],
                    "category": row[7] or "",
                    "subcategory": row[8],
                    "technologies": row[9] if isinstance(row[9], list) else [],
                    "features": row[10] if isinstance(row[10], list) else [],
                    "integrations": row[11] if isinstance(row[11], list) else [],
                    "color": row[12] or "from-primary-500 to-primary-600",
                    "image_url": row[13],
                    "video_url": None,
                    "images": row[14] if isinstance(row[14], list) else [],
                    "views": row[15] or 0,
                    "favorites": row[16] or 0,
                    "status": row[17] or "active",
                    "is_top": bool(row[18]),
                    "is_new": bool(row[19]),
                    "is_verified": False,
                    "created_at": row[20].isoformat() if row[20] else None,
                    "updated_at": row[21].isoformat() if row[21] else None,
                }
            except HTTPException:
                raise
            except Exception as e2:
                logger.error(f"Fallback SQL ham xato: {e2}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Project get xatolik: {str(e)}")


@router.post("/", status_code=status.HTTP_201_CREATED)
def create_project(
    project_data: ProjectCreate,
    current_user: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Create a new project (admin only)."""
    project = Project(
        name_uz=project_data.name_uz, name_ru=project_data.name_ru, name_en=project_data.name_en,
        description_uz=sanitize_html(project_data.description_uz) if project_data.description_uz else None,
        description_ru=sanitize_html(project_data.description_ru) if project_data.description_ru else None,
        description_en=sanitize_html(project_data.description_en) if project_data.description_en else None,
        category=project_data.category,
        subcategory=project_data.subcategory, technologies=project_data.technologies,
        features=project_data.features, integrations=project_data.integrations,
        color=project_data.color, image_url=project_data.image_url,
        video_url=project_data.video_url, images=project_data.images,
        status=project_data.status, is_top=project_data.is_top, is_new=project_data.is_new,
        is_verified=project_data.is_verified
    )
    db.add(project)
    db.commit()
    db.refresh(project)
    return project_to_dict(project)


@router.put("/{project_id}")
def update_project(
    project_id: int, project_data: ProjectUpdate,
    current_user: User = Depends(get_current_admin), db: Session = Depends(get_db)
):
    """Update a project (admin only)."""
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")
    update_data = project_data.model_dump(exclude_unset=True)
    html_fields = ['description_uz', 'description_ru', 'description_en']
    for field, value in update_data.items():
        if field in html_fields and value:
            value = sanitize_html(value)
        setattr(project, field, value)
    db.commit()
    db.refresh(project)
    return project_to_dict(project)


@router.delete("/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_project(
    project_id: int, current_user: User = Depends(get_current_admin), db: Session = Depends(get_db)
):
    """Delete a project (admin only)."""
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")
    db.delete(project)
    db.commit()
    return None


@router.post("/{project_id}/favorite")
def toggle_favorite(
    project_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)
):
    """Toggle favorite status for a project."""
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")
    project.favorites = (project.favorites or 0) + 1
    db.commit()
    db.refresh(project)
    return project_to_dict(project)
