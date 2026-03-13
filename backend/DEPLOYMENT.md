# AyTiX Marketplace Backend - Deployment Guide

## Quick Deployment (Production Server)

```bash
# 1. Pull latest changes
git pull origin main

# 2. Run deployment script
chmod +x deploy.sh
./deploy.sh

# 3. Restart the service
pm2 restart aytix-backend
# or
systemctl restart aytix-backend
```

## First Time Setup

### 1. Clone Repository
```bash
git clone https://github.com/your-repo/aytixmarketbackend.git
cd aytixmarketbackend
```

### 2. Create Virtual Environment
```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### 3. Configure Environment
```bash
cp .env.example .env
nano .env
```

Required environment variables:
- `DATABASE_URL` - PostgreSQL connection string
- `SECRET_KEY` - JWT secret (generate with `python -c "import secrets; print(secrets.token_urlsafe(64))"`)
- `TELEGRAM_BOT_TOKEN` - Telegram bot token

### 4. Database Setup
```bash
# Create database
sudo -u postgres createdb aytix_market

# Run migrations
psql -U postgres -d aytix_market -f migrations/001_create_all_tables.sql

# Optional: Insert sample data
psql -U postgres -d aytix_market -f data_inserts_fixed.sql
```

### 5. Create Upload Directories
```bash
mkdir -p uploads/images uploads/videos
chmod -R 755 uploads/
```

### 6. Start Server

**Development:**
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Production with PM2:**
```bash
pm2 start "uvicorn app.main:app --host 0.0.0.0 --port 8000" --name aytix-backend
pm2 save
pm2 startup
```

**Production with systemd:**
```bash
# Create service file
sudo nano /etc/systemd/system/aytix-backend.service
```

```ini
[Unit]
Description=AyTiX Marketplace Backend
After=network.target

[Service]
User=www-data
Group=www-data
WorkingDirectory=/var/www/aytixmarketbackend
Environment="PATH=/var/www/aytixmarketbackend/venv/bin"
ExecStart=/var/www/aytixmarketbackend/venv/bin/uvicorn app.main:app --host 0.0.0.0 --port 8000
Restart=always

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reload
sudo systemctl enable aytix-backend
sudo systemctl start aytix-backend
```

## Nginx Configuration

```nginx
server {
    listen 80;
    server_name api.aytix.uz;

    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name api.aytix.uz;

    ssl_certificate /etc/letsencrypt/live/api.aytix.uz/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.aytix.uz/privkey.pem;

    # Upload size limit
    client_max_body_size 50M;

    # Static files (uploads)
    location /uploads {
        alias /var/www/aytixmarketbackend/uploads;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    # API proxy
    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 300;
        proxy_connect_timeout 300;
        proxy_send_timeout 300;
    }
}
```

## API Endpoints

| Endpoint | Description |
|----------|-------------|
| `/docs` | Swagger UI documentation |
| `/redoc` | ReDoc documentation |
| `/health` | Health check |
| `/api/v1/auth/*` | Authentication |
| `/api/v1/users/*` | User management |
| `/api/v1/products/*` | Products |
| `/api/v1/projects/*` | Projects |
| `/api/v1/categories/*` | Categories |
| `/api/v1/orders/*` | Orders |
| `/api/v1/content/*` | Banners, News, Notifications |
| `/api/v1/messages/*` | Contact messages |
| `/api/v1/partners/*` | Partners |
| `/api/v1/integrations/*` | Integrations |
| `/api/v1/uploads/*` | File uploads |

## Troubleshooting

### CORS Errors
The backend includes custom CORS middleware. If you still see CORS errors:
1. Check if the domain is in `CORS_ORIGINS` in `app/core/config.py`
2. Verify Nginx is not stripping headers
3. Check browser console for specific error messages

### Database Connection
```bash
# Test connection
psql -U postgres -d aytix_market -c "SELECT 1;"

# Check if tables exist
psql -U postgres -d aytix_market -c "\dt"
```

### Logs
```bash
# PM2 logs
pm2 logs aytix-backend

# Systemd logs
journalctl -u aytix-backend -f

# Uvicorn logs
tail -f /var/log/aytix-backend.log
```

## Updates

To update the backend:
```bash
git pull origin main
source venv/bin/activate
pip install -r requirements.txt
pm2 restart aytix-backend
```
