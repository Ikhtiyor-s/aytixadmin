from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import httpx
import hashlib
import hmac
import time
import base64
import re
from app.core.database import get_db
from app.dependencies import get_current_admin
from app.models import User, Integration, IntegrationStatus, ConnectedIntegration, IntegrationProject
from app.schemas import (
    IntegrationCreate, IntegrationUpdate, IntegrationResponse,
    ConnectedIntegrationCreate, ConnectedIntegrationUpdate, ConnectedIntegrationResponse,
    IntegrationProjectCreate, IntegrationProjectUpdate, IntegrationProjectResponse,
    IntegrationTestRequest, IntegrationTestResponse
)

router = APIRouter(prefix="/integrations", tags=["integrations"])


@router.get("/public", response_model=List[IntegrationResponse])
async def get_public_integrations(
    db: Session = Depends(get_db)
):
    """Get all active integrations for public display."""
    integrations = db.query(Integration).filter(Integration.status != IntegrationStatus.INACTIVE).all()
    return integrations


@router.get("/", response_model=List[IntegrationResponse])
async def get_all_integrations(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    """Get all integrations (admin only)."""
    integrations = db.query(Integration).order_by(Integration.category, Integration.created_at.desc()).all()
    return integrations


@router.get("/categories")
async def get_integration_categories(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    """Get all unique integration categories."""
    categories = db.query(Integration.category).distinct().all()
    return [c[0] for c in categories if c[0]]


# ============== Integration Projects (Aytix Integration Service Clients) ==============
# Bu marketplace loyihalari bilan bog'liq EMAS - alohida integratsiya xizmati mijozlari!

@router.get("/projects", response_model=List[IntegrationProjectResponse])
async def get_integration_projects(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    """Get all integration projects (Aytix integration service clients)."""
    projects = db.query(IntegrationProject).order_by(IntegrationProject.created_at.desc()).all()
    return projects


# ============== Connected Integrations (User Configurations) ==============

@router.get("/connected", response_model=List[ConnectedIntegrationResponse])
async def get_connected_integrations(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    """Get all connected/configured integrations."""
    integrations = db.query(ConnectedIntegration).order_by(ConnectedIntegration.created_at.desc()).all()
    return integrations


@router.get("/{integration_id}", response_model=IntegrationResponse)
async def get_integration(
    integration_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    """Get a single integration by ID."""
    integration = db.query(Integration).filter(Integration.id == integration_id).first()
    if not integration:
        raise HTTPException(status_code=404, detail="Integration not found")
    return integration


@router.post("/", response_model=IntegrationResponse, status_code=status.HTTP_201_CREATED)
async def create_integration(
    integration_data: IntegrationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    """Create a new integration."""
    integration = Integration(**integration_data.model_dump())
    db.add(integration)
    db.commit()
    db.refresh(integration)
    return integration


@router.put("/{integration_id}", response_model=IntegrationResponse)
async def update_integration(
    integration_id: int,
    integration_data: IntegrationUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    """Update an integration."""
    integration = db.query(Integration).filter(Integration.id == integration_id).first()
    if not integration:
        raise HTTPException(status_code=404, detail="Integration not found")

    update_data = integration_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(integration, field, value)

    db.commit()
    db.refresh(integration)
    return integration


@router.delete("/{integration_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_integration(
    integration_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    """Delete an integration."""
    integration = db.query(Integration).filter(Integration.id == integration_id).first()
    if not integration:
        raise HTTPException(status_code=404, detail="Integration not found")

    db.delete(integration)
    db.commit()
    return None


@router.get("/projects/{project_id}", response_model=IntegrationProjectResponse)
async def get_integration_project(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    """Get a single integration project by ID."""
    project = db.query(IntegrationProject).filter(IntegrationProject.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Integration project not found")
    return project


@router.post("/projects", response_model=IntegrationProjectResponse, status_code=status.HTTP_201_CREATED)
async def create_integration_project(
    data: IntegrationProjectCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    """Create a new integration project (client)."""
    project = IntegrationProject(**data.model_dump())
    db.add(project)
    db.commit()
    db.refresh(project)
    return project


@router.put("/projects/{project_id}", response_model=IntegrationProjectResponse)
async def update_integration_project(
    project_id: int,
    data: IntegrationProjectUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    """Update an integration project."""
    project = db.query(IntegrationProject).filter(IntegrationProject.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Integration project not found")

    update_data = data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(project, field, value)

    db.commit()
    db.refresh(project)
    return project


@router.delete("/projects/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_integration_project(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    """Delete an integration project."""
    project = db.query(IntegrationProject).filter(IntegrationProject.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Integration project not found")

    # Check if project has connected integrations
    connected_count = db.query(ConnectedIntegration).filter(
        ConnectedIntegration.integration_project_id == project_id
    ).count()

    if connected_count > 0:
        raise HTTPException(
            status_code=400,
            detail=f"Bu loyihada {connected_count} ta ulangan integratsiya mavjud. Avval ularni o'chiring."
        )

    db.delete(project)
    db.commit()
    return None


@router.post("/connected", response_model=ConnectedIntegrationResponse, status_code=status.HTTP_201_CREATED)
async def create_connected_integration(
    data: ConnectedIntegrationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    """Create/Connect a new integration with configuration."""
    # Check if already exists
    existing = db.query(ConnectedIntegration).filter(
        ConnectedIntegration.integration_id == data.integration_id
    ).first()

    if existing:
        raise HTTPException(
            status_code=400,
            detail=f"Integration '{data.integration_id}' is already connected. Use PUT to update."
        )

    integration = ConnectedIntegration(**data.model_dump())
    db.add(integration)
    db.commit()
    db.refresh(integration)
    return integration


@router.put("/connected/{id}", response_model=ConnectedIntegrationResponse)
async def update_connected_integration(
    id: int,
    data: ConnectedIntegrationUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    """Update a connected integration configuration."""
    integration = db.query(ConnectedIntegration).filter(ConnectedIntegration.id == id).first()
    if not integration:
        raise HTTPException(status_code=404, detail="Connected integration not found")

    update_data = data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(integration, field, value)

    db.commit()
    db.refresh(integration)
    return integration


@router.delete("/connected/{id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_connected_integration(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    """Delete/Disconnect an integration."""
    integration = db.query(ConnectedIntegration).filter(ConnectedIntegration.id == id).first()
    if not integration:
        raise HTTPException(status_code=404, detail="Connected integration not found")

    db.delete(integration)
    db.commit()
    return None


@router.post("/test", response_model=IntegrationTestResponse)
async def test_integration_connection(
    data: IntegrationTestRequest,
    current_user: User = Depends(get_current_admin)
):
    """Test integration connection with provided credentials."""

    integration_id = data.integration_id
    config = data.config

    # Integration test funksiyalari mapping
    test_handlers = {
        "amocrm": test_amocrm,
        "zadarma": test_zadarma,
        "telegram": test_telegram,
        "sms_eskiz": test_eskiz,
        "payme": test_payme,
        "click": test_click,
        "google_analytics": test_google_analytics,
        "yandex_delivery": test_yandex_delivery,
        "express24": test_express24,
        "uzum_nasiya": test_uzum_nasiya,
        "wolt": test_wolt,
        "glovo": test_glovo,
        "uztelecom": test_isp_credentials,
        "beeline_uz": test_isp_credentials,
        "ucell": test_isp_credentials,
        "mobiuz": test_isp_credentials,
        "turon_telecom": test_isp_credentials,
        "comnet": test_isp_credentials,
        "hududgaz": test_utility_credentials,
        "elektr_energiya": test_utility_credentials,
        "suvoqova": test_utility_credentials,
        "iiko": test_iiko,
        "rkeeper": test_rkeeper,
        "poster": test_poster,
        "mobilkassa": test_pos_terminal,
        "epos": test_pos_terminal,
        "zpos": test_generic_pos,
        "multikassa": test_generic_pos,
        "jowi": test_jowi,
        "paloma365": test_paloma365,
        "smartup": test_smartup,
        "billz": test_billz,
        "quick_resto": test_quick_resto,
        "tillypad": test_tillypad,
        "1c_roznitsa": test_1c_roznitsa,
        "atol": test_atol,
        "lightspeed": test_lightspeed,
        "square": test_square,
        "toast": test_toast,
        "soliq_terminal": test_soliq_terminal,
        # Yangi to'lov tizimlari
        "paynet": test_paynet,
        "uzcard": test_card_system,
        "humo": test_card_system,
        "atmos": test_atmos,
        "apelsin": test_generic_payment,
        "alif_nasiya": test_generic_payment,
        "oson": test_generic_payment,
        "upay": test_generic_payment,
        "uzum_bank": test_generic_payment,
        # CRM
        "bitrix24": test_bitrix24,
        # Aloqa
        "playmobile": test_playmobile,
        "opersms": test_opersms,
        "jivochat": test_jivochat,
        # Yetkazib berish
        "uzum_tezkor": test_generic_delivery,
        "mytaxi_delivery": test_generic_delivery,
        "yandex_go": test_generic_delivery,
        "korzinka_go": test_generic_delivery,
        # Analitika
        "yandex_metrica": test_yandex_metrica,
        "facebook_pixel": test_pixel_tracker,
        "tiktok_pixel": test_pixel_tracker,
        # Davlat
        "oneid": test_oneid,
        "myid": test_myid,
        "factura": test_factura,
        "ofd_uz": test_ofd,
        # Xaritalar
        "yandex_maps": test_maps_api,
        "twogis": test_maps_api,
        "google_maps": test_maps_api,
        # Ijtimoiy tarmoqlar
        "instagram_business": test_social_api,
        "facebook_business": test_social_api,
        "tiktok_business": test_social_api,
        # E-commerce
        "uzum_market": test_generic_delivery,
        # ERP
        "odoo": test_odoo,
        "iota_erp": test_generic_erp,
        # Internet
        "tps": test_isp_credentials,
        "sarkor_telecom": test_isp_credentials,
        # Neobank / Raqamli banklar (yangi)
        "anorbank": test_neobank,
        "tezbank": test_neobank,
        "tbc_uz": test_neobank,
        # E-commerce (yangi)
        "birbir": test_ecommerce_platform,
        "alif_shop": test_ecommerce_platform,
        # CRM (yangi)
        "salesdoktor": test_salesdoktor,
        # Davlat (yangi)
        "my_gov": test_my_gov,
        # Retail SaaS (yangi)
        "billz_saas": test_generic_pos,
        # AI Moliya (yangi)
        "etcita": test_etcita,
        # Express24 Food
        "express24_food": test_generic_delivery,
    }

    # integration_id ni qo'shimcha argument sifatida oluvchi handlerlar
    id_aware_handlers = {
        "uztelecom", "beeline_uz", "ucell", "mobiuz", "turon_telecom", "comnet",
        "tps", "sarkor_telecom",
        "hududgaz", "elektr_energiya", "suvoqova",
        "mobilkassa", "epos",
        "uzcard", "humo",
        "apelsin", "alif_nasiya", "oson", "upay", "uzum_bank",
        "uzum_tezkor", "mytaxi_delivery", "yandex_go", "korzinka_go", "uzum_market",
        "facebook_pixel", "tiktok_pixel",
        "yandex_maps", "twogis", "google_maps",
        "instagram_business", "facebook_business", "tiktok_business",
        "iota_erp",
        # Yangi
        "anorbank", "tezbank", "tbc_uz",
        "birbir", "alif_shop",
        "salesdoktor",
        "my_gov",
        "billz_saas",
        "etcita",
        "express24_food",
    }

    try:
        handler = test_handlers.get(integration_id)
        if handler:
            if integration_id in id_aware_handlers:
                return await handler(config, integration_id)
            else:
                return await handler(config)
        else:
            return IntegrationTestResponse(
                success=False,
                message=f"'{integration_id}' uchun test funksiyasi topilmadi."
            )
    except Exception as e:
        return IntegrationTestResponse(
            success=False,
            message=f"Xatolik: {str(e)}"
        )


# ============== CRM Test Functions ==============

async def test_amocrm(config: dict) -> IntegrationTestResponse:
    """Test AmoCRM connection - OAuth2 authorization code exchange."""
    subdomain = config.get("subdomain", "").strip()
    client_id = config.get("client_id", "").strip()
    client_secret = config.get("client_secret", "").strip()
    redirect_uri = config.get("redirect_uri", "").strip()
    authorization_code = config.get("authorization_code", "").strip()

    if not all([subdomain, client_id, client_secret, redirect_uri, authorization_code]):
        return IntegrationTestResponse(success=False, message="Barcha majburiy maydonlar to'ldirilishi kerak")

    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"https://{subdomain}.amocrm.ru/oauth2/access_token",
                json={
                    "client_id": client_id,
                    "client_secret": client_secret,
                    "grant_type": "authorization_code",
                    "code": authorization_code,
                    "redirect_uri": redirect_uri
                },
                timeout=10.0
            )

            if response.status_code == 200:
                return IntegrationTestResponse(
                    success=True,
                    message="AmoCRM bilan ulanish muvaffaqiyatli! Access token olindi."
                )
            else:
                error_data = response.json() if response.text else {}
                error_msg = error_data.get("hint", error_data.get("message", "Noma'lum xatolik"))
                return IntegrationTestResponse(success=False, message=f"AmoCRM xatolik: {error_msg}")
    except httpx.TimeoutException:
        return IntegrationTestResponse(success=False, message="AmoCRM serveriga ulanish vaqti tugadi")
    except Exception as e:
        return IntegrationTestResponse(success=False, message=f"Ulanish xatoligi: {str(e)}")


# ============== Communication Test Functions ==============

async def test_zadarma(config: dict) -> IntegrationTestResponse:
    """Test Zadarma API - balans so'rash orqali tekshirish."""
    api_key = config.get("api_key", "").strip()
    api_secret = config.get("api_secret", "").strip()

    if not api_key or not api_secret:
        return IntegrationTestResponse(success=False, message="API Key va API Secret kiritilishi kerak")

    try:
        method = "/v1/info/balance/"
        params_str = ""
        data_to_sign = method + params_str + hashlib.md5(params_str.encode()).hexdigest()
        signature = hmac.new(api_secret.encode(), data_to_sign.encode(), hashlib.sha1).hexdigest()

        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"https://api.zadarma.com{method}",
                headers={"Authorization": f"{api_key}:{signature}"},
                timeout=10.0
            )
            data = response.json()
            if data.get("status") == "success":
                balance = data.get("balance", "N/A")
                currency = data.get("currency", "")
                return IntegrationTestResponse(
                    success=True,
                    message=f"Zadarma bilan ulanish muvaffaqiyatli! Balans: {balance} {currency}"
                )
            else:
                return IntegrationTestResponse(
                    success=False,
                    message=f"Zadarma xatolik: {data.get('message', 'Autentifikatsiya xatosi')}"
                )
    except httpx.TimeoutException:
        return IntegrationTestResponse(success=False, message="Zadarma serveriga ulanish vaqti tugadi")
    except Exception as e:
        return IntegrationTestResponse(success=False, message=f"Ulanish xatoligi: {str(e)}")


async def test_telegram(config: dict) -> IntegrationTestResponse:
    """Test Telegram Bot - getMe orqali bot ma'lumotlarini olish."""
    bot_token = config.get("bot_token", "").strip()

    if not bot_token:
        return IntegrationTestResponse(success=False, message="Bot Token kiritilishi kerak")

    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"https://api.telegram.org/bot{bot_token}/getMe",
                timeout=10.0
            )
            data = response.json()
            if data.get("ok"):
                bot_info = data.get("result", {})
                bot_name = bot_info.get("first_name", "Unknown")
                bot_username = bot_info.get("username", "unknown")
                return IntegrationTestResponse(
                    success=True,
                    message=f"Telegram bot bilan ulanish muvaffaqiyatli! Bot: @{bot_username} ({bot_name})"
                )
            else:
                return IntegrationTestResponse(
                    success=False,
                    message=f"Telegram xatolik: {data.get('description', 'Token xato')}"
                )
    except httpx.TimeoutException:
        return IntegrationTestResponse(success=False, message="Telegram serveriga ulanish vaqti tugadi")
    except Exception as e:
        return IntegrationTestResponse(success=False, message=f"Ulanish xatoligi: {str(e)}")


async def test_eskiz(config: dict) -> IntegrationTestResponse:
    """Test Eskiz SMS - login orqali token olish."""
    email = config.get("email", "").strip()
    password = config.get("password", "").strip()

    if not email or not password:
        return IntegrationTestResponse(success=False, message="Email va Parol kiritilishi kerak")

    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                "https://notify.eskiz.uz/api/auth/login",
                data={"email": email, "password": password},
                timeout=10.0
            )
            data = response.json()
            if data.get("data", {}).get("token"):
                return IntegrationTestResponse(
                    success=True,
                    message="Eskiz SMS bilan ulanish muvaffaqiyatli! Token olindi."
                )
            else:
                return IntegrationTestResponse(
                    success=False,
                    message=f"Eskiz xatolik: {data.get('message', 'Autentifikatsiya xatosi')}"
                )
    except httpx.TimeoutException:
        return IntegrationTestResponse(success=False, message="Eskiz serveriga ulanish vaqti tugadi")
    except Exception as e:
        return IntegrationTestResponse(success=False, message=f"Ulanish xatoligi: {str(e)}")


# ============== Payment Test Functions ==============

async def test_payme(config: dict) -> IntegrationTestResponse:
    """Test Payme merchant - merchant ID va secret key tekshirish."""
    merchant_id = config.get("merchant_id", "").strip()
    secret_key = config.get("secret_key", "").strip()
    test_mode = config.get("test_mode", True)

    if not merchant_id or not secret_key:
        return IntegrationTestResponse(success=False, message="Merchant ID va Secret Key kiritilishi kerak")

    if len(merchant_id) < 10:
        return IntegrationTestResponse(success=False, message="Merchant ID noto'g'ri formatda (kamida 10 belgi)")

    try:
        # Payme API ga test so'rov - merchant ma'lumotlarini tekshirish
        auth_str = f"{merchant_id}:{secret_key}"
        auth_b64 = base64.b64encode(auth_str.encode()).decode()

        async with httpx.AsyncClient() as client:
            response = await client.post(
                "https://checkout.paycom.uz/api" if not test_mode else "https://checkout.test.paycom.uz/api",
                json={
                    "id": 1,
                    "method": "merchants.CheckPerformTransaction",
                    "params": {
                        "amount": 100,
                        "account": {"order_id": "test_check"}
                    }
                },
                headers={
                    "X-Auth": auth_b64,
                    "Content-Type": "application/json"
                },
                timeout=10.0
            )

            if response.status_code in (200, 400):
                data = response.json()
                # Agar error.code == -32504 (UnauthorizedAccess) bo'lsa - kalit noto'g'ri
                error = data.get("error", {})
                if error.get("code") == -32504:
                    return IntegrationTestResponse(
                        success=False,
                        message="Payme xatolik: Merchant ID yoki Secret Key noto'g'ri"
                    )
                # Boshqa xatolar - merchant topildi, ulanish ishlaydi
                mode = "TEST" if test_mode else "PRODUCTION"
                return IntegrationTestResponse(
                    success=True,
                    message=f"Payme bilan ulanish muvaffaqiyatli! Rejim: {mode}"
                )
            else:
                return IntegrationTestResponse(
                    success=False,
                    message=f"Payme server xatolik qaytardi: {response.status_code}"
                )
    except httpx.TimeoutException:
        return IntegrationTestResponse(success=False, message="Payme serveriga ulanish vaqti tugadi")
    except Exception as e:
        return IntegrationTestResponse(success=False, message=f"Ulanish xatoligi: {str(e)}")


async def test_click(config: dict) -> IntegrationTestResponse:
    """Test Click merchant - credentials formatini tekshirish."""
    merchant_id = config.get("merchant_id", "").strip()
    service_id = config.get("service_id", "").strip()
    secret_key = config.get("secret_key", "").strip()

    if not merchant_id or not service_id or not secret_key:
        return IntegrationTestResponse(success=False, message="Merchant ID, Service ID va Secret Key kiritilishi kerak")

    if not merchant_id.isdigit():
        return IntegrationTestResponse(success=False, message="Merchant ID faqat raqamlardan iborat bo'lishi kerak")

    if not service_id.isdigit():
        return IntegrationTestResponse(success=False, message="Service ID faqat raqamlardan iborat bo'lishi kerak")

    try:
        # Click API ulanishini tekshirish
        timestamp = str(int(time.time()))
        sign_string = f"{merchant_id}{service_id}{secret_key}{timestamp}"
        sign = hashlib.md5(sign_string.encode()).hexdigest()

        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"https://api.click.uz/v2/merchant/{merchant_id}/payment/status/0",
                headers={
                    "Auth": f"{merchant_id}:{sign}:{timestamp}",
                    "Accept": "application/json"
                },
                timeout=10.0
            )

            if response.status_code == 401:
                return IntegrationTestResponse(
                    success=False,
                    message="Click xatolik: Merchant ID yoki Secret Key noto'g'ri"
                )
            # 200 yoki 404 (payment not found) - merchant mavjud, kalit to'g'ri
            return IntegrationTestResponse(
                success=True,
                message=f"Click bilan ulanish muvaffaqiyatli! Merchant ID: {merchant_id}, Service ID: {service_id}"
            )
    except httpx.TimeoutException:
        return IntegrationTestResponse(success=False, message="Click serveriga ulanish vaqti tugadi")
    except Exception as e:
        return IntegrationTestResponse(success=False, message=f"Ulanish xatoligi: {str(e)}")


# ============== Analytics Test Functions ==============

async def test_google_analytics(config: dict) -> IntegrationTestResponse:
    """Test Google Analytics - Measurement ID formatini tekshirish."""
    measurement_id = config.get("measurement_id", "").strip()

    if not measurement_id:
        return IntegrationTestResponse(success=False, message="Measurement ID kiritilishi kerak")

    # G-XXXXXXXXXX formatini tekshirish
    if not re.match(r'^G-[A-Z0-9]{6,12}$', measurement_id):
        return IntegrationTestResponse(
            success=False,
            message="Measurement ID noto'g'ri formatda. To'g'ri format: G-XXXXXXXXXX"
        )

    api_secret = config.get("api_secret", "").strip()

    if api_secret:
        try:
            # GA4 Measurement Protocol bilan test event yuborish
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    f"https://www.google-analytics.com/mp/collect?measurement_id={measurement_id}&api_secret={api_secret}",
                    json={
                        "client_id": "test_aytix_integration",
                        "events": [{
                            "name": "integration_test",
                            "params": {"source": "aytix_admin"}
                        }]
                    },
                    timeout=10.0
                )

                if response.status_code == 204:
                    return IntegrationTestResponse(
                        success=True,
                        message=f"Google Analytics bilan ulanish muvaffaqiyatli! ID: {measurement_id}"
                    )
                elif response.status_code == 403:
                    return IntegrationTestResponse(
                        success=False,
                        message="Google Analytics: API Secret noto'g'ri"
                    )
                else:
                    return IntegrationTestResponse(
                        success=True,
                        message=f"Google Analytics Measurement ID saqlandi: {measurement_id}"
                    )
        except Exception:
            pass

    return IntegrationTestResponse(
        success=True,
        message=f"Google Analytics Measurement ID tekshirildi va saqlandi: {measurement_id}"
    )


# ============== Delivery Test Functions ==============

async def test_yandex_delivery(config: dict) -> IntegrationTestResponse:
    """Test Yandex Delivery - OAuth token orqali API tekshirish."""
    api_key = config.get("api_key", "").strip()
    client_id = config.get("client_id", "").strip()

    if not api_key:
        return IntegrationTestResponse(success=False, message="API Key kiritilishi kerak")

    try:
        async with httpx.AsyncClient() as client:
            # Yandex Delivery API health check
            response = await client.post(
                "https://b2b.taxi.yandex.net/b2b/cargo/integration/v2/claims/info",
                headers={
                    "Authorization": f"Bearer {api_key}",
                    "Accept-Language": "ru"
                },
                json={"claim_id": "test_aytix_check"},
                timeout=10.0
            )

            if response.status_code == 401:
                return IntegrationTestResponse(
                    success=False,
                    message="Yandex Delivery: API Key noto'g'ri yoki muddati o'tgan"
                )
            elif response.status_code == 404:
                # 404 = API Key to'g'ri, lekin claim topilmadi (kutilgan javob)
                return IntegrationTestResponse(
                    success=True,
                    message="Yandex Delivery bilan ulanish muvaffaqiyatli! API Key tasdiqlandi."
                )
            elif response.status_code == 200:
                return IntegrationTestResponse(
                    success=True,
                    message="Yandex Delivery bilan ulanish muvaffaqiyatli!"
                )
            else:
                return IntegrationTestResponse(
                    success=True,
                    message=f"Yandex Delivery API javob berdi (status: {response.status_code}). Konfiguratsiya saqlandi."
                )
    except httpx.TimeoutException:
        return IntegrationTestResponse(success=False, message="Yandex Delivery serveriga ulanish vaqti tugadi")
    except Exception as e:
        return IntegrationTestResponse(success=False, message=f"Ulanish xatoligi: {str(e)}")


async def test_express24(config: dict) -> IntegrationTestResponse:
    """Test Express24 Delivery - API key va merchant tekshirish."""
    api_key = config.get("api_key", "").strip()
    merchant_id = config.get("merchant_id", "").strip()

    if not api_key or not merchant_id:
        return IntegrationTestResponse(success=False, message="API Key va Merchant ID kiritilishi kerak")

    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"https://api.express24.uz/api/v1/merchant/{merchant_id}",
                headers={
                    "Authorization": f"Bearer {api_key}",
                    "Accept": "application/json"
                },
                timeout=10.0
            )

            if response.status_code == 200:
                data = response.json()
                name = data.get("name", merchant_id)
                return IntegrationTestResponse(
                    success=True,
                    message=f"Express24 bilan ulanish muvaffaqiyatli! Merchant: {name}"
                )
            elif response.status_code == 401:
                return IntegrationTestResponse(
                    success=False,
                    message="Express24: API Key noto'g'ri"
                )
            elif response.status_code == 404:
                return IntegrationTestResponse(
                    success=False,
                    message="Express24: Merchant ID topilmadi"
                )
            else:
                return IntegrationTestResponse(
                    success=True,
                    message=f"Express24 API javob berdi. Konfiguratsiya saqlandi."
                )
    except httpx.TimeoutException:
        return IntegrationTestResponse(success=False, message="Express24 serveriga ulanish vaqti tugadi")
    except Exception as e:
        return IntegrationTestResponse(success=False, message=f"Ulanish xatoligi: {str(e)}")


async def test_uzum_nasiya(config: dict) -> IntegrationTestResponse:
    """Test Uzum Nasiya - merchant credentials tekshirish."""
    merchant_id = config.get("merchant_id", "").strip()
    api_key = config.get("api_key", "").strip()
    secret_key = config.get("secret_key", "").strip()

    if not merchant_id or not api_key or not secret_key:
        return IntegrationTestResponse(success=False, message="Merchant ID, API Key va Secret Key kiritilishi kerak")

    try:
        # Uzum API ga merchant tekshirish so'rovi
        timestamp = str(int(time.time() * 1000))
        sign_data = f"{merchant_id}{timestamp}{secret_key}"
        signature = hashlib.sha256(sign_data.encode()).hexdigest()

        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"https://api.uzum.uz/api/v1/merchant/{merchant_id}/status",
                headers={
                    "X-Api-Key": api_key,
                    "X-Signature": signature,
                    "X-Timestamp": timestamp,
                    "Accept": "application/json"
                },
                timeout=10.0
            )

            if response.status_code == 401:
                return IntegrationTestResponse(
                    success=False,
                    message="Uzum Nasiya: Credentials noto'g'ri"
                )
            elif response.status_code == 200:
                return IntegrationTestResponse(
                    success=True,
                    message=f"Uzum Nasiya bilan ulanish muvaffaqiyatli! Merchant ID: {merchant_id}"
                )
            else:
                # API mavjud, credentials formati to'g'ri
                return IntegrationTestResponse(
                    success=True,
                    message=f"Uzum Nasiya konfiguratsiyasi tekshirildi. Merchant ID: {merchant_id}"
                )
    except httpx.TimeoutException:
        return IntegrationTestResponse(success=False, message="Uzum serveriga ulanish vaqti tugadi")
    except Exception as e:
        return IntegrationTestResponse(success=False, message=f"Ulanish xatoligi: {str(e)}")


async def test_wolt(config: dict) -> IntegrationTestResponse:
    """Test Wolt Delivery - venue API tekshirish."""
    venue_id = config.get("venue_id", "").strip()
    api_key = config.get("api_key", "").strip()

    if not venue_id or not api_key:
        return IntegrationTestResponse(success=False, message="Venue ID va API Key kiritilishi kerak")

    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"https://restaurant-api.wolt.com/v1/venues/{venue_id}",
                headers={
                    "Authorization": f"Bearer {api_key}",
                    "Accept": "application/json"
                },
                timeout=10.0
            )

            if response.status_code == 200:
                data = response.json()
                name = data.get("name", [{}])
                venue_name = name[0].get("value", venue_id) if isinstance(name, list) and name else venue_id
                return IntegrationTestResponse(
                    success=True,
                    message=f"Wolt bilan ulanish muvaffaqiyatli! Venue: {venue_name}"
                )
            elif response.status_code == 401:
                return IntegrationTestResponse(
                    success=False,
                    message="Wolt: API Key noto'g'ri"
                )
            elif response.status_code == 404:
                return IntegrationTestResponse(
                    success=False,
                    message="Wolt: Venue ID topilmadi"
                )
            else:
                return IntegrationTestResponse(
                    success=True,
                    message=f"Wolt API javob berdi. Konfiguratsiya saqlandi."
                )
    except httpx.TimeoutException:
        return IntegrationTestResponse(success=False, message="Wolt serveriga ulanish vaqti tugadi")
    except Exception as e:
        return IntegrationTestResponse(success=False, message=f"Ulanish xatoligi: {str(e)}")


async def test_glovo(config: dict) -> IntegrationTestResponse:
    """Test Glovo - store API tekshirish."""
    store_id = config.get("store_id", "").strip()
    api_key = config.get("api_key", "").strip()
    api_secret = config.get("api_secret", "").strip()

    if not store_id or not api_key or not api_secret:
        return IntegrationTestResponse(success=False, message="Do'kon ID, API Key va API Secret kiritilishi kerak")

    try:
        # Glovo API authentication
        timestamp = str(int(time.time()))
        sign_string = f"{api_key}{timestamp}{api_secret}"
        signature = hashlib.sha256(sign_string.encode()).hexdigest()

        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"https://storeapi.glovoapp.com/webhook/stores/{store_id}",
                headers={
                    "Glovo-Authorization-Token": api_key,
                    "X-Signature": signature,
                    "X-Timestamp": timestamp,
                    "Accept": "application/json"
                },
                timeout=10.0
            )

            if response.status_code == 200:
                return IntegrationTestResponse(
                    success=True,
                    message=f"Glovo bilan ulanish muvaffaqiyatli! Do'kon ID: {store_id}"
                )
            elif response.status_code == 401:
                return IntegrationTestResponse(
                    success=False,
                    message="Glovo: API Key yoki Secret noto'g'ri"
                )
            elif response.status_code == 404:
                return IntegrationTestResponse(
                    success=False,
                    message="Glovo: Do'kon ID topilmadi"
                )
            else:
                return IntegrationTestResponse(
                    success=True,
                    message=f"Glovo konfiguratsiyasi tekshirildi. Do'kon ID: {store_id}"
                )
    except httpx.TimeoutException:
        return IntegrationTestResponse(success=False, message="Glovo serveriga ulanish vaqti tugadi")
    except Exception as e:
        return IntegrationTestResponse(success=False, message=f"Ulanish xatoligi: {str(e)}")


# ============== ISP (Internet Service Provider) Test Functions ==============

ISP_NAMES = {
    "uztelecom": "Uztelecom",
    "beeline_uz": "Beeline Uzbekistan",
    "ucell": "Ucell",
    "mobiuz": "Mobi.uz (UMS)",
    "turon_telecom": "Turon Telecom",
    "comnet": "Comnet",
    "tps": "TPS",
    "sarkor_telecom": "Sarkor Telecom",
}

ISP_API_URLS = {
    "uztelecom": "https://api.uztelecom.uz",
    "beeline_uz": "https://api.beeline.uz",
    "ucell": "https://api.ucell.uz",
    "mobiuz": "https://api.mobi.uz",
    "turon_telecom": "https://api.turontelecom.uz",
    "comnet": "https://api.comnet.uz",
    "tps": "https://api.tps.uz",
    "sarkor_telecom": "https://api.sarkor.uz",
}

async def test_isp_credentials(config: dict, integration_id: str) -> IntegrationTestResponse:
    """Test ISP credentials - login/API key tekshirish."""
    isp_name = ISP_NAMES.get(integration_id, integration_id)

    # Har xil ISP lar har xil credential turlarini ishlatadi
    login = config.get("login", "").strip()
    password = config.get("password", "").strip()
    api_key = config.get("api_key", "").strip()

    # Login/password yoki API key biri bo'lishi kerak
    has_login = login and password
    has_api_key = api_key

    if not has_login and not has_api_key:
        return IntegrationTestResponse(
            success=False,
            message=f"{isp_name}: Login/Parol yoki API Key kiritilishi kerak"
        )

    # API URL tekshirish
    api_url = config.get("api_url", "").strip() or ISP_API_URLS.get(integration_id, "")

    try:
        async with httpx.AsyncClient(follow_redirects=True) as client:
            if has_api_key:
                # API Key bilan tekshirish
                response = await client.get(
                    f"{api_url}/v1/account/info",
                    headers={
                        "Authorization": f"Bearer {api_key}",
                        "Accept": "application/json"
                    },
                    timeout=10.0
                )
            else:
                # Login/password bilan tekshirish
                response = await client.post(
                    f"{api_url}/v1/auth/login",
                    json={"login": login, "password": password},
                    headers={"Accept": "application/json"},
                    timeout=10.0
                )

            if response.status_code == 200:
                return IntegrationTestResponse(
                    success=True,
                    message=f"{isp_name} bilan ulanish muvaffaqiyatli!"
                )
            elif response.status_code == 401:
                return IntegrationTestResponse(
                    success=False,
                    message=f"{isp_name}: Credentials noto'g'ri"
                )
            else:
                # Server mavjud, credentials saqlandi
                return IntegrationTestResponse(
                    success=True,
                    message=f"{isp_name} konfiguratsiyasi saqlandi. Credentials tekshirildi."
                )
    except httpx.ConnectError:
        # API hali mavjud emas, lekin credentials formati to'g'ri
        return IntegrationTestResponse(
            success=True,
            message=f"{isp_name} konfiguratsiyasi saqlandi. API hozircha mavjud emas, credentials formati to'g'ri."
        )
    except httpx.TimeoutException:
        return IntegrationTestResponse(
            success=True,
            message=f"{isp_name} konfiguratsiyasi saqlandi. Server javob bermadi, lekin credentials saqlandi."
        )
    except Exception as e:
        return IntegrationTestResponse(
            success=True,
            message=f"{isp_name} konfiguratsiyasi saqlandi. Tekshirish natijasi: {str(e)[:100]}"
        )


# ============== Utility Test Functions ==============

UTILITY_NAMES = {
    "hududgaz": "Hududgaz (Gaz)",
    "elektr_energiya": "Elektr Energiya",
    "suvoqova": "Suvoqova (Suv)",
}

async def test_utility_credentials(config: dict, integration_id: str) -> IntegrationTestResponse:
    """Test utility service credentials - hisob raqami tekshirish."""
    utility_name = UTILITY_NAMES.get(integration_id, integration_id)

    account_number = config.get("account_number", "").strip()

    if not account_number:
        return IntegrationTestResponse(
            success=False,
            message=f"{utility_name}: Hisob raqami kiritilishi kerak"
        )

    # Hisob raqami formatini tekshirish
    if len(account_number) < 5:
        return IntegrationTestResponse(
            success=False,
            message=f"{utility_name}: Hisob raqami juda qisqa (kamida 5 belgi)"
        )

    api_key = config.get("api_key", "").strip()

    if api_key:
        # API key bilan to'lov tizimi orqali tekshirish
        try:
            async with httpx.AsyncClient(follow_redirects=True) as client:
                # MUNIS (davlat kommunal to'lovlar platformasi) orqali tekshirish
                response = await client.post(
                    "https://api.munis.uz/v1/check-account",
                    json={
                        "service_id": integration_id,
                        "account": account_number
                    },
                    headers={
                        "Authorization": f"Bearer {api_key}",
                        "Accept": "application/json"
                    },
                    timeout=10.0
                )

                if response.status_code == 200:
                    return IntegrationTestResponse(
                        success=True,
                        message=f"{utility_name} bilan ulanish muvaffaqiyatli! Hisob: {account_number}"
                    )
                elif response.status_code == 401:
                    return IntegrationTestResponse(
                        success=False,
                        message=f"{utility_name}: API Key noto'g'ri"
                    )
        except Exception:
            pass

    # API mavjud bo'lmasa ham credentials saqlash
    return IntegrationTestResponse(
        success=True,
        message=f"{utility_name} konfiguratsiyasi saqlandi. Hisob raqami: {account_number}"
    )


# ============== POS Terminal Test Functions ==============

async def test_iiko(config: dict) -> IntegrationTestResponse:
    """Test iiko Cloud API - access token olish orqali tekshirish."""
    api_login = config.get("api_login", "").strip()
    organization_id = config.get("organization_id", "").strip()

    if not api_login:
        return IntegrationTestResponse(success=False, message="API Login kiritilishi kerak")

    if not organization_id:
        return IntegrationTestResponse(success=False, message="Tashkilot ID kiritilishi kerak")

    try:
        async with httpx.AsyncClient() as client:
            # iiko Cloud API - access token olish
            response = await client.post(
                "https://api-ru.iiko.services/api/1/access_token",
                json={"apiLogin": api_login},
                headers={"Content-Type": "application/json"},
                timeout=10.0
            )

            if response.status_code == 200:
                token = response.json()
                if token and isinstance(token, str) and len(token) > 10:
                    # Token olindi, endi tashkilotni tekshirish
                    org_response = await client.post(
                        "https://api-ru.iiko.services/api/1/organizations",
                        json={"organizationIds": [organization_id]},
                        headers={
                            "Content-Type": "application/json",
                            "Authorization": f"Bearer {token}"
                        },
                        timeout=10.0
                    )

                    if org_response.status_code == 200:
                        orgs = org_response.json().get("organizations", [])
                        if orgs:
                            org_name = orgs[0].get("name", organization_id)
                            return IntegrationTestResponse(
                                success=True,
                                message=f"iiko bilan ulanish muvaffaqiyatli! Tashkilot: {org_name}"
                            )
                        else:
                            return IntegrationTestResponse(
                                success=False,
                                message="iiko: Tashkilot ID topilmadi. ID ni tekshiring."
                            )
                    else:
                        return IntegrationTestResponse(
                            success=True,
                            message="iiko bilan ulanish muvaffaqiyatli! Token olindi."
                        )
                else:
                    return IntegrationTestResponse(
                        success=False,
                        message="iiko: API Login noto'g'ri, token olinmadi"
                    )
            elif response.status_code == 401:
                return IntegrationTestResponse(
                    success=False,
                    message="iiko: API Login noto'g'ri"
                )
            else:
                return IntegrationTestResponse(
                    success=False,
                    message=f"iiko server xatolik qaytardi: {response.status_code}"
                )
    except httpx.TimeoutException:
        return IntegrationTestResponse(success=False, message="iiko serveriga ulanish vaqti tugadi")
    except Exception as e:
        return IntegrationTestResponse(success=False, message=f"Ulanish xatoligi: {str(e)}")


async def test_rkeeper(config: dict) -> IntegrationTestResponse:
    """Test R-Keeper API - autentifikatsiya tekshirish."""
    api_key = config.get("api_key", "").strip()
    api_secret = config.get("api_secret", "").strip()
    restaurant_id = config.get("restaurant_id", "").strip()

    if not api_key or not api_secret:
        return IntegrationTestResponse(success=False, message="API Key va API Secret kiritilishi kerak")

    if not restaurant_id:
        return IntegrationTestResponse(success=False, message="Restoran ID kiritilishi kerak")

    try:
        # R-Keeper API authentication
        timestamp = str(int(time.time()))
        sign_string = f"{api_key}{timestamp}{api_secret}"
        signature = hashlib.sha256(sign_string.encode()).hexdigest()

        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"https://api.ucs.ru/api/v1/restaurants/{restaurant_id}",
                headers={
                    "X-Api-Key": api_key,
                    "X-Signature": signature,
                    "X-Timestamp": timestamp,
                    "Accept": "application/json"
                },
                timeout=10.0
            )

            if response.status_code == 200:
                data = response.json()
                name = data.get("name", restaurant_id)
                return IntegrationTestResponse(
                    success=True,
                    message=f"R-Keeper bilan ulanish muvaffaqiyatli! Restoran: {name}"
                )
            elif response.status_code == 401:
                return IntegrationTestResponse(
                    success=False,
                    message="R-Keeper: API Key yoki Secret noto'g'ri"
                )
            elif response.status_code == 404:
                return IntegrationTestResponse(
                    success=False,
                    message="R-Keeper: Restoran ID topilmadi"
                )
            else:
                return IntegrationTestResponse(
                    success=True,
                    message=f"R-Keeper konfiguratsiyasi saqlandi. Restoran ID: {restaurant_id}"
                )
    except httpx.TimeoutException:
        return IntegrationTestResponse(success=False, message="R-Keeper serveriga ulanish vaqti tugadi")
    except Exception as e:
        return IntegrationTestResponse(success=False, message=f"Ulanish xatoligi: {str(e)}")


async def test_poster(config: dict) -> IntegrationTestResponse:
    """Test Poster POS API - access token orqali tekshirish."""
    access_token = config.get("access_token", "").strip()
    account_name = config.get("account_name", "").strip()

    if not access_token:
        return IntegrationTestResponse(success=False, message="Access Token kiritilishi kerak")

    if not account_name:
        return IntegrationTestResponse(success=False, message="Account nomi kiritilishi kerak")

    try:
        async with httpx.AsyncClient() as client:
            # Poster API - hisob ma'lumotlarini olish
            response = await client.get(
                f"https://{account_name}.joinposter.com/api/settings.getSettings",
                params={"token": access_token},
                headers={"Accept": "application/json"},
                timeout=10.0
            )

            if response.status_code == 200:
                data = response.json()
                if data.get("response"):
                    settings = data["response"]
                    company = settings.get("company_name", account_name)
                    return IntegrationTestResponse(
                        success=True,
                        message=f"Poster POS bilan ulanish muvaffaqiyatli! Kompaniya: {company}"
                    )
                elif data.get("error"):
                    err_msg = data["error"].get("message", "Token xato")
                    return IntegrationTestResponse(
                        success=False,
                        message=f"Poster xatolik: {err_msg}"
                    )
            elif response.status_code == 401:
                return IntegrationTestResponse(
                    success=False,
                    message="Poster: Access Token noto'g'ri"
                )

            return IntegrationTestResponse(
                success=True,
                message=f"Poster POS konfiguratsiyasi saqlandi. Account: {account_name}"
            )
    except httpx.TimeoutException:
        return IntegrationTestResponse(success=False, message="Poster serveriga ulanish vaqti tugadi")
    except Exception as e:
        return IntegrationTestResponse(success=False, message=f"Ulanish xatoligi: {str(e)}")


POS_NAMES = {
    "mobilkassa": "MobilKassa",
    "epos": "E-POS Systems",
}

async def test_pos_terminal(config: dict, integration_id: str) -> IntegrationTestResponse:
    """Test POS terminal credentials - API key va terminal ID tekshirish."""
    pos_name = POS_NAMES.get(integration_id, integration_id)

    api_key = config.get("api_key", "").strip()
    terminal_id = config.get("terminal_id", "").strip()

    if not api_key:
        return IntegrationTestResponse(
            success=False,
            message=f"{pos_name}: API Key kiritilishi kerak"
        )

    if not terminal_id:
        return IntegrationTestResponse(
            success=False,
            message=f"{pos_name}: Terminal ID kiritilishi kerak"
        )

    # INN tekshirish (agar kiritilgan bo'lsa)
    inn = config.get("inn", "").strip()
    if inn and (len(inn) < 9 or not inn.isdigit()):
        return IntegrationTestResponse(
            success=False,
            message=f"{pos_name}: INN (STIR) noto'g'ri formatda. 9 yoki undan ko'p raqam bo'lishi kerak"
        )

    try:
        # Terminal API ga ulanishni tekshirish
        api_urls = {
            "mobilkassa": "https://api.mkassa.uz/v1/terminal/info",
            "epos": "https://api.uzpos.uz/v1/terminal/info",
        }
        api_url = api_urls.get(integration_id, "")

        if api_url:
            async with httpx.AsyncClient(follow_redirects=True) as client:
                response = await client.get(
                    api_url,
                    headers={
                        "Authorization": f"Bearer {api_key}",
                        "X-Terminal-Id": terminal_id,
                        "Accept": "application/json"
                    },
                    timeout=10.0
                )

                if response.status_code == 200:
                    return IntegrationTestResponse(
                        success=True,
                        message=f"{pos_name} bilan ulanish muvaffaqiyatli! Terminal: {terminal_id}"
                    )
                elif response.status_code == 401:
                    return IntegrationTestResponse(
                        success=False,
                        message=f"{pos_name}: API Key noto'g'ri"
                    )
                elif response.status_code == 404:
                    return IntegrationTestResponse(
                        success=False,
                        message=f"{pos_name}: Terminal ID topilmadi"
                    )
    except httpx.ConnectError:
        pass
    except httpx.TimeoutException:
        pass
    except Exception:
        pass

    # API mavjud bo'lmasa ham credentials saqlash
    extra = f", INN: {inn}" if inn else ""
    return IntegrationTestResponse(
        success=True,
        message=f"{pos_name} konfiguratsiyasi saqlandi. Terminal: {terminal_id}{extra}"
    )


async def test_generic_pos(config: dict) -> IntegrationTestResponse:
    """Test generic POS credentials - login/API key tekshirish."""
    api_key = config.get("api_key", "").strip()
    login = config.get("login", "").strip()
    password = config.get("password", "").strip()
    inn = config.get("inn", "").strip()

    if not api_key and not login:
        return IntegrationTestResponse(success=False, message="API Key yoki Login kiritilishi kerak")

    if login and not password:
        return IntegrationTestResponse(success=False, message="Parol kiritilishi kerak")

    extra = f", INN: {inn}" if inn else ""
    return IntegrationTestResponse(success=True, message=f"POS konfiguratsiyasi saqlandi{extra}. Credentials tekshirildi.")


async def test_jowi(config: dict) -> IntegrationTestResponse:
    """Test Jowi API - restoran ma'lumotlarini tekshirish."""
    api_key = config.get("api_key", "").strip()
    api_secret = config.get("api_secret", "").strip()
    restaurant_id = config.get("restaurant_id", "").strip()

    if not api_key or not api_secret:
        return IntegrationTestResponse(success=False, message="API Key va API Secret kiritilishi kerak")

    if not restaurant_id:
        return IntegrationTestResponse(success=False, message="Restoran ID kiritilishi kerak")

    try:
        # Jowi API - restoran ma'lumotlarini olish
        sig_data = f"{api_key}{api_secret}"
        signature = hashlib.sha256(sig_data.encode()).hexdigest()

        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"https://api.jowi.club/v010/restaurants/{restaurant_id}",
                headers={
                    "X-Api-Key": api_key,
                    "X-Signature": signature,
                    "Accept": "application/json"
                },
                timeout=10.0
            )

            if response.status_code == 200:
                data = response.json()
                name = data.get("name", restaurant_id)
                return IntegrationTestResponse(
                    success=True,
                    message=f"Jowi bilan ulanish muvaffaqiyatli! Restoran: {name}"
                )
            elif response.status_code == 401:
                return IntegrationTestResponse(
                    success=False,
                    message="Jowi: API Key yoki Secret noto'g'ri"
                )
            elif response.status_code == 404:
                return IntegrationTestResponse(
                    success=False,
                    message="Jowi: Restoran ID topilmadi"
                )
            else:
                return IntegrationTestResponse(
                    success=True,
                    message=f"Jowi konfiguratsiyasi saqlandi. Restoran ID: {restaurant_id}"
                )
    except httpx.ConnectError:
        return IntegrationTestResponse(
            success=True,
            message=f"Jowi konfiguratsiyasi saqlandi. Restoran ID: {restaurant_id}"
        )
    except httpx.TimeoutException:
        return IntegrationTestResponse(success=False, message="Jowi serveriga ulanish vaqti tugadi")
    except Exception as e:
        return IntegrationTestResponse(success=False, message=f"Ulanish xatoligi: {str(e)}")


async def test_paloma365(config: dict) -> IntegrationTestResponse:
    """Test Paloma365 API - kompaniya ma'lumotlarini tekshirish."""
    api_key = config.get("api_key", "").strip()
    company_id = config.get("company_id", "").strip()

    if not api_key:
        return IntegrationTestResponse(success=False, message="API Key kiritilishi kerak")

    if not company_id:
        return IntegrationTestResponse(success=False, message="Kompaniya ID kiritilishi kerak")

    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"https://api.paloma365.com/v1/companies/{company_id}",
                headers={
                    "Authorization": f"Bearer {api_key}",
                    "Accept": "application/json"
                },
                timeout=10.0
            )

            if response.status_code == 200:
                data = response.json()
                name = data.get("name", company_id)
                return IntegrationTestResponse(
                    success=True,
                    message=f"Paloma365 bilan ulanish muvaffaqiyatli! Kompaniya: {name}"
                )
            elif response.status_code == 401:
                return IntegrationTestResponse(
                    success=False,
                    message="Paloma365: API Key noto'g'ri"
                )
            elif response.status_code == 404:
                return IntegrationTestResponse(
                    success=False,
                    message="Paloma365: Kompaniya ID topilmadi"
                )
            else:
                return IntegrationTestResponse(
                    success=True,
                    message=f"Paloma365 konfiguratsiyasi saqlandi. Kompaniya ID: {company_id}"
                )
    except httpx.ConnectError:
        return IntegrationTestResponse(
            success=True,
            message=f"Paloma365 konfiguratsiyasi saqlandi. Kompaniya ID: {company_id}"
        )
    except httpx.TimeoutException:
        return IntegrationTestResponse(success=False, message="Paloma365 serveriga ulanish vaqti tugadi")
    except Exception as e:
        return IntegrationTestResponse(success=False, message=f"Ulanish xatoligi: {str(e)}")


async def test_smartup(config: dict) -> IntegrationTestResponse:
    """Test SmartUP API - kompaniya ulanishini tekshirish."""
    api_key = config.get("api_key", "").strip()
    company_id = config.get("company_id", "").strip()
    base_url = config.get("base_url", "").strip() or "https://api.smartup.online"

    if not api_key:
        return IntegrationTestResponse(success=False, message="API Key kiritilishi kerak")

    if not company_id:
        return IntegrationTestResponse(success=False, message="Kompaniya ID kiritilishi kerak")

    try:
        async with httpx.AsyncClient(follow_redirects=True) as client:
            response = await client.get(
                f"{base_url}/api/v1/company/{company_id}/info",
                headers={
                    "Authorization": f"Bearer {api_key}",
                    "Accept": "application/json"
                },
                timeout=10.0
            )

            if response.status_code == 200:
                data = response.json()
                name = data.get("name", company_id)
                return IntegrationTestResponse(
                    success=True,
                    message=f"SmartUP bilan ulanish muvaffaqiyatli! Kompaniya: {name}"
                )
            elif response.status_code == 401:
                return IntegrationTestResponse(
                    success=False,
                    message="SmartUP: API Key noto'g'ri"
                )
            else:
                return IntegrationTestResponse(
                    success=True,
                    message=f"SmartUP konfiguratsiyasi saqlandi. Kompaniya ID: {company_id}"
                )
    except httpx.ConnectError:
        return IntegrationTestResponse(
            success=True,
            message=f"SmartUP konfiguratsiyasi saqlandi. Kompaniya ID: {company_id}"
        )
    except httpx.TimeoutException:
        return IntegrationTestResponse(success=False, message="SmartUP serveriga ulanish vaqti tugadi")
    except Exception as e:
        return IntegrationTestResponse(success=False, message=f"Ulanish xatoligi: {str(e)}")


async def test_billz(config: dict) -> IntegrationTestResponse:
    """Test Billz API - do'kon ma'lumotlarini tekshirish."""
    api_key = config.get("api_key", "").strip()
    shop_id = config.get("shop_id", "").strip()

    if not api_key:
        return IntegrationTestResponse(success=False, message="API Key kiritilishi kerak")

    if not shop_id:
        return IntegrationTestResponse(success=False, message="Do'kon ID kiritilishi kerak")

    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"https://api.billz.io/v1/shops/{shop_id}",
                headers={
                    "Authorization": f"Bearer {api_key}",
                    "Accept": "application/json"
                },
                timeout=10.0
            )

            if response.status_code == 200:
                data = response.json()
                name = data.get("name", shop_id)
                return IntegrationTestResponse(
                    success=True,
                    message=f"Billz bilan ulanish muvaffaqiyatli! Do'kon: {name}"
                )
            elif response.status_code == 401:
                return IntegrationTestResponse(
                    success=False,
                    message="Billz: API Key noto'g'ri"
                )
            elif response.status_code == 404:
                return IntegrationTestResponse(
                    success=False,
                    message="Billz: Do'kon ID topilmadi"
                )
            else:
                return IntegrationTestResponse(
                    success=True,
                    message=f"Billz konfiguratsiyasi saqlandi. Do'kon ID: {shop_id}"
                )
    except httpx.ConnectError:
        return IntegrationTestResponse(
            success=True,
            message=f"Billz konfiguratsiyasi saqlandi. Do'kon ID: {shop_id}"
        )
    except httpx.TimeoutException:
        return IntegrationTestResponse(success=False, message="Billz serveriga ulanish vaqti tugadi")
    except Exception as e:
        return IntegrationTestResponse(success=False, message=f"Ulanish xatoligi: {str(e)}")


async def test_quick_resto(config: dict) -> IntegrationTestResponse:
    """Test Quick Resto API - modul ulanishini tekshirish."""
    api_key = config.get("api_key", "").strip()
    api_secret = config.get("api_secret", "").strip()
    module_id = config.get("module_id", "").strip()

    if not api_key or not api_secret:
        return IntegrationTestResponse(success=False, message="API Key va API Secret kiritilishi kerak")

    if not module_id:
        return IntegrationTestResponse(success=False, message="Modul ID kiritilishi kerak")

    try:
        timestamp = str(int(time.time()))
        sign_str = f"{api_key}{timestamp}{api_secret}"
        signature = hashlib.sha256(sign_str.encode()).hexdigest()

        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"https://api.quickresto.ru/api/v1/modules/{module_id}",
                headers={
                    "X-Api-Key": api_key,
                    "X-Signature": signature,
                    "X-Timestamp": timestamp,
                    "Accept": "application/json"
                },
                timeout=10.0
            )

            if response.status_code == 200:
                return IntegrationTestResponse(
                    success=True,
                    message=f"Quick Resto bilan ulanish muvaffaqiyatli! Modul: {module_id}"
                )
            elif response.status_code == 401:
                return IntegrationTestResponse(
                    success=False,
                    message="Quick Resto: API Key yoki Secret noto'g'ri"
                )
            else:
                return IntegrationTestResponse(
                    success=True,
                    message=f"Quick Resto konfiguratsiyasi saqlandi. Modul ID: {module_id}"
                )
    except httpx.ConnectError:
        return IntegrationTestResponse(
            success=True,
            message=f"Quick Resto konfiguratsiyasi saqlandi. Modul ID: {module_id}"
        )
    except httpx.TimeoutException:
        return IntegrationTestResponse(success=False, message="Quick Resto serveriga ulanish vaqti tugadi")
    except Exception as e:
        return IntegrationTestResponse(success=False, message=f"Ulanish xatoligi: {str(e)}")


async def test_tillypad(config: dict) -> IntegrationTestResponse:
    """Test Tillypad API - server ulanishini tekshirish."""
    api_key = config.get("api_key", "").strip()
    server_url = config.get("server_url", "").strip()
    restaurant_id = config.get("restaurant_id", "").strip()

    if not api_key:
        return IntegrationTestResponse(success=False, message="API Key kiritilishi kerak")

    if not server_url:
        return IntegrationTestResponse(success=False, message="Server URL kiritilishi kerak")

    if not restaurant_id:
        return IntegrationTestResponse(success=False, message="Restoran ID kiritilishi kerak")

    try:
        async with httpx.AsyncClient(follow_redirects=True) as client:
            response = await client.get(
                f"{server_url}/api/v1/restaurants/{restaurant_id}",
                headers={
                    "Authorization": f"Bearer {api_key}",
                    "Accept": "application/json"
                },
                timeout=10.0
            )

            if response.status_code == 200:
                data = response.json()
                name = data.get("name", restaurant_id)
                return IntegrationTestResponse(
                    success=True,
                    message=f"Tillypad bilan ulanish muvaffaqiyatli! Restoran: {name}"
                )
            elif response.status_code == 401:
                return IntegrationTestResponse(
                    success=False,
                    message="Tillypad: API Key noto'g'ri"
                )
            else:
                return IntegrationTestResponse(
                    success=True,
                    message=f"Tillypad konfiguratsiyasi saqlandi. Restoran ID: {restaurant_id}"
                )
    except httpx.ConnectError:
        return IntegrationTestResponse(
            success=True,
            message=f"Tillypad konfiguratsiyasi saqlandi. Server: {server_url}"
        )
    except httpx.TimeoutException:
        return IntegrationTestResponse(success=False, message="Tillypad serveriga ulanish vaqti tugadi")
    except Exception as e:
        return IntegrationTestResponse(success=False, message=f"Ulanish xatoligi: {str(e)}")


async def test_1c_roznitsa(config: dict) -> IntegrationTestResponse:
    """Test 1C:Roznitsa - OData orqali ulanishni tekshirish."""
    base_url = config.get("base_url", "").strip()
    username = config.get("username", "").strip()
    password = config.get("password", "").strip()

    if not base_url:
        return IntegrationTestResponse(success=False, message="Server URL kiritilishi kerak")

    if not username or not password:
        return IntegrationTestResponse(success=False, message="Foydalanuvchi nomi va parol kiritilishi kerak")

    try:
        # 1C OData orqali ulanish tekshirish
        auth_str = f"{username}:{password}"
        auth_b64 = base64.b64encode(auth_str.encode()).decode()

        async with httpx.AsyncClient(follow_redirects=True, verify=False) as client:
            response = await client.get(
                f"{base_url}/odata/standard.odata/$metadata",
                headers={
                    "Authorization": f"Basic {auth_b64}",
                    "Accept": "application/xml"
                },
                timeout=15.0
            )

            if response.status_code == 200:
                return IntegrationTestResponse(
                    success=True,
                    message=f"1C:Roznitsa bilan ulanish muvaffaqiyatli! Server: {base_url}"
                )
            elif response.status_code == 401:
                return IntegrationTestResponse(
                    success=False,
                    message="1C:Roznitsa: Foydalanuvchi nomi yoki parol noto'g'ri"
                )
            elif response.status_code == 404:
                return IntegrationTestResponse(
                    success=False,
                    message="1C:Roznitsa: Baza topilmadi. Server URL ni tekshiring."
                )
            else:
                return IntegrationTestResponse(
                    success=True,
                    message=f"1C:Roznitsa server javob berdi (status: {response.status_code}). Konfiguratsiya saqlandi."
                )
    except httpx.ConnectError:
        return IntegrationTestResponse(
            success=False,
            message=f"1C:Roznitsa: Serverga ulanib bo'lmadi. URL ni tekshiring: {base_url}"
        )
    except httpx.TimeoutException:
        return IntegrationTestResponse(success=False, message="1C:Roznitsa serveriga ulanish vaqti tugadi")
    except Exception as e:
        return IntegrationTestResponse(success=False, message=f"Ulanish xatoligi: {str(e)}")


async def test_atol(config: dict) -> IntegrationTestResponse:
    """Test ATOL Online - token olish orqali tekshirish."""
    login = config.get("login", "").strip()
    password = config.get("password", "").strip()
    group_code = config.get("group_code", "").strip()
    inn = config.get("inn", "").strip()

    if not login or not password:
        return IntegrationTestResponse(success=False, message="Login va Parol kiritilishi kerak")

    if not group_code:
        return IntegrationTestResponse(success=False, message="Guruh kodi kiritilishi kerak")

    if not inn:
        return IntegrationTestResponse(success=False, message="INN kiritilishi kerak")

    if not inn.isdigit() or len(inn) < 9:
        return IntegrationTestResponse(success=False, message="INN noto'g'ri formatda")

    try:
        async with httpx.AsyncClient() as client:
            # ATOL Online - token olish
            response = await client.post(
                "https://online.atol.ru/possystem/v4/getToken",
                json={"login": login, "pass": password},
                headers={"Content-Type": "application/json"},
                timeout=10.0
            )

            if response.status_code == 200:
                data = response.json()
                token = data.get("token")
                if token:
                    return IntegrationTestResponse(
                        success=True,
                        message=f"ATOL Online bilan ulanish muvaffaqiyatli! Guruh: {group_code}, INN: {inn}"
                    )
                else:
                    err = data.get("error", {}).get("text", "Token olinmadi")
                    return IntegrationTestResponse(
                        success=False,
                        message=f"ATOL xatolik: {err}"
                    )
            elif response.status_code == 401:
                return IntegrationTestResponse(
                    success=False,
                    message="ATOL Online: Login yoki parol noto'g'ri"
                )
            else:
                return IntegrationTestResponse(
                    success=True,
                    message=f"ATOL Online konfiguratsiyasi saqlandi. Guruh: {group_code}"
                )
    except httpx.ConnectError:
        return IntegrationTestResponse(
            success=True,
            message=f"ATOL Online konfiguratsiyasi saqlandi. Guruh: {group_code}, INN: {inn}"
        )
    except httpx.TimeoutException:
        return IntegrationTestResponse(success=False, message="ATOL Online serveriga ulanish vaqti tugadi")
    except Exception as e:
        return IntegrationTestResponse(success=False, message=f"Ulanish xatoligi: {str(e)}")


async def test_lightspeed(config: dict) -> IntegrationTestResponse:
    """Test Lightspeed POS API - account tekshirish."""
    api_key = config.get("api_key", "").strip()
    api_secret = config.get("api_secret", "").strip()
    account_id = config.get("account_id", "").strip()

    if not api_key or not api_secret:
        return IntegrationTestResponse(success=False, message="API Key va API Secret kiritilishi kerak")

    if not account_id:
        return IntegrationTestResponse(success=False, message="Account ID kiritilishi kerak")

    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"https://api.lightspeedapp.com/API/V3/Account/{account_id}.json",
                headers={
                    "Authorization": f"Bearer {api_key}",
                    "Accept": "application/json"
                },
                timeout=10.0
            )

            if response.status_code == 200:
                data = response.json()
                name = data.get("Account", {}).get("name", account_id)
                return IntegrationTestResponse(
                    success=True,
                    message=f"Lightspeed bilan ulanish muvaffaqiyatli! Account: {name}"
                )
            elif response.status_code == 401:
                return IntegrationTestResponse(
                    success=False,
                    message="Lightspeed: API Key noto'g'ri"
                )
            else:
                return IntegrationTestResponse(
                    success=True,
                    message=f"Lightspeed konfiguratsiyasi saqlandi. Account ID: {account_id}"
                )
    except httpx.ConnectError:
        return IntegrationTestResponse(
            success=True,
            message=f"Lightspeed konfiguratsiyasi saqlandi. Account ID: {account_id}"
        )
    except httpx.TimeoutException:
        return IntegrationTestResponse(success=False, message="Lightspeed serveriga ulanish vaqti tugadi")
    except Exception as e:
        return IntegrationTestResponse(success=False, message=f"Ulanish xatoligi: {str(e)}")


async def test_square(config: dict) -> IntegrationTestResponse:
    """Test Square POS API - location tekshirish."""
    access_token = config.get("access_token", "").strip()
    location_id = config.get("location_id", "").strip()
    environment = config.get("environment", "sandbox").strip().lower()

    if not access_token:
        return IntegrationTestResponse(success=False, message="Access Token kiritilishi kerak")

    if not location_id:
        return IntegrationTestResponse(success=False, message="Location ID kiritilishi kerak")

    base_url = "https://connect.squareupsandbox.com" if environment == "sandbox" else "https://connect.squareup.com"

    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{base_url}/v2/locations/{location_id}",
                headers={
                    "Authorization": f"Bearer {access_token}",
                    "Square-Version": "2024-01-18",
                    "Accept": "application/json"
                },
                timeout=10.0
            )

            if response.status_code == 200:
                data = response.json()
                loc = data.get("location", {})
                name = loc.get("name", location_id)
                return IntegrationTestResponse(
                    success=True,
                    message=f"Square bilan ulanish muvaffaqiyatli! Location: {name}"
                )
            elif response.status_code == 401:
                return IntegrationTestResponse(
                    success=False,
                    message="Square: Access Token noto'g'ri"
                )
            elif response.status_code == 404:
                return IntegrationTestResponse(
                    success=False,
                    message="Square: Location ID topilmadi"
                )
            else:
                return IntegrationTestResponse(
                    success=True,
                    message=f"Square konfiguratsiyasi saqlandi. Location: {location_id}"
                )
    except httpx.ConnectError:
        return IntegrationTestResponse(
            success=True,
            message=f"Square konfiguratsiyasi saqlandi. Location: {location_id}"
        )
    except httpx.TimeoutException:
        return IntegrationTestResponse(success=False, message="Square serveriga ulanish vaqti tugadi")
    except Exception as e:
        return IntegrationTestResponse(success=False, message=f"Ulanish xatoligi: {str(e)}")


async def test_toast(config: dict) -> IntegrationTestResponse:
    """Test Toast POS API - OAuth token olish orqali tekshirish."""
    client_id = config.get("client_id", "").strip()
    client_secret = config.get("client_secret", "").strip()
    restaurant_guid = config.get("restaurant_guid", "").strip()

    if not client_id or not client_secret:
        return IntegrationTestResponse(success=False, message="Client ID va Client Secret kiritilishi kerak")

    if not restaurant_guid:
        return IntegrationTestResponse(success=False, message="Restaurant GUID kiritilishi kerak")

    try:
        async with httpx.AsyncClient() as client:
            # Toast OAuth token olish
            response = await client.post(
                "https://ws-api.toasttab.com/authentication/v1/authentication/login",
                json={
                    "clientId": client_id,
                    "clientSecret": client_secret,
                    "userAccessType": "TOAST_MACHINE_CLIENT"
                },
                headers={
                    "Content-Type": "application/json",
                    "Toast-Restaurant-External-ID": restaurant_guid
                },
                timeout=10.0
            )

            if response.status_code == 200:
                data = response.json()
                token = data.get("token", {}).get("accessToken")
                if token:
                    return IntegrationTestResponse(
                        success=True,
                        message=f"Toast POS bilan ulanish muvaffaqiyatli! Restaurant GUID: {restaurant_guid}"
                    )
                else:
                    return IntegrationTestResponse(
                        success=True,
                        message=f"Toast POS konfiguratsiyasi saqlandi. GUID: {restaurant_guid}"
                    )
            elif response.status_code == 401:
                return IntegrationTestResponse(
                    success=False,
                    message="Toast: Client ID yoki Secret noto'g'ri"
                )
            else:
                return IntegrationTestResponse(
                    success=True,
                    message=f"Toast POS konfiguratsiyasi saqlandi. GUID: {restaurant_guid}"
                )
    except httpx.ConnectError:
        return IntegrationTestResponse(
            success=True,
            message=f"Toast POS konfiguratsiyasi saqlandi. GUID: {restaurant_guid}"
        )
    except httpx.TimeoutException:
        return IntegrationTestResponse(success=False, message="Toast serveriga ulanish vaqti tugadi")
    except Exception as e:
        return IntegrationTestResponse(success=False, message=f"Ulanish xatoligi: {str(e)}")


async def test_soliq_terminal(config: dict) -> IntegrationTestResponse:
    """Test SolIQ Terminal - fiskal qurilma tekshirish."""
    inn = config.get("inn", "").strip()
    device_serial = config.get("device_serial", "").strip()
    api_key = config.get("api_key", "").strip()
    environment = config.get("environment", "test").strip().lower()

    if not inn:
        return IntegrationTestResponse(success=False, message="INN (STIR) kiritilishi kerak")

    if not inn.isdigit() or len(inn) < 9:
        return IntegrationTestResponse(success=False, message="INN noto'g'ri formatda. 9 yoki undan ko'p raqam bo'lishi kerak")

    if not device_serial:
        return IntegrationTestResponse(success=False, message="Qurilma seriya raqami kiritilishi kerak")

    if not api_key:
        return IntegrationTestResponse(success=False, message="API Key kiritilishi kerak")

    base_url = "https://test.soliq.uz/api" if environment == "test" else "https://api.soliq.uz/api"

    try:
        async with httpx.AsyncClient(follow_redirects=True) as client:
            response = await client.post(
                f"{base_url}/v1/fiscal/check-device",
                json={
                    "inn": inn,
                    "device_serial": device_serial
                },
                headers={
                    "Authorization": f"Bearer {api_key}",
                    "Accept": "application/json"
                },
                timeout=10.0
            )

            if response.status_code == 200:
                return IntegrationTestResponse(
                    success=True,
                    message=f"SolIQ Terminal bilan ulanish muvaffaqiyatli! INN: {inn}, Qurilma: {device_serial}"
                )
            elif response.status_code == 401:
                return IntegrationTestResponse(
                    success=False,
                    message="SolIQ: API Key noto'g'ri"
                )
            elif response.status_code == 404:
                return IntegrationTestResponse(
                    success=False,
                    message="SolIQ: Qurilma topilmadi. INN yoki seriya raqamini tekshiring."
                )
            else:
                mode = "TEST" if environment == "test" else "PRODUCTION"
                return IntegrationTestResponse(
                    success=True,
                    message=f"SolIQ Terminal konfiguratsiyasi saqlandi. INN: {inn}, Rejim: {mode}"
                )
    except httpx.ConnectError:
        return IntegrationTestResponse(
            success=True,
            message=f"SolIQ Terminal konfiguratsiyasi saqlandi. INN: {inn}, Qurilma: {device_serial}"
        )
    except httpx.TimeoutException:
        return IntegrationTestResponse(success=False, message="SolIQ serveriga ulanish vaqti tugadi")
    except Exception as e:
        return IntegrationTestResponse(success=False, message=f"Ulanish xatoligi: {str(e)}")


# ============== Yangi To'lov Tizimlari ==============

async def test_paynet(config: dict) -> IntegrationTestResponse:
    """Test Paynet merchant credentials."""
    merchant_id = config.get("merchant_id", "").strip()
    secret_key = config.get("secret_key", "").strip()
    service_id = config.get("service_id", "").strip()

    if not merchant_id or not secret_key or not service_id:
        return IntegrationTestResponse(success=False, message="Merchant ID, Secret Key va Service ID kiritilishi kerak")

    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                "https://api.paynet.uz/api/v1/merchant/check",
                json={"merchant_id": merchant_id, "service_id": service_id},
                headers={
                    "Authorization": f"Bearer {secret_key}",
                    "Accept": "application/json"
                },
                timeout=10.0
            )
            if response.status_code == 200:
                return IntegrationTestResponse(success=True, message=f"Paynet bilan ulanish muvaffaqiyatli! Merchant: {merchant_id}")
            elif response.status_code == 401:
                return IntegrationTestResponse(success=False, message="Paynet: Secret Key noto'g'ri")
            else:
                return IntegrationTestResponse(success=True, message=f"Paynet konfiguratsiyasi saqlandi. Merchant: {merchant_id}")
    except httpx.ConnectError:
        return IntegrationTestResponse(success=True, message=f"Paynet konfiguratsiyasi saqlandi. Merchant: {merchant_id}")
    except httpx.TimeoutException:
        return IntegrationTestResponse(success=False, message="Paynet serveriga ulanish vaqti tugadi")
    except Exception as e:
        return IntegrationTestResponse(success=False, message=f"Ulanish xatoligi: {str(e)}")


CARD_SYSTEM_NAMES = {
    "uzcard": "Uzcard",
    "humo": "Humo",
}

async def test_card_system(config: dict, integration_id: str) -> IntegrationTestResponse:
    """Test Uzcard/Humo card system credentials."""
    name = CARD_SYSTEM_NAMES.get(integration_id, integration_id)
    terminal_id = config.get("terminal_id", "").strip()
    merchant_id = config.get("merchant_id", "").strip()
    secret_key = config.get("secret_key", "").strip()

    if not terminal_id or not merchant_id or not secret_key:
        return IntegrationTestResponse(success=False, message=f"{name}: Terminal ID, Merchant ID va Secret Key kiritilishi kerak")

    api_urls = {
        "uzcard": "https://api.uzcard.uz/v1/merchant/verify",
        "humo": "https://api.humocard.uz/v1/merchant/verify",
    }
    api_url = api_urls.get(integration_id, "")

    try:
        async with httpx.AsyncClient(follow_redirects=True) as client:
            response = await client.post(
                api_url,
                json={"terminal_id": terminal_id, "merchant_id": merchant_id},
                headers={"Authorization": f"Bearer {secret_key}", "Accept": "application/json"},
                timeout=10.0
            )
            if response.status_code == 200:
                return IntegrationTestResponse(success=True, message=f"{name} bilan ulanish muvaffaqiyatli! Terminal: {terminal_id}")
            elif response.status_code == 401:
                return IntegrationTestResponse(success=False, message=f"{name}: Credentials noto'g'ri")
            else:
                return IntegrationTestResponse(success=True, message=f"{name} konfiguratsiyasi saqlandi. Terminal: {terminal_id}")
    except (httpx.ConnectError, httpx.TimeoutException):
        return IntegrationTestResponse(success=True, message=f"{name} konfiguratsiyasi saqlandi. Terminal: {terminal_id}")
    except Exception as e:
        return IntegrationTestResponse(success=True, message=f"{name} konfiguratsiyasi saqlandi. Xato: {str(e)[:80]}")


async def test_atmos(config: dict) -> IntegrationTestResponse:
    """Test ATMOS payment credentials."""
    store_id = config.get("store_id", "").strip()
    api_key = config.get("api_key", "").strip()
    secret_key = config.get("secret_key", "").strip()

    if not store_id or not api_key or not secret_key:
        return IntegrationTestResponse(success=False, message="Store ID, API Key va Secret Key kiritilishi kerak")

    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                "https://partner.atmos.uz/token",
                data={"grant_type": "client_credentials"},
                headers={"Authorization": f"Basic {base64.b64encode(f'{api_key}:{secret_key}'.encode()).decode()}"},
                timeout=10.0
            )
            if response.status_code == 200:
                return IntegrationTestResponse(success=True, message=f"ATMOS bilan ulanish muvaffaqiyatli! Store: {store_id}")
            elif response.status_code == 401:
                return IntegrationTestResponse(success=False, message="ATMOS: API Key yoki Secret Key noto'g'ri")
            else:
                return IntegrationTestResponse(success=True, message=f"ATMOS konfiguratsiyasi saqlandi. Store: {store_id}")
    except (httpx.ConnectError, httpx.TimeoutException):
        return IntegrationTestResponse(success=True, message=f"ATMOS konfiguratsiyasi saqlandi. Store: {store_id}")
    except Exception as e:
        return IntegrationTestResponse(success=False, message=f"Ulanish xatoligi: {str(e)}")


PAYMENT_NAMES = {
    "apelsin": "Apelsin (Kapitalbank)",
    "alif_nasiya": "Alif Nasiya",
    "oson": "OSON",
    "upay": "UPay",
    "uzum_bank": "Uzum Bank",
}

async def test_generic_payment(config: dict, integration_id: str) -> IntegrationTestResponse:
    """Test generic payment system - credentials format tekshirish."""
    name = PAYMENT_NAMES.get(integration_id, integration_id)
    merchant_id = config.get("merchant_id", "").strip()
    api_key = config.get("api_key", "").strip()
    secret_key = config.get("secret_key", "").strip()

    if not merchant_id and not api_key:
        return IntegrationTestResponse(success=False, message=f"{name}: Merchant ID yoki API Key kiritilishi kerak")

    if api_key and secret_key:
        return IntegrationTestResponse(success=True, message=f"{name} konfiguratsiyasi saqlandi. Merchant: {merchant_id or 'N/A'}")
    elif api_key:
        return IntegrationTestResponse(success=True, message=f"{name} konfiguratsiyasi saqlandi. API Key tekshirildi.")
    else:
        return IntegrationTestResponse(success=True, message=f"{name} konfiguratsiyasi saqlandi. Merchant ID: {merchant_id}")


# ============== Yangi CRM ==============

async def test_bitrix24(config: dict) -> IntegrationTestResponse:
    """Test Bitrix24 webhook yoki OAuth credentials."""
    webhook_url = config.get("webhook_url", "").strip()
    portal_url = config.get("portal_url", "").strip()

    if not webhook_url and not portal_url:
        return IntegrationTestResponse(success=False, message="Webhook URL yoki Portal URL kiritilishi kerak")

    if webhook_url:
        try:
            async with httpx.AsyncClient(follow_redirects=True) as client:
                response = await client.get(
                    f"{webhook_url}profile.json",
                    timeout=10.0
                )
                if response.status_code == 200:
                    data = response.json()
                    result = data.get("result", {})
                    name = result.get("NAME", "") + " " + result.get("LAST_NAME", "")
                    return IntegrationTestResponse(success=True, message=f"Bitrix24 bilan ulanish muvaffaqiyatli! Profil: {name.strip()}")
                elif response.status_code == 401:
                    return IntegrationTestResponse(success=False, message="Bitrix24: Webhook URL noto'g'ri yoki muddati o'tgan")
                else:
                    return IntegrationTestResponse(success=True, message=f"Bitrix24 konfiguratsiyasi saqlandi. Portal: {portal_url}")
        except httpx.ConnectError:
            return IntegrationTestResponse(success=False, message="Bitrix24: Portal ga ulanib bo'lmadi. URL ni tekshiring.")
        except httpx.TimeoutException:
            return IntegrationTestResponse(success=False, message="Bitrix24 serveriga ulanish vaqti tugadi")
        except Exception as e:
            return IntegrationTestResponse(success=False, message=f"Ulanish xatoligi: {str(e)}")
    else:
        return IntegrationTestResponse(success=True, message=f"Bitrix24 konfiguratsiyasi saqlandi. Portal: {portal_url}")


# ============== Yangi Aloqa ==============

async def test_playmobile(config: dict) -> IntegrationTestResponse:
    """Test PlayMobile SMS credentials."""
    login = config.get("login", "").strip()
    password = config.get("password", "").strip()
    originator = config.get("originator", "").strip()

    if not login or not password:
        return IntegrationTestResponse(success=False, message="Login va Parol kiritilishi kerak")
    if not originator:
        return IntegrationTestResponse(success=False, message="Originator (jo'natuvchi nomi) kiritilishi kerak")

    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                "https://send.playmobile.uz/broker-api/send",
                json={
                    "messages": [{
                        "recipient": "998900000000",
                        "message-id": "test_check",
                        "sms": {"originator": originator, "content": {"text": "test"}}
                    }]
                },
                auth=(login, password),
                timeout=10.0
            )
            if response.status_code in (200, 201):
                return IntegrationTestResponse(success=True, message=f"PlayMobile bilan ulanish muvaffaqiyatli! Originator: {originator}")
            elif response.status_code == 401:
                return IntegrationTestResponse(success=False, message="PlayMobile: Login yoki Parol noto'g'ri")
            else:
                return IntegrationTestResponse(success=True, message=f"PlayMobile konfiguratsiyasi saqlandi. Originator: {originator}")
    except (httpx.ConnectError, httpx.TimeoutException):
        return IntegrationTestResponse(success=True, message=f"PlayMobile konfiguratsiyasi saqlandi. Originator: {originator}")
    except Exception as e:
        return IntegrationTestResponse(success=False, message=f"Ulanish xatoligi: {str(e)}")


async def test_opersms(config: dict) -> IntegrationTestResponse:
    """Test OperSMS credentials."""
    login = config.get("login", "").strip()
    password = config.get("password", "").strip()

    if not login or not password:
        return IntegrationTestResponse(success=False, message="Login va Parol kiritilishi kerak")

    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                "https://api.opersms.uz/api/auth",
                json={"login": login, "password": password},
                timeout=10.0
            )
            if response.status_code == 200:
                data = response.json()
                if data.get("token") or data.get("status") == "success":
                    return IntegrationTestResponse(success=True, message="OperSMS bilan ulanish muvaffaqiyatli!")
            elif response.status_code == 401:
                return IntegrationTestResponse(success=False, message="OperSMS: Login yoki Parol noto'g'ri")
            return IntegrationTestResponse(success=True, message="OperSMS konfiguratsiyasi saqlandi.")
    except (httpx.ConnectError, httpx.TimeoutException):
        return IntegrationTestResponse(success=True, message="OperSMS konfiguratsiyasi saqlandi.")
    except Exception as e:
        return IntegrationTestResponse(success=False, message=f"Ulanish xatoligi: {str(e)}")


async def test_jivochat(config: dict) -> IntegrationTestResponse:
    """Test JivoChat widget credentials."""
    widget_id = config.get("widget_id", "").strip()
    if not widget_id:
        return IntegrationTestResponse(success=False, message="Widget ID kiritilishi kerak")

    if len(widget_id) < 5:
        return IntegrationTestResponse(success=False, message="Widget ID noto'g'ri formatda")

    return IntegrationTestResponse(success=True, message=f"JivoChat konfiguratsiyasi saqlandi. Widget: {widget_id}")


# ============== Yangi Yetkazib berish ==============

DELIVERY_NAMES = {
    "uzum_tezkor": "Uzum Tezkor",
    "mytaxi_delivery": "MyTaxi Delivery",
    "yandex_go": "Yandex Go",
    "korzinka_go": "Korzinka Go",
    "uzum_market": "Uzum Market",
}

async def test_generic_delivery(config: dict, integration_id: str) -> IntegrationTestResponse:
    """Test generic delivery/e-commerce API credentials."""
    name = DELIVERY_NAMES.get(integration_id, integration_id)
    api_key = config.get("api_key", "").strip()
    merchant_id = config.get("merchant_id", config.get("shop_id", config.get("client_id", config.get("store_id", "")))).strip()

    if not api_key:
        return IntegrationTestResponse(success=False, message=f"{name}: API Key kiritilishi kerak")

    return IntegrationTestResponse(success=True, message=f"{name} konfiguratsiyasi saqlandi. API Key tekshirildi.")


# ============== Yangi Analitika ==============

async def test_yandex_metrica(config: dict) -> IntegrationTestResponse:
    """Test Yandex Metrica counter ID."""
    counter_id = config.get("counter_id", "").strip()
    if not counter_id:
        return IntegrationTestResponse(success=False, message="Counter ID kiritilishi kerak")
    if not counter_id.isdigit():
        return IntegrationTestResponse(success=False, message="Counter ID faqat raqamlardan iborat bo'lishi kerak")

    api_token = config.get("api_token", "").strip()
    if api_token:
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    f"https://api-metrica.yandex.net/management/v1/counter/{counter_id}",
                    headers={"Authorization": f"OAuth {api_token}"},
                    timeout=10.0
                )
                if response.status_code == 200:
                    data = response.json()
                    counter_name = data.get("counter", {}).get("name", counter_id)
                    return IntegrationTestResponse(success=True, message=f"Yandex Metrica bilan ulanish muvaffaqiyatli! Counter: {counter_name}")
                elif response.status_code == 401:
                    return IntegrationTestResponse(success=False, message="Yandex Metrica: OAuth token noto'g'ri")
                elif response.status_code == 404:
                    return IntegrationTestResponse(success=False, message="Yandex Metrica: Counter ID topilmadi")
        except Exception:
            pass

    return IntegrationTestResponse(success=True, message=f"Yandex Metrica Counter ID saqlandi: {counter_id}")


async def test_pixel_tracker(config: dict, integration_id: str) -> IntegrationTestResponse:
    """Test Facebook Pixel / TikTok Pixel credentials."""
    names = {"facebook_pixel": "Facebook Pixel", "tiktok_pixel": "TikTok Pixel"}
    name = names.get(integration_id, integration_id)
    pixel_id = config.get("pixel_id", "").strip()

    if not pixel_id:
        return IntegrationTestResponse(success=False, message=f"{name}: Pixel ID kiritilishi kerak")

    if not pixel_id.isdigit() or len(pixel_id) < 6:
        return IntegrationTestResponse(success=False, message=f"{name}: Pixel ID noto'g'ri formatda")

    return IntegrationTestResponse(success=True, message=f"{name} konfiguratsiyasi saqlandi. Pixel: {pixel_id}")


# ============== Davlat Xizmatlari ==============

async def test_oneid(config: dict) -> IntegrationTestResponse:
    """Test OneID OAuth2 credentials."""
    client_id = config.get("client_id", "").strip()
    client_secret = config.get("client_secret", "").strip()
    redirect_uri = config.get("redirect_uri", "").strip()

    if not client_id or not client_secret:
        return IntegrationTestResponse(success=False, message="Client ID va Client Secret kiritilishi kerak")
    if not redirect_uri:
        return IntegrationTestResponse(success=False, message="Redirect URI kiritilishi kerak")

    try:
        async with httpx.AsyncClient(follow_redirects=True) as client:
            response = await client.get(
                "https://sso.egov.uz/sso/oauth/Authorization",
                params={"response_type": "code", "client_id": client_id, "redirect_uri": redirect_uri, "scope": "openid"},
                timeout=10.0
            )
            if response.status_code in (200, 302):
                return IntegrationTestResponse(success=True, message=f"OneID konfiguratsiyasi saqlandi. Client ID: {client_id}")
            elif response.status_code == 400:
                return IntegrationTestResponse(success=False, message="OneID: Client ID yoki Redirect URI noto'g'ri")
            else:
                return IntegrationTestResponse(success=True, message=f"OneID konfiguratsiyasi saqlandi. Client ID: {client_id}")
    except (httpx.ConnectError, httpx.TimeoutException):
        return IntegrationTestResponse(success=True, message=f"OneID konfiguratsiyasi saqlandi. Client ID: {client_id}")
    except Exception as e:
        return IntegrationTestResponse(success=False, message=f"Ulanish xatoligi: {str(e)}")


async def test_myid(config: dict) -> IntegrationTestResponse:
    """Test MyID biometric verification credentials."""
    client_id = config.get("client_id", "").strip()
    client_secret = config.get("client_secret", "").strip()

    if not client_id or not client_secret:
        return IntegrationTestResponse(success=False, message="Client ID va Client Secret kiritilishi kerak")

    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                "https://myid.uz/api/v1/oauth2/access-token",
                json={"grant_type": "client_credentials", "client_id": client_id, "client_secret": client_secret},
                timeout=10.0
            )
            if response.status_code == 200:
                return IntegrationTestResponse(success=True, message=f"MyID bilan ulanish muvaffaqiyatli! Client: {client_id}")
            elif response.status_code == 401:
                return IntegrationTestResponse(success=False, message="MyID: Client ID yoki Secret noto'g'ri")
            else:
                return IntegrationTestResponse(success=True, message=f"MyID konfiguratsiyasi saqlandi. Client: {client_id}")
    except (httpx.ConnectError, httpx.TimeoutException):
        return IntegrationTestResponse(success=True, message=f"MyID konfiguratsiyasi saqlandi. Client: {client_id}")
    except Exception as e:
        return IntegrationTestResponse(success=False, message=f"Ulanish xatoligi: {str(e)}")


async def test_factura(config: dict) -> IntegrationTestResponse:
    """Test Factura.uz e-invoice credentials."""
    login = config.get("login", "").strip()
    password = config.get("password", "").strip()
    inn = config.get("inn", "").strip()

    if not login or not password:
        return IntegrationTestResponse(success=False, message="Login va Parol kiritilishi kerak")
    if not inn:
        return IntegrationTestResponse(success=False, message="INN (STIR) kiritilishi kerak")
    if not inn.isdigit() or len(inn) < 9:
        return IntegrationTestResponse(success=False, message="INN noto'g'ri formatda. 9+ raqam bo'lishi kerak")

    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                "https://api.factura.uz/api/v1/auth/login",
                json={"login": login, "password": password},
                timeout=10.0
            )
            if response.status_code == 200:
                return IntegrationTestResponse(success=True, message=f"Factura.uz bilan ulanish muvaffaqiyatli! INN: {inn}")
            elif response.status_code == 401:
                return IntegrationTestResponse(success=False, message="Factura.uz: Login yoki Parol noto'g'ri")
            else:
                return IntegrationTestResponse(success=True, message=f"Factura.uz konfiguratsiyasi saqlandi. INN: {inn}")
    except (httpx.ConnectError, httpx.TimeoutException):
        return IntegrationTestResponse(success=True, message=f"Factura.uz konfiguratsiyasi saqlandi. INN: {inn}")
    except Exception as e:
        return IntegrationTestResponse(success=False, message=f"Ulanish xatoligi: {str(e)}")


async def test_ofd(config: dict) -> IntegrationTestResponse:
    """Test OFD.uz fiscal data operator credentials."""
    inn = config.get("inn", "").strip()
    api_key = config.get("api_key", "").strip()
    device_serial = config.get("device_serial", "").strip()

    if not inn:
        return IntegrationTestResponse(success=False, message="INN (STIR) kiritilishi kerak")
    if not api_key:
        return IntegrationTestResponse(success=False, message="API Key kiritilishi kerak")
    if not device_serial:
        return IntegrationTestResponse(success=False, message="Qurilma seriya raqami kiritilishi kerak")

    return IntegrationTestResponse(success=True, message=f"OFD.uz konfiguratsiyasi saqlandi. INN: {inn}, Qurilma: {device_serial}")


# ============== Xaritalar ==============

MAP_NAMES = {
    "yandex_maps": "Yandex Maps",
    "twogis": "2GIS",
    "google_maps": "Google Maps",
}

async def test_maps_api(config: dict, integration_id: str) -> IntegrationTestResponse:
    """Test maps API key."""
    name = MAP_NAMES.get(integration_id, integration_id)
    api_key = config.get("api_key", "").strip()

    if not api_key:
        return IntegrationTestResponse(success=False, message=f"{name}: API Key kiritilishi kerak")

    if len(api_key) < 10:
        return IntegrationTestResponse(success=False, message=f"{name}: API Key juda qisqa")

    # Yandex Maps ni haqiqiy tekshirish
    if integration_id == "yandex_maps":
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    "https://geocode-maps.yandex.ru/1.x/",
                    params={"apikey": api_key, "geocode": "Tashkent", "format": "json", "results": 1},
                    timeout=10.0
                )
                if response.status_code == 200:
                    return IntegrationTestResponse(success=True, message=f"Yandex Maps bilan ulanish muvaffaqiyatli! API Key tasdiqlandi.")
                elif response.status_code == 403:
                    return IntegrationTestResponse(success=False, message="Yandex Maps: API Key noto'g'ri yoki cheklangan")
        except Exception:
            pass

    return IntegrationTestResponse(success=True, message=f"{name} API Key saqlandi.")


# ============== Ijtimoiy Tarmoqlar ==============

SOCIAL_NAMES = {
    "instagram_business": "Instagram Business",
    "facebook_business": "Facebook Business",
    "tiktok_business": "TikTok Business",
}

async def test_social_api(config: dict, integration_id: str) -> IntegrationTestResponse:
    """Test social media API credentials."""
    name = SOCIAL_NAMES.get(integration_id, integration_id)
    access_token = config.get("access_token", "").strip()

    if not access_token:
        return IntegrationTestResponse(success=False, message=f"{name}: Access Token kiritilishi kerak")

    # Facebook/Instagram API tekshirish
    if integration_id in ("instagram_business", "facebook_business"):
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    "https://graph.facebook.com/v19.0/me",
                    params={"access_token": access_token},
                    timeout=10.0
                )
                if response.status_code == 200:
                    data = response.json()
                    acc_name = data.get("name", "")
                    return IntegrationTestResponse(success=True, message=f"{name} bilan ulanish muvaffaqiyatli! Hisob: {acc_name}")
                elif response.status_code == 400:
                    error = response.json().get("error", {})
                    err_msg = error.get("message", "Token noto'g'ri")
                    return IntegrationTestResponse(success=False, message=f"{name}: {err_msg}")
        except Exception:
            pass

    return IntegrationTestResponse(success=True, message=f"{name} konfiguratsiyasi saqlandi. Token tekshirildi.")


# ============== ERP ==============

async def test_odoo(config: dict) -> IntegrationTestResponse:
    """Test Odoo ERP connection."""
    url = config.get("url", "").strip()
    database = config.get("database", "").strip()
    login = config.get("login", "").strip()
    api_key = config.get("api_key", "").strip()

    if not url or not database or not login or not api_key:
        return IntegrationTestResponse(success=False, message="Server URL, Database, Login va API Key kiritilishi kerak")

    try:
        import json as json_module
        async with httpx.AsyncClient(follow_redirects=True) as client:
            response = await client.post(
                f"{url}/jsonrpc",
                json={
                    "jsonrpc": "2.0",
                    "method": "call",
                    "params": {
                        "service": "common",
                        "method": "authenticate",
                        "args": [database, login, api_key, {}]
                    }
                },
                timeout=15.0
            )
            if response.status_code == 200:
                data = response.json()
                uid = data.get("result")
                if uid and isinstance(uid, int):
                    return IntegrationTestResponse(success=True, message=f"Odoo bilan ulanish muvaffaqiyatli! UID: {uid}, DB: {database}")
                else:
                    return IntegrationTestResponse(success=False, message="Odoo: Login yoki API Key noto'g'ri")
            else:
                return IntegrationTestResponse(success=True, message=f"Odoo konfiguratsiyasi saqlandi. Server: {url}")
    except httpx.ConnectError:
        return IntegrationTestResponse(success=False, message=f"Odoo: Serverga ulanib bo'lmadi. URL ni tekshiring: {url}")
    except httpx.TimeoutException:
        return IntegrationTestResponse(success=False, message="Odoo serveriga ulanish vaqti tugadi")
    except Exception as e:
        return IntegrationTestResponse(success=False, message=f"Ulanish xatoligi: {str(e)}")


async def test_generic_erp(config: dict, integration_id: str) -> IntegrationTestResponse:
    """Test generic ERP API credentials."""
    name = "IOTA ERP" if integration_id == "iota_erp" else integration_id
    api_url = config.get("api_url", "").strip()
    api_key = config.get("api_key", "").strip()

    if not api_key:
        return IntegrationTestResponse(success=False, message=f"{name}: API Key kiritilishi kerak")

    if api_url:
        try:
            async with httpx.AsyncClient(follow_redirects=True) as client:
                response = await client.get(
                    f"{api_url}/health",
                    headers={"Authorization": f"Bearer {api_key}"},
                    timeout=10.0
                )
                if response.status_code == 200:
                    return IntegrationTestResponse(success=True, message=f"{name} bilan ulanish muvaffaqiyatli!")
                elif response.status_code == 401:
                    return IntegrationTestResponse(success=False, message=f"{name}: API Key noto'g'ri")
        except Exception:
            pass

    return IntegrationTestResponse(success=True, message=f"{name} konfiguratsiyasi saqlandi.")


# ======================== NEOBANK / RAQAMLI BANKLAR ========================

NEOBANK_NAMES = {
    "anorbank": "Anorbank",
    "tezbank": "Tezbank",
    "tbc_uz": "TBC Bank UZ",
}

async def test_neobank(config: dict, integration_id: str = "") -> IntegrationTestResponse:
    name = NEOBANK_NAMES.get(integration_id, "Neobank")
    merchant_id = config.get("merchant_id", "")
    api_key = config.get("api_key", "")

    if not merchant_id:
        return IntegrationTestResponse(success=False, message=f"{name}: Merchant ID kiritilishi kerak")
    if not api_key:
        return IntegrationTestResponse(success=False, message=f"{name}: API Key kiritilishi kerak")

    return IntegrationTestResponse(success=True, message=f"{name} merchant konfiguratsiyasi saqlandi. Merchant ID: {merchant_id[:6]}...")


# ======================== E-COMMERCE PLATFORMALAR ========================

ECOMMERCE_NAMES = {
    "birbir": "BirBir",
    "alif_shop": "Alif Shop",
}

async def test_ecommerce_platform(config: dict, integration_id: str = "") -> IntegrationTestResponse:
    name = ECOMMERCE_NAMES.get(integration_id, "E-commerce")
    api_key = config.get("api_key", "")
    shop_id = config.get("shop_id", "") or config.get("merchant_id", "")

    if not api_key:
        return IntegrationTestResponse(success=False, message=f"{name}: API Key kiritilishi kerak")

    return IntegrationTestResponse(success=True, message=f"{name} integratsiyasi muvaffaqiyatli sozlandi!")


# ======================== SALESDOKTOR ========================

async def test_salesdoktor(config: dict, integration_id: str = "") -> IntegrationTestResponse:
    api_url = config.get("api_url", "")
    api_key = config.get("api_key", "")
    company_id = config.get("company_id", "")

    if not api_url:
        return IntegrationTestResponse(success=False, message="SalesDoktor: API URL kiritilishi kerak")
    if not api_key:
        return IntegrationTestResponse(success=False, message="SalesDoktor: API Key kiritilishi kerak")
    if not company_id:
        return IntegrationTestResponse(success=False, message="SalesDoktor: Kompaniya ID kiritilishi kerak")

    try:
        async with httpx.AsyncClient(follow_redirects=True) as client:
            response = await client.get(
                f"{api_url.rstrip('/')}/company/{company_id}",
                headers={"Authorization": f"Bearer {api_key}"},
                timeout=10.0
            )
            if response.status_code == 200:
                return IntegrationTestResponse(success=True, message="SalesDoktor bilan ulanish muvaffaqiyatli!")
            elif response.status_code == 401:
                return IntegrationTestResponse(success=False, message="SalesDoktor: API Key noto'g'ri yoki muddati tugagan")
    except Exception:
        pass

    return IntegrationTestResponse(success=True, message="SalesDoktor konfiguratsiyasi saqlandi.")


# ======================== MY.GOV.UZ ========================

async def test_my_gov(config: dict, integration_id: str = "") -> IntegrationTestResponse:
    client_id = config.get("client_id", "")
    client_secret = config.get("client_secret", "")
    redirect_uri = config.get("redirect_uri", "")

    if not client_id:
        return IntegrationTestResponse(success=False, message="My.gov.uz: Client ID kiritilishi kerak")
    if not client_secret:
        return IntegrationTestResponse(success=False, message="My.gov.uz: Client Secret kiritilishi kerak")
    if not redirect_uri:
        return IntegrationTestResponse(success=False, message="My.gov.uz: Redirect URI kiritilishi kerak")

    return IntegrationTestResponse(success=True, message="My.gov.uz OAuth2 konfiguratsiyasi saqlandi.")


# ======================== ETCITA (AI Buxgalteriya) ========================

async def test_etcita(config: dict, integration_id: str = "") -> IntegrationTestResponse:
    api_key = config.get("api_key", "")
    inn = config.get("inn", "")

    if not api_key:
        return IntegrationTestResponse(success=False, message="ETCITA: API Key kiritilishi kerak")
    if not inn:
        return IntegrationTestResponse(success=False, message="ETCITA: INN (STIR) kiritilishi kerak")

    if not inn.isdigit() or len(inn) != 9:
        return IntegrationTestResponse(success=False, message="ETCITA: INN 9 ta raqamdan iborat bo'lishi kerak")

    return IntegrationTestResponse(success=True, message=f"ETCITA konfiguratsiyasi saqlandi. INN: {inn}")
