from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional, List
from deep_translator import GoogleTranslator
from sqlalchemy.orm import Session
from app.dependencies import get_current_admin_user
from app.core.database import get_db
from app.models import CategoryProject, SubcategoryProject
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/translate", tags=["translate"])


class TranslateRequest(BaseModel):
    text: str
    source_lang: str  # uz, ru, en
    target_langs: List[str]  # ["ru", "en"] yoki ["uz", "en"] va h.k.


class TranslateResponse(BaseModel):
    translations: dict  # {"ru": "...", "en": "..."}
    success: bool
    message: Optional[str] = None


# Til kodlari mapping (deep-translator uchun)
LANG_CODES = {
    "uz": "uz",
    "ru": "ru",
    "en": "en"
}

LANGUAGE_NAMES = {
    "uz": "O'zbek tili",
    "ru": "Rus tili",
    "en": "Ingliz tili"
}


def transliterate_to_cyrillic(text: str) -> str:
    """Inglizcha so'zlarni kirill alifbosiga transliteratsiya qilish"""
    # Inglizcha harflardan kirill harflariga mapping
    latin_to_cyrillic = {
        'a': 'а', 'b': 'б', 'c': 'к', 'd': 'д', 'e': 'е', 'f': 'ф',
        'g': 'г', 'h': 'х', 'i': 'и', 'j': 'дж', 'k': 'к', 'l': 'л',
        'm': 'м', 'n': 'н', 'o': 'о', 'p': 'п', 'q': 'к', 'r': 'р',
        's': 'с', 't': 'т', 'u': 'у', 'v': 'в', 'w': 'в', 'x': 'кс',
        'y': 'и', 'z': 'з',
        'A': 'А', 'B': 'Б', 'C': 'К', 'D': 'Д', 'E': 'Е', 'F': 'Ф',
        'G': 'Г', 'H': 'Х', 'I': 'И', 'J': 'Дж', 'K': 'К', 'L': 'Л',
        'M': 'М', 'N': 'Н', 'O': 'О', 'P': 'П', 'Q': 'К', 'R': 'Р',
        'S': 'С', 'T': 'Т', 'U': 'У', 'V': 'В', 'W': 'В', 'X': 'Кс',
        'Y': 'И', 'Z': 'З'
    }

    result = []
    for char in text:
        if char in latin_to_cyrillic:
            result.append(latin_to_cyrillic[char])
        else:
            result.append(char)
    return ''.join(result)


def fix_russian_translation(text: str) -> str:
    """Rus tarjimasidagi inglizcha so'zlarni kirill alifbosiga o'girish"""
    import re

    # Inglizcha so'zlarni topish (2 yoki undan ko'p lotin harflari)
    def replace_english(match):
        english_word = match.group(0)
        return transliterate_to_cyrillic(english_word)

    # Faqat lotin harflaridan iborat so'zlarni topish
    result = re.sub(r'\b[A-Za-z]{2,}\b', replace_english, text)
    return result


def translate_text_google(text: str, source_lang: str, target_lang: str) -> str:
    """Google Translate orqali tarjima qilish (bepul)"""
    try:
        translator = GoogleTranslator(source=LANG_CODES[source_lang], target=LANG_CODES[target_lang])
        result = translator.translate(text)

        if result:
            # Rus tiliga tarjima qilganda, inglizcha so'zlarni kirill ga o'girish
            if target_lang == 'ru':
                result = fix_russian_translation(result)
            return result
        return text
    except Exception as e:
        logger.error(f"Google Translate xatoligi: {str(e)}")
        raise e


@router.post("/", response_model=TranslateResponse)
async def translate_text(
    data: TranslateRequest,
    current_user = Depends(get_current_admin_user)
):
    """
    Matnni bir tildan boshqa tillarga tarjima qilish.
    Google Translate (bepul) ishlatiladi.
    """
    if not data.text or not data.text.strip():
        return TranslateResponse(
            translations={},
            success=False,
            message="Tarjima qilish uchun matn kiritilmagan"
        )

    if data.source_lang not in LANG_CODES:
        raise HTTPException(status_code=400, detail=f"Noto'g'ri manba tili: {data.source_lang}")

    for lang in data.target_langs:
        if lang not in LANG_CODES:
            raise HTTPException(status_code=400, detail=f"Noto'g'ri maqsad tili: {lang}")

    try:
        translations = {}

        for target_lang in data.target_langs:
            if target_lang == data.source_lang:
                translations[target_lang] = data.text
                continue

            translated = translate_text_google(data.text, data.source_lang, target_lang)
            translations[target_lang] = translated

            logger.info(f"Tarjima: {data.source_lang} -> {target_lang}, uzunlik: {len(data.text)} -> {len(translated)}")

        return TranslateResponse(
            translations=translations,
            success=True,
            message="Muvaffaqiyatli tarjima qilindi"
        )

    except Exception as e:
        logger.error(f"Tarjima xatoligi: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Tarjima qilishda xatolik: {str(e)}"
        )


@router.post("/batch", response_model=TranslateResponse)
async def translate_batch(
    texts: dict,  # {"name": "Loyiha nomi", "description": "Tavsif"}
    source_lang: str,
    target_langs: List[str],
    current_user = Depends(get_current_admin_user)
):
    """
    Bir nechta matnni bir vaqtda tarjima qilish.
    """
    if not texts:
        return TranslateResponse(
            translations={},
            success=False,
            message="Tarjima qilish uchun matnlar kiritilmagan"
        )

    try:
        all_translations = {}

        for target_lang in target_langs:
            if target_lang == source_lang:
                all_translations[target_lang] = texts
                continue

            translated_dict = {}
            for key, value in texts.items():
                if value and value.strip():
                    translated_dict[key] = translate_text_google(value, source_lang, target_lang)
                else:
                    translated_dict[key] = value

            all_translations[target_lang] = translated_dict

        return TranslateResponse(
            translations=all_translations,
            success=True,
            message="Muvaffaqiyatli tarjima qilindi"
        )

    except Exception as e:
        logger.error(f"Batch tarjima xatoligi: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Tarjima qilishda xatolik: {str(e)}"
        )


@router.post("/categories/all")
async def translate_all_categories(
    current_user = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """
    Barcha kategoriya va subkategoriyalarni avtomatik tarjima qilish.
    O'zbek tilidan rus va ingliz tillariga tarjima qiladi.
    """
    try:
        translated_count = 0
        errors = []

        # Kategoriyalarni olish
        categories = db.query(CategoryProject).all()

        for category in categories:
            try:
                # Agar name_uz bo'lsa va name_ru/name_en bo'sh bo'lsa
                if category.name_uz:
                    # Rus tiliga tarjima
                    if not category.name_ru or category.name_ru.strip() == '':
                        category.name_ru = translate_text_google(category.name_uz, 'uz', 'ru')

                    # Ingliz tiliga tarjima
                    if not category.name_en or category.name_en.strip() == '':
                        category.name_en = translate_text_google(category.name_uz, 'uz', 'en')

                # Description tarjimasi
                if category.description_uz:
                    if not category.description_ru or category.description_ru.strip() == '':
                        category.description_ru = translate_text_google(category.description_uz, 'uz', 'ru')

                    if not category.description_en or category.description_en.strip() == '':
                        category.description_en = translate_text_google(category.description_uz, 'uz', 'en')

                translated_count += 1
                logger.info(f"Kategoriya tarjima qilindi: {category.name_uz}")

            except Exception as e:
                errors.append(f"Kategoriya {category.id}: {str(e)}")
                logger.error(f"Kategoriya tarjima xatosi {category.id}: {str(e)}")

        # Subkategoriyalarni olish
        subcategories = db.query(SubcategoryProject).all()

        for subcat in subcategories:
            try:
                if subcat.name_uz:
                    # Rus tiliga tarjima
                    if not subcat.name_ru or subcat.name_ru.strip() == '':
                        subcat.name_ru = translate_text_google(subcat.name_uz, 'uz', 'ru')

                    # Ingliz tiliga tarjima
                    if not subcat.name_en or subcat.name_en.strip() == '':
                        subcat.name_en = translate_text_google(subcat.name_uz, 'uz', 'en')

                translated_count += 1
                logger.info(f"Subkategoriya tarjima qilindi: {subcat.name_uz}")

            except Exception as e:
                errors.append(f"Subkategoriya {subcat.id}: {str(e)}")
                logger.error(f"Subkategoriya tarjima xatosi {subcat.id}: {str(e)}")

        # O'zgarishlarni saqlash
        db.commit()

        return {
            "success": True,
            "message": f"{translated_count} ta element tarjima qilindi",
            "translated_count": translated_count,
            "errors": errors if errors else None
        }

    except Exception as e:
        db.rollback()
        logger.error(f"Tarjima xatoligi: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Tarjima qilishda xatolik: {str(e)}"
        )
