-- FAQ (Frequently Asked Questions) table migration
-- Run this on production server: psql -U postgres -d aytix_market -f migrations/002_create_faq_table.sql

-- Create FAQ table if not exists
CREATE TABLE IF NOT EXISTS faqs (
    id SERIAL PRIMARY KEY,
    question_uz VARCHAR NOT NULL,
    question_ru VARCHAR,
    question_en VARCHAR,
    answer_uz TEXT NOT NULL,
    answer_ru TEXT,
    answer_en TEXT,
    category VARCHAR,
    "order" INTEGER DEFAULT 0,
    status VARCHAR DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE
);

-- Create index on order column
CREATE INDEX IF NOT EXISTS ix_faqs_order ON faqs("order");

-- Create index on id column
CREATE INDEX IF NOT EXISTS ix_faqs_id ON faqs(id);

-- Insert seed data
INSERT INTO faqs (question_uz, question_ru, question_en, answer_uz, answer_ru, answer_en, category, "order", status) VALUES
('AyTix nima?', 'Что такое AyTix?', 'What is AyTix?',
'AyTix - bu Welltech kompaniyasi tomonidan ishlab chiqilgan IT loyihalar marketplace platformasi. Bu yerda siz turli xil tayyor IT yechimlarni, dasturiy ta''minotlarni va loyihalarni topishingiz mumkin. Bizning platformamiz biznes uchun zarur bo''lgan CRM, ERP, POS tizimlar, mobil ilovalar va boshqa ko''plab yechimlarni taqdim etadi.',
'AyTix - это маркетплейс IT-проектов, разработанный компанией Welltech. Здесь вы можете найти различные готовые IT-решения, программное обеспечение и проекты. Наша платформа предлагает необходимые для бизнеса CRM, ERP, POS системы, мобильные приложения и многие другие решения.',
'AyTix is an IT projects marketplace platform developed by Welltech company. Here you can find various ready-made IT solutions, software, and projects. Our platform offers CRM, ERP, POS systems, mobile applications and many other business solutions.',
'Umumiy', 1, 'active'),

('Qanday qilib loyiha sotib olsam bo''ladi?', 'Как я могу купить проект?', 'How can I purchase a project?',
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
'Xarid', 2, 'active'),

('Loyihalarni moslashtirish (customization) mumkinmi?', 'Можно ли кастомизировать проекты?', 'Can projects be customized?',
'Ha, barcha loyihalarni sizning biznesingiz ehtiyojlariga moslashtirishimiz mumkin. Har bir loyiha asosiy funksiyalar bilan keladi, lekin siz qo''shimcha modullar, dizayn o''zgarishlari, integratsiyalar va boshqa maxsus talablarni buyurtma qilishingiz mumkin. Moslashtirish narxi va muddati loyihaning murakkabligiga qarab belgilanadi.',
'Да, мы можем адаптировать все проекты под потребности вашего бизнеса. Каждый проект поставляется с базовыми функциями, но вы можете заказать дополнительные модули, изменения дизайна, интеграции и другие специальные требования. Стоимость и сроки кастомизации определяются в зависимости от сложности проекта.',
'Yes, we can customize all projects to meet your business needs. Each project comes with core features, but you can order additional modules, design changes, integrations, and other special requirements. The customization cost and timeline depend on the project complexity.',
'Xizmatlar', 3, 'active'),

('Texnik qo''llab-quvvatlash xizmati mavjudmi?', 'Есть ли техническая поддержка?', 'Is technical support available?',
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
'Qo''llab-quvvatlash', 4, 'active'),

('Loyihalarning narxi qanday belgilanadi?', 'Как определяется цена проектов?', 'How is the project price determined?',
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
'Narxlar', 5, 'active'),

('Qanday to''lov usullari mavjud?', 'Какие способы оплаты доступны?', 'What payment methods are available?',
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
'To''lov', 6, 'active'),

('Loyiha qancha vaqtda topshiriladi?', 'Сколько времени занимает доставка проекта?', 'How long does project delivery take?',
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
'Xizmatlar', 7, 'active'),

('Loyihaning manba kodini olsam bo''ladimi?', 'Могу ли я получить исходный код проекта?', 'Can I get the project source code?',
'Ha, barcha loyihalar to''liq manba kodi bilan birga topshiriladi. Siz loyihani o''z serverlaringizga o''rnatishingiz, o''zgartirishingiz va rivojlantirishingiz mumkin. Biz hech qanday yashirin cheklovlar qo''ymaymiz. Faqat litsenziya shartlariga muvofiq foydalanishingiz kerak.',
'Да, все проекты поставляются с полным исходным кодом. Вы можете установить проект на свои серверы, модифицировать и развивать его. Мы не накладываем никаких скрытых ограничений. Необходимо только соблюдать условия лицензии.',
'Yes, all projects are delivered with full source code. You can install the project on your own servers, modify and develop it. We don''t impose any hidden restrictions. You only need to comply with the license terms.',
'Litsenziya', 8, 'active'),

('Qaysi texnologiyalar ishlatiladi?', 'Какие технологии используются?', 'What technologies are used?',
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
'Texnologiyalar', 9, 'active'),

('Welltech kompaniyasi haqida ko''proq ma''lumot olsam bo''ladimi?', 'Можно узнать больше о компании Welltech?', 'Can I learn more about Welltech company?',
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
'Kompaniya', 10, 'active')

ON CONFLICT DO NOTHING;

-- Verify FAQ data
SELECT id, question_uz, category, status FROM faqs ORDER BY "order";

-- ================================================
-- Footer Contacts Table
-- ================================================

CREATE TABLE IF NOT EXISTS footer_contacts (
    id SERIAL PRIMARY KEY,
    contact_type VARCHAR(50) NOT NULL,
    label_uz VARCHAR,
    label_ru VARCHAR,
    label_en VARCHAR,
    value VARCHAR(500) NOT NULL,
    link_url VARCHAR(500),
    icon VARCHAR(100),
    is_active BOOLEAN DEFAULT true,
    "order" INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes
CREATE INDEX IF NOT EXISTS ix_footer_contacts_id ON footer_contacts(id);
CREATE INDEX IF NOT EXISTS ix_footer_contacts_order ON footer_contacts("order");

-- Insert sample contacts data
INSERT INTO footer_contacts (contact_type, label_uz, label_ru, label_en, value, link_url, icon, is_active, "order") VALUES
('phone', 'Telefon', 'Телефон', 'Phone', '+998 90 123 45 67', 'tel:+998901234567', 'phone', true, 1),
('email', 'Email', 'Email', 'Email', 'info@aytix.uz', 'mailto:info@aytix.uz', 'email', true, 2),
('telegram', 'Telegram', 'Telegram', 'Telegram', '@aytix_uz', 'https://t.me/aytix_uz', 'telegram', true, 3),
('address', 'Manzil', 'Адрес', 'Address', 'Toshkent shahri, O''zbekiston', 'https://maps.google.com', 'address', true, 4)
ON CONFLICT DO NOTHING;

-- Verify contacts data
SELECT id, contact_type, value, is_active FROM footer_contacts ORDER BY "order";
