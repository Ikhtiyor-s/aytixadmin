#!/bin/bash
# ===========================================
# AyTiX Marketplace Backend - Deployment Script
# ===========================================

set -e

echo "=========================================="
echo "AyTiX Marketplace Backend Deployment"
echo "=========================================="

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    echo -e "${YELLOW}Warning: Not running as root. Some operations may fail.${NC}"
fi

# Step 1: Pull latest changes
echo -e "${GREEN}[1/6] Pulling latest changes from git...${NC}"
git pull origin main

# Step 2: Create virtual environment if not exists
if [ ! -d "venv" ]; then
    echo -e "${GREEN}[2/6] Creating virtual environment...${NC}"
    python3 -m venv venv
else
    echo -e "${GREEN}[2/6] Virtual environment exists, skipping...${NC}"
fi

# Step 3: Activate venv and install dependencies
echo -e "${GREEN}[3/6] Installing dependencies...${NC}"
source venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt

# Step 4: Check .env file
if [ ! -f ".env" ]; then
    echo -e "${RED}[ERROR] .env file not found!${NC}"
    echo "Please copy .env.example to .env and configure it:"
    echo "  cp .env.example .env"
    echo "  nano .env"
    exit 1
fi
echo -e "${GREEN}[4/6] .env file found${NC}"

# Step 5: Run database migrations
echo -e "${GREEN}[5/6] Running database migrations...${NC}"
if [ -f "migrations/001_create_all_tables.sql" ]; then
    echo "Migration file found. Run manually if needed:"
    echo "  psql -U your_user -d your_db -f migrations/001_create_all_tables.sql"
fi

# Step 6: Create upload directories
echo -e "${GREEN}[6/6] Creating upload directories...${NC}"
mkdir -p uploads/images
mkdir -p uploads/videos
chmod -R 755 uploads/

# Restart service
echo ""
echo -e "${GREEN}=========================================="
echo "Deployment completed successfully!"
echo "==========================================${NC}"
echo ""
echo "To start the server:"
echo "  source venv/bin/activate"
echo "  uvicorn app.main:app --host 0.0.0.0 --port 8000"
echo ""
echo "Or with PM2:"
echo "  pm2 restart aytix-backend"
echo ""
echo "API Documentation: http://your-domain:8000/docs"
echo ""
