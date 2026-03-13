"""
AyTix FAQ (Ko'p so'raladigan savollar) ma'lumotlarini qo'shish
"""
import sys
sys.path.insert(0, '.')

from app.core.database import SessionLocal
from app.models import FAQ

# FAQ ma'lumotlari
faq_data = [
    {
        "question_uz": "AyTix nima?",
        "question_ru": "Что такое AyTix?",
        "question_en": "What is AyTix?",
        "answer_uz": "AyTix - bu Welltech kompaniyasi tomonidan ishlab chiqilgan IT loyihalar marketplace platformasi. Bu yerda siz turli xil tayyor IT yechimlarni, dasturiy ta'minotlarni va loyihalarni topishingiz mumkin. Bizning platformamiz biznes uchun zarur bo'lgan CRM, ERP, POS tizimlar, mobil ilovalar va boshqa ko'plab yechimlarni taqdim etadi.",
        "answer_ru": "AyTix - это маркетплейс IT-проектов, разработанный компанией Welltech. Здесь вы можете найти различные готовые IT-решения, программное обеспечение и проекты. Наша платформа предлагает необходимые для бизнеса CRM, ERP, POS системы, мобильные приложения и многие другие решения.",
        "answer_en": "AyTix is an IT projects marketplace platform developed by Welltech company. Here you can find various ready-made IT solutions, software, and projects. Our platform offers CRM, ERP, POS systems, mobile applications and many other business solutions.",
        "category": "Umumiy",
        "order": 1
    },
    {
        "question_uz": "Qanday qilib loyiha sotib olsam bo'ladi?",
        "question_ru": "Как я могу купить проект?",
        "question_en": "How can I purchase a project?",
        "answer_uz": "Loyiha sotib olish uchun quyidagi qadamlarni bajaring:\n1. O'zingizga kerakli loyihani tanlang\n2. Loyiha sahifasida 'Buyurtma berish' tugmasini bosing\n3. Aloqa ma'lumotlaringizni kiriting\n4. Bizning mutaxassislarimiz siz bilan 24 soat ichida bog'lanadi\n5. Shartnoma tuzilgandan so'ng loyiha sizga topshiriladi",
        "answer_ru": "Чтобы приобрести проект, выполните следующие шаги:\n1. Выберите нужный вам проект\n2. Нажмите кнопку 'Заказать' на странице проекта\n3. Введите ваши контактные данные\n4. Наши специалисты свяжутся с вами в течение 24 часов\n5. После заключения договора проект будет передан вам",
        "answer_en": "To purchase a project, follow these steps:\n1. Select the project you need\n2. Click the 'Order' button on the project page\n3. Enter your contact information\n4. Our specialists will contact you within 24 hours\n5. After signing the contract, the project will be delivered to you",
        "category": "Xarid",
        "order": 2
    },
    {
        "question_uz": "Loyihalarni moslashtirish (customization) mumkinmi?",
        "question_ru": "Можно ли кастомизировать проекты?",
        "question_en": "Can projects be customized?",
        "answer_uz": "Ha, barcha loyihalarni sizning biznesingiz ehtiyojlariga moslashtirishimiz mumkin. Har bir loyiha asosiy funksiyalar bilan keladi, lekin siz qo'shimcha modullar, dizayn o'zgarishlari, integratsiyalar va boshqa maxsus talablarni buyurtma qilishingiz mumkin. Moslashtirish narxi va muddati loyihaning murakkabligiga qarab belgilanadi.",
        "answer_ru": "Да, мы можем адаптировать все проекты под потребности вашего бизнеса. Каждый проект поставляется с базовыми функциями, но вы можете заказать дополнительные модули, изменения дизайна, интеграции и другие специальные требования. Стоимость и сроки кастомизации определяются в зависимости от сложности проекта.",
        "answer_en": "Yes, we can customize all projects to meet your business needs. Each project comes with core features, but you can order additional modules, design changes, integrations, and other special requirements. The customization cost and timeline depend on the project complexity.",
        "category": "Xizmatlar",
        "order": 3
    },
    {
        "question_uz": "Texnik qo'llab-quvvatlash xizmati mavjudmi?",
        "question_ru": "Есть ли техническая поддержка?",
        "question_en": "Is technical support available?",
        "answer_uz": "Ha, biz barcha loyihalar uchun texnik qo'llab-quvvatlash xizmatini taqdim etamiz:\n- Bepul 3 oylik texnik qo'llab-quvvatlash\n- 24/7 yordam xizmati\n- Bug fix va xatoliklarni tuzatish\n- Foydalanuvchi qo'llanmasi va dokumentatsiya\n- Video darsliklar\n\nQo'shimcha ravishda yillik texnik qo'llab-quvvatlash paketlarini sotib olishingiz mumkin.",
        "answer_ru": "Да, мы предоставляем техническую поддержку для всех проектов:\n- Бесплатная техническая поддержка 3 месяца\n- Служба поддержки 24/7\n- Исправление багов и ошибок\n- Руководство пользователя и документация\n- Видео уроки\n\nДополнительно вы можете приобрести годовые пакеты технической поддержки.",
        "answer_en": "Yes, we provide technical support for all projects:\n- Free 3-month technical support\n- 24/7 help service\n- Bug fixes and error corrections\n- User manual and documentation\n- Video tutorials\n\nAdditionally, you can purchase annual technical support packages.",
        "category": "Qo'llab-quvvatlash",
        "order": 4
    },
    {
        "question_uz": "Loyihalarning narxi qanday belgilanadi?",
        "question_ru": "Как определяется цена проектов?",
        "question_en": "How is the project price determined?",
        "answer_uz": "Loyiha narxi quyidagi omillarga bog'liq:\n- Loyihaning murakkabligi va funksionaligi\n- Foydalaniladigan texnologiyalar\n- Modullar va integratsiyalar soni\n- Moslashtirish darajasi\n- Litsenziya turi (bir martalik yoki obuna)\n\nAniq narxni bilish uchun bizning mutaxassislarimiz bilan bog'laning.",
        "answer_ru": "Цена проекта зависит от следующих факторов:\n- Сложность и функциональность проекта\n- Используемые технологии\n- Количество модулей и интеграций\n- Степень кастомизации\n- Тип лицензии (разовая или подписка)\n\nДля уточнения цены свяжитесь с нашими специалистами.",
        "answer_en": "The project price depends on the following factors:\n- Project complexity and functionality\n- Technologies used\n- Number of modules and integrations\n- Level of customization\n- License type (one-time or subscription)\n\nContact our specialists for exact pricing.",
        "category": "Narxlar",
        "order": 5
    },
    {
        "question_uz": "Qanday to'lov usullari mavjud?",
        "question_ru": "Какие способы оплаты доступны?",
        "question_en": "What payment methods are available?",
        "answer_uz": "Biz quyidagi to'lov usullarini qabul qilamiz:\n- Bank o'tkazmasi (so'm, dollar, rubl)\n- Click va Payme orqali to'lov\n- Naqd pul (ofisda)\n- Bo'lib to'lash imkoniyati (6-12 oy)\n\nTo'lov 100% oldindan yoki shartnomaga muvofiq bo'lib-bo'lib amalga oshirilishi mumkin.",
        "answer_ru": "Мы принимаем следующие способы оплаты:\n- Банковский перевод (сумы, доллары, рубли)\n- Оплата через Click и Payme\n- Наличные (в офисе)\n- Рассрочка (6-12 месяцев)\n\nОплата может быть произведена 100% предоплатой или частями согласно договору.",
        "answer_en": "We accept the following payment methods:\n- Bank transfer (UZS, USD, RUB)\n- Payment via Click and Payme\n- Cash (at office)\n- Installment option (6-12 months)\n\nPayment can be made 100% upfront or in installments according to the contract.",
        "category": "To'lov",
        "order": 6
    },
    {
        "question_uz": "Loyiha qancha vaqtda topshiriladi?",
        "question_ru": "Сколько времени занимает доставка проекта?",
        "question_en": "How long does project delivery take?",
        "answer_uz": "Loyiha topshirish muddati:\n- Tayyor loyihalar: 1-3 ish kuni\n- Moslashtirish bilan: 1-4 hafta\n- Murakkab integratsiyalar: 1-2 oy\n\nAniq muddat loyihaning murakkabligi va sizning talablaringizga bog'liq. Shartnoma tuzishdan oldin aniq muddat kelishib olinadi.",
        "answer_ru": "Сроки доставки проекта:\n- Готовые проекты: 1-3 рабочих дня\n- С кастомизацией: 1-4 недели\n- Сложные интеграции: 1-2 месяца\n\nТочные сроки зависят от сложности проекта и ваших требований. Конкретные сроки согласовываются до заключения договора.",
        "answer_en": "Project delivery timeline:\n- Ready projects: 1-3 business days\n- With customization: 1-4 weeks\n- Complex integrations: 1-2 months\n\nExact timeline depends on project complexity and your requirements. Specific deadlines are agreed upon before signing the contract.",
        "category": "Xizmatlar",
        "order": 7
    },
    {
        "question_uz": "Loyihaning manba kodini olsam bo'ladimi?",
        "question_ru": "Могу ли я получить исходный код проекта?",
        "question_en": "Can I get the project source code?",
        "answer_uz": "Ha, barcha loyihalar to'liq manba kodi bilan birga topshiriladi. Siz loyihani o'z serverlaringizga o'rnatishingiz, o'zgartirishingiz va rivojlantirishingiz mumkin. Biz hech qanday yashirin cheklovlar qo'ymaymiz. Faqat litsenziya shartlariga muvofiq foydalanishingiz kerak.",
        "answer_ru": "Да, все проекты поставляются с полным исходным кодом. Вы можете установить проект на свои серверы, модифицировать и развивать его. Мы не накладываем никаких скрытых ограничений. Необходимо только соблюдать условия лицензии.",
        "answer_en": "Yes, all projects are delivered with full source code. You can install the project on your own servers, modify and develop it. We don't impose any hidden restrictions. You only need to comply with the license terms.",
        "category": "Litsenziya",
        "order": 8
    },
    {
        "question_uz": "Qaysi texnologiyalar ishlatiladi?",
        "question_ru": "Какие технологии используются?",
        "question_en": "What technologies are used?",
        "answer_uz": "Bizning loyihalarimizda zamonaviy texnologiyalar ishlatiladi:\n\nFrontend: React, Next.js, Vue.js, TypeScript\nBackend: Python (FastAPI, Django), Node.js, PHP\nMobil: React Native, Flutter\nMa'lumotlar bazasi: PostgreSQL, MySQL, MongoDB\nInfrastruktura: Docker, AWS, DigitalOcean\n\nHar bir loyihada ishlatiladigan texnologiyalar loyiha sahifasida ko'rsatilgan.",
        "answer_ru": "В наших проектах используются современные технологии:\n\nFrontend: React, Next.js, Vue.js, TypeScript\nBackend: Python (FastAPI, Django), Node.js, PHP\nМобильные: React Native, Flutter\nБазы данных: PostgreSQL, MySQL, MongoDB\nИнфраструктура: Docker, AWS, DigitalOcean\n\nТехнологии, используемые в каждом проекте, указаны на странице проекта.",
        "answer_en": "Our projects use modern technologies:\n\nFrontend: React, Next.js, Vue.js, TypeScript\nBackend: Python (FastAPI, Django), Node.js, PHP\nMobile: React Native, Flutter\nDatabases: PostgreSQL, MySQL, MongoDB\nInfrastructure: Docker, AWS, DigitalOcean\n\nTechnologies used in each project are listed on the project page.",
        "category": "Texnologiyalar",
        "order": 9
    },
    {
        "question_uz": "Welltech kompaniyasi haqida ko'proq ma'lumot olsam bo'ladimi?",
        "question_ru": "Можно узнать больше о компании Welltech?",
        "question_en": "Can I learn more about Welltech company?",
        "answer_uz": "Welltech - O'zbekistonda yetakchi IT kompaniyalaridan biri. Biz 2019-yildan beri biznes uchun dasturiy ta'minot yechimlarini ishlab chiqamiz. Bizning jamoa 50+ tajribali dasturchidan iborat. Biz 200+ muvaffaqiyatli loyihani amalga oshirganmiz.\n\nBatafsil ma'lumot: welltech.uz\nManzil: Toshkent shahri\nTelefon: +998 90 123 45 67",
        "answer_ru": "Welltech - одна из ведущих IT-компаний в Узбекистане. С 2019 года мы разрабатываем программные решения для бизнеса. Наша команда состоит из 50+ опытных разработчиков. Мы реализовали 200+ успешных проектов.\n\nПодробнее: welltech.uz\nАдрес: город Ташкент\nТелефон: +998 90 123 45 67",
        "answer_en": "Welltech is one of the leading IT companies in Uzbekistan. Since 2019, we have been developing software solutions for businesses. Our team consists of 50+ experienced developers. We have implemented 200+ successful projects.\n\nMore info: welltech.uz\nAddress: Tashkent city\nPhone: +998 90 123 45 67",
        "category": "Kompaniya",
        "order": 10
    }
]

def seed_faq():
    db = SessionLocal()
    try:
        # Mavjud FAQ larni tekshirish
        existing_count = db.query(FAQ).count()
        if existing_count > 0:
            print(f"FAQ jadvalida {existing_count} ta yozuv mavjud. O'chirib qayta qo'shilsinmi? (y/n)")
            answer = input().strip().lower()
            if answer == 'y':
                db.query(FAQ).delete()
                db.commit()
                print("Eski FAQ lar o'chirildi.")
            else:
                print("FAQ lar saqlab qolindi.")
                return

        # Yangi FAQ larni qo'shish
        for data in faq_data:
            faq = FAQ(
                question_uz=data["question_uz"],
                question_ru=data["question_ru"],
                question_en=data["question_en"],
                answer_uz=data["answer_uz"],
                answer_ru=data["answer_ru"],
                answer_en=data["answer_en"],
                category=data["category"],
                order=data["order"]
            )
            db.add(faq)

        db.commit()
        print(f"{len(faq_data)} ta FAQ muvaffaqiyatli qo'shildi!")

    except Exception as e:
        db.rollback()
        print(f"Xatolik: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_faq()
