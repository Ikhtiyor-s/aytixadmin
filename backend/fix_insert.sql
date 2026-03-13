-- Projects jadvaliga to'g'ri INSERT qilish
-- Ustunlar tartibi: id, name_uz, name_ru, name_en, description_uz, description_ru, description_en,
-- category, subcategory, technologies, features, integrations, color, image_url,
-- views, favorites, status, is_top, is_new, created_at, updated_at, video_url, images

-- Namuna INSERT (ON CONFLICT bilan - mavjud bo'lsa yangilash)
INSERT INTO projects (
    id, name_uz, name_ru, name_en,
    description_uz, description_ru, description_en,
    category, subcategory,
    technologies, features, integrations,
    color, image_url, video_url, images,
    views, favorites, status, is_top, is_new,
    created_at, updated_at
) VALUES (
    1, 'Loyiha nomi UZ', 'Название проекта RU', 'Project name EN',
    'Tavsif UZ', 'Описание RU', 'Description EN',
    'Biznes va Avtomatlashtirish', 'CRM tizimlar',
    '["Python", "FastAPI"]'::json, '["Feature 1", "Feature 2"]'::json, '["Telegram", "API"]'::json,
    'from-blue-500 to-cyan-500', '/uploads/images/example.png', '/uploads/videos/demo.mp4', '[]'::json,
    100, 5, 'ACTIVE', false, true,
    NOW(), NOW()
)
ON CONFLICT (id) DO UPDATE SET
    name_uz = EXCLUDED.name_uz,
    name_ru = EXCLUDED.name_ru,
    name_en = EXCLUDED.name_en,
    description_uz = EXCLUDED.description_uz,
    category = EXCLUDED.category,
    views = EXCLUDED.views,
    updated_at = NOW();

-- Sequence ni to'g'rilash (max id dan keyin)
SELECT setval('projects_id_seq', COALESCE((SELECT MAX(id) FROM projects), 1));
