# AyTix Admin Panel

AyTix loyihasining admin paneli — monorepo (frontend + backend + DB).

## Texnologiyalar

| Qatlam | Texnologiya |
|--------|------------|
| Frontend | Next.js 14, React 18, TypeScript, TailwindCSS |
| Backend | FastAPI, SQLAlchemy 2.0, Pydantic |
| DB | PostgreSQL 16 |
| Auth | JWT (access + refresh token), OTP (Telegram/Email) |
| Deploy | Docker Compose |

## Loyiha strukturasi

```
aytixadmin/
├── docker-compose.yml       # Barcha servislar (db, backend, frontend)
├── .env.example             # Environment o'zgaruvchilar namunasi
├── seed_data/               # SQL seed fayllar (footer, categories, FAQ, ...)
│
├── backend/
│   ├── Dockerfile
│   ├── requirements.txt
│   ├── app/
│   │   ├── main.py          # FastAPI app, middleware, routers
│   │   ├── models.py        # SQLAlchemy modellar (26 ta)
│   │   ├── schemas.py       # Pydantic schemalar
│   │   ├── dependencies.py  # Auth dependency (get_current_user, get_current_admin)
│   │   ├── core/
│   │   │   ├── config.py    # Settings (env dan o'qiladi)
│   │   │   ├── database.py  # DB connection, session
│   │   │   ├── security.py  # JWT, password hashing
│   │   │   └── sanitizer.py # HTML sanitizer
│   │   ├── admin/           # Dashboard statistika
│   │   ├── auth/            # Login, register, OTP, password reset
│   │   ├── users/           # Foydalanuvchi CRUD
│   │   ├── projects/        # Loyihalar CRUD
│   │   ├── categories/      # Kategoriyalar + subkategoriyalar
│   │   ├── content/         # Yangiliklar, bannerlar, bildirishnomalar
│   │   ├── faq/             # Ko'p so'raladigan savollar
│   │   ├── footer/          # Footer bo'limlar, ijtimoiy tarmoqlar, kontaktlar
│   │   ├── messages/        # Aloqa xabarlari
│   │   ├── partners/        # Hamkorlar
│   │   ├── integrations/    # Integratsiyalar
│   │   ├── uploads/         # Rasm/video yuklash
│   │   ├── translate/       # AI tarjima (uz/ru/en)
│   │   ├── ai_features/     # AI xususiyatlari
│   │   ├── site_contacts/   # Sayt kontaktlari
│   │   ├── products/        # Mahsulotlar (marketplace)
│   │   ├── orders/          # Buyurtmalar
│   │   └── stats/           # Statistika
│   ├── scripts/             # Utility skriptlar (runtime emas)
│   │   ├── create_admin.py
│   │   ├── seed_faq.py
│   │   └── update_*.py
│   └── bot/                 # Telegram bot
│
└── frontend/
    ├── Dockerfile
    ├── package.json
    ├── next.config.js        # CSP, security headers, proxy rewrites
    ├── app/
    │   ├── api/v1/[...path]/ # Backend proxy (CSP uchun)
    │   ├── admin/            # Admin panel sahifalar
    │   ├── dashboard/        # Dashboard sahifalar
    │   └── (auth)/           # Login, register, forgot-password
    ├── components/
    │   └── admin/            # Admin panel komponentlari (18 ta)
    ├── lib/api/              # API client modullari (14 ta)
    ├── services/
    │   ├── api.ts            # Axios instance + interceptor + token refresh
    │   └── auth.ts           # Login, logout, register
    ├── hooks/                # React hooks (useAuth, ...)
    ├── contexts/             # React context (Language, ...)
    ├── types/                # TypeScript tiplar
    └── utils/                # Yordamchi funksiyalar
```

## Tez boshlash (lokal)

### 1. Reponi klonlash
```bash
git clone https://github.com/Ikhtiyor-s/aytixadmin.git
cd aytixadmin
```

### 2. Environment sozlash
```bash
cp .env.example .env
# .env faylni tahrirlang (DB parol, SECRET_KEY)
```

### 3. Docker bilan ishga tushirish
```bash
docker compose up -d --build
```

### 4. Admin foydalanuvchi yaratish
```bash
docker exec -it aytix_backend python -c "
from app.core.security import get_password_hash
from app.core.database import SessionLocal
from app.models import User, UserRole
db = SessionLocal()
user = User(
    username='admin',
    email='admin@aytix.uz',
    phone='+998900000000',
    hashed_password=get_password_hash('Admin123!'),
    role=UserRole.ADMIN,
    is_active=True
)
db.add(user)
db.commit()
print('Admin yaratildi')
db.close()
"
```

### 5. Seed ma'lumotlar (ixtiyoriy)
```bash
docker exec -i aytix_db psql -U postgres -d cursor_market < seed_data/footer_seed.sql
docker exec -i aytix_db psql -U postgres -d cursor_market < seed_data/categories_data.sql
```

### 6. Ochish
- **Admin panel**: http://localhost:3004/admin
- **API docs**: http://localhost:8000/docs
- **Login**: admin@aytix.uz / Admin123!

## Serverda yangilash

```bash
cd aytixadmin
git pull origin main
docker rm -f aytix_frontend
docker compose up -d --build frontend
```

Agar backend ham o'zgargan bo'lsa:
```bash
docker compose up -d --build
```

## Production uchun muhim

1. `.env` da `SECRET_KEY` ni o'zgartiring:
```bash
python3 -c "import secrets; print(secrets.token_urlsafe(64))"
```

2. `.env` da `DEBUG=false`, `ALLOW_LOCALHOST=false` qiling

3. PostgreSQL parolini kuchli qiling

## API endpointlar

Barcha endpointlar `/api/v1` prefix bilan:

| Modul | Endpoint | Tavsif |
|-------|----------|--------|
| Auth | `POST /auth/login` | Login (phone + password, form-urlencoded) |
| Auth | `POST /auth/admin/login` | Admin login (username/email + password) |
| Auth | `POST /auth/refresh` | Token yangilash |
| Auth | `POST /auth/register/init` | Ro'yxatdan o'tish (1-qadam) |
| Auth | `POST /auth/request-otp` | OTP so'rash (Telegram/Email) |
| Users | `GET /users/me` | Joriy foydalanuvchi |
| Projects | `GET /projects/` | Loyihalar ro'yxati |
| Projects | `GET /projects/counts` | Loyihalar soni |
| Categories | `GET /project-categories/` | Kategoriyalar |
| Content | `GET /content/banners/public` | Bannerlar (public) |
| Content | `GET /content/notifications/public` | Bildirishnomalar (public) |
| FAQ | `GET /faq/public` | FAQ (public) |
| Footer | `GET /footer/public` | Footer ma'lumotlari (public) |
| Partners | `GET /partners/public` | Hamkorlar (public) |
| Messages | `POST /messages/` | Xabar yuborish |
| Uploads | `POST /uploads/image` | Rasm yuklash |
| Uploads | `POST /uploads/video` | Video yuklash |
| Admin | `GET /admin/stats` | Dashboard statistika |

To'liq API hujjatlar: `http://localhost:8000/docs`

## Arxitektura

```
[Browser] → [Next.js Frontend :3004]
                 ↓ (proxy /api/v1/*)
            [FastAPI Backend :8000]
                 ↓
            [PostgreSQL :5432]
```

- Frontend barcha API so'rovlarni `/api/v1/*` orqali proxy qiladi (CSP himoyasi)
- Backend JWT token bilan autentifikatsiya (access + refresh)
- Axios interceptor avtomatik token qo'shadi va 401 da refresh qiladi
- Rasm/videolar `uploads/` papkasida saqlanadi (Docker volume)

## Xavfsizlik

- Sirlar `.env` da (git'ga kirmaydi)
- Cookie: `secure`, `sameSite: strict`
- XSS himoya: DOMPurify, CSP headerlar
- CSRF himoya: Origin tekshiruvi
- Upload: Magic bytes + fayl turi + hajm tekshiruvi
- Rate limiting: Login, OTP, register endpointlar
- Parol: bcrypt hashing
- API proxy: Header whitelist
