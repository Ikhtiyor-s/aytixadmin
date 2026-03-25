from fastapi import APIRouter, Depends, HTTPException, status, Form, Request
from fastapi.responses import JSONResponse
from slowapi import Limiter
from slowapi.util import get_remote_address
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import verify_password, get_password_hash, create_access_token, create_refresh_token, decode_token
from app.models import User, UserRole, OTPRequest as OTPRequestModel, PasswordReset, TelegramUser
from app.schemas import (
    UserCreate, UserResponse, Token, RefreshTokenRequest,
    OTPRequest, OTPVerify, PasswordResetRequest, OTPResponse,
    TelegramStatusRequest, TelegramStatusResponse,
    RegisterInitRequest, RegisterInitResponse, RegisterVerifyOTPRequest, RegisterCompleteRequest
)
from datetime import timedelta, datetime
from app.core.config import settings
from collections import defaultdict
import random
import string
import hashlib
import httpx
import re
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/auth", tags=["auth"])

# Rate limiter
limiter = Limiter(key_func=get_remote_address)

# OTP sozlamalari
OTP_EXPIRY_SECONDS = 60  # 1 daqiqa
MAX_OTP_ATTEMPTS = 3  # Maksimal noto'g'ri urinish
BLOCK_DURATION_MINUTES = 15  # Bloklash davomiyligi
MAX_REQUESTS_PER_HOUR = 3  # Soatiga maksimal OTP so'rov

# Login brute force himoyasi
MAX_LOGIN_ATTEMPTS = 50  # Maksimal xato urinish
LOGIN_BLOCK_MINUTES = 15  # Bloklash davomiyligi
_login_attempts: dict = defaultdict(lambda: {"count": 0, "blocked_until": None})


def check_login_rate_limit(identifier: str):
    """Login urinishlarini tekshirish."""
    now = datetime.utcnow()
    record = _login_attempts[identifier]

    # Blok muddati o'tganini tekshirish
    if record["blocked_until"] and record["blocked_until"] <= now:
        record["count"] = 0
        record["blocked_until"] = None

    # Bloklangan bo'lsa
    if record["blocked_until"] and record["blocked_until"] > now:
        remaining = (record["blocked_until"] - now).seconds // 60 + 1
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail=f"Juda ko'p urinish. {remaining} daqiqadan keyin qayta urinib ko'ring."
        )


def record_failed_login(identifier: str):
    """Muvaffaqiyatsiz login urinishini qayd etish."""
    now = datetime.utcnow()
    record = _login_attempts[identifier]
    record["count"] += 1

    if record["count"] >= MAX_LOGIN_ATTEMPTS:
        record["blocked_until"] = now + timedelta(minutes=LOGIN_BLOCK_MINUTES)
        logger.warning(f"Login bloklandi: {identifier} ({MAX_LOGIN_ATTEMPTS} xato urinish)")


def reset_login_attempts(identifier: str):
    """Muvaffaqiyatli logindan keyin urinishlarni tozalash."""
    if identifier in _login_attempts:
        del _login_attempts[identifier]


def generate_otp() -> str:
    """6 xonali tasodifiy OTP kod yaratish"""
    return ''.join(random.choices(string.digits, k=6))


def hash_otp(otp_code: str) -> str:
    """OTP kodni hash qilish (DBda plaintext saqlamaslik uchun)."""
    return hashlib.sha256(otp_code.encode()).hexdigest()


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


def send_otp_telegram(phone: str, otp_code: str, db: Session) -> bool:
    """Telegram orqali OTP yuborish"""
    # Telefon raqamini normalizatsiya qilish
    normalized_phone = normalize_phone(phone)

    # Telegram foydalanuvchisini topish
    telegram_user = db.query(TelegramUser).filter(
        TelegramUser.phone == normalized_phone,
        TelegramUser.is_active == True
    ).first()

    if not telegram_user:
        logger.warning(f"Telegram foydalanuvchi topilmadi: {normalized_phone}")
        return False

    # Telegram Bot API orqali xabar yuborish
    try:
        bot_token = settings.TELEGRAM_BOT_TOKEN
        chat_id = telegram_user.chat_id

        message = f"""
🔐 *AyTiX - Parolni tiklash*

Sizning OTP kodingiz:

`{otp_code}`

⏱ Kod 1 daqiqa ichida amal qiladi.

⚠️ Bu kodni hech kimga bermang!
"""

        url = f"https://api.telegram.org/bot{bot_token}/sendMessage"
        payload = {
            "chat_id": chat_id,
            "text": message,
            "parse_mode": "Markdown"
        }

        with httpx.Client() as client:
            response = client.post(url, json=payload, timeout=10.0)
            response_data = response.json()

            if response_data.get("ok"):
                logger.info(f"OTP yuborildi: phone={normalized_phone}, chat_id={chat_id}")
                return True
            else:
                logger.error(f"Telegram xatolik: {response_data}")
                return False

    except Exception as e:
        logger.error(f"Telegram OTP yuborishda xatolik: {e}")
        return False


def send_otp_email(email: str, otp_code: str) -> bool:
    """Email orqali OTP yuborish (hozircha mock)"""
    # TODO: SMTP orqali email yuborish
    logger.info(f"[EMAIL] OTP sent to {email}")
    return True


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
@limiter.limit("3/minute")
def register(request: Request, user_data: UserCreate, db: Session = Depends(get_db)):
    """Register a new user."""
    # Check if user already exists
    db_user = db.query(User).filter(
        (User.phone == user_data.phone) | (User.username == user_data.username)
    ).first()
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Phone or username already registered"
        )

    # Create new user
    hashed_password = get_password_hash(user_data.password)
    db_user = User(
        phone=user_data.phone,
        username=user_data.username,
        full_name=user_data.full_name,
        first_name=user_data.first_name,
        last_name=user_data.last_name,
        email=user_data.email,
        hashed_password=hashed_password,
        role=UserRole.USER
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


@router.post("/login", response_model=Token)
def login(request: Request, phone: str = Form(...), password: str = Form(...), db: Session = Depends(get_db)):
    """Login and get access token."""
    client_ip = request.client.host if request.client else "unknown"
    rate_key = f"login:{client_ip}:{phone}"

    # Brute force tekshirish
    check_login_rate_limit(rate_key)

    user = db.query(User).filter(User.phone == phone).first()
    if not user or not verify_password(password, user.hashed_password):
        record_failed_login(rate_key)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect phone or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Inactive user"
        )

    # Muvaffaqiyatli login - urinishlarni tozalash
    reset_login_attempts(rate_key)

    # Create tokens
    access_token = create_access_token(data={"sub": str(user.id), "username": user.username})
    refresh_token = create_refresh_token(data={"sub": str(user.id), "username": user.username})

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer"
    }


@router.post("/admin/login", response_model=Token)
@limiter.limit("60/minute")
def admin_login(request: Request, username: str = Form(...), password: str = Form(...), db: Session = Depends(get_db)):
    """Admin panel uchun login endpoint - faqat ADMIN roli bo'lgan foydalanuvchilar kirishi mumkin."""
    client_ip = request.client.host if request.client else "unknown"
    rate_key = f"admin_login:{client_ip}:{username}"

    # Brute force tekshirish
    check_login_rate_limit(rate_key)

    # Username, phone yoki email orqali qidirish
    user = db.query(User).filter(
        (User.username == username) | (User.phone == username) | (User.email == username)
    ).first()

    if not user or not verify_password(password, user.hashed_password):
        record_failed_login(rate_key)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Login yoki parol noto'g'ri",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Foydalanuvchi faol emas"
        )

    # Admin rolini tekshirish
    if user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin huquqi yo'q. Faqat adminlar kirishi mumkin."
        )

    # Muvaffaqiyatli login
    reset_login_attempts(rate_key)

    # Create tokens
    access_token = create_access_token(data={"sub": str(user.id), "username": user.username, "role": "admin"})
    refresh_token = create_refresh_token(data={"sub": str(user.id), "username": user.username, "role": "admin"})

    logger.info(f"Admin login: {user.username} [{client_ip}]")
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer"
    }


@router.post("/refresh", response_model=Token)
def refresh_token(token_data: RefreshTokenRequest, db: Session = Depends(get_db)):
    """Refresh access token using refresh token."""
    payload = decode_token(token_data.refresh_token)
    
    if payload is None or payload.get("type") != "refresh":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    user_id = payload.get("sub")
    user = db.query(User).filter(User.id == user_id).first()
    
    if not user or not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Create new tokens
    access_token = create_access_token(data={"sub": str(user.id), "username": user.username})
    refresh_token = create_refresh_token(data={"sub": str(user.id), "username": user.username})

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer"
    }


@router.post("/request-otp", response_model=OTPResponse)
@limiter.limit("3/minute")
def request_otp(request: Request, data: OTPRequest, db: Session = Depends(get_db)):
    """OTP kod so'rash (parolni tiklash uchun)"""
    now = datetime.utcnow()

    # Method va identifikator tekshirish
    if data.method == "telegram":
        if not data.phone:
            raise HTTPException(status_code=400, detail="Telefon raqam kiritilmagan")
        identifier = data.phone
        identifier_field = "phone"
    elif data.method == "email":
        if not data.email:
            raise HTTPException(status_code=400, detail="Email kiritilmagan")
        identifier = data.email
        identifier_field = "email"
    else:
        raise HTTPException(status_code=400, detail="Noto'g'ri method")

    # Foydalanuvchi mavjudligini tekshirish
    if identifier_field == "phone":
        normalized_phone = normalize_phone(identifier)
        user = db.query(User).filter(User.phone == normalized_phone).first()
    else:
        user = db.query(User).filter(User.email == identifier).first()

    if not user:
        # User enumeration oldini olish - generic xabar qaytarish
        return OTPResponse(
            success=True,
            message=f"OTP kod {'Telegram orqali yuborildi' if identifier_field == 'phone' else 'emailingizga yuborildi'}",
            expires_in=OTP_EXPIRY_SECONDS
        )

    # Rate limiting: soatiga maksimal so'rovlar
    one_hour_ago = now - timedelta(hours=1)
    if identifier_field == "phone":
        recent_requests = db.query(OTPRequestModel).filter(
            OTPRequestModel.phone == identifier,
            OTPRequestModel.created_at > one_hour_ago
        ).count()
    else:
        recent_requests = db.query(OTPRequestModel).filter(
            OTPRequestModel.email == identifier,
            OTPRequestModel.created_at > one_hour_ago
        ).count()

    if recent_requests >= MAX_REQUESTS_PER_HOUR:
        raise HTTPException(
            status_code=429,
            detail=f"Soatiga {MAX_REQUESTS_PER_HOUR} ta OTP so'rash mumkin. Keyinroq urinib ko'ring."
        )

    # Bloklangan yoki yo'qligini tekshirish
    if identifier_field == "phone":
        last_otp = db.query(OTPRequestModel).filter(
            OTPRequestModel.phone == identifier,
            OTPRequestModel.blocked_until != None,
            OTPRequestModel.blocked_until > now
        ).first()
    else:
        last_otp = db.query(OTPRequestModel).filter(
            OTPRequestModel.email == identifier,
            OTPRequestModel.blocked_until != None,
            OTPRequestModel.blocked_until > now
        ).first()

    if last_otp:
        remaining = (last_otp.blocked_until - now).seconds // 60
        raise HTTPException(
            status_code=429,
            detail=f"Hisob bloklangan. {remaining} daqiqadan keyin qayta urinib ko'ring."
        )

    # OTP yaratish
    otp_code = generate_otp()
    expires_at = now + timedelta(seconds=OTP_EXPIRY_SECONDS)

    # OTP saqlash (hash qilib)
    otp_record = OTPRequestModel(
        phone=data.phone if identifier_field == "phone" else None,
        email=data.email if identifier_field == "email" else None,
        otp_code=hash_otp(otp_code),
        expires_at=expires_at
    )
    db.add(otp_record)
    db.commit()

    # OTP yuborish
    if identifier_field == "phone":
        # Telegram foydalanuvchisini tekshirish
        normalized_phone = normalize_phone(identifier)
        telegram_user = db.query(TelegramUser).filter(
            TelegramUser.phone == normalized_phone,
            TelegramUser.is_active == True
        ).first()

        if not telegram_user:
            # OTP yozuvini o'chirish
            db.delete(otp_record)
            db.commit()
            raise HTTPException(
                status_code=400,
                detail="Telegram bot orqali ro'yxatdan o'tmagansiz. Iltimos, avval @aytix_bot ga o'ting."
            )

        success = send_otp_telegram(identifier, otp_code, db)
        if not success:
            db.delete(otp_record)
            db.commit()
            raise HTTPException(
                status_code=500,
                detail="OTP yuborishda xatolik yuz berdi. Iltimos, qayta urinib ko'ring."
            )
    else:
        send_otp_email(identifier, otp_code)

    return OTPResponse(
        success=True,
        message=f"OTP kod {'Telegram orqali yuborildi' if identifier_field == 'phone' else 'emailingizga yuborildi'}",
        expires_in=OTP_EXPIRY_SECONDS
    )


@router.post("/verify-otp", response_model=OTPResponse)
def verify_otp(data: OTPVerify, db: Session = Depends(get_db)):
    """OTP kodni tasdiqlash"""
    now = datetime.utcnow()

    # Method va identifikator tekshirish
    if data.method == "telegram":
        if not data.phone:
            raise HTTPException(status_code=400, detail="Telefon raqam kiritilmagan")
        identifier_field = "phone"
        otp_record = db.query(OTPRequestModel).filter(
            OTPRequestModel.phone == data.phone,
            OTPRequestModel.is_used == False,
            OTPRequestModel.expires_at > now
        ).order_by(OTPRequestModel.created_at.desc()).first()
    elif data.method == "email":
        if not data.email:
            raise HTTPException(status_code=400, detail="Email kiritilmagan")
        identifier_field = "email"
        otp_record = db.query(OTPRequestModel).filter(
            OTPRequestModel.email == data.email,
            OTPRequestModel.is_used == False,
            OTPRequestModel.expires_at > now
        ).order_by(OTPRequestModel.created_at.desc()).first()
    else:
        raise HTTPException(status_code=400, detail="Noto'g'ri method")

    if not otp_record:
        raise HTTPException(status_code=400, detail="OTP kod topilmadi yoki muddati o'tgan")

    # Bloklangan yoki yo'qligini tekshirish
    if otp_record.blocked_until and otp_record.blocked_until > now:
        remaining = (otp_record.blocked_until - now).seconds // 60
        raise HTTPException(
            status_code=429,
            detail=f"Hisob bloklangan. {remaining} daqiqadan keyin qayta urinib ko'ring."
        )

    # OTP tekshirish (hash bilan taqqoslash)
    if otp_record.otp_code != hash_otp(data.otp_code):
        otp_record.attempts += 1

        if otp_record.attempts >= MAX_OTP_ATTEMPTS:
            otp_record.blocked_until = now + timedelta(minutes=BLOCK_DURATION_MINUTES)
            db.commit()
            raise HTTPException(
                status_code=429,
                detail=f"{MAX_OTP_ATTEMPTS} marta xato kiritdingiz. {BLOCK_DURATION_MINUTES} daqiqadan keyin qayta urinib ko'ring."
            )

        db.commit()
        remaining_attempts = MAX_OTP_ATTEMPTS - otp_record.attempts
        raise HTTPException(
            status_code=400,
            detail=f"Noto'g'ri kod! {remaining_attempts} ta urinish qoldi"
        )

    # OTP to'g'ri - ishlatilgan deb belgilash
    otp_record.is_used = True
    db.commit()

    return OTPResponse(
        success=True,
        message="OTP kod tasdiqlandi"
    )


@router.post("/reset-password", response_model=OTPResponse)
def reset_password(data: PasswordResetRequest, db: Session = Depends(get_db)):
    """Parolni qayta tiklash"""
    now = datetime.utcnow()

    # Parollarni tekshirish
    if data.new_password != data.confirm_password:
        raise HTTPException(status_code=400, detail="Parollar mos kelmayapti")

    if len(data.new_password) < 8:
        raise HTTPException(status_code=400, detail="Parol kamida 8 ta belgidan iborat bo'lishi kerak")

    # Parolda katta harf, kichik harf va raqam borligini tekshirish
    has_upper = any(c.isupper() for c in data.new_password)
    has_lower = any(c.islower() for c in data.new_password)
    has_digit = any(c.isdigit() for c in data.new_password)

    if not (has_upper and has_lower and has_digit):
        raise HTTPException(
            status_code=400,
            detail="Parolda kamida bitta katta harf, kichik harf va raqam bo'lishi kerak"
        )

    # Method va identifikator tekshirish
    if data.method == "telegram":
        if not data.phone:
            raise HTTPException(status_code=400, detail="Telefon raqam kiritilmagan")
        user = db.query(User).filter(User.phone == data.phone).first()
        otp_record = db.query(OTPRequestModel).filter(
            OTPRequestModel.phone == data.phone,
            OTPRequestModel.otp_code == hash_otp(data.otp_code),
            OTPRequestModel.is_used == True,
            OTPRequestModel.expires_at > now - timedelta(minutes=5)
        ).order_by(OTPRequestModel.created_at.desc()).first()
    elif data.method == "email":
        if not data.email:
            raise HTTPException(status_code=400, detail="Email kiritilmagan")
        user = db.query(User).filter(User.email == data.email).first()
        otp_record = db.query(OTPRequestModel).filter(
            OTPRequestModel.email == data.email,
            OTPRequestModel.otp_code == hash_otp(data.otp_code),
            OTPRequestModel.is_used == True,
            OTPRequestModel.expires_at > now - timedelta(minutes=5)
        ).order_by(OTPRequestModel.created_at.desc()).first()
    else:
        raise HTTPException(status_code=400, detail="Noto'g'ri method")

    if not user:
        raise HTTPException(status_code=404, detail="Foydalanuvchi topilmadi")

    if not otp_record:
        raise HTTPException(status_code=400, detail="OTP kod tasdiqlanmagan yoki muddati o'tgan")

    # Parolni yangilash
    user.hashed_password = get_password_hash(data.new_password)
    db.commit()

    return OTPResponse(
        success=True,
        message="Parol muvaffaqiyatli yangilandi"
    )


@router.post("/check-telegram-status", response_model=TelegramStatusResponse)
def check_telegram_status(data: TelegramStatusRequest, db: Session = Depends(get_db)):
    """Telefon raqam Telegram botga ulanganligini tekshirish"""
    # Telefon raqamini normalizatsiya qilish
    normalized_phone = normalize_phone(data.phone)

    # Telegram foydalanuvchisini topish
    telegram_user = db.query(TelegramUser).filter(
        TelegramUser.phone == normalized_phone,
        TelegramUser.is_active == True
    ).first()

    if telegram_user:
        return TelegramStatusResponse(
            is_connected=True,
            phone=normalized_phone,
            message="Telegram botga ulangan"
        )
    else:
        return TelegramStatusResponse(
            is_connected=False,
            phone=normalized_phone,
            message="Telegram botga ulanmagan. Iltimos, @aytix_bot ga o'ting."
        )


# ==================== RO'YXATDAN O'TISH OTP ====================

def send_registration_otp_telegram(phone: str, otp_code: str, db: Session) -> bool:
    """Telegram orqali ro'yxatdan o'tish OTP yuborish"""
    normalized_phone = normalize_phone(phone)

    telegram_user = db.query(TelegramUser).filter(
        TelegramUser.phone == normalized_phone,
        TelegramUser.is_active == True
    ).first()

    if not telegram_user:
        logger.warning(f"Telegram foydalanuvchi topilmadi: {normalized_phone}")
        return False

    try:
        bot_token = settings.TELEGRAM_BOT_TOKEN
        chat_id = telegram_user.chat_id

        message = f"""
🔐 *AyTiX - Ro'yxatdan o'tish*

Sizning tasdiqlash kodingiz:

`{otp_code}`

⏱ Kod 1 daqiqa ichida amal qiladi.

⚠️ Bu kodni hech kimga bermang!
"""

        url = f"https://api.telegram.org/bot{bot_token}/sendMessage"
        payload = {
            "chat_id": chat_id,
            "text": message,
            "parse_mode": "Markdown"
        }

        with httpx.Client() as client:
            response = client.post(url, json=payload, timeout=10.0)
            response_data = response.json()

            if response_data.get("ok"):
                logger.info(f"Ro'yxatdan o'tish OTP yuborildi: phone={normalized_phone}")
                return True
            else:
                logger.error(f"Telegram xatolik: {response_data}")
                return False

    except Exception as e:
        logger.error(f"Telegram OTP yuborishda xatolik: {e}")
        return False


@router.post("/register/init", response_model=RegisterInitResponse)
def register_init(data: RegisterInitRequest, db: Session = Depends(get_db)):
    """Ro'yxatdan o'tishni boshlash - OTP yuborish"""
    import uuid
    now = datetime.utcnow()

    # Telefon raqamini normalizatsiya qilish
    normalized_phone = normalize_phone(data.phone)

    # Foydalanuvchi allaqachon mavjudligini tekshirish
    existing_user = db.query(User).filter(User.phone == normalized_phone).first()
    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Bu telefon raqam allaqachon ro'yxatdan o'tgan"
        )

    # Telegram botga ulanganligini tekshirish
    telegram_user = db.query(TelegramUser).filter(
        TelegramUser.phone == normalized_phone,
        TelegramUser.is_active == True
    ).first()

    if not telegram_user:
        raise HTTPException(
            status_code=400,
            detail="Telegram botga ulanmagansiz. Iltimos, avval @aytix_bot ga o'ting va telefon raqamingizni ulang."
        )

    # Rate limiting
    one_hour_ago = now - timedelta(hours=1)
    recent_requests = db.query(OTPRequestModel).filter(
        OTPRequestModel.phone == normalized_phone,
        OTPRequestModel.created_at > one_hour_ago
    ).count()

    if recent_requests >= MAX_REQUESTS_PER_HOUR:
        raise HTTPException(
            status_code=429,
            detail=f"Soatiga {MAX_REQUESTS_PER_HOUR} ta OTP so'rash mumkin. Keyinroq urinib ko'ring."
        )

    # Session ID va OTP yaratish
    session_id = str(uuid.uuid4())
    otp_code = generate_otp()
    expires_at = now + timedelta(seconds=OTP_EXPIRY_SECONDS)

    # OTP saqlash - session_id va foydalanuvchi ma'lumotlarini saqlash
    # Email maydoniga vaqtincha foydalanuvchi ma'lumotlarini JSON sifatida saqlash
    import json
    user_data_json = json.dumps({
        "first_name": data.first_name,
        "last_name": data.last_name,
        "email": data.email,
        "session_id": session_id
    })

    otp_record = OTPRequestModel(
        phone=normalized_phone,
        email=user_data_json,  # Vaqtincha JSON ma'lumot sifatida
        otp_code=hash_otp(otp_code),
        expires_at=expires_at
    )
    db.add(otp_record)
    db.commit()

    # OTP yuborish
    success = send_registration_otp_telegram(normalized_phone, otp_code, db)
    if not success:
        db.delete(otp_record)
        db.commit()
        raise HTTPException(
            status_code=500,
            detail="OTP yuborishda xatolik. Iltimos, qayta urinib ko'ring."
        )

    return RegisterInitResponse(
        success=True,
        message="Tasdiqlash kodi Telegram orqali yuborildi",
        session_id=session_id,
        expires_in=OTP_EXPIRY_SECONDS
    )


@router.post("/register/verify-otp", response_model=OTPResponse)
def register_verify_otp(data: RegisterVerifyOTPRequest, db: Session = Depends(get_db)):
    """Ro'yxatdan o'tish OTP tasdiqlash"""
    import json
    now = datetime.utcnow()

    # Session ID bo'yicha OTP topish (DB darajasida filtrlash - performance uchun)
    otp_records = db.query(OTPRequestModel).filter(
        OTPRequestModel.is_used == False,
        OTPRequestModel.expires_at > now,
        OTPRequestModel.email.contains(data.session_id)
    ).order_by(OTPRequestModel.created_at.desc()).limit(5).all()

    otp_record = None
    for record in otp_records:
        if record.email:
            try:
                user_data = json.loads(record.email)
                if user_data.get("session_id") == data.session_id:
                    otp_record = record
                    break
            except (json.JSONDecodeError, TypeError):
                continue

    if not otp_record:
        raise HTTPException(status_code=400, detail="Sessiya topilmadi yoki muddati o'tgan")

    # Bloklangan yoki yo'qligini tekshirish
    if otp_record.blocked_until and otp_record.blocked_until > now:
        remaining = (otp_record.blocked_until - now).seconds // 60
        raise HTTPException(
            status_code=429,
            detail=f"Juda ko'p xato urinish. {remaining} daqiqadan keyin qayta urinib ko'ring."
        )

    # OTP tekshirish (hash bilan)
    if otp_record.otp_code != hash_otp(data.otp_code):
        otp_record.attempts += 1

        if otp_record.attempts >= MAX_OTP_ATTEMPTS:
            otp_record.blocked_until = now + timedelta(minutes=BLOCK_DURATION_MINUTES)
            db.commit()
            raise HTTPException(
                status_code=429,
                detail=f"{MAX_OTP_ATTEMPTS} marta xato kiritdingiz. {BLOCK_DURATION_MINUTES} daqiqadan keyin qayta urinib ko'ring."
            )

        db.commit()
        remaining_attempts = MAX_OTP_ATTEMPTS - otp_record.attempts
        raise HTTPException(
            status_code=400,
            detail=f"Tasdiqlash kodi xato! {remaining_attempts} ta urinish qoldi"
        )

    # OTP to'g'ri - ishlatilgan deb belgilash
    otp_record.is_used = True
    db.commit()

    return OTPResponse(
        success=True,
        message="Tasdiqlash kodi to'g'ri. Endi parol kiriting."
    )


@router.post("/register/complete", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register_complete(data: RegisterCompleteRequest, db: Session = Depends(get_db)):
    """Ro'yxatdan o'tishni yakunlash - parol kiritish va akkaunt yaratish"""
    import json
    now = datetime.utcnow()

    # Parollarni tekshirish
    if data.password != data.password_confirm:
        raise HTTPException(status_code=400, detail="Parollar mos kelmayapti")

    if len(data.password) < 8:
        raise HTTPException(status_code=400, detail="Parol kamida 8 ta belgidan iborat bo'lishi kerak")

    # Parol murakkabligini tekshirish
    has_upper = any(c.isupper() for c in data.password)
    has_lower = any(c.islower() for c in data.password)
    has_digit = any(c.isdigit() for c in data.password)
    if not (has_upper and has_lower and has_digit):
        raise HTTPException(
            status_code=400,
            detail="Parolda kamida bitta katta harf, kichik harf va raqam bo'lishi kerak"
        )

    # Session ID bo'yicha tasdiqlangan OTP topish
    # Muddati 5 daqiqa ichida tasdiqlangan bo'lishi kerak
    five_minutes_ago = now - timedelta(minutes=5)
    otp_records = db.query(OTPRequestModel).filter(
        OTPRequestModel.is_used == True,
        OTPRequestModel.expires_at > five_minutes_ago
    ).all()

    otp_record = None
    user_data = None
    for record in otp_records:
        if record.email:
            try:
                parsed_data = json.loads(record.email)
                if parsed_data.get("session_id") == data.session_id:
                    otp_record = record
                    user_data = parsed_data
                    break
            except:
                continue

    if not otp_record or not user_data:
        raise HTTPException(status_code=400, detail="Sessiya topilmadi yoki muddati o'tgan. Qaytadan ro'yxatdan o'ting.")

    # Foydalanuvchi allaqachon mavjudligini tekshirish (yana bir bor)
    existing_user = db.query(User).filter(User.phone == otp_record.phone).first()
    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Bu telefon raqam allaqachon ro'yxatdan o'tgan"
        )

    # Email yaratish
    phone_digits = otp_record.phone.replace("+", "")
    email = user_data.get("email") if user_data.get("email") else f"{phone_digits}@aytix.uz"

    # Username yaratish
    username = f"user_{phone_digits}"

    # Full name
    full_name = f"{user_data.get('first_name', '')} {user_data.get('last_name', '')}"

    # Foydalanuvchi yaratish
    hashed_password = get_password_hash(data.password)
    new_user = User(
        phone=otp_record.phone,
        username=username,
        full_name=full_name,
        first_name=user_data.get("first_name", ""),
        last_name=user_data.get("last_name", ""),
        email=email,
        hashed_password=hashed_password,
        role=UserRole.USER
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user

