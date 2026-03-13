from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
import os
import re
import uuid
import aiofiles
from app.core.config import settings
from app.core.database import get_db
from app.dependencies import get_current_user
from app.models import User

router = APIRouter(prefix="/uploads", tags=["uploads"])

# Backend papkasida uploads saqlash
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
UPLOAD_DIR = os.path.join(BASE_DIR, "uploads")
IMAGES_DIR = os.path.join(UPLOAD_DIR, "images")
VIDEOS_DIR = os.path.join(UPLOAD_DIR, "videos")

# Papkalarni yaratish
os.makedirs(IMAGES_DIR, exist_ok=True)
os.makedirs(VIDEOS_DIR, exist_ok=True)

# Ruxsat etilgan kengaytmalar
ALLOWED_IMAGE_EXTENSIONS = {"jpg", "jpeg", "png", "gif", "webp"}
ALLOWED_VIDEO_EXTENSIONS = {"mp4", "webm", "mov"}

# Magic bytes - fayl turini haqiqiy content orqali tekshirish
IMAGE_MAGIC_BYTES = {
    b'\xff\xd8\xff': "jpeg",          # JPEG
    b'\x89PNG\r\n\x1a\n': "png",      # PNG
    b'GIF87a': "gif",                   # GIF87a
    b'GIF89a': "gif",                   # GIF89a
    b'RIFF': "webp",                    # WebP (RIFF container)
}

VIDEO_MAGIC_BYTES = {
    b'\x00\x00\x00': "mp4",            # MP4/MOV (ftyp box)
    b'\x1a\x45\xdf\xa3': "webm",       # WebM (EBML header)
}


def validate_magic_bytes(content: bytes, file_type: str) -> bool:
    """Fayl magic bytes orqali haqiqiy turini tekshirish."""
    if file_type == "image":
        for magic, _ in IMAGE_MAGIC_BYTES.items():
            if content[:len(magic)] == magic:
                return True
        return False
    elif file_type == "video":
        # MP4/MOV - ftyp box tekshirish
        if len(content) >= 8 and content[4:8] == b'ftyp':
            return True
        for magic, _ in VIDEO_MAGIC_BYTES.items():
            if content[:len(magic)] == magic:
                return True
        return False
    return False


def validate_filename(filename: str) -> str:
    """Fayl nomini xavfsiz qilish - path traversal oldini olish."""
    if not filename:
        return "file"
    # Faqat fayl nomini olish (path ni olib tashlash)
    filename = os.path.basename(filename)
    # Xavfli belgilarni olib tashlash
    filename = re.sub(r'[^\w\-.]', '', filename)
    return filename


def get_safe_extension(filename: str, allowed: set) -> str:
    """Xavfsiz kengaytmani olish."""
    safe_name = validate_filename(filename)
    if "." in safe_name:
        ext = safe_name.rsplit(".", 1)[-1].lower()
        if ext in allowed:
            return ext
    return None


@router.post("/image")
async def upload_image(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user)
):
    """Upload an image file (authenticated)."""
    if file.content_type not in settings.ALLOWED_IMAGE_TYPES:
        raise HTTPException(status_code=400, detail="Invalid image type")

    # Kengaytmani tekshirish
    ext = get_safe_extension(file.filename, ALLOWED_IMAGE_EXTENSIONS)
    if not ext:
        raise HTTPException(status_code=400, detail="Invalid file extension")

    # Avval hajmni tekshirish (chunk bilan o'qish)
    content = b""
    while True:
        chunk = await file.read(1024 * 1024)  # 1MB chunk
        if not chunk:
            break
        content += chunk
        if len(content) > settings.MAX_UPLOAD_SIZE:
            raise HTTPException(status_code=400, detail="File too large")

    # Magic bytes tekshirish - Content-Type spoofing oldini olish
    if not validate_magic_bytes(content, "image"):
        raise HTTPException(status_code=400, detail="Invalid image content")

    # UUID bilan yangi nom berish
    filename = f"{uuid.uuid4()}.{ext}"
    filepath = os.path.join(IMAGES_DIR, filename)

    # Faylni saqlash
    async with aiofiles.open(filepath, "wb") as f:
        await f.write(content)

    return {"filename": filename, "url": f"/uploads/images/{filename}"}


@router.post("/images")
async def upload_multiple_images(
    files: list[UploadFile] = File(...),
    current_user: User = Depends(get_current_user)
):
    """Upload multiple image files (authenticated)."""
    urls = []

    for file in files:
        if file.content_type not in settings.ALLOWED_IMAGE_TYPES:
            raise HTTPException(status_code=400, detail=f"Invalid image type: {file.filename}")

        ext = get_safe_extension(file.filename, ALLOWED_IMAGE_EXTENSIONS)
        if not ext:
            raise HTTPException(status_code=400, detail=f"Invalid file extension: {file.filename}")

        # Hajmni tekshirish
        content = b""
        while True:
            chunk = await file.read(1024 * 1024)
            if not chunk:
                break
            content += chunk
            if len(content) > settings.MAX_UPLOAD_SIZE:
                raise HTTPException(status_code=400, detail=f"File too large: {file.filename}")

        # Magic bytes tekshirish
        if not validate_magic_bytes(content, "image"):
            raise HTTPException(status_code=400, detail=f"Invalid image content: {file.filename}")

        filename = f"{uuid.uuid4()}.{ext}"
        filepath = os.path.join(IMAGES_DIR, filename)

        async with aiofiles.open(filepath, "wb") as f:
            await f.write(content)

        urls.append(f"/uploads/images/{filename}")

    return {"urls": urls}


@router.post("/video")
async def upload_video(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user)
):
    """Upload a video file (authenticated)."""
    if file.content_type not in settings.ALLOWED_VIDEO_TYPES:
        raise HTTPException(status_code=400, detail="Invalid video type")

    ext = get_safe_extension(file.filename, ALLOWED_VIDEO_EXTENSIONS)
    if not ext:
        raise HTTPException(status_code=400, detail="Invalid file extension")

    # Hajmni tekshirish
    content = b""
    while True:
        chunk = await file.read(1024 * 1024)
        if not chunk:
            break
        content += chunk
        if len(content) > settings.MAX_UPLOAD_SIZE:
            raise HTTPException(status_code=400, detail="File too large")

    # Magic bytes tekshirish
    if not validate_magic_bytes(content, "video"):
        raise HTTPException(status_code=400, detail="Invalid video content")

    filename = f"{uuid.uuid4()}.{ext}"
    filepath = os.path.join(VIDEOS_DIR, filename)

    async with aiofiles.open(filepath, "wb") as f:
        await f.write(content)

    return {"filename": filename, "url": f"/uploads/videos/{filename}"}


@router.delete("/images/{filename}")
async def delete_image(
    filename: str,
    current_user: User = Depends(get_current_user)
):
    """Delete an uploaded image (authenticated)."""
    # Path traversal himoyasi
    safe_filename = os.path.basename(filename)
    if safe_filename != filename or ".." in filename:
        raise HTTPException(status_code=400, detail="Invalid filename")

    filepath = os.path.join(IMAGES_DIR, safe_filename)
    # Fayl IMAGES_DIR ichida ekanligini tekshirish
    real_path = os.path.realpath(filepath)
    if not real_path.startswith(os.path.realpath(IMAGES_DIR)):
        raise HTTPException(status_code=400, detail="Invalid file path")

    if os.path.exists(filepath):
        os.remove(filepath)
        return {"message": "Image deleted"}
    raise HTTPException(status_code=404, detail="Image not found")


@router.delete("/videos/{filename}")
async def delete_video(
    filename: str,
    current_user: User = Depends(get_current_user)
):
    """Delete an uploaded video (authenticated)."""
    safe_filename = os.path.basename(filename)
    if safe_filename != filename or ".." in filename:
        raise HTTPException(status_code=400, detail="Invalid filename")

    filepath = os.path.join(VIDEOS_DIR, safe_filename)
    real_path = os.path.realpath(filepath)
    if not real_path.startswith(os.path.realpath(VIDEOS_DIR)):
        raise HTTPException(status_code=400, detail="Invalid file path")

    if os.path.exists(filepath):
        os.remove(filepath)
        return {"message": "Video deleted"}
    raise HTTPException(status_code=404, detail="Video not found")
