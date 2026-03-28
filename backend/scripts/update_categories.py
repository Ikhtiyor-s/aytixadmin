"""
Kategoriyalarni 3 tilda yangilash va yangilarini qo'shish
"""
from app.core.database import SessionLocal
from app.models import CategoryProject, SubcategoryProject

db = SessionLocal()

# 1. Mavjud kategoriyalar tarjimalari
existing_translations = {
    'Biznes va Avtomatlashtirish': {
        'ru': 'Бизнес и Автоматизация',
        'en': 'Business & Automation',
        'icon': '🏢',
        'subs': {
            'CRM tizimlari': ('CRM системы', 'CRM Systems'),
            'ERP tizimlari': ('ERP системы', 'ERP Systems'),
            'Ombor va inventar boshqaruvi': ('Управление складом и инвентарём', 'Warehouse & Inventory Management'),
            'Buyurtma va savdo boshqaruvi': ('Управление заказами и продажами', 'Order & Sales Management'),
            'Hisob-kitob va billing': ('Учёт и биллинг', 'Accounting & Billing'),
            'Kadrlar (HR) tizimlari': ('HR системы', 'HR Systems'),
            'Avtomatik hisobotlar': ('Автоматические отчёты', 'Automated Reports'),
            'Raqamli hujjatlashtirish': ('Цифровая документация', 'Digital Documentation')
        }
    },
    'Savdo va Marketing': {
        'ru': 'Продажи и Маркетинг',
        'en': 'Sales & Marketing',
        'icon': '📈',
        'subs': {
            'Onlayn savdo platformalari': ('Онлайн торговые платформы', 'Online Sales Platforms'),
            'Internet do\'konlar': ('Интернет-магазины', 'E-commerce Stores'),
            'Reklama boshqaruvi': ('Управление рекламой', 'Ads Management'),
            'SMM va kontent rejalashtirish': ('SMM и планирование контента', 'SMM & Content Planning'),
            'Lead generation tizimlari': ('Системы лидогенерации', 'Lead Generation Systems'),
            'Email & SMS marketing': ('Email и SMS маркетинг', 'Email & SMS Marketing'),
            'Call-center avtomatlashtirish': ('Автоматизация call-центра', 'Call Center Automation'),
            'Affiliate marketing tizimlari': ('Партнёрский маркетинг', 'Affiliate Marketing Systems')
        }
    },
    'Moliyaviy Texnologiyalar': {
        'ru': 'Финансовые Технологии',
        'en': 'Financial Technologies',
        'icon': '💰',
        'subs': {
            'Buxgalteriya dasturlari': ('Бухгалтерские программы', 'Accounting Software'),
            'Soliq va hisobot tizimlari': ('Налоговые и отчётные системы', 'Tax & Reporting Systems'),
            'To\'lov integratsiyalari': ('Платёжные интеграции', 'Payment Integrations'),
            'Bank API va billing': ('Bank API и биллинг', 'Bank API & Billing'),
            'Kredit va qarz boshqaruvi': ('Управление кредитами и займами', 'Credit & Loan Management'),
            'Kassa va POS tizimlari': ('Кассы и POS системы', 'POS Systems'),
            'Valyuta va konvertatsiya': ('Валюта и конвертация', 'Currency & Conversion'),
            'Obuna tizimlari': ('Системы подписок', 'Subscription Systems')
        }
    },
    'Ta\'lim va O\'rganish': {
        'ru': 'Образование и Обучение',
        'en': 'Education & Learning',
        'icon': '📚',
        'subs': {
            'LMS platformalari': ('LMS платформы', 'LMS Platforms'),
            'Test va imtihon tizimlari': ('Системы тестов и экзаменов', 'Test & Exam Systems'),
            'Video dars platformalari': ('Видео-урок платформы', 'Video Course Platforms'),
            'O\'quvchilarni boshqarish': ('Управление учениками', 'Student Management'),
            'Sertifikatlash tizimlari': ('Системы сертификации', 'Certification Systems'),
            'Trening va webinar': ('Тренинги и вебинары', 'Training & Webinars'),
            'Onlayn kurs marketplace': ('Маркетплейс онлайн курсов', 'Online Course Marketplace'),
            'AI yordamchi o\'qituvchilar': ('AI-помощники учителей', 'AI Teaching Assistants')
        }
    },
    'AI va Avtomatik Yordamchilar': {
        'ru': 'AI и Автоматические Помощники',
        'en': 'AI & Automation Assistants',
        'icon': '🤖',
        'subs': {
            'Chatbotlar (Telegram / Web)': ('Чатботы (Telegram / Web)', 'Chatbots (Telegram / Web)'),
            'AI konsultantlar': ('AI консультанты', 'AI Consultants'),
            'Matn, rasm va video AI': ('Текст, изображения и видео AI', 'Text, Image & Video AI'),
            'Ovoz orqali boshqaruv': ('Голосовое управление', 'Voice Control'),
            'AI analytics va prognoz': ('AI аналитика и прогноз', 'AI Analytics & Forecasting'),
            'Tavsiya tizimlari': ('Рекомендательные системы', 'Recommendation Systems'),
            'Avtomatik javob beruvchi': ('Автоответчики', 'Auto Responders'),
            'Custom AI yechimlar': ('Кастомные AI решения', 'Custom AI Solutions')
        }
    },
    'Mobil va Veb Ilovalar': {
        'ru': 'Мобильные и Веб Приложения',
        'en': 'Mobile & Web Apps',
        'icon': '📱',
        'subs': {
            'Mobil ilovalar': ('Мобильные приложения', 'Mobile Apps'),
            'Veb platformalar': ('Веб платформы', 'Web Platforms'),
            'Admin panellar': ('Админ панели', 'Admin Panels'),
            'Landing page va saytlar': ('Лендинги и сайты', 'Landing Pages & Websites'),
            'Progressive Web App': ('Progressive Web App', 'Progressive Web Apps'),
            'API va backend': ('API и бэкенд', 'API & Backend'),
            'SaaS platformalar': ('SaaS платформы', 'SaaS Platforms'),
            'UI/UX dizayn': ('UI/UX дизайн', 'UI/UX Design Services')
        }
    },
    'Logistika va Yetkazib Berish': {
        'ru': 'Логистика и Доставка',
        'en': 'Logistics & Delivery',
        'icon': '🚚',
        'subs': {
            'Yetkazib berish tizimlari': ('Системы доставки', 'Delivery Systems'),
            'Kuryer boshqaruvi': ('Управление курьерами', 'Courier Management'),
            'Marshrut optimizatsiyasi': ('Оптимизация маршрутов', 'Route Optimization'),
            'Buyurtma tracking': ('Отслеживание заказов', 'Order Tracking'),
            'Ombor logistika': ('Складская логистика', 'Warehouse Logistics'),
            'GPS va xarita integratsiya': ('GPS и интеграция карт', 'GPS & Map Integration'),
            'Fleet management': ('Управление автопарком', 'Fleet Management'),
            'Avtomatik xabarnoma': ('Автоматические уведомления', 'Automated Notifications')
        }
    }
}

# 2. Yangi kategoriyalar (yo'q bo'lganlar)
new_categories = [
    {
        'name_uz': 'Qurilish va Ko\'chmas Mulk',
        'name_ru': 'Строительство и Недвижимость',
        'name_en': 'Construction & Real Estate',
        'icon': '🏗️',
        'order': 5,
        'subs': [
            ('Qurilish boshqaruvi tizimlari', 'Системы управления строительством', 'Construction Management Systems'),
            ('Loyiha va smeta dasturlari', 'Проектные и сметные программы', 'Project & Estimate Software'),
            ('Ombor va material nazorati', 'Контроль склада и материалов', 'Warehouse & Material Control'),
            ('Texnika ijarasi boshqaruvi', 'Управление арендой техники', 'Equipment Rental Management'),
            ('Real estate CRM', 'CRM для недвижимости', 'Real Estate CRM'),
            ('E\'lon va listing platformalari', 'Платформы объявлений и листингов', 'Listing Platforms'),
            ('Xarita va joylashuv tizimlari', 'Системы карт и местоположения', 'Map & Location Systems'),
            ('Smart qurilish yechimlari', 'Умные строительные решения', 'Smart Construction Solutions')
        ]
    },
    {
        'name_uz': 'Media va Dizayn',
        'name_ru': 'Медиа и Дизайн',
        'name_en': 'Media & Design',
        'icon': '🎨',
        'order': 8,
        'subs': [
            ('Grafik dizayn', 'Графический дизайн', 'Graphic Design'),
            ('Brending va logo', 'Брендинг и логотипы', 'Branding & Logo'),
            ('Video montaj', 'Видеомонтаж', 'Video Editing'),
            ('Motion dizayn', 'Моушн дизайн', 'Motion Design'),
            ('UI/UX dizayn', 'UI/UX дизайн', 'UI/UX Design'),
            ('Reklama bannerlari', 'Рекламные баннеры', 'Ad Banners'),
            ('Social media dizayn', 'Дизайн для соцсетей', 'Social Media Design'),
            ('Prezentatsiya dizayni', 'Дизайн презентаций', 'Presentation Design')
        ]
    },
    {
        'name_uz': 'Sanoat va Ishlab Chiqarish',
        'name_ru': 'Промышленность и Производство',
        'name_en': 'Industry & Manufacturing',
        'icon': '🏭',
        'order': 10,
        'subs': [
            ('Ishlab chiqarish monitoringi', 'Мониторинг производства', 'Production Monitoring'),
            ('Texnik xizmat nazorati', 'Контроль техобслуживания', 'Maintenance Control'),
            ('IoT boshqaruvi', 'Управление IoT', 'IoT Management'),
            ('Sifat nazorati tizimlari', 'Системы контроля качества', 'Quality Control Systems'),
            ('Buyurtma ishlab chiqarish', 'Производство под заказ', 'Custom Manufacturing'),
            ('Energiya monitoringi', 'Мониторинг энергии', 'Energy Monitoring'),
            ('Zavod ERP', 'Заводской ERP', 'Factory ERP'),
            ('Avtomatik rejalashtirish', 'Автоматическое планирование', 'Automated Planning')
        ]
    },
    {
        'name_uz': 'Startaplar va Maxsus Buyurtmalar',
        'name_ru': 'Стартапы и Заказная Разработка',
        'name_en': 'Startups & Custom Orders',
        'icon': '🚀',
        'order': 11,
        'subs': [
            ('MVP ishlab chiqish', 'Разработка MVP', 'MVP Development'),
            ('Startap prototiplari', 'Прототипы стартапов', 'Startup Prototypes'),
            ('Maxsus dastur buyurtmalari', 'Заказная разработка ПО', 'Custom Software Orders'),
            ('Texnik konsultatsiya', 'Техническая консультация', 'Technical Consulting'),
            ('Digital transformatsiya', 'Цифровая трансформация', 'Digital Transformation'),
            ('API integratsiyalar', 'API интеграции', 'API Integrations'),
            ('Legacy system modernizatsiya', 'Модернизация legacy систем', 'Legacy System Modernization'),
            ('Texnik audit', 'Технический аудит', 'Technical Audit')
        ]
    }
]

try:
    # 1. Mavjud kategoriyalarni yangilash
    print("=" * 50)
    print("Mavjud kategoriyalarni yangilash...")
    print("=" * 50)

    for cat in db.query(CategoryProject).all():
        if cat.name_uz in existing_translations:
            t = existing_translations[cat.name_uz]
            cat.name_ru = t['ru']
            cat.name_en = t['en']
            cat.icon = t['icon']
            print(f"[OK] {cat.name_uz} yangilandi")

            # Subkategoriyalarni yangilash
            for sub in db.query(SubcategoryProject).filter(SubcategoryProject.category_id == cat.id).all():
                if sub.name_uz in t['subs']:
                    sub.name_ru = t['subs'][sub.name_uz][0]
                    sub.name_en = t['subs'][sub.name_uz][1]

    # 2. Support kategoriyasini o'chirish
    support_cat = db.query(CategoryProject).filter(CategoryProject.name_uz == 'Support').first()
    if support_cat:
        # Avval subkategoriyalarni o'chirish
        db.query(SubcategoryProject).filter(SubcategoryProject.category_id == support_cat.id).delete()
        db.delete(support_cat)
        print("✓ Support kategoriyasi o'chirildi")

    # 3. Yangi kategoriyalarni qo'shish
    print("\n" + "=" * 50)
    print("Yangi kategoriyalarni qo'shish...")
    print("=" * 50)

    for cat_data in new_categories:
        # Kategoriya mavjudligini tekshirish
        existing = db.query(CategoryProject).filter(CategoryProject.name_uz == cat_data['name_uz']).first()
        if existing:
            print(f"[WARN] {cat_data['name_uz']} allaqachon mavjud, o'tkazib yuborildi")
            continue

        # Yangi kategoriya yaratish
        new_cat = CategoryProject(
            name_uz=cat_data['name_uz'],
            name_ru=cat_data['name_ru'],
            name_en=cat_data['name_en'],
            icon=cat_data['icon'],
            order=cat_data['order'],
            is_active=True
        )
        db.add(new_cat)
        db.flush()  # ID olish uchun

        print(f"[OK] {cat_data['name_uz']} qo'shildi")

        # Subkategoriyalarni qo'shish
        for i, (name_uz, name_ru, name_en) in enumerate(cat_data['subs']):
            sub = SubcategoryProject(
                name_uz=name_uz,
                name_ru=name_ru,
                name_en=name_en,
                category_id=new_cat.id,
                order=i,
                is_active=True
            )
            db.add(sub)
            print(f"  + {name_uz}")

    db.commit()

    print("\n" + "=" * 50)
    print("YAKUNLANDI!")
    print("=" * 50)

    # Natijani ko'rsatish
    total_cats = db.query(CategoryProject).count()
    total_subs = db.query(SubcategoryProject).count()
    print(f"Jami kategoriyalar: {total_cats}")
    print(f"Jami subkategoriyalar: {total_subs}")

except Exception as e:
    print(f"Xatolik: {e}")
    db.rollback()
finally:
    db.close()
