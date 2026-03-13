import psycopg2
import json

# Database connection
conn = psycopg2.connect('postgresql://postgres:postgres@localhost:5432/cursor_market')
cur = conn.cursor()

print("Connected to database")

# Project updates with full 3-language data
projects_data = [
    {
        "id": 12,
        "name_uz": "Nonbor - Oshxona Avtomatlashtirish",
        "name_ru": "Nonbor - Автоматизация общепита",
        "name_en": "Nonbor - Catering Automation",
        "description_uz": "Restoran, kafe va oshxonalar uchun to'liq avtomatlashtirish tizimi. Buyurtmalarni qabul qilish, oshxona boshqaruvi, hisobotlar va moliyaviy nazorat.",
        "description_ru": "Полная система автоматизации для ресторанов, кафе и столовых. Приём заказов, управление кухней, отчёты и финансовый контроль.",
        "description_en": "Complete automation system for restaurants, cafes and canteens. Order management, kitchen control, reports and financial monitoring.",
        "technologies": ["Python", "FastAPI", "PostgreSQL", "React", "WebSocket"],
        "features": [
            {"uz": "Onlayn buyurtma qabul qilish", "ru": "Онлайн приём заказов", "en": "Online order acceptance"},
            {"uz": "Real-time oshxona monitoring", "ru": "Мониторинг кухни в реальном времени", "en": "Real-time kitchen monitoring"},
            {"uz": "Moliyaviy hisobotlar", "ru": "Финансовая отчётность", "en": "Financial reports"},
            {"uz": "Inventar nazorati", "ru": "Контроль инвентаря", "en": "Inventory control"},
            {"uz": "Xodimlar boshqaruvi", "ru": "Управление персоналом", "en": "Staff management"}
        ],
        "integrations": ["Telegram", "Payme", "Click"],
        "is_top": True,
        "is_new": False
    },
    {
        "id": 11,
        "name_uz": "1C ERP - Korxona Yechimi",
        "name_ru": "1С ERP - Корпоративное решение",
        "name_en": "1C ERP - Enterprise Solution",
        "description_uz": "1C ERP tizimi bilan to'liq integratsiya. Moliyaviy hisobotlar, buxgalteriya, ish haqi hisoblash va korxona resurslarini boshqarish.",
        "description_ru": "Полная интеграция с системой 1С ERP. Финансовая отчётность, бухгалтерия, расчёт заработной платы и управление ресурсами предприятия.",
        "description_en": "Full integration with 1C ERP system. Financial reporting, accounting, payroll calculation and enterprise resource management.",
        "technologies": ["1C", "Python", "PostgreSQL", "REST API", "XML"],
        "features": [
            {"uz": "Moliyaviy hisobotlar", "ru": "Финансовая отчётность", "en": "Financial reports"},
            {"uz": "Inventar sinxronizatsiyasi", "ru": "Синхронизация инвентаря", "en": "Inventory synchronization"},
            {"uz": "HR boshqaruvi", "ru": "Управление персоналом", "en": "HR management"},
            {"uz": "Ish haqi tizimi", "ru": "Система расчёта зарплаты", "en": "Payroll system"},
            {"uz": "Avtomatik hisobotlar", "ru": "Автоматические отчёты", "en": "Automated reports"}
        ],
        "integrations": ["1C", "Email", "Telegram"],
        "is_top": False,
        "is_new": True
    },
    {
        "id": 10,
        "name_uz": "AmoCRM Professional Integratsiya",
        "name_ru": "AmoCRM Профессиональная интеграция",
        "name_en": "AmoCRM Professional Integration",
        "description_uz": "AmoCRM bilan to'liq integratsiya. Avtomatik lead yaratish, savdo voronkasi boshqaruvi, mijozlar bilan munosabatlar.",
        "description_ru": "Полная интеграция с AmoCRM. Автоматическое создание лидов, управление воронкой продаж, работа с клиентами.",
        "description_en": "Full AmoCRM integration. Automatic lead creation, sales funnel management, customer relationships.",
        "technologies": ["Python", "AmoCRM API", "Webhook", "FastAPI", "Redis"],
        "features": [
            {"uz": "Avtomatik lead yaratish", "ru": "Автоматическое создание лидов", "en": "Automatic lead creation"},
            {"uz": "Savdo voronkasi boshqaruvi", "ru": "Управление воронкой продаж", "en": "Sales funnel management"},
            {"uz": "Email integratsiyasi", "ru": "Интеграция с email", "en": "Email integration"},
            {"uz": "Vazifalarni avtomatlashtirish", "ru": "Автоматизация задач", "en": "Task automation"},
            {"uz": "Analitika va hisobotlar", "ru": "Аналитика и отчёты", "en": "Analytics and reports"}
        ],
        "integrations": ["AmoCRM", "Telegram", "Email", "WhatsApp"],
        "is_top": False,
        "is_new": False
    },
    {
        "id": 9,
        "name_uz": "Ombor Boshqaruv Tizimi Pro",
        "name_ru": "Система управления складом Pro",
        "name_en": "Warehouse Management System Pro",
        "description_uz": "Zamonaviy ombor boshqaruv tizimi. Real-time inventar nazorati, barcode skanerlash, avtomatik buyurtmalar va keng qamrovli hisobotlar.",
        "description_ru": "Современная система управления складом. Контроль инвентаря в реальном времени, сканирование штрих-кодов, автоматические заказы и расширенная отчётность.",
        "description_en": "Modern warehouse management system. Real-time inventory control, barcode scanning, automatic orders and comprehensive reporting.",
        "technologies": ["Python", "FastAPI", "PostgreSQL", "React Native", "Barcode API"],
        "features": [
            {"uz": "Real-time inventar nazorati", "ru": "Контроль инвентаря в реальном времени", "en": "Real-time inventory control"},
            {"uz": "Barcode skanerlash", "ru": "Сканирование штрих-кодов", "en": "Barcode scanning"},
            {"uz": "Avtomatik buyurtmalar", "ru": "Автоматические заказы", "en": "Automatic orders"},
            {"uz": "Hisobot va analitika", "ru": "Отчёты и аналитика", "en": "Reports and analytics"},
            {"uz": "Mobil ilova", "ru": "Мобильное приложение", "en": "Mobile application"}
        ],
        "integrations": ["Telegram", "1C", "Excel"],
        "is_top": True,
        "is_new": False
    },
    {
        "id": 4,
        "name_uz": "AI Chatbot - Sun'iy Intellekt Yordamchisi",
        "name_ru": "AI Chatbot - Помощник на основе ИИ",
        "name_en": "AI Chatbot - Artificial Intelligence Assistant",
        "description_uz": "Sun'iy intellekt asosidagi zamonaviy chatbot. Tabiiy tilni qayta ishlash, ko'p tilli qo'llab-quvvatlash va o'rganish qobiliyati.",
        "description_ru": "Современный чат-бот на основе искусственного интеллекта. Обработка естественного языка, многоязычная поддержка и способность к обучению.",
        "description_en": "Modern chatbot based on artificial intelligence. Natural language processing, multilingual support and learning capability.",
        "technologies": ["Python", "TensorFlow", "FastAPI", "NLP", "OpenAI API"],
        "features": [
            {"uz": "Tabiiy tilni qayta ishlash", "ru": "Обработка естественного языка", "en": "Natural language processing"},
            {"uz": "Ko'p tilli qo'llab-quvvatlash", "ru": "Многоязычная поддержка", "en": "Multilingual support"},
            {"uz": "O'rganish qobiliyati", "ru": "Способность к обучению", "en": "Learning capability"},
            {"uz": "Analitika va statistika", "ru": "Аналитика и статистика", "en": "Analytics and statistics"},
            {"uz": "24/7 avtomatik javoblar", "ru": "Автоматические ответы 24/7", "en": "24/7 automatic responses"}
        ],
        "integrations": ["Telegram", "WhatsApp", "Website Widget"],
        "is_top": False,
        "is_new": True
    },
    {
        "id": 3,
        "name_uz": "Mobil Bank Ilovasi",
        "name_ru": "Мобильное банковское приложение",
        "name_en": "Mobile Banking Application",
        "description_uz": "To'liq funksional mobil bank ilovasi. Pul o'tkazmalari, to'lovlar, karta boshqaruvi va kredit arizalari.",
        "description_ru": "Полнофункциональное мобильное банковское приложение. Денежные переводы, платежи, управление картами и кредитные заявки.",
        "description_en": "Full-featured mobile banking application. Money transfers, payments, card management and loan applications.",
        "technologies": ["Flutter", "Dart", "Firebase", "REST API", "Biometric Auth"],
        "features": [
            {"uz": "Pul o'tkazmalari", "ru": "Денежные переводы", "en": "Money transfers"},
            {"uz": "Kommunal to'lovlar", "ru": "Оплата коммунальных услуг", "en": "Utility payments"},
            {"uz": "Karta boshqaruvi", "ru": "Управление картами", "en": "Card management"},
            {"uz": "Kredit arizalari", "ru": "Кредитные заявки", "en": "Loan applications"},
            {"uz": "Biometrik autentifikatsiya", "ru": "Биометрическая аутентификация", "en": "Biometric authentication"}
        ],
        "integrations": ["Uzcard", "Humo", "Visa", "Mastercard", "Payme"],
        "is_top": False,
        "is_new": True
    },
    {
        "id": 2,
        "name_uz": "CRM Dashboard - Mijozlar Boshqaruvi",
        "name_ru": "CRM Dashboard - Управление клиентами",
        "name_en": "CRM Dashboard - Customer Management",
        "description_uz": "Zamonaviy CRM tizimi. Mijozlarni boshqarish, analitika, hisobotlar va jamoa hamkorligi uchun yechim.",
        "description_ru": "Современная CRM система. Решение для управления клиентами, аналитики, отчётности и командного взаимодействия.",
        "description_en": "Modern CRM system. Solution for customer management, analytics, reporting and team collaboration.",
        "technologies": ["React", "TypeScript", "TailwindCSS", "Node.js", "MongoDB"],
        "features": [
            {"uz": "Mijozlar boshqaruvi", "ru": "Управление клиентами", "en": "Customer management"},
            {"uz": "Analitika va statistika", "ru": "Аналитика и статистика", "en": "Analytics and statistics"},
            {"uz": "Hisobotlar tizimi", "ru": "Система отчётов", "en": "Reporting system"},
            {"uz": "Jamoa hamkorligi", "ru": "Командное взаимодействие", "en": "Team collaboration"},
            {"uz": "Email marketing", "ru": "Email маркетинг", "en": "Email marketing"}
        ],
        "integrations": ["Google Analytics", "Mailchimp", "Slack", "Telegram"],
        "is_top": True,
        "is_new": False
    }
]

# Update each project
for project in projects_data:
    project_id = project["id"]

    try:
        cur.execute("""
            UPDATE projects SET
                name_uz = %s,
                name_ru = %s,
                name_en = %s,
                description_uz = %s,
                description_ru = %s,
                description_en = %s,
                technologies = %s,
                features = %s,
                integrations = %s,
                is_top = %s,
                is_new = %s,
                updated_at = NOW()
            WHERE id = %s
        """, (
            project["name_uz"],
            project["name_ru"],
            project["name_en"],
            project["description_uz"],
            project["description_ru"],
            project["description_en"],
            json.dumps(project["technologies"]),
            json.dumps(project["features"]),
            json.dumps(project["integrations"]),
            project["is_top"],
            project["is_new"],
            project_id
        ))

        print(f"[OK] Project {project_id} updated: {project['name_uz']}")
    except Exception as e:
        print(f"[ERROR] Project {project_id} error: {str(e)}")

# Commit changes
conn.commit()
print("\n=== All projects updated! ===")

# Close connection
cur.close()
conn.close()
