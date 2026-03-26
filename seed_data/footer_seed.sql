-- Footer ma'lumotlarini tiklash
-- Ishlatish: psql -U postgres -d cursor_market -f footer_seed.sql

-- Mavjud ma'lumotlarni tozalash
TRUNCATE TABLE footer_items CASCADE;
TRUNCATE TABLE footer_sections CASCADE;
TRUNCATE TABLE footer_social_links CASCADE;
TRUNCATE TABLE footer_contacts CASCADE;

-- =============================================
-- 1. FOOTER SECTIONS (Bo'limlar)
-- =============================================

INSERT INTO footer_sections (title_uz, title_ru, title_en, slug, "order", is_active) VALUES
  ('Hamkorlar',  'Партнёры',  'Partners', 'partners', 1, true),
  ('Sahifalar',  'Страницы',  'Pages',    'pages',    2, true);

-- =============================================
-- 2. FOOTER ITEMS (Bo'lim elementlari)
-- =============================================

-- Hamkorlar bo'limi (section_id=1)
INSERT INTO footer_items (section_id, title_uz, title_ru, title_en, link_url, new_tab, "order", is_active) VALUES
  (1, 'WellTech',  'WellTech',  'WellTech',  'https://welltech.uz',  true, 1, true),
  (1, 'Nonbor',    'Nonbor',    'Nonbor',    'https://nonbor.uz',    true, 2, true),
  (1, 'QRHUB',     'QRHUB',     'QRHUB',     'https://qrhub.uz',     true, 3, true);

-- Sahifalar bo'limi (section_id=2)
INSERT INTO footer_items (section_id, title_uz, title_ru, title_en, link_url, new_tab, "order", is_active) VALUES
  (2, 'Biz haqimizda', 'О нас',     'About Us', 'https://welltech.uz', true,  1, true),
  (2, 'Bog''lanish',   'Контакты',  'Contact',  '#contact',            false, 2, true),
  (2, 'FAQ',           'FAQ',       'FAQ',      '/faq',                false, 3, true);

-- =============================================
-- 3. FOOTER SOCIAL LINKS (Ijtimoiy tarmoqlar)
-- =============================================

INSERT INTO footer_social_links (platform, link_url, icon, "order", is_active) VALUES
  ('telegram',  'https://t.me/aytixuz',              'fab fa-telegram',  1, true),
  ('instagram', 'https://instagram.com/aytix.uz',    'fab fa-instagram', 2, true),
  ('youtube',   'https://youtube.com/@aytix',        'fab fa-youtube',   3, true),
  ('facebook',  'https://facebook.com/aytix.uz',     'fab fa-facebook',  4, true);

-- =============================================
-- 4. FOOTER CONTACTS (Bog'lanish)
-- =============================================

INSERT INTO footer_contacts (contact_type, label_uz, label_ru, label_en, value, link_url, icon, "order", is_active) VALUES
  ('phone',    'Telefon',   'Телефон',  'Phone',   '+998 71 200 00 00',  'tel:+998712000000',           'fas fa-phone',          1, true),
  ('telegram', 'Telegram',  'Telegram', 'Telegram','@aytixuz',           'https://t.me/aytixuz',        'fab fa-telegram',       2, true),
  ('email',    'Email',     'Email',    'Email',   'info@aytix.uz',      'mailto:info@aytix.uz',        'fas fa-envelope',       3, true),
  ('address',  'Manzil',    'Адрес',    'Address', 'Toshkent, O''zbekiston', NULL,                       'fas fa-map-marker-alt', 4, true);

-- Sequence'larni yangilash
SELECT setval('footer_sections_id_seq',     (SELECT MAX(id) FROM footer_sections));
SELECT setval('footer_items_id_seq',        (SELECT MAX(id) FROM footer_items));
SELECT setval('footer_social_links_id_seq', (SELECT MAX(id) FROM footer_social_links));
SELECT setval('footer_contacts_id_seq',     (SELECT MAX(id) FROM footer_contacts));
