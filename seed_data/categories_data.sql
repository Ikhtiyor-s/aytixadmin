-- AyTiX Marketplace - Kategoriyalar va Subkategoriyalar
-- 11 kategoriya, 88 subkategoriya (3 tilda: UZ, RU, EN)
-- Yaratilgan: 2025-01-06

-- Avval mavjud ma'lumotlarni tozalash (ixtiyoriy)
-- TRUNCATE TABLE subcategory_projects CASCADE;
-- TRUNCATE TABLE category_projects CASCADE;

-- =====================================================
-- KATEGORIYALAR (category_projects)
-- =====================================================

INSERT INTO category_projects (id, name_uz, name_ru, name_en, description_uz, description_ru, description_en, icon, "order", is_active, created_at)
VALUES (8, 'Biznes va Avtomatlashtirish', 'Бизнес и Автоматизация', 'Business & Automation', 'CRM, ERP va biznes jarayonlarini avtomatlashtirish tizimlari', 'CRM, ERP и системы автоматизации бизнес-процессов', 'CRM, ERP and business process automation systems', '🏢', 1, true, NOW())
ON CONFLICT (id) DO UPDATE SET
    name_uz = EXCLUDED.name_uz,
    name_ru = EXCLUDED.name_ru,
    name_en = EXCLUDED.name_en,
    icon = EXCLUDED.icon,
    "order" = EXCLUDED."order",
    is_active = EXCLUDED.is_active;

INSERT INTO category_projects (id, name_uz, name_ru, name_en, description_uz, description_ru, description_en, icon, "order", is_active, created_at)
VALUES (9, 'Savdo va Marketing', 'Продажи и Маркетинг', 'Sales & Marketing', 'E-commerce, reklama va marketing avtomatlashtirish', 'Автоматизация электронной коммерции, рекламы и маркетинга', 'E-commerce, advertising and marketing automation', '📈', 2, true, NOW())
ON CONFLICT (id) DO UPDATE SET
    name_uz = EXCLUDED.name_uz,
    name_ru = EXCLUDED.name_ru,
    name_en = EXCLUDED.name_en,
    icon = EXCLUDED.icon,
    "order" = EXCLUDED."order",
    is_active = EXCLUDED.is_active;

INSERT INTO category_projects (id, name_uz, name_ru, name_en, description_uz, description_ru, description_en, icon, "order", is_active, created_at)
VALUES (10, 'Moliyaviy Texnologiyalar', 'Финансовые Технологии', 'Financial Technologies', 'Buxgalteriya, to''lov tizimlari va moliyaviy xizmatlar', 'Бухгалтерский учет, платежные системы и финансовые услуги', 'Accounting, payment systems and financial services', '💰', 3, true, NOW())
ON CONFLICT (id) DO UPDATE SET
    name_uz = EXCLUDED.name_uz,
    name_ru = EXCLUDED.name_ru,
    name_en = EXCLUDED.name_en,
    icon = EXCLUDED.icon,
    "order" = EXCLUDED."order",
    is_active = EXCLUDED.is_active;

INSERT INTO category_projects (id, name_uz, name_ru, name_en, description_uz, description_ru, description_en, icon, "order", is_active, created_at)
VALUES (11, 'Ta''lim va O''rganish', 'Образование и Обучение', 'Education & Learning', 'LMS, online ta''lim va test platformalari', 'LMS, платформы онлайн-обучения и тестирования', 'LMS, online learning and testing platforms', '📚', 4, true, NOW())
ON CONFLICT (id) DO UPDATE SET
    name_uz = EXCLUDED.name_uz,
    name_ru = EXCLUDED.name_ru,
    name_en = EXCLUDED.name_en,
    icon = EXCLUDED.icon,
    "order" = EXCLUDED."order",
    is_active = EXCLUDED.is_active;

INSERT INTO category_projects (id, name_uz, name_ru, name_en, description_uz, description_ru, description_en, icon, "order", is_active, created_at)
VALUES (12, 'AI va Avtomatik Yordamchilar', 'AI и Автоматические Помощники', 'AI & Automation Assistants', 'Chatbot, AI analytics va sun''iy intellekt yechimlari', 'Чат-бот, ИИ-аналитика и решения в области искусственного интеллекта', 'Chatbot, AI analytics and artificial intelligence solutions', '🤖', 6, true, NOW())
ON CONFLICT (id) DO UPDATE SET
    name_uz = EXCLUDED.name_uz,
    name_ru = EXCLUDED.name_ru,
    name_en = EXCLUDED.name_en,
    icon = EXCLUDED.icon,
    "order" = EXCLUDED."order",
    is_active = EXCLUDED.is_active;

INSERT INTO category_projects (id, name_uz, name_ru, name_en, description_uz, description_ru, description_en, icon, "order", is_active, created_at)
VALUES (13, 'Mobil va Veb Ilovalar', 'Мобильные и Веб Приложения', 'Mobile & Web Apps', 'Flutter, React, API va dasturiy ta''minot ishlab chiqish', 'Flutter, React, API и разработка программного обеспечения', 'Flutter, React, API and software development', '📱', 7, true, NOW())
ON CONFLICT (id) DO UPDATE SET
    name_uz = EXCLUDED.name_uz,
    name_ru = EXCLUDED.name_ru,
    name_en = EXCLUDED.name_en,
    icon = EXCLUDED.icon,
    "order" = EXCLUDED."order",
    is_active = EXCLUDED.is_active;

INSERT INTO category_projects (id, name_uz, name_ru, name_en, description_uz, description_ru, description_en, icon, "order", is_active, created_at)
VALUES (14, 'Logistika va Yetkazib Berish', 'Логистика и Доставка', 'Logistics & Delivery', 'Yetkazib berish, kuryer va marshrut tizimlari', 'Системы доставки, курьерской доставки и маршрутизации', 'Delivery, courier and routing systems', '🚚', 9, true, NOW())
ON CONFLICT (id) DO UPDATE SET
    name_uz = EXCLUDED.name_uz,
    name_ru = EXCLUDED.name_ru,
    name_en = EXCLUDED.name_en,
    icon = EXCLUDED.icon,
    "order" = EXCLUDED."order",
    is_active = EXCLUDED.is_active;

INSERT INTO category_projects (id, name_uz, name_ru, name_en, description_uz, description_ru, description_en, icon, "order", is_active, created_at)
VALUES (16, 'Qurilish va Ko''chmas Mulk', 'Строительство и Недвижимость', 'Construction & Real Estate', '', '', '', '🏗️', 5, true, NOW())
ON CONFLICT (id) DO UPDATE SET
    name_uz = EXCLUDED.name_uz,
    name_ru = EXCLUDED.name_ru,
    name_en = EXCLUDED.name_en,
    icon = EXCLUDED.icon,
    "order" = EXCLUDED."order",
    is_active = EXCLUDED.is_active;

INSERT INTO category_projects (id, name_uz, name_ru, name_en, description_uz, description_ru, description_en, icon, "order", is_active, created_at)
VALUES (17, 'Media va Dizayn', 'Медиа и Дизайн', 'Media & Design', '', '', '', '🎨', 8, true, NOW())
ON CONFLICT (id) DO UPDATE SET
    name_uz = EXCLUDED.name_uz,
    name_ru = EXCLUDED.name_ru,
    name_en = EXCLUDED.name_en,
    icon = EXCLUDED.icon,
    "order" = EXCLUDED."order",
    is_active = EXCLUDED.is_active;

INSERT INTO category_projects (id, name_uz, name_ru, name_en, description_uz, description_ru, description_en, icon, "order", is_active, created_at)
VALUES (18, 'Sanoat va Ishlab Chiqarish', 'Промышленность и Производство', 'Industry & Manufacturing', '', '', '', '🏭', 10, true, NOW())
ON CONFLICT (id) DO UPDATE SET
    name_uz = EXCLUDED.name_uz,
    name_ru = EXCLUDED.name_ru,
    name_en = EXCLUDED.name_en,
    icon = EXCLUDED.icon,
    "order" = EXCLUDED."order",
    is_active = EXCLUDED.is_active;

INSERT INTO category_projects (id, name_uz, name_ru, name_en, description_uz, description_ru, description_en, icon, "order", is_active, created_at)
VALUES (19, 'Startaplar va Maxsus Buyurtmalar', 'Стартапы и Заказная Разработка', 'Startups & Custom Orders', '', '', '', '🚀', 11, true, NOW())
ON CONFLICT (id) DO UPDATE SET
    name_uz = EXCLUDED.name_uz,
    name_ru = EXCLUDED.name_ru,
    name_en = EXCLUDED.name_en,
    icon = EXCLUDED.icon,
    "order" = EXCLUDED."order",
    is_active = EXCLUDED.is_active;


-- =====================================================
-- SUBKATEGORIYALAR (subcategory_projects)
-- =====================================================

INSERT INTO subcategory_projects (id, name_uz, name_ru, name_en, category_id, "order", is_active, created_at)
VALUES (1, 'CRM tizimlari', 'CRM системы', 'CRM Systems', 8, 1, true, NOW())
ON CONFLICT (id) DO UPDATE SET
    name_uz = EXCLUDED.name_uz,
    name_ru = EXCLUDED.name_ru,
    name_en = EXCLUDED.name_en,
    category_id = EXCLUDED.category_id,
    "order" = EXCLUDED."order",
    is_active = EXCLUDED.is_active;

INSERT INTO subcategory_projects (id, name_uz, name_ru, name_en, category_id, "order", is_active, created_at)
VALUES (2, 'ERP tizimlari', 'ERP системы', 'ERP Systems', 8, 2, true, NOW())
ON CONFLICT (id) DO UPDATE SET
    name_uz = EXCLUDED.name_uz,
    name_ru = EXCLUDED.name_ru,
    name_en = EXCLUDED.name_en,
    category_id = EXCLUDED.category_id,
    "order" = EXCLUDED."order",
    is_active = EXCLUDED.is_active;

INSERT INTO subcategory_projects (id, name_uz, name_ru, name_en, category_id, "order", is_active, created_at)
VALUES (3, 'Ombor va inventar boshqaruvi', 'Управление складом и инвентарём', 'Warehouse & Inventory Management', 8, 3, true, NOW())
ON CONFLICT (id) DO UPDATE SET
    name_uz = EXCLUDED.name_uz,
    name_ru = EXCLUDED.name_ru,
    name_en = EXCLUDED.name_en,
    category_id = EXCLUDED.category_id,
    "order" = EXCLUDED."order",
    is_active = EXCLUDED.is_active;

INSERT INTO subcategory_projects (id, name_uz, name_ru, name_en, category_id, "order", is_active, created_at)
VALUES (4, 'Buyurtma va savdo boshqaruvi', 'Управление заказами и продажами', 'Order & Sales Management', 8, 4, true, NOW())
ON CONFLICT (id) DO UPDATE SET
    name_uz = EXCLUDED.name_uz,
    name_ru = EXCLUDED.name_ru,
    name_en = EXCLUDED.name_en,
    category_id = EXCLUDED.category_id,
    "order" = EXCLUDED."order",
    is_active = EXCLUDED.is_active;

INSERT INTO subcategory_projects (id, name_uz, name_ru, name_en, category_id, "order", is_active, created_at)
VALUES (5, 'Hisob-kitob va billing', 'Учёт и биллинг', 'Accounting & Billing', 8, 5, true, NOW())
ON CONFLICT (id) DO UPDATE SET
    name_uz = EXCLUDED.name_uz,
    name_ru = EXCLUDED.name_ru,
    name_en = EXCLUDED.name_en,
    category_id = EXCLUDED.category_id,
    "order" = EXCLUDED."order",
    is_active = EXCLUDED.is_active;

INSERT INTO subcategory_projects (id, name_uz, name_ru, name_en, category_id, "order", is_active, created_at)
VALUES (6, 'Kadrlar (HR) tizimlari', 'HR системы', 'HR Systems', 8, 6, true, NOW())
ON CONFLICT (id) DO UPDATE SET
    name_uz = EXCLUDED.name_uz,
    name_ru = EXCLUDED.name_ru,
    name_en = EXCLUDED.name_en,
    category_id = EXCLUDED.category_id,
    "order" = EXCLUDED."order",
    is_active = EXCLUDED.is_active;

INSERT INTO subcategory_projects (id, name_uz, name_ru, name_en, category_id, "order", is_active, created_at)
VALUES (7, 'Avtomatik hisobotlar', 'Автоматические отчёты', 'Automated Reports', 8, 7, true, NOW())
ON CONFLICT (id) DO UPDATE SET
    name_uz = EXCLUDED.name_uz,
    name_ru = EXCLUDED.name_ru,
    name_en = EXCLUDED.name_en,
    category_id = EXCLUDED.category_id,
    "order" = EXCLUDED."order",
    is_active = EXCLUDED.is_active;

INSERT INTO subcategory_projects (id, name_uz, name_ru, name_en, category_id, "order", is_active, created_at)
VALUES (8, 'Raqamli hujjatlashtirish', 'Цифровая документация', 'Digital Documentation', 8, 8, true, NOW())
ON CONFLICT (id) DO UPDATE SET
    name_uz = EXCLUDED.name_uz,
    name_ru = EXCLUDED.name_ru,
    name_en = EXCLUDED.name_en,
    category_id = EXCLUDED.category_id,
    "order" = EXCLUDED."order",
    is_active = EXCLUDED.is_active;

INSERT INTO subcategory_projects (id, name_uz, name_ru, name_en, category_id, "order", is_active, created_at)
VALUES (9, 'Onlayn savdo platformalari', 'Онлайн торговые платформы', 'Online Sales Platforms', 9, 1, true, NOW())
ON CONFLICT (id) DO UPDATE SET
    name_uz = EXCLUDED.name_uz,
    name_ru = EXCLUDED.name_ru,
    name_en = EXCLUDED.name_en,
    category_id = EXCLUDED.category_id,
    "order" = EXCLUDED."order",
    is_active = EXCLUDED.is_active;

INSERT INTO subcategory_projects (id, name_uz, name_ru, name_en, category_id, "order", is_active, created_at)
VALUES (10, 'Internet do''konlar', 'Интернет-магазины', 'E-commerce Stores', 9, 2, true, NOW())
ON CONFLICT (id) DO UPDATE SET
    name_uz = EXCLUDED.name_uz,
    name_ru = EXCLUDED.name_ru,
    name_en = EXCLUDED.name_en,
    category_id = EXCLUDED.category_id,
    "order" = EXCLUDED."order",
    is_active = EXCLUDED.is_active;

INSERT INTO subcategory_projects (id, name_uz, name_ru, name_en, category_id, "order", is_active, created_at)
VALUES (11, 'Reklama boshqaruvi', 'Управление рекламой', 'Ads Management', 9, 3, true, NOW())
ON CONFLICT (id) DO UPDATE SET
    name_uz = EXCLUDED.name_uz,
    name_ru = EXCLUDED.name_ru,
    name_en = EXCLUDED.name_en,
    category_id = EXCLUDED.category_id,
    "order" = EXCLUDED."order",
    is_active = EXCLUDED.is_active;

INSERT INTO subcategory_projects (id, name_uz, name_ru, name_en, category_id, "order", is_active, created_at)
VALUES (12, 'SMM va kontent rejalashtirish', 'SMM и планирование контента', 'SMM & Content Planning', 9, 4, true, NOW())
ON CONFLICT (id) DO UPDATE SET
    name_uz = EXCLUDED.name_uz,
    name_ru = EXCLUDED.name_ru,
    name_en = EXCLUDED.name_en,
    category_id = EXCLUDED.category_id,
    "order" = EXCLUDED."order",
    is_active = EXCLUDED.is_active;

INSERT INTO subcategory_projects (id, name_uz, name_ru, name_en, category_id, "order", is_active, created_at)
VALUES (13, 'Lead generation tizimlari', 'Системы лидогенерации', 'Lead Generation Systems', 9, 5, true, NOW())
ON CONFLICT (id) DO UPDATE SET
    name_uz = EXCLUDED.name_uz,
    name_ru = EXCLUDED.name_ru,
    name_en = EXCLUDED.name_en,
    category_id = EXCLUDED.category_id,
    "order" = EXCLUDED."order",
    is_active = EXCLUDED.is_active;

INSERT INTO subcategory_projects (id, name_uz, name_ru, name_en, category_id, "order", is_active, created_at)
VALUES (14, 'Email & SMS marketing', 'Email и SMS маркетинг', 'Email & SMS Marketing', 9, 6, true, NOW())
ON CONFLICT (id) DO UPDATE SET
    name_uz = EXCLUDED.name_uz,
    name_ru = EXCLUDED.name_ru,
    name_en = EXCLUDED.name_en,
    category_id = EXCLUDED.category_id,
    "order" = EXCLUDED."order",
    is_active = EXCLUDED.is_active;

INSERT INTO subcategory_projects (id, name_uz, name_ru, name_en, category_id, "order", is_active, created_at)
VALUES (15, 'Call-center avtomatlashtirish', 'Автоматизация call-центра', 'Call Center Automation', 9, 7, true, NOW())
ON CONFLICT (id) DO UPDATE SET
    name_uz = EXCLUDED.name_uz,
    name_ru = EXCLUDED.name_ru,
    name_en = EXCLUDED.name_en,
    category_id = EXCLUDED.category_id,
    "order" = EXCLUDED."order",
    is_active = EXCLUDED.is_active;

INSERT INTO subcategory_projects (id, name_uz, name_ru, name_en, category_id, "order", is_active, created_at)
VALUES (16, 'Affiliate marketing tizimlari', 'Партнёрский маркетинг', 'Affiliate Marketing Systems', 9, 8, true, NOW())
ON CONFLICT (id) DO UPDATE SET
    name_uz = EXCLUDED.name_uz,
    name_ru = EXCLUDED.name_ru,
    name_en = EXCLUDED.name_en,
    category_id = EXCLUDED.category_id,
    "order" = EXCLUDED."order",
    is_active = EXCLUDED.is_active;

INSERT INTO subcategory_projects (id, name_uz, name_ru, name_en, category_id, "order", is_active, created_at)
VALUES (17, 'Buxgalteriya dasturlari', 'Бухгалтерские программы', 'Accounting Software', 10, 1, true, NOW())
ON CONFLICT (id) DO UPDATE SET
    name_uz = EXCLUDED.name_uz,
    name_ru = EXCLUDED.name_ru,
    name_en = EXCLUDED.name_en,
    category_id = EXCLUDED.category_id,
    "order" = EXCLUDED."order",
    is_active = EXCLUDED.is_active;

INSERT INTO subcategory_projects (id, name_uz, name_ru, name_en, category_id, "order", is_active, created_at)
VALUES (18, 'Soliq va hisobot tizimlari', 'Налоговые и отчётные системы', 'Tax & Reporting Systems', 10, 2, true, NOW())
ON CONFLICT (id) DO UPDATE SET
    name_uz = EXCLUDED.name_uz,
    name_ru = EXCLUDED.name_ru,
    name_en = EXCLUDED.name_en,
    category_id = EXCLUDED.category_id,
    "order" = EXCLUDED."order",
    is_active = EXCLUDED.is_active;

INSERT INTO subcategory_projects (id, name_uz, name_ru, name_en, category_id, "order", is_active, created_at)
VALUES (19, 'To''lov integratsiyalari', 'Платёжные интеграции', 'Payment Integrations', 10, 3, true, NOW())
ON CONFLICT (id) DO UPDATE SET
    name_uz = EXCLUDED.name_uz,
    name_ru = EXCLUDED.name_ru,
    name_en = EXCLUDED.name_en,
    category_id = EXCLUDED.category_id,
    "order" = EXCLUDED."order",
    is_active = EXCLUDED.is_active;

INSERT INTO subcategory_projects (id, name_uz, name_ru, name_en, category_id, "order", is_active, created_at)
VALUES (20, 'Bank API va billing', 'Bank API и биллинг', 'Bank API & Billing', 10, 4, true, NOW())
ON CONFLICT (id) DO UPDATE SET
    name_uz = EXCLUDED.name_uz,
    name_ru = EXCLUDED.name_ru,
    name_en = EXCLUDED.name_en,
    category_id = EXCLUDED.category_id,
    "order" = EXCLUDED."order",
    is_active = EXCLUDED.is_active;

INSERT INTO subcategory_projects (id, name_uz, name_ru, name_en, category_id, "order", is_active, created_at)
VALUES (21, 'Kredit va qarz boshqaruvi', 'Управление кредитами и займами', 'Credit & Loan Management', 10, 5, true, NOW())
ON CONFLICT (id) DO UPDATE SET
    name_uz = EXCLUDED.name_uz,
    name_ru = EXCLUDED.name_ru,
    name_en = EXCLUDED.name_en,
    category_id = EXCLUDED.category_id,
    "order" = EXCLUDED."order",
    is_active = EXCLUDED.is_active;

INSERT INTO subcategory_projects (id, name_uz, name_ru, name_en, category_id, "order", is_active, created_at)
VALUES (22, 'Kassa va POS tizimlari', 'Кассы и POS системы', 'POS Systems', 10, 6, true, NOW())
ON CONFLICT (id) DO UPDATE SET
    name_uz = EXCLUDED.name_uz,
    name_ru = EXCLUDED.name_ru,
    name_en = EXCLUDED.name_en,
    category_id = EXCLUDED.category_id,
    "order" = EXCLUDED."order",
    is_active = EXCLUDED.is_active;

INSERT INTO subcategory_projects (id, name_uz, name_ru, name_en, category_id, "order", is_active, created_at)
VALUES (23, 'Valyuta va konvertatsiya', 'Валюта и конвертация', 'Currency & Conversion', 10, 7, true, NOW())
ON CONFLICT (id) DO UPDATE SET
    name_uz = EXCLUDED.name_uz,
    name_ru = EXCLUDED.name_ru,
    name_en = EXCLUDED.name_en,
    category_id = EXCLUDED.category_id,
    "order" = EXCLUDED."order",
    is_active = EXCLUDED.is_active;

INSERT INTO subcategory_projects (id, name_uz, name_ru, name_en, category_id, "order", is_active, created_at)
VALUES (24, 'Obuna tizimlari', 'Системы подписок', 'Subscription Systems', 10, 8, true, NOW())
ON CONFLICT (id) DO UPDATE SET
    name_uz = EXCLUDED.name_uz,
    name_ru = EXCLUDED.name_ru,
    name_en = EXCLUDED.name_en,
    category_id = EXCLUDED.category_id,
    "order" = EXCLUDED."order",
    is_active = EXCLUDED.is_active;

INSERT INTO subcategory_projects (id, name_uz, name_ru, name_en, category_id, "order", is_active, created_at)
VALUES (25, 'LMS platformalari', 'LMS платформы', 'LMS Platforms', 11, 1, true, NOW())
ON CONFLICT (id) DO UPDATE SET
    name_uz = EXCLUDED.name_uz,
    name_ru = EXCLUDED.name_ru,
    name_en = EXCLUDED.name_en,
    category_id = EXCLUDED.category_id,
    "order" = EXCLUDED."order",
    is_active = EXCLUDED.is_active;

INSERT INTO subcategory_projects (id, name_uz, name_ru, name_en, category_id, "order", is_active, created_at)
VALUES (26, 'Test va imtihon tizimlari', 'Системы тестов и экзаменов', 'Test & Exam Systems', 11, 2, true, NOW())
ON CONFLICT (id) DO UPDATE SET
    name_uz = EXCLUDED.name_uz,
    name_ru = EXCLUDED.name_ru,
    name_en = EXCLUDED.name_en,
    category_id = EXCLUDED.category_id,
    "order" = EXCLUDED."order",
    is_active = EXCLUDED.is_active;

INSERT INTO subcategory_projects (id, name_uz, name_ru, name_en, category_id, "order", is_active, created_at)
VALUES (27, 'Video dars platformalari', 'Видео-урок платформы', 'Video Course Platforms', 11, 3, true, NOW())
ON CONFLICT (id) DO UPDATE SET
    name_uz = EXCLUDED.name_uz,
    name_ru = EXCLUDED.name_ru,
    name_en = EXCLUDED.name_en,
    category_id = EXCLUDED.category_id,
    "order" = EXCLUDED."order",
    is_active = EXCLUDED.is_active;

INSERT INTO subcategory_projects (id, name_uz, name_ru, name_en, category_id, "order", is_active, created_at)
VALUES (28, 'O''quvchilarni boshqarish', 'Управление учениками', 'Student Management', 11, 4, true, NOW())
ON CONFLICT (id) DO UPDATE SET
    name_uz = EXCLUDED.name_uz,
    name_ru = EXCLUDED.name_ru,
    name_en = EXCLUDED.name_en,
    category_id = EXCLUDED.category_id,
    "order" = EXCLUDED."order",
    is_active = EXCLUDED.is_active;

INSERT INTO subcategory_projects (id, name_uz, name_ru, name_en, category_id, "order", is_active, created_at)
VALUES (29, 'Sertifikatlash tizimlari', 'Системы сертификации', 'Certification Systems', 11, 5, true, NOW())
ON CONFLICT (id) DO UPDATE SET
    name_uz = EXCLUDED.name_uz,
    name_ru = EXCLUDED.name_ru,
    name_en = EXCLUDED.name_en,
    category_id = EXCLUDED.category_id,
    "order" = EXCLUDED."order",
    is_active = EXCLUDED.is_active;

INSERT INTO subcategory_projects (id, name_uz, name_ru, name_en, category_id, "order", is_active, created_at)
VALUES (30, 'Trening va webinar', 'Тренинги и вебинары', 'Training & Webinars', 11, 6, true, NOW())
ON CONFLICT (id) DO UPDATE SET
    name_uz = EXCLUDED.name_uz,
    name_ru = EXCLUDED.name_ru,
    name_en = EXCLUDED.name_en,
    category_id = EXCLUDED.category_id,
    "order" = EXCLUDED."order",
    is_active = EXCLUDED.is_active;

INSERT INTO subcategory_projects (id, name_uz, name_ru, name_en, category_id, "order", is_active, created_at)
VALUES (31, 'Onlayn kurs marketplace', 'Маркетплейс онлайн курсов', 'Online Course Marketplace', 11, 7, true, NOW())
ON CONFLICT (id) DO UPDATE SET
    name_uz = EXCLUDED.name_uz,
    name_ru = EXCLUDED.name_ru,
    name_en = EXCLUDED.name_en,
    category_id = EXCLUDED.category_id,
    "order" = EXCLUDED."order",
    is_active = EXCLUDED.is_active;

INSERT INTO subcategory_projects (id, name_uz, name_ru, name_en, category_id, "order", is_active, created_at)
VALUES (32, 'AI yordamchi o''qituvchilar', 'AI-помощники учителей', 'AI Teaching Assistants', 11, 8, true, NOW())
ON CONFLICT (id) DO UPDATE SET
    name_uz = EXCLUDED.name_uz,
    name_ru = EXCLUDED.name_ru,
    name_en = EXCLUDED.name_en,
    category_id = EXCLUDED.category_id,
    "order" = EXCLUDED."order",
    is_active = EXCLUDED.is_active;

INSERT INTO subcategory_projects (id, name_uz, name_ru, name_en, category_id, "order", is_active, created_at)
VALUES (33, 'Chatbotlar (Telegram / Web)', 'Чатботы (Telegram / Web)', 'Chatbots (Telegram / Web)', 12, 1, true, NOW())
ON CONFLICT (id) DO UPDATE SET
    name_uz = EXCLUDED.name_uz,
    name_ru = EXCLUDED.name_ru,
    name_en = EXCLUDED.name_en,
    category_id = EXCLUDED.category_id,
    "order" = EXCLUDED."order",
    is_active = EXCLUDED.is_active;

INSERT INTO subcategory_projects (id, name_uz, name_ru, name_en, category_id, "order", is_active, created_at)
VALUES (34, 'AI konsultantlar', 'AI консультанты', 'AI Consultants', 12, 2, true, NOW())
ON CONFLICT (id) DO UPDATE SET
    name_uz = EXCLUDED.name_uz,
    name_ru = EXCLUDED.name_ru,
    name_en = EXCLUDED.name_en,
    category_id = EXCLUDED.category_id,
    "order" = EXCLUDED."order",
    is_active = EXCLUDED.is_active;

INSERT INTO subcategory_projects (id, name_uz, name_ru, name_en, category_id, "order", is_active, created_at)
VALUES (35, 'Matn, rasm va video AI', 'Текст, изображения и видео AI', 'Text, Image & Video AI', 12, 3, true, NOW())
ON CONFLICT (id) DO UPDATE SET
    name_uz = EXCLUDED.name_uz,
    name_ru = EXCLUDED.name_ru,
    name_en = EXCLUDED.name_en,
    category_id = EXCLUDED.category_id,
    "order" = EXCLUDED."order",
    is_active = EXCLUDED.is_active;

INSERT INTO subcategory_projects (id, name_uz, name_ru, name_en, category_id, "order", is_active, created_at)
VALUES (36, 'Ovoz orqali boshqaruv', 'Голосовое управление', 'Voice Control', 12, 4, true, NOW())
ON CONFLICT (id) DO UPDATE SET
    name_uz = EXCLUDED.name_uz,
    name_ru = EXCLUDED.name_ru,
    name_en = EXCLUDED.name_en,
    category_id = EXCLUDED.category_id,
    "order" = EXCLUDED."order",
    is_active = EXCLUDED.is_active;

INSERT INTO subcategory_projects (id, name_uz, name_ru, name_en, category_id, "order", is_active, created_at)
VALUES (37, 'AI analytics va prognoz', 'AI аналитика и прогноз', 'AI Analytics & Forecasting', 12, 5, true, NOW())
ON CONFLICT (id) DO UPDATE SET
    name_uz = EXCLUDED.name_uz,
    name_ru = EXCLUDED.name_ru,
    name_en = EXCLUDED.name_en,
    category_id = EXCLUDED.category_id,
    "order" = EXCLUDED."order",
    is_active = EXCLUDED.is_active;

INSERT INTO subcategory_projects (id, name_uz, name_ru, name_en, category_id, "order", is_active, created_at)
VALUES (38, 'Tavsiya tizimlari', 'Рекомендательные системы', 'Recommendation Systems', 12, 6, true, NOW())
ON CONFLICT (id) DO UPDATE SET
    name_uz = EXCLUDED.name_uz,
    name_ru = EXCLUDED.name_ru,
    name_en = EXCLUDED.name_en,
    category_id = EXCLUDED.category_id,
    "order" = EXCLUDED."order",
    is_active = EXCLUDED.is_active;

INSERT INTO subcategory_projects (id, name_uz, name_ru, name_en, category_id, "order", is_active, created_at)
VALUES (39, 'Avtomatik javob beruvchi', 'Автоответчики', 'Auto Responders', 12, 7, true, NOW())
ON CONFLICT (id) DO UPDATE SET
    name_uz = EXCLUDED.name_uz,
    name_ru = EXCLUDED.name_ru,
    name_en = EXCLUDED.name_en,
    category_id = EXCLUDED.category_id,
    "order" = EXCLUDED."order",
    is_active = EXCLUDED.is_active;

INSERT INTO subcategory_projects (id, name_uz, name_ru, name_en, category_id, "order", is_active, created_at)
VALUES (40, 'Custom AI yechimlar', 'Кастомные AI решения', 'Custom AI Solutions', 12, 8, true, NOW())
ON CONFLICT (id) DO UPDATE SET
    name_uz = EXCLUDED.name_uz,
    name_ru = EXCLUDED.name_ru,
    name_en = EXCLUDED.name_en,
    category_id = EXCLUDED.category_id,
    "order" = EXCLUDED."order",
    is_active = EXCLUDED.is_active;

INSERT INTO subcategory_projects (id, name_uz, name_ru, name_en, category_id, "order", is_active, created_at)
VALUES (41, 'Mobil ilovalar', 'Мобильные приложения', 'Mobile Apps', 13, 1, true, NOW())
ON CONFLICT (id) DO UPDATE SET
    name_uz = EXCLUDED.name_uz,
    name_ru = EXCLUDED.name_ru,
    name_en = EXCLUDED.name_en,
    category_id = EXCLUDED.category_id,
    "order" = EXCLUDED."order",
    is_active = EXCLUDED.is_active;

INSERT INTO subcategory_projects (id, name_uz, name_ru, name_en, category_id, "order", is_active, created_at)
VALUES (42, 'Veb platformalar', 'Веб платформы', 'Web Platforms', 13, 2, true, NOW())
ON CONFLICT (id) DO UPDATE SET
    name_uz = EXCLUDED.name_uz,
    name_ru = EXCLUDED.name_ru,
    name_en = EXCLUDED.name_en,
    category_id = EXCLUDED.category_id,
    "order" = EXCLUDED."order",
    is_active = EXCLUDED.is_active;

INSERT INTO subcategory_projects (id, name_uz, name_ru, name_en, category_id, "order", is_active, created_at)
VALUES (43, 'Admin panellar', 'Админ панели', 'Admin Panels', 13, 3, true, NOW())
ON CONFLICT (id) DO UPDATE SET
    name_uz = EXCLUDED.name_uz,
    name_ru = EXCLUDED.name_ru,
    name_en = EXCLUDED.name_en,
    category_id = EXCLUDED.category_id,
    "order" = EXCLUDED."order",
    is_active = EXCLUDED.is_active;

INSERT INTO subcategory_projects (id, name_uz, name_ru, name_en, category_id, "order", is_active, created_at)
VALUES (44, 'Landing page va saytlar', 'Лендинги и сайты', 'Landing Pages & Websites', 13, 4, true, NOW())
ON CONFLICT (id) DO UPDATE SET
    name_uz = EXCLUDED.name_uz,
    name_ru = EXCLUDED.name_ru,
    name_en = EXCLUDED.name_en,
    category_id = EXCLUDED.category_id,
    "order" = EXCLUDED."order",
    is_active = EXCLUDED.is_active;

INSERT INTO subcategory_projects (id, name_uz, name_ru, name_en, category_id, "order", is_active, created_at)
VALUES (45, 'Progressive Web App', 'Progressive Web App', 'Progressive Web Apps', 13, 5, true, NOW())
ON CONFLICT (id) DO UPDATE SET
    name_uz = EXCLUDED.name_uz,
    name_ru = EXCLUDED.name_ru,
    name_en = EXCLUDED.name_en,
    category_id = EXCLUDED.category_id,
    "order" = EXCLUDED."order",
    is_active = EXCLUDED.is_active;

INSERT INTO subcategory_projects (id, name_uz, name_ru, name_en, category_id, "order", is_active, created_at)
VALUES (46, 'API va backend', 'API и бэкенд', 'API & Backend', 13, 6, true, NOW())
ON CONFLICT (id) DO UPDATE SET
    name_uz = EXCLUDED.name_uz,
    name_ru = EXCLUDED.name_ru,
    name_en = EXCLUDED.name_en,
    category_id = EXCLUDED.category_id,
    "order" = EXCLUDED."order",
    is_active = EXCLUDED.is_active;

INSERT INTO subcategory_projects (id, name_uz, name_ru, name_en, category_id, "order", is_active, created_at)
VALUES (47, 'SaaS platformalar', 'SaaS платформы', 'SaaS Platforms', 13, 7, true, NOW())
ON CONFLICT (id) DO UPDATE SET
    name_uz = EXCLUDED.name_uz,
    name_ru = EXCLUDED.name_ru,
    name_en = EXCLUDED.name_en,
    category_id = EXCLUDED.category_id,
    "order" = EXCLUDED."order",
    is_active = EXCLUDED.is_active;

INSERT INTO subcategory_projects (id, name_uz, name_ru, name_en, category_id, "order", is_active, created_at)
VALUES (48, 'UI/UX dizayn', 'UI/UX дизайн', 'UI/UX Design Services', 13, 8, true, NOW())
ON CONFLICT (id) DO UPDATE SET
    name_uz = EXCLUDED.name_uz,
    name_ru = EXCLUDED.name_ru,
    name_en = EXCLUDED.name_en,
    category_id = EXCLUDED.category_id,
    "order" = EXCLUDED."order",
    is_active = EXCLUDED.is_active;

INSERT INTO subcategory_projects (id, name_uz, name_ru, name_en, category_id, "order", is_active, created_at)
VALUES (49, 'Yetkazib berish tizimlari', 'Системы доставки', 'Delivery Systems', 14, 1, true, NOW())
ON CONFLICT (id) DO UPDATE SET
    name_uz = EXCLUDED.name_uz,
    name_ru = EXCLUDED.name_ru,
    name_en = EXCLUDED.name_en,
    category_id = EXCLUDED.category_id,
    "order" = EXCLUDED."order",
    is_active = EXCLUDED.is_active;

INSERT INTO subcategory_projects (id, name_uz, name_ru, name_en, category_id, "order", is_active, created_at)
VALUES (50, 'Kuryer boshqaruvi', 'Управление курьерами', 'Courier Management', 14, 2, true, NOW())
ON CONFLICT (id) DO UPDATE SET
    name_uz = EXCLUDED.name_uz,
    name_ru = EXCLUDED.name_ru,
    name_en = EXCLUDED.name_en,
    category_id = EXCLUDED.category_id,
    "order" = EXCLUDED."order",
    is_active = EXCLUDED.is_active;

INSERT INTO subcategory_projects (id, name_uz, name_ru, name_en, category_id, "order", is_active, created_at)
VALUES (51, 'Marshrut optimizatsiyasi', 'Оптимизация маршрутов', 'Route Optimization', 14, 3, true, NOW())
ON CONFLICT (id) DO UPDATE SET
    name_uz = EXCLUDED.name_uz,
    name_ru = EXCLUDED.name_ru,
    name_en = EXCLUDED.name_en,
    category_id = EXCLUDED.category_id,
    "order" = EXCLUDED."order",
    is_active = EXCLUDED.is_active;

INSERT INTO subcategory_projects (id, name_uz, name_ru, name_en, category_id, "order", is_active, created_at)
VALUES (52, 'Buyurtma tracking', 'Отслеживание заказов', 'Order Tracking', 14, 4, true, NOW())
ON CONFLICT (id) DO UPDATE SET
    name_uz = EXCLUDED.name_uz,
    name_ru = EXCLUDED.name_ru,
    name_en = EXCLUDED.name_en,
    category_id = EXCLUDED.category_id,
    "order" = EXCLUDED."order",
    is_active = EXCLUDED.is_active;

INSERT INTO subcategory_projects (id, name_uz, name_ru, name_en, category_id, "order", is_active, created_at)
VALUES (53, 'Ombor logistika', 'Складская логистика', 'Warehouse Logistics', 14, 5, true, NOW())
ON CONFLICT (id) DO UPDATE SET
    name_uz = EXCLUDED.name_uz,
    name_ru = EXCLUDED.name_ru,
    name_en = EXCLUDED.name_en,
    category_id = EXCLUDED.category_id,
    "order" = EXCLUDED."order",
    is_active = EXCLUDED.is_active;

INSERT INTO subcategory_projects (id, name_uz, name_ru, name_en, category_id, "order", is_active, created_at)
VALUES (54, 'GPS va xarita integratsiya', 'GPS и интеграция карт', 'GPS & Map Integration', 14, 6, true, NOW())
ON CONFLICT (id) DO UPDATE SET
    name_uz = EXCLUDED.name_uz,
    name_ru = EXCLUDED.name_ru,
    name_en = EXCLUDED.name_en,
    category_id = EXCLUDED.category_id,
    "order" = EXCLUDED."order",
    is_active = EXCLUDED.is_active;

INSERT INTO subcategory_projects (id, name_uz, name_ru, name_en, category_id, "order", is_active, created_at)
VALUES (55, 'Fleet management', 'Управление автопарком', 'Fleet Management', 14, 7, true, NOW())
ON CONFLICT (id) DO UPDATE SET
    name_uz = EXCLUDED.name_uz,
    name_ru = EXCLUDED.name_ru,
    name_en = EXCLUDED.name_en,
    category_id = EXCLUDED.category_id,
    "order" = EXCLUDED."order",
    is_active = EXCLUDED.is_active;

INSERT INTO subcategory_projects (id, name_uz, name_ru, name_en, category_id, "order", is_active, created_at)
VALUES (56, 'Avtomatik xabarnoma', 'Автоматические уведомления', 'Automated Notifications', 14, 8, true, NOW())
ON CONFLICT (id) DO UPDATE SET
    name_uz = EXCLUDED.name_uz,
    name_ru = EXCLUDED.name_ru,
    name_en = EXCLUDED.name_en,
    category_id = EXCLUDED.category_id,
    "order" = EXCLUDED."order",
    is_active = EXCLUDED.is_active;

INSERT INTO subcategory_projects (id, name_uz, name_ru, name_en, category_id, "order", is_active, created_at)
VALUES (61, 'Qurilish boshqaruvi tizimlari', 'Системы управления строительством', 'Construction Management Systems', 16, 0, true, NOW())
ON CONFLICT (id) DO UPDATE SET
    name_uz = EXCLUDED.name_uz,
    name_ru = EXCLUDED.name_ru,
    name_en = EXCLUDED.name_en,
    category_id = EXCLUDED.category_id,
    "order" = EXCLUDED."order",
    is_active = EXCLUDED.is_active;

INSERT INTO subcategory_projects (id, name_uz, name_ru, name_en, category_id, "order", is_active, created_at)
VALUES (62, 'Loyiha va smeta dasturlari', 'Проектные и сметные программы', 'Project & Estimate Software', 16, 1, true, NOW())
ON CONFLICT (id) DO UPDATE SET
    name_uz = EXCLUDED.name_uz,
    name_ru = EXCLUDED.name_ru,
    name_en = EXCLUDED.name_en,
    category_id = EXCLUDED.category_id,
    "order" = EXCLUDED."order",
    is_active = EXCLUDED.is_active;

INSERT INTO subcategory_projects (id, name_uz, name_ru, name_en, category_id, "order", is_active, created_at)
VALUES (63, 'Ombor va material nazorati', 'Контроль склада и материалов', 'Warehouse & Material Control', 16, 2, true, NOW())
ON CONFLICT (id) DO UPDATE SET
    name_uz = EXCLUDED.name_uz,
    name_ru = EXCLUDED.name_ru,
    name_en = EXCLUDED.name_en,
    category_id = EXCLUDED.category_id,
    "order" = EXCLUDED."order",
    is_active = EXCLUDED.is_active;

INSERT INTO subcategory_projects (id, name_uz, name_ru, name_en, category_id, "order", is_active, created_at)
VALUES (64, 'Texnika ijarasi boshqaruvi', 'Управление арендой техники', 'Equipment Rental Management', 16, 3, true, NOW())
ON CONFLICT (id) DO UPDATE SET
    name_uz = EXCLUDED.name_uz,
    name_ru = EXCLUDED.name_ru,
    name_en = EXCLUDED.name_en,
    category_id = EXCLUDED.category_id,
    "order" = EXCLUDED."order",
    is_active = EXCLUDED.is_active;

INSERT INTO subcategory_projects (id, name_uz, name_ru, name_en, category_id, "order", is_active, created_at)
VALUES (65, 'Real estate CRM', 'CRM для недвижимости', 'Real Estate CRM', 16, 4, true, NOW())
ON CONFLICT (id) DO UPDATE SET
    name_uz = EXCLUDED.name_uz,
    name_ru = EXCLUDED.name_ru,
    name_en = EXCLUDED.name_en,
    category_id = EXCLUDED.category_id,
    "order" = EXCLUDED."order",
    is_active = EXCLUDED.is_active;

INSERT INTO subcategory_projects (id, name_uz, name_ru, name_en, category_id, "order", is_active, created_at)
VALUES (66, 'E''lon va listing platformalari', 'Платформы объявлений и листингов', 'Listing Platforms', 16, 5, true, NOW())
ON CONFLICT (id) DO UPDATE SET
    name_uz = EXCLUDED.name_uz,
    name_ru = EXCLUDED.name_ru,
    name_en = EXCLUDED.name_en,
    category_id = EXCLUDED.category_id,
    "order" = EXCLUDED."order",
    is_active = EXCLUDED.is_active;

INSERT INTO subcategory_projects (id, name_uz, name_ru, name_en, category_id, "order", is_active, created_at)
VALUES (67, 'Xarita va joylashuv tizimlari', 'Системы карт и местоположения', 'Map & Location Systems', 16, 6, true, NOW())
ON CONFLICT (id) DO UPDATE SET
    name_uz = EXCLUDED.name_uz,
    name_ru = EXCLUDED.name_ru,
    name_en = EXCLUDED.name_en,
    category_id = EXCLUDED.category_id,
    "order" = EXCLUDED."order",
    is_active = EXCLUDED.is_active;

INSERT INTO subcategory_projects (id, name_uz, name_ru, name_en, category_id, "order", is_active, created_at)
VALUES (68, 'Smart qurilish yechimlari', 'Умные строительные решения', 'Smart Construction Solutions', 16, 7, true, NOW())
ON CONFLICT (id) DO UPDATE SET
    name_uz = EXCLUDED.name_uz,
    name_ru = EXCLUDED.name_ru,
    name_en = EXCLUDED.name_en,
    category_id = EXCLUDED.category_id,
    "order" = EXCLUDED."order",
    is_active = EXCLUDED.is_active;

INSERT INTO subcategory_projects (id, name_uz, name_ru, name_en, category_id, "order", is_active, created_at)
VALUES (69, 'Grafik dizayn', 'Графический дизайн', 'Graphic Design', 17, 0, true, NOW())
ON CONFLICT (id) DO UPDATE SET
    name_uz = EXCLUDED.name_uz,
    name_ru = EXCLUDED.name_ru,
    name_en = EXCLUDED.name_en,
    category_id = EXCLUDED.category_id,
    "order" = EXCLUDED."order",
    is_active = EXCLUDED.is_active;

INSERT INTO subcategory_projects (id, name_uz, name_ru, name_en, category_id, "order", is_active, created_at)
VALUES (70, 'Brending va logo', 'Брендинг и логотипы', 'Branding & Logo', 17, 1, true, NOW())
ON CONFLICT (id) DO UPDATE SET
    name_uz = EXCLUDED.name_uz,
    name_ru = EXCLUDED.name_ru,
    name_en = EXCLUDED.name_en,
    category_id = EXCLUDED.category_id,
    "order" = EXCLUDED."order",
    is_active = EXCLUDED.is_active;

INSERT INTO subcategory_projects (id, name_uz, name_ru, name_en, category_id, "order", is_active, created_at)
VALUES (71, 'Video montaj', 'Видеомонтаж', 'Video Editing', 17, 2, true, NOW())
ON CONFLICT (id) DO UPDATE SET
    name_uz = EXCLUDED.name_uz,
    name_ru = EXCLUDED.name_ru,
    name_en = EXCLUDED.name_en,
    category_id = EXCLUDED.category_id,
    "order" = EXCLUDED."order",
    is_active = EXCLUDED.is_active;

INSERT INTO subcategory_projects (id, name_uz, name_ru, name_en, category_id, "order", is_active, created_at)
VALUES (72, 'Motion dizayn', 'Моушн дизайн', 'Motion Design', 17, 3, true, NOW())
ON CONFLICT (id) DO UPDATE SET
    name_uz = EXCLUDED.name_uz,
    name_ru = EXCLUDED.name_ru,
    name_en = EXCLUDED.name_en,
    category_id = EXCLUDED.category_id,
    "order" = EXCLUDED."order",
    is_active = EXCLUDED.is_active;

INSERT INTO subcategory_projects (id, name_uz, name_ru, name_en, category_id, "order", is_active, created_at)
VALUES (73, 'UI/UX dizayn', 'UI/UX дизайн', 'UI/UX Design', 17, 4, true, NOW())
ON CONFLICT (id) DO UPDATE SET
    name_uz = EXCLUDED.name_uz,
    name_ru = EXCLUDED.name_ru,
    name_en = EXCLUDED.name_en,
    category_id = EXCLUDED.category_id,
    "order" = EXCLUDED."order",
    is_active = EXCLUDED.is_active;

INSERT INTO subcategory_projects (id, name_uz, name_ru, name_en, category_id, "order", is_active, created_at)
VALUES (74, 'Reklama bannerlari', 'Рекламные баннеры', 'Ad Banners', 17, 5, true, NOW())
ON CONFLICT (id) DO UPDATE SET
    name_uz = EXCLUDED.name_uz,
    name_ru = EXCLUDED.name_ru,
    name_en = EXCLUDED.name_en,
    category_id = EXCLUDED.category_id,
    "order" = EXCLUDED."order",
    is_active = EXCLUDED.is_active;

INSERT INTO subcategory_projects (id, name_uz, name_ru, name_en, category_id, "order", is_active, created_at)
VALUES (75, 'Social media dizayn', 'Дизайн для соцсетей', 'Social Media Design', 17, 6, true, NOW())
ON CONFLICT (id) DO UPDATE SET
    name_uz = EXCLUDED.name_uz,
    name_ru = EXCLUDED.name_ru,
    name_en = EXCLUDED.name_en,
    category_id = EXCLUDED.category_id,
    "order" = EXCLUDED."order",
    is_active = EXCLUDED.is_active;

INSERT INTO subcategory_projects (id, name_uz, name_ru, name_en, category_id, "order", is_active, created_at)
VALUES (76, 'Prezentatsiya dizayni', 'Дизайн презентаций', 'Presentation Design', 17, 7, true, NOW())
ON CONFLICT (id) DO UPDATE SET
    name_uz = EXCLUDED.name_uz,
    name_ru = EXCLUDED.name_ru,
    name_en = EXCLUDED.name_en,
    category_id = EXCLUDED.category_id,
    "order" = EXCLUDED."order",
    is_active = EXCLUDED.is_active;

INSERT INTO subcategory_projects (id, name_uz, name_ru, name_en, category_id, "order", is_active, created_at)
VALUES (77, 'Ishlab chiqarish monitoringi', 'Мониторинг производства', 'Production Monitoring', 18, 0, true, NOW())
ON CONFLICT (id) DO UPDATE SET
    name_uz = EXCLUDED.name_uz,
    name_ru = EXCLUDED.name_ru,
    name_en = EXCLUDED.name_en,
    category_id = EXCLUDED.category_id,
    "order" = EXCLUDED."order",
    is_active = EXCLUDED.is_active;

INSERT INTO subcategory_projects (id, name_uz, name_ru, name_en, category_id, "order", is_active, created_at)
VALUES (78, 'Texnik xizmat nazorati', 'Контроль техобслуживания', 'Maintenance Control', 18, 1, true, NOW())
ON CONFLICT (id) DO UPDATE SET
    name_uz = EXCLUDED.name_uz,
    name_ru = EXCLUDED.name_ru,
    name_en = EXCLUDED.name_en,
    category_id = EXCLUDED.category_id,
    "order" = EXCLUDED."order",
    is_active = EXCLUDED.is_active;

INSERT INTO subcategory_projects (id, name_uz, name_ru, name_en, category_id, "order", is_active, created_at)
VALUES (79, 'IoT boshqaruvi', 'Управление IoT', 'IoT Management', 18, 2, true, NOW())
ON CONFLICT (id) DO UPDATE SET
    name_uz = EXCLUDED.name_uz,
    name_ru = EXCLUDED.name_ru,
    name_en = EXCLUDED.name_en,
    category_id = EXCLUDED.category_id,
    "order" = EXCLUDED."order",
    is_active = EXCLUDED.is_active;

INSERT INTO subcategory_projects (id, name_uz, name_ru, name_en, category_id, "order", is_active, created_at)
VALUES (80, 'Sifat nazorati tizimlari', 'Системы контроля качества', 'Quality Control Systems', 18, 3, true, NOW())
ON CONFLICT (id) DO UPDATE SET
    name_uz = EXCLUDED.name_uz,
    name_ru = EXCLUDED.name_ru,
    name_en = EXCLUDED.name_en,
    category_id = EXCLUDED.category_id,
    "order" = EXCLUDED."order",
    is_active = EXCLUDED.is_active;

INSERT INTO subcategory_projects (id, name_uz, name_ru, name_en, category_id, "order", is_active, created_at)
VALUES (81, 'Buyurtma ishlab chiqarish', 'Производство под заказ', 'Custom Manufacturing', 18, 4, true, NOW())
ON CONFLICT (id) DO UPDATE SET
    name_uz = EXCLUDED.name_uz,
    name_ru = EXCLUDED.name_ru,
    name_en = EXCLUDED.name_en,
    category_id = EXCLUDED.category_id,
    "order" = EXCLUDED."order",
    is_active = EXCLUDED.is_active;

INSERT INTO subcategory_projects (id, name_uz, name_ru, name_en, category_id, "order", is_active, created_at)
VALUES (82, 'Energiya monitoringi', 'Мониторинг энергии', 'Energy Monitoring', 18, 5, true, NOW())
ON CONFLICT (id) DO UPDATE SET
    name_uz = EXCLUDED.name_uz,
    name_ru = EXCLUDED.name_ru,
    name_en = EXCLUDED.name_en,
    category_id = EXCLUDED.category_id,
    "order" = EXCLUDED."order",
    is_active = EXCLUDED.is_active;

INSERT INTO subcategory_projects (id, name_uz, name_ru, name_en, category_id, "order", is_active, created_at)
VALUES (83, 'Zavod ERP', 'Заводской ERP', 'Factory ERP', 18, 6, true, NOW())
ON CONFLICT (id) DO UPDATE SET
    name_uz = EXCLUDED.name_uz,
    name_ru = EXCLUDED.name_ru,
    name_en = EXCLUDED.name_en,
    category_id = EXCLUDED.category_id,
    "order" = EXCLUDED."order",
    is_active = EXCLUDED.is_active;

INSERT INTO subcategory_projects (id, name_uz, name_ru, name_en, category_id, "order", is_active, created_at)
VALUES (84, 'Avtomatik rejalashtirish', 'Автоматическое планирование', 'Automated Planning', 18, 7, true, NOW())
ON CONFLICT (id) DO UPDATE SET
    name_uz = EXCLUDED.name_uz,
    name_ru = EXCLUDED.name_ru,
    name_en = EXCLUDED.name_en,
    category_id = EXCLUDED.category_id,
    "order" = EXCLUDED."order",
    is_active = EXCLUDED.is_active;

INSERT INTO subcategory_projects (id, name_uz, name_ru, name_en, category_id, "order", is_active, created_at)
VALUES (85, 'MVP ishlab chiqish', 'Разработка MVP', 'MVP Development', 19, 0, true, NOW())
ON CONFLICT (id) DO UPDATE SET
    name_uz = EXCLUDED.name_uz,
    name_ru = EXCLUDED.name_ru,
    name_en = EXCLUDED.name_en,
    category_id = EXCLUDED.category_id,
    "order" = EXCLUDED."order",
    is_active = EXCLUDED.is_active;

INSERT INTO subcategory_projects (id, name_uz, name_ru, name_en, category_id, "order", is_active, created_at)
VALUES (86, 'Startap prototiplari', 'Прототипы стартапов', 'Startup Prototypes', 19, 1, true, NOW())
ON CONFLICT (id) DO UPDATE SET
    name_uz = EXCLUDED.name_uz,
    name_ru = EXCLUDED.name_ru,
    name_en = EXCLUDED.name_en,
    category_id = EXCLUDED.category_id,
    "order" = EXCLUDED."order",
    is_active = EXCLUDED.is_active;

INSERT INTO subcategory_projects (id, name_uz, name_ru, name_en, category_id, "order", is_active, created_at)
VALUES (87, 'Maxsus dastur buyurtmalari', 'Заказная разработка ПО', 'Custom Software Orders', 19, 2, true, NOW())
ON CONFLICT (id) DO UPDATE SET
    name_uz = EXCLUDED.name_uz,
    name_ru = EXCLUDED.name_ru,
    name_en = EXCLUDED.name_en,
    category_id = EXCLUDED.category_id,
    "order" = EXCLUDED."order",
    is_active = EXCLUDED.is_active;

INSERT INTO subcategory_projects (id, name_uz, name_ru, name_en, category_id, "order", is_active, created_at)
VALUES (88, 'Texnik konsultatsiya', 'Техническая консультация', 'Technical Consulting', 19, 3, true, NOW())
ON CONFLICT (id) DO UPDATE SET
    name_uz = EXCLUDED.name_uz,
    name_ru = EXCLUDED.name_ru,
    name_en = EXCLUDED.name_en,
    category_id = EXCLUDED.category_id,
    "order" = EXCLUDED."order",
    is_active = EXCLUDED.is_active;

INSERT INTO subcategory_projects (id, name_uz, name_ru, name_en, category_id, "order", is_active, created_at)
VALUES (89, 'Digital transformatsiya', 'Цифровая трансформация', 'Digital Transformation', 19, 4, true, NOW())
ON CONFLICT (id) DO UPDATE SET
    name_uz = EXCLUDED.name_uz,
    name_ru = EXCLUDED.name_ru,
    name_en = EXCLUDED.name_en,
    category_id = EXCLUDED.category_id,
    "order" = EXCLUDED."order",
    is_active = EXCLUDED.is_active;

INSERT INTO subcategory_projects (id, name_uz, name_ru, name_en, category_id, "order", is_active, created_at)
VALUES (90, 'API integratsiyalar', 'API интеграции', 'API Integrations', 19, 5, true, NOW())
ON CONFLICT (id) DO UPDATE SET
    name_uz = EXCLUDED.name_uz,
    name_ru = EXCLUDED.name_ru,
    name_en = EXCLUDED.name_en,
    category_id = EXCLUDED.category_id,
    "order" = EXCLUDED."order",
    is_active = EXCLUDED.is_active;

INSERT INTO subcategory_projects (id, name_uz, name_ru, name_en, category_id, "order", is_active, created_at)
VALUES (91, 'Legacy system modernizatsiya', 'Модернизация legacy систем', 'Legacy System Modernization', 19, 6, true, NOW())
ON CONFLICT (id) DO UPDATE SET
    name_uz = EXCLUDED.name_uz,
    name_ru = EXCLUDED.name_ru,
    name_en = EXCLUDED.name_en,
    category_id = EXCLUDED.category_id,
    "order" = EXCLUDED."order",
    is_active = EXCLUDED.is_active;

INSERT INTO subcategory_projects (id, name_uz, name_ru, name_en, category_id, "order", is_active, created_at)
VALUES (92, 'Texnik audit', 'Технический аудит', 'Technical Audit', 19, 7, true, NOW())
ON CONFLICT (id) DO UPDATE SET
    name_uz = EXCLUDED.name_uz,
    name_ru = EXCLUDED.name_ru,
    name_en = EXCLUDED.name_en,
    category_id = EXCLUDED.category_id,
    "order" = EXCLUDED."order",
    is_active = EXCLUDED.is_active;


-- =====================================================
-- SEQUENCE YANGILASH (ID lar to'g'ri davom etishi uchun)
-- =====================================================

SELECT setval('category_projects_id_seq', (SELECT MAX(id) FROM category_projects));
SELECT setval('subcategory_projects_id_seq', (SELECT MAX(id) FROM subcategory_projects));

-- =====================================================
-- YAKUNLANDI!
-- =====================================================
