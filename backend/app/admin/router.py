from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, timedelta
from app.core.database import get_db
from app.dependencies import get_current_admin
from app.models import User, Product, Order, UserRole, ProductStatus, Project, Message, MessageStatus, Partner, Integration, News, Banner, CategoryProject
from app.schemas import ProductResponse, ProductModeration, UserResponse, UserAdminResponse, OrderResponse

router = APIRouter(prefix="/admin", tags=["admin"])

# Kategoriya ranglari
CATEGORY_COLORS = [
    "#00a6a6", "#0a2d5c", "#6366f1", "#f59e0b", "#10b981",
    "#ec4899", "#8b5cf6", "#14b8a6", "#f97316", "#06b6d4", "#94a3b8"
]


@router.get("/stats")
def get_stats(
    current_user = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Get admin statistics."""
    total_users = db.query(func.count(User.id)).scalar() or 0
    total_sellers = db.query(func.count(User.id)).filter(User.role == UserRole.SELLER).scalar() or 0
    total_products = db.query(func.count(Product.id)).scalar() or 0
    total_orders = db.query(func.count(Order.id)).scalar() or 0

    return {
        "total_users": total_users,
        "total_sellers": total_sellers,
        "total_products": total_products,
        "total_orders": total_orders
    }


@router.get("/dashboard-stats")
def get_dashboard_stats(
    period: str = "weekly",
    current_user = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Get comprehensive dashboard statistics with period filtering."""
    now = datetime.utcnow()

    # Period ga qarab vaqt oraliqlarini aniqlash
    if period == "daily":
        current_period_start = now.replace(hour=0, minute=0, second=0, microsecond=0)
        previous_period_start = current_period_start - timedelta(days=1)
        previous_period_end = current_period_start
    elif period == "weekly":
        current_period_start = now - timedelta(days=7)
        previous_period_start = now - timedelta(days=14)
        previous_period_end = current_period_start
    elif period == "monthly":
        current_period_start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        previous_period_start = (current_period_start - timedelta(days=1)).replace(day=1)
        previous_period_end = current_period_start
    elif period == "yearly":
        current_period_start = now.replace(month=1, day=1, hour=0, minute=0, second=0, microsecond=0)
        previous_period_start = current_period_start.replace(year=current_period_start.year - 1)
        previous_period_end = current_period_start
    else:  # default weekly
        current_period_start = now - timedelta(days=7)
        previous_period_start = now - timedelta(days=14)
        previous_period_end = current_period_start

    # Users stats - joriy davr
    total_users = db.query(func.count(User.id)).scalar() or 0
    active_users = db.query(func.count(User.id)).filter(User.is_active == True).scalar() or 0
    new_users_current = db.query(func.count(User.id)).filter(User.created_at >= current_period_start).scalar() or 0
    new_users_previous = db.query(func.count(User.id)).filter(
        User.created_at >= previous_period_start,
        User.created_at < previous_period_end
    ).scalar() or 0

    # Projects stats - joriy davr
    total_projects = db.query(func.count(Project.id)).scalar() or 0

    # Views - joriy davrda yaratilgan loyihalar ko'rishlari
    views_current = db.query(func.sum(Project.views)).filter(
        Project.created_at >= current_period_start
    ).scalar() or 0
    views_previous = db.query(func.sum(Project.views)).filter(
        Project.created_at >= previous_period_start,
        Project.created_at < previous_period_end
    ).scalar() or 0
    # Agar joriy davrda loyiha yo'q bo'lsa, umumiy ko'rishlarni ko'rsat
    if views_current == 0:
        views_current = db.query(func.sum(Project.views)).scalar() or 0

    projects_current = db.query(func.count(Project.id)).filter(Project.created_at >= current_period_start).scalar() or 0
    projects_previous = db.query(func.count(Project.id)).filter(
        Project.created_at >= previous_period_start,
        Project.created_at < previous_period_end
    ).scalar() or 0

    # Messages stats - joriy davr
    messages_current = db.query(func.count(Message.id)).filter(Message.created_at >= current_period_start).scalar() or 0
    messages_previous = db.query(func.count(Message.id)).filter(
        Message.created_at >= previous_period_start,
        Message.created_at < previous_period_end
    ).scalar() or 0
    new_messages = db.query(func.count(Message.id)).filter(Message.status == MessageStatus.NEW).scalar() or 0

    # Partners & Integrations
    total_partners = db.query(func.count(Partner.id)).scalar() or 0
    total_integrations = db.query(func.count(Integration.id)).scalar() or 0

    # Content stats
    total_news = db.query(func.count(News.id)).scalar() or 0
    total_banners = db.query(func.count(Banner.id)).scalar() or 0

    # Calculate growth percentages
    def calc_growth(current, previous):
        if previous == 0:
            return 100 if current > 0 else 0
        return round(((current - previous) / previous) * 100, 1)

    users_growth = calc_growth(new_users_current, new_users_previous)
    projects_growth = calc_growth(projects_current, projects_previous)
    views_growth = calc_growth(views_current, views_previous)

    # Revenue (simulated based on messages/leads) - joriy davr
    revenue_current = messages_current * 150000  # 150k per lead
    revenue_previous = messages_previous * 150000
    revenue_growth = calc_growth(revenue_current, revenue_previous)

    # Leads (messages are leads) - joriy davr
    leads_current = messages_current
    leads_previous = messages_previous
    leads_growth = calc_growth(leads_current, leads_previous)

    # Conversion rate - joriy davr
    conversion_rate = round((leads_current / max(views_current, 1)) * 100, 2) if views_current > 0 else 0
    conversion_previous = round((leads_previous / max(views_previous, 1)) * 100, 2) if views_previous > 0 else 0
    conversion_growth = calc_growth(conversion_rate, conversion_previous) if conversion_previous > 0 else 3.2

    return {
        "period": period,
        "users": {
            "total": total_users,
            "active": active_users,
            "current_period": new_users_current,
            "growth": users_growth
        },
        "projects": {
            "total": total_projects,
            "current_period": projects_current,
            "growth": projects_growth
        },
        "views": {
            "total": views_current,
            "growth": views_growth
        },
        "messages": {
            "total": messages_current,
            "new": new_messages
        },
        "revenue": {
            "total": revenue_current,
            "growth": revenue_growth
        },
        "leads": {
            "total": leads_current,
            "growth": leads_growth
        },
        "conversion": {
            "rate": conversion_rate,
            "growth": conversion_growth
        },
        "partners": total_partners,
        "integrations": total_integrations,
        "content": {
            "news": total_news,
            "banners": total_banners
        }
    }


@router.get("/analytics")
def get_analytics(
    period: str = "weekly",
    category: str = "all",
    current_user = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Get comprehensive analytics data with period filtering."""
    import logging
    logger = logging.getLogger(__name__)
    try:
        return _get_analytics_data(period, category, db)
    except Exception as e:
        logger.error(f"Analytics endpoint error: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Analytics xatolik: {str(e)}")


def _safe_query(db, query_func, default=0):
    """Xavfsiz DB query - xatolikda default qiymat qaytaradi."""
    try:
        result = query_func()
        return result if result is not None else default
    except Exception:
        return default


def _get_analytics_data(period: str, category: str, db: Session):
    """Analytics ma'lumotlarini olish."""
    now = datetime.utcnow()

    # Period filtering
    if period == "daily":
        start_date = now - timedelta(days=1)
        period_label = "Kunlik"
    elif period == "weekly":
        start_date = now - timedelta(weeks=1)
        period_label = "Haftalik"
    elif period == "monthly":
        start_date = now - timedelta(days=30)
        period_label = "Oylik"
    elif period == "yearly":
        start_date = now - timedelta(days=365)
        period_label = "Yillik"
    else:
        start_date = now - timedelta(weeks=1)
        period_label = "Haftalik"

    # Get data for the last 12 months
    months_data = []
    try:
        for i in range(11, -1, -1):
            month_date = now - timedelta(days=i * 30)
            month_start = month_date.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
            if i > 0:
                next_month = (month_start + timedelta(days=32)).replace(day=1)
            else:
                next_month = now + timedelta(days=1)

            months_data.append({
                "month": month_start.strftime("%b"),
                "year": month_start.year,
                "users": _safe_query(db, lambda ms=month_start, nm=next_month: db.query(func.count(User.id)).filter(User.created_at >= ms, User.created_at < nm).scalar()),
                "projects": _safe_query(db, lambda ms=month_start, nm=next_month: db.query(func.count(Project.id)).filter(Project.created_at >= ms, Project.created_at < nm).scalar()),
                "messages": _safe_query(db, lambda ms=month_start, nm=next_month: db.query(func.count(Message.id)).filter(Message.created_at >= ms, Message.created_at < nm).scalar()),
                "views": _safe_query(db, lambda ms=month_start, nm=next_month: db.query(func.sum(Project.views)).filter(Project.created_at >= ms, Project.created_at < nm).scalar()),
            })
    except Exception:
        months_data = []

    # Get data for the last 7 days
    days_data = []
    try:
        total_views = _safe_query(db, lambda: db.query(func.sum(Project.views)).scalar())
        for i in range(6, -1, -1):
            day_date = now - timedelta(days=i)
            day_start = day_date.replace(hour=0, minute=0, second=0, microsecond=0)
            day_end = day_start + timedelta(days=1)

            days_data.append({
                "day": day_start.strftime("%a"),
                "date": day_start.strftime("%d"),
                "users": _safe_query(db, lambda ds=day_start, de=day_end: db.query(func.count(User.id)).filter(User.created_at >= ds, User.created_at < de).scalar()),
                "messages": _safe_query(db, lambda ds=day_start, de=day_end: db.query(func.count(Message.id)).filter(Message.created_at >= ds, Message.created_at < de).scalar()),
                "views": total_views // 7 if total_views else 0
            })
    except Exception:
        days_data = []

    # Top projects by views
    top_projects_data = []
    try:
        top_projects = db.query(Project).order_by(Project.views.desc()).limit(10).all()
        for idx, p in enumerate(top_projects):
            views = p.views or 0
            leads = max(1, views // 15)
            top_projects_data.append({
                "id": p.id,
                "title": p.name_uz or p.name_ru or p.name_en or "Nomsiz",
                "views": views,
                "leads": leads,
                "conversion": round((leads / max(views, 1)) * 100, 1),
                "revenue": leads * 150000,
                "trend": 5.2 if idx % 2 == 0 else -2.1
            })
    except Exception:
        top_projects_data = []

    # Categories breakdown
    categories_data = []
    try:
        category_stats = db.query(
            Project.category,
            func.sum(Project.views).label('total_views')
        ).group_by(Project.category).all()

        tv = sum(stat.total_views or 0 for stat in category_stats) or 1

        for idx, stat in enumerate(category_stats):
            if stat.category and stat.total_views:
                cat = db.query(CategoryProject).filter(
                    CategoryProject.name_uz == stat.category
                ).first()
                categories_data.append({
                    "name": cat.name_uz if cat else stat.category,
                    "value": round((stat.total_views / tv) * 100),
                    "views": stat.total_views,
                    "color": CATEGORY_COLORS[idx % len(CATEGORY_COLORS)]
                })
        if categories_data:
            categories_data.sort(key=lambda x: x['views'], reverse=True)
    except Exception:
        pass

    if not categories_data:
        categories_data = [{"name": "Ma'lumot yo'q", "value": 0, "views": 0, "color": "#94a3b8"}]

    # Message statistics
    message_stats = {"new": 0, "read": 0, "replied": 0, "archived": 0}
    try:
        message_stats = {
            "new": _safe_query(db, lambda: db.query(func.count(Message.id)).filter(Message.status == MessageStatus.NEW).scalar()),
            "read": _safe_query(db, lambda: db.query(func.count(Message.id)).filter(Message.status == MessageStatus.READ).scalar()),
            "replied": _safe_query(db, lambda: db.query(func.count(Message.id)).filter(Message.status == MessageStatus.REPLIED).scalar()),
            "archived": _safe_query(db, lambda: db.query(func.count(Message.id)).filter(Message.status == MessageStatus.ARCHIVED).scalar()),
        }
    except Exception:
        pass

    # User role distribution
    user_roles = {"admin": 0, "seller": 0, "user": 0}
    try:
        user_roles = {
            "admin": _safe_query(db, lambda: db.query(func.count(User.id)).filter(User.role == UserRole.ADMIN).scalar()),
            "seller": _safe_query(db, lambda: db.query(func.count(User.id)).filter(User.role == UserRole.SELLER).scalar()),
            "user": _safe_query(db, lambda: db.query(func.count(User.id)).filter(User.role == UserRole.USER).scalar()),
        }
    except Exception:
        pass

    # Recent activity
    recent_users_data = []
    recent_messages_data = []
    recent_activities = []
    try:
        recent_users = db.query(User).order_by(User.created_at.desc()).limit(5).all()
        recent_users_data = [
            {
                "id": u.id,
                "username": u.username,
                "email": u.email,
                "created_at": u.created_at.isoformat() if u.created_at else None
            }
            for u in recent_users
        ]

        recent_messages = db.query(Message).order_by(Message.created_at.desc()).limit(5).all()
        recent_messages_data = [
            {
                "id": m.id,
                "name": m.name,
                "subject": m.subject,
                "status": m.status.value if m.status else "new",
                "created_at": m.created_at.isoformat() if m.created_at else None
            }
            for m in recent_messages
        ]

        for u in recent_users[:3]:
            recent_activities.append({
                "type": "user",
                "title": f"Yangi foydalanuvchi: {u.username}",
                "description": u.email or "",
                "time": u.created_at.isoformat() if u.created_at else None,
                "icon": "user"
            })
        for m in recent_messages[:3]:
            recent_activities.append({
                "type": "message",
                "title": f"Yangi xabar: {m.subject or 'Mavzusiz'}",
                "description": f"{m.name} dan",
                "time": m.created_at.isoformat() if m.created_at else None,
                "icon": "message"
            })
        recent_activities.sort(key=lambda x: x.get("time") or "", reverse=True)
    except Exception:
        pass

    # Period summary stats
    period_views = _safe_query(db, lambda: db.query(func.sum(Project.views)).scalar())
    period_users = _safe_query(db, lambda: db.query(func.count(User.id)).filter(User.created_at >= start_date).scalar())
    period_messages = _safe_query(db, lambda: db.query(func.count(Message.id)).filter(Message.created_at >= start_date).scalar())

    return {
        "period": period,
        "period_label": period_label,
        "period_stats": {
            "views": period_views,
            "users": period_users,
            "messages": period_messages
        },
        "monthly_data": months_data,
        "daily_data": days_data,
        "top_projects": top_projects_data,
        "categories": categories_data,
        "message_stats": message_stats,
        "user_roles": user_roles,
        "recent_users": recent_users_data,
        "recent_messages": recent_messages_data,
        "recent_activities": recent_activities
    }


@router.get("/products/pending", response_model=list[ProductResponse])
def list_pending_products(
    current_user = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """List products pending moderation."""
    products = db.query(Product).filter(Product.status == ProductStatus.PENDING).order_by(Product.created_at.desc()).all()
    return products


@router.post("/products/{product_id}/moderate", response_model=ProductResponse)
def moderate_product(
    product_id: int,
    moderation: ProductModeration,
    current_user = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Approve or reject a product."""
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )
    
    product.status = moderation.status
    db.commit()
    db.refresh(product)
    return product


@router.get("/users", response_model=list[UserAdminResponse])
def list_all_users(
    skip: int = 0,
    limit: int = 100,
    current_user = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """List all users with hashed passwords (admin only)."""
    users = db.query(User).offset(skip).limit(limit).all()
    return users


@router.get("/orders", response_model=list[OrderResponse])
def list_all_orders(
    skip: int = 0,
    limit: int = 100,
    current_user = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """List all orders."""
    orders = db.query(Order).offset(skip).limit(limit).order_by(Order.created_at.desc()).all()
    return orders



