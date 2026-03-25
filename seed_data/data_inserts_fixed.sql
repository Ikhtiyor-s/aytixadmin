-- BANNERS (video_url siz - serverda bu ustun yo'q)
INSERT INTO public.banners (id, title_uz, title_ru, title_en, description_uz, description_ru, description_en, image_url, link_url, "order", status, created_at, updated_at, project_id)
VALUES (19, '', '', '', '', '', '', NULL, '', 0, 'ACTIVE', '2026-01-06 19:37:24.903183+05', NULL, NULL)
ON CONFLICT (id) DO UPDATE SET updated_at = NOW();

INSERT INTO public.banners (id, title_uz, title_ru, title_en, description_uz, description_ru, description_en, image_url, link_url, "order", status, created_at, updated_at, project_id)
VALUES (20, '', '', '', '', '', '', '/uploads/images/8df02ddf-e040-422a-9c14-b489cbb5c9c1.jpg', '', 0, 'ACTIVE', '2026-01-06 19:56:46.001269+05', NULL, NULL)
ON CONFLICT (id) DO UPDATE SET image_url = EXCLUDED.image_url, updated_at = NOW();

INSERT INTO public.banners (id, title_uz, title_ru, title_en, description_uz, description_ru, description_en, image_url, link_url, "order", status, created_at, updated_at, project_id)
VALUES (15, 'Onlayn Avtopark ', '', '', '', '', '', '/uploads/images/67d8597e-242a-48ea-9472-c634ca75deb5.jpg', '', 0, 'ACTIVE', '2026-01-05 20:52:47.907865+05', '2026-01-06 19:57:08.64785+05', NULL)
ON CONFLICT (id) DO UPDATE SET title_uz = EXCLUDED.title_uz, image_url = EXCLUDED.image_url, updated_at = NOW();

INSERT INTO public.banners (id, title_uz, title_ru, title_en, description_uz, description_ru, description_en, image_url, link_url, "order", status, created_at, updated_at, project_id)
VALUES (10, '', '', '', '', '', '', NULL, '', 0, 'ACTIVE', '2026-01-05 20:19:43.56176+05', '2026-01-06 19:57:16.331416+05', NULL)
ON CONFLICT (id) DO UPDATE SET updated_at = NOW();

INSERT INTO public.banners (id, title_uz, title_ru, title_en, description_uz, description_ru, description_en, image_url, link_url, "order", status, created_at, updated_at, project_id)
VALUES (21, 'nonbor.uz', '', '', '', '', '', '/uploads/images/43d1ec0c-74bb-4130-9452-f2d70ff70546.jpg', '', 0, 'ACTIVE', '2026-01-06 20:00:34.425166+05', NULL, NULL)
ON CONFLICT (id) DO UPDATE SET title_uz = EXCLUDED.title_uz, image_url = EXCLUDED.image_url, updated_at = NOW();

INSERT INTO public.banners (id, title_uz, title_ru, title_en, description_uz, description_ru, description_en, image_url, link_url, "order", status, created_at, updated_at, project_id)
VALUES (17, '', '', '', 'Mazzali taom buyurtma qiling', 'Закажи вкусную еду', 'Order a delicious meal', NULL, 'https://nonbor.uz/ready', 0, 'ACTIVE', '2026-01-06 19:17:02.959626+05', '2026-01-06 20:07:02.205409+05', NULL)
ON CONFLICT (id) DO UPDATE SET description_uz = EXCLUDED.description_uz, link_url = EXCLUDED.link_url, updated_at = NOW();

INSERT INTO public.banners (id, title_uz, title_ru, title_en, description_uz, description_ru, description_en, image_url, link_url, "order", status, created_at, updated_at, project_id)
VALUES (18, 'Raqamli qurilish', 'Цифровое строительство', 'Digital construction', 'Mobil ilovasi bilan ish toping yoki o''z biznesingizni rivojlantiring!', 'Найдите работу или развивайте свой бизнес с нашим мобильным приложением!', 'Find a job or grow your business with our mobile app!', NULL, '', 0, 'ACTIVE', '2026-01-06 19:37:15.660525+05', '2026-01-06 20:20:12.094565+05', NULL)
ON CONFLICT (id) DO UPDATE SET title_uz = EXCLUDED.title_uz, title_ru = EXCLUDED.title_ru, title_en = EXCLUDED.title_en, description_uz = EXCLUDED.description_uz, updated_at = NOW();

-- CATEGORY_PROJECTS (ustunlar bilan)
INSERT INTO public.category_projects (id, name_uz, name_ru, name_en, description_uz, description_ru, description_en, icon, "order", is_active, created_at, updated_at)
VALUES (12, 'AI va Avtomatik Yordamchilar', 'AI и Автоматические Помощники', 'AI & Automation Assistants', 'Chatbot, AI analytics va sun''iy intellekt yechimlari', 'Чат-бот, ИИ-аналитика и решения в области искусственного интеллекта', 'Chatbot, AI analytics and artificial intelligence solutions', '🤖', 6, true, '2025-12-25 22:57:21.633087+05', '2026-01-06 13:51:38.970297+05')
ON CONFLICT (id) DO UPDATE SET name_uz = EXCLUDED.name_uz, name_ru = EXCLUDED.name_ru, name_en = EXCLUDED.name_en, icon = EXCLUDED.icon, updated_at = NOW();

INSERT INTO public.category_projects (id, name_uz, name_ru, name_en, description_uz, description_ru, description_en, icon, "order", is_active, created_at, updated_at)
VALUES (8, 'Biznes va Avtomatlashtirish', 'Бизнес и Автоматизация', 'Business & Automation', 'CRM, ERP va biznes jarayonlarini avtomatlashtirish tizimlari', 'CRM, ERP и системы автоматизации бизнес-процессов', 'CRM, ERP and business process automation systems', '🏢', 1, true, '2025-12-25 22:56:07.340156+05', '2026-01-06 13:51:38.970297+05')
ON CONFLICT (id) DO UPDATE SET name_uz = EXCLUDED.name_uz, name_ru = EXCLUDED.name_ru, name_en = EXCLUDED.name_en, icon = EXCLUDED.icon, updated_at = NOW();

INSERT INTO public.category_projects (id, name_uz, name_ru, name_en, description_uz, description_ru, description_en, icon, "order", is_active, created_at, updated_at)
VALUES (9, 'Savdo va Marketing', 'Продажи и Маркетинг', 'Sales & Marketing', 'E-commerce, reklama va marketing avtomatlashtirish', 'Автоматизация электронной коммерции, рекламы и маркетинга', 'E-commerce, advertising and marketing automation', '📈', 2, true, '2025-12-25 22:56:25.935845+05', '2026-01-06 13:51:38.970297+05')
ON CONFLICT (id) DO UPDATE SET name_uz = EXCLUDED.name_uz, name_ru = EXCLUDED.name_ru, name_en = EXCLUDED.name_en, icon = EXCLUDED.icon, updated_at = NOW();

INSERT INTO public.category_projects (id, name_uz, name_ru, name_en, description_uz, description_ru, description_en, icon, "order", is_active, created_at, updated_at)
VALUES (10, 'Moliyaviy Texnologiyalar', 'Финансовые Технологии', 'Financial Technologies', 'Buxgalteriya, to''lov tizimlari va moliyaviy xizmatlar', 'Бухгалтерский учет, платежные системы и финансовые услуги', 'Accounting, payment systems and financial services', '💰', 3, true, '2025-12-25 22:56:44.541125+05', '2026-01-06 13:51:38.970297+05')
ON CONFLICT (id) DO UPDATE SET name_uz = EXCLUDED.name_uz, name_ru = EXCLUDED.name_ru, name_en = EXCLUDED.name_en, icon = EXCLUDED.icon, updated_at = NOW();

INSERT INTO public.category_projects (id, name_uz, name_ru, name_en, description_uz, description_ru, description_en, icon, "order", is_active, created_at, updated_at)
VALUES (11, 'Ta''lim va O''rganish', 'Образование и Обучение', 'Education & Learning', 'LMS, online ta''lim va test platformalari', 'LMS, платформы онлайн-обучения и тестирования', 'LMS, online learning and testing platforms', '📚', 4, true, '2025-12-25 22:57:03.043582+05', '2026-01-06 13:51:38.970297+05')
ON CONFLICT (id) DO UPDATE SET name_uz = EXCLUDED.name_uz, name_ru = EXCLUDED.name_ru, name_en = EXCLUDED.name_en, icon = EXCLUDED.icon, updated_at = NOW();

INSERT INTO public.category_projects (id, name_uz, name_ru, name_en, description_uz, description_ru, description_en, icon, "order", is_active, created_at, updated_at)
VALUES (13, 'Mobil va Veb Ilovalar', 'Мобильные и Веб Приложения', 'Mobile & Web Apps', 'Flutter, React, API va dasturiy ta''minot ishlab chiqish', 'Flutter, React, API и разработка программного обеспечения', 'Flutter, React, API and software development', '📱', 7, true, '2025-12-25 22:57:40.232714+05', '2026-01-06 13:51:38.970297+05')
ON CONFLICT (id) DO UPDATE SET name_uz = EXCLUDED.name_uz, name_ru = EXCLUDED.name_ru, name_en = EXCLUDED.name_en, icon = EXCLUDED.icon, updated_at = NOW();

INSERT INTO public.category_projects (id, name_uz, name_ru, name_en, description_uz, description_ru, description_en, icon, "order", is_active, created_at, updated_at)
VALUES (14, 'Logistika va Yetkazib Berish', 'Логистика и Доставка', 'Logistics & Delivery', 'Yetkazib berish, kuryer va marshrut tizimlari', 'Системы доставки, курьерской доставки и маршрутизации', 'Delivery, courier and routing systems', '🚚', 9, true, '2025-12-25 22:57:58.67422+05', '2026-01-06 13:51:38.970297+05')
ON CONFLICT (id) DO UPDATE SET name_uz = EXCLUDED.name_uz, name_ru = EXCLUDED.name_ru, name_en = EXCLUDED.name_en, icon = EXCLUDED.icon, updated_at = NOW();

INSERT INTO public.category_projects (id, name_uz, name_ru, name_en, description_uz, description_ru, description_en, icon, "order", is_active, created_at, updated_at)
VALUES (16, 'Qurilish va Ko''chmas Mulk', 'Строительство и Недвижимость', 'Construction & Real Estate', NULL, NULL, NULL, '🏗️', 5, true, '2026-01-06 13:51:38.970297+05', NULL)
ON CONFLICT (id) DO UPDATE SET name_uz = EXCLUDED.name_uz, name_ru = EXCLUDED.name_ru, name_en = EXCLUDED.name_en, icon = EXCLUDED.icon, updated_at = NOW();

INSERT INTO public.category_projects (id, name_uz, name_ru, name_en, description_uz, description_ru, description_en, icon, "order", is_active, created_at, updated_at)
VALUES (17, 'Media va Dizayn', 'Медиа и Дизайн', 'Media & Design', NULL, NULL, NULL, '🎨', 8, true, '2026-01-06 13:51:38.970297+05', NULL)
ON CONFLICT (id) DO UPDATE SET name_uz = EXCLUDED.name_uz, name_ru = EXCLUDED.name_ru, name_en = EXCLUDED.name_en, icon = EXCLUDED.icon, updated_at = NOW();

INSERT INTO public.category_projects (id, name_uz, name_ru, name_en, description_uz, description_ru, description_en, icon, "order", is_active, created_at, updated_at)
VALUES (18, 'Sanoat va Ishlab Chiqarish', 'Промышленность и Производство', 'Industry & Manufacturing', NULL, NULL, NULL, '🏭', 10, true, '2026-01-06 13:51:38.970297+05', NULL)
ON CONFLICT (id) DO UPDATE SET name_uz = EXCLUDED.name_uz, name_ru = EXCLUDED.name_ru, name_en = EXCLUDED.name_en, icon = EXCLUDED.icon, updated_at = NOW();

INSERT INTO public.category_projects (id, name_uz, name_ru, name_en, description_uz, description_ru, description_en, icon, "order", is_active, created_at, updated_at)
VALUES (19, 'Startaplar va Maxsus Buyurtmalar', 'Стартапы и Заказная Разработка', 'Startups & Custom Orders', NULL, NULL, NULL, '🚀', 11, true, '2026-01-06 13:51:38.970297+05', NULL)
ON CONFLICT (id) DO UPDATE SET name_uz = EXCLUDED.name_uz, name_ru = EXCLUDED.name_ru, name_en = EXCLUDED.name_en, icon = EXCLUDED.icon, updated_at = NOW();

-- PROJECTS (ustunlar bilan, images JSON sifatida)
INSERT INTO public.projects (id, name_uz, name_ru, name_en, description_uz, description_ru, description_en, category, subcategory, technologies, features, integrations, color, image_url, views, favorites, status, is_top, is_new, created_at, updated_at, video_url, images)
VALUES (10, 'AmoCRM Professional Integratsiya', 'AmoCRM Профессиональная интеграция', 'AmoCRM Professional Integration', 'AmoCRM bilan to''liq integratsiya. Avtomatik lead yaratish, savdo voronkasi boshqaruvi, mijozlar bilan munosabatlar.', 'Полная интеграция с AmoCRM. Автоматическое создание лидов, управление воронкой продаж, работа с клиентами.', 'Full AmoCRM integration. Automatic lead creation, sales funnel management, customer relationships.', 'Biznes va Avtomatlashtirish', 'CRM tizimlari', '["Python", "AmoCRM API", "Webhook", "FastAPI", "Redis"]', '[{"uz": "Avtomatik lead yaratish", "ru": "Автоматическое создание лидов", "en": "Automatic lead creation"}]', '["AmoCRM", "Telegram", "Email", "WhatsApp"]', 'from-primary-500 to-primary-600', 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800', 12, 0, 'ACTIVE', false, false, '2025-12-26 00:32:30.177993+05', '2026-01-06 02:25:40.089431+05', NULL, '[]'::json)
ON CONFLICT (id) DO UPDATE SET name_uz = EXCLUDED.name_uz, views = EXCLUDED.views, images = EXCLUDED.images, updated_at = NOW();

INSERT INTO public.projects (id, name_uz, name_ru, name_en, description_uz, description_ru, description_en, category, subcategory, technologies, features, integrations, color, image_url, views, favorites, status, is_top, is_new, created_at, updated_at, video_url, images)
VALUES (12, 'Nonbor - Oshxona Avtomatlashtirish', 'Nonbor - Автоматизация общепита', 'Nonbor - Catering Automation', 'Restoran, kafe va oshxonalar uchun to''liq avtomatlashtirish tizimi.', 'Полная система автоматизации для ресторанов, кафе и столовых.', 'Complete automation system for restaurants, cafes and canteens.', 'Biznes va Avtomatlashtirish', 'CRM tizimlari', '["Python", "FastAPI", "PostgreSQL", "React", "WebSocket"]', '[]', '["Telegram"]', 'from-[#00a6a6] to-[#00a6a6]/80', '/uploads/images/8109e63e-5b14-464b-a893-ad65398cd006.png', 132, 0, 'ACTIVE', false, false, '2025-12-26 12:24:45.054814+05', '2026-01-06 15:56:32.639594+05', NULL, '[]'::json)
ON CONFLICT (id) DO UPDATE SET name_uz = EXCLUDED.name_uz, views = EXCLUDED.views, images = EXCLUDED.images, updated_at = NOW();

INSERT INTO public.projects (id, name_uz, name_ru, name_en, description_uz, description_ru, description_en, category, subcategory, technologies, features, integrations, color, image_url, views, favorites, status, is_top, is_new, created_at, updated_at, video_url, images)
VALUES (4, 'AI Chatbot - Sun''iy Intellekt Yordamchisi', 'AI Chatbot - Помощник на основе ИИ', 'AI Chatbot - Artificial Intelligence Assistant', 'Sun''iy intellekt asosidagi zamonaviy chatbot.', 'Современный чат-бот на основе искусственного интеллекта.', 'Modern chatbot based on artificial intelligence.', 'AI va Avtomatik Yordamchilar', 'Chatbotlar (Telegram / Web)', '["Python", "TensorFlow", "FastAPI", "NLP", "OpenAI API"]', '[]', '["Telegram"]', 'from-pink-500 to-rose-500', NULL, 3, 0, 'ACTIVE', false, false, '2025-12-25 22:22:08.765778+05', '2026-01-06 14:24:34.160316+05', NULL, '[]'::json)
ON CONFLICT (id) DO UPDATE SET name_uz = EXCLUDED.name_uz, views = EXCLUDED.views, images = EXCLUDED.images, updated_at = NOW();

INSERT INTO public.projects (id, name_uz, name_ru, name_en, description_uz, description_ru, description_en, category, subcategory, technologies, features, integrations, color, image_url, views, favorites, status, is_top, is_new, created_at, updated_at, video_url, images)
VALUES (3, 'Mobil Bank Ilovasi', 'Мобильное банковское приложение', 'Mobile Banking Application', 'To''liq funksional mobil bank ilovasi.', 'Полнофункциональное мобильное банковское приложение.', 'Full-featured mobile banking application.', 'Mobil va Veb Ilovalar', 'Mobil ilovalar', '["Flutter", "Dart", "Firebase", "REST API", "Biometric Auth"]', '[]', '[]', 'from-violet-500 to-purple-500', NULL, 0, 0, 'ACTIVE', false, false, '2025-12-25 22:22:06.716489+05', '2026-01-06 14:24:51.041784+05', NULL, '[]'::json)
ON CONFLICT (id) DO UPDATE SET name_uz = EXCLUDED.name_uz, views = EXCLUDED.views, images = EXCLUDED.images, updated_at = NOW();

INSERT INTO public.projects (id, name_uz, name_ru, name_en, description_uz, description_ru, description_en, category, subcategory, technologies, features, integrations, color, image_url, views, favorites, status, is_top, is_new, created_at, updated_at, video_url, images)
VALUES (2, 'CRM Dashboard - Mijozlar Boshqaruvi', 'CRM Dashboard - Управление клиентами', 'CRM Dashboard - Customer Management', 'Zamonaviy CRM tizimi.', 'Современная CRM система.', 'Modern CRM system.', 'Biznes va Avtomatlashtirish', 'CRM tizimlari', '["React", "TypeScript", "TailwindCSS", "Node.js", "MongoDB"]', '[]', '["Telegram"]', 'from-[#0a2d5c] to-[#0a2d5c]/80', NULL, 0, 0, 'ACTIVE', false, false, '2025-12-25 22:22:04.633118+05', '2026-01-06 14:25:07.621541+05', NULL, '[]'::json)
ON CONFLICT (id) DO UPDATE SET name_uz = EXCLUDED.name_uz, views = EXCLUDED.views, images = EXCLUDED.images, updated_at = NOW();

INSERT INTO public.projects (id, name_uz, name_ru, name_en, description_uz, description_ru, description_en, category, subcategory, technologies, features, integrations, color, image_url, views, favorites, status, is_top, is_new, created_at, updated_at, video_url, images)
VALUES (11, '1C ERP - Korxona Yechimi', '1С ERP - Корпоративное решение', '1C ERP - Enterprise Solution', '1C ERP tizimi bilan to''liq integratsiya.', 'Полная интеграция с системой 1С ERP.', 'Full integration with 1C ERP system.', 'Biznes va Avtomatlashtirish', 'ERP tizimlari', '["1C", "Python", "PostgreSQL", "REST API", "XML"]', '[]', '["Telegram", "Email"]', 'from-primary-500 to-primary-600', 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800', 30, 0, 'ACTIVE', false, false, '2025-12-26 00:32:30.427179+05', '2026-01-06 02:46:38.464272+05', NULL, '[]'::json)
ON CONFLICT (id) DO UPDATE SET name_uz = EXCLUDED.name_uz, views = EXCLUDED.views, images = EXCLUDED.images, updated_at = NOW();

INSERT INTO public.projects (id, name_uz, name_ru, name_en, description_uz, description_ru, description_en, category, subcategory, technologies, features, integrations, color, image_url, views, favorites, status, is_top, is_new, created_at, updated_at, video_url, images)
VALUES (9, 'Ombor Boshqaruv Tizimi Pro', 'Система управления складом Pro', 'Warehouse Management System Pro', 'Zamonaviy ombor boshqaruv tizimi.', 'Современная система управления складом.', 'Modern warehouse management system.', 'Biznes va Avtomatlashtirish', 'Ombor boshqaruvi', '["Python", "FastAPI", "PostgreSQL", "React Native", "Barcode API"]', '[]', '["Telegram"]', 'from-primary-500 to-primary-600', 'https://images.unsplash.com/photo-1553413077-190dd305871c?w=800', 12, 0, 'ACTIVE', false, false, '2025-12-26 00:32:08.664738+05', '2026-01-06 20:25:00.462897+05', NULL, '["/uploads/images/59ad4041-0401-4068-bf33-d7f08f6a0c0b.webp", "/uploads/images/ab89cd2e-1092-4051-abc0-49d76dee4c22.jpg"]'::json)
ON CONFLICT (id) DO UPDATE SET name_uz = EXCLUDED.name_uz, views = EXCLUDED.views, images = EXCLUDED.images, updated_at = NOW();

-- SUBCATEGORY_PROJECTS (barcha yozuvlar)
INSERT INTO public.subcategory_projects (id, name_uz, name_ru, name_en, category_id, "order", is_active, created_at, updated_at)
VALUES (1, 'CRM tizimlari', 'CRM системы', 'CRM Systems', 8, 1, true, '2025-12-25 22:56:09.39055+05', NOW())
ON CONFLICT (id) DO UPDATE SET name_uz = EXCLUDED.name_uz, name_ru = EXCLUDED.name_ru, name_en = EXCLUDED.name_en, updated_at = NOW();

INSERT INTO public.subcategory_projects (id, name_uz, name_ru, name_en, category_id, "order", is_active, created_at, updated_at)
VALUES (2, 'ERP tizimlari', 'ERP системы', 'ERP Systems', 8, 2, true, '2025-12-25 22:56:11.469379+05', NOW())
ON CONFLICT (id) DO UPDATE SET name_uz = EXCLUDED.name_uz, name_ru = EXCLUDED.name_ru, name_en = EXCLUDED.name_en, updated_at = NOW();

INSERT INTO public.subcategory_projects (id, name_uz, name_ru, name_en, category_id, "order", is_active, created_at, updated_at)
VALUES (3, 'Ombor va inventar boshqaruvi', 'Управление складом и инвентарём', 'Warehouse & Inventory Management', 8, 3, true, '2025-12-25 22:56:13.53252+05', NOW())
ON CONFLICT (id) DO UPDATE SET name_uz = EXCLUDED.name_uz, name_ru = EXCLUDED.name_ru, name_en = EXCLUDED.name_en, updated_at = NOW();

INSERT INTO public.subcategory_projects (id, name_uz, name_ru, name_en, category_id, "order", is_active, created_at, updated_at)
VALUES (4, 'Buyurtma va savdo boshqaruvi', 'Управление заказами и продажами', 'Order & Sales Management', 8, 4, true, '2025-12-25 22:56:15.599893+05', NOW())
ON CONFLICT (id) DO UPDATE SET name_uz = EXCLUDED.name_uz, name_ru = EXCLUDED.name_ru, name_en = EXCLUDED.name_en, updated_at = NOW();

INSERT INTO public.subcategory_projects (id, name_uz, name_ru, name_en, category_id, "order", is_active, created_at, updated_at)
VALUES (5, 'Hisob-kitob va billing', 'Учёт и биллинг', 'Accounting & Billing', 8, 5, true, '2025-12-25 22:56:17.670906+05', NOW())
ON CONFLICT (id) DO UPDATE SET name_uz = EXCLUDED.name_uz, name_ru = EXCLUDED.name_ru, name_en = EXCLUDED.name_en, updated_at = NOW();

INSERT INTO public.subcategory_projects (id, name_uz, name_ru, name_en, category_id, "order", is_active, created_at, updated_at)
VALUES (6, 'Kadrlar (HR) tizimlari', 'HR системы', 'HR Systems', 8, 6, true, '2025-12-25 22:56:19.736175+05', NOW())
ON CONFLICT (id) DO UPDATE SET name_uz = EXCLUDED.name_uz, name_ru = EXCLUDED.name_ru, name_en = EXCLUDED.name_en, updated_at = NOW();

INSERT INTO public.subcategory_projects (id, name_uz, name_ru, name_en, category_id, "order", is_active, created_at, updated_at)
VALUES (7, 'Avtomatik hisobotlar', 'Автоматические отчёты', 'Automated Reports', 8, 7, true, '2025-12-25 22:56:21.803148+05', NOW())
ON CONFLICT (id) DO UPDATE SET name_uz = EXCLUDED.name_uz, name_ru = EXCLUDED.name_ru, name_en = EXCLUDED.name_en, updated_at = NOW();

INSERT INTO public.subcategory_projects (id, name_uz, name_ru, name_en, category_id, "order", is_active, created_at, updated_at)
VALUES (8, 'Raqamli hujjatlashtirish', 'Цифровая документация', 'Digital Documentation', 8, 8, true, '2025-12-25 22:56:23.869159+05', NOW())
ON CONFLICT (id) DO UPDATE SET name_uz = EXCLUDED.name_uz, name_ru = EXCLUDED.name_ru, name_en = EXCLUDED.name_en, updated_at = NOW();

INSERT INTO public.subcategory_projects (id, name_uz, name_ru, name_en, category_id, "order", is_active, created_at, updated_at)
VALUES (9, 'Onlayn savdo platformalari', 'Онлайн торговые платформы', 'Online Sales Platforms', 9, 1, true, '2025-12-25 22:56:28.003969+05', NOW())
ON CONFLICT (id) DO UPDATE SET name_uz = EXCLUDED.name_uz, name_ru = EXCLUDED.name_ru, name_en = EXCLUDED.name_en, updated_at = NOW();

INSERT INTO public.subcategory_projects (id, name_uz, name_ru, name_en, category_id, "order", is_active, created_at, updated_at)
VALUES (10, 'Internet do''konlar', 'Интернет-магазины', 'E-commerce Stores', 9, 2, true, '2025-12-25 22:56:30.055491+05', NOW())
ON CONFLICT (id) DO UPDATE SET name_uz = EXCLUDED.name_uz, name_ru = EXCLUDED.name_ru, name_en = EXCLUDED.name_en, updated_at = NOW();

INSERT INTO public.subcategory_projects (id, name_uz, name_ru, name_en, category_id, "order", is_active, created_at, updated_at)
VALUES (11, 'Reklama boshqaruvi', 'Управление рекламой', 'Ads Management', 9, 3, true, '2025-12-25 22:56:32.137207+05', NOW())
ON CONFLICT (id) DO UPDATE SET name_uz = EXCLUDED.name_uz, name_ru = EXCLUDED.name_ru, name_en = EXCLUDED.name_en, updated_at = NOW();

INSERT INTO public.subcategory_projects (id, name_uz, name_ru, name_en, category_id, "order", is_active, created_at, updated_at)
VALUES (12, 'SMM va kontent rejalashtirish', 'SMM и планирование контента', 'SMM & Content Planning', 9, 4, true, '2025-12-25 22:56:34.202123+05', NOW())
ON CONFLICT (id) DO UPDATE SET name_uz = EXCLUDED.name_uz, name_ru = EXCLUDED.name_ru, name_en = EXCLUDED.name_en, updated_at = NOW();

INSERT INTO public.subcategory_projects (id, name_uz, name_ru, name_en, category_id, "order", is_active, created_at, updated_at)
VALUES (13, 'Lead generation tizimlari', 'Системы лидогенерации', 'Lead Generation Systems', 9, 5, true, '2025-12-25 22:56:36.271586+05', NOW())
ON CONFLICT (id) DO UPDATE SET name_uz = EXCLUDED.name_uz, name_ru = EXCLUDED.name_ru, name_en = EXCLUDED.name_en, updated_at = NOW();

INSERT INTO public.subcategory_projects (id, name_uz, name_ru, name_en, category_id, "order", is_active, created_at, updated_at)
VALUES (14, 'Email & SMS marketing', 'Email и SMS маркетинг', 'Email & SMS Marketing', 9, 6, true, '2025-12-25 22:56:38.338552+05', NOW())
ON CONFLICT (id) DO UPDATE SET name_uz = EXCLUDED.name_uz, name_ru = EXCLUDED.name_ru, name_en = EXCLUDED.name_en, updated_at = NOW();

INSERT INTO public.subcategory_projects (id, name_uz, name_ru, name_en, category_id, "order", is_active, created_at, updated_at)
VALUES (15, 'Call-center avtomatlashtirish', 'Автоматизация call-центра', 'Call Center Automation', 9, 7, true, '2025-12-25 22:56:40.407822+05', NOW())
ON CONFLICT (id) DO UPDATE SET name_uz = EXCLUDED.name_uz, name_ru = EXCLUDED.name_ru, name_en = EXCLUDED.name_en, updated_at = NOW();

INSERT INTO public.subcategory_projects (id, name_uz, name_ru, name_en, category_id, "order", is_active, created_at, updated_at)
VALUES (16, 'Affiliate marketing tizimlari', 'Партнёрский маркетинг', 'Affiliate Marketing Systems', 9, 8, true, '2025-12-25 22:56:42.474695+05', NOW())
ON CONFLICT (id) DO UPDATE SET name_uz = EXCLUDED.name_uz, name_ru = EXCLUDED.name_ru, name_en = EXCLUDED.name_en, updated_at = NOW();

INSERT INTO public.subcategory_projects (id, name_uz, name_ru, name_en, category_id, "order", is_active, created_at, updated_at)
VALUES (17, 'Buxgalteriya dasturlari', 'Бухгалтерские программы', 'Accounting Software', 10, 1, true, '2025-12-25 22:56:46.585904+05', NOW())
ON CONFLICT (id) DO UPDATE SET name_uz = EXCLUDED.name_uz, name_ru = EXCLUDED.name_ru, name_en = EXCLUDED.name_en, updated_at = NOW();

INSERT INTO public.subcategory_projects (id, name_uz, name_ru, name_en, category_id, "order", is_active, created_at, updated_at)
VALUES (18, 'Soliq va hisobot tizimlari', 'Налоговые и отчётные системы', 'Tax & Reporting Systems', 10, 2, true, '2025-12-25 22:56:48.638582+05', NOW())
ON CONFLICT (id) DO UPDATE SET name_uz = EXCLUDED.name_uz, name_ru = EXCLUDED.name_ru, name_en = EXCLUDED.name_en, updated_at = NOW();

INSERT INTO public.subcategory_projects (id, name_uz, name_ru, name_en, category_id, "order", is_active, created_at, updated_at)
VALUES (19, 'To''lov integratsiyalari', 'Платёжные интеграции', 'Payment Integrations', 10, 3, true, '2025-12-25 22:56:50.678386+05', NOW())
ON CONFLICT (id) DO UPDATE SET name_uz = EXCLUDED.name_uz, name_ru = EXCLUDED.name_ru, name_en = EXCLUDED.name_en, updated_at = NOW();

-- SEQUENCE VALUES (jadval nomlarini public. bilan)
SELECT setval('public.banners_id_seq', COALESCE((SELECT MAX(id) FROM public.banners), 1));
SELECT setval('public.category_projects_id_seq', COALESCE((SELECT MAX(id) FROM public.category_projects), 1));
SELECT setval('public.projects_id_seq', COALESCE((SELECT MAX(id) FROM public.projects), 1));
SELECT setval('public.subcategory_projects_id_seq', COALESCE((SELECT MAX(id) FROM public.subcategory_projects), 1));
