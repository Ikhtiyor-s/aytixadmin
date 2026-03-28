"""
TelegramUser jadvalini yaratish uchun skript
Ishga tushirish: python create_telegram_table.py
"""

import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.core.database import engine, Base
from app.models import TelegramUser

def create_tables():
    """Jadvallarni yaratish"""
    print("TelegramUser jadvalini yaratish...")
    Base.metadata.create_all(bind=engine)
    print("Jadval muvaffaqiyatli yaratildi!")

if __name__ == "__main__":
    create_tables()
