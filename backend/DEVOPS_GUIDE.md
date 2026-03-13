# AyTiX Backend - DevOps Qo'llanma

## Tezkor Yangilash (Production Server)

```bash
# 1. Serverga kirish
ssh user@api.aytix.uz

# 2. Loyiha papkasiga o'tish
cd /var/www/aytixmarketbackend

# 3. Yangilanishlarni olish
git pull origin main

# 4. Backend ni qayta ishga tushirish
pm2 restart aytix-backend
# yoki
systemctl restart aytix-backend
```

---

## Birinchi Marta O'rnatish

### 1. Server Tayyorlash

```bash
# Ubuntu/Debian
sudo apt update && sudo apt upgrade -y
sudo apt install -y python3 python3-pip python3-venv postgresql nginx git
```

### 2. PostgreSQL Sozlash

```bash
# PostgreSQL ga kirish
sudo -u postgres psql

# Database va user yaratish
CREATE DATABASE cursor_market;
CREATE USER aytix_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE cursor_market TO aytix_user;
\q
```

### 3. Loyihani Klonlash

```bash
cd /var/www
git clone https://github.com/Ikhtiyor-s/aytixmarketbackend.git
cd aytixmarketbackend
```

### 4. Virtual Environment

```bash
python3 -m venv venv
source venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
```

### 5. Environment Sozlash

```bash
cp .env.example .env
nano .env
```

**.env faylini to'ldirish:**
```env
DATABASE_URL=postgresql://aytix_user:your_secure_password@localhost:5432/cursor_market
SECRET_KEY=<64 belgili tasodifiy kalit>
DEBUG=false
TELEGRAM_BOT_TOKEN=<telegram bot token>
```

**SECRET_KEY generatsiya qilish:**
```bash
python3 -c "import secrets; print(secrets.token_urlsafe(64))"
```

### 6. Database Migration

```bash
psql -U aytix_user -d cursor_market -f migrations/001_create_all_tables.sql
```

### 7. PM2 bilan Ishga Tushirish

```bash
# PM2 o'rnatish
sudo npm install -g pm2

# Backend ni ishga tushirish
pm2 start "source /var/www/aytixmarketbackend/venv/bin/activate && uvicorn app.main:app --host 0.0.0.0 --port 8000" --name aytix-backend

# Auto-start sozlash
pm2 save
pm2 startup
```

### 8. Nginx Konfiguratsiya

```bash
sudo nano /etc/nginx/sites-available/api.aytix.uz
```

```nginx
server {
    listen 80;
    server_name api.aytix.uz;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name api.aytix.uz;

    ssl_certificate /etc/letsencrypt/live/api.aytix.uz/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.aytix.uz/privkey.pem;

    client_max_body_size 50M;

    # Static files
    location /uploads {
        alias /var/www/aytixmarketbackend/uploads;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    # API
    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 300;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/api.aytix.uz /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 9. SSL Sertifikat (Let's Encrypt)

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d api.aytix.uz
```

---

## Kundalik Operatsiyalar

### Loglarni Ko'rish
```bash
# PM2 loglar
pm2 logs aytix-backend

# Real-time
pm2 logs aytix-backend --lines 100

# Nginx loglar
tail -f /var/log/nginx/error.log
```

### Status Tekshirish
```bash
# PM2 status
pm2 status

# Health check
curl https://api.aytix.uz/health
```

### Qayta Ishga Tushirish
```bash
# Soft restart
pm2 reload aytix-backend

# Hard restart
pm2 restart aytix-backend
```

---

## Muammolarni Hal Qilish

### CORS Xatolik
Backend da custom CORS middleware qo'shilgan. Agar hali ham xatolik bo'lsa:
1. Nginx CORS headerlarni o'chirmasligini tekshiring
2. Browser console da aniq xatolikni ko'ring

### Database Ulanish
```bash
# Ulanishni tekshirish
psql -U aytix_user -d cursor_market -c "SELECT 1;"

# Jadvallarni ko'rish
psql -U aytix_user -d cursor_market -c "\dt"
```

### Upload Fayllar Ko'rinmasa
```bash
# Huquqlarni tekshirish
ls -la /var/www/aytixmarketbackend/uploads/

# Huquqlarni to'g'rilash
sudo chown -R www-data:www-data /var/www/aytixmarketbackend/uploads/
sudo chmod -R 755 /var/www/aytixmarketbackend/uploads/
```

---

## Muhim Fayllar

| Fayl | Vazifasi |
|------|----------|
| `.env` | Environment o'zgaruvchilari |
| `app/main.py` | Asosiy FastAPI ilova |
| `app/core/config.py` | Sozlamalar |
| `migrations/` | Database migratsiyalar |
| `uploads/` | Yuklangan fayllar |

---

## Kontaktlar

Muammo bo'lsa:
- GitHub Issues: https://github.com/Ikhtiyor-s/aytixmarketbackend/issues
- API Docs: https://api.aytix.uz/docs
