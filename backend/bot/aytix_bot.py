"""
AyTiX Telegram Bot
OTP yuborish uchun foydalanuvchi telefon raqamini chat_id bilan bog'lash

Ishga tushirish: python -m bot.aytix_bot
"""

import asyncio
import logging
import re
import sys
import os

# Add parent directory to path for imports
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from telegram import Update, ReplyKeyboardMarkup, KeyboardButton, ReplyKeyboardRemove
from telegram.ext import Application, CommandHandler, MessageHandler, filters, ContextTypes

from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app.core.config import settings
from app.models import TelegramUser

# Logging sozlash
logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    level=logging.INFO
)
logger = logging.getLogger(__name__)

# Bot token
BOT_TOKEN = settings.TELEGRAM_BOT_TOKEN


def normalize_phone(phone: str) -> str:
    """Telefon raqamini +998XXXXXXXXX formatga keltirish"""
    # Faqat raqamlarni olish
    digits = re.sub(r'\D', '', phone)

    # 998 bilan boshlanmasa, qo'shish
    if digits.startswith('998'):
        return f'+{digits}'
    elif digits.startswith('8') and len(digits) == 10:
        return f'+998{digits[1:]}'
    elif len(digits) == 9:
        return f'+998{digits}'
    else:
        return f'+{digits}'


def get_db():
    """Database sessiyasini olish"""
    db = SessionLocal()
    try:
        return db
    except:
        db.close()
        raise


async def start_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """
    /start komandasi - telefon raqamni so'rash
    """
    user = update.effective_user

    # Kontakt yuborish tugmasini yaratish
    keyboard = [
        [KeyboardButton("Raqamni yuborish", request_contact=True)]
    ]
    reply_markup = ReplyKeyboardMarkup(keyboard, resize_keyboard=True, one_time_keyboard=True)

    welcome_text = f"""Assalomu alaykum, {user.first_name or 'foydalanuvchi'}!

AyTiX saytidan OTP kod olish uchun telefon raqamingizni yuboring.

Quyidagi tugmani bosing:"""

    await update.message.reply_text(
        welcome_text,
        reply_markup=reply_markup
    )


async def contact_handler(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """
    Kontakt yuborilganda - telefon raqamini saqlash
    """
    contact = update.message.contact
    user = update.effective_user

    # Kontakt foydalanuvchining o'ziniki ekanligini tekshirish
    if contact.user_id != user.id:
        await update.message.reply_text(
            "Iltimos, faqat o'z telefon raqamingizni yuboring!",
            reply_markup=ReplyKeyboardRemove()
        )
        return

    # Telefon raqamini normalizatsiya qilish
    phone = normalize_phone(contact.phone_number)
    chat_id = str(user.id)

    logger.info(f"Yangi kontakt: phone={phone}, chat_id={chat_id}, user={user.first_name}")

    # Bazaga saqlash
    db = get_db()
    try:
        # Mavjud yozuvni tekshirish (telefon yoki chat_id bo'yicha)
        existing_by_phone = db.query(TelegramUser).filter(TelegramUser.phone == phone).first()
        existing_by_chat = db.query(TelegramUser).filter(TelegramUser.chat_id == chat_id).first()

        if existing_by_phone:
            # Telefon mavjud - yangilash
            existing_by_phone.chat_id = chat_id
            existing_by_phone.telegram_username = user.username
            existing_by_phone.first_name = user.first_name
            existing_by_phone.last_name = user.last_name
            existing_by_phone.is_active = True
            db.commit()
            logger.info(f"Mavjud yozuv yangilandi: phone={phone}")
        elif existing_by_chat:
            # Chat ID mavjud, lekin boshqa telefon bilan - yangilash
            existing_by_chat.phone = phone
            existing_by_chat.telegram_username = user.username
            existing_by_chat.first_name = user.first_name
            existing_by_chat.last_name = user.last_name
            existing_by_chat.is_active = True
            db.commit()
            logger.info(f"Mavjud yozuv yangilandi: chat_id={chat_id}")
        else:
            # Yangi yozuv
            telegram_user = TelegramUser(
                phone=phone,
                chat_id=chat_id,
                telegram_username=user.username,
                first_name=user.first_name,
                last_name=user.last_name,
                is_active=True
            )
            db.add(telegram_user)
            db.commit()
            logger.info(f"Yangi yozuv yaratildi: phone={phone}, chat_id={chat_id}")

        success_text = f"""Raqamingiz saqlandi: {phone}

Endi AyTiX saytida parolni tiklash bo'limiga o'ting.
OTP kod shu yerga keladi."""

        await update.message.reply_text(
            success_text,
            reply_markup=ReplyKeyboardRemove()
        )

    except Exception as e:
        logger.error(f"Xatolik: {e}")
        db.rollback()
        await update.message.reply_text(
            "Xatolik yuz berdi. Qayta urinib ko'ring.",
            reply_markup=ReplyKeyboardRemove()
        )
    finally:
        db.close()


async def help_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """
    /help komandasi - yordam
    """
    help_text = """AyTiX Bot

Bu bot orqali parolni tiklash uchun OTP kod olasiz.

/start - Raqamni ulash
/help - Yordam"""

    await update.message.reply_text(help_text)


async def unknown_message(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """
    Noma'lum xabarlar uchun javob
    """
    await update.message.reply_text(
        "Tushunmadim. /start bosing."
    )


def main():
    """Bot ni ishga tushirish"""
    logger.info("AyTiX Bot ishga tushmoqda...")

    # Application yaratish
    application = Application.builder().token(BOT_TOKEN).build()

    # Handlerlar
    application.add_handler(CommandHandler("start", start_command))
    application.add_handler(CommandHandler("help", help_command))
    application.add_handler(MessageHandler(filters.CONTACT, contact_handler))
    application.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, unknown_message))

    # Bot ni ishga tushirish
    logger.info("Bot tayyor! Polling boshlanmoqda...")
    application.run_polling(allowed_updates=Update.ALL_TYPES)


if __name__ == '__main__':
    main()
