-- Production uchun FAQ ma'lumotlari
-- Ishlatish: psql -d cursor_market -f faq_prod.sql

-- FAQ 11: AyTix nima? (Umumiy)
INSERT INTO public.faqs (id, question_uz, question_ru, question_en, answer_uz, answer_ru, answer_en, category, "order")
VALUES (11, 'AyTix nima?', 'Что такое AyTix?', 'What is AyTix?',
'AyTix - bu Welltech kompaniyasi tomonidan ishlab chiqilgan IT loyihalar marketplace platformasi. Bu yerda siz turli xil tayyor IT yechimlarni, dasturiy ta''minotlarni va loyihalarni topishingiz mumkin. Bizning platformamiz biznes uchun zarur bo''lgan CRM, ERP, POS tizimlar, mobil ilovalar va boshqa ko''plab yechimlarni taqdim etadi.',
'AyTix - это маркетплейс IT-проектов, разработанный компанией Welltech. Здесь вы можете найти различные готовые IT-решения, программное обеспечение и проекты. Наша платформа предлагает необходимые для бизнеса CRM, ERP, POS системы, мобильные приложения и многие другие решения.',
'AyTix is an IT projects marketplace platform developed by Welltech company. Here you can find various ready-made IT solutions, software, and projects. Our platform offers CRM, ERP, POS systems, mobile applications and many other business solutions.',
'Umumiy', 1)
ON CONFLICT (id) DO UPDATE SET question_uz=EXCLUDED.question_uz, question_ru=EXCLUDED.question_ru, question_en=EXCLUDED.question_en, answer_uz=EXCLUDED.answer_uz, answer_ru=EXCLUDED.answer_ru, answer_en=EXCLUDED.answer_en, category=EXCLUDED.category, "order"=EXCLUDED."order";

-- FAQ 12: Qanday qilib loyiha sotib olsam bo'ladi? (Xarid)
INSERT INTO public.faqs (id, question_uz, question_ru, question_en, answer_uz, answer_ru, answer_en, category, "order")
VALUES (12, 'Qanday qilib loyiha sotib olsam bo''ladi?', 'Как я могу купить проект?', 'How can I purchase a project?',
'Loyiha sotib olish uchun quyidagi qadamlarni bajaring:
1. O''zingizga kerakli loyihani tanlang
2. Loyiha sahifasida ''Buyurtma berish'' tugmasini bosing
3. Aloqa ma''lumotlaringizni kiriting
4. Bizning mutaxassislarimiz siz bilan 24 soat ichida bog''lanadi
5. Shartnoma tuzilgandan so''ng loyiha sizga topshiriladi',
'Чтобы приобрести проект, выполните следующие шаги:
1. Выберите нужный вам проект
2. Нажмите кнопку ''Заказать'' на странице проекта
3. Введите ваши контактные данные
4. Наши специалисты свяжутся с вами в течение 24 часов
5. После заключения договора проект будет передан вам',
'To purchase a project, follow these steps:
1. Select the project you need
2. Click the ''Order'' button on the project page
3. Enter your contact information
4. Our specialists will contact you within 24 hours
5. After signing the contract, the project will be delivered to you',
'Xarid', 2)
ON CONFLICT (id) DO UPDATE SET question_uz=EXCLUDED.question_uz, question_ru=EXCLUDED.question_ru, question_en=EXCLUDED.question_en, answer_uz=EXCLUDED.answer_uz, answer_ru=EXCLUDED.answer_ru, answer_en=EXCLUDED.answer_en, category=EXCLUDED.category, "order"=EXCLUDED."order";

-- FAQ 13: Loyihalarni moslashtirish mumkinmi? (Xizmatlar)
INSERT INTO public.faqs (id, question_uz, question_ru, question_en, answer_uz, answer_ru, answer_en, category, "order")
VALUES (13, 'Loyihalarni moslashtirish (customization) mumkinmi?', 'Можно ли кастомизировать проекты?', 'Can projects be customized?',
'Ha, barcha loyihalarni sizning biznesingiz ehtiyojlariga moslashtirishimiz mumkin. Har bir loyiha asosiy funksiyalar bilan keladi, lekin siz qo''shimcha modullar, dizayn o''zgarishlari, integratsiyalar va boshqa maxsus talablarni buyurtma qilishingiz mumkin. Moslashtirish narxi va muddati loyihaning murakkabligiga qarab belgilanadi.',
'Да, мы можем адаптировать все проекты под потребности вашего бизнеса. Каждый проект поставляется с базовыми функциями, но вы можете заказать дополнительные модули, изменения дизайна, интеграции и другие специальные требования. Стоимость и сроки кастомизации определяются в зависимости от сложности проекта.',
'Yes, we can customize all projects to meet your business needs. Each project comes with core features, but you can order additional modules, design changes, integrations, and other special requirements. The customization cost and timeline depend on the project complexity.',
'Xizmatlar', 3)
ON CONFLICT (id) DO UPDATE SET question_uz=EXCLUDED.question_uz, question_ru=EXCLUDED.question_ru, question_en=EXCLUDED.question_en, answer_uz=EXCLUDED.answer_uz, answer_ru=EXCLUDED.answer_ru, answer_en=EXCLUDED.answer_en, category=EXCLUDED.category, "order"=EXCLUDED."order";

-- FAQ 14: Texnik qo'llab-quvvatlash xizmati mavjudmi? (Qo'llab-quvvatlash)
INSERT INTO public.faqs (id, question_uz, question_ru, question_en, answer_uz, answer_ru, answer_en, category, "order")
VALUES (14, 'Texnik qo''llab-quvvatlash xizmati mavjudmi?', 'Есть ли техническая поддержка?', 'Is technical support available?',
'Ha, biz barcha loyihalar uchun texnik qo''llab-quvvatlash xizmatini taqdim etamiz:
- Bepul 3 oylik texnik qo''llab-quvvatlash
- 24/7 yordam xizmati
- Bug fix va xatoliklarni tuzatish
- Foydalanuvchi qo''llanmasi va dokumentatsiya
- Video darsliklar

Qo''shimcha ravishda yillik texnik qo''llab-quvvatlash paketlarini sotib olishingiz mumkin.',
'Да, мы предоставляем техническую поддержку для всех проектов:
- Бесплатная техническая поддержка 3 месяца
- Служба поддержки 24/7
- Исправление багов и ошибок
- Руководство пользователя и документация
- Видео уроки

Дополнительно вы можете приобрести годовые пакеты технической поддержки.',
'Yes, we provide technical support for all projects:
- Free 3-month technical support
- 24/7 help service
- Bug fixes and error corrections
- User manual and documentation
- Video tutorials

Additionally, you can purchase annual technical support packages.',
'Qo''llab-quvvatlash', 4)
ON CONFLICT (id) DO UPDATE SET question_uz=EXCLUDED.question_uz, question_ru=EXCLUDED.question_ru, question_en=EXCLUDED.question_en, answer_uz=EXCLUDED.answer_uz, answer_ru=EXCLUDED.answer_ru, answer_en=EXCLUDED.answer_en, category=EXCLUDED.category, "order"=EXCLUDED."order";

-- FAQ 15: Loyihalarning narxi qanday belgilanadi? (Narxlar)
INSERT INTO public.faqs (id, question_uz, question_ru, question_en, answer_uz, answer_ru, answer_en, category, "order")
VALUES (15, 'Loyihalarning narxi qanday belgilanadi?', 'Как определяется цена проектов?', 'How is the project price determined?',
'Loyiha narxi quyidagi omillarga bog''liq:
- Loyihaning murakkabligi va funksionaligi
- Foydalaniladigan texnologiyalar
- Modullar va integratsiyalar soni
- Moslashtirish darajasi
- Litsenziya turi (bir martalik yoki obuna)

Aniq narxni bilish uchun bizning mutaxassislarimiz bilan bog''laning.',
'Цена проекта зависит от следующих факторов:
- Сложность и функциональность проекта
- Используемые технологии
- Количество модулей и интеграций
- Степень кастомизации
- Тип лицензии (разовая или подписка)

Для уточнения цены свяжитесь с нашими специалистами.',
'The project price depends on the following factors:
- Project complexity and functionality
- Technologies used
- Number of modules and integrations
- Level of customization
- License type (one-time or subscription)

Contact our specialists for exact pricing.',
'Narxlar', 5)
ON CONFLICT (id) DO UPDATE SET question_uz=EXCLUDED.question_uz, question_ru=EXCLUDED.question_ru, question_en=EXCLUDED.question_en, answer_uz=EXCLUDED.answer_uz, answer_ru=EXCLUDED.answer_ru, answer_en=EXCLUDED.answer_en, category=EXCLUDED.category, "order"=EXCLUDED."order";

-- FAQ 16: Qanday to'lov usullari mavjud? (To'lov)
INSERT INTO public.faqs (id, question_uz, question_ru, question_en, answer_uz, answer_ru, answer_en, category, "order")
VALUES (16, 'Qanday to''lov usullari mavjud?', 'Какие способы оплаты доступны?', 'What payment methods are available?',
'Biz quyidagi to''lov usullarini qabul qilamiz:
- Bank o''tkazmasi (so''m, dollar, rubl)
- Click va Payme orqali to''lov
- Naqd pul (ofisda)
- Bo''lib to''lash imkoniyati (6-12 oy)

To''lov 100% oldindan yoki shartnomaga muvofiq bo''lib-bo''lib amalga oshirilishi mumkin.',
'Мы принимаем следующие способы оплаты:
- Банковский перевод (сумы, доллары, рубли)
- Оплата через Click и Payme
- Наличные (в офисе)
- Рассрочка (6-12 месяцев)

Оплата может быть произведена 100% предоплатой или частями согласно договору.',
'We accept the following payment methods:
- Bank transfer (UZS, USD, RUB)
- Payment via Click and Payme
- Cash (at office)
- Installment option (6-12 months)

Payment can be made 100% upfront or in installments according to the contract.',
'To''lov', 6)
ON CONFLICT (id) DO UPDATE SET question_uz=EXCLUDED.question_uz, question_ru=EXCLUDED.question_ru, question_en=EXCLUDED.question_en, answer_uz=EXCLUDED.answer_uz, answer_ru=EXCLUDED.answer_ru, answer_en=EXCLUDED.answer_en, category=EXCLUDED.category, "order"=EXCLUDED."order";

-- FAQ 17: Loyiha qancha vaqtda topshiriladi? (Xizmatlar)
INSERT INTO public.faqs (id, question_uz, question_ru, question_en, answer_uz, answer_ru, answer_en, category, "order")
VALUES (17, 'Loyiha qancha vaqtda topshiriladi?', 'Сколько времени занимает доставка проекта?', 'How long does project delivery take?',
'Loyiha topshirish muddati:
- Tayyor loyihalar: 1-3 ish kuni
- Moslashtirish bilan: 1-4 hafta
- Murakkab integratsiyalar: 1-2 oy

Aniq muddat loyihaning murakkabligi va sizning talablaringizga bog''liq. Shartnoma tuzishdan oldin aniq muddat kelishib olinadi.',
'Сроки доставки проекта:
- Готовые проекты: 1-3 рабочих дня
- С кастомизацией: 1-4 недели
- Сложные интеграции: 1-2 месяца

Точные сроки зависят от сложности проекта и ваших требований. Конкретные сроки согласовываются до заключения договора.',
'Project delivery timeline:
- Ready projects: 1-3 business days
- With customization: 1-4 weeks
- Complex integrations: 1-2 months

Exact timeline depends on project complexity and your requirements. Specific deadlines are agreed upon before signing the contract.',
'Xizmatlar', 7)
ON CONFLICT (id) DO UPDATE SET question_uz=EXCLUDED.question_uz, question_ru=EXCLUDED.question_ru, question_en=EXCLUDED.question_en, answer_uz=EXCLUDED.answer_uz, answer_ru=EXCLUDED.answer_ru, answer_en=EXCLUDED.answer_en, category=EXCLUDED.category, "order"=EXCLUDED."order";

-- FAQ 18: Loyihaning manba kodini olsam bo'ladimi? (Litsenziya)
INSERT INTO public.faqs (id, question_uz, question_ru, question_en, answer_uz, answer_ru, answer_en, category, "order")
VALUES (18, 'Loyihaning manba kodini olsam bo''ladimi?', 'Могу ли я получить исходный код проекта?', 'Can I get the project source code?',
'Ha, barcha loyihalar to''liq manba kodi bilan birga topshiriladi. Siz loyihani o''z serverlaringizga o''rnatishingiz, o''zgartirishingiz va rivojlantirishingiz mumkin. Biz hech qanday yashirin cheklovlar qo''ymaymiz. Faqat litsenziya shartlariga muvofiq foydalanishingiz kerak.',
'Да, все проекты поставляются с полным исходным кодом. Вы можете установить проект на свои серверы, модифицировать и развивать его. Мы не накладываем никаких скрытых ограничений. Необходимо только соблюдать условия лицензии.',
'Yes, all projects are delivered with full source code. You can install the project on your own servers, modify and develop it. We don''t impose any hidden restrictions. You only need to comply with the license terms.',
'Litsenziya', 8)
ON CONFLICT (id) DO UPDATE SET question_uz=EXCLUDED.question_uz, question_ru=EXCLUDED.question_ru, question_en=EXCLUDED.question_en, answer_uz=EXCLUDED.answer_uz, answer_ru=EXCLUDED.answer_ru, answer_en=EXCLUDED.answer_en, category=EXCLUDED.category, "order"=EXCLUDED."order";

-- FAQ 19: Qaysi texnologiyalar ishlatiladi? (Texnologiyalar)
INSERT INTO public.faqs (id, question_uz, question_ru, question_en, answer_uz, answer_ru, answer_en, category, "order")
VALUES (19, 'Qaysi texnologiyalar ishlatiladi?', 'Какие технологии используются?', 'What technologies are used?',
'Bizning loyihalarimizda zamonaviy texnologiyalar ishlatiladi:

Frontend: React, Next.js, Vue.js, TypeScript
Backend: Python (FastAPI, Django), Node.js, PHP
Mobil: React Native, Flutter
Ma''lumotlar bazasi: PostgreSQL, MySQL, MongoDB
Infrastruktura: Docker, AWS, DigitalOcean

Har bir loyihada ishlatiladigan texnologiyalar loyiha sahifasida ko''rsatilgan.',
'В наших проектах используются современные технологии:

Frontend: React, Next.js, Vue.js, TypeScript
Backend: Python (FastAPI, Django), Node.js, PHP
Мобильные: React Native, Flutter
Базы данных: PostgreSQL, MySQL, MongoDB
Инфраструктура: Docker, AWS, DigitalOcean

Технологии, используемые в каждом проекте, указаны на странице проекта.',
'Our projects use modern technologies:

Frontend: React, Next.js, Vue.js, TypeScript
Backend: Python (FastAPI, Django), Node.js, PHP
Mobile: React Native, Flutter
Databases: PostgreSQL, MySQL, MongoDB
Infrastructure: Docker, AWS, DigitalOcean

Technologies used in each project are listed on the project page.',
'Texnologiyalar', 9)
ON CONFLICT (id) DO UPDATE SET question_uz=EXCLUDED.question_uz, question_ru=EXCLUDED.question_ru, question_en=EXCLUDED.question_en, answer_uz=EXCLUDED.answer_uz, answer_ru=EXCLUDED.answer_ru, answer_en=EXCLUDED.answer_en, category=EXCLUDED.category, "order"=EXCLUDED."order";

-- FAQ 20: Welltech kompaniyasi haqida (Kompaniya)
INSERT INTO public.faqs (id, question_uz, question_ru, question_en, answer_uz, answer_ru, answer_en, category, "order")
VALUES (20, 'Welltech kompaniyasi haqida ko''proq ma''lumot olsam bo''ladimi?', 'Можно узнать больше о компании Welltech?', 'Can I learn more about Welltech company?',
'Welltech - O''zbekistonda yetakchi IT kompaniyalaridan biri. Biz 2019-yildan beri biznes uchun dasturiy ta''minot yechimlarini ishlab chiqamiz. Bizning jamoa 50+ tajribali dasturchidan iborat. Biz 200+ muvaffaqiyatli loyihani amalga oshirganmiz.

Batafsil ma''lumot: welltech.uz
Manzil: Toshkent shahri
Telefon: +998 90 123 45 67',
'Welltech - одна из ведущих IT-компаний в Узбекистане. С 2019 года мы разрабатываем программные решения для бизнеса. Наша команда состоит из 50+ опытных разработчиков. Мы реализовали 200+ успешных проектов.

Подробнее: welltech.uz
Адрес: город Ташкент
Телефон: +998 90 123 45 67',
'Welltech is one of the leading IT companies in Uzbekistan. Since 2019, we have been developing software solutions for businesses. Our team consists of 50+ experienced developers. We have implemented 200+ successful projects.

More info: welltech.uz
Address: Tashkent city
Phone: +998 90 123 45 67',
'Kompaniya', 10)
ON CONFLICT (id) DO UPDATE SET question_uz=EXCLUDED.question_uz, question_ru=EXCLUDED.question_ru, question_en=EXCLUDED.question_en, answer_uz=EXCLUDED.answer_uz, answer_ru=EXCLUDED.answer_ru, answer_en=EXCLUDED.answer_en, category=EXCLUDED.category, "order"=EXCLUDED."order";

-- Sequence yangilash
SELECT setval('public.faqs_id_seq', COALESCE((SELECT MAX(id) FROM public.faqs), 1));
