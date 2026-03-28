--
-- PostgreSQL database dump
--

\restrict QHAuJA4ZZzpGicRBbWwGGEyr9cZjpye2DK74r97JIVUlmTHNmDuJ5UURs64Z8N5

-- Dumped from database version 18.1
-- Dumped by pg_dump version 18.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: banners; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.banners VALUES (19, '', '', '', '', '', '', NULL, '', 0, 'ACTIVE', '2026-01-06 19:37:24.903183+05', NULL, NULL, '/uploads/videos/4400d393-f9b0-4d2b-990c-ca13d6bbe3e5.mp4');
INSERT INTO public.banners VALUES (20, '', '', '', '', '', '', '/uploads/images/8df02ddf-e040-422a-9c14-b489cbb5c9c1.jpg', '', 0, 'ACTIVE', '2026-01-06 19:56:46.001269+05', NULL, NULL, NULL);
INSERT INTO public.banners VALUES (15, 'Onlayn Avtopark ', '', '', '', '', '', '/uploads/images/67d8597e-242a-48ea-9472-c634ca75deb5.jpg', '', 0, 'ACTIVE', '2026-01-05 20:52:47.907865+05', '2026-01-06 19:57:08.64785+05', NULL, NULL);
INSERT INTO public.banners VALUES (10, '', '', '', '', '', '', NULL, '', 0, 'ACTIVE', '2026-01-05 20:19:43.56176+05', '2026-01-06 19:57:16.331416+05', NULL, '/uploads/videos/dc9f375f-3402-4e6b-8091-1837a21ce85e.mp4');
INSERT INTO public.banners VALUES (21, 'nonbor.uz', '', '', '', '', '', '/uploads/images/43d1ec0c-74bb-4130-9452-f2d70ff70546.jpg', '', 0, 'ACTIVE', '2026-01-06 20:00:34.425166+05', NULL, NULL, NULL);
INSERT INTO public.banners VALUES (17, '', '', '', 'Mazzali taom buyurtma qiling', 'Закажи вкусную еду', 'Order a delicious meal', NULL, 'https://nonbor.uz/ready', 0, 'ACTIVE', '2026-01-06 19:17:02.959626+05', '2026-01-06 20:07:02.205409+05', NULL, '/uploads/videos/591d31d7-d635-46ad-b95f-bd8d0d872f81.mp4');
INSERT INTO public.banners VALUES (18, 'Raqamli qurilish', 'Цифровое строительство', 'Digital construction', 'Mobil ilovasi bilan ish toping yoki o''z biznesingizni rivojlantiring!', 'Найдите работу или развивайте свой бизнес с нашим мобильным приложением!', 'Find a job or grow your business with our mobile app!', NULL, '', 0, 'ACTIVE', '2026-01-06 19:37:15.660525+05', '2026-01-06 20:20:12.094565+05', NULL, '/uploads/videos/1591f1ca-a45f-4316-b650-1f6349c2e7bd.mp4');


--
-- Data for Name: category_projects; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.category_projects VALUES (12, 'AI va Avtomatik Yordamchilar', 'AI и Автоматические Помощники', 'AI & Automation Assistants', 'Chatbot, AI analytics va sun''iy intellekt yechimlari', 'Чат-бот, ИИ-аналитика и решения в области искусственного интеллекта', 'Chatbot, AI analytics and artificial intelligence solutions', '🤖', 6, true, '2025-12-25 22:57:21.633087+05', '2026-01-06 13:51:38.970297+05');
INSERT INTO public.category_projects VALUES (8, 'Biznes va Avtomatlashtirish', 'Бизнес и Автоматизация', 'Business & Automation', 'CRM, ERP va biznes jarayonlarini avtomatlashtirish tizimlari', 'CRM, ERP и системы автоматизации бизнес-процессов', 'CRM, ERP and business process automation systems', '🏢', 1, true, '2025-12-25 22:56:07.340156+05', '2026-01-06 13:51:38.970297+05');
INSERT INTO public.category_projects VALUES (9, 'Savdo va Marketing', 'Продажи и Маркетинг', 'Sales & Marketing', 'E-commerce, reklama va marketing avtomatlashtirish', 'Автоматизация электронной коммерции, рекламы и маркетинга', 'E-commerce, advertising and marketing automation', '📈', 2, true, '2025-12-25 22:56:25.935845+05', '2026-01-06 13:51:38.970297+05');
INSERT INTO public.category_projects VALUES (10, 'Moliyaviy Texnologiyalar', 'Финансовые Технологии', 'Financial Technologies', 'Buxgalteriya, to''lov tizimlari va moliyaviy xizmatlar', 'Бухгалтерский учет, платежные системы и финансовые услуги', 'Accounting, payment systems and financial services', '💰', 3, true, '2025-12-25 22:56:44.541125+05', '2026-01-06 13:51:38.970297+05');
INSERT INTO public.category_projects VALUES (11, 'Ta''lim va O''rganish', 'Образование и Обучение', 'Education & Learning', 'LMS, online ta''lim va test platformalari', 'LMS, платформы онлайн-обучения и тестирования', 'LMS, online learning and testing platforms', '📚', 4, true, '2025-12-25 22:57:03.043582+05', '2026-01-06 13:51:38.970297+05');
INSERT INTO public.category_projects VALUES (13, 'Mobil va Veb Ilovalar', 'Мобильные и Веб Приложения', 'Mobile & Web Apps', 'Flutter, React, API va dasturiy ta''minot ishlab chiqish', 'Flutter, React, API и разработка программного обеспечения', 'Flutter, React, API and software development', '📱', 7, true, '2025-12-25 22:57:40.232714+05', '2026-01-06 13:51:38.970297+05');
INSERT INTO public.category_projects VALUES (14, 'Logistika va Yetkazib Berish', 'Логистика и Доставка', 'Logistics & Delivery', 'Yetkazib berish, kuryer va marshrut tizimlari', 'Системы доставки, курьерской доставки и маршрутизации', 'Delivery, courier and routing systems', '🚚', 9, true, '2025-12-25 22:57:58.67422+05', '2026-01-06 13:51:38.970297+05');
INSERT INTO public.category_projects VALUES (16, 'Qurilish va Ko''chmas Mulk', 'Строительство и Недвижимость', 'Construction & Real Estate', NULL, NULL, NULL, '🏗️', 5, true, '2026-01-06 13:51:38.970297+05', NULL);
INSERT INTO public.category_projects VALUES (17, 'Media va Dizayn', 'Медиа и Дизайн', 'Media & Design', NULL, NULL, NULL, '🎨', 8, true, '2026-01-06 13:51:38.970297+05', NULL);
INSERT INTO public.category_projects VALUES (18, 'Sanoat va Ishlab Chiqarish', 'Промышленность и Производство', 'Industry & Manufacturing', NULL, NULL, NULL, '🏭', 10, true, '2026-01-06 13:51:38.970297+05', NULL);
INSERT INTO public.category_projects VALUES (19, 'Startaplar va Maxsus Buyurtmalar', 'Стартапы и Заказная Разработка', 'Startups & Custom Orders', NULL, NULL, NULL, '🚀', 11, true, '2026-01-06 13:51:38.970297+05', NULL);


--
-- Data for Name: news; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: projects; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.projects VALUES (10, 'AmoCRM Professional Integratsiya', 'AmoCRM Профессиональная интеграция', 'AmoCRM Professional Integration', 'AmoCRM bilan to''liq integratsiya. Avtomatik lead yaratish, savdo voronkasi boshqaruvi, mijozlar bilan munosabatlar.', 'Полная интеграция с AmoCRM. Автоматическое создание лидов, управление воронкой продаж, работа с клиентами.', 'Full AmoCRM integration. Automatic lead creation, sales funnel management, customer relationships.', 'Biznes va Avtomatlashtirish', 'CRM tizimlari', '["Python", "AmoCRM API", "Webhook", "FastAPI", "Redis"]', '[{"uz": "Avtomatik lead yaratish", "ru": "\u0410\u0432\u0442\u043e\u043c\u0430\u0442\u0438\u0447\u0435\u0441\u043a\u043e\u0435 \u0441\u043e\u0437\u0434\u0430\u043d\u0438\u0435 \u043b\u0438\u0434\u043e\u0432", "en": "Automatic lead creation"}, {"uz": "Savdo voronkasi boshqaruvi", "ru": "\u0423\u043f\u0440\u0430\u0432\u043b\u0435\u043d\u0438\u0435 \u0432\u043e\u0440\u043e\u043d\u043a\u043e\u0439 \u043f\u0440\u043e\u0434\u0430\u0436", "en": "Sales funnel management"}, {"uz": "Email integratsiyasi", "ru": "\u0418\u043d\u0442\u0435\u0433\u0440\u0430\u0446\u0438\u044f \u0441 email", "en": "Email integration"}, {"uz": "Vazifalarni avtomatlashtirish", "ru": "\u0410\u0432\u0442\u043e\u043c\u0430\u0442\u0438\u0437\u0430\u0446\u0438\u044f \u0437\u0430\u0434\u0430\u0447", "en": "Task automation"}, {"uz": "Analitika va hisobotlar", "ru": "\u0410\u043d\u0430\u043b\u0438\u0442\u0438\u043a\u0430 \u0438 \u043e\u0442\u0447\u0451\u0442\u044b", "en": "Analytics and reports"}]', '["AmoCRM", "Telegram", "Email", "WhatsApp"]', 'from-primary-500 to-primary-600', 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800', 12, 0, 'ACTIVE', false, false, '2025-12-26 00:32:30.177993+05', '2026-01-06 02:25:40.089431+05', NULL, NULL);
INSERT INTO public.projects VALUES (12, 'Nonbor - Oshxona Avtomatlashtirish', 'Nonbor - Автоматизация общепита', 'Nonbor - Catering Automation', 'Restoran, kafe va oshxonalar uchun to''liq avtomatlashtirish tizimi. Buyurtmalarni qabul qilish, oshxona boshqaruvi, hisobotlar va moliyaviy nazorat.', 'Полная система автоматизации для ресторанов, кафе и столовых. Приём заказов, управление кухней, отчёты и финансовый контроль.', 'Complete automation system for restaurants, cafes and canteens. Order management, kitchen control, reports and financial monitoring.', 'Biznes va Avtomatlashtirish', 'CRM tizimlari', '["Python", "FastAPI", "PostgreSQL", "React", "WebSocket"]', '[{"uz": "Onlayn buyurtma qabul qilish", "ru": "\u041e\u043d\u043b\u0430\u0439\u043d \u043f\u0440\u0438\u0451\u043c \u0437\u0430\u043a\u0430\u0437\u043e\u0432", "en": "Online order acceptance"}, {"uz": "Real-time oshxona monitoring", "ru": "\u041c\u043e\u043d\u0438\u0442\u043e\u0440\u0438\u043d\u0433 \u043a\u0443\u0445\u043d\u0438 \u0432 \u0440\u0435\u0430\u043b\u044c\u043d\u043e\u043c \u0432\u0440\u0435\u043c\u0435\u043d\u0438", "en": "Real-time kitchen monitoring"}, {"uz": "Moliyaviy hisobotlar", "ru": "\u0424\u0438\u043d\u0430\u043d\u0441\u043e\u0432\u0430\u044f \u043e\u0442\u0447\u0451\u0442\u043d\u043e\u0441\u0442\u044c", "en": "Financial reports"}, {"uz": "Inventar nazorati", "ru": "\u041a\u043e\u043d\u0442\u0440\u043e\u043b\u044c \u0438\u043d\u0432\u0435\u043d\u0442\u0430\u0440\u044f", "en": "Inventory control"}, {"uz": "Xodimlar boshqaruvi", "ru": "\u0423\u043f\u0440\u0430\u0432\u043b\u0435\u043d\u0438\u0435 \u043f\u0435\u0440\u0441\u043e\u043d\u0430\u043b\u043e\u043c", "en": "Staff management"}]', '["Telegram"]', 'from-[#00a6a6] to-[#00a6a6]/80', '/uploads/images/8109e63e-5b14-464b-a893-ad65398cd006.png', 132, 0, 'ACTIVE', false, false, '2025-12-26 12:24:45.054814+05', '2026-01-06 15:56:32.639594+05', NULL, '[]');
INSERT INTO public.projects VALUES (4, 'AI Chatbot - Sun''iy Intellekt Yordamchisi', 'AI Chatbot - Помощник на основе ИИ', 'AI Chatbot - Artificial Intelligence Assistant', 'Sun''iy intellekt asosidagi zamonaviy chatbot. Tabiiy tilni qayta ishlash, ko''p tilli qo''llab-quvvatlash va o''rganish qobiliyati.', 'Современный чат-бот на основе искусственного интеллекта. Обработка естественного языка, многоязычная поддержка и способность к обучению.', 'Modern chatbot based on artificial intelligence. Natural language processing, multilingual support and learning capability.', 'AI va Avtomatik Yordamchilar', 'Chatbotlar (Telegram / Web)', '["Python", "TensorFlow", "FastAPI", "NLP", "OpenAI API"]', '[{"uz": "Tabiiy tilni qayta ishlash", "ru": "\u041e\u0431\u0440\u0430\u0431\u043e\u0442\u043a\u0430 \u0435\u0441\u0442\u0435\u0441\u0442\u0432\u0435\u043d\u043d\u043e\u0433\u043e \u044f\u0437\u044b\u043a\u0430", "en": "Natural language processing"}, {"uz": "Ko''p tilli qo''llab-quvvatlash", "ru": "\u041c\u043d\u043e\u0433\u043e\u044f\u0437\u044b\u0447\u043d\u0430\u044f \u043f\u043e\u0434\u0434\u0435\u0440\u0436\u043a\u0430", "en": "Multilingual support"}, {"uz": "O''rganish qobiliyati", "ru": "\u0421\u043f\u043e\u0441\u043e\u0431\u043d\u043e\u0441\u0442\u044c \u043a \u043e\u0431\u0443\u0447\u0435\u043d\u0438\u044e", "en": "Learning capability"}, {"uz": "Analitika va statistika", "ru": "\u0410\u043d\u0430\u043b\u0438\u0442\u0438\u043a\u0430 \u0438 \u0441\u0442\u0430\u0442\u0438\u0441\u0442\u0438\u043a\u0430", "en": "Analytics and statistics"}, {"uz": "24/7 avtomatik javoblar", "ru": "\u0410\u0432\u0442\u043e\u043c\u0430\u0442\u0438\u0447\u0435\u0441\u043a\u0438\u0435 \u043e\u0442\u0432\u0435\u0442\u044b 24/7", "en": "24/7 automatic responses"}]', '["Telegram"]', 'from-pink-500 to-rose-500', NULL, 3, 0, 'ACTIVE', false, false, '2025-12-25 22:22:08.765778+05', '2026-01-06 14:24:34.160316+05', NULL, '[]');
INSERT INTO public.projects VALUES (3, 'Mobil Bank Ilovasi', 'Мобильное банковское приложение', 'Mobile Banking Application', 'To''liq funksional mobil bank ilovasi. Pul o''tkazmalari, to''lovlar, karta boshqaruvi va kredit arizalari.', 'Полнофункциональное мобильное банковское приложение. Денежные переводы, платежи, управление картами и кредитные заявки.', 'Full-featured mobile banking application. Money transfers, payments, card management and loan applications.', 'Mobil va Veb Ilovalar', 'Mobil ilovalar', '["Flutter", "Dart", "Firebase", "REST API", "Biometric Auth"]', '[{"uz": "Pul o''tkazmalari", "ru": "\u0414\u0435\u043d\u0435\u0436\u043d\u044b\u0435 \u043f\u0435\u0440\u0435\u0432\u043e\u0434\u044b", "en": "Money transfers"}, {"uz": "Kommunal to''lovlar", "ru": "\u041e\u043f\u043b\u0430\u0442\u0430 \u043a\u043e\u043c\u043c\u0443\u043d\u0430\u043b\u044c\u043d\u044b\u0445 \u0443\u0441\u043b\u0443\u0433", "en": "Utility payments"}, {"uz": "Karta boshqaruvi", "ru": "\u0423\u043f\u0440\u0430\u0432\u043b\u0435\u043d\u0438\u0435 \u043a\u0430\u0440\u0442\u0430\u043c\u0438", "en": "Card management"}, {"uz": "Kredit arizalari", "ru": "\u041a\u0440\u0435\u0434\u0438\u0442\u043d\u044b\u0435 \u0437\u0430\u044f\u0432\u043a\u0438", "en": "Loan applications"}, {"uz": "Biometrik autentifikatsiya", "ru": "\u0411\u0438\u043e\u043c\u0435\u0442\u0440\u0438\u0447\u0435\u0441\u043a\u0430\u044f \u0430\u0443\u0442\u0435\u043d\u0442\u0438\u0444\u0438\u043a\u0430\u0446\u0438\u044f", "en": "Biometric authentication"}]', '[]', 'from-violet-500 to-purple-500', NULL, 0, 0, 'ACTIVE', false, false, '2025-12-25 22:22:06.716489+05', '2026-01-06 14:24:51.041784+05', NULL, '[]');
INSERT INTO public.projects VALUES (2, 'CRM Dashboard - Mijozlar Boshqaruvi', 'CRM Dashboard - Управление клиентами', 'CRM Dashboard - Customer Management', 'Zamonaviy CRM tizimi. Mijozlarni boshqarish, analitika, hisobotlar va jamoa hamkorligi uchun yechim.', 'Современная CRM система. Решение для управления клиентами, аналитики, отчётности и командного взаимодействия.', 'Modern CRM system. Solution for customer management, analytics, reporting and team collaboration.', 'Biznes va Avtomatlashtirish', 'CRM tizimlari', '["React", "TypeScript", "TailwindCSS", "Node.js", "MongoDB"]', '[{"uz": "Mijozlar boshqaruvi", "ru": "\u0423\u043f\u0440\u0430\u0432\u043b\u0435\u043d\u0438\u0435 \u043a\u043b\u0438\u0435\u043d\u0442\u0430\u043c\u0438", "en": "Customer management"}, {"uz": "Analitika va statistika", "ru": "\u0410\u043d\u0430\u043b\u0438\u0442\u0438\u043a\u0430 \u0438 \u0441\u0442\u0430\u0442\u0438\u0441\u0442\u0438\u043a\u0430", "en": "Analytics and statistics"}, {"uz": "Hisobotlar tizimi", "ru": "\u0421\u0438\u0441\u0442\u0435\u043c\u0430 \u043e\u0442\u0447\u0451\u0442\u043e\u0432", "en": "Reporting system"}, {"uz": "Jamoa hamkorligi", "ru": "\u041a\u043e\u043c\u0430\u043d\u0434\u043d\u043e\u0435 \u0432\u0437\u0430\u0438\u043c\u043e\u0434\u0435\u0439\u0441\u0442\u0432\u0438\u0435", "en": "Team collaboration"}, {"uz": "Email marketing", "ru": "Email \u043c\u0430\u0440\u043a\u0435\u0442\u0438\u043d\u0433", "en": "Email marketing"}]', '["Telegram"]', 'from-[#0a2d5c] to-[#0a2d5c]/80', NULL, 0, 0, 'ACTIVE', false, false, '2025-12-25 22:22:04.633118+05', '2026-01-06 14:25:07.621541+05', NULL, '[]');
INSERT INTO public.projects VALUES (11, '1C ERP - Korxona Yechimi', '1С ERP - Корпоративное решение', '1C ERP - Enterprise Solution', '1C ERP tizimi bilan to''liq integratsiya. Moliyaviy hisobotlar, buxgalteriya, ish haqi hisoblash va korxona resurslarini boshqarish.', 'Полная интеграция с системой 1С ERP. Финансовая отчётность, бухгалтерия, расчёт заработной платы и управление ресурсами предприятия.', 'Full integration with 1C ERP system. Financial reporting, accounting, payroll calculation and enterprise resource management.', 'Biznes va Avtomatlashtirish', 'ERP tizimlari', '["1C", "Python", "PostgreSQL", "REST API", "XML"]', '[{"uz": "Moliyaviy hisobotlar", "ru": "\u0424\u0438\u043d\u0430\u043d\u0441\u043e\u0432\u0430\u044f \u043e\u0442\u0447\u0451\u0442\u043d\u043e\u0441\u0442\u044c", "en": "Financial reports"}, {"uz": "Inventar sinxronizatsiyasi", "ru": "\u0421\u0438\u043d\u0445\u0440\u043e\u043d\u0438\u0437\u0430\u0446\u0438\u044f \u0438\u043d\u0432\u0435\u043d\u0442\u0430\u0440\u044f", "en": "Inventory synchronization"}, {"uz": "HR boshqaruvi", "ru": "\u0423\u043f\u0440\u0430\u0432\u043b\u0435\u043d\u0438\u0435 \u043f\u0435\u0440\u0441\u043e\u043d\u0430\u043b\u043e\u043c", "en": "HR management"}, {"uz": "Ish haqi tizimi", "ru": "\u0421\u0438\u0441\u0442\u0435\u043c\u0430 \u0440\u0430\u0441\u0447\u0451\u0442\u0430 \u0437\u0430\u0440\u043f\u043b\u0430\u0442\u044b", "en": "Payroll system"}, {"uz": "Avtomatik hisobotlar", "ru": "\u0410\u0432\u0442\u043e\u043c\u0430\u0442\u0438\u0447\u0435\u0441\u043a\u0438\u0435 \u043e\u0442\u0447\u0451\u0442\u044b", "en": "Automated reports"}]', '["Telegram", "Email"]', 'from-primary-500 to-primary-600', 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800', 30, 0, 'ACTIVE', false, false, '2025-12-26 00:32:30.427179+05', '2026-01-06 02:46:38.464272+05', NULL, '[]');
INSERT INTO public.projects VALUES (9, 'Ombor Boshqaruv Tizimi Pro', 'Система управления складом Pro', 'Warehouse Management System Pro', 'Zamonaviy ombor boshqaruv tizimi. Real-time inventar nazorati, barcode skanerlash, avtomatik buyurtmalar va keng qamrovli hisobotlar.', 'Современная система управления складом. Контроль инвентаря в реальном времени, сканирование штрих-кодов, автоматические заказы и расширенная отчётность.', 'Modern warehouse management system. Real-time inventory control, barcode scanning, automatic orders and comprehensive reporting.', 'Biznes va Avtomatlashtirish', 'Ombor boshqaruvi', '["Python", "FastAPI", "PostgreSQL", "React Native", "Barcode API"]', '[{"uz": "Real-time inventar nazorati", "ru": "\u041a\u043e\u043d\u0442\u0440\u043e\u043b\u044c \u0438\u043d\u0432\u0435\u043d\u0442\u0430\u0440\u044f \u0432 \u0440\u0435\u0430\u043b\u044c\u043d\u043e\u043c \u0432\u0440\u0435\u043c\u0435\u043d\u0438", "en": "Real-time inventory control"}, {"uz": "Avtomatik buyurtmalar", "ru": "\u0410\u0432\u0442\u043e\u043c\u0430\u0442\u0438\u0447\u0435\u0441\u043a\u0438\u0435 \u0437\u0430\u043a\u0430\u0437\u044b", "en": "Automatic orders"}, {"uz": "Hisobot va analitika", "ru": "\u041e\u0442\u0447\u0451\u0442\u044b \u0438 \u0430\u043d\u0430\u043b\u0438\u0442\u0438\u043a\u0430", "en": "Reports and analytics"}, {"uz": "Mobil ilova", "ru": "\u041c\u043e\u0431\u0438\u043b\u044c\u043d\u043e\u0435 \u043f\u0440\u0438\u043b\u043e\u0436\u0435\u043d\u0438\u0435", "en": "Mobile application"}, {"uz": "Umumiy nazorat", "ru": "\u041e\u0431\u0449\u0438\u0439 \u043a\u043e\u043d\u0442\u0440\u043e\u043b\u044c", "en": "General control"}]', '["Telegram"]', 'from-primary-500 to-primary-600', 'https://images.unsplash.com/photo-1553413077-190dd305871c?w=800', 12, 0, 'ACTIVE', false, false, '2025-12-26 00:32:08.664738+05', '2026-01-06 20:25:00.462897+05', NULL, '["/uploads/images/59ad4041-0401-4068-bf33-d7f08f6a0c0b.webp", "/uploads/images/ab89cd2e-1092-4051-abc0-49d76dee4c22.jpg"]');


--
-- Data for Name: subcategory_projects; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.subcategory_projects VALUES (1, 'CRM tizimlari', 'CRM системы', 'CRM Systems', 8, 1, true, '2025-12-25 22:56:09.39055+05', '2026-01-06 13:51:38.970297+05');
INSERT INTO public.subcategory_projects VALUES (2, 'ERP tizimlari', 'ERP системы', 'ERP Systems', 8, 2, true, '2025-12-25 22:56:11.469379+05', '2026-01-06 13:51:38.970297+05');
INSERT INTO public.subcategory_projects VALUES (3, 'Ombor va inventar boshqaruvi', 'Управление складом и инвентарём', 'Warehouse & Inventory Management', 8, 3, true, '2025-12-25 22:56:13.53252+05', '2026-01-06 13:51:38.970297+05');
INSERT INTO public.subcategory_projects VALUES (5, 'Hisob-kitob va billing', 'Учёт и биллинг', 'Accounting & Billing', 8, 5, true, '2025-12-25 22:56:17.670906+05', '2026-01-06 13:51:38.970297+05');
INSERT INTO public.subcategory_projects VALUES (4, 'Buyurtma va savdo boshqaruvi', 'Управление заказами и продажами', 'Order & Sales Management', 8, 4, true, '2025-12-25 22:56:15.599893+05', '2026-01-06 13:51:38.970297+05');
INSERT INTO public.subcategory_projects VALUES (6, 'Kadrlar (HR) tizimlari', 'HR системы', 'HR Systems', 8, 6, true, '2025-12-25 22:56:19.736175+05', '2026-01-06 13:51:38.970297+05');
INSERT INTO public.subcategory_projects VALUES (7, 'Avtomatik hisobotlar', 'Автоматические отчёты', 'Automated Reports', 8, 7, true, '2025-12-25 22:56:21.803148+05', '2026-01-06 13:51:38.970297+05');
INSERT INTO public.subcategory_projects VALUES (8, 'Raqamli hujjatlashtirish', 'Цифровая документация', 'Digital Documentation', 8, 8, true, '2025-12-25 22:56:23.869159+05', '2026-01-06 13:51:38.970297+05');
INSERT INTO public.subcategory_projects VALUES (9, 'Onlayn savdo platformalari', 'Онлайн торговые платформы', 'Online Sales Platforms', 9, 1, true, '2025-12-25 22:56:28.003969+05', '2026-01-06 13:51:38.970297+05');
INSERT INTO public.subcategory_projects VALUES (10, 'Internet do''konlar', 'Интернет-магазины', 'E-commerce Stores', 9, 2, true, '2025-12-25 22:56:30.055491+05', '2026-01-06 13:51:38.970297+05');
INSERT INTO public.subcategory_projects VALUES (11, 'Reklama boshqaruvi', 'Управление рекламой', 'Ads Management', 9, 3, true, '2025-12-25 22:56:32.137207+05', '2026-01-06 13:51:38.970297+05');
INSERT INTO public.subcategory_projects VALUES (12, 'SMM va kontent rejalashtirish', 'SMM и планирование контента', 'SMM & Content Planning', 9, 4, true, '2025-12-25 22:56:34.202123+05', '2026-01-06 13:51:38.970297+05');
INSERT INTO public.subcategory_projects VALUES (13, 'Lead generation tizimlari', 'Системы лидогенерации', 'Lead Generation Systems', 9, 5, true, '2025-12-25 22:56:36.271586+05', '2026-01-06 13:51:38.970297+05');
INSERT INTO public.subcategory_projects VALUES (14, 'Email & SMS marketing', 'Email и SMS маркетинг', 'Email & SMS Marketing', 9, 6, true, '2025-12-25 22:56:38.338552+05', '2026-01-06 13:51:38.970297+05');
INSERT INTO public.subcategory_projects VALUES (15, 'Call-center avtomatlashtirish', 'Автоматизация call-центра', 'Call Center Automation', 9, 7, true, '2025-12-25 22:56:40.407822+05', '2026-01-06 13:51:38.970297+05');
INSERT INTO public.subcategory_projects VALUES (16, 'Affiliate marketing tizimlari', 'Партнёрский маркетинг', 'Affiliate Marketing Systems', 9, 8, true, '2025-12-25 22:56:42.474695+05', '2026-01-06 13:51:38.970297+05');
INSERT INTO public.subcategory_projects VALUES (17, 'Buxgalteriya dasturlari', 'Бухгалтерские программы', 'Accounting Software', 10, 1, true, '2025-12-25 22:56:46.585904+05', '2026-01-06 13:51:38.970297+05');
INSERT INTO public.subcategory_projects VALUES (18, 'Soliq va hisobot tizimlari', 'Налоговые и отчётные системы', 'Tax & Reporting Systems', 10, 2, true, '2025-12-25 22:56:48.638582+05', '2026-01-06 13:51:38.970297+05');
INSERT INTO public.subcategory_projects VALUES (19, 'To''lov integratsiyalari', 'Платёжные интеграции', 'Payment Integrations', 10, 3, true, '2025-12-25 22:56:50.678386+05', '2026-01-06 13:51:38.970297+05');
INSERT INTO public.subcategory_projects VALUES (20, 'Bank API va billing', 'Bank API и биллинг', 'Bank API & Billing', 10, 4, true, '2025-12-25 22:56:52.755489+05', '2026-01-06 13:51:38.970297+05');
INSERT INTO public.subcategory_projects VALUES (21, 'Kredit va qarz boshqaruvi', 'Управление кредитами и займами', 'Credit & Loan Management', 10, 5, true, '2025-12-25 22:56:54.828005+05', '2026-01-06 13:51:38.970297+05');
INSERT INTO public.subcategory_projects VALUES (22, 'Kassa va POS tizimlari', 'Кассы и POS системы', 'POS Systems', 10, 6, true, '2025-12-25 22:56:56.868339+05', '2026-01-06 13:51:38.970297+05');
INSERT INTO public.subcategory_projects VALUES (23, 'Valyuta va konvertatsiya', 'Валюта и конвертация', 'Currency & Conversion', 10, 7, true, '2025-12-25 22:56:58.926985+05', '2026-01-06 13:51:38.970297+05');
INSERT INTO public.subcategory_projects VALUES (24, 'Obuna tizimlari', 'Системы подписок', 'Subscription Systems', 10, 8, true, '2025-12-25 22:57:00.986665+05', '2026-01-06 13:51:38.970297+05');
INSERT INTO public.subcategory_projects VALUES (25, 'LMS platformalari', 'LMS платформы', 'LMS Platforms', 11, 1, true, '2025-12-25 22:57:05.101936+05', '2026-01-06 13:51:38.970297+05');
INSERT INTO public.subcategory_projects VALUES (26, 'Test va imtihon tizimlari', 'Системы тестов и экзаменов', 'Test & Exam Systems', 11, 2, true, '2025-12-25 22:57:07.158129+05', '2026-01-06 13:51:38.970297+05');
INSERT INTO public.subcategory_projects VALUES (27, 'Video dars platformalari', 'Видео-урок платформы', 'Video Course Platforms', 11, 3, true, '2025-12-25 22:57:09.235526+05', '2026-01-06 13:51:38.970297+05');
INSERT INTO public.subcategory_projects VALUES (28, 'O''quvchilarni boshqarish', 'Управление учениками', 'Student Management', 11, 4, true, '2025-12-25 22:57:11.308179+05', '2026-01-06 13:51:38.970297+05');
INSERT INTO public.subcategory_projects VALUES (29, 'Sertifikatlash tizimlari', 'Системы сертификации', 'Certification Systems', 11, 5, true, '2025-12-25 22:57:13.376989+05', '2026-01-06 13:51:38.970297+05');
INSERT INTO public.subcategory_projects VALUES (30, 'Trening va webinar', 'Тренинги и вебинары', 'Training & Webinars', 11, 6, true, '2025-12-25 22:57:15.442142+05', '2026-01-06 13:51:38.970297+05');
INSERT INTO public.subcategory_projects VALUES (31, 'Onlayn kurs marketplace', 'Маркетплейс онлайн курсов', 'Online Course Marketplace', 11, 7, true, '2025-12-25 22:57:17.508616+05', '2026-01-06 13:51:38.970297+05');
INSERT INTO public.subcategory_projects VALUES (32, 'AI yordamchi o''qituvchilar', 'AI-помощники учителей', 'AI Teaching Assistants', 11, 8, true, '2025-12-25 22:57:19.562613+05', '2026-01-06 13:51:38.970297+05');
INSERT INTO public.subcategory_projects VALUES (33, 'Chatbotlar (Telegram / Web)', 'Чатботы (Telegram / Web)', 'Chatbots (Telegram / Web)', 12, 1, true, '2025-12-25 22:57:23.709974+05', '2026-01-06 13:51:38.970297+05');
INSERT INTO public.subcategory_projects VALUES (34, 'AI konsultantlar', 'AI консультанты', 'AI Consultants', 12, 2, true, '2025-12-25 22:57:25.76881+05', '2026-01-06 13:51:38.970297+05');
INSERT INTO public.subcategory_projects VALUES (35, 'Matn, rasm va video AI', 'Текст, изображения и видео AI', 'Text, Image & Video AI', 12, 3, true, '2025-12-25 22:57:27.827705+05', '2026-01-06 13:51:38.970297+05');
INSERT INTO public.subcategory_projects VALUES (36, 'Ovoz orqali boshqaruv', 'Голосовое управление', 'Voice Control', 12, 4, true, '2025-12-25 22:57:29.883363+05', '2026-01-06 13:51:38.970297+05');
INSERT INTO public.subcategory_projects VALUES (37, 'AI analytics va prognoz', 'AI аналитика и прогноз', 'AI Analytics & Forecasting', 12, 5, true, '2025-12-25 22:57:31.952835+05', '2026-01-06 13:51:38.970297+05');
INSERT INTO public.subcategory_projects VALUES (38, 'Tavsiya tizimlari', 'Рекомендательные системы', 'Recommendation Systems', 12, 6, true, '2025-12-25 22:57:34.025722+05', '2026-01-06 13:51:38.970297+05');
INSERT INTO public.subcategory_projects VALUES (39, 'Avtomatik javob beruvchi', 'Автоответчики', 'Auto Responders', 12, 7, true, '2025-12-25 22:57:36.103144+05', '2026-01-06 13:51:38.970297+05');
INSERT INTO public.subcategory_projects VALUES (40, 'Custom AI yechimlar', 'Кастомные AI решения', 'Custom AI Solutions', 12, 8, true, '2025-12-25 22:57:38.172959+05', '2026-01-06 13:51:38.970297+05');
INSERT INTO public.subcategory_projects VALUES (41, 'Mobil ilovalar', 'Мобильные приложения', 'Mobile Apps', 13, 1, true, '2025-12-25 22:57:42.288093+05', '2026-01-06 13:51:38.970297+05');
INSERT INTO public.subcategory_projects VALUES (42, 'Veb platformalar', 'Веб платформы', 'Web Platforms', 13, 2, true, '2025-12-25 22:57:44.346624+05', '2026-01-06 13:51:38.970297+05');
INSERT INTO public.subcategory_projects VALUES (43, 'Admin panellar', 'Админ панели', 'Admin Panels', 13, 3, true, '2025-12-25 22:57:46.39355+05', '2026-01-06 13:51:38.970297+05');
INSERT INTO public.subcategory_projects VALUES (44, 'Landing page va saytlar', 'Лендинги и сайты', 'Landing Pages & Websites', 13, 4, true, '2025-12-25 22:57:48.449133+05', '2026-01-06 13:51:38.970297+05');
INSERT INTO public.subcategory_projects VALUES (45, 'Progressive Web App', 'Progressive Web App', 'Progressive Web Apps', 13, 5, true, '2025-12-25 22:57:50.477797+05', '2026-01-06 13:51:38.970297+05');
INSERT INTO public.subcategory_projects VALUES (46, 'API va backend', 'API и бэкенд', 'API & Backend', 13, 6, true, '2025-12-25 22:57:52.521232+05', '2026-01-06 13:51:38.970297+05');
INSERT INTO public.subcategory_projects VALUES (47, 'SaaS platformalar', 'SaaS платформы', 'SaaS Platforms', 13, 7, true, '2025-12-25 22:57:54.581026+05', '2026-01-06 13:51:38.970297+05');
INSERT INTO public.subcategory_projects VALUES (48, 'UI/UX dizayn', 'UI/UX дизайн', 'UI/UX Design Services', 13, 8, true, '2025-12-25 22:57:56.618901+05', '2026-01-06 13:51:38.970297+05');
INSERT INTO public.subcategory_projects VALUES (49, 'Yetkazib berish tizimlari', 'Системы доставки', 'Delivery Systems', 14, 1, true, '2025-12-25 22:58:00.749313+05', '2026-01-06 13:51:38.970297+05');
INSERT INTO public.subcategory_projects VALUES (50, 'Kuryer boshqaruvi', 'Управление курьерами', 'Courier Management', 14, 2, true, '2025-12-25 22:58:02.809044+05', '2026-01-06 13:51:38.970297+05');
INSERT INTO public.subcategory_projects VALUES (51, 'Marshrut optimizatsiyasi', 'Оптимизация маршрутов', 'Route Optimization', 14, 3, true, '2025-12-25 22:58:04.876266+05', '2026-01-06 13:51:38.970297+05');
INSERT INTO public.subcategory_projects VALUES (52, 'Buyurtma tracking', 'Отслеживание заказов', 'Order Tracking', 14, 4, true, '2025-12-25 22:58:06.951578+05', '2026-01-06 13:51:38.970297+05');
INSERT INTO public.subcategory_projects VALUES (53, 'Ombor logistika', 'Складская логистика', 'Warehouse Logistics', 14, 5, true, '2025-12-25 22:58:09.013075+05', '2026-01-06 13:51:38.970297+05');
INSERT INTO public.subcategory_projects VALUES (54, 'GPS va xarita integratsiya', 'GPS и интеграция карт', 'GPS & Map Integration', 14, 6, true, '2025-12-25 22:58:11.085822+05', '2026-01-06 13:51:38.970297+05');
INSERT INTO public.subcategory_projects VALUES (55, 'Fleet management', 'Управление автопарком', 'Fleet Management', 14, 7, true, '2025-12-25 22:58:13.155568+05', '2026-01-06 13:51:38.970297+05');
INSERT INTO public.subcategory_projects VALUES (56, 'Avtomatik xabarnoma', 'Автоматические уведомления', 'Automated Notifications', 14, 8, true, '2025-12-25 22:58:15.235204+05', '2026-01-06 13:51:38.970297+05');
INSERT INTO public.subcategory_projects VALUES (61, 'Qurilish boshqaruvi tizimlari', 'Системы управления строительством', 'Construction Management Systems', 16, 0, true, '2026-01-06 13:51:38.970297+05', NULL);
INSERT INTO public.subcategory_projects VALUES (62, 'Loyiha va smeta dasturlari', 'Проектные и сметные программы', 'Project & Estimate Software', 16, 1, true, '2026-01-06 13:51:38.970297+05', NULL);
INSERT INTO public.subcategory_projects VALUES (63, 'Ombor va material nazorati', 'Контроль склада и материалов', 'Warehouse & Material Control', 16, 2, true, '2026-01-06 13:51:38.970297+05', NULL);
INSERT INTO public.subcategory_projects VALUES (64, 'Texnika ijarasi boshqaruvi', 'Управление арендой техники', 'Equipment Rental Management', 16, 3, true, '2026-01-06 13:51:38.970297+05', NULL);
INSERT INTO public.subcategory_projects VALUES (65, 'Real estate CRM', 'CRM для недвижимости', 'Real Estate CRM', 16, 4, true, '2026-01-06 13:51:38.970297+05', NULL);
INSERT INTO public.subcategory_projects VALUES (66, 'E''lon va listing platformalari', 'Платформы объявлений и листингов', 'Listing Platforms', 16, 5, true, '2026-01-06 13:51:38.970297+05', NULL);
INSERT INTO public.subcategory_projects VALUES (67, 'Xarita va joylashuv tizimlari', 'Системы карт и местоположения', 'Map & Location Systems', 16, 6, true, '2026-01-06 13:51:38.970297+05', NULL);
INSERT INTO public.subcategory_projects VALUES (68, 'Smart qurilish yechimlari', 'Умные строительные решения', 'Smart Construction Solutions', 16, 7, true, '2026-01-06 13:51:38.970297+05', NULL);
INSERT INTO public.subcategory_projects VALUES (69, 'Grafik dizayn', 'Графический дизайн', 'Graphic Design', 17, 0, true, '2026-01-06 13:51:38.970297+05', NULL);
INSERT INTO public.subcategory_projects VALUES (70, 'Brending va logo', 'Брендинг и логотипы', 'Branding & Logo', 17, 1, true, '2026-01-06 13:51:38.970297+05', NULL);
INSERT INTO public.subcategory_projects VALUES (71, 'Video montaj', 'Видеомонтаж', 'Video Editing', 17, 2, true, '2026-01-06 13:51:38.970297+05', NULL);
INSERT INTO public.subcategory_projects VALUES (72, 'Motion dizayn', 'Моушн дизайн', 'Motion Design', 17, 3, true, '2026-01-06 13:51:38.970297+05', NULL);
INSERT INTO public.subcategory_projects VALUES (73, 'UI/UX dizayn', 'UI/UX дизайн', 'UI/UX Design', 17, 4, true, '2026-01-06 13:51:38.970297+05', NULL);
INSERT INTO public.subcategory_projects VALUES (74, 'Reklama bannerlari', 'Рекламные баннеры', 'Ad Banners', 17, 5, true, '2026-01-06 13:51:38.970297+05', NULL);
INSERT INTO public.subcategory_projects VALUES (75, 'Social media dizayn', 'Дизайн для соцсетей', 'Social Media Design', 17, 6, true, '2026-01-06 13:51:38.970297+05', NULL);
INSERT INTO public.subcategory_projects VALUES (76, 'Prezentatsiya dizayni', 'Дизайн презентаций', 'Presentation Design', 17, 7, true, '2026-01-06 13:51:38.970297+05', NULL);
INSERT INTO public.subcategory_projects VALUES (77, 'Ishlab chiqarish monitoringi', 'Мониторинг производства', 'Production Monitoring', 18, 0, true, '2026-01-06 13:51:38.970297+05', NULL);
INSERT INTO public.subcategory_projects VALUES (78, 'Texnik xizmat nazorati', 'Контроль техобслуживания', 'Maintenance Control', 18, 1, true, '2026-01-06 13:51:38.970297+05', NULL);
INSERT INTO public.subcategory_projects VALUES (79, 'IoT boshqaruvi', 'Управление IoT', 'IoT Management', 18, 2, true, '2026-01-06 13:51:38.970297+05', NULL);
INSERT INTO public.subcategory_projects VALUES (80, 'Sifat nazorati tizimlari', 'Системы контроля качества', 'Quality Control Systems', 18, 3, true, '2026-01-06 13:51:38.970297+05', NULL);
INSERT INTO public.subcategory_projects VALUES (81, 'Buyurtma ishlab chiqarish', 'Производство под заказ', 'Custom Manufacturing', 18, 4, true, '2026-01-06 13:51:38.970297+05', NULL);
INSERT INTO public.subcategory_projects VALUES (82, 'Energiya monitoringi', 'Мониторинг энергии', 'Energy Monitoring', 18, 5, true, '2026-01-06 13:51:38.970297+05', NULL);
INSERT INTO public.subcategory_projects VALUES (83, 'Zavod ERP', 'Заводской ERP', 'Factory ERP', 18, 6, true, '2026-01-06 13:51:38.970297+05', NULL);
INSERT INTO public.subcategory_projects VALUES (84, 'Avtomatik rejalashtirish', 'Автоматическое планирование', 'Automated Planning', 18, 7, true, '2026-01-06 13:51:38.970297+05', NULL);
INSERT INTO public.subcategory_projects VALUES (85, 'MVP ishlab chiqish', 'Разработка MVP', 'MVP Development', 19, 0, true, '2026-01-06 13:51:38.970297+05', NULL);
INSERT INTO public.subcategory_projects VALUES (86, 'Startap prototiplari', 'Прототипы стартапов', 'Startup Prototypes', 19, 1, true, '2026-01-06 13:51:38.970297+05', NULL);
INSERT INTO public.subcategory_projects VALUES (87, 'Maxsus dastur buyurtmalari', 'Заказная разработка ПО', 'Custom Software Orders', 19, 2, true, '2026-01-06 13:51:38.970297+05', NULL);
INSERT INTO public.subcategory_projects VALUES (88, 'Texnik konsultatsiya', 'Техническая консультация', 'Technical Consulting', 19, 3, true, '2026-01-06 13:51:38.970297+05', NULL);
INSERT INTO public.subcategory_projects VALUES (89, 'Digital transformatsiya', 'Цифровая трансформация', 'Digital Transformation', 19, 4, true, '2026-01-06 13:51:38.970297+05', NULL);
INSERT INTO public.subcategory_projects VALUES (90, 'API integratsiyalar', 'API интеграции', 'API Integrations', 19, 5, true, '2026-01-06 13:51:38.970297+05', NULL);
INSERT INTO public.subcategory_projects VALUES (91, 'Legacy system modernizatsiya', 'Модернизация legacy систем', 'Legacy System Modernization', 19, 6, true, '2026-01-06 13:51:38.970297+05', NULL);
INSERT INTO public.subcategory_projects VALUES (92, 'Texnik audit', 'Технический аудит', 'Technical Audit', 19, 7, true, '2026-01-06 13:51:38.970297+05', NULL);


--
-- Name: banners_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.banners_id_seq', 21, true);


--
-- Name: category_projects_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.category_projects_id_seq', 20, true);


--
-- Name: news_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.news_id_seq', 1, false);


--
-- Name: notifications_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.notifications_id_seq', 1, false);


--
-- Name: projects_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.projects_id_seq', 12, true);


--
-- Name: subcategory_projects_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.subcategory_projects_id_seq', 92, true);


--
-- PostgreSQL database dump complete
--

\unrestrict QHAuJA4ZZzpGicRBbWwGGEyr9cZjpye2DK74r97JIVUlmTHNmDuJ5UURs64Z8N5

