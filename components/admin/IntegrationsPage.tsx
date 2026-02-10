'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { Icons } from './Icons'
import { Translations } from '@/lib/admin/translations'
import api from '@/services/api'

interface IntegrationsPageProps {
  t: Translations
}

// Predefined integrations with their required fields
const AVAILABLE_INTEGRATIONS = [
  {
    id: 'amocrm',
    name: 'AmoCRM',
    icon: '📊',
    category: 'crm',
    description: "AmoCRM bilan integratsiya - mijozlar boshqaruvi, savdo voronkasi va avtomatlashtirish",
    docs_url: 'https://www.amocrm.ru/developers/content/crm_platform/platform-abilities',
    fields: [
      { key: 'subdomain', label: 'Subdomain', placeholder: 'yourcompany (yourcompany.amocrm.ru)', type: 'text', required: true },
      { key: 'client_id', label: 'Client ID (Integration ID)', placeholder: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx', type: 'text', required: true },
      { key: 'client_secret', label: 'Client Secret', placeholder: 'Sizning client secret kalitingiz', type: 'password', required: true },
      { key: 'redirect_uri', label: 'Redirect URI', placeholder: 'https://yourdomain.com/api/amocrm/callback', type: 'text', required: true },
      { key: 'authorization_code', label: 'Authorization Code', placeholder: 'AmoCRM dan olingan authorization code', type: 'text', required: true },
    ]
  },
  {
    id: 'zadarma',
    name: 'Zadarma IP Telefoniya',
    icon: '📞',
    category: 'communication',
    description: "Zadarma IP telefoniya - qo'ng'iroqlar, IVR menyu, call tracking va CRM integratsiyasi",
    docs_url: 'https://zadarma.com/ru/support/api/',
    fields: [
      { key: 'api_key', label: 'API Key (User Key)', placeholder: 'Zadarma API kaliti', type: 'text', required: true },
      { key: 'api_secret', label: 'API Secret', placeholder: 'Zadarma API secret', type: 'password', required: true },
      { key: 'sip_login', label: 'SIP Login', placeholder: '100001 (SIP hisobingiz)', type: 'text', required: false },
      { key: 'webhook_url', label: 'Webhook URL', placeholder: 'https://yourdomain.com/api/zadarma/webhook', type: 'text', required: false },
      { key: 'caller_id', label: 'Caller ID (Telefon raqam)', placeholder: '+998901234567', type: 'text', required: false },
    ]
  },
  {
    id: 'telegram',
    name: 'Telegram Bot',
    icon: '💬',
    category: 'communication',
    description: "Telegram bot integratsiyasi - bildirishnomalar, buyurtmalar va mijozlar bilan aloqa",
    docs_url: 'https://core.telegram.org/bots/api',
    fields: [
      { key: 'bot_token', label: 'Bot Token', placeholder: '123456789:ABCdefGHIjklMNOpqrsTUVwxyz', type: 'password', required: true },
      { key: 'chat_id', label: 'Chat ID (Admin)', placeholder: '-1001234567890 yoki 123456789', type: 'text', required: false },
      { key: 'webhook_url', label: 'Webhook URL', placeholder: 'https://yourdomain.com/api/telegram/webhook', type: 'text', required: false },
    ]
  },
  {
    id: 'payme',
    name: 'Payme',
    icon: '💳',
    category: 'payment',
    description: "Payme to'lov tizimi integratsiyasi - onlayn to'lovlarni qabul qilish",
    docs_url: 'https://developer.help.paycom.uz/',
    fields: [
      { key: 'merchant_id', label: 'Merchant ID', placeholder: 'Payme merchant identifikatori', type: 'text', required: true },
      { key: 'secret_key', label: 'Secret Key (Test)', placeholder: 'Test muhit uchun kalit', type: 'password', required: true },
      { key: 'secret_key_prod', label: 'Secret Key (Production)', placeholder: 'Production muhit uchun kalit', type: 'password', required: false },
      { key: 'callback_url', label: 'Callback URL', placeholder: 'https://yourdomain.com/api/payme/callback', type: 'text', required: true },
      { key: 'test_mode', label: 'Test rejimi', placeholder: '', type: 'checkbox', required: false },
    ]
  },
  {
    id: 'click',
    name: 'Click',
    icon: '💳',
    category: 'payment',
    description: "Click to'lov tizimi integratsiyasi - onlayn to'lovlarni qabul qilish",
    docs_url: 'https://docs.click.uz/',
    fields: [
      { key: 'merchant_id', label: 'Merchant ID', placeholder: 'Click merchant identifikatori', type: 'text', required: true },
      { key: 'service_id', label: 'Service ID', placeholder: 'Click service identifikatori', type: 'text', required: true },
      { key: 'secret_key', label: 'Secret Key', placeholder: 'Click secret key', type: 'password', required: true },
      { key: 'merchant_user_id', label: 'Merchant User ID', placeholder: 'Click merchant user ID', type: 'text', required: false },
      { key: 'callback_url', label: 'Callback URL', placeholder: 'https://yourdomain.com/api/click/callback', type: 'text', required: true },
    ]
  },
  {
    id: 'google_analytics',
    name: 'Google Analytics',
    icon: '📈',
    category: 'analytics',
    description: "Google Analytics integratsiyasi - sayt statistikasi va foydalanuvchi xatti-harakatlari",
    docs_url: 'https://developers.google.com/analytics',
    fields: [
      { key: 'measurement_id', label: 'Measurement ID', placeholder: 'G-XXXXXXXXXX', type: 'text', required: true },
      { key: 'api_secret', label: 'API Secret', placeholder: 'Google Analytics API secret', type: 'password', required: false },
    ]
  },
  {
    id: 'sms_eskiz',
    name: 'Eskiz SMS',
    icon: '📱',
    category: 'communication',
    description: "Eskiz SMS xizmati - SMS xabarlar yuborish va OTP tasdiqlash",
    docs_url: 'https://eskiz.uz/documentation',
    fields: [
      { key: 'email', label: 'Email', placeholder: 'Eskiz hisobingiz email', type: 'email', required: true },
      { key: 'password', label: 'Parol', placeholder: 'Eskiz hisobingiz paroli', type: 'password', required: true },
      { key: 'sender_name', label: "Jo'natuvchi nomi", placeholder: '4546 (tasdiqlangan nom)', type: 'text', required: false },
    ]
  },
  // ============== YETKAZIB BERISH XIZMATLARI ==============
  {
    id: 'yandex_delivery',
    name: 'Yandex Delivery',
    icon: '🚕',
    category: 'delivery',
    description: "Yandex Delivery - tezkor yetkazib berish, real-time tracking va narx kalkulyatsiyasi",
    docs_url: 'https://yandex.ru/dev/logistics/api/',
    fields: [
      { key: 'client_id', label: 'Client ID (OAuth)', placeholder: 'Yandex OAuth Client ID', type: 'text', required: true },
      { key: 'client_secret', label: 'Client Secret', placeholder: 'Yandex OAuth Client Secret', type: 'password', required: true },
      { key: 'api_key', label: 'API Key', placeholder: 'Yandex Delivery API kaliti', type: 'password', required: true },
      { key: 'corp_client_id', label: 'Corp Client ID', placeholder: 'Korporativ mijoz ID', type: 'text', required: false },
      { key: 'webhook_url', label: 'Webhook URL', placeholder: 'https://yourdomain.com/api/yandex/webhook', type: 'text', required: false },
      { key: 'test_mode', label: 'Test rejimi', placeholder: '', type: 'checkbox', required: false },
    ]
  },
  {
    id: 'express24',
    name: 'Express24 Delivery',
    icon: '🛵',
    category: 'delivery',
    description: "Express24 - O'zbekistonda tezkor yetkazib berish xizmati",
    docs_url: 'https://express24.uz/for-business',
    fields: [
      { key: 'api_key', label: 'API Key', placeholder: 'Express24 API kaliti', type: 'password', required: true },
      { key: 'merchant_id', label: 'Merchant ID', placeholder: 'Express24 merchant identifikatori', type: 'text', required: true },
      { key: 'branch_id', label: 'Branch ID', placeholder: 'Filial identifikatori', type: 'text', required: false },
      { key: 'callback_url', label: 'Callback URL', placeholder: 'https://yourdomain.com/api/express24/callback', type: 'text', required: false },
    ]
  },
  {
    id: 'uzum_nasiya',
    name: 'Uzum Nasiya',
    icon: '🛒',
    category: 'delivery',
    description: "Uzum Nasiya - bo'lib to'lash va yetkazib berish xizmati",
    docs_url: 'https://uzum.uz/business',
    fields: [
      { key: 'merchant_id', label: 'Merchant ID', placeholder: 'Uzum merchant identifikatori', type: 'text', required: true },
      { key: 'api_key', label: 'API Key', placeholder: 'Uzum API kaliti', type: 'password', required: true },
      { key: 'secret_key', label: 'Secret Key', placeholder: 'Uzum secret kaliti', type: 'password', required: true },
      { key: 'store_id', label: "Do'kon ID", placeholder: "Do'kon identifikatori", type: 'text', required: false },
      { key: 'callback_url', label: 'Callback URL', placeholder: 'https://yourdomain.com/api/uzum/callback', type: 'text', required: true },
    ]
  },
  {
    id: 'wolt',
    name: 'Wolt Delivery',
    icon: '🔵',
    category: 'delivery',
    description: "Wolt - restoran va do'konlardan yetkazib berish xizmati",
    docs_url: 'https://wolt.com/partners',
    fields: [
      { key: 'venue_id', label: 'Venue ID', placeholder: 'Wolt venue identifikatori', type: 'text', required: true },
      { key: 'api_key', label: 'API Key', placeholder: 'Wolt API kaliti', type: 'password', required: true },
      { key: 'webhook_secret', label: 'Webhook Secret', placeholder: 'Webhook tasdiqlash kaliti', type: 'password', required: false },
      { key: 'callback_url', label: 'Callback URL', placeholder: 'https://yourdomain.com/api/wolt/callback', type: 'text', required: false },
    ]
  },
  {
    id: 'glovo',
    name: 'Glovo',
    icon: '🟢',
    category: 'delivery',
    description: "Glovo - tezkor yetkazib berish platformasi",
    docs_url: 'https://glovoapp.com/partners',
    fields: [
      { key: 'store_id', label: "Do'kon ID", placeholder: "Glovo do'kon identifikatori", type: 'text', required: true },
      { key: 'api_key', label: 'API Key', placeholder: 'Glovo API kaliti', type: 'password', required: true },
      { key: 'api_secret', label: 'API Secret', placeholder: 'Glovo API secret', type: 'password', required: true },
      { key: 'webhook_url', label: 'Webhook URL', placeholder: 'https://yourdomain.com/api/glovo/webhook', type: 'text', required: false },
    ]
  },
  // ============== INTERNET SERVIS XIZMATLARI ==============
  {
    id: 'uztelecom',
    name: 'Uztelecom API',
    icon: '🌐',
    category: 'internet',
    description: "Uztelecom - internet va telefon xizmatlari integratsiyasi",
    docs_url: 'https://uztelecom.uz/developers',
    fields: [
      { key: 'login', label: 'Login', placeholder: 'Uztelecom login', type: 'text', required: true },
      { key: 'password', label: 'Parol', placeholder: 'Uztelecom paroli', type: 'password', required: true },
      { key: 'contract_id', label: 'Shartnoma raqami', placeholder: 'Shartnoma identifikatori', type: 'text', required: false },
      { key: 'api_url', label: 'API URL', placeholder: 'https://api.uztelecom.uz', type: 'text', required: false },
    ]
  },
  {
    id: 'beeline_uz',
    name: 'Beeline Uzbekistan',
    icon: '🐝',
    category: 'internet',
    description: "Beeline - mobil va internet xizmatlari integratsiyasi",
    docs_url: 'https://beeline.uz/business',
    fields: [
      { key: 'api_key', label: 'API Key', placeholder: 'Beeline API kaliti', type: 'password', required: true },
      { key: 'secret_key', label: 'Secret Key', placeholder: 'Beeline secret kaliti', type: 'password', required: true },
      { key: 'account_id', label: 'Hisob ID', placeholder: 'Beeline hisob raqami', type: 'text', required: false },
      { key: 'callback_url', label: 'Callback URL', placeholder: 'https://yourdomain.com/api/beeline/callback', type: 'text', required: false },
    ]
  },
  {
    id: 'ucell',
    name: 'Ucell',
    icon: '📶',
    category: 'internet',
    description: "Ucell - mobil aloqa va internet xizmatlari",
    docs_url: 'https://ucell.uz/developers',
    fields: [
      { key: 'login', label: 'Login', placeholder: 'Ucell login', type: 'text', required: true },
      { key: 'password', label: 'Parol', placeholder: 'Ucell paroli', type: 'password', required: true },
      { key: 'msisdn', label: 'MSISDN (Telefon raqam)', placeholder: '+998XXXXXXXXX', type: 'text', required: false },
      { key: 'api_url', label: 'API URL', placeholder: 'https://api.ucell.uz', type: 'text', required: false },
    ]
  },
  {
    id: 'mobiuz',
    name: 'Mobi.uz (UMS)',
    icon: '📱',
    category: 'internet',
    description: "Mobi.uz - mobil aloqa va internet xizmatlari",
    docs_url: 'https://mobi.uz/developers',
    fields: [
      { key: 'api_key', label: 'API Key', placeholder: 'Mobi.uz API kaliti', type: 'password', required: true },
      { key: 'account_number', label: 'Hisob raqami', placeholder: 'Mobi.uz hisob raqami', type: 'text', required: true },
      { key: 'secret_key', label: 'Secret Key', placeholder: 'Mobi.uz secret kaliti', type: 'password', required: false },
    ]
  },
  {
    id: 'turon_telecom',
    name: 'Turon Telecom',
    icon: '🌍',
    category: 'internet',
    description: "Turon Telecom - internet provayder xizmatlari",
    docs_url: 'https://turontelecom.uz',
    fields: [
      { key: 'login', label: 'Login', placeholder: 'Turon login', type: 'text', required: true },
      { key: 'password', label: 'Parol', placeholder: 'Turon paroli', type: 'password', required: true },
      { key: 'contract_number', label: 'Shartnoma raqami', placeholder: 'Shartnoma raqami', type: 'text', required: false },
    ]
  },
  {
    id: 'comnet',
    name: 'Comnet',
    icon: '🔌',
    category: 'internet',
    description: "Comnet - yuqori tezlikdagi internet xizmatlari",
    docs_url: 'https://comnet.uz',
    fields: [
      { key: 'login', label: 'Login', placeholder: 'Comnet login', type: 'text', required: true },
      { key: 'password', label: 'Parol', placeholder: 'Comnet paroli', type: 'password', required: true },
      { key: 'api_key', label: 'API Key', placeholder: 'Comnet API kaliti (ixtiyoriy)', type: 'password', required: false },
      { key: 'contract_id', label: 'Shartnoma ID', placeholder: 'Shartnoma identifikatori', type: 'text', required: false },
    ]
  },
  // ============== POS TERMINAL TIZIMLARI ==============
  {
    id: 'iiko',
    name: 'iiko',
    icon: '🍽️',
    category: 'pos',
    description: "iiko - restoran va kafelar uchun boshqaruv tizimi, buyurtmalar, menyu va ombor nazorati",
    docs_url: 'https://api-ru.iiko.services/',
    fields: [
      { key: 'api_login', label: 'API Login', placeholder: 'iiko Cloud API login kaliti', type: 'password', required: true },
      { key: 'organization_id', label: 'Tashkilot ID', placeholder: 'iiko tashkilot identifikatori', type: 'text', required: true },
      { key: 'terminal_group_id', label: 'Terminal guruh ID', placeholder: 'Terminal guruh identifikatori', type: 'text', required: false },
      { key: 'webhook_url', label: 'Webhook URL', placeholder: 'https://yourdomain.com/api/iiko/webhook', type: 'text', required: false },
    ]
  },
  {
    id: 'rkeeper',
    name: 'R-Keeper',
    icon: '🏪',
    category: 'pos',
    description: "R-Keeper - restoran va fast-food uchun POS tizimi, buyurtma va kassani boshqarish",
    docs_url: 'https://rkeeper.ru/api/',
    fields: [
      { key: 'api_key', label: 'API Key', placeholder: 'R-Keeper API kaliti', type: 'password', required: true },
      { key: 'api_secret', label: 'API Secret', placeholder: 'R-Keeper API secret', type: 'password', required: true },
      { key: 'restaurant_id', label: 'Restoran ID', placeholder: 'Restoran identifikatori', type: 'text', required: true },
      { key: 'station_id', label: 'Kassa ID', placeholder: 'Kassa stantsiyasi identifikatori', type: 'text', required: false },
      { key: 'webhook_url', label: 'Webhook URL', placeholder: 'https://yourdomain.com/api/rkeeper/webhook', type: 'text', required: false },
    ]
  },
  {
    id: 'poster',
    name: 'Poster POS',
    icon: '📋',
    category: 'pos',
    description: "Poster - restoran, kafe va do'konlar uchun bulutli POS tizimi",
    docs_url: 'https://dev.joinposter.com/docs',
    fields: [
      { key: 'access_token', label: 'Access Token', placeholder: 'Poster API access token', type: 'password', required: true },
      { key: 'account_name', label: 'Account nomi', placeholder: 'yourcompany (yourcompany.joinposter.com)', type: 'text', required: true },
      { key: 'webhook_url', label: 'Webhook URL', placeholder: 'https://yourdomain.com/api/poster/webhook', type: 'text', required: false },
    ]
  },
  {
    id: 'alise_pos',
    name: 'Alise Terminal',
    icon: '🖥️',
    category: 'pos',
    description: "Alise - savdo terminali va kassa apparati integratsiyasi, chek chop etish va hisobotlar",
    docs_url: 'https://alise.uz',
    fields: [
      { key: 'api_key', label: 'API Key', placeholder: 'Alise API kaliti', type: 'password', required: true },
      { key: 'terminal_id', label: 'Terminal ID', placeholder: 'Terminal identifikatori', type: 'text', required: true },
      { key: 'merchant_id', label: 'Merchant ID', placeholder: 'Merchant identifikatori', type: 'text', required: false },
      { key: 'inn', label: 'INN (STIR)', placeholder: 'Soliq to\'lovchi raqami', type: 'text', required: false },
      { key: 'callback_url', label: 'Callback URL', placeholder: 'https://yourdomain.com/api/alise/callback', type: 'text', required: false },
    ]
  },
  {
    id: 'uzpos',
    name: 'UzPOS',
    icon: '💰',
    category: 'pos',
    description: "UzPOS - O'zbekiston uchun POS terminal va fiskal qurilma integratsiyasi",
    docs_url: 'https://uzpos.uz',
    fields: [
      { key: 'api_key', label: 'API Key', placeholder: 'UzPOS API kaliti', type: 'password', required: true },
      { key: 'terminal_id', label: 'Terminal ID', placeholder: 'POS terminal raqami', type: 'text', required: true },
      { key: 'inn', label: 'INN (STIR)', placeholder: 'Soliq to\'lovchi raqami', type: 'text', required: true },
      { key: 'fiscal_module_id', label: 'Fiskal modul ID', placeholder: 'Fiskal modul raqami', type: 'text', required: false },
      { key: 'callback_url', label: 'Callback URL', placeholder: 'https://yourdomain.com/api/uzpos/callback', type: 'text', required: false },
    ]
  },
  {
    id: 'jowi',
    name: 'Jowi',
    icon: '🍕',
    category: 'pos',
    description: "Jowi - restoran va kafe avtomatlashtirish tizimi (O'zbekistonda mashhur)",
    docs_url: 'https://jowi.club/developers',
    fields: [
      { key: 'api_key', label: 'API Key', placeholder: 'Jowi API kaliti', type: 'password', required: true },
      { key: 'api_secret', label: 'API Secret', placeholder: 'Jowi API secret', type: 'password', required: true },
      { key: 'restaurant_id', label: 'Restoran ID', placeholder: 'Jowi restoran identifikatori', type: 'text', required: true },
      { key: 'webhook_url', label: 'Webhook URL', placeholder: 'https://yourdomain.com/api/jowi/webhook', type: 'text', required: false },
    ]
  },
  {
    id: 'paloma365',
    name: 'Paloma365',
    icon: '🏬',
    category: 'pos',
    description: "Paloma365 - savdo va ombor boshqaruv tizimi (Markaziy Osiyo)",
    docs_url: 'https://paloma365.com',
    fields: [
      { key: 'api_key', label: 'API Key', placeholder: 'Paloma365 API kaliti', type: 'password', required: true },
      { key: 'company_id', label: 'Kompaniya ID', placeholder: 'Paloma365 kompaniya identifikatori', type: 'text', required: true },
      { key: 'branch_id', label: 'Filial ID', placeholder: 'Filial identifikatori', type: 'text', required: false },
      { key: 'webhook_url', label: 'Webhook URL', placeholder: 'https://yourdomain.com/api/paloma/webhook', type: 'text', required: false },
    ]
  },
  {
    id: 'smartup',
    name: 'SmartUP',
    icon: '📊',
    category: 'pos',
    description: "SmartUP - buxgalteriya, savdo va ombor boshqaruv dasturi",
    docs_url: 'https://smartup.online',
    fields: [
      { key: 'api_key', label: 'API Key', placeholder: 'SmartUP API kaliti', type: 'password', required: true },
      { key: 'company_id', label: 'Kompaniya ID', placeholder: 'SmartUP kompaniya kodi', type: 'text', required: true },
      { key: 'branch_code', label: 'Filial kodi', placeholder: 'Filial kodi', type: 'text', required: false },
      { key: 'base_url', label: 'Server URL', placeholder: 'https://yourcompany.smartup.online', type: 'text', required: false },
    ]
  },
  {
    id: 'billz',
    name: 'Billz',
    icon: '🧾',
    category: 'pos',
    description: "Billz - chakana savdo uchun bulutli POS tizimi (O'zbekiston)",
    docs_url: 'https://billz.io',
    fields: [
      { key: 'api_key', label: 'API Key', placeholder: 'Billz API kaliti', type: 'password', required: true },
      { key: 'shop_id', label: 'Do\'kon ID', placeholder: 'Billz do\'kon identifikatori', type: 'text', required: true },
      { key: 'webhook_url', label: 'Webhook URL', placeholder: 'https://yourdomain.com/api/billz/webhook', type: 'text', required: false },
    ]
  },
  {
    id: 'quick_resto',
    name: 'Quick Resto',
    icon: '⚡',
    category: 'pos',
    description: "Quick Resto - restoran va kafe uchun bulutli POS tizimi",
    docs_url: 'https://quickresto.ru/api',
    fields: [
      { key: 'api_key', label: 'API Key', placeholder: 'Quick Resto API kaliti', type: 'password', required: true },
      { key: 'api_secret', label: 'API Secret', placeholder: 'Quick Resto API secret', type: 'password', required: true },
      { key: 'module_id', label: 'Modul ID', placeholder: 'Quick Resto modul identifikatori', type: 'text', required: true },
      { key: 'webhook_url', label: 'Webhook URL', placeholder: 'https://yourdomain.com/api/quickresto/webhook', type: 'text', required: false },
    ]
  },
  {
    id: 'tillypad',
    name: 'Tillypad',
    icon: '🍽️',
    category: 'pos',
    description: "Tillypad - restoran va mehmonxona uchun avtomatlashtirish tizimi",
    docs_url: 'https://tillypad.ru',
    fields: [
      { key: 'api_key', label: 'API Key', placeholder: 'Tillypad API kaliti', type: 'password', required: true },
      { key: 'server_url', label: 'Server URL', placeholder: 'https://your-tillypad-server.com', type: 'text', required: true },
      { key: 'restaurant_id', label: 'Restoran ID', placeholder: 'Tillypad restoran identifikatori', type: 'text', required: true },
      { key: 'webhook_url', label: 'Webhook URL', placeholder: 'https://yourdomain.com/api/tillypad/webhook', type: 'text', required: false },
    ]
  },
  {
    id: '1c_roznitsa',
    name: '1C:Roznitsa',
    icon: '🏪',
    category: 'pos',
    description: "1C:Roznitsa - chakana savdo uchun avtomatlashtirish dasturi",
    docs_url: 'https://1c.uz',
    fields: [
      { key: 'base_url', label: 'Server URL', placeholder: 'http://server:port/base_name', type: 'text', required: true },
      { key: 'username', label: 'Foydalanuvchi', placeholder: '1C foydalanuvchi nomi', type: 'text', required: true },
      { key: 'password', label: 'Parol', placeholder: '1C foydalanuvchi paroli', type: 'password', required: true },
      { key: 'organization_code', label: 'Tashkilot kodi', placeholder: 'Tashkilot kodi', type: 'text', required: false },
    ]
  },
  {
    id: 'atol',
    name: 'ATOL Online',
    icon: '🖨️',
    category: 'pos',
    description: "ATOL Online - fiskal cheklar va OFD bilan integratsiya",
    docs_url: 'https://online.atol.ru/api',
    fields: [
      { key: 'login', label: 'Login', placeholder: 'ATOL Online login', type: 'text', required: true },
      { key: 'password', label: 'Parol', placeholder: 'ATOL Online parol', type: 'password', required: true },
      { key: 'group_code', label: 'Guruh kodi', placeholder: 'Kassa guruhi kodi', type: 'text', required: true },
      { key: 'inn', label: 'INN', placeholder: 'Tashkilot INN raqami', type: 'text', required: true },
      { key: 'callback_url', label: 'Callback URL', placeholder: 'https://yourdomain.com/api/atol/callback', type: 'text', required: false },
    ]
  },
  {
    id: 'lightspeed',
    name: 'Lightspeed',
    icon: '💡',
    category: 'pos',
    description: "Lightspeed POS - xalqaro savdo va restoran avtomatlashtirish",
    docs_url: 'https://developers.lightspeedhq.com',
    fields: [
      { key: 'api_key', label: 'API Key', placeholder: 'Lightspeed API kaliti', type: 'password', required: true },
      { key: 'api_secret', label: 'API Secret', placeholder: 'Lightspeed API secret', type: 'password', required: true },
      { key: 'account_id', label: 'Account ID', placeholder: 'Lightspeed hisob identifikatori', type: 'text', required: true },
      { key: 'webhook_url', label: 'Webhook URL', placeholder: 'https://yourdomain.com/api/lightspeed/webhook', type: 'text', required: false },
    ]
  },
  {
    id: 'square',
    name: 'Square POS',
    icon: '🟦',
    category: 'pos',
    description: "Square - to'lov va savdo nuqtasi boshqaruv tizimi",
    docs_url: 'https://developer.squareup.com',
    fields: [
      { key: 'access_token', label: 'Access Token', placeholder: 'Square access token', type: 'password', required: true },
      { key: 'location_id', label: 'Location ID', placeholder: 'Square joylashuv identifikatori', type: 'text', required: true },
      { key: 'environment', label: 'Muhit', placeholder: 'sandbox yoki production', type: 'text', required: false },
      { key: 'webhook_url', label: 'Webhook URL', placeholder: 'https://yourdomain.com/api/square/webhook', type: 'text', required: false },
    ]
  },
  {
    id: 'toast',
    name: 'Toast POS',
    icon: '🍞',
    category: 'pos',
    description: "Toast - restoran boshqaruvi va POS tizimi",
    docs_url: 'https://doc.toasttab.com',
    fields: [
      { key: 'client_id', label: 'Client ID', placeholder: 'Toast client identifikatori', type: 'text', required: true },
      { key: 'client_secret', label: 'Client Secret', placeholder: 'Toast client secret', type: 'password', required: true },
      { key: 'restaurant_guid', label: 'Restaurant GUID', placeholder: 'Toast restoran GUID', type: 'text', required: true },
      { key: 'webhook_url', label: 'Webhook URL', placeholder: 'https://yourdomain.com/api/toast/webhook', type: 'text', required: false },
    ]
  },
  {
    id: 'soliq_terminal',
    name: 'SolIQ Terminal',
    icon: '🏛️',
    category: 'pos',
    description: "SolIQ Terminal - DYK fiskal terminal va soliq integratsiyasi",
    docs_url: 'https://soliq.uz',
    fields: [
      { key: 'inn', label: 'INN (STIR)', placeholder: 'Soliq to\'lovchi raqami', type: 'text', required: true },
      { key: 'device_serial', label: 'Qurilma seriya raqami', placeholder: 'Fiskal qurilma seriya raqami', type: 'text', required: true },
      { key: 'api_key', label: 'API Key', placeholder: 'SolIQ API kaliti', type: 'password', required: true },
      { key: 'environment', label: 'Muhit', placeholder: 'test yoki production', type: 'text', required: false },
    ]
  },
  // ============== KOMMUNAL XIZMATLAR ==============
  {
    id: 'hududgaz',
    name: 'Hududgaz',
    icon: '🔥',
    category: 'utility',
    description: "Hududgaz - gaz xizmatlari uchun to'lovlar",
    docs_url: 'https://hududgaz.uz',
    fields: [
      { key: 'account_number', label: 'Hisob raqami', placeholder: 'Gaz hisob raqami', type: 'text', required: true },
      { key: 'api_key', label: 'API Key', placeholder: 'Hududgaz API kaliti', type: 'password', required: false },
    ]
  },
  {
    id: 'elektr_energiya',
    name: 'Elektr Energiya',
    icon: '⚡',
    category: 'utility',
    description: "Elektr energiya - elektr xizmatlari uchun to'lovlar",
    docs_url: 'https://elektroenergiya.uz',
    fields: [
      { key: 'account_number', label: 'Hisob raqami', placeholder: 'Elektr hisob raqami', type: 'text', required: true },
      { key: 'counter_number', label: 'Schyotchik raqami', placeholder: 'Schyotchik raqami', type: 'text', required: false },
      { key: 'api_key', label: 'API Key', placeholder: 'API kaliti', type: 'password', required: false },
    ]
  },
  {
    id: 'suvoqova',
    name: 'Suvoqova (Suv)',
    icon: '💧',
    category: 'utility',
    description: "Suvoqova - suv ta'minoti xizmatlari",
    docs_url: 'https://suvoqova.uz',
    fields: [
      { key: 'account_number', label: 'Hisob raqami', placeholder: 'Suv hisob raqami', type: 'text', required: true },
      { key: 'address', label: 'Manzil', placeholder: "To'liq manzil", type: 'text', required: false },
    ]
  },
]

// IntegrationProject - Aytix integratsiya xizmati mijozlari (marketplace Project bilan bog'liq EMAS!)
interface IntegrationProject {
  id: number
  name_uz: string
  name_ru?: string
  name_en?: string
  description_uz?: string
  description_ru?: string
  description_en?: string
  is_active?: boolean
  created_at?: string
  updated_at?: string
}

interface IntegrationConfig {
  id?: number
  integration_project_id?: number  // IntegrationProject ga reference
  integration_project?: IntegrationProject
  integration_id: string
  name: string
  config: Record<string, string | boolean>
  is_active: boolean
  created_at?: string
  updated_at?: string
}

const categoryIcons: Record<string, string> = {
  payment: '💳',
  crm: '📊',
  analytics: '📈',
  communication: '💬',
  delivery: '🚚',
  pos: '🖥️',
  internet: '🌐',
  utility: '🏠',
  storage: '☁️',
  security: '🔒',
  other: '🔧'
}

const categoryLabels: Record<string, string> = {
  payment: "To'lov tizimlari",
  crm: 'CRM',
  analytics: 'Analitika',
  communication: 'Aloqa',
  delivery: 'Yetkazib berish',
  pos: 'POS Terminallar',
  internet: 'Internet xizmatlari',
  utility: 'Kommunal xizmatlar',
  storage: 'Saqlash',
  security: 'Xavfsizlik',
  other: 'Boshqa'
}

export default function IntegrationsPage({ t }: IntegrationsPageProps) {
  const { token, loading: authLoading } = useAuth()
  const [connectedIntegrations, setConnectedIntegrations] = useState<IntegrationConfig[]>([])
  const [projects, setProjects] = useState<IntegrationProject[]>([])
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [selectedIntegration, setSelectedIntegration] = useState<typeof AVAILABLE_INTEGRATIONS[0] | null>(null)
  const [editingConfig, setEditingConfig] = useState<IntegrationConfig | null>(null)
  const [formData, setFormData] = useState<Record<string, string | boolean>>({})
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null)
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [activeTab, setActiveTab] = useState<'projects' | 'available' | 'connected'>('projects')
  const [connecting, setConnecting] = useState(false)
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null)

  // Loyiha detail view
  const [selectedProject, setSelectedProject] = useState<IntegrationProject | null>(null)
  const [showAddIntegrationModal, setShowAddIntegrationModal] = useState(false)

  // Loyihalar uchun modal
  const [showProjectModal, setShowProjectModal] = useState(false)
  const [editingProject, setEditingProject] = useState<IntegrationProject | null>(null)
  const [projectFormData, setProjectFormData] = useState({
    name_uz: '',
    name_ru: '',
    name_en: '',
    description_uz: '',
    description_ru: '',
    description_en: ''
  })

  useEffect(() => {
    if (!authLoading && token) {
      loadConnectedIntegrations()
      loadProjects()
    }
  }, [token, authLoading])

  const loadConnectedIntegrations = async () => {
    try {
      setLoading(true)
      const response = await api.get('/integrations/connected')
      setConnectedIntegrations(response.data || [])
    } catch (err) {
      console.error('Error loading integrations:', err)
      setConnectedIntegrations([])
    } finally {
      setLoading(false)
    }
  }

  const loadProjects = async () => {
    try {
      // IntegrationProject - Aytix integratsiya xizmati loyihalari (marketplace Project EMAS!)
      const response = await api.get('/integrations/projects')
      setProjects(response.data || [])
    } catch (err) {
      console.error('Error loading integration projects:', err)
      setProjects([])
    }
  }

  // Loyihalar CRUD
  const openProjectModal = (project?: IntegrationProject) => {
    if (project) {
      setEditingProject(project)
      setProjectFormData({
        name_uz: project.name_uz || '',
        name_ru: project.name_ru || '',
        name_en: project.name_en || '',
        description_uz: '',
        description_ru: '',
        description_en: ''
      })
    } else {
      setEditingProject(null)
      setProjectFormData({
        name_uz: '',
        name_ru: '',
        name_en: '',
        description_uz: '',
        description_ru: '',
        description_en: ''
      })
    }
    setShowProjectModal(true)
  }

  const handleSaveProject = async () => {
    if (!projectFormData.name_uz.trim()) {
      alert('Mijoz nomi kiritilishi kerak!')
      return
    }

    try {
      setConnecting(true)
      if (editingProject?.id) {
        await api.put(`/integrations/projects/${editingProject.id}`, projectFormData)
      } else {
        await api.post('/integrations/projects', projectFormData)
      }
      setShowProjectModal(false)
      loadProjects()
    } catch (err) {
      console.error('Error saving integration project:', err)
      alert('Mijozni saqlashda xatolik!')
    } finally {
      setConnecting(false)
    }
  }

  const handleDeleteProject = async (project: IntegrationProject) => {
    // Tekshirish - ushbu mijozga ulangan integratsiyalar bormi
    const projectIntegrations = connectedIntegrations.filter(c => c.integration_project_id === project.id)
    if (projectIntegrations.length > 0) {
      alert(`Bu mijozga ${projectIntegrations.length} ta integratsiya ulangan. Avval integratsiyalarni o'chiring.`)
      return
    }

    if (!confirm(`"${project.name_uz}" mijozini o'chirmoqchimisiz?`)) return

    try {
      await api.delete(`/integrations/projects/${project.id}`)
      loadProjects()
    } catch (err: any) {
      console.error('Error deleting integration project:', err)
      alert(err.response?.data?.detail || "Mijozni o'chirishda xatolik!")
    }
  }

  // Loyihaga ulangan integratsiyalar sonini olish
  const getProjectIntegrationsCount = (projectId: number) => {
    return connectedIntegrations.filter(c => c.integration_project_id === projectId).length
  }

  const openConnectModal = (integration: typeof AVAILABLE_INTEGRATIONS[0], existingConfig?: IntegrationConfig) => {
    setSelectedIntegration(integration)
    setTestResult(null)

    if (existingConfig) {
      setEditingConfig(existingConfig)
      setFormData(existingConfig.config || {})
      setSelectedProjectId(existingConfig.integration_project_id || null)
    } else {
      setEditingConfig(null)
      // Agar selectedProject tanlangan bo'lsa yoki selectedProjectId allaqachon set bo'lsa - saqla
      if (!selectedProjectId && selectedProject) {
        setSelectedProjectId(selectedProject.id)
      }
      // Initialize with empty values
      const initialData: Record<string, string | boolean> = {}
      integration.fields.forEach(field => {
        initialData[field.key] = field.type === 'checkbox' ? false : ''
      })
      setFormData(initialData)
    }

    setShowModal(true)
  }

  const handleConnect = async () => {
    if (!selectedIntegration) return

    // Mijoz tanlangan bo'lishi kerak
    if (!selectedProjectId) {
      setTestResult({ success: false, message: 'Mijoz tanlanishi kerak!' })
      return
    }

    // Validate required fields
    const missingFields = selectedIntegration.fields
      .filter(f => f.required && !formData[f.key])
      .map(f => f.label)

    if (missingFields.length > 0) {
      setTestResult({ success: false, message: `Majburiy maydonlar to'ldirilmagan: ${missingFields.join(', ')}` })
      return
    }

    try {
      setConnecting(true)
      setTestResult(null)

      const payload = {
        integration_project_id: selectedProjectId,
        integration_id: selectedIntegration.id,
        name: selectedIntegration.name,
        config: formData,
        is_active: true
      }

      if (editingConfig?.id) {
        await api.put(`/integrations/connected/${editingConfig.id}`, payload)
        setTestResult({ success: true, message: 'Integratsiya muvaffaqiyatli yangilandi!' })
      } else {
        await api.post('/integrations/connected', payload)
        setTestResult({ success: true, message: 'Integratsiya muvaffaqiyatli ulandi!' })
      }

      // Reload after short delay to show success message
      setTimeout(() => {
        setShowModal(false)
        loadConnectedIntegrations()
      }, 1500)

    } catch (err: any) {
      console.error('Error connecting integration:', err)
      setTestResult({
        success: false,
        message: err.response?.data?.detail || 'Integratsiyani ulashda xatolik yuz berdi'
      })
    } finally {
      setConnecting(false)
    }
  }

  const handleTestConnection = async () => {
    if (!selectedIntegration) return

    // Validate required fields first
    const missingFields = selectedIntegration.fields
      .filter(f => f.required && !formData[f.key])
      .map(f => f.label)

    if (missingFields.length > 0) {
      setTestResult({ success: false, message: `Majburiy maydonlar to'ldirilmagan: ${missingFields.join(', ')}` })
      return
    }

    try {
      setConnecting(true)
      setTestResult(null)

      const response = await api.post('/integrations/test', {
        integration_id: selectedIntegration.id,
        config: formData
      })

      setTestResult({
        success: response.data.success,
        message: response.data.message || 'Ulanish muvaffaqiyatli!'
      })
    } catch (err: any) {
      setTestResult({
        success: false,
        message: err.response?.data?.detail || 'Ulanishni tekshirishda xatolik'
      })
    } finally {
      setConnecting(false)
    }
  }

  const handleDisconnect = async (config: IntegrationConfig) => {
    if (!confirm(`"${config.name}" integratsiyasini o'chirmoqchimisiz?`)) return

    try {
      await api.delete(`/integrations/connected/${config.id}`)
      loadConnectedIntegrations()
    } catch (err) {
      console.error('Error disconnecting:', err)
    }
  }

  const handleToggleActive = async (config: IntegrationConfig) => {
    try {
      await api.put(`/integrations/connected/${config.id}`, {
        ...config,
        is_active: !config.is_active
      })
      loadConnectedIntegrations()
    } catch (err) {
      console.error('Error toggling:', err)
    }
  }

  const getConnectedConfig = (integrationId: string) => {
    return connectedIntegrations.find(c => c.integration_id === integrationId)
  }

  const categories = Array.from(new Set(AVAILABLE_INTEGRATIONS.map(i => i.category)))

  // Filter integrations based on selected category or "connected" filter
  const filteredIntegrations = categoryFilter === 'all'
    ? AVAILABLE_INTEGRATIONS
    : categoryFilter === 'connected'
    ? AVAILABLE_INTEGRATIONS.filter(i => connectedIntegrations.some(c => c.integration_id === i.id))
    : AVAILABLE_INTEGRATIONS.filter(i => i.category === categoryFilter)

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00a6a6]"></div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header with Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">{t.integrations}</h1>
          <p className="text-sm text-gray-500">Tizimni tashqi xizmatlar bilan ulang</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            Ulangan: {connectedIntegrations.filter(c => c.is_active).length}
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 bg-gray-300 rounded-full"></span>
            Mavjud: {AVAILABLE_INTEGRATIONS.length}
          </span>
        </div>
      </div>

      {/* Subkategoriya Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-1 inline-flex">
        <button
          onClick={() => { setActiveTab('projects'); setSelectedProject(null) }}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
            activeTab === 'projects'
              ? 'bg-[#0a2d5c] text-white shadow-sm'
              : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
        >
          🏢 Mijozlar
          {projects.length > 0 && (
            <span className={`px-1.5 py-0.5 rounded-full text-xs ${
              activeTab === 'projects' ? 'bg-white/20' : 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-400'
            }`}>
              {projects.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('available')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'available'
              ? 'bg-[#00a6a6] text-white shadow-sm'
              : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
        >
          📦 Mavjud servislar
        </button>
        <button
          onClick={() => setActiveTab('connected')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
            activeTab === 'connected'
              ? 'bg-green-500 text-white shadow-sm'
              : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
        >
          ✓ Ulanganlar
          {connectedIntegrations.length > 0 && (
            <span className={`px-1.5 py-0.5 rounded-full text-xs ${
              activeTab === 'connected' ? 'bg-white/20' : 'bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-400'
            }`}>
              {connectedIntegrations.length}
            </span>
          )}
        </button>
      </div>

      {/* ============== MIJOZLAR TAB ============== */}
      {activeTab === 'projects' && !selectedProject && (
        <div className="space-y-4">
          {/* Mijoz qo'shish tugmasi */}
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Integratsiya xizmati ko'rsatiladigan mijozlar (kompaniyalar/loyihalar)
            </p>
            <button
              onClick={() => openProjectModal()}
              className="px-4 py-2 bg-[#0a2d5c] hover:bg-[#0a2d5c]/90 text-white rounded-lg text-sm font-medium flex items-center gap-2"
            >
              {Icons.plus} Yangi mijoz
            </button>
          </div>

          {/* Mijozlar ro'yxati */}
          {projects.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-3xl">
                🏢
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Hech qanday mijoz yo'q
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Integratsiya xizmati ko'rsatish uchun avval mijoz qo'shing
              </p>
              <button
                onClick={() => openProjectModal()}
                className="px-4 py-2 bg-[#0a2d5c] hover:bg-[#0a2d5c]/90 text-white rounded-lg text-sm font-medium"
              >
                Birinchi mijozni qo'shish
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {projects.map(project => {
                const integrationsCount = getProjectIntegrationsCount(project.id)
                return (
                  <div
                    key={project.id}
                    onClick={() => setSelectedProject(project)}
                    className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                  >
                    <div className="p-4">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0a2d5c] to-[#00a6a6] flex items-center justify-center text-white text-xl font-bold">
                          {project.name_uz.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                            {project.name_uz}
                          </h3>
                          {project.name_ru && (
                            <p className="text-xs text-gray-500 truncate">{project.name_ru}</p>
                          )}
                        </div>
                      </div>

                      {/* Statistika */}
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`px-2 py-1 rounded-lg text-xs font-medium ${
                          integrationsCount > 0
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-500'
                        }`}>
                          {integrationsCount > 0 ? `${integrationsCount} integratsiya ulangan` : 'Integratsiya yo\'q'}
                        </div>
                      </div>

                      {/* Ulangan servislar */}
                      {integrationsCount > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                          {connectedIntegrations
                            .filter(c => c.integration_project_id === project.id)
                            .slice(0, 5)
                            .map(conn => {
                              const info = AVAILABLE_INTEGRATIONS.find(i => i.id === conn.integration_id)
                              return info ? (
                                <span key={conn.id} className="text-lg" title={info.name}>
                                  {info.icon}
                                </span>
                              ) : null
                            })}
                          {integrationsCount > 5 && (
                            <span className="text-xs text-gray-500">+{integrationsCount - 5}</span>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700/50 flex gap-2" onClick={e => e.stopPropagation()}>
                      <button
                        onClick={() => setSelectedProject(project)}
                        className="flex-1 px-3 py-2 bg-[#00a6a6] hover:bg-[#008f8f] text-white rounded-lg text-sm font-medium"
                      >
                        Boshqarish
                      </button>
                      <button
                        onClick={() => openProjectModal(project)}
                        className="px-3 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200 rounded-lg text-sm"
                      >
                        {Icons.settings}
                      </button>
                      <button
                        onClick={() => handleDeleteProject(project)}
                        className="px-3 py-2 bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 rounded-lg text-sm"
                      >
                        {Icons.trash}
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* ============== LOYIHA DETAIL VIEW ============== */}
      {activeTab === 'projects' && selectedProject && (
        <div className="space-y-4">
          {/* Orqaga tugmasi va sarlavha */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSelectedProject(null)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-500"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0a2d5c] to-[#00a6a6] flex items-center justify-center text-white text-xl font-bold">
                {selectedProject.name_uz.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">{selectedProject.name_uz}</h2>
                <p className="text-sm text-gray-500">
                  {getProjectIntegrationsCount(selectedProject.id)} ta integratsiya ulangan
                </p>
              </div>
            </div>
            <div className="ml-auto flex gap-2">
              <button
                onClick={() => openProjectModal(selectedProject)}
                className="px-3 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium flex items-center gap-2"
              >
                {Icons.settings} Sozlamalar
              </button>
            </div>
          </div>

          {/* Ulangan integratsiyalar */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                🔗 Ulangan integratsiyalar
              </h3>
              <button
                onClick={() => {
                  setSelectedProjectId(selectedProject.id)
                  setShowAddIntegrationModal(true)
                }}
                className="px-3 py-1.5 bg-[#00a6a6] hover:bg-[#008f8f] text-white rounded-lg text-sm font-medium flex items-center gap-1"
              >
                {Icons.plus} Integratsiya qo'shish
              </button>
            </div>

            {/* Kategoriyalar bo'yicha integratsiyalar */}
            {(() => {
              const projectIntegrations = connectedIntegrations.filter(c => c.integration_project_id === selectedProject.id)

              if (projectIntegrations.length === 0) {
                return (
                  <div className="p-8 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-3xl">
                      🔌
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      Hali integratsiya qo'shilmagan
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                      Bu loyihaga kerakli xizmatlarni ulang
                    </p>
                    <button
                      onClick={() => {
                        setSelectedProjectId(selectedProject.id)
                        setShowAddIntegrationModal(true)
                      }}
                      className="px-4 py-2 bg-[#00a6a6] hover:bg-[#008f8f] text-white rounded-lg text-sm font-medium"
                    >
                      Birinchi integratsiyani qo'shish
                    </button>
                  </div>
                )
              }

              // Kategoriyalar bo'yicha guruhlash
              const byCategory = projectIntegrations.reduce((acc, conn) => {
                const info = AVAILABLE_INTEGRATIONS.find(i => i.id === conn.integration_id)
                const cat = info?.category || 'other'
                if (!acc[cat]) acc[cat] = []
                acc[cat].push({ conn, info })
                return acc
              }, {} as Record<string, { conn: IntegrationConfig, info: typeof AVAILABLE_INTEGRATIONS[0] | undefined }[]>)

              return (
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {Object.entries(byCategory).map(([cat, items]) => (
                    <div key={cat} className="p-4">
                      <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3 flex items-center gap-2">
                        {categoryIcons[cat]} {categoryLabels[cat]}
                        <span className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full">
                          {items.length}
                        </span>
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {items.map(({ conn, info }) => (
                          <div
                            key={conn.id}
                            className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-600"
                          >
                            <div className="w-10 h-10 rounded-lg bg-white dark:bg-gray-800 flex items-center justify-center text-xl shadow-sm">
                              {info?.icon || '🔧'}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-gray-900 dark:text-white text-sm truncate">
                                  {conn.name}
                                </span>
                                <span className={`w-2 h-2 rounded-full ${conn.is_active ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                              </div>
                              <span className="text-xs text-gray-500">
                                {conn.is_active ? 'Faol' : 'Nofaol'}
                              </span>
                            </div>
                            <div className="flex gap-1">
                              <button
                                onClick={() => {
                                  if (info) openConnectModal(info, conn)
                                }}
                                className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg text-gray-500"
                                title="Sozlamalar"
                              >
                                {Icons.settings}
                              </button>
                              <button
                                onClick={() => handleToggleActive(conn)}
                                className={`p-1.5 rounded-lg ${
                                  conn.is_active
                                    ? 'hover:bg-yellow-100 dark:hover:bg-yellow-900/30 text-yellow-600'
                                    : 'hover:bg-green-100 dark:hover:bg-green-900/30 text-green-600'
                                }`}
                                title={conn.is_active ? "O'chirish" : "Yoqish"}
                              >
                                {conn.is_active ? (
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                                  </svg>
                                ) : Icons.check}
                              </button>
                              <button
                                onClick={() => handleDisconnect(conn)}
                                className="p-1.5 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg text-red-500"
                                title="O'chirish"
                              >
                                {Icons.trash}
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )
            })()}
          </div>
        </div>
      )}

      {/* ============== INTEGRATSIYA QO'SHISH MODAL ============== */}
      {showAddIntegrationModal && selectedProjectId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowAddIntegrationModal(false)}>
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Integratsiya qo'shish
                </h3>
                <p className="text-sm text-gray-500">
                  {projects.find(p => p.id === selectedProjectId)?.name_uz} mijoziga
                </p>
              </div>
              <button onClick={() => setShowAddIntegrationModal(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-500">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Category Filter */}
            <div className="px-6 py-3 border-b border-gray-200 dark:border-gray-700">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setCategoryFilter('all')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    categoryFilter === 'all'
                      ? 'bg-[#00a6a6] text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  Barchasi
                </button>
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 ${
                      categoryFilter === cat
                        ? 'bg-[#00a6a6] text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    <span>{categoryIcons[cat]}</span>
                    {categoryLabels[cat]}
                  </button>
                ))}
              </div>
            </div>

            {/* Integrations Grid */}
            <div className="p-6 overflow-y-auto flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {(categoryFilter === 'all' ? AVAILABLE_INTEGRATIONS : AVAILABLE_INTEGRATIONS.filter(i => i.category === categoryFilter))
                  .map(integration => {
                    // Bu loyihada allaqachon ulanganmi?
                    const alreadyConnected = connectedIntegrations.some(
                      c => c.integration_project_id === selectedProjectId && c.integration_id === integration.id
                    )

                    return (
                      <div
                        key={integration.id}
                        onClick={() => {
                          if (!alreadyConnected) {
                            setShowAddIntegrationModal(false)
                            openConnectModal(integration)
                          }
                        }}
                        className={`p-3 rounded-xl border transition-all ${
                          alreadyConnected
                            ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700 cursor-not-allowed'
                            : 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:border-[#00a6a6] hover:shadow-md cursor-pointer'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl ${
                            alreadyConnected ? 'bg-green-100 dark:bg-green-900/30' : 'bg-gray-100 dark:bg-gray-600'
                          }`}>
                            {integration.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-gray-900 dark:text-white text-sm truncate">
                                {integration.name}
                              </span>
                              {alreadyConnected && (
                                <span className="text-xs bg-green-200 dark:bg-green-800 text-green-700 dark:text-green-300 px-1.5 py-0.5 rounded">
                                  ✓ Ulangan
                                </span>
                              )}
                            </div>
                            <span className="text-xs text-gray-500 truncate block">
                              {integration.description.slice(0, 50)}...
                            </span>
                          </div>
                        </div>
                      </div>
                    )
                  })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Category Filter - faqat "Mavjud" tabda ko'rsatiladi */}
      {activeTab === 'available' && (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setCategoryFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              categoryFilter === 'all'
                ? 'bg-[#00a6a6] text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            Barchasi ({AVAILABLE_INTEGRATIONS.length})
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 ${
                categoryFilter === cat
                  ? 'bg-[#00a6a6] text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <span>{categoryIcons[cat]}</span>
              {categoryLabels[cat]} ({AVAILABLE_INTEGRATIONS.filter(i => i.category === cat).length})
            </button>
          ))}
        </div>
      </div>
      )}

      {/* Connected integrations grouped by project - "Ulanganlar" tabda */}
      {activeTab === 'connected' && (
        <>
          {connectedIntegrations.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-3xl">
                🔌
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Hech qanday integratsiya ulanmagan
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Tashqi xizmatlarni ulash uchun "Mavjud integratsiyalar" bo'limiga o'ting va kerakli integratsiyani tanlang
              </p>
              <button
                onClick={() => setActiveTab('available')}
                className="px-4 py-2 bg-[#00a6a6] hover:bg-[#008f8f] text-white rounded-lg text-sm font-medium"
              >
                Mavjud integratsiyalarni ko'rish
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Mijozlar bo'yicha guruhlash */}
              {(() => {
                // Mijozlar bo'yicha guruhlash
                const grouped = connectedIntegrations.reduce((acc, conn) => {
                  const projectName = conn.integration_project?.name_uz || 'Mijozsiz'
                  const projectId = conn.integration_project_id || 0
                  if (!acc[projectId]) {
                    acc[projectId] = {
                      name: projectName,
                      integrations: []
                    }
                  }
                  acc[projectId].integrations.push(conn)
                  return acc
                }, {} as Record<number, { name: string, integrations: IntegrationConfig[] }>)

                return Object.entries(grouped).map(([projectId, group]) => (
                  <div key={projectId} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                    {/* Mijoz sarlavhasi */}
                    <div className="px-4 py-3 bg-gradient-to-r from-[#00a6a6]/10 to-[#0a2d5c]/10 border-b border-gray-200 dark:border-gray-700">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">🏢</span>
                        <h3 className="font-semibold text-gray-900 dark:text-white">{group.name}</h3>
                        <span className="text-xs text-gray-500 bg-gray-200 dark:bg-gray-700 px-2 py-0.5 rounded-full">
                          {group.integrations.length} integratsiya
                        </span>
                      </div>
                    </div>

                    {/* Ulangan servislar */}
                    <div className="p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {group.integrations.map(conn => {
                          const integrationInfo = AVAILABLE_INTEGRATIONS.find(i => i.id === conn.integration_id)
                          if (!integrationInfo) return null

                          return (
                            <div
                              key={conn.id}
                              className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-600"
                            >
                              <div className="w-10 h-10 rounded-lg bg-white dark:bg-gray-800 flex items-center justify-center text-xl shadow-sm">
                                {integrationInfo.icon}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium text-gray-900 dark:text-white text-sm truncate">
                                    {conn.name}
                                  </span>
                                  <span className={`w-2 h-2 rounded-full ${conn.is_active ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                                </div>
                                <span className="text-xs text-gray-500">
                                  {categoryIcons[integrationInfo.category]} {categoryLabels[integrationInfo.category]}
                                </span>
                              </div>
                              <div className="flex gap-1">
                                <button
                                  onClick={() => openConnectModal(integrationInfo, conn)}
                                  className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg text-gray-500"
                                  title="Sozlamalar"
                                >
                                  {Icons.settings}
                                </button>
                                <button
                                  onClick={() => handleDisconnect(conn)}
                                  className="p-1.5 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg text-red-500"
                                  title="O'chirish"
                                >
                                  {Icons.trash}
                                </button>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                ))
              })()}
            </div>
          )}
        </>
      )}

      {/* Integrations Grid - faqat "Mavjud" tabda ko'rsatiladi */}
      {activeTab === 'available' && (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredIntegrations.map((integration) => {
          const connectedConfig = getConnectedConfig(integration.id)
          const isConnected = !!connectedConfig

          return (
            <div
              key={integration.id}
              className={`bg-white dark:bg-gray-800 rounded-xl border overflow-hidden transition-all ${
                isConnected
                  ? 'border-green-300 dark:border-green-700 ring-1 ring-green-100 dark:ring-green-900/30'
                  : 'border-gray-200 dark:border-gray-700'
              }`}
            >
              <div className="p-4">
                <div className="flex items-start gap-3 mb-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${
                    isConnected
                      ? 'bg-green-100 dark:bg-green-900/30'
                      : 'bg-gradient-to-br from-[#00a6a6]/10 to-[#0a2d5c]/10'
                  }`}>
                    {integration.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-900 dark:text-white truncate">{integration.name}</h3>
                      {isConnected && (
                        <span className="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full" title="Ulangan"></span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      {categoryIcons[integration.category]} {categoryLabels[integration.category]}
                    </p>
                  </div>
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
                  {integration.description}
                </p>

                {isConnected && connectedConfig && (
                  <div className="mb-3 p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-green-700 dark:text-green-400 font-medium">
                        {connectedConfig.is_active ? '✓ Faol' : '○ Nofaol'}
                      </span>
                      <button
                        onClick={() => handleToggleActive(connectedConfig)}
                        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                          connectedConfig.is_active ? 'bg-green-500' : 'bg-gray-300'
                        }`}
                      >
                        <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                          connectedConfig.is_active ? 'translate-x-4.5' : 'translate-x-1'
                        }`} style={{ transform: connectedConfig.is_active ? 'translateX(18px)' : 'translateX(4px)' }} />
                      </button>
                    </div>
                  </div>
                )}

                <a
                  href={integration.docs_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-[#00a6a6] hover:underline flex items-center gap-1"
                >
                  {Icons.globe} Hujjatlar
                </a>
              </div>

              <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700/50 flex gap-2">
                {isConnected ? (
                  <>
                    <button
                      onClick={() => openConnectModal(integration, connectedConfig)}
                      className="flex-1 px-3 py-2 bg-[#00a6a6] hover:bg-[#008f8f] text-white rounded-lg text-sm font-medium flex items-center justify-center gap-1"
                    >
                      {Icons.settings} Sozlamalar
                    </button>
                    <button
                      onClick={() => handleDisconnect(connectedConfig!)}
                      className="px-3 py-2 bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 rounded-lg text-sm font-medium"
                    >
                      {Icons.trash}
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => openConnectModal(integration)}
                    className="flex-1 px-3 py-2 bg-[#00a6a6] hover:bg-[#008f8f] text-white rounded-lg text-sm font-medium flex items-center justify-center gap-1"
                  >
                    {Icons.plus} Ulash
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>
      )}

      {/* Connection Modal */}
      {showModal && selectedIntegration && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00a6a6]/10 to-[#0a2d5c]/10 flex items-center justify-center text-xl">
                {selectedIntegration.icon}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {editingConfig ? `${selectedIntegration.name} sozlamalari` : `${selectedIntegration.name} ni ulash`}
                </h3>
                <p className="text-xs text-gray-500">{categoryLabels[selectedIntegration.category]}</p>
              </div>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-500">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4 overflow-y-auto flex-1">
              <p className="text-sm text-gray-600 dark:text-gray-400 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                {selectedIntegration.description}
              </p>

              {/* Mijoz tanlash */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Mijoz <span className="text-red-500">*</span>
                </label>
                <select
                  value={selectedProjectId || ''}
                  onChange={(e) => setSelectedProjectId(e.target.value ? Number(e.target.value) : null)}
                  className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-[#00a6a6] outline-none"
                >
                  <option value="">Mijoz tanlang...</option>
                  {projects.map(project => (
                    <option key={project.id} value={project.id}>
                      {project.name_uz}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">Bu integratsiya qaysi mijozga ulanadi?</p>
              </div>

              {selectedIntegration.fields.map((field) => (
                <div key={field.key}>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {field.label} {field.required && <span className="text-red-500">*</span>}
                  </label>

                  {field.type === 'checkbox' ? (
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={!!formData[field.key]}
                        onChange={(e) => setFormData({ ...formData, [field.key]: e.target.checked })}
                        className="w-4 h-4 text-[#00a6a6] rounded focus:ring-[#00a6a6]"
                      />
                      <span className="text-sm text-gray-600 dark:text-gray-400">Yoqish</span>
                    </label>
                  ) : (
                    <input
                      type={field.type}
                      value={formData[field.key] as string || ''}
                      onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                      placeholder={field.placeholder}
                      className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-[#00a6a6] outline-none"
                    />
                  )}
                </div>
              ))}

              {/* Docs Link */}
              <div className="pt-2">
                <a
                  href={selectedIntegration.docs_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-[#00a6a6] hover:underline flex items-center gap-1"
                >
                  {Icons.globe} Rasmiy hujjatlarni ko'rish →
                </a>
              </div>

              {/* Test Result */}
              {testResult && (
                <div className={`p-3 rounded-lg flex items-center gap-2 ${
                  testResult.success
                    ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                    : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'
                }`}>
                  {testResult.success ? Icons.check : Icons.close}
                  <span className="text-sm">{testResult.message}</span>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex gap-3">
              <button
                onClick={handleTestConnection}
                disabled={connecting}
                className="px-4 py-2.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-xl text-sm font-medium flex items-center gap-2 disabled:opacity-50"
              >
                {connecting ? (
                  <span className="animate-spin">⟳</span>
                ) : (
                  Icons.globe
                )}
                Tekshirish
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-xl text-sm font-medium"
              >
                Bekor qilish
              </button>
              <button
                onClick={handleConnect}
                disabled={connecting}
                className="flex-1 px-4 py-2.5 bg-[#00a6a6] hover:bg-[#008f8f] disabled:opacity-50 text-white rounded-xl text-sm font-medium flex items-center justify-center gap-2"
              >
                {connecting ? (
                  <>
                    <span className="animate-spin">⟳</span>
                    Ulanmoqda...
                  </>
                ) : (
                  <>
                    {Icons.check}
                    {editingConfig ? 'Saqlash' : 'Ulash'}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mijoz Modal */}
      {showProjectModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowProjectModal(false)}>
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-lg overflow-hidden" onClick={e => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0a2d5c] to-[#00a6a6] flex items-center justify-center text-white text-lg">
                🏢
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {editingProject ? 'Mijozni tahrirlash' : 'Yangi mijoz'}
                </h3>
                <p className="text-xs text-gray-500">Integratsiya xizmati ko'rsatiladigan mijoz</p>
              </div>
              <button onClick={() => setShowProjectModal(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-500">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Mijoz nomi (O'zbekcha) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={projectFormData.name_uz}
                  onChange={(e) => setProjectFormData({ ...projectFormData, name_uz: e.target.value })}
                  placeholder="Masalan: Nonbor, TechCorp"
                  className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-[#00a6a6] outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Mijoz nomi (Ruscha)
                </label>
                <input
                  type="text"
                  value={projectFormData.name_ru}
                  onChange={(e) => setProjectFormData({ ...projectFormData, name_ru: e.target.value })}
                  placeholder="Название клиента"
                  className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-[#00a6a6] outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Mijoz nomi (Inglizcha)
                </label>
                <input
                  type="text"
                  value={projectFormData.name_en}
                  onChange={(e) => setProjectFormData({ ...projectFormData, name_en: e.target.value })}
                  placeholder="Client name"
                  className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-[#00a6a6] outline-none"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex gap-3">
              <button
                onClick={() => setShowProjectModal(false)}
                className="px-4 py-2.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-xl text-sm font-medium"
              >
                Bekor qilish
              </button>
              <button
                onClick={handleSaveProject}
                disabled={connecting || !projectFormData.name_uz.trim()}
                className="flex-1 px-4 py-2.5 bg-[#0a2d5c] hover:bg-[#0a2d5c]/90 disabled:opacity-50 text-white rounded-xl text-sm font-medium flex items-center justify-center gap-2"
              >
                {connecting ? (
                  <>
                    <span className="animate-spin">⟳</span>
                    Saqlanmoqda...
                  </>
                ) : (
                  <>
                    {Icons.check}
                    {editingProject ? 'Saqlash' : 'Qo\'shish'}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
