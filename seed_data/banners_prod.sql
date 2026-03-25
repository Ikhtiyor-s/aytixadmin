-- Production uchun banner ma'lumotlari (video_url bilan)
-- Ishlatish: psql -d cursor_market -f banners_prod.sql

-- Banner 21: nonbor.uz (image)
INSERT INTO public.banners (id, title_uz, title_ru, title_en, description_uz, description_ru, description_en, image_url, video_url, link_url, project_id, "order", status, created_at, updated_at)
VALUES (21, 'nonbor.uz', '', '', '', '', '', '/uploads/images/43d1ec0c-74bb-4130-9452-f2d70ff70546.jpg', NULL, '', NULL, 0, 'ACTIVE', '2026-01-06T20:00:34.425166+05:00', NULL)
ON CONFLICT (id) DO UPDATE SET title_uz=EXCLUDED.title_uz, image_url=EXCLUDED.image_url, video_url=EXCLUDED.video_url, updated_at=NOW();

-- Banner 20: (image)
INSERT INTO public.banners (id, title_uz, title_ru, title_en, description_uz, description_ru, description_en, image_url, video_url, link_url, project_id, "order", status, created_at, updated_at)
VALUES (20, '', '', '', '', '', '', '/uploads/images/8df02ddf-e040-422a-9c14-b489cbb5c9c1.jpg', NULL, '', NULL, 0, 'ACTIVE', '2026-01-06T19:56:46.001269+05:00', NULL)
ON CONFLICT (id) DO UPDATE SET image_url=EXCLUDED.image_url, video_url=EXCLUDED.video_url, updated_at=NOW();

-- Banner 19: (video)
INSERT INTO public.banners (id, title_uz, title_ru, title_en, description_uz, description_ru, description_en, image_url, video_url, link_url, project_id, "order", status, created_at, updated_at)
VALUES (19, '', '', '', '', '', '', NULL, '/uploads/videos/4400d393-f9b0-4d2b-990c-ca13d6bbe3e5.mp4', '', NULL, 0, 'ACTIVE', '2026-01-06T19:37:24.903183+05:00', NULL)
ON CONFLICT (id) DO UPDATE SET image_url=EXCLUDED.image_url, video_url=EXCLUDED.video_url, updated_at=NOW();

-- Banner 18: Raqamli qurilish (video)
INSERT INTO public.banners (id, title_uz, title_ru, title_en, description_uz, description_ru, description_en, image_url, video_url, link_url, project_id, "order", status, created_at, updated_at)
VALUES (18, 'Raqamli qurilish', 'Цифровое строительство', 'Digital construction', 'Mobil ilovasi bilan ish toping yoki o''z biznesingizni rivojlantiring!', 'Найдите работу или развивайте свой бизнес с нашим мобильным приложением!', 'Find a job or grow your business with our mobile app!', NULL, '/uploads/videos/1591f1ca-a45f-4316-b650-1f6349c2e7bd.mp4', '', NULL, 0, 'ACTIVE', '2026-01-06T19:37:15.660525+05:00', '2026-01-06T20:20:12.094565+05:00')
ON CONFLICT (id) DO UPDATE SET title_uz=EXCLUDED.title_uz, title_ru=EXCLUDED.title_ru, title_en=EXCLUDED.title_en, description_uz=EXCLUDED.description_uz, description_ru=EXCLUDED.description_ru, description_en=EXCLUDED.description_en, image_url=EXCLUDED.image_url, video_url=EXCLUDED.video_url, updated_at=NOW();

-- Banner 17: Mazzali taom (video)
INSERT INTO public.banners (id, title_uz, title_ru, title_en, description_uz, description_ru, description_en, image_url, video_url, link_url, project_id, "order", status, created_at, updated_at)
VALUES (17, '', '', '', 'Mazzali taom buyurtma qiling', 'Закажи вкусную еду', 'Order a delicious meal', NULL, '/uploads/videos/591d31d7-d635-46ad-b95f-bd8d0d872f81.mp4', 'https://nonbor.uz/ready', NULL, 0, 'ACTIVE', '2026-01-06T19:17:02.959626+05:00', '2026-01-06T20:07:02.205409+05:00')
ON CONFLICT (id) DO UPDATE SET description_uz=EXCLUDED.description_uz, description_ru=EXCLUDED.description_ru, description_en=EXCLUDED.description_en, image_url=EXCLUDED.image_url, video_url=EXCLUDED.video_url, link_url=EXCLUDED.link_url, updated_at=NOW();

-- Banner 15: Onlayn Avtopark (image)
INSERT INTO public.banners (id, title_uz, title_ru, title_en, description_uz, description_ru, description_en, image_url, video_url, link_url, project_id, "order", status, created_at, updated_at)
VALUES (15, 'Onlayn Avtopark ', '', '', '', '', '', '/uploads/images/67d8597e-242a-48ea-9472-c634ca75deb5.jpg', NULL, '', NULL, 0, 'ACTIVE', '2026-01-05T20:52:47.907865+05:00', '2026-01-06T19:57:08.647850+05:00')
ON CONFLICT (id) DO UPDATE SET title_uz=EXCLUDED.title_uz, image_url=EXCLUDED.image_url, video_url=EXCLUDED.video_url, updated_at=NOW();

-- Banner 10: (video)
INSERT INTO public.banners (id, title_uz, title_ru, title_en, description_uz, description_ru, description_en, image_url, video_url, link_url, project_id, "order", status, created_at, updated_at)
VALUES (10, '', '', '', '', '', '', NULL, '/uploads/videos/dc9f375f-3402-4e6b-8091-1837a21ce85e.mp4', '', NULL, 0, 'ACTIVE', '2026-01-05T20:19:43.561760+05:00', '2026-01-06T19:57:16.331416+05:00')
ON CONFLICT (id) DO UPDATE SET image_url=EXCLUDED.image_url, video_url=EXCLUDED.video_url, updated_at=NOW();

-- Sequence yangilash
SELECT setval('public.banners_id_seq', COALESCE((SELECT MAX(id) FROM public.banners), 1));
