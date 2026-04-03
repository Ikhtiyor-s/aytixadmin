"""
Banner, News va Notification seed ma'lumotlari
"""
import sys
sys.path.insert(0, '/app')

from app.core.database import SessionLocal
from app.models import Banner, News, Notification, ContentStatus, TargetAudience

db = SessionLocal()

try:
    # ============ BANNERLAR ============
    existing_banners = db.query(Banner).count()
    if existing_banners == 0:
        banners = [
            Banner(
                title_uz="AyTiX - IT Loyihalar Marketplace",
                title_ru="AyTiX - Маркетплейс IT проектов",
                title_en="AyTiX - IT Projects Marketplace",
                description_uz="Biznesingiz uchun tayyor IT yechimlar. CRM, ERP, POS, mobil ilovalar va ko'plab boshqa yechimlar.",
                description_ru="Готовые IT решения для вашего бизнеса. CRM, ERP, POS, мобильные приложения и многое другое.",
                description_en="Ready IT solutions for your business. CRM, ERP, POS, mobile apps and much more.",
                image_url="https://images.unsplash.com/photo-1551434678-e076c223a692?w=1200",
                link_url="/marketplace",
                order=1,
                status=ContentStatus.ACTIVE,
            ),
            Banner(
                title_uz="Nonbor - Oshxona Avtomatlashtirish",
                title_ru="Nonbor - Автоматизация общепита",
                title_en="Nonbor - Catering Automation",
                description_uz="Restoran va kafe uchun to'liq boshqaruv tizimi. Buyurtmalar, oshxona, hisobotlar.",
                description_ru="Полная система управления для ресторанов и кафе. Заказы, кухня, отчёты.",
                description_en="Complete management system for restaurants and cafes. Orders, kitchen, reports.",
                image_url="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200",
                link_url="/marketplace",
                project_id=12,
                order=2,
                status=ContentStatus.ACTIVE,
            ),
            Banner(
                title_uz="AI Yechimlar - Kelajak Bugun",
                title_ru="AI Решения - Будущее сегодня",
                title_en="AI Solutions - Future Today",
                description_uz="Sun'iy intellekt asosidagi chatbotlar va avtomatlashtirish yechimlari.",
                description_ru="Чат-боты и решения автоматизации на основе искусственного интеллекта.",
                description_en="AI-powered chatbots and automation solutions.",
                image_url="https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=1200",
                link_url="/marketplace",
                project_id=4,
                order=3,
                status=ContentStatus.ACTIVE,
            ),
        ]
        db.add_all(banners)
        db.commit()
        print(f"[OK] {len(banners)} ta banner qo'shildi")
    else:
        print(f"[SKIP] Bannerlar allaqachon mavjud: {existing_banners} ta")

    # ============ YANGILIKLAR ============
    existing_news = db.query(News).count()
    if existing_news == 0:
        news_list = [
            News(
                title_uz="AyTiX platformasi rasman ishga tushdi!",
                title_ru="Платформа AyTiX официально запущена!",
                title_en="AyTiX platform officially launched!",
                content_uz="Welltech kompaniyasi IT loyihalar marketplace platformasi AyTiX ni rasman ishga tushirdi. Endi biznes uchun zarur bo'lgan barcha IT yechimlarni bir joydan topishingiz mumkin.",
                content_ru="Компания Welltech официально запустила маркетплейс IT-проектов AyTiX. Теперь все необходимые IT-решения для бизнеса можно найти в одном месте.",
                content_en="Welltech company officially launched the IT projects marketplace AyTiX. Now all the necessary IT solutions for business can be found in one place.",
                image_url="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800",
                status=ContentStatus.ACTIVE,
                target=TargetAudience.ALL,
            ),
            News(
                title_uz="Nonbor tizimi yangilandi",
                title_ru="Система Nonbor обновлена",
                title_en="Nonbor system updated",
                content_uz="Nonbor oshxona avtomatlashtirish tizimiga yangi funksiyalar qo'shildi: real-time monitoring, mobil ilova va hisobotlar moduli.",
                content_ru="В систему автоматизации общепита Nonbor добавлены новые функции: мониторинг в реальном времени, мобильное приложение и модуль отчётов.",
                content_en="New features added to Nonbor catering automation system: real-time monitoring, mobile app and reports module.",
                image_url="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800",
                status=ContentStatus.ACTIVE,
                target=TargetAudience.ALL,
            ),
        ]
        db.add_all(news_list)
        db.commit()
        print(f"[OK] {len(news_list)} ta yangilik qo'shildi")
    else:
        print(f"[SKIP] Yangiliklar allaqachon mavjud: {existing_news} ta")

    # ============ XABARNOMALAR ============
    existing_notif = db.query(Notification).count()
    if existing_notif == 0:
        notifications = [
            Notification(
                title_uz="AyTiX ga xush kelibsiz!",
                title_ru="Добро пожаловать в AyTiX!",
                title_en="Welcome to AyTiX!",
                message_uz="Bizning platformamizda 100+ tayyor IT yechimlarni topishingiz mumkin.",
                message_ru="На нашей платформе вы найдёте 100+ готовых IT решений.",
                message_en="On our platform you can find 100+ ready IT solutions.",
                status=ContentStatus.ACTIVE,
                target=TargetAudience.ALL,
            ),
        ]
        db.add_all(notifications)
        db.commit()
        print(f"[OK] {len(notifications)} ta xabarnoma qo'shildi")
    else:
        print(f"[SKIP] Xabarnomalar allaqachon mavjud: {existing_notif} ta")

    print("\n=== Kontent seed yakunlandi ===")

except Exception as e:
    print(f"[ERROR] {e}")
    db.rollback()
finally:
    db.close()
