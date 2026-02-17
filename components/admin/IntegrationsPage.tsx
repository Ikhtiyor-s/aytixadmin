'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { Icons } from './Icons'
import { Translations, Language } from '@/lib/admin/translations'
import api from '@/services/api'

interface IntegrationsPageProps {
  t: Translations
  lang: Language
}

// Predefined integrations with their required fields
const AVAILABLE_INTEGRATIONS = [
  {
    id: 'amocrm',
    name: 'AmoCRM',
    icon: '📊',
    category: 'crm',
    phone: '+7 495 748 33 02',
    description: "AmoCRM bilan integratsiya - mijozlar boshqaruvi, savdo voronkasi va avtomatlashtirish",
    docs_url: 'https://www.amocrm.ru/developers/content/crm_platform/platform-abilities',
    signup_url: 'https://www.amocrm.ru/buy',
    merchant_portal: 'https://www.amocrm.ru/oauth',
    api_docs: 'https://www.amocrm.ru/developers/content/crm_platform/platform-abilities',
    support_email: 'support@amocrm.ru',
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
    phone: '+44 204 577 00 77',
    description: "Zadarma IP telefoniya - qo'ng'iroqlar, IVR menyu, call tracking va CRM integratsiyasi",
    docs_url: 'https://zadarma.com/ru/support/api/',
    signup_url: 'https://zadarma.com/ru/auth/registration/',
    merchant_portal: 'https://my.zadarma.com/',
    api_docs: 'https://zadarma.com/ru/support/api/',
    support_email: 'support@zadarma.com',
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
    phone: null,
    description: "Telegram bot integratsiyasi - bildirishnomalar, buyurtmalar va mijozlar bilan aloqa",
    docs_url: 'https://core.telegram.org/bots/api',
    signup_url: 'https://t.me/BotFather',
    api_docs: 'https://core.telegram.org/bots/api',
    tutorial_url: 'https://core.telegram.org/bots/tutorial',
    fields: [
      { key: 'bot_token', label: 'Bot Token', placeholder: 'BotFather dan olingan token', type: 'password', required: true },
      { key: 'chat_id', label: 'Chat ID (Admin)', placeholder: '@userinfobot dan bilish mumkin', type: 'text', required: false },
      { key: 'webhook_url', label: 'Webhook URL', placeholder: 'https://yourdomain.com/api/telegram/webhook', type: 'text', required: false },
    ]
  },
  {
    id: 'payme',
    name: 'Payme',
    icon: '💳',
    category: 'payment',
    phone: '+998 78 150 22 24',
    description: "Payme to'lov tizimi integratsiyasi - onlayn to'lovlarni qabul qilish",
    docs_url: 'https://developer.help.paycom.uz/',
    signup_url: 'https://business.payme.uz/',
    merchant_portal: 'https://cabinet.paycom.uz/',
    api_docs: 'https://developer.help.paycom.uz/metody-merchant-api',
    support_email: 'support@paycom.uz',
    fields: [
      { key: 'merchant_id', label: 'Merchant ID', placeholder: 'Cabinet.paycom.uz dan olish', type: 'text', required: true },
      { key: 'secret_key', label: 'Secret Key (Test)', placeholder: 'Test muhit kaliti', type: 'password', required: true },
      { key: 'secret_key_prod', label: 'Secret Key (Production)', placeholder: 'Production kaliti', type: 'password', required: false },
      { key: 'callback_url', label: 'Callback URL', placeholder: 'https://yourdomain.com/api/payme/callback', type: 'text', required: true },
      { key: 'test_mode', label: 'Test rejimi', placeholder: '', type: 'checkbox', required: false },
    ]
  },
  {
    id: 'click',
    name: 'Click',
    icon: '💳',
    category: 'payment',
    phone: '+998 71 231 08 80',
    description: "Click to'lov tizimi integratsiyasi - onlayn to'lovlarni qabul qilish",
    docs_url: 'https://docs.click.uz/',
    signup_url: 'https://my.click.uz/registration',
    merchant_portal: 'https://my.click.uz/services/merchant',
    api_docs: 'https://docs.click.uz/click-api/',
    support_email: 'support@click.uz',
    fields: [
      { key: 'merchant_id', label: 'Merchant ID', placeholder: 'My.click.uz kabinetdan olish', type: 'text', required: true },
      { key: 'service_id', label: 'Service ID', placeholder: 'Xizmat identifikatori', type: 'text', required: true },
      { key: 'secret_key', label: 'Secret Key', placeholder: 'API kaliti (kabinetdan)', type: 'password', required: true },
      { key: 'merchant_user_id', label: 'Merchant User ID', placeholder: 'Merchant user ID', type: 'text', required: false },
      { key: 'callback_url', label: 'Callback URL', placeholder: 'https://yourdomain.com/api/click/callback', type: 'text', required: true },
    ]
  },
  {
    id: 'google_analytics',
    name: 'Google Analytics',
    icon: '📈',
    category: 'analytics',
    phone: null,
    description: "Google Analytics integratsiyasi - sayt statistikasi va foydalanuvchi xatti-harakatlari",
    docs_url: 'https://developers.google.com/analytics',
    signup_url: 'https://analytics.google.com/analytics/web/',
    merchant_portal: 'https://analytics.google.com/',
    api_docs: 'https://developers.google.com/analytics/devguides/reporting/data/v1',
    support_url: 'https://support.google.com/analytics/',
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
    phone: '+998 71 202 60 60',
    description: "Eskiz SMS xizmati - SMS xabarlar yuborish va OTP tasdiqlash",
    docs_url: 'https://eskiz.uz/documentation',
    signup_url: 'https://my.eskiz.uz/register',
    merchant_portal: 'https://my.eskiz.uz/',
    api_docs: 'https://documenter.getpostman.com/view/663428/RzfmES4z',
    support_email: 'info@eskiz.uz',
    fields: [
      { key: 'email', label: 'Email', placeholder: 'My.eskiz.uz ga kirish email', type: 'email', required: true },
      { key: 'password', label: 'Parol', placeholder: 'My.eskiz.uz paroli', type: 'password', required: true },
      { key: 'sender_name', label: "Jo'natuvchi nomi", placeholder: '4546 (kabinetda tasdiqlangan)', type: 'text', required: false },
    ]
  },
  // ============== YETKAZIB BERISH XIZMATLARI ==============
  {
    id: 'yandex_delivery',
    name: 'Yandex Delivery',
    icon: '🚕',
    category: 'delivery',
    phone: '+998 90 036 22 22',
    description: "Yandex Delivery - tezkor yetkazib berish, real-time tracking va narx kalkulyatsiyasi",
    docs_url: 'https://yandex.ru/dev/logistics/api/',
    signup_url: 'https://partner.market.yandex.ru/',
    merchant_portal: 'https://partner.market.yandex.ru/',
    api_docs: 'https://yandex.ru/dev/logistics/api/',
    support_email: 'delivery-support@yandex.ru',
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
    phone: '+998 71 202 65 00',
    description: "Express24 - O'zbekistonda tezkor yetkazib berish xizmati",
    docs_url: 'https://express24.uz/for-business',
    signup_url: 'https://express24.uz/for-business',
    merchant_portal: 'https://merchant.express24.uz/',
    api_docs: 'https://express24.uz/for-business',
    support_email: 'business@express24.uz',
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
    phone: '+998 78 777 15 15',
    description: "Uzum Nasiya - bo'lib to'lash va yetkazib berish xizmati",
    docs_url: 'https://uzum.uz/business',
    signup_url: 'https://uzum.uz/business',
    merchant_portal: 'https://merchant.uzum.uz/',
    api_docs: 'https://uzum.uz/business',
    support_email: 'merchant@uzum.uz',
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
    phone: null,
    description: "Wolt - restoran va do'konlardan yetkazib berish xizmati",
    docs_url: 'https://wolt.com/partners',
    signup_url: 'https://wolt.com/partners',
    merchant_portal: 'https://restaurant.wolt.com/',
    api_docs: 'https://developer.wolt.com/',
    support_email: 'partnersupport@wolt.com',
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
    phone: null,
    description: "Glovo - tezkor yetkazib berish platformasi",
    docs_url: 'https://glovoapp.com/partners',
    signup_url: 'https://glovoapp.com/partners',
    merchant_portal: 'https://partners.glovoapp.com/',
    api_docs: 'https://api.glovoapp.com/docs',
    support_email: 'partners@glovoapp.com',
    fields: [
      { key: 'store_id', label: "Do'kon ID", placeholder: "Glovo do'kon identifikatori", type: 'text', required: true },
      { key: 'api_key', label: 'API Key', placeholder: 'Glovo API kaliti', type: 'password', required: true },
      { key: 'api_secret', label: 'API Secret', placeholder: 'Glovo API secret', type: 'password', required: true },
      { key: 'webhook_url', label: 'Webhook URL', placeholder: 'https://yourdomain.com/api/glovo/webhook', type: 'text', required: false },
    ]
  },
  {
    id: 'delever',
    name: 'Delever',
    icon: '🚀',
    category: 'delivery',
    phone: '+998 78 150 33 33',
    description: "Delever - yetkazib berish avtomatizatsiya platformasi, POS va aggregatorlar bilan integratsiya",
    docs_url: 'https://www.delever.uz/en/integration2',
    signup_url: 'https://www.delever.uz/en/registration',
    merchant_portal: 'https://admin.delever.uz/',
    api_docs: 'https://www.delever.uz/en/integration2',
    support_email: 'support@delever.uz',
    fields: [
      { key: 'api_key', label: 'API Key', placeholder: 'Delever API kaliti', type: 'password', required: true },
      { key: 'merchant_id', label: 'Merchant ID', placeholder: 'Delever merchant identifikatori', type: 'text', required: true },
      { key: 'branch_id', label: 'Branch ID', placeholder: 'Filial identifikatori', type: 'text', required: false },
      { key: 'secret_key', label: 'Secret Key', placeholder: 'Delever secret kaliti', type: 'password', required: true },
      { key: 'webhook_url', label: 'Webhook URL', placeholder: 'https://yourdomain.com/api/delever/webhook', type: 'text', required: false },
      { key: 'callback_url', label: 'Callback URL', placeholder: 'https://yourdomain.com/api/delever/callback', type: 'text', required: false },
    ]
  },
  // ============== INTERNET SERVIS XIZMATLARI ==============
  {
    id: 'uztelecom',
    name: 'Uztelecom API',
    icon: '🌐',
    category: 'internet',
    phone: '1009',
    description: "Uztelecom - internet va telefon xizmatlari integratsiyasi",
    docs_url: 'https://uztelecom.uz/developers',
    signup_url: 'https://uztelecom.uz/business',
    merchant_portal: 'https://cabinet.uztelecom.uz/',
    api_docs: 'https://uztelecom.uz/developers',
    support_email: 'info@uztelecom.uz',
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
    phone: '+998 90 185 00 55',
    description: "Beeline - mobil va internet xizmatlari integratsiyasi",
    docs_url: 'https://beeline.uz/business',
    signup_url: 'https://beeline.uz/business',
    merchant_portal: 'https://my.beeline.uz/',
    api_docs: 'https://beeline.uz/business',
    support_email: 'business@beeline.uz',
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
    phone: '+998 93 180 00 00',
    description: "Ucell - mobil aloqa va internet xizmatlari",
    docs_url: 'https://ucell.uz/developers',
    signup_url: 'https://ucell.uz/business',
    merchant_portal: 'https://my.ucell.uz/',
    api_docs: 'https://ucell.uz/developers',
    support_email: 'info@ucell.uz',
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
    phone: '+998 97 130 09 09',
    description: "Mobi.uz - mobil aloqa va internet xizmatlari",
    docs_url: 'https://mobi.uz/developers',
    signup_url: 'https://mobi.uz/business',
    merchant_portal: 'https://my.mobi.uz/',
    api_docs: 'https://mobi.uz/developers',
    support_email: 'info@mobi.uz',
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
    phone: '+998 71 252 74 77',
    description: "Turon Telecom - internet provayder xizmatlari",
    docs_url: 'https://turontelecom.uz',
    signup_url: 'https://turontelecom.uz/connect',
    merchant_portal: 'https://cabinet.turontelecom.uz/',
    api_docs: 'https://turontelecom.uz',
    support_email: 'info@turontelecom.uz',
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
    phone: '+998 71 205 88 88',
    description: "Comnet - yuqori tezlikdagi internet xizmatlari",
    docs_url: 'https://comnet.uz',
    signup_url: 'https://comnet.uz/connect',
    merchant_portal: 'https://cabinet.comnet.uz/',
    api_docs: 'https://comnet.uz',
    support_email: 'info@comnet.uz',
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
    phone: '+998 99 831 02 02',
    description: "iiko - restoran va kafelar uchun boshqaruv tizimi, buyurtmalar, menyu va ombor nazorati",
    docs_url: 'https://api-ru.iiko.services/',
    signup_url: 'https://iiko.ru/start/',
    merchant_portal: 'https://iiko.biz/',
    api_docs: 'https://api-ru.iiko.services/',
    support_email: 'support@iiko.ru',
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
    phone: '+998 97 333 18 01',
    description: "R-Keeper - restoran va fast-food uchun POS tizimi, buyurtma va kassani boshqarish",
    docs_url: 'https://rkeeper.ru/api/',
    signup_url: 'https://rkeeper.ru/connect/',
    merchant_portal: 'https://cloud.rkeeper.ru/',
    api_docs: 'https://rkeeper.ru/api/',
    support_email: 'support@rkeeper.ru',
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
    phone: '+998 90 008 01 13',
    description: "Poster - restoran, kafe va do'konlar uchun bulutli POS tizimi",
    docs_url: 'https://dev.joinposter.com/docs',
    signup_url: 'https://joinposter.com/signup',
    merchant_portal: 'https://app.joinposter.com/',
    api_docs: 'https://dev.joinposter.com/docs',
    support_email: 'support@joinposter.com',
    fields: [
      { key: 'access_token', label: 'Access Token', placeholder: 'Poster API access token', type: 'password', required: true },
      { key: 'account_name', label: 'Account nomi', placeholder: 'yourcompany (yourcompany.joinposter.com)', type: 'text', required: true },
      { key: 'webhook_url', label: 'Webhook URL', placeholder: 'https://yourdomain.com/api/poster/webhook', type: 'text', required: false },
    ]
  },
  {
    id: 'mobilkassa',
    name: 'MobilKassa',
    icon: '📱',
    category: 'pos',
    phone: '+998 71 200 03 03',
    description: "MobilKassa - onlayn kassa dasturi, har qanday qurilmada ishlaydi (telefon, planshet, kompyuter). PKM №943 ga mos",
    docs_url: 'https://uz.mkassa.uz',
    signup_url: 'https://mobilkassa.uz/register',
    merchant_portal: 'https://cabinet.mobilkassa.uz/',
    api_docs: 'https://mobilkassa.uz/developers',
    support_email: 'info@mobilkassa.uz',
    fields: [
      { key: 'api_key', label: 'API Key', placeholder: 'MobilKassa API kaliti', type: 'password', required: true },
      { key: 'inn', label: 'INN (STIR)', placeholder: 'Soliq to\'lovchi raqami', type: 'text', required: true },
      { key: 'device_id', label: 'Qurilma ID', placeholder: 'Qurilma identifikatori', type: 'text', required: false },
    ]
  },
  {
    id: 'epos',
    name: 'E-POS Systems',
    icon: '💰',
    category: 'pos',
    phone: '+998 71 200 00 07',
    description: "E-POS Systems - savdo va xizmat ko'rsatish uchun POS terminal yechimlari, fiskal qurilmalar",
    docs_url: 'https://www.uzpos.uz',
    signup_url: 'https://epos.uz/register',
    merchant_portal: 'https://cabinet.epos.uz/',
    api_docs: 'https://epos.uz/api',
    support_email: 'info@epos.uz',
    fields: [
      { key: 'api_key', label: 'API Key', placeholder: 'E-POS API kaliti', type: 'password', required: true },
      { key: 'terminal_id', label: 'Terminal ID', placeholder: 'POS terminal raqami', type: 'text', required: true },
      { key: 'inn', label: 'INN (STIR)', placeholder: 'Soliq to\'lovchi raqami', type: 'text', required: true },
      { key: 'fiscal_module_id', label: 'Fiskal modul ID', placeholder: 'Fiskal modul raqami', type: 'text', required: false },
    ]
  },
  {
    id: 'zpos',
    name: 'ZPos',
    icon: '🖥️',
    category: 'pos',
    phone: null,
    description: "ZPos - kassa dasturi, ombor va do'kon boshqaruvi, 1 oy bepul sinov rejimi",
    docs_url: 'https://zpos.uz',
    signup_url: 'https://zpos.uz/',
    merchant_portal: 'https://cabinet.zpos.uz/',
    api_docs: 'https://zpos.uz/developers',
    support_email: 'info@zpos.uz',
    fields: [
      { key: 'login', label: 'Login', placeholder: 'ZPos login', type: 'text', required: true },
      { key: 'password', label: 'Parol', placeholder: 'ZPos parol', type: 'password', required: true },
      { key: 'shop_id', label: "Do'kon ID", placeholder: "Do'kon identifikatori", type: 'text', required: false },
    ]
  },
  {
    id: 'multikassa',
    name: 'Multikassa',
    icon: '🧾',
    category: 'pos',
    phone: '+998 71 200 12 12',
    description: "Multikassa - mobil onlayn kassa (KKM), OFD.uz ga ro'yxatdan o'tgan, fiskal cheklar",
    docs_url: 'https://multikassa.uz',
    signup_url: 'https://multikassa.uz/register',
    merchant_portal: 'https://cabinet.multikassa.uz/',
    api_docs: 'https://multikassa.uz/developers',
    support_email: 'info@multikassa.uz',
    fields: [
      { key: 'api_key', label: 'API Key', placeholder: 'Multikassa API kaliti', type: 'password', required: true },
      { key: 'inn', label: 'INN (STIR)', placeholder: 'Soliq to\'lovchi raqami', type: 'text', required: true },
      { key: 'device_serial', label: 'Qurilma seriya raqami', placeholder: 'KKM seriya raqami', type: 'text', required: true },
    ]
  },
  {
    id: 'jowi',
    name: 'Jowi',
    icon: '🍕',
    category: 'pos',
    phone: '+998 71 207 06 05',
    description: "Jowi - restoran va kafe avtomatlashtirish tizimi (O'zbekistonda mashhur)",
    docs_url: 'https://jowi.club/developers',
    signup_url: 'https://jowi.club/register',
    merchant_portal: 'https://app.jowi.club/',
    api_docs: 'https://jowi.club/developers',
    support_email: 'support@jowi.club',
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
    phone: '+998 71 205 05 26',
    description: "Paloma365 - savdo va ombor boshqaruv tizimi (Markaziy Osiyo)",
    docs_url: 'https://paloma365.com',
    signup_url: 'https://paloma365.com/register',
    merchant_portal: 'https://app.paloma365.com/',
    api_docs: 'https://paloma365.com/api',
    support_email: 'support@paloma365.com',
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
    phone: '+998 71 200 88 33',
    description: "SmartUP - buxgalteriya, savdo va ombor boshqaruv dasturi",
    docs_url: 'https://smartup.online',
    signup_url: 'https://smartup.online/register',
    merchant_portal: 'https://smartup.online/',
    api_docs: 'https://smartup.online/api-docs',
    support_email: 'support@smartup.online',
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
    phone: '+998 78 113 60 14',
    description: "Billz - chakana savdo uchun bulutli POS tizimi (O'zbekiston)",
    docs_url: 'https://billz.io',
    signup_url: 'https://billz.uz/register',
    merchant_portal: 'https://app.billz.uz/',
    api_docs: 'https://billz.uz/api-docs',
    support_email: 'support@billz.uz',
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
    phone: '+7 800 500 21 38',
    description: "Quick Resto - restoran va kafe uchun bulutli POS tizimi",
    docs_url: 'https://quickresto.ru/api',
    signup_url: 'https://quickresto.ru/register/',
    merchant_portal: 'https://cloud.quickresto.ru/',
    api_docs: 'https://quickresto.ru/api/',
    support_email: 'support@quickresto.ru',
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
    phone: '+7 812 740 30 15',
    description: "Tillypad - restoran va mehmonxona uchun avtomatlashtirish tizimi",
    docs_url: 'https://tillypad.ru',
    signup_url: 'https://tillypad.ru/',
    merchant_portal: 'https://cabinet.tillypad.ru/',
    api_docs: 'https://tillypad.ru/api/',
    support_email: 'support@tillypad.ru',
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
    phone: '+7 495 688 10 01',
    description: "1C:Roznitsa - chakana savdo uchun avtomatlashtirish dasturi",
    docs_url: 'https://1c.uz',
    signup_url: 'https://v8.1c.ru/retail/',
    merchant_portal: 'https://1c.ru/account/',
    api_docs: 'https://its.1c.ru/db/v8doc',
    support_email: 'v8@1c.ru',
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
    phone: '+7 495 730 74 20',
    description: "ATOL Online - fiskal cheklar va OFD bilan integratsiya",
    docs_url: 'https://online.atol.ru/api',
    signup_url: 'https://online.atol.ru/registration/',
    merchant_portal: 'https://online.atol.ru/',
    api_docs: 'https://online.atol.ru/api-doc/',
    support_email: 'support@atol.ru',
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
    phone: '+1 866 932 18 01',
    description: "Lightspeed POS - xalqaro savdo va restoran avtomatlashtirish",
    docs_url: 'https://developers.lightspeedhq.com',
    signup_url: 'https://www.lightspeedhq.com/pos/retail/free-trial/',
    merchant_portal: 'https://cloud.lightspeedapp.com/',
    api_docs: 'https://developers.lightspeedhq.com/',
    support_email: 'support@lightspeedhq.com',
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
    phone: '+1 855 700 60 00',
    description: "Square - to'lov va savdo nuqtasi boshqaruv tizimi",
    docs_url: 'https://developer.squareup.com',
    signup_url: 'https://squareup.com/signup',
    merchant_portal: 'https://squareup.com/dashboard',
    api_docs: 'https://developer.squareup.com/docs',
    support_email: 'developers@squareup.com',
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
    phone: '+1 617 682 02 25',
    description: "Toast - restoran boshqaruvi va POS tizimi",
    docs_url: 'https://doc.toasttab.com',
    signup_url: 'https://pos.toasttab.com/get-demo',
    merchant_portal: 'https://pos.toasttab.com/',
    api_docs: 'https://doc.toasttab.com/',
    support_email: 'support@toasttab.com',
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
    phone: '1198',
    description: "SolIQ Terminal - DYK fiskal terminal va soliq integratsiyasi",
    docs_url: 'https://soliq.uz',
    signup_url: 'https://soliq.uz/services',
    merchant_portal: 'https://my.soliq.uz/',
    api_docs: 'https://soliq.uz/api',
    support_email: 'info@soliq.uz',
    fields: [
      { key: 'inn', label: 'INN (STIR)', placeholder: 'Soliq to\'lovchi raqami', type: 'text', required: true },
      { key: 'device_serial', label: 'Qurilma seriya raqami', placeholder: 'Fiskal qurilma seriya raqami', type: 'text', required: true },
      { key: 'api_key', label: 'API Key', placeholder: 'SolIQ API kaliti', type: 'password', required: true },
      { key: 'environment', label: 'Muhit', placeholder: 'test yoki production', type: 'text', required: false },
    ]
  },
  {
    id: 'neon_alisa',
    name: 'NEON Alisa',
    icon: '🍴',
    category: 'pos',
    phone: '+90 850 309 97 76',
    description: "NEON Alisa - restoran avtomatizatsiya tizimi: buyurtma, ombor, CRM, loyalty, QR menyu va oshxona display",
    docs_url: 'https://neonalisa.com',
    signup_url: 'https://neonapps.uz/',
    merchant_portal: 'https://cabinet.neonapps.uz/',
    api_docs: 'https://neonapps.uz/developers',
    support_email: 'info@neonapps.uz',
    fields: [
      { key: 'api_key', label: 'API Key', placeholder: 'NEON Alisa API kaliti', type: 'password', required: true },
      { key: 'restaurant_id', label: 'Restoran ID', placeholder: 'NEON Alisa restoran identifikatori', type: 'text', required: true },
      { key: 'branch_id', label: 'Filial ID', placeholder: 'Filial identifikatori', type: 'text', required: false },
      { key: 'webhook_url', label: 'Webhook URL', placeholder: 'https://yourdomain.com/api/neonalisa/webhook', type: 'text', required: false },
    ]
  },
  // ============== KOMMUNAL XIZMATLAR ==============
  {
    id: 'hududgaz',
    name: 'Hududgaz',
    icon: '🔥',
    category: 'utility',
    phone: '1104',
    description: "Hududgaz - gaz xizmatlari uchun to'lovlar",
    docs_url: 'https://hududgaz.uz',
    signup_url: 'https://hududgaz.uz/',
    merchant_portal: 'https://hududgaz.uz/cabinet',
    api_docs: 'https://hududgaz.uz/',
    support_email: 'info@hududgaz.uz',
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
    phone: '1154',
    description: "Elektr energiya - elektr xizmatlari uchun to'lovlar",
    docs_url: 'https://elektroenergiya.uz',
    signup_url: 'https://uzenergy.uz/',
    merchant_portal: 'https://my.uzenergy.uz/',
    api_docs: 'https://uzenergy.uz/',
    support_email: 'info@uzenergy.uz',
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
    phone: '1255',
    description: "Suvoqova - suv ta'minoti xizmatlari",
    docs_url: 'https://suvoqova.uz',
    signup_url: 'https://suvokova.uz/',
    merchant_portal: 'https://suvokova.uz/cabinet',
    api_docs: 'https://suvokova.uz/',
    support_email: 'info@suvokova.uz',
    fields: [
      { key: 'account_number', label: 'Hisob raqami', placeholder: 'Suv hisob raqami', type: 'text', required: true },
      { key: 'address', label: 'Manzil', placeholder: "To'liq manzil", type: 'text', required: false },
    ]
  },

  // ============== TO'LOV TIZIMLARI (yangi) ==============
  {
    id: 'paynet',
    name: 'Paynet',
    icon: '💳',
    category: 'payment',
    phone: '+998 71 202 02 01',
    description: "Paynet to'lov tizimi - 20M+ foydalanuvchi, kommunal, mobil to'lovlar va pul o'tkazmalari",
    docs_url: 'https://paynet.uz',
    signup_url: 'https://paynet.uz/business',
    merchant_portal: 'https://cabinet.paynet.uz/',
    api_docs: 'https://paynet.uz/developers',
    support_email: 'support@paynet.uz',
    fields: [
      { key: 'merchant_id', label: 'Merchant ID', placeholder: 'Paynet merchant identifikatori', type: 'text', required: true },
      { key: 'secret_key', label: 'Secret Key', placeholder: 'Paynet secret key', type: 'password', required: true },
      { key: 'service_id', label: 'Service ID', placeholder: 'Xizmat identifikatori', type: 'text', required: true },
      { key: 'callback_url', label: 'Callback URL', placeholder: 'https://yourdomain.com/api/paynet/callback', type: 'text', required: false },
    ]
  },
  {
    id: 'uzcard',
    name: 'Uzcard',
    icon: '💳',
    category: 'payment',
    phone: '+998 71 200 06 44',
    description: "Uzcard - milliy to'lov kartasi tizimi, onlayn ekvayring va karta-karta o'tkazmalar",
    docs_url: 'https://api.uzcard.uz',
    signup_url: 'https://uzcard.uz/business',
    merchant_portal: 'https://cabinet.uzcard.uz/',
    api_docs: 'https://api.uzcard.uz/docs',
    support_email: 'support@uzcard.uz',
    fields: [
      { key: 'terminal_id', label: 'Terminal ID', placeholder: 'Uzcard terminal identifikatori', type: 'text', required: true },
      { key: 'merchant_id', label: 'Merchant ID', placeholder: 'Merchant identifikatori', type: 'text', required: true },
      { key: 'secret_key', label: 'Secret Key', placeholder: 'API secret key', type: 'password', required: true },
      { key: 'callback_url', label: 'Callback URL', placeholder: 'https://yourdomain.com/api/uzcard/callback', type: 'text', required: false },
    ]
  },
  {
    id: 'humo',
    name: 'Humo',
    icon: '💳',
    category: 'payment',
    phone: '+998 71 200 01 01',
    description: "Humo - milliy to'lov kartasi tizimi, Uzcard bilan interoperabel, onlayn ekvayring",
    docs_url: 'https://humocard.uz',
    signup_url: 'https://humocard.uz/business',
    merchant_portal: 'https://cabinet.humocard.uz/',
    api_docs: 'https://humocard.uz/developers',
    support_email: 'support@humocard.uz',
    fields: [
      { key: 'terminal_id', label: 'Terminal ID', placeholder: 'Humo terminal identifikatori', type: 'text', required: true },
      { key: 'merchant_id', label: 'Merchant ID', placeholder: 'Merchant identifikatori', type: 'text', required: true },
      { key: 'secret_key', label: 'Secret Key', placeholder: 'API secret key', type: 'password', required: true },
      { key: 'callback_url', label: 'Callback URL', placeholder: 'https://yourdomain.com/api/humo/callback', type: 'text', required: false },
    ]
  },
  {
    id: 'atmos',
    name: 'ATMOS',
    icon: '💳',
    category: 'payment',
    phone: '+998 71 200 03 15',
    description: "ATMOS - fintech to'lov platformasi, ekvayring, processing va to'lov avtomatizatsiyasi",
    docs_url: 'https://atmos.uz',
    signup_url: 'https://atmos.uz/business',
    merchant_portal: 'https://my.atmos.uz/',
    api_docs: 'https://atmos.uz/api-docs',
    support_email: 'support@atmos.uz',
    fields: [
      { key: 'store_id', label: 'Store ID', placeholder: 'ATMOS store identifikatori', type: 'text', required: true },
      { key: 'api_key', label: 'API Key', placeholder: 'ATMOS API kaliti', type: 'password', required: true },
      { key: 'secret_key', label: 'Secret Key', placeholder: 'ATMOS secret key', type: 'password', required: true },
      { key: 'callback_url', label: 'Callback URL', placeholder: 'https://yourdomain.com/api/atmos/callback', type: 'text', required: false },
    ]
  },
  {
    id: 'apelsin',
    name: 'Apelsin (Kapitalbank)',
    icon: '💳',
    category: 'payment',
    phone: '+998 71 200 00 44',
    description: "Apelsin - Kapitalbank raqamli to'lov tizimi, onlayn to'lovlar va pul o'tkazmalari",
    docs_url: 'https://kapitalbank.uz',
    signup_url: 'https://kapitalbank.uz/business',
    merchant_portal: 'https://business.kapitalbank.uz/',
    api_docs: 'https://kapitalbank.uz/api',
    support_email: 'support@kapitalbank.uz',
    fields: [
      { key: 'merchant_id', label: 'Merchant ID', placeholder: 'Kapitalbank merchant ID', type: 'text', required: true },
      { key: 'api_key', label: 'API Key', placeholder: 'Apelsin API kaliti', type: 'password', required: true },
      { key: 'secret_key', label: 'Secret Key', placeholder: 'Secret key', type: 'password', required: true },
      { key: 'callback_url', label: 'Callback URL', placeholder: 'https://yourdomain.com/api/apelsin/callback', type: 'text', required: false },
    ]
  },
  {
    id: 'alif_nasiya',
    name: 'Alif Nasiya',
    icon: '💳',
    category: 'payment',
    phone: '+998 78 777 08 08',
    description: "Alif Nasiya - bo'lib to'lash xizmati (BNPL), 3-24 oylik muddatga nasiya",
    docs_url: 'https://alif.uz',
    signup_url: 'https://alifnasiya.uz/merchant',
    merchant_portal: 'https://merchant.alifnasiya.uz/',
    api_docs: 'https://alifnasiya.uz/developers',
    support_email: 'merchant@alifnasiya.uz',
    fields: [
      { key: 'merchant_id', label: 'Merchant ID', placeholder: 'Alif merchant identifikatori', type: 'text', required: true },
      { key: 'api_key', label: 'API Key', placeholder: 'Alif API kaliti', type: 'password', required: true },
      { key: 'secret_key', label: 'Secret Key', placeholder: 'Alif secret key', type: 'password', required: true },
      { key: 'callback_url', label: 'Callback URL', placeholder: 'https://yourdomain.com/api/alif/callback', type: 'text', required: false },
    ]
  },
  {
    id: 'oson',
    name: 'OSON',
    icon: '💳',
    category: 'payment',
    phone: '+998 71 207 07 07',
    description: "OSON - mobil to'lov tizimi, 30M+ tranzaksiya, tezkor to'lovlar",
    docs_url: 'https://oson.uz',
    signup_url: 'https://oson.uz/business',
    merchant_portal: 'https://cabinet.oson.uz/',
    api_docs: 'https://oson.uz/api',
    support_email: 'info@oson.uz',
    fields: [
      { key: 'merchant_id', label: 'Merchant ID', placeholder: 'OSON merchant identifikatori', type: 'text', required: true },
      { key: 'api_key', label: 'API Key', placeholder: 'OSON API kaliti', type: 'password', required: true },
      { key: 'secret_key', label: 'Secret Key', placeholder: 'OSON secret key', type: 'password', required: true },
    ]
  },
  {
    id: 'upay',
    name: 'UPay',
    icon: '💳',
    category: 'payment',
    phone: '+998 95 199 11 99',
    description: "UPay - onlayn to'lov xizmati, Uzcard/Humo kartalar, kommunal to'lovlar",
    docs_url: 'https://upay.net',
    signup_url: 'https://upay.net/business',
    merchant_portal: 'https://cabinet.upay.net/',
    api_docs: 'https://upay.net/api-docs',
    support_email: 'support@upay.net',
    fields: [
      { key: 'merchant_id', label: 'Merchant ID', placeholder: 'UPay merchant identifikatori', type: 'text', required: true },
      { key: 'api_key', label: 'API Key', placeholder: 'UPay API kaliti', type: 'password', required: true },
      { key: 'callback_url', label: 'Callback URL', placeholder: 'https://yourdomain.com/api/upay/callback', type: 'text', required: false },
    ]
  },
  {
    id: 'uzum_bank',
    name: 'Uzum Bank',
    icon: '🏦',
    category: 'payment',
    phone: '+998 78 777 07 07',
    description: "Uzum Bank - merchant ekvayring, karta chiqarish, Humo/Uzcard/Visa/Mastercard",
    docs_url: 'https://merchants.uzumbank.uz',
    signup_url: 'https://merchants.uzumbank.uz/registration',
    merchant_portal: 'https://merchants.uzumbank.uz/',
    api_docs: 'https://merchants.uzumbank.uz/docs',
    support_email: 'merchant@uzumbank.uz',
    fields: [
      { key: 'merchant_id', label: 'Merchant ID', placeholder: 'Uzum Bank merchant ID', type: 'text', required: true },
      { key: 'api_key', label: 'API Key', placeholder: 'API kaliti', type: 'password', required: true },
      { key: 'secret_key', label: 'Secret Key', placeholder: 'Secret key', type: 'password', required: true },
      { key: 'callback_url', label: 'Callback URL', placeholder: 'https://yourdomain.com/api/uzumbank/callback', type: 'text', required: false },
    ]
  },

  // ============== CRM (yangi) ==============
  {
    id: 'bitrix24',
    name: 'Bitrix24',
    icon: '📊',
    category: 'crm',
    phone: '+998 71 200 32 00',
    description: "Bitrix24 - O'zbekistonda #1 CRM tizimi, savdo, vazifalar, telefoniya va avtomatlashtirish",
    docs_url: 'https://dev.1c-bitrix.ru/rest_help/',
    signup_url: 'https://www.bitrix24.uz/create.php',
    merchant_portal: 'https://www.bitrix24.uz/',
    api_docs: 'https://dev.1c-bitrix.ru/rest_help/',
    support_email: 'support@bitrix24.uz',
    fields: [
      { key: 'webhook_url', label: 'Webhook URL', placeholder: 'https://yourcompany.bitrix24.uz/rest/1/xxxxxxxxx/', type: 'text', required: true },
      { key: 'client_id', label: 'Client ID (OAuth)', placeholder: 'OAuth ilovasi Client ID', type: 'text', required: false },
      { key: 'client_secret', label: 'Client Secret', placeholder: 'OAuth Client Secret', type: 'password', required: false },
      { key: 'portal_url', label: 'Portal URL', placeholder: 'https://yourcompany.bitrix24.uz', type: 'text', required: true },
    ]
  },

  // ============== ALOQA (yangi) ==============
  {
    id: 'playmobile',
    name: 'PlayMobile SMS',
    icon: '📱',
    category: 'communication',
    phone: '+998 71 202 02 10',
    description: "PlayMobile - biznes SMS xabarlar, IVR va bildirishnomalar xizmati (2004-yildan)",
    docs_url: 'https://playmobile.uz',
    signup_url: 'https://playmobile.uz/register',
    merchant_portal: 'https://my.playmobile.uz/',
    api_docs: 'https://playmobile.uz/api-docs',
    support_email: 'support@playmobile.uz',
    fields: [
      { key: 'login', label: 'Login', placeholder: 'PlayMobile login', type: 'text', required: true },
      { key: 'password', label: 'Parol', placeholder: 'PlayMobile parol', type: 'password', required: true },
      { key: 'originator', label: 'Originator (Jo\'natuvchi)', placeholder: 'SMS jo\'natuvchi nomi', type: 'text', required: true },
    ]
  },
  {
    id: 'opersms',
    name: 'OperSMS',
    icon: '📱',
    category: 'communication',
    phone: '+998 71 200 05 05',
    description: "OperSMS - SMS gateway, OTP va biznes bildirishnomalar uchun",
    docs_url: 'https://opersms.uz',
    signup_url: 'https://opersms.uz/register',
    merchant_portal: 'https://cabinet.opersms.uz/',
    api_docs: 'https://opersms.uz/api',
    support_email: 'support@opersms.uz',
    fields: [
      { key: 'login', label: 'Login', placeholder: 'OperSMS login', type: 'text', required: true },
      { key: 'password', label: 'Parol', placeholder: 'OperSMS parol', type: 'password', required: true },
    ]
  },
  {
    id: 'jivochat',
    name: 'JivoChat',
    icon: '💬',
    category: 'communication',
    phone: null,
    description: "JivoChat - saytga jonli chat, Facebook, Instagram, WhatsApp, email integratsiya",
    docs_url: 'https://www.jivochat.com/api/',
    signup_url: 'https://www.jivochat.com/pricing/',
    merchant_portal: 'https://app.jivosite.com/',
    api_docs: 'https://www.jivochat.com/api/',
    support_email: 'info@jivosite.com',
    fields: [
      { key: 'widget_id', label: 'Widget ID', placeholder: 'JivoChat widget identifikatori', type: 'text', required: true },
      { key: 'api_key', label: 'API Key', placeholder: 'JivoChat API kaliti', type: 'password', required: false },
    ]
  },

  // ============== YETKAZIB BERISH (yangi) ==============
  {
    id: 'uzum_tezkor',
    name: 'Uzum Tezkor',
    icon: '🚚',
    category: 'delivery',
    phone: '+998 78 777 07 07',
    description: "Uzum Tezkor - yetkazib berish xizmati, 1200+ hamkor, 7 shahar, oziq-ovqat va mahsulotlar",
    docs_url: 'https://uzum.com',
    signup_url: 'https://uzum.uz/business',
    merchant_portal: 'https://seller.uzum.uz/',
    api_docs: 'https://uzum.uz/business',
    support_email: 'delivery@uzum.uz',
    fields: [
      { key: 'api_key', label: 'API Key', placeholder: 'Uzum Tezkor API kaliti', type: 'password', required: true },
      { key: 'merchant_id', label: 'Merchant ID', placeholder: 'Merchant identifikatori', type: 'text', required: true },
      { key: 'webhook_url', label: 'Webhook URL', placeholder: 'https://yourdomain.com/api/uzum-tezkor/webhook', type: 'text', required: false },
    ]
  },
  {
    id: 'mytaxi_delivery',
    name: 'MyTaxi Delivery',
    icon: '🚕',
    category: 'delivery',
    phone: '+998 71 200 11 00',
    description: "MyTaxi - kuryer va yuk tashish xizmati, 3-10 daqiqada javob, Uzcard/Humo/Visa qabul",
    docs_url: 'https://mytaxi.uz',
    signup_url: 'https://mytaxi.uz/business',
    merchant_portal: 'https://business.mytaxi.uz/',
    api_docs: 'https://mytaxi.uz/business',
    support_email: 'business@mytaxi.uz',
    fields: [
      { key: 'api_key', label: 'API Key', placeholder: 'MyTaxi API kaliti', type: 'password', required: true },
      { key: 'client_id', label: 'Client ID', placeholder: 'Client identifikatori', type: 'text', required: true },
    ]
  },
  {
    id: 'yandex_go',
    name: 'Yandex Go (Kuryer)',
    icon: '🚚',
    category: 'delivery',
    phone: null,
    description: "Yandex Go - kuryer xizmati, hujjat va kichik yuklarni tezkor yetkazish",
    docs_url: 'https://yandex.com/dev/taxi/',
    signup_url: 'https://go.yandex/business',
    merchant_portal: 'https://fleet.yandex.ru/',
    api_docs: 'https://yandex.ru/dev/taxi/',
    support_email: 'support@taxi.yandex.ru',
    fields: [
      { key: 'api_key', label: 'API Key (OAuth Token)', placeholder: 'Yandex Go API kaliti', type: 'password', required: true },
      { key: 'client_id', label: 'Client ID', placeholder: 'Yandex Client ID', type: 'text', required: true },
    ]
  },
  {
    id: 'korzinka_go',
    name: 'Korzinka Go',
    icon: '🛒',
    category: 'delivery',
    phone: '+998 71 200 05 55',
    description: "Korzinka Go - oziq-ovqat yetkazish, 10000+ mahsulot, 59 daqiqada yetkazish",
    docs_url: 'https://korzinka.uz',
    signup_url: 'https://korzinka.uz/delivery',
    merchant_portal: 'https://korzinka.uz/',
    api_docs: 'https://korzinka.uz/delivery',
    support_email: 'info@korzinka.uz',
    fields: [
      { key: 'api_key', label: 'API Key', placeholder: 'Korzinka Go API kaliti', type: 'password', required: true },
      { key: 'store_id', label: "Do'kon ID", placeholder: "Do'kon identifikatori", type: 'text', required: true },
    ]
  },

  // ============== ANALITIKA (yangi) ==============
  {
    id: 'yandex_metrica',
    name: 'Yandex Metrica',
    icon: '📈',
    category: 'analytics',
    phone: null,
    description: "Yandex Metrica - veb-analitika, sessiya qayd etish, issiqlik xaritasi. CIS da juda mashhur",
    docs_url: 'https://yandex.com/dev/metrica/',
    signup_url: 'https://metrica.yandex.com/',
    merchant_portal: 'https://metrica.yandex.com/',
    api_docs: 'https://yandex.ru/dev/metrika/',
    support_url: 'https://yandex.ru/support/metrica/',
    fields: [
      { key: 'counter_id', label: 'Counter ID (Tag raqami)', placeholder: '12345678', type: 'text', required: true },
      { key: 'api_token', label: 'API Token (OAuth)', placeholder: 'Yandex OAuth tokeni', type: 'password', required: false },
    ]
  },
  {
    id: 'facebook_pixel',
    name: 'Facebook Pixel',
    icon: '📈',
    category: 'analytics',
    phone: null,
    description: "Meta Pixel - Facebook/Instagram reklama kampaniyalarini kuzatish va konversiya analitikasi",
    docs_url: 'https://developers.facebook.com/docs/meta-pixel/',
    signup_url: 'https://business.facebook.com/',
    merchant_portal: 'https://business.facebook.com/events_manager',
    api_docs: 'https://developers.facebook.com/docs/meta-pixel/',
    support_url: 'https://www.facebook.com/business/help',
    fields: [
      { key: 'pixel_id', label: 'Pixel ID', placeholder: '1234567890123456', type: 'text', required: true },
      { key: 'access_token', label: 'Conversions API Token', placeholder: 'Meta Conversions API tokeni', type: 'password', required: false },
    ]
  },
  {
    id: 'tiktok_pixel',
    name: 'TikTok Pixel',
    icon: '📈',
    category: 'analytics',
    phone: null,
    description: "TikTok Pixel - TikTok reklama kampaniyalarini kuzatish, 2.5M+ UZ foydalanuvchilar",
    docs_url: 'https://business-api.tiktok.com/',
    signup_url: 'https://ads.tiktok.com/marketing_api/auth',
    merchant_portal: 'https://ads.tiktok.com/',
    api_docs: 'https://ads.tiktok.com/marketing_api/docs',
    support_email: 'ads-support@tiktok.com',
    fields: [
      { key: 'pixel_id', label: 'Pixel ID', placeholder: 'TikTok Pixel ID', type: 'text', required: true },
      { key: 'access_token', label: 'Events API Token', placeholder: 'TikTok Events API tokeni', type: 'password', required: false },
    ]
  },

  // ============== DAVLAT XIZMATLARI ==============
  {
    id: 'oneid',
    name: 'OneID',
    icon: '🏛️',
    category: 'government',
    phone: '1000',
    description: "OneID - yagona identifikatsiya tizimi, OAuth2 orqali foydalanuvchini tasdiqlash",
    docs_url: 'https://id.egov.uz',
    signup_url: 'https://id.egov.uz/',
    merchant_portal: 'https://sso.egov.uz/',
    api_docs: 'https://id.egov.uz/docs',
    support_email: 'support@egov.uz',
    fields: [
      { key: 'client_id', label: 'Client ID', placeholder: 'OneID Client ID', type: 'text', required: true },
      { key: 'client_secret', label: 'Client Secret', placeholder: 'OneID Client Secret', type: 'password', required: true },
      { key: 'redirect_uri', label: 'Redirect URI', placeholder: 'https://yourdomain.com/auth/oneid/callback', type: 'text', required: true },
      { key: 'scope', label: 'Scope', placeholder: 'openid profile', type: 'text', required: false },
    ]
  },
  {
    id: 'myid',
    name: 'MyID',
    icon: '🏛️',
    category: 'government',
    phone: '+998 71 200 91 00',
    description: "MyID - biometrik identifikatsiya tizimi, masofadan foydalanuvchini tasdiqlash (UZINFOCOM)",
    docs_url: 'https://myid.uz',
    signup_url: 'https://myid.uz/business',
    merchant_portal: 'https://dashboard.myid.uz/',
    api_docs: 'https://docs.myid.uz/',
    support_email: 'support@myid.uz',
    fields: [
      { key: 'client_id', label: 'Client ID', placeholder: 'MyID Client ID', type: 'text', required: true },
      { key: 'client_secret', label: 'Client Secret', placeholder: 'MyID Client Secret', type: 'password', required: true },
      { key: 'api_url', label: 'API URL', placeholder: 'https://myid.uz/api/v1', type: 'text', required: false },
    ]
  },
  {
    id: 'factura',
    name: 'Factura.uz',
    icon: '🏛️',
    category: 'government',
    phone: '+998 71 202 34 00',
    description: "Factura.uz - elektron hisob-faktura (e-faktura) tizimi, B2B uchun majburiy",
    docs_url: 'https://factura.uz',
    signup_url: 'https://factura.uz/register',
    merchant_portal: 'https://factura.uz/',
    api_docs: 'https://factura.uz/developers',
    support_email: 'support@factura.uz',
    fields: [
      { key: 'login', label: 'Login (INN)', placeholder: 'Tashkilot INN raqami', type: 'text', required: true },
      { key: 'password', label: 'Parol', placeholder: 'Factura.uz paroli', type: 'password', required: true },
      { key: 'api_key', label: 'API Key', placeholder: 'API kaliti', type: 'password', required: false },
      { key: 'inn', label: 'INN (STIR)', placeholder: '123456789', type: 'text', required: true },
    ]
  },
  {
    id: 'ofd_uz',
    name: 'OFD.uz',
    icon: '🏛️',
    category: 'government',
    phone: '+998 71 200 42 42',
    description: "OFD.uz - fiskal ma'lumotlar operatori, onlayn kassa (KKM) uchun majburiy",
    docs_url: 'https://ofd.uz',
    signup_url: 'https://ofd.uz/register',
    merchant_portal: 'https://cabinet.ofd.uz/',
    api_docs: 'https://ofd.uz/developers',
    support_email: 'support@ofd.uz',
    fields: [
      { key: 'inn', label: 'INN (STIR)', placeholder: 'Tashkilot INN raqami', type: 'text', required: true },
      { key: 'api_key', label: 'API Key', placeholder: 'OFD API kaliti', type: 'password', required: true },
      { key: 'device_serial', label: 'Qurilma seriya raqami', placeholder: 'KKM seriya raqami', type: 'text', required: true },
    ]
  },

  // ============== XARITALAR ==============
  {
    id: 'yandex_maps',
    name: 'Yandex Maps',
    icon: '🗺️',
    category: 'maps',
    phone: null,
    description: "Yandex Maps - xaritalar, geokodlash, marshrutlash. O'zbekistonda eng mashhur xarita xizmati",
    docs_url: 'https://yandex.com/maps-api/',
    signup_url: 'https://developer.tech.yandex.ru/',
    merchant_portal: 'https://developer.tech.yandex.ru/',
    api_docs: 'https://yandex.ru/dev/maps/',
    support_email: 'support@maps.yandex.ru',
    fields: [
      { key: 'api_key', label: 'API Key', placeholder: 'Yandex Maps API kaliti', type: 'password', required: true },
      { key: 'suggest_api_key', label: 'Suggest API Key', placeholder: 'Manzil qidirish uchun API kaliti', type: 'password', required: false },
    ]
  },
  {
    id: 'twogis',
    name: '2GIS',
    icon: '🗺️',
    category: 'maps',
    phone: '+998 71 200 21 21',
    description: "2GIS - shahar xaritasi va biznes katalog, Toshkent va boshqa shaharlar",
    docs_url: 'https://dev.2gis.com/',
    signup_url: 'https://dev.2gis.com/',
    merchant_portal: 'https://dev.2gis.com/',
    api_docs: 'https://api.2gis.com/doc',
    support_email: 'api@2gis.com',
    fields: [
      { key: 'api_key', label: 'API Key', placeholder: '2GIS API kaliti', type: 'password', required: true },
    ]
  },
  {
    id: 'google_maps',
    name: 'Google Maps',
    icon: '🗺️',
    category: 'maps',
    phone: null,
    description: "Google Maps Platform - xaritalar, geokodlash, yo'nalishlar va joylarni qidirish",
    docs_url: 'https://developers.google.com/maps',
    signup_url: 'https://console.cloud.google.com/',
    merchant_portal: 'https://console.cloud.google.com/google/maps-apis',
    api_docs: 'https://developers.google.com/maps/documentation',
    support_url: 'https://developers.google.com/maps/support',
    fields: [
      { key: 'api_key', label: 'API Key', placeholder: 'Google Maps API kaliti', type: 'password', required: true },
    ]
  },

  // ============== IJTIMOIY TARMOQLAR ==============
  {
    id: 'instagram_business',
    name: 'Instagram Business',
    icon: '📷',
    category: 'social',
    phone: null,
    description: "Instagram Business API - kontentni boshqarish, statistika va xabarlar",
    docs_url: 'https://developers.facebook.com/docs/instagram-api/',
    signup_url: 'https://business.instagram.com/',
    merchant_portal: 'https://business.facebook.com/',
    api_docs: 'https://developers.facebook.com/docs/instagram-api/',
    support_url: 'https://help.instagram.com/',
    fields: [
      { key: 'access_token', label: 'Access Token', placeholder: 'Instagram API tokeni', type: 'password', required: true },
      { key: 'business_id', label: 'Business Account ID', placeholder: 'Instagram business hisob ID', type: 'text', required: true },
      { key: 'app_id', label: 'App ID', placeholder: 'Meta App ID', type: 'text', required: false },
      { key: 'app_secret', label: 'App Secret', placeholder: 'Meta App Secret', type: 'password', required: false },
    ]
  },
  {
    id: 'facebook_business',
    name: 'Facebook Business',
    icon: '👥',
    category: 'social',
    phone: null,
    description: "Facebook Business API - sahifa boshqaruvi, reklama va xabarlar integratsiyasi",
    docs_url: 'https://developers.facebook.com/docs/graph-api/',
    signup_url: 'https://business.facebook.com/',
    merchant_portal: 'https://business.facebook.com/',
    api_docs: 'https://developers.facebook.com/docs/marketing-apis/',
    support_url: 'https://www.facebook.com/business/help',
    fields: [
      { key: 'access_token', label: 'Access Token', placeholder: 'Facebook API tokeni', type: 'password', required: true },
      { key: 'page_id', label: 'Page ID', placeholder: 'Facebook sahifa ID', type: 'text', required: true },
      { key: 'app_id', label: 'App ID', placeholder: 'Meta App ID', type: 'text', required: false },
      { key: 'app_secret', label: 'App Secret', placeholder: 'Meta App Secret', type: 'password', required: false },
    ]
  },
  {
    id: 'tiktok_business',
    name: 'TikTok Business',
    icon: '🎵',
    category: 'social',
    phone: null,
    description: "TikTok Business API - reklama boshqaruvi, statistika, 2.5M+ UZ auditoriya",
    docs_url: 'https://business-api.tiktok.com/',
    signup_url: 'https://ads.tiktok.com/marketing_api/auth',
    merchant_portal: 'https://ads.tiktok.com/',
    api_docs: 'https://ads.tiktok.com/marketing_api/docs',
    support_email: 'ads-support@tiktok.com',
    fields: [
      { key: 'access_token', label: 'Access Token', placeholder: 'TikTok API tokeni', type: 'password', required: true },
      { key: 'advertiser_id', label: 'Advertiser ID', placeholder: 'Reklama beruvchi ID', type: 'text', required: true },
      { key: 'app_id', label: 'App ID', placeholder: 'TikTok App ID', type: 'text', required: false },
      { key: 'secret', label: 'App Secret', placeholder: 'TikTok App Secret', type: 'password', required: false },
    ]
  },

  // ============== ELEKTRON TIJORAT ==============
  {
    id: 'uzum_market',
    name: 'Uzum Market',
    icon: '🛒',
    category: 'ecommerce',
    phone: '+998 78 777 07 07',
    description: "Uzum Market - O'zbekistonning eng yirik marketplace, 20M+ oylik foydalanuvchi",
    docs_url: 'https://uzum.uz',
    signup_url: 'https://seller.uzum.uz/registration',
    merchant_portal: 'https://seller.uzum.uz/',
    api_docs: 'https://seller.uzum.uz/docs',
    support_email: 'seller@uzum.uz',
    fields: [
      { key: 'api_key', label: 'API Key (Seller)', placeholder: 'Uzum Market sotuvchi API kaliti', type: 'password', required: true },
      { key: 'shop_id', label: "Do'kon ID", placeholder: "Uzum Market do'kon identifikatori", type: 'text', required: true },
    ]
  },

  // ============== ERP / BUXGALTERIYA ==============
  {
    id: 'odoo',
    name: 'Odoo ERP',
    icon: '📋',
    category: 'erp',
    phone: null,
    description: "Odoo - ochiq kodli ERP/CRM, moliya, ombor, ishlab chiqarish, HR modullari",
    docs_url: 'https://www.odoo.com/documentation/',
    signup_url: 'https://www.odoo.com/trial',
    merchant_portal: 'https://www.odoo.com/my/home',
    api_docs: 'https://www.odoo.com/documentation/17.0/developer/',
    support_url: 'https://www.odoo.com/help',
    fields: [
      { key: 'url', label: 'Server URL', placeholder: 'https://yourcompany.odoo.com', type: 'text', required: true },
      { key: 'database', label: 'Database nomi', placeholder: 'mycompany', type: 'text', required: true },
      { key: 'login', label: 'Login (Email)', placeholder: 'admin@company.uz', type: 'text', required: true },
      { key: 'api_key', label: 'API Key', placeholder: 'Odoo API kaliti', type: 'password', required: true },
    ]
  },
  {
    id: 'iota_erp',
    name: 'IOTA ERP',
    icon: '📋',
    category: 'erp',
    phone: '+998 90 000 00 00',
    description: "IOTA - O'zbekistonda ishlab chiqilgan ochiq kodli ERP, moliya, ombor, HR, AI/IoT",
    docs_url: 'https://iota.uz',
    signup_url: 'https://iota.uz/register',
    merchant_portal: 'https://app.iota.uz/',
    api_docs: 'https://iota.uz/docs',
    support_email: 'support@iota.uz',
    fields: [
      { key: 'api_url', label: 'API URL', placeholder: 'https://api.iota.uz/v1', type: 'text', required: true },
      { key: 'api_key', label: 'API Key', placeholder: 'IOTA ERP API kaliti', type: 'password', required: true },
      { key: 'company_id', label: 'Kompaniya ID', placeholder: 'Kompaniya identifikatori', type: 'text', required: true },
    ]
  },

  // ============== INTERNET (yangi) ==============
  {
    id: 'tps',
    name: 'TPS',
    icon: '🌐',
    category: 'internet',
    phone: '+998 78 129 12 12',
    description: "TPS - internet provayder (1999-yildan), ko'p tarif, moslashuvchan sodiqlik tizimi",
    docs_url: 'https://tps.uz',
    signup_url: 'https://tps.uz/',
    merchant_portal: 'https://cabinet.tps.uz/',
    api_docs: 'https://tps.uz/developers',
    support_email: 'info@tps.uz',
    fields: [
      { key: 'login', label: 'Login', placeholder: 'TPS login', type: 'text', required: true },
      { key: 'password', label: 'Parol', placeholder: 'TPS parol', type: 'password', required: true },
      { key: 'api_key', label: 'API Key', placeholder: 'TPS API kaliti (agar mavjud)', type: 'password', required: false },
    ]
  },
  {
    id: 'sarkor_telecom',
    name: 'Sarkor Telecom',
    icon: '🌐',
    category: 'internet',
    phone: '+998 78 150 33 33',
    description: "Sarkor Telecom - internet, IP telefoniya, video kuzatuv, raqamli TV (22+ yil)",
    docs_url: 'https://sarkor.uz',
    signup_url: 'https://sarkor.uz/business',
    merchant_portal: 'https://my.sarkor.uz/',
    api_docs: 'https://sarkor.uz/developers',
    support_email: 'info@sarkor.uz',
    fields: [
      { key: 'login', label: 'Login', placeholder: 'Sarkor login', type: 'text', required: true },
      { key: 'password', label: 'Parol', placeholder: 'Sarkor parol', type: 'password', required: true },
      { key: 'api_key', label: 'API Key', placeholder: 'API kaliti', type: 'password', required: false },
    ]
  },

  // ============== NEOBANK / RAQAMLI BANKLAR (yangi) ==============
  {
    id: 'anorbank',
    name: 'Anorbank',
    icon: '🏦',
    category: 'payment',
    phone: '+998 71 200 01 01',
    description: "Anorbank - raqamli bank, kartalar, to'lovlar, kreditlar, depozitlar, xalqaro o'tkazmalar",
    docs_url: 'https://anorbank.uz',
    signup_url: 'https://anorbank.uz/business',
    merchant_portal: 'https://business.anorbank.uz/',
    api_docs: 'https://anorbank.uz/developers',
    support_email: 'support@anorbank.uz',
    fields: [
      { key: 'merchant_id', label: 'Merchant ID', placeholder: 'Anorbank merchant identifikatori', type: 'text', required: true },
      { key: 'api_key', label: 'API Key', placeholder: 'Anorbank API kaliti', type: 'password', required: true },
      { key: 'secret_key', label: 'Secret Key', placeholder: 'Anorbank secret kaliti', type: 'password', required: true },
      { key: 'webhook_url', label: 'Webhook URL', placeholder: 'https://yourdomain.com/api/anorbank/webhook', type: 'text', required: false },
    ]
  },
  {
    id: 'tezbank',
    name: 'Tezbank',
    icon: '🏦',
    category: 'payment',
    phone: '+998 71 200 00 00',
    description: "Tezbank - Fintech Farm neobanki, cashback 10%, bepul kartalar, shake-to-pay (2025-avg)",
    docs_url: 'https://tezbank.uz',
    signup_url: 'https://tezbank.uz/',
    merchant_portal: 'https://my.tezbank.uz/',
    api_docs: 'https://tezbank.uz/developers',
    support_email: 'info@tezbank.uz',
    fields: [
      { key: 'merchant_id', label: 'Merchant ID', placeholder: 'Tezbank merchant identifikatori', type: 'text', required: true },
      { key: 'api_key', label: 'API Key', placeholder: 'Tezbank API kaliti', type: 'password', required: true },
      { key: 'webhook_url', label: 'Webhook URL', placeholder: 'https://yourdomain.com/api/tezbank/webhook', type: 'text', required: false },
    ]
  },
  {
    id: 'tbc_uz',
    name: 'TBC Bank UZ',
    icon: '🏦',
    category: 'payment',
    phone: '+998 78 888 88 38',
    description: "TBC Bank UZ (Space International) - 19.7M foydalanuvchi, Salom Card, Osmon Credit, TBC Business",
    docs_url: 'https://tbcbank.uz',
    signup_url: 'https://tbc.uz/business',
    merchant_portal: 'https://online.tbc.uz/',
    api_docs: 'https://developers.tbc.uz/',
    support_email: 'support@tbc.uz',
    fields: [
      { key: 'merchant_id', label: 'Merchant ID', placeholder: 'TBC merchant identifikatori', type: 'text', required: true },
      { key: 'api_key', label: 'API Key', placeholder: 'TBC API kaliti', type: 'password', required: true },
      { key: 'secret_key', label: 'Secret Key', placeholder: 'TBC secret kaliti', type: 'password', required: true },
      { key: 'environment', label: 'Muhit', placeholder: 'sandbox yoki production', type: 'text', required: false },
    ]
  },

  // ============== ELEKTRON TIJORAT (yangi) ==============
  {
    id: 'birbir',
    name: 'BirBir',
    icon: '🛍️',
    category: 'ecommerce',
    phone: '+998 90 123 45 67',
    description: "BirBir - P2P e-commerce, 1M+ yuklamalar, $10M investitsiya, 0% komissiya, 18 kategoriya",
    docs_url: 'https://birbir.uz',
    signup_url: 'https://bir-bir.uz/business',
    merchant_portal: 'https://merchant.bir-bir.uz/',
    api_docs: 'https://bir-bir.uz/developers',
    support_email: 'support@bir-bir.uz',
    fields: [
      { key: 'api_key', label: 'API Key', placeholder: 'BirBir API kaliti', type: 'password', required: true },
      { key: 'shop_id', label: "Do'kon ID", placeholder: "BirBir do'kon identifikatori", type: 'text', required: true },
      { key: 'webhook_url', label: 'Webhook URL', placeholder: 'https://yourdomain.com/api/birbir/webhook', type: 'text', required: false },
    ]
  },
  {
    id: 'alif_shop',
    name: 'Alif Shop',
    icon: '🛍️',
    category: 'ecommerce',
    phone: '+998 78 777 22 23',
    description: "Alif Shop - BNPL e-commerce, Alif Nasiya bilan muddatli to'lov, 27% bozor ulushi",
    docs_url: 'https://alif.uz',
    signup_url: 'https://alifshop.uz/merchant',
    merchant_portal: 'https://merchant.alifshop.uz/',
    api_docs: 'https://alifshop.uz/developers',
    support_email: 'merchant@alifshop.uz',
    fields: [
      { key: 'merchant_id', label: 'Merchant ID', placeholder: 'Alif Shop merchant ID', type: 'text', required: true },
      { key: 'api_key', label: 'API Key', placeholder: 'Alif Shop API kaliti', type: 'password', required: true },
      { key: 'secret_key', label: 'Secret Key', placeholder: 'Alif Shop secret kaliti', type: 'password', required: true },
    ]
  },

  // ============== CRM / SOTUVLAR (yangi) ==============
  {
    id: 'salesdoktor',
    name: 'SalesDoktor',
    icon: '📊',
    category: 'crm',
    phone: '+998 71 200 07 03',
    description: "SalesDoktor - B2B sotuvni avtomatlashtirish, distribyutor boshqaruvi, mobil agentlar, GPS",
    docs_url: 'https://salesdoctor.uz',
    signup_url: 'https://salesdoctor.uz/register',
    merchant_portal: 'https://app.salesdoctor.uz/',
    api_docs: 'https://salesdoctor.uz/api',
    support_email: 'info@salesdoctor.uz',
    fields: [
      { key: 'api_url', label: 'API URL', placeholder: 'https://api.salesdoctor.uz/v1', type: 'text', required: true },
      { key: 'api_key', label: 'API Key', placeholder: 'SalesDoktor API kaliti', type: 'password', required: true },
      { key: 'company_id', label: 'Kompaniya ID', placeholder: 'SalesDoktor kompaniya identifikatori', type: 'text', required: true },
    ]
  },

  // ============== DAVLAT XIZMATLARI (yangi) ==============
  {
    id: 'my_gov',
    name: 'My.gov.uz',
    icon: '🏛️',
    category: 'government',
    phone: '1000',
    description: "My.gov.uz - yagona davlat xizmatlari portali, 760+ onlayn xizmatlar, MyID identifikatsiya",
    docs_url: 'https://my.gov.uz',
    signup_url: 'https://my.gov.uz/',
    merchant_portal: 'https://my.gov.uz/',
    api_docs: 'https://data.gov.uz/',
    support_email: 'support@my.gov.uz',
    fields: [
      { key: 'client_id', label: 'Client ID', placeholder: 'My.gov.uz client identifikatori', type: 'text', required: true },
      { key: 'client_secret', label: 'Client Secret', placeholder: 'My.gov.uz client secret', type: 'password', required: true },
      { key: 'redirect_uri', label: 'Redirect URI', placeholder: 'https://yourdomain.com/api/mygov/callback', type: 'text', required: true },
    ]
  },

  // ============== RETAIL SaaS (yangi) ==============
  {
    id: 'billz_saas',
    name: 'BILLZ SaaS',
    icon: '🛒',
    category: 'pos',
    phone: '+998 71 207 00 07',
    description: "BILLZ - retail SaaS: POS, ombor, CRM, e-commerce, analitika. TBC Bank 53% ulushi, $20M qiymat",
    docs_url: 'https://billz.io',
    signup_url: 'https://billz.uz/register',
    merchant_portal: 'https://app.billz.uz/',
    api_docs: 'https://billz.uz/api-docs',
    support_email: 'support@billz.uz',
    fields: [
      { key: 'api_key', label: 'API Key', placeholder: 'BILLZ API kaliti', type: 'password', required: true },
      { key: 'store_id', label: "Do'kon ID", placeholder: "BILLZ do'kon identifikatori", type: 'text', required: true },
      { key: 'webhook_url', label: 'Webhook URL', placeholder: 'https://yourdomain.com/api/billz/webhook', type: 'text', required: false },
    ]
  },

  // ============== AI / MOLIYA (yangi) ==============
  {
    id: 'etcita',
    name: 'ETCITA',
    icon: '🤖',
    category: 'erp',
    phone: null,
    description: "ETCITA - AI buxgalteriya, soliq hisoboti avtomatlashtirish, SoliqOnline integratsiyasi (KKMlar uchun)",
    docs_url: 'https://etcita.com',
    signup_url: 'https://etcita.uz/',
    merchant_portal: 'https://cabinet.etcita.uz/',
    api_docs: 'https://etcita.uz/',
    support_email: 'info@etcita.uz',
    fields: [
      { key: 'api_key', label: 'API Key', placeholder: 'ETCITA API kaliti', type: 'password', required: true },
      { key: 'inn', label: 'INN (STIR)', placeholder: 'Soliq to\'lovchi raqami', type: 'text', required: true },
      { key: 'company_id', label: 'Kompaniya ID', placeholder: 'ETCITA kompaniya identifikatori', type: 'text', required: false },
    ]
  },

  // ============== YETKAZIB BERISH (yangi qo'shimcha) ==============
  {
    id: 'express24_food',
    name: 'Express24',
    icon: '🍔',
    category: 'delivery',
    phone: '+998 71 205 24 24',
    description: "Express24 - 700+ restoran, 100+ do'kon, Yandex bilan birlashtirilmoqda (2025)",
    docs_url: 'https://express24.uz',
    signup_url: 'https://express24.uz/for-business',
    merchant_portal: 'https://merchant.express24.uz/',
    api_docs: 'https://express24.uz/for-business',
    support_email: 'business@express24.uz',
    fields: [
      { key: 'api_key', label: 'API Key', placeholder: 'Express24 API kaliti', type: 'password', required: true },
      { key: 'restaurant_id', label: 'Restoran ID', placeholder: 'Express24 restoran identifikatori', type: 'text', required: true },
      { key: 'webhook_url', label: 'Webhook URL', placeholder: 'https://yourdomain.com/api/express24/webhook', type: 'text', required: false },
    ]
  },
  // ============== XALQARO TO'LOV TIZIMLARI ==============
  {
    id: 'visa',
    name: 'Visa',
    icon: '💳',
    category: 'payment',
    phone: null,
    description: "Visa - jahon miqyosidagi to'lov kartasi tizimi, onlayn va offline to'lovlar",
    docs_url: 'https://developer.visa.com/',
    signup_url: 'https://developer.visa.com/',
    merchant_portal: 'https://developer.visa.com/portal',
    api_docs: 'https://developer.visa.com/capabilities',
    support_email: 'developer@visa.com',
    fields: [
      { key: 'api_key', label: 'API Key', placeholder: 'Visa Developer API key', type: 'password', required: true },
      { key: 'user_id', label: 'User ID', placeholder: 'Visa API user ID', type: 'text', required: true },
      { key: 'password', label: 'Password', placeholder: 'Visa API password', type: 'password', required: true },
      { key: 'merchant_id', label: 'Merchant ID', placeholder: 'Savdogar identifikatori', type: 'text', required: true },
      { key: 'certificate_path', label: 'Certificate Path', placeholder: 'SSL sertifikat yo\'li', type: 'text', required: false },
      { key: 'sandbox_mode', label: 'Sandbox rejimi', placeholder: '', type: 'checkbox', required: false },
    ]
  },
  {
    id: 'mastercard',
    name: 'Mastercard',
    icon: '💳',
    category: 'payment',
    phone: null,
    description: "Mastercard - jahon miqyosidagi to'lov kartasi tizimi, Gateway API integratsiyasi",
    docs_url: 'https://developer.mastercard.com/',
    signup_url: 'https://developer.mastercard.com/',
    merchant_portal: 'https://developer.mastercard.com/dashboard',
    api_docs: 'https://developer.mastercard.com/gateway/documentation',
    support_email: 'apisupport@mastercard.com',
    fields: [
      { key: 'merchant_id', label: 'Merchant ID', placeholder: 'Mastercard merchant ID', type: 'text', required: true },
      { key: 'api_username', label: 'API Username', placeholder: 'Gateway API username', type: 'text', required: true },
      { key: 'api_password', label: 'API Password', placeholder: 'Gateway API password', type: 'password', required: true },
      { key: 'authentication_password', label: 'Authentication Password', placeholder: 'Tasdiqlash paroli', type: 'password', required: false },
      { key: 'gateway_url', label: 'Gateway URL', placeholder: 'https://gateway.mastercard.com', type: 'text', required: false },
      { key: 'test_mode', label: 'Test rejimi', placeholder: '', type: 'checkbox', required: false },
    ]
  },
  {
    id: 'stripe',
    name: 'Stripe',
    icon: '💳',
    category: 'payment',
    phone: '+1 888 926 2289',
    description: "Stripe - xalqaro to'lov tizimi, onlayn to'lovlar, Subscription va invoicing",
    docs_url: 'https://stripe.com/docs/api',
    signup_url: 'https://dashboard.stripe.com/register',
    merchant_portal: 'https://dashboard.stripe.com/',
    api_docs: 'https://stripe.com/docs/api',
    support_email: 'support@stripe.com',
    fields: [
      { key: 'publishable_key', label: 'Publishable Key', placeholder: 'pk_test_... yoki pk_live_...', type: 'text', required: true },
      { key: 'secret_key', label: 'Secret Key', placeholder: 'sk_test_... yoki sk_live_...', type: 'password', required: true },
      { key: 'webhook_secret', label: 'Webhook Secret', placeholder: 'whsec_... (Dashboard > Webhooks)', type: 'password', required: false },
      { key: 'test_mode', label: 'Test rejimi', placeholder: '', type: 'checkbox', required: false },
    ]
  },
  {
    id: 'paypal',
    name: 'PayPal',
    icon: '💰',
    category: 'payment',
    phone: null,
    description: "PayPal - xalqaro to'lov tizimi va elektron hamyon",
    docs_url: 'https://developer.paypal.com/docs/api/',
    signup_url: 'https://www.paypal.com/business',
    merchant_portal: 'https://www.paypal.com/merchantapps',
    api_docs: 'https://developer.paypal.com/api/rest/',
    support_email: 'developer-support@paypal.com',
    fields: [
      { key: 'client_id', label: 'Client ID', placeholder: 'PayPal client ID', type: 'text', required: true },
      { key: 'client_secret', label: 'Client Secret', placeholder: 'PayPal client secret', type: 'password', required: true },
      { key: 'webhook_id', label: 'Webhook ID', placeholder: 'PayPal webhook ID', type: 'text', required: false },
      { key: 'sandbox_mode', label: 'Sandbox rejimi', placeholder: '', type: 'checkbox', required: false },
    ]
  },
  // ============== XITOY TO'LOV TIZIMLARI ==============
  {
    id: 'alipay',
    name: 'Alipay (支付宝)',
    icon: '🇨🇳',
    category: 'payment',
    phone: '+86 571 8502 2088',
    description: "Alipay - Xitoyning eng yirik mobil to'lov platformasi, QR kod va onlayn to'lovlar",
    docs_url: 'https://global.alipay.com/docs/ac/global/global_overview',
    signup_url: 'https://global.alipay.com/platform/site/ihome',
    merchant_portal: 'https://open.alipay.com/',
    api_docs: 'https://global.alipay.com/docs/ac/global/global_overview',
    support_email: 'globalsupport@service.alipay.com',
    fields: [
      { key: 'app_id', label: 'App ID', placeholder: '2021001234567890', type: 'text', required: true },
      { key: 'private_key', label: 'Private Key (Sizning kalitingiz)', placeholder: 'MIIEvQIBADANBgkqhkiG9w0BAQE...', type: 'password', required: true },
      { key: 'alipay_public_key', label: 'Alipay Public Key', placeholder: 'MIIBIjANBgkqhkiG9w0BAQE...', type: 'password', required: true },
      { key: 'partner_id', label: 'Partner ID (PID)', placeholder: '2088102123456789', type: 'text', required: false },
      { key: 'notify_url', label: 'Notify URL (Callback)', placeholder: 'https://yourdomain.com/api/alipay/notify', type: 'text', required: false },
      { key: 'return_url', label: 'Return URL', placeholder: 'https://yourdomain.com/payment/success', type: 'text', required: false },
      { key: 'charset', label: 'Charset', placeholder: 'utf-8', type: 'text', required: false },
      { key: 'sign_type', label: 'Sign Type', placeholder: 'RSA2', type: 'text', required: false },
    ]
  },
  {
    id: 'wechat_pay',
    name: 'WeChat Pay (微信支付)',
    icon: '🇨🇳',
    category: 'payment',
    phone: '+86 95017',
    description: "WeChat Pay - WeChat ekotizimi ichida to'lov xizmati, mobil to'lovlar va QR kod",
    docs_url: 'https://pay.weixin.qq.com/wiki/doc/apiv3/index.shtml',
    signup_url: 'https://pay.weixin.qq.com/index.php/public/apply_sign/apply_index',
    merchant_portal: 'https://pay.weixin.qq.com/',
    api_docs: 'https://pay.weixin.qq.com/wiki/doc/apiv3/index.shtml',
    support_url: 'https://kf.qq.com/product/wechatpaymentmerchant.html',
    fields: [
      { key: 'app_id', label: 'App ID (APPID)', placeholder: 'wx1234567890abcdef', type: 'text', required: true },
      { key: 'mch_id', label: 'Merchant ID (商户号)', placeholder: '1234567890', type: 'text', required: true },
      { key: 'api_key', label: 'API Key (V2)', placeholder: '32belgili API key', type: 'password', required: true },
      { key: 'api_v3_key', label: 'API v3 Key (APIv3密钥)', placeholder: '32belgili v3 key', type: 'password', required: false },
      { key: 'cert_serial_no', label: 'Certificate Serial No', placeholder: 'Sertifikat seriya raqami', type: 'text', required: false },
      { key: 'private_key_path', label: 'Private Key Path', placeholder: 'apiclient_key.pem fayl yo\'li', type: 'text', required: false },
      { key: 'notify_url', label: 'Notify URL', placeholder: 'https://yourdomain.com/api/wechat/notify', type: 'text', required: false },
    ]
  },
  {
    id: 'unionpay',
    name: 'UnionPay (银联)',
    icon: '🇨🇳',
    category: 'payment',
    phone: null,
    description: "UnionPay - Xitoyning milliy to'lov kartasi tizimi, xalqaro to'lovlar",
    docs_url: 'https://open.unionpay.com/tjweb/index',
    signup_url: 'https://open.unionpay.com/',
    merchant_portal: 'https://merchant.unionpay.com/',
    api_docs: 'https://open.unionpay.com/tjweb/api/list',
    support_email: 'service@unionpay.com',
    fields: [
      { key: 'merchant_id', label: 'Merchant ID', placeholder: 'UnionPay merchant ID', type: 'text', required: true },
      { key: 'terminal_id', label: 'Terminal ID', placeholder: 'Terminal ID', type: 'text', required: true },
      { key: 'access_key', label: 'Access Key', placeholder: 'UnionPay access key', type: 'password', required: true },
      { key: 'secret_key', label: 'Secret Key', placeholder: 'UnionPay secret key', type: 'password', required: true },
      { key: 'notify_url', label: 'Notify URL', placeholder: 'https://yourdomain.com/api/unionpay/notify', type: 'text', required: false },
      { key: 'sandbox_mode', label: 'Test rejimi', placeholder: '', type: 'checkbox', required: false },
    ]
  },
  // ============== TURKIYA TO'LOV TIZIMLARI ==============
  {
    id: 'iyzico',
    name: 'iyzico',
    icon: '🇹🇷',
    category: 'payment',
    phone: '+90 850 222 49 92',
    description: "iyzico - Turkiyaning yetakchi to'lov xizmati, onlayn to'lovlar va marketplace uchun",
    docs_url: 'https://dev.iyzipay.com/',
    signup_url: 'https://www.iyzico.com/kayit',
    merchant_portal: 'https://merchant.iyzipay.com/',
    api_docs: 'https://dev.iyzipay.com/',
    support_email: 'destek@iyzico.com',
    fields: [
      { key: 'api_key', label: 'API Key', placeholder: 'iyzico API key', type: 'password', required: true },
      { key: 'secret_key', label: 'Secret Key', placeholder: 'iyzico secret key', type: 'password', required: true },
      { key: 'base_url', label: 'Base URL', placeholder: 'https://api.iyzipay.com', type: 'text', required: false },
      { key: 'sandbox_mode', label: 'Sandbox rejimi', placeholder: '', type: 'checkbox', required: false },
    ]
  },
  {
    id: 'paytr',
    name: 'PayTR',
    icon: '🇹🇷',
    category: 'payment',
    phone: '+90 850 305 33 78',
    description: "PayTR - Turkiya to'lov xizmati, kredit karta va bo'lib to'lash imkoniyati",
    docs_url: 'https://www.paytr.com/entegrasyon',
    signup_url: 'https://www.paytr.com/magaza/basvuru',
    merchant_portal: 'https://www.paytr.com/magaza/kullanici-girisi',
    api_docs: 'https://www.paytr.com/entegrasyon',
    support_email: 'destek@paytr.com',
    fields: [
      { key: 'merchant_id', label: 'Merchant ID', placeholder: 'PayTR merchant ID', type: 'text', required: true },
      { key: 'merchant_key', label: 'Merchant Key', placeholder: 'PayTR merchant key', type: 'password', required: true },
      { key: 'merchant_salt', label: 'Merchant Salt', placeholder: 'PayTR merchant salt', type: 'password', required: true },
      { key: 'success_url', label: 'Success URL', placeholder: 'https://yourdomain.com/payment/success', type: 'text', required: false },
      { key: 'fail_url', label: 'Fail URL', placeholder: 'https://yourdomain.com/payment/fail', type: 'text', required: false },
    ]
  },
  {
    id: 'param',
    name: 'Param',
    icon: '🇹🇷',
    category: 'payment',
    phone: '+90 850 252 00 00',
    description: "Param - Turkiya sanal pos xizmati, kredit karta to'lovlari",
    docs_url: 'https://dev.param.com.tr/',
    signup_url: 'https://param.com.tr/basvuru',
    merchant_portal: 'https://app.param.com.tr/',
    api_docs: 'https://dev.param.com.tr/',
    support_email: 'destek@param.com.tr',
    fields: [
      { key: 'client_code', label: 'Client Code', placeholder: 'Param client code', type: 'text', required: true },
      { key: 'client_username', label: 'Client Username', placeholder: 'API username', type: 'text', required: true },
      { key: 'client_password', label: 'Client Password', placeholder: 'API password', type: 'password', required: true },
      { key: 'guid', label: 'GUID', placeholder: 'Param GUID', type: 'text', required: true },
      { key: 'mode', label: 'Mode', placeholder: 'T (test) yoki P (production)', type: 'text', required: false },
    ]
  },
  // ============== O'RTA OSIYO TO'LOV TIZIMLARI ==============
  {
    id: 'elcart_kz',
    name: 'ELCART (Qozog\'iston)',
    icon: '🇰🇿',
    category: 'payment',
    phone: '+7 727 311 07 18',
    description: "ELCART - Qozog'iston milliy to'lov tizimi, kartalar va mobil to'lovlar",
    docs_url: 'https://elcart.kz',
    signup_url: 'https://elcart.kz/',
    merchant_portal: 'https://cabinet.elcart.kz/',
    api_docs: 'https://elcart.kz',
    support_email: 'info@elcart.kz',
    fields: [
      { key: 'merchant_id', label: 'Merchant ID', placeholder: 'ELCART merchant identifikatori', type: 'text', required: true },
      { key: 'terminal_id', label: 'Terminal ID', placeholder: 'Terminal identifikatori', type: 'text', required: true },
      { key: 'secret_key', label: 'Secret Key', placeholder: 'ELCART secret key', type: 'password', required: true },
      { key: 'callback_url', label: 'Callback URL', placeholder: 'https://yourdomain.com/api/elcart/callback', type: 'text', required: false },
    ]
  },
  {
    id: 'paybox_kz',
    name: 'PayBox (Qozog\'iston)',
    icon: '🇰🇿',
    category: 'payment',
    phone: '+7 727 222 11 99',
    description: "PayBox - Qozog'iston to'lov xizmati, kartalar va mobil to'lovlar",
    docs_url: 'https://paybox.money/docs/',
    signup_url: 'https://paybox.money/registration',
    merchant_portal: 'https://my.paybox.money/',
    api_docs: 'https://paybox.money/docs/',
    support_email: 'support@paybox.money',
    fields: [
      { key: 'merchant_id', label: 'Merchant ID', placeholder: 'PayBox merchant ID', type: 'text', required: true },
      { key: 'secret_key', label: 'Secret Key', placeholder: 'PayBox secret key', type: 'password', required: true },
      { key: 'success_url', label: 'Success URL', placeholder: 'https://yourdomain.com/payment/success', type: 'text', required: false },
      { key: 'failure_url', label: 'Failure URL', placeholder: 'https://yourdomain.com/payment/failure', type: 'text', required: false },
      { key: 'test_mode', label: 'Test rejimi', placeholder: '', type: 'checkbox', required: false },
    ]
  },
  {
    id: 'kaspi_kz',
    name: 'Kaspi.kz',
    icon: '🇰🇿',
    category: 'payment',
    phone: '+7 727 258 58 58',
    description: "Kaspi.kz - Qozog'istonning eng yirik mobil bank va to'lov tizimi",
    docs_url: 'https://kaspi.kz/merchantcabinet/',
    signup_url: 'https://kaspi.kz/merchantcabinet/registration',
    merchant_portal: 'https://idmc.shop.kaspi.kz/login',
    api_docs: 'https://kaspi.kz/merchantcabinet/#/docs',
    fields: [
      { key: 'merchant_id', label: 'Merchant ID', placeholder: 'Merchant kabinetdan olish', type: 'text', required: true },
      { key: 'api_key', label: 'API Key', placeholder: 'API kalitni kabinetdan yarating', type: 'password', required: true },
      { key: 'terminal_id', label: 'Terminal ID', placeholder: 'Terminal ID (ixtiyoriy)', type: 'text', required: false },
    ]
  },
  {
    id: 'oson_tj',
    name: 'Oson (Tojikiston)',
    icon: '🇹🇯',
    category: 'payment',
    phone: '+992 44 640 00 10',
    description: "Oson - Tojikiston mobil to'lov tizimi va elektron hamyon",
    docs_url: 'https://oson.tj',
    signup_url: 'https://oson.tj/business',
    merchant_portal: 'https://cabinet.oson.tj/',
    api_docs: 'https://oson.tj',
    support_email: 'support@oson.tj',
    fields: [
      { key: 'merchant_id', label: 'Merchant ID', placeholder: 'Oson merchant ID', type: 'text', required: true },
      { key: 'api_key', label: 'API Key', placeholder: 'Oson API key', type: 'password', required: true },
      { key: 'secret_key', label: 'Secret Key', placeholder: 'Oson secret key', type: 'password', required: true },
    ]
  },
  {
    id: 'megapay_kg',
    name: 'MegaPay (Qirg\'iziston)',
    icon: '🇰🇬',
    category: 'payment',
    phone: '+996 312 97 00 00',
    description: "MegaPay - Qirg'iziston mobil to'lov xizmati",
    docs_url: 'https://megapay.kg',
    signup_url: 'https://megapay.kg/',
    merchant_portal: 'https://cabinet.megapay.kg/',
    api_docs: 'https://megapay.kg',
    support_email: 'support@megapay.kg',
    fields: [
      { key: 'merchant_id', label: 'Merchant ID', placeholder: 'MegaPay merchant ID', type: 'text', required: true },
      { key: 'api_key', label: 'API Key', placeholder: 'MegaPay API key', type: 'password', required: true },
      { key: 'terminal_id', label: 'Terminal ID', placeholder: 'Terminal identifikatori', type: 'text', required: false },
    ]
  },
  {
    id: 'altyn_asyr_tm',
    name: 'Altyn Asyr (Turkmaniston)',
    icon: '🇹🇲',
    category: 'payment',
    phone: null,
    description: "Altyn Asyr - Turkmaniston milliy bank kartasi tizimi",
    docs_url: 'https://www.ab.tm',
    signup_url: 'https://www.ab.tm/',
    merchant_portal: 'https://www.ab.tm/',
    api_docs: 'https://www.ab.tm',
    support_email: 'info@ab.tm',
    fields: [
      { key: 'merchant_id', label: 'Merchant ID', placeholder: 'Altyn Asyr merchant ID', type: 'text', required: true },
      { key: 'terminal_id', label: 'Terminal ID', placeholder: 'Terminal identifikatori', type: 'text', required: true },
      { key: 'secret_key', label: 'Secret Key', placeholder: 'Altyn Asyr secret key', type: 'password', required: true },
    ]
  },
  // ============== E-COMMERCE PLATFORMALAR ==============
  {
    id: 'shopify',
    name: 'Shopify',
    icon: '🛍️',
    category: 'ecommerce',
    phone: '+1 888 746 7439',
    description: "Shopify - elektron tijorat platformasi, onlayn do'kon yaratish va boshqarish",
    docs_url: 'https://shopify.dev/docs/api/admin-rest',
    signup_url: 'https://accounts.shopify.com/store-create',
    merchant_portal: 'https://admin.shopify.com/',
    api_docs: 'https://shopify.dev/docs/api/admin-rest',
    support_email: 'support@shopify.com',
    fields: [
      { key: 'shop_domain', label: "Do'kon domeni", placeholder: 'yourstore.myshopify.com', type: 'text', required: true },
      { key: 'access_token', label: 'Admin API Access Token', placeholder: 'shpat_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', type: 'password', required: true },
      { key: 'api_key', label: 'API Key (Client ID)', placeholder: 'Shopify app API key', type: 'text', required: false },
      { key: 'api_secret', label: 'API Secret Key', placeholder: 'Shopify app secret key', type: 'password', required: false },
      { key: 'api_version', label: 'API Version', placeholder: '2024-01', type: 'text', required: false },
      { key: 'webhook_secret', label: 'Webhook Secret', placeholder: 'Webhook verification secret', type: 'password', required: false },
      { key: 'storefront_access_token', label: 'Storefront API Token', placeholder: 'Storefront API uchun (ixtiyoriy)', type: 'password', required: false },
    ]
  },
  {
    id: 'woocommerce',
    name: 'WooCommerce',
    icon: '🛒',
    category: 'ecommerce',
    phone: null,
    description: "WooCommerce - WordPress uchun elektron tijorat plagini",
    docs_url: 'https://woocommerce.github.io/woocommerce-rest-api-docs/',
    signup_url: 'https://woocommerce.com/start/',
    merchant_portal: 'https://wordpress.org/plugins/woocommerce/',
    api_docs: 'https://woocommerce.github.io/woocommerce-rest-api-docs/',
    support_url: 'https://woocommerce.com/support/',
    fields: [
      { key: 'store_url', label: "Do'kon URL", placeholder: 'https://yourstore.com', type: 'text', required: true },
      { key: 'consumer_key', label: 'Consumer Key', placeholder: 'ck_...', type: 'text', required: true },
      { key: 'consumer_secret', label: 'Consumer Secret', placeholder: 'cs_...', type: 'password', required: true },
      { key: 'webhook_secret', label: 'Webhook Secret', placeholder: 'Webhook tasdiqlash kaliti', type: 'password', required: false },
    ]
  },
  // ============== XABARLAR VA ALOQA ==============
  {
    id: 'whatsapp_business',
    name: 'WhatsApp Business API',
    icon: '💬',
    category: 'communication',
    phone: null,
    description: "WhatsApp Business API - mijozlar bilan WhatsApp orqali aloqa, xabarlar va bildirishnomalar",
    docs_url: 'https://developers.facebook.com/docs/whatsapp',
    signup_url: 'https://business.facebook.com/wa/manage/home/',
    merchant_portal: 'https://business.facebook.com/wa/manage/',
    api_docs: 'https://developers.facebook.com/docs/whatsapp/cloud-api',
    support_url: 'https://developers.facebook.com/community/',
    fields: [
      { key: 'phone_number_id', label: 'Telefon raqam ID', placeholder: 'WhatsApp Business telefon raqam ID', type: 'text', required: true },
      { key: 'business_account_id', label: 'Business Account ID', placeholder: 'WhatsApp Business account ID', type: 'text', required: true },
      { key: 'access_token', label: 'Access Token', placeholder: 'Meta/Facebook access token', type: 'password', required: true },
      { key: 'webhook_verify_token', label: 'Webhook Verify Token', placeholder: 'Webhook tasdiqlash tokeni', type: 'password', required: false },
    ]
  },
  {
    id: 'viber_business',
    name: 'Viber Business',
    icon: '📱',
    category: 'communication',
    phone: null,
    description: "Viber Business - biznes uchun xabarlar, botlar va kampaniyalar",
    docs_url: 'https://developers.viber.com/docs/api/',
    signup_url: 'https://partners.viber.com/',
    merchant_portal: 'https://partners.viber.com/account/',
    api_docs: 'https://developers.viber.com/docs/api/',
    support_email: 'partners@viber.com',
    fields: [
      { key: 'auth_token', label: 'Auth Token', placeholder: 'Viber bot auth token', type: 'password', required: true },
      { key: 'sender_name', label: "Jo'natuvchi nomi", placeholder: 'Bot yoki biznes nomi', type: 'text', required: true },
      { key: 'webhook_url', label: 'Webhook URL', placeholder: 'https://yourdomain.com/api/viber/webhook', type: 'text', required: false },
    ]
  },
  {
    id: 'slack',
    name: 'Slack',
    icon: '💼',
    category: 'communication',
    phone: null,
    description: "Slack - jamoaviy aloqa va hamkorlik platformasi, xabarlar va bildirishnomalar",
    docs_url: 'https://api.slack.com/',
    signup_url: 'https://slack.com/get-started',
    merchant_portal: 'https://api.slack.com/apps',
    api_docs: 'https://api.slack.com/methods',
    support_url: 'https://slack.com/help',
    fields: [
      { key: 'workspace_url', label: 'Workspace URL', placeholder: 'yourworkspace.slack.com', type: 'text', required: true },
      { key: 'bot_token', label: 'Bot User OAuth Token', placeholder: 'xoxb-...', type: 'password', required: true },
      { key: 'signing_secret', label: 'Signing Secret', placeholder: 'Slack signing secret', type: 'password', required: false },
      { key: 'webhook_url', label: 'Incoming Webhook URL', placeholder: 'https://hooks.slack.com/services/...', type: 'text', required: false },
    ]
  },
  {
    id: 'zoom',
    name: 'Zoom',
    icon: '📹',
    category: 'communication',
    phone: null,
    description: "Zoom - video konferensiya va onlayn uchrashuvlar platformasi",
    docs_url: 'https://marketplace.zoom.us/docs/api-reference/',
    signup_url: 'https://zoom.us/signup',
    merchant_portal: 'https://marketplace.zoom.us/',
    api_docs: 'https://marketplace.zoom.us/docs/api-reference/',
    support_url: 'https://support.zoom.us/',
    fields: [
      { key: 'account_id', label: 'Account ID', placeholder: 'Zoom account ID', type: 'text', required: true },
      { key: 'client_id', label: 'Client ID', placeholder: 'Zoom OAuth client ID', type: 'text', required: true },
      { key: 'client_secret', label: 'Client Secret', placeholder: 'Zoom OAuth client secret', type: 'password', required: true },
      { key: 'webhook_secret', label: 'Webhook Secret Token', placeholder: 'Webhook verification token', type: 'password', required: false },
    ]
  },
  {
    id: 'microsoft_teams',
    name: 'Microsoft Teams',
    icon: '👥',
    category: 'communication',
    phone: null,
    description: "Microsoft Teams - jamoaviy aloqa, chat va video konferensiya",
    docs_url: 'https://learn.microsoft.com/en-us/graph/teams-concept-overview',
    signup_url: 'https://www.microsoft.com/en-us/microsoft-teams/group-chat-software',
    merchant_portal: 'https://portal.azure.com/',
    api_docs: 'https://learn.microsoft.com/en-us/graph/teams-concept-overview',
    support_url: 'https://support.microsoft.com/en-us/teams',
    fields: [
      { key: 'tenant_id', label: 'Tenant ID', placeholder: 'Azure AD tenant ID', type: 'text', required: true },
      { key: 'client_id', label: 'Client ID (Application ID)', placeholder: 'Azure app client ID', type: 'text', required: true },
      { key: 'client_secret', label: 'Client Secret', placeholder: 'Azure app client secret', type: 'password', required: true },
      { key: 'webhook_url', label: 'Incoming Webhook URL', placeholder: 'Teams channel webhook URL', type: 'text', required: false },
    ]
  },
  // ============== CALL CENTER VA TELEFON API'LARI ==============
  {
    id: 'twilio',
    name: 'Twilio',
    icon: '📞',
    category: 'call_center',
    phone: '+1 844 945 4659',
    description: "Twilio - cloud-based telefon, SMS va video API platformasi, global qo'ng'iroqlar",
    docs_url: 'https://www.twilio.com/docs/usage/api',
    signup_url: 'https://www.twilio.com/try-twilio',
    merchant_portal: 'https://console.twilio.com/',
    api_docs: 'https://www.twilio.com/docs/usage/api',
    support_email: 'help@twilio.com',
    fields: [
      { key: 'account_sid', label: 'Account SID', placeholder: 'ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', type: 'text', required: true },
      { key: 'auth_token', label: 'Auth Token', placeholder: 'Twilio auth token', type: 'password', required: true },
      { key: 'phone_number', label: 'Twilio telefon raqam', placeholder: '+12345678900', type: 'text', required: false },
      { key: 'messaging_service_sid', label: 'Messaging Service SID', placeholder: 'MGxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', type: 'text', required: false },
      { key: 'twiml_app_sid', label: 'TwiML App SID', placeholder: 'APxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', type: 'text', required: false },
      { key: 'api_key_sid', label: 'API Key SID', placeholder: 'SKxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', type: 'text', required: false },
      { key: 'api_key_secret', label: 'API Key Secret', placeholder: 'API key secret', type: 'password', required: false },
      { key: 'status_callback', label: 'Status Callback URL', placeholder: 'https://yourdomain.com/api/twilio/status', type: 'text', required: false },
    ]
  },
  {
    id: 'vonage',
    name: 'Vonage (Nexmo)',
    icon: '📱',
    category: 'call_center',
    phone: null,
    description: "Vonage - telefon, SMS va video API, global qo'ng'iroqlar va xabarlar",
    docs_url: 'https://developer.vonage.com/',
    signup_url: 'https://dashboard.nexmo.com/sign-up',
    merchant_portal: 'https://dashboard.nexmo.com/',
    api_docs: 'https://developer.vonage.com/',
    support_email: 'support@vonage.com',
    fields: [
      { key: 'api_key', label: 'API Key', placeholder: 'Vonage API key', type: 'text', required: true },
      { key: 'api_secret', label: 'API Secret', placeholder: 'Vonage API secret', type: 'password', required: true },
      { key: 'application_id', label: 'Application ID', placeholder: 'Vonage application ID', type: 'text', required: false },
      { key: 'private_key', label: 'Private Key', placeholder: 'Vonage private key', type: 'password', required: false },
      { key: 'signature_secret', label: 'Signature Secret', placeholder: 'Webhook signature secret', type: 'password', required: false },
    ]
  },
  {
    id: 'plivo',
    name: 'Plivo',
    icon: '☎️',
    category: 'call_center',
    phone: null,
    description: "Plivo - cloud telefon API, SMS va qo'ng'iroq xizmatlari",
    docs_url: 'https://www.plivo.com/docs/',
    signup_url: 'https://console.plivo.com/accounts/register/',
    merchant_portal: 'https://console.plivo.com/',
    api_docs: 'https://www.plivo.com/docs/',
    support_email: 'support@plivo.com',
    fields: [
      { key: 'auth_id', label: 'Auth ID', placeholder: 'Plivo Auth ID', type: 'text', required: true },
      { key: 'auth_token', label: 'Auth Token', placeholder: 'Plivo Auth Token', type: 'password', required: true },
      { key: 'phone_number', label: 'Telefon raqam', placeholder: '+1234567890', type: 'text', required: false },
    ]
  },
  {
    id: 'bandwidth',
    name: 'Bandwidth',
    icon: '📡',
    category: 'call_center',
    phone: null,
    description: "Bandwidth - telefon, SMS va MMS API xizmatlari",
    docs_url: 'https://dev.bandwidth.com/docs/',
    signup_url: 'https://www.bandwidth.com/sign-up/',
    merchant_portal: 'https://dashboard.bandwidth.com/',
    api_docs: 'https://dev.bandwidth.com/docs/',
    support_email: 'support@bandwidth.com',
    fields: [
      { key: 'account_id', label: 'Account ID', placeholder: 'Bandwidth account ID', type: 'text', required: true },
      { key: 'username', label: 'API Username', placeholder: 'API token', type: 'text', required: true },
      { key: 'password', label: 'API Password', placeholder: 'API secret', type: 'password', required: true },
      { key: 'application_id', label: 'Application ID', placeholder: 'Messaging application ID', type: 'text', required: false },
    ]
  },
  {
    id: 'sinch',
    name: 'Sinch',
    icon: '🌐',
    category: 'call_center',
    phone: null,
    description: "Sinch - cloud telefon, SMS va video qo'ng'iroqlar platformasi",
    docs_url: 'https://developers.sinch.com/',
    signup_url: 'https://dashboard.sinch.com/signup',
    merchant_portal: 'https://dashboard.sinch.com/',
    api_docs: 'https://developers.sinch.com/',
    support_email: 'support@sinch.com',
    fields: [
      { key: 'project_id', label: 'Project ID', placeholder: 'Sinch project ID', type: 'text', required: true },
      { key: 'key_id', label: 'Key ID', placeholder: 'API key ID', type: 'text', required: true },
      { key: 'key_secret', label: 'Key Secret', placeholder: 'API key secret', type: 'password', required: true },
      { key: 'service_plan_id', label: 'Service Plan ID', placeholder: 'SMS service plan ID', type: 'text', required: false },
      { key: 'api_token', label: 'API Token', placeholder: 'Bearer token', type: 'password', required: false },
    ]
  },
  {
    id: 'telnyx',
    name: 'Telnyx',
    icon: '📞',
    category: 'call_center',
    phone: null,
    description: "Telnyx - global telefon, SMS va SIP trunk xizmatlari",
    docs_url: 'https://developers.telnyx.com/',
    signup_url: 'https://portal.telnyx.com/sign-up',
    merchant_portal: 'https://portal.telnyx.com/',
    api_docs: 'https://developers.telnyx.com/',
    support_email: 'support@telnyx.com',
    fields: [
      { key: 'api_key', label: 'API Key', placeholder: 'KEY...', type: 'password', required: true },
      { key: 'messaging_profile_id', label: 'Messaging Profile ID', placeholder: 'SMS profile ID', type: 'text', required: false },
      { key: 'phone_number', label: 'Telefon raqam', placeholder: '+1234567890', type: 'text', required: false },
    ]
  },
  // ============== CRM VA KONTAKT BOSHQARUV ==============
  {
    id: 'salesforce',
    name: 'Salesforce',
    icon: '☁️',
    category: 'crm',
    phone: '+1 800 667 6389',
    description: "Salesforce - dunyoning eng yirik CRM platformasi, mijozlar va savdo boshqaruvi",
    docs_url: 'https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/',
    signup_url: 'https://www.salesforce.com/form/signup/freetrial-sales/',
    merchant_portal: 'https://login.salesforce.com/',
    api_docs: 'https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/',
    support_url: 'https://help.salesforce.com/',
    fields: [
      { key: 'client_id', label: 'Consumer Key', placeholder: '3MVG9...', type: 'text', required: true },
      { key: 'client_secret', label: 'Consumer Secret', placeholder: 'Connected app consumer secret', type: 'password', required: true },
      { key: 'username', label: 'Username', placeholder: 'user@company.com', type: 'email', required: true },
      { key: 'password', label: 'Password', placeholder: 'Salesforce password', type: 'password', required: true },
      { key: 'security_token', label: 'Security Token', placeholder: 'Email orqali olingan token', type: 'password', required: true },
      { key: 'instance_url', label: 'Instance URL', placeholder: 'https://yourinstance.my.salesforce.com', type: 'text', required: false },
      { key: 'api_version', label: 'API Version', placeholder: 'v60.0', type: 'text', required: false },
      { key: 'sandbox', label: 'Sandbox rejimi', placeholder: '', type: 'checkbox', required: false },
    ]
  },
  {
    id: 'hubspot',
    name: 'HubSpot',
    icon: '🟠',
    category: 'crm',
    phone: '+1 888 482 7768',
    description: "HubSpot - CRM, marketing va savdo avtomatizatsiyasi platformasi",
    docs_url: 'https://developers.hubspot.com/docs/api/overview',
    signup_url: 'https://app.hubspot.com/signup-hubspot/crm',
    merchant_portal: 'https://app.hubspot.com/',
    api_docs: 'https://developers.hubspot.com/docs/api/overview',
    support_email: 'developers@hubspot.com',
    fields: [
      { key: 'access_token', label: 'Private App Access Token', placeholder: 'pat-na1-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx', type: 'password', required: true },
      { key: 'portal_id', label: 'Portal ID (Hub ID)', placeholder: '12345678', type: 'text', required: false },
      { key: 'app_id', label: 'App ID', placeholder: 'HubSpot app ID', type: 'text', required: false },
      { key: 'hapikey', label: 'HAPIkey (eski API)', placeholder: 'HAPIkey (eskirgan, ishlatilmaydi)', type: 'password', required: false },
    ]
  },
  {
    id: 'pipedrive',
    name: 'Pipedrive',
    icon: '📈',
    category: 'crm',
    phone: null,
    description: "Pipedrive - savdo jarayonlarini boshqarish CRM tizimi",
    docs_url: 'https://developers.pipedrive.com/docs/api/v1',
    signup_url: 'https://www.pipedrive.com/signup',
    merchant_portal: 'https://app.pipedrive.com/',
    api_docs: 'https://developers.pipedrive.com/docs/api/v1',
    support_email: 'support@pipedrive.com',
    fields: [
      { key: 'api_token', label: 'API Token', placeholder: 'Pipedrive API token', type: 'password', required: true },
      { key: 'company_domain', label: 'Company Domain', placeholder: 'yourcompany', type: 'text', required: false },
    ]
  },
  {
    id: 'zoho_crm',
    name: 'Zoho CRM',
    icon: '🔷',
    category: 'crm',
    phone: null,
    description: "Zoho CRM - mijozlarni boshqarish va savdo avtomatizatsiyasi",
    docs_url: 'https://www.zoho.com/crm/developer/docs/api/',
    signup_url: 'https://www.zoho.com/crm/signup.html',
    merchant_portal: 'https://crm.zoho.com/',
    api_docs: 'https://www.zoho.com/crm/developer/docs/api/',
    support_email: 'support@zohocrm.com',
    fields: [
      { key: 'client_id', label: 'Client ID', placeholder: 'Zoho OAuth client ID', type: 'text', required: true },
      { key: 'client_secret', label: 'Client Secret', placeholder: 'Zoho OAuth client secret', type: 'password', required: true },
      { key: 'refresh_token', label: 'Refresh Token', placeholder: 'Zoho refresh token', type: 'password', required: true },
      { key: 'accounts_server', label: 'Accounts Server', placeholder: 'https://accounts.zoho.com', type: 'text', required: false },
      { key: 'api_domain', label: 'API Domain', placeholder: 'https://www.zohoapis.com', type: 'text', required: false },
    ]
  },
  {
    id: 'monday',
    name: 'Monday.com',
    icon: '📊',
    category: 'crm',
    phone: null,
    description: "Monday.com - ish jarayonlarini boshqarish va CRM platformasi",
    docs_url: 'https://developer.monday.com/api-reference/docs',
    signup_url: 'https://monday.com/signup',
    merchant_portal: 'https://monday.com/app/',
    api_docs: 'https://developer.monday.com/api-reference/',
    support_url: 'https://support.monday.com/',
    fields: [
      { key: 'api_token', label: 'API Token', placeholder: 'Monday.com API token', type: 'password', required: true },
      { key: 'board_id', label: 'Board ID', placeholder: 'Asosiy board ID (ixtiyoriy)', type: 'text', required: false },
    ]
  },
  {
    id: 'microsoft_dynamics',
    name: 'Microsoft Dynamics 365',
    icon: '💼',
    category: 'crm',
    phone: null,
    description: "Microsoft Dynamics 365 - korporativ CRM va ERP platformasi",
    docs_url: 'https://learn.microsoft.com/en-us/dynamics365/',
    signup_url: 'https://dynamics.microsoft.com/en-us/free-trial/',
    merchant_portal: 'https://make.powerapps.com/',
    api_docs: 'https://learn.microsoft.com/en-us/dynamics365/',
    support_url: 'https://support.microsoft.com/en-us/dynamics-365',
    fields: [
      { key: 'tenant_id', label: 'Tenant ID', placeholder: 'Azure AD tenant ID', type: 'text', required: true },
      { key: 'client_id', label: 'Client ID', placeholder: 'Azure app registration client ID', type: 'text', required: true },
      { key: 'client_secret', label: 'Client Secret', placeholder: 'Azure app client secret', type: 'password', required: true },
      { key: 'resource_url', label: 'Resource URL', placeholder: 'https://yourorg.crm.dynamics.com', type: 'text', required: true },
    ]
  },
  // ============== CALL CENTER PLATFORMALARI ==============
  {
    id: 'aircall',
    name: 'Aircall',
    icon: '☁️',
    category: 'call_center',
    phone: null,
    description: "Aircall - bulutli call center platformasi, qo'ng'iroqlar va CRM integratsiyasi",
    docs_url: 'https://developer.aircall.io/',
    signup_url: 'https://www.aircall.io/start-free-trial/',
    merchant_portal: 'https://dashboard.aircall.io/',
    api_docs: 'https://developer.aircall.io/',
    support_email: 'support@aircall.io',
    fields: [
      { key: 'api_id', label: 'API ID', placeholder: 'Aircall API ID', type: 'text', required: true },
      { key: 'api_token', label: 'API Token', placeholder: 'Aircall API token', type: 'password', required: true },
      { key: 'webhook_token', label: 'Webhook Token', placeholder: 'Webhook authentication token', type: 'password', required: false },
    ]
  },
  {
    id: 'ringcentral',
    name: 'RingCentral',
    icon: '📞',
    category: 'call_center',
    phone: null,
    description: "RingCentral - cloud telefon va call center platformasi",
    docs_url: 'https://developers.ringcentral.com/',
    signup_url: 'https://www.ringcentral.com/office/plansandpricing.html',
    merchant_portal: 'https://service.ringcentral.com/',
    api_docs: 'https://developers.ringcentral.com/',
    support_url: 'https://support.ringcentral.com/',
    fields: [
      { key: 'client_id', label: 'Client ID', placeholder: 'RingCentral app client ID', type: 'text', required: true },
      { key: 'client_secret', label: 'Client Secret', placeholder: 'RingCentral app client secret', type: 'password', required: true },
      { key: 'server_url', label: 'Server URL', placeholder: 'https://platform.ringcentral.com', type: 'text', required: false },
      { key: 'username', label: 'Username', placeholder: 'RingCentral username', type: 'text', required: false },
      { key: 'extension', label: 'Extension', placeholder: 'Telefon kengaytma', type: 'text', required: false },
      { key: 'password', label: 'Password', placeholder: 'RingCentral password', type: 'password', required: false },
    ]
  },
  {
    id: 'genesys',
    name: 'Genesys Cloud',
    icon: '🌐',
    category: 'call_center',
    phone: null,
    description: "Genesys Cloud - korporativ call center va mijozlar tajribasi platformasi",
    docs_url: 'https://developer.genesys.cloud/',
    signup_url: 'https://apps.mypurecloud.com/signup',
    merchant_portal: 'https://apps.mypurecloud.com/',
    api_docs: 'https://developer.genesys.cloud/',
    support_url: 'https://help.mypurecloud.com/',
    fields: [
      { key: 'client_id', label: 'Client ID', placeholder: 'Genesys OAuth client ID', type: 'text', required: true },
      { key: 'client_secret', label: 'Client Secret', placeholder: 'Genesys OAuth client secret', type: 'password', required: true },
      { key: 'environment', label: 'Environment', placeholder: 'mypurecloud.com', type: 'text', required: true },
      { key: 'deployment_id', label: 'Deployment ID', placeholder: 'Web chat deployment ID', type: 'text', required: false },
    ]
  },
  {
    id: '3cx',
    name: '3CX',
    icon: '📱',
    category: 'call_center',
    phone: null,
    description: "3CX - IP PBX va call center yechimi, VoIP telefon tizimi",
    docs_url: 'https://www.3cx.com/docs/manual/api-extensions/',
    signup_url: 'https://www.3cx.com/phone-system/download-phone-system/',
    merchant_portal: 'https://login.3cx.com/',
    api_docs: 'https://www.3cx.com/docs/manual/api-extensions/',
    support_url: 'https://www.3cx.com/support/',
    fields: [
      { key: 'server_url', label: 'Server URL', placeholder: 'https://your3cx.com', type: 'text', required: true },
      { key: 'username', label: 'Username', placeholder: '3CX admin username', type: 'text', required: true },
      { key: 'password', label: 'Password', placeholder: '3CX admin password', type: 'password', required: true },
      { key: 'extension', label: 'Extension', placeholder: 'Telefon kengaytma raqami', type: 'text', required: false },
    ]
  },
  {
    id: 'five9',
    name: 'Five9',
    icon: '☎️',
    category: 'call_center',
    phone: null,
    description: "Five9 - cloud contact center platformasi, inbound va outbound qo'ng'iroqlar",
    docs_url: 'https://www.five9.com/products/application-integration',
    signup_url: 'https://www.five9.com/products/pricing',
    merchant_portal: 'https://login.five9.com/',
    api_docs: 'https://www.five9.com/products/application-integration',
    support_url: 'https://www.five9.com/support',
    fields: [
      { key: 'username', label: 'Username', placeholder: 'Five9 admin username', type: 'text', required: true },
      { key: 'password', label: 'Password', placeholder: 'Five9 admin password', type: 'password', required: true },
      { key: 'domain', label: 'Domain', placeholder: 'yourdomain.five9.com', type: 'text', required: true },
      { key: 'api_key', label: 'API Key', placeholder: 'Five9 API key (yangi API)', type: 'password', required: false },
    ]
  },
  // ============== BULUTLI XOTIRA ==============
  {
    id: 'google_drive',
    name: 'Google Drive',
    icon: '📂',
    category: 'storage',
    phone: null,
    description: "Google Drive - bulutli fayl saqlash va almashish xizmati",
    docs_url: 'https://developers.google.com/drive/api/guides/about-sdk',
    signup_url: 'https://console.cloud.google.com/',
    merchant_portal: 'https://console.cloud.google.com/',
    api_docs: 'https://developers.google.com/drive/api/reference/rest/v3',
    support_url: 'https://developers.google.com/drive/api/support',
    fields: [
      { key: 'client_id', label: 'Client ID', placeholder: 'Google OAuth 2.0 client ID', type: 'text', required: true },
      { key: 'client_secret', label: 'Client Secret', placeholder: 'Google OAuth 2.0 client secret', type: 'password', required: true },
      { key: 'refresh_token', label: 'Refresh Token', placeholder: 'Google OAuth refresh token', type: 'password', required: false },
      { key: 'folder_id', label: 'Folder ID', placeholder: 'Google Drive papka ID (ixtiyoriy)', type: 'text', required: false },
    ]
  },
  {
    id: 'dropbox',
    name: 'Dropbox',
    icon: '📦',
    category: 'storage',
    phone: null,
    description: "Dropbox - bulutli fayl saqlash va sinxronizatsiya xizmati",
    docs_url: 'https://www.dropbox.com/developers/documentation',
    signup_url: 'https://www.dropbox.com/developers/apps',
    merchant_portal: 'https://www.dropbox.com/developers/apps',
    api_docs: 'https://www.dropbox.com/developers/documentation/http/overview',
    support_email: 'api-support@dropbox.com',
    fields: [
      { key: 'app_key', label: 'App Key', placeholder: 'Dropbox app key', type: 'text', required: true },
      { key: 'app_secret', label: 'App Secret', placeholder: 'Dropbox app secret', type: 'password', required: true },
      { key: 'access_token', label: 'Access Token', placeholder: 'Dropbox access token', type: 'password', required: true },
      { key: 'refresh_token', label: 'Refresh Token', placeholder: 'Dropbox refresh token (ixtiyoriy)', type: 'password', required: false },
    ]
  },
  // ============== EMAIL XIZMATLARI ==============
  {
    id: 'sendgrid',
    name: 'SendGrid',
    icon: '📧',
    category: 'email',
    phone: null,
    description: "SendGrid - email yuborish xizmati, transaksion va marketing emaillar",
    docs_url: 'https://docs.sendgrid.com/api-reference',
    signup_url: 'https://signup.sendgrid.com/',
    merchant_portal: 'https://app.sendgrid.com/',
    api_docs: 'https://docs.sendgrid.com/api-reference/how-to-use-the-sendgrid-v3-api',
    support_url: 'https://support.sendgrid.com/',
    fields: [
      { key: 'api_key', label: 'API Key', placeholder: 'SG.xxxxx', type: 'password', required: true },
      { key: 'from_email', label: "Jo'natuvchi email", placeholder: 'noreply@yourdomain.com', type: 'email', required: true },
      { key: 'from_name', label: "Jo'natuvchi nomi", placeholder: 'Your Company Name', type: 'text', required: false },
      { key: 'webhook_url', label: 'Webhook URL', placeholder: 'https://yourdomain.com/api/sendgrid/webhook', type: 'text', required: false },
    ]
  },
  {
    id: 'mailchimp',
    name: 'Mailchimp',
    icon: '🐵',
    category: 'email',
    phone: null,
    description: "Mailchimp - email marketing va avtomatlashtirish platformasi",
    docs_url: 'https://mailchimp.com/developer/',
    signup_url: 'https://login.mailchimp.com/signup/',
    merchant_portal: 'https://admin.mailchimp.com/',
    api_docs: 'https://mailchimp.com/developer/marketing/',
    support_url: 'https://mailchimp.com/contact/',
    fields: [
      { key: 'api_key', label: 'API Key', placeholder: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx-us1', type: 'password', required: true },
      { key: 'server_prefix', label: 'Server Prefix', placeholder: 'us1 (API key dan)', type: 'text', required: true },
      { key: 'list_id', label: 'Audience/List ID', placeholder: 'Default ro\'yxat ID', type: 'text', required: false },
    ]
  },
  {
    id: 'mailgun',
    name: 'Mailgun',
    icon: '🔫',
    category: 'email',
    phone: null,
    description: "Mailgun - ishonchli email yuborish API xizmati",
    docs_url: 'https://documentation.mailgun.com/en/latest/',
    signup_url: 'https://signup.mailgun.com/new/signup',
    merchant_portal: 'https://app.mailgun.com/',
    api_docs: 'https://documentation.mailgun.com/en/latest/',
    support_email: 'support@mailgun.com',
    fields: [
      { key: 'api_key', label: 'API Key', placeholder: 'Mailgun API key', type: 'password', required: true },
      { key: 'domain', label: 'Domain', placeholder: 'mg.yourdomain.com', type: 'text', required: true },
      { key: 'from_email', label: "Jo'natuvchi email", placeholder: 'noreply@yourdomain.com', type: 'email', required: true },
      { key: 'region', label: 'Region', placeholder: 'us yoki eu', type: 'text', required: false },
    ]
  },
  // ============== DASTURLASH VA DEVOPS ==============
  {
    id: 'github',
    name: 'GitHub',
    icon: '🐙',
    category: 'development',
    phone: null,
    description: "GitHub - kod saqlash, versiya nazorati va hamkorlik platformasi",
    docs_url: 'https://docs.github.com/en/rest',
    signup_url: 'https://github.com/signup',
    merchant_portal: 'https://github.com/settings/apps',
    api_docs: 'https://docs.github.com/en/rest',
    support_url: 'https://support.github.com/',
    fields: [
      { key: 'access_token', label: 'Personal Access Token', placeholder: 'ghp_...', type: 'password', required: true },
      { key: 'repository', label: 'Repository', placeholder: 'username/repo-name', type: 'text', required: false },
      { key: 'webhook_secret', label: 'Webhook Secret', placeholder: 'Webhook tasdiqlash kaliti', type: 'password', required: false },
    ]
  },
  {
    id: 'gitlab',
    name: 'GitLab',
    icon: '🦊',
    category: 'development',
    phone: null,
    description: "GitLab - DevOps platformasi, CI/CD va kod saqlash",
    docs_url: 'https://docs.gitlab.com/ee/api/',
    signup_url: 'https://gitlab.com/users/sign_up',
    merchant_portal: 'https://gitlab.com/dashboard',
    api_docs: 'https://docs.gitlab.com/ee/api/rest/',
    support_url: 'https://about.gitlab.com/support/',
    fields: [
      { key: 'access_token', label: 'Personal Access Token', placeholder: 'glpat-...', type: 'password', required: true },
      { key: 'gitlab_url', label: 'GitLab URL', placeholder: 'https://gitlab.com yoki self-hosted', type: 'text', required: false },
      { key: 'project_id', label: 'Project ID', placeholder: 'GitLab project ID (ixtiyoriy)', type: 'text', required: false },
    ]
  },
  // ============== MIJOZLARNI QO'LLAB-QUVVATLASH ==============
  {
    id: 'zendesk',
    name: 'Zendesk',
    icon: '🎫',
    category: 'support',
    phone: null,
    description: "Zendesk - mijozlarni qo'llab-quvvatlash va help desk platformasi",
    docs_url: 'https://developer.zendesk.com/api-reference/',
    signup_url: 'https://www.zendesk.com/register/',
    merchant_portal: 'https://www.zendesk.com/login/',
    api_docs: 'https://developer.zendesk.com/api-reference/',
    support_url: 'https://support.zendesk.com/',
    fields: [
      { key: 'subdomain', label: 'Subdomain', placeholder: 'yourcompany (yourcompany.zendesk.com)', type: 'text', required: true },
      { key: 'email', label: 'Email', placeholder: 'admin@yourcompany.com', type: 'email', required: true },
      { key: 'api_token', label: 'API Token', placeholder: 'Zendesk API token', type: 'password', required: true },
      { key: 'webhook_secret', label: 'Webhook Secret', placeholder: 'Webhook verification token', type: 'password', required: false },
    ]
  },
  {
    id: 'intercom',
    name: 'Intercom',
    icon: '💬',
    category: 'support',
    phone: null,
    description: "Intercom - mijozlar bilan aloqa, live chat va support platformasi",
    docs_url: 'https://developers.intercom.com/docs/references/rest-api/',
    signup_url: 'https://www.intercom.com/pricing',
    merchant_portal: 'https://app.intercom.com/',
    api_docs: 'https://developers.intercom.com/docs/',
    support_email: 'team@intercom.com',
    fields: [
      { key: 'access_token', label: 'Access Token', placeholder: 'Intercom access token', type: 'password', required: true },
      { key: 'app_id', label: 'App ID', placeholder: 'Intercom app ID', type: 'text', required: false },
      { key: 'identity_verification_secret', label: 'Identity Verification Secret', placeholder: 'Tasdiqlash kaliti', type: 'password', required: false },
    ]
  },
  {
    id: 'freshdesk',
    name: 'Freshdesk',
    icon: '🎧',
    category: 'support',
    phone: null,
    description: "Freshdesk - mijozlarni qo'llab-quvvatlash va ticketing tizimi",
    docs_url: 'https://developers.freshdesk.com/api/',
    signup_url: 'https://freshdesk.com/signup',
    merchant_portal: 'https://freshdesk.com/login',
    api_docs: 'https://developers.freshdesk.com/api/',
    support_email: 'support@freshdesk.com',
    fields: [
      { key: 'domain', label: 'Domain', placeholder: 'yourcompany.freshdesk.com', type: 'text', required: true },
      { key: 'api_key', label: 'API Key', placeholder: 'Freshdesk API key', type: 'password', required: true },
      { key: 'webhook_secret', label: 'Webhook Secret', placeholder: 'Webhook verification secret', type: 'password', required: false },
    ]
  },
  // ============== BUXGALTERIYA ==============
  {
    id: 'quickbooks',
    name: 'QuickBooks',
    icon: '📊',
    category: 'accounting',
    phone: null,
    description: "QuickBooks - buxgalteriya va moliyaviy boshqaruv dasturi",
    docs_url: 'https://developer.intuit.com/app/developer/qbo/docs/api/accounting/most-commonly-used/account',
    signup_url: 'https://quickbooks.intuit.com/signup/',
    merchant_portal: 'https://app.qbo.intuit.com/',
    api_docs: 'https://developer.intuit.com/app/developer/qbo/docs/api/',
    support_url: 'https://help.quickbooks.intuit.com/',
    fields: [
      { key: 'client_id', label: 'Client ID', placeholder: 'QuickBooks OAuth client ID', type: 'text', required: true },
      { key: 'client_secret', label: 'Client Secret', placeholder: 'QuickBooks OAuth client secret', type: 'password', required: true },
      { key: 'company_id', label: 'Company ID (Realm ID)', placeholder: 'QuickBooks company/realm ID', type: 'text', required: false },
      { key: 'refresh_token', label: 'Refresh Token', placeholder: 'OAuth refresh token', type: 'password', required: false },
      { key: 'sandbox_mode', label: 'Sandbox rejimi', placeholder: '', type: 'checkbox', required: false },
    ]
  },
  {
    id: 'xero',
    name: 'Xero',
    icon: '💼',
    category: 'accounting',
    phone: null,
    description: "Xero - bulutli buxgalteriya va moliyaviy boshqaruv platformasi",
    docs_url: 'https://developer.xero.com/documentation/',
    signup_url: 'https://www.xero.com/signup/',
    merchant_portal: 'https://login.xero.com/',
    api_docs: 'https://developer.xero.com/documentation/api/accounting/overview',
    support_email: 'api@xero.com',
    fields: [
      { key: 'client_id', label: 'Client ID', placeholder: 'Xero OAuth 2.0 client ID', type: 'text', required: true },
      { key: 'client_secret', label: 'Client Secret', placeholder: 'Xero OAuth 2.0 client secret', type: 'password', required: true },
      { key: 'tenant_id', label: 'Tenant ID', placeholder: 'Xero organization/tenant ID', type: 'text', required: false },
      { key: 'refresh_token', label: 'Refresh Token', placeholder: 'OAuth refresh token', type: 'password', required: false },
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
  phone?: string
  email?: string
  website?: string
  address?: string
  inn?: string
  company_type?: 'individual' | 'llc' | 'jsc' | 'sole_proprietor' | 'other'
  contact_person?: string
  contact_phone?: string
  logo_url?: string
  notes?: string
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
  government: '🏛️',
  maps: '🗺️',
  social: '📱',
  ecommerce: '🛒',
  erp: '📋',
  storage: '☁️',
  security: '🔒',
  other: '🔧'
}

const CATEGORY_LABELS: Record<string, Record<string, string>> = {
  uz: {
    payment: "To'lov tizimlari", crm: 'CRM', analytics: 'Analitika', communication: 'Aloqa',
    delivery: 'Yetkazib berish', pos: 'POS Terminallar', internet: 'Internet va Telecom',
    utility: 'Kommunal xizmatlar', government: 'Davlat xizmatlari', maps: 'Xaritalar',
    social: 'Ijtimoiy tarmoqlar', ecommerce: 'Elektron tijorat', erp: 'ERP / Buxgalteriya',
    storage: 'Saqlash', security: 'Xavfsizlik', other: 'Boshqa'
  },
  ru: {
    payment: 'Платёжные системы', crm: 'CRM', analytics: 'Аналитика', communication: 'Связь',
    delivery: 'Доставка', pos: 'POS-терминалы', internet: 'Интернет и Телеком',
    utility: 'Коммунальные услуги', government: 'Гос. услуги', maps: 'Карты',
    social: 'Социальные сети', ecommerce: 'Электронная торговля', erp: 'ERP / Бухгалтерия',
    storage: 'Хранение', security: 'Безопасность', other: 'Другое'
  },
  en: {
    payment: 'Payment systems', crm: 'CRM', analytics: 'Analytics', communication: 'Communication',
    delivery: 'Delivery', pos: 'POS Terminals', internet: 'Internet & Telecom',
    utility: 'Utilities', government: 'Government', maps: 'Maps',
    social: 'Social networks', ecommerce: 'E-commerce', erp: 'ERP / Accounting',
    storage: 'Storage', security: 'Security', other: 'Other'
  }
}

const COMPANY_TYPE_LABELS: Record<string, Record<string, string>> = {
  uz: { individual: 'Jismoniy shaxs', llc: 'MChJ (OOO)', jsc: 'AJ (AO)', sole_proprietor: 'YaTT (IP)', other: 'Boshqa' },
  ru: { individual: 'Физ. лицо', llc: 'ООО', jsc: 'АО', sole_proprietor: 'ИП', other: 'Другое' },
  en: { individual: 'Individual', llc: 'LLC', jsc: 'JSC', sole_proprietor: 'Sole proprietor', other: 'Other' }
}

// Barcha UI textlarning 3 tilda tarjimalari
const UI_TEXT: Record<string, Record<string, string>> = {
  uz: {
    // Sarlavha
    pageTitle: 'Integratsiyalar',
    pageSubtitle: 'Tizimni tashqi xizmatlar bilan ulang',
    connected_label: 'Ulangan',
    available_label: 'Mavjud',
    // Tablar
    tab_clients: 'Mijozlar',
    tab_available: 'Mavjud servislar',
    tab_connected: 'Ulanganlar',
    // Tugmalar
    btn_connect: 'Ulash',
    btn_settings: 'Sozlamalar',
    btn_manage: 'Boshqarish',
    btn_cancel: 'Bekor qilish',
    btn_save: 'Saqlash',
    btn_add: "Qo'shish",
    btn_check: 'Tekshirish',
    btn_delete: "O'chirish",
    btn_enable: 'Yoqish',
    btn_disable: "O'chirish",
    btn_view_available: "Mavjud integratsiyalarni ko'rish",
    btn_add_first_client: "Birinchi mijozni qo'shish",
    btn_add_first_integration: "Birinchi integratsiyani qo'shish",
    btn_add_integration: "Integratsiya qo'shish",
    btn_new_client: 'Yangi mijoz',
    btn_view_docs: "Rasmiy hujjatlarni ko'rish",
    // Holatlar
    status_active: 'Faol',
    status_inactive: 'Nofaol',
    status_connected: 'Ulangan',
    status_connecting: 'Ulanmoqda...',
    status_saving: 'Saqlanmoqda...',
    // Bo'sh holatlar
    empty_no_clients: "Hech qanday mijoz yo'q",
    empty_no_clients_desc: "Integratsiya xizmati ko'rsatish uchun avval mijoz qo'shing",
    empty_no_integrations: "Hali integratsiya qo'shilmagan",
    empty_no_integrations_desc: "Bu loyihaga kerakli xizmatlarni ulang",
    empty_no_connected: 'Hech qanday integratsiya ulanmagan',
    empty_no_connected_desc: 'Tashqi xizmatlarni ulash uchun "Mavjud servislar" tabiga o\'ting va kerakli integratsiyani tanlang',
    // Mijoz sahifasi
    clients_description: "Integratsiya xizmati ko'rsatiladigan mijozlar (kompaniyalar/loyihalar)",
    integrations_count: 'integratsiya ulangan',
    no_integrations: "Integratsiya yo'q",
    without_client: 'Mijozsiz',
    integration_word: 'integratsiya',
    for_client: 'mijoziga',
    all_filter: 'Barchasi',
    contact_label: 'Aloqa',
    // Mijoz detail
    client_info: "Mijoz ma'lumotlari",
    type_label: 'Turi',
    inn_label: 'INN/STIR',
    phone_label: 'Telefon',
    email_label: 'Email',
    website_label: 'Veb-sayt',
    address_label: 'Manzil',
    contact_person_label: 'Aloqa shaxsi',
    contact_phone_label: 'Aloqa telefoni',
    connected_integrations: 'Ulangan integratsiyalar',
    enable_label: 'Yoqish',
    // Modal: Integratsiya ulash
    modal_settings: 'sozlamalari',
    modal_connect: 'ni ulash',
    client_label: 'Mijoz',
    select_client: 'Mijoz tanlang...',
    client_hint: 'Bu integratsiya qaysi mijozga ulanadi?',
    // Modal: Yangi mijoz
    modal_edit_client: 'Mijozni tahrirlash',
    modal_new_client: 'Yangi mijoz',
    modal_client_desc: "Integratsiya xizmati ko'rsatiladigan hamkor/mijoz",
    section_company: "Kompaniya ma'lumotlari",
    client_name_uz: "Mijoz nomi (O'zbekcha)",
    client_name_uz_placeholder: 'Masalan: Nonbor, TechCorp',
    client_name_ru: 'Nomi (Ruscha)',
    client_name_ru_placeholder: 'Название',
    client_name_en: 'Nomi (Inglizcha)',
    client_name_en_placeholder: 'Name',
    company_type_label: 'Kompaniya turi',
    select_placeholder: 'Tanlang...',
    inn_stir: 'INN / STIR',
    section_contact: "Aloqa ma'lumotlari",
    section_contact_person: 'Aloqa shaxsi',
    fio_label: 'F.I.O',
    fio_placeholder: 'Ism Familiya',
    phone_number_label: 'Telefon raqami',
    section_additional: "Qo'shimcha",
    description_label: 'Tavsif',
    description_placeholder: "Mijoz haqida qisqacha ma'lumot...",
    logo_url_label: 'Logo URL',
    notes_label: 'Ichki eslatmalar',
    notes_placeholder: "Faqat adminlar uchun ko'rinadigan eslatmalar...",
    // Xatoliklar
    err_name_required: 'Mijoz nomi kiritilishi kerak',
    err_email_invalid: "Email formati noto'g'ri",
    err_inn_digits: "INN faqat raqamlardan iborat bo'lishi kerak",
    err_phone_invalid: "Telefon raqam formati noto'g'ri",
    err_save_client: 'Mijozni saqlashda xatolik!',
    err_has_integrations: "ta integratsiya ulangan. Avval integratsiyalarni o'chiring.",
    err_delete_client: "Mijozni o'chirishda xatolik!",
    err_select_client: 'Mijoz tanlanishi kerak!',
    err_required_fields: "Majburiy maydonlar to'ldirilmagan",
    err_connect_failed: 'Integratsiyani ulashda xatolik yuz berdi',
    err_test_failed: "Ulanishni tekshirishda xatolik",
    // Muvaffaqiyat
    success_updated: 'Integratsiya muvaffaqiyatli yangilandi!',
    success_connected: 'Integratsiya muvaffaqiyatli ulandi!',
    success_test: 'Ulanish muvaffaqiyatli!',
    // Tasdiqlash
    confirm_delete_client: "mijozini o'chirmoqchimisiz?",
    confirm_delete_integration: "integratsiyasini o'chirmoqchimisiz?",
    // Integratsiya qo'shish modal
    modal_add_integration: "Integratsiya qo'shish",
  },
  ru: {
    pageTitle: 'Интеграции',
    pageSubtitle: 'Подключите систему к внешним сервисам',
    connected_label: 'Подключено',
    available_label: 'Доступно',
    tab_clients: 'Клиенты',
    tab_available: 'Доступные сервисы',
    tab_connected: 'Подключённые',
    btn_connect: 'Подключить',
    btn_settings: 'Настройки',
    btn_manage: 'Управление',
    btn_cancel: 'Отмена',
    btn_save: 'Сохранить',
    btn_add: 'Добавить',
    btn_check: 'Проверить',
    btn_delete: 'Удалить',
    btn_enable: 'Включить',
    btn_disable: 'Отключить',
    btn_view_available: 'Посмотреть доступные интеграции',
    btn_add_first_client: 'Добавить первого клиента',
    btn_add_first_integration: 'Добавить первую интеграцию',
    btn_add_integration: 'Добавить интеграцию',
    btn_new_client: 'Новый клиент',
    btn_view_docs: 'Документация',
    status_active: 'Активно',
    status_inactive: 'Неактивно',
    status_connected: 'Подключено',
    status_connecting: 'Подключение...',
    status_saving: 'Сохранение...',
    empty_no_clients: 'Клиентов пока нет',
    empty_no_clients_desc: 'Сначала добавьте клиента для предоставления интеграционных услуг',
    empty_no_integrations: 'Интеграции ещё не добавлены',
    empty_no_integrations_desc: 'Подключите нужные сервисы к этому проекту',
    empty_no_connected: 'Нет подключённых интеграций',
    empty_no_connected_desc: 'Перейдите во вкладку "Доступные сервисы" и выберите нужную интеграцию',
    clients_description: 'Клиенты (компании/проекты), которым предоставляются интеграционные услуги',
    integrations_count: 'интеграций подключено',
    no_integrations: 'Нет интеграций',
    without_client: 'Без клиента',
    integration_word: 'интеграций',
    for_client: 'для клиента',
    all_filter: 'Все',
    contact_label: 'Контакт',
    client_info: 'Данные клиента',
    type_label: 'Тип',
    inn_label: 'ИНН/СТИР',
    phone_label: 'Телефон',
    email_label: 'Email',
    website_label: 'Веб-сайт',
    address_label: 'Адрес',
    contact_person_label: 'Контактное лицо',
    contact_phone_label: 'Телефон контакта',
    connected_integrations: 'Подключённые интеграции',
    enable_label: 'Включить',
    modal_settings: 'настройки',
    modal_connect: 'подключить',
    client_label: 'Клиент',
    select_client: 'Выберите клиента...',
    client_hint: 'К какому клиенту подключается эта интеграция?',
    modal_edit_client: 'Редактировать клиента',
    modal_new_client: 'Новый клиент',
    modal_client_desc: 'Партнёр/клиент, которому предоставляются интеграционные услуги',
    section_company: 'Данные компании',
    client_name_uz: 'Название (Узбекский)',
    client_name_uz_placeholder: 'Например: Nonbor, TechCorp',
    client_name_ru: 'Название (Русский)',
    client_name_ru_placeholder: 'Название',
    client_name_en: 'Название (Английский)',
    client_name_en_placeholder: 'Name',
    company_type_label: 'Тип компании',
    select_placeholder: 'Выберите...',
    inn_stir: 'ИНН / СТИР',
    section_contact: 'Контактные данные',
    section_contact_person: 'Контактное лицо',
    fio_label: 'ФИО',
    fio_placeholder: 'Имя Фамилия',
    phone_number_label: 'Номер телефона',
    section_additional: 'Дополнительно',
    description_label: 'Описание',
    description_placeholder: 'Краткая информация о клиенте...',
    logo_url_label: 'URL логотипа',
    notes_label: 'Внутренние заметки',
    notes_placeholder: 'Заметки, видимые только администраторам...',
    err_name_required: 'Необходимо указать название клиента',
    err_email_invalid: 'Неверный формат email',
    err_inn_digits: 'ИНН должен состоять только из цифр',
    err_phone_invalid: 'Неверный формат номера телефона',
    err_save_client: 'Ошибка при сохранении клиента!',
    err_has_integrations: 'интеграций подключено. Сначала удалите интеграции.',
    err_delete_client: 'Ошибка при удалении клиента!',
    err_select_client: 'Необходимо выбрать клиента!',
    err_required_fields: 'Не заполнены обязательные поля',
    err_connect_failed: 'Ошибка при подключении интеграции',
    err_test_failed: 'Ошибка при проверке подключения',
    success_updated: 'Интеграция успешно обновлена!',
    success_connected: 'Интеграция успешно подключена!',
    success_test: 'Подключение успешно!',
    confirm_delete_client: 'Удалить клиента?',
    confirm_delete_integration: 'Отключить интеграцию?',
    modal_add_integration: 'Добавить интеграцию',
  },
  en: {
    pageTitle: 'Integrations',
    pageSubtitle: 'Connect the system to external services',
    connected_label: 'Connected',
    available_label: 'Available',
    tab_clients: 'Clients',
    tab_available: 'Available services',
    tab_connected: 'Connected',
    btn_connect: 'Connect',
    btn_settings: 'Settings',
    btn_manage: 'Manage',
    btn_cancel: 'Cancel',
    btn_save: 'Save',
    btn_add: 'Add',
    btn_check: 'Test',
    btn_delete: 'Delete',
    btn_enable: 'Enable',
    btn_disable: 'Disable',
    btn_view_available: 'View available integrations',
    btn_add_first_client: 'Add first client',
    btn_add_first_integration: 'Add first integration',
    btn_add_integration: 'Add integration',
    btn_new_client: 'New client',
    btn_view_docs: 'Documentation',
    status_active: 'Active',
    status_inactive: 'Inactive',
    status_connected: 'Connected',
    status_connecting: 'Connecting...',
    status_saving: 'Saving...',
    empty_no_clients: 'No clients yet',
    empty_no_clients_desc: 'Add a client first to provide integration services',
    empty_no_integrations: 'No integrations added yet',
    empty_no_integrations_desc: 'Connect the required services to this project',
    empty_no_connected: 'No connected integrations',
    empty_no_connected_desc: 'Go to the "Available services" tab and select the needed integration',
    clients_description: 'Clients (companies/projects) receiving integration services',
    integrations_count: 'integrations connected',
    no_integrations: 'No integrations',
    without_client: 'No client',
    integration_word: 'integrations',
    for_client: 'for client',
    all_filter: 'All',
    contact_label: 'Contact',
    client_info: 'Client details',
    type_label: 'Type',
    inn_label: 'TIN/INN',
    phone_label: 'Phone',
    email_label: 'Email',
    website_label: 'Website',
    address_label: 'Address',
    contact_person_label: 'Contact person',
    contact_phone_label: 'Contact phone',
    connected_integrations: 'Connected integrations',
    enable_label: 'Enable',
    modal_settings: 'settings',
    modal_connect: 'connect',
    client_label: 'Client',
    select_client: 'Select client...',
    client_hint: 'Which client is this integration for?',
    modal_edit_client: 'Edit client',
    modal_new_client: 'New client',
    modal_client_desc: 'Partner/client receiving integration services',
    section_company: 'Company details',
    client_name_uz: 'Name (Uzbek)',
    client_name_uz_placeholder: 'E.g.: Nonbor, TechCorp',
    client_name_ru: 'Name (Russian)',
    client_name_ru_placeholder: 'Название',
    client_name_en: 'Name (English)',
    client_name_en_placeholder: 'Name',
    company_type_label: 'Company type',
    select_placeholder: 'Select...',
    inn_stir: 'TIN / INN',
    section_contact: 'Contact details',
    section_contact_person: 'Contact person',
    fio_label: 'Full name',
    fio_placeholder: 'First Last name',
    phone_number_label: 'Phone number',
    section_additional: 'Additional',
    description_label: 'Description',
    description_placeholder: 'Brief info about the client...',
    logo_url_label: 'Logo URL',
    notes_label: 'Internal notes',
    notes_placeholder: 'Notes visible only to admins...',
    err_name_required: 'Client name is required',
    err_email_invalid: 'Invalid email format',
    err_inn_digits: 'TIN must contain only digits',
    err_phone_invalid: 'Invalid phone number format',
    err_save_client: 'Error saving client!',
    err_has_integrations: 'integrations connected. Remove integrations first.',
    err_delete_client: 'Error deleting client!',
    err_select_client: 'Please select a client!',
    err_required_fields: 'Required fields are not filled',
    err_connect_failed: 'Error connecting integration',
    err_test_failed: 'Error testing connection',
    success_updated: 'Integration successfully updated!',
    success_connected: 'Integration successfully connected!',
    success_test: 'Connection successful!',
    confirm_delete_client: 'Delete this client?',
    confirm_delete_integration: 'Disconnect this integration?',
    modal_add_integration: 'Add integration',
  }
}

// Integratsiyalar tavsifi - ruscha va inglizcha tarjimalari
const INTEGRATION_TRANSLATIONS: Record<string, { ru: string; en: string }> = {
  // CRM
  amocrm: {
    ru: 'Интеграция с AmoCRM — управление клиентами, воронка продаж и автоматизация',
    en: 'AmoCRM integration — customer management, sales funnel and automation'
  },
  bitrix24: {
    ru: 'Битрикс24 — CRM, задачи, чаты, видеозвонки, автоматизация бизнес-процессов',
    en: 'Bitrix24 — CRM, tasks, chats, video calls, business process automation'
  },
  salesdoktor: {
    ru: 'SalesDoktor — автоматизация B2B продаж, управление дистрибуцией, мобильные агенты, GPS',
    en: 'SalesDoktor — B2B sales automation, distribution management, mobile agents, GPS'
  },
  // Aloqa
  zadarma: {
    ru: 'Zadarma IP-телефония — звонки, IVR-меню, коллтрекинг и CRM-интеграция',
    en: 'Zadarma IP telephony — calls, IVR menu, call tracking and CRM integration'
  },
  telegram: {
    ru: 'Интеграция с Telegram ботом — уведомления, заказы и связь с клиентами',
    en: 'Telegram bot integration — notifications, orders and customer communication'
  },
  sms_eskiz: {
    ru: 'Eskiz SMS — отправка SMS-сообщений и OTP-подтверждений',
    en: 'Eskiz SMS — sending SMS messages and OTP verification'
  },
  playmobile: {
    ru: 'PlayMobile — SMS-рассылка через единый API для бизнеса в Узбекистане',
    en: 'PlayMobile — SMS messaging via unified API for businesses in Uzbekistan'
  },
  opersms: {
    ru: 'OperSMS — массовая рассылка SMS и OTP-коды для Узбекистана',
    en: 'OperSMS — bulk SMS and OTP codes for Uzbekistan'
  },
  jivochat: {
    ru: 'JivoChat — онлайн-чат для сайта, мессенджеры и социальные сети в одном окне',
    en: 'JivoChat — live chat for website, messengers and social networks in one window'
  },
  // To'lov tizimlari
  payme: {
    ru: 'Payme — система онлайн-платежей для приёма оплат',
    en: 'Payme payment system — online payment acceptance'
  },
  click: {
    ru: 'Click — система онлайн-платежей для приёма оплат',
    en: 'Click payment system — online payment acceptance'
  },
  paynet: {
    ru: 'Paynet — платёжная система, более 13 000 терминалов по всему Узбекистану',
    en: 'Paynet — payment system, over 13,000 terminals across Uzbekistan'
  },
  uzcard: {
    ru: 'Uzcard — национальная платёжная система, обработка карточных транзакций',
    en: 'Uzcard — national payment system, card transaction processing'
  },
  humo: {
    ru: 'HUMO — национальная межбанковская платёжная система Узбекистана',
    en: 'HUMO — national interbank payment system of Uzbekistan'
  },
  atmos: {
    ru: 'ATMOS — платёжная платформа на токен-авторизации, мгновенные переводы',
    en: 'ATMOS — token-based payment platform, instant transfers'
  },
  apelsin: {
    ru: 'Apelsin — цифровой банк Kapitalbank, онлайн кредиты и переводы',
    en: 'Apelsin — Kapitalbank digital bank, online loans and transfers'
  },
  alif_nasiya: {
    ru: 'Alif Nasiya — рассрочка (BNPL), 27% доля рынка, интеграция с магазинами',
    en: 'Alif Nasiya — BNPL service, 27% market share, store integration'
  },
  oson: {
    ru: 'OSON — электронные деньги, переводы, оплата услуг, 2.8+ млн пользователей',
    en: 'OSON — e-money, transfers, bill payments, 2.8M+ users'
  },
  upay: {
    ru: 'UPay — платёжная система экосистемы Humans.uz',
    en: 'UPay — payment system of Humans.uz ecosystem'
  },
  uzum_bank: {
    ru: 'Uzum Bank — цифровой банк, merchant API, комиссия от 0%',
    en: 'Uzum Bank — digital bank, merchant API, commission from 0%'
  },
  anorbank: {
    ru: 'Anorbank — цифровой банк, карты, платежи, кредиты, депозиты, международные переводы',
    en: 'Anorbank — digital bank, cards, payments, loans, deposits, international transfers'
  },
  tezbank: {
    ru: 'Tezbank — необанк от Fintech Farm, кэшбэк 10%, бесплатные карты, shake-to-pay (авг 2025)',
    en: 'Tezbank — Fintech Farm neobank, 10% cashback, free cards, shake-to-pay (Aug 2025)'
  },
  tbc_uz: {
    ru: 'TBC Bank UZ (Space International) — 19.7 млн пользователей, Salom Card, Osmon Credit, TBC Business',
    en: 'TBC Bank UZ (Space International) — 19.7M users, Salom Card, Osmon Credit, TBC Business'
  },
  // Analitika
  google_analytics: {
    ru: 'Google Analytics — статистика сайта и поведение пользователей',
    en: 'Google Analytics — website statistics and user behavior'
  },
  yandex_metrica: {
    ru: 'Яндекс Метрика — аналитика сайта, вебвизор, карта кликов',
    en: 'Yandex Metrica — website analytics, session replay, click maps'
  },
  facebook_pixel: {
    ru: 'Facebook Pixel — отслеживание конверсий и ретаргетинг рекламы',
    en: 'Facebook Pixel — conversion tracking and ad retargeting'
  },
  tiktok_pixel: {
    ru: 'TikTok Pixel — отслеживание конверсий и оптимизация рекламы в TikTok',
    en: 'TikTok Pixel — conversion tracking and TikTok ad optimization'
  },
  // Yetkazib berish
  yandex_delivery: {
    ru: 'Яндекс Доставка — быстрая доставка, отслеживание в реальном времени и расчёт стоимости',
    en: 'Yandex Delivery — fast delivery, real-time tracking and price calculation'
  },
  express24: {
    ru: 'Express24 — доставка еды и товаров, 500+ ресторанов и магазинов',
    en: 'Express24 — food and goods delivery, 500+ restaurants and stores'
  },
  uzum_nasiya: {
    ru: 'Uzum Nasiya — рассрочка и кредитование покупок через Uzum',
    en: 'Uzum Nasiya — installment and credit purchases through Uzum'
  },
  wolt: {
    ru: 'Wolt (DoorDash) — доставка еды, продуктов, электроники. Запущен в Узбекистане (окт 2024)',
    en: 'Wolt (DoorDash) — food, grocery, electronics delivery. Launched in Uzbekistan (Oct 2024)'
  },
  glovo: {
    ru: 'Glovo — доставка еды, продуктов, лекарств, посылок и товаров из магазинов',
    en: 'Glovo — food, grocery, pharmacy, packages and store delivery'
  },
  uzum_tezkor: {
    ru: 'Uzum Tezkor — доставка еды и продуктов, 25 городов, 2600+ партнёров, 7000 курьеров',
    en: 'Uzum Tezkor — food & grocery delivery, 25 cities, 2600+ partners, 7000 couriers'
  },
  mytaxi_delivery: {
    ru: 'MyTaxi Delivery — курьерская доставка через MyTaxi, отслеживание в реальном времени',
    en: 'MyTaxi Delivery — courier delivery via MyTaxi, real-time tracking'
  },
  yandex_go: {
    ru: 'Яндекс Go — такси, доставка, грузоперевозки. ~90% доля рынка такси в Узбекистане',
    en: 'Yandex Go — taxi, delivery, cargo. ~90% taxi market share in Uzbekistan'
  },
  korzinka_go: {
    ru: 'Korzinka Go — онлайн-супермаркет, доставка продуктов за 2 часа',
    en: 'Korzinka Go — online supermarket, grocery delivery in 2 hours'
  },
  express24_food: {
    ru: 'Express24 — 700+ ресторанов, 100+ магазинов, интеграция с Яндекс (2025)',
    en: 'Express24 — 700+ restaurants, 100+ stores, merging with Yandex (2025)'
  },
  // Internet va Telecom
  uztelecom: {
    ru: 'Uztelecom — государственный провайдер интернета и телекоммуникаций',
    en: 'Uztelecom — state internet and telecommunications provider'
  },
  beeline_uz: {
    ru: 'Beeline Uzbekistan (VEON) — мобильная связь, 4G/5G, бизнес-тарифы, AI-аналитика',
    en: 'Beeline Uzbekistan (VEON) — mobile, 4G/5G, business plans, AI analytics'
  },
  ucell: {
    ru: 'Ucell — мобильный оператор, интернет, международный роуминг, IoT-решения',
    en: 'Ucell — mobile operator, internet, international roaming, IoT solutions'
  },
  mobiuz: {
    ru: 'Mobiuz — мобильный оператор, 8+ млн абонентов, 5G, сеть модернизирована с ZTE',
    en: 'Mobiuz — mobile operator, 8M+ subscribers, 5G, network modernized with ZTE'
  },
  turon_telecom: {
    ru: 'Turon Telecom — интернет, IP-телефония и хостинг-услуги',
    en: 'Turon Telecom — internet, IP telephony and hosting services'
  },
  comnet: {
    ru: 'Comnet — интернет-провайдер и телекоммуникации для дома и бизнеса',
    en: 'Comnet — internet provider and telecom for home and business'
  },
  tps: {
    ru: 'TPS — интернет-провайдер (с 1999 г.), гибкие тарифы и программа лояльности',
    en: 'TPS — internet provider (since 1999), flexible plans and loyalty program'
  },
  sarkor_telecom: {
    ru: 'Sarkor Telecom — интернет, IP-телефония, видеонаблюдение, цифровое ТВ (22+ лет)',
    en: 'Sarkor Telecom — internet, IP telephony, CCTV, digital TV (22+ years)'
  },
  // POS Terminallar
  iiko: {
    ru: 'iiko — автоматизация ресторанов, управление меню, складом и персоналом',
    en: 'iiko — restaurant automation, menu, inventory and staff management'
  },
  rkeeper: {
    ru: 'r_keeper — POS-система для ресторанов, кафе и фастфуда',
    en: 'r_keeper — POS system for restaurants, cafes and fast food'
  },
  poster: {
    ru: 'Poster POS — облачная система автоматизации ресторанов и кафе',
    en: 'Poster POS — cloud restaurant and cafe automation system'
  },
  mobilkassa: {
    ru: 'MobilKassa — онлайн-касса, работает на любом устройстве (телефон, планшет, ПК). Соответствует ПКМ №943',
    en: 'MobilKassa — online POS, works on any device (phone, tablet, PC). PKM №943 compliant'
  },
  epos: {
    ru: 'E-POS Systems — POS-терминалы для торговли и услуг, фискальные устройства',
    en: 'E-POS Systems — POS terminals for retail and services, fiscal devices'
  },
  zpos: {
    ru: "ZPos — кассовая программа, управление складом и магазином, 1 месяц бесплатно",
    en: "ZPos — POS software, inventory and store management, 1 month free trial"
  },
  multikassa: {
    ru: 'Multikassa — мобильная онлайн-касса (ККМ), зарегистрирована в OFD.uz, фискальные чеки',
    en: 'Multikassa — mobile online POS (KKM), OFD.uz registered, fiscal receipts'
  },
  jowi: {
    ru: "Jowi — система автоматизации ресторанов и кафе (популярна в Узбекистане)",
    en: "Jowi — restaurant and cafe automation system (popular in Uzbekistan)"
  },
  paloma365: {
    ru: 'Paloma365 — система управления торговлей и складом (Центральная Азия)',
    en: 'Paloma365 — trade and inventory management system (Central Asia)'
  },
  smartup: {
    ru: 'SmartUP — ERP/CRM для дистрибуции, производства и розничной торговли в Узбекистане',
    en: 'SmartUP — ERP/CRM for distribution, manufacturing and retail in Uzbekistan'
  },
  billz: {
    ru: 'BILLZ — POS и управление розничной торговлей (4000+ магазинов)',
    en: 'BILLZ — POS and retail management (4000+ stores)'
  },
  billz_saas: {
    ru: 'BILLZ SaaS — retail-платформа: POS, склад, CRM, e-commerce, аналитика. TBC Bank 53%, оценка $20M',
    en: 'BILLZ SaaS — retail platform: POS, inventory, CRM, e-commerce, analytics. TBC Bank 53%, valued $20M'
  },
  quick_resto: {
    ru: 'Quick Resto — облачная система для ресторанного бизнеса',
    en: 'Quick Resto — cloud-based restaurant business system'
  },
  tillypad: {
    ru: 'Tillypad — система автоматизации для ресторанов, клубов и сетевых заведений',
    en: 'Tillypad — automation system for restaurants, clubs and chain venues'
  },
  '1c_roznitsa': {
    ru: '1С:Розница — управление розничным магазином, учёт товаров и касса',
    en: '1C:Retail — retail store management, inventory and POS'
  },
  atol: {
    ru: 'АТОЛ — фискальные кассы и принтеры чеков, интеграция с ОФД',
    en: 'ATOL — fiscal registers and receipt printers, OFD integration'
  },
  lightspeed: {
    ru: 'Lightspeed — POS и система управления торговлей',
    en: 'Lightspeed — POS and retail management system'
  },
  square: {
    ru: "Square — платежи и система управления торговой точкой",
    en: "Square — payments and point-of-sale management system"
  },
  toast: {
    ru: "Toast — управление рестораном и POS-система",
    en: "Toast — restaurant management and POS system"
  },
  soliq_terminal: {
    ru: 'SolIQ Terminal — фискальный терминал ГНК и налоговая интеграция',
    en: 'SolIQ Terminal — tax authority fiscal terminal and tax integration'
  },
  // Kommunal xizmatlar
  hududgaz: {
    ru: "Hududgaz — оплата газовых услуг",
    en: "Hududgaz — gas utility payments"
  },
  elektr_energiya: {
    ru: "Электроэнергия — оплата электрических услуг",
    en: "Electric power — electricity utility payments"
  },
  suvoqova: {
    ru: "Suvoqova — оплата водоснабжения и канализации",
    en: "Suvoqova — water supply and sewage payments"
  },
  // Davlat xizmatlari
  oneid: {
    ru: 'OneID — единая идентификация для гос. электронных услуг Узбекистана',
    en: 'OneID — unified identification for Uzbekistan government e-services'
  },
  myid: {
    ru: 'MyID — биометрическая идентификация через распознавание лица, дистанционная верификация',
    en: 'MyID — biometric identification via face recognition, remote verification'
  },
  factura: {
    ru: 'Factura.uz — электронные счета-фактуры, обязательная система для бизнеса в Узбекистане',
    en: 'Factura.uz — electronic invoicing, mandatory system for businesses in Uzbekistan'
  },
  ofd_uz: {
    ru: 'OFD.uz — оператор фискальных данных, передача чеков в налоговую',
    en: 'OFD.uz — fiscal data operator, transmitting receipts to tax authority'
  },
  my_gov: {
    ru: 'My.gov.uz — единый портал государственных услуг, 760+ онлайн-сервисов, MyID идентификация',
    en: 'My.gov.uz — unified government services portal, 760+ online services, MyID identification'
  },
  // Xaritalar
  yandex_maps: {
    ru: 'Яндекс Карты — геокодирование, поиск объектов, маршруты, пробки',
    en: 'Yandex Maps — geocoding, places search, routes, traffic'
  },
  twogis: {
    ru: '2ГИС — справочник и навигатор, детальные карты городов Узбекистана',
    en: '2GIS — directory and navigator, detailed maps of Uzbekistan cities'
  },
  google_maps: {
    ru: 'Google Maps — карты, маршруты, геокодирование и Places API',
    en: 'Google Maps — maps, routes, geocoding and Places API'
  },
  // Ijtimoiy tarmoqlar
  instagram_business: {
    ru: 'Instagram Business — каталог товаров, статистика, автоответы, Instagram Shopping',
    en: 'Instagram Business — product catalog, insights, auto-replies, Instagram Shopping'
  },
  facebook_business: {
    ru: 'Facebook Business — управление страницей, реклама, каталог товаров, Messenger',
    en: 'Facebook Business — page management, advertising, product catalog, Messenger'
  },
  tiktok_business: {
    ru: 'TikTok Business — рекламный кабинет, аналитика, продвижение бизнеса',
    en: 'TikTok Business — ad manager, analytics, business promotion'
  },
  // E-commerce
  uzum_market: {
    ru: "Uzum Market — крупнейший маркетплейс Узбекистана, 20M+ месячных пользователей",
    en: "Uzum Market — largest marketplace of Uzbekistan, 20M+ monthly users"
  },
  birbir: {
    ru: 'BirBir — P2P e-commerce, 1M+ скачиваний, $10M инвестиций, 0% комиссия, 18 категорий',
    en: 'BirBir — P2P e-commerce, 1M+ downloads, $10M investment, 0% commission, 18 categories'
  },
  alif_shop: {
    ru: 'Alif Shop — BNPL e-commerce, рассрочка через Alif Nasiya, 27% доля рынка',
    en: 'Alif Shop — BNPL e-commerce, installments via Alif Nasiya, 27% market share'
  },
  // ERP
  odoo: {
    ru: 'Odoo — ERP/CRM с открытым кодом, финансы, склад, производство, HR модули',
    en: 'Odoo — open-source ERP/CRM, finance, inventory, manufacturing, HR modules'
  },
  iota_erp: {
    ru: "IOTA — ERP, разработанная в Узбекистане, открытый код, финансы, склад, HR, AI/IoT",
    en: "IOTA — ERP developed in Uzbekistan, open-source, finance, inventory, HR, AI/IoT"
  },
  etcita: {
    ru: 'ETCITA — AI-бухгалтерия, автоматизация налоговых отчётов, интеграция с SoliqOnline (для ККМ)',
    en: 'ETCITA — AI accounting, tax report automation, SoliqOnline integration (for KKMs)'
  },
}

// Til bo'yicha description olish
function getDesc(integration: typeof AVAILABLE_INTEGRATIONS[0], lang: Language): string {
  const trans = INTEGRATION_TRANSLATIONS[integration.id]
  if (lang === 'ru' && trans?.ru) return trans.ru
  if (lang === 'en' && trans?.en) return trans.en
  return integration.description
}

export default function IntegrationsPage({ t, lang }: IntegrationsPageProps) {
  // UI text qisqartmasi
  const u = UI_TEXT[lang] || UI_TEXT.uz
  const categoryLabels = CATEGORY_LABELS[lang] || CATEGORY_LABELS.uz
  const companyTypeLabels = COMPANY_TYPE_LABELS[lang] || COMPANY_TYPE_LABELS.uz
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
    description_en: '',
    phone: '',
    email: '',
    website: '',
    address: '',
    inn: '',
    company_type: '' as string,
    contact_person: '',
    contact_phone: '',
    logo_url: '',
    notes: ''
  })
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  const validateProjectForm = (): boolean => {
    const errors: Record<string, string> = {}
    if (!projectFormData.name_uz.trim()) {
      errors.name_uz = u.err_name_required
    }
    if (projectFormData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(projectFormData.email)) {
      errors.email = u.err_email_invalid
    }
    if (projectFormData.inn && !/^\d+$/.test(projectFormData.inn)) {
      errors.inn = u.err_inn_digits
    }
    if (projectFormData.phone && !/^\+?[\d\s\-()]+$/.test(projectFormData.phone)) {
      errors.phone = u.err_phone_invalid
    }
    if (projectFormData.contact_phone && !/^\+?[\d\s\-()]+$/.test(projectFormData.contact_phone)) {
      errors.contact_phone = u.err_phone_invalid
    }
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

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
    setFormErrors({})
    if (project) {
      setEditingProject(project)
      setProjectFormData({
        name_uz: project.name_uz || '',
        name_ru: project.name_ru || '',
        name_en: project.name_en || '',
        description_uz: project.description_uz || '',
        description_ru: project.description_ru || '',
        description_en: project.description_en || '',
        phone: project.phone || '',
        email: project.email || '',
        website: project.website || '',
        address: project.address || '',
        inn: project.inn || '',
        company_type: project.company_type || '',
        contact_person: project.contact_person || '',
        contact_phone: project.contact_phone || '',
        logo_url: project.logo_url || '',
        notes: project.notes || ''
      })
    } else {
      setEditingProject(null)
      setProjectFormData({
        name_uz: '',
        name_ru: '',
        name_en: '',
        description_uz: '',
        description_ru: '',
        description_en: '',
        phone: '',
        email: '',
        website: '',
        address: '',
        inn: '',
        company_type: '',
        contact_person: '',
        contact_phone: '',
        logo_url: '',
        notes: ''
      })
    }
    setShowProjectModal(true)
  }

  const handleSaveProject = async () => {
    if (!validateProjectForm()) return

    const cleanedData = Object.fromEntries(
      Object.entries(projectFormData).map(([key, value]) => [
        key,
        typeof value === 'string' && value.trim() === '' ? null : value
      ])
    )

    try {
      setConnecting(true)
      if (editingProject?.id) {
        await api.put(`/integrations/projects/${editingProject.id}`, cleanedData)
      } else {
        await api.post('/integrations/projects', cleanedData)
      }
      setShowProjectModal(false)
      setFormErrors({})
      loadProjects()
    } catch (err) {
      console.error('Error saving integration project:', err)
      alert(u.err_save_client)
    } finally {
      setConnecting(false)
    }
  }

  const handleDeleteProject = async (project: IntegrationProject) => {
    // Tekshirish - ushbu mijozga ulangan integratsiyalar bormi
    const projectIntegrations = connectedIntegrations.filter(c => c.integration_project_id === project.id)
    if (projectIntegrations.length > 0) {
      alert(`Bu mijozga ${projectIntegrations.length} ${u.err_has_integrations}`)
      return
    }

    if (!confirm(`"${project.name_uz}" - ${u.confirm_delete_client}`)) return

    try {
      await api.delete(`/integrations/projects/${project.id}`)
      loadProjects()
    } catch (err: any) {
      console.error('Error deleting integration project:', err)
      alert(err.response?.data?.detail || u.err_delete_client)
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
      setTestResult({ success: false, message: u.err_select_client })
      return
    }

    // Validate required fields
    const missingFields = selectedIntegration.fields
      .filter(f => f.required && !formData[f.key])
      .map(f => f.label)

    if (missingFields.length > 0) {
      setTestResult({ success: false, message: `${u.err_required_fields}: ${missingFields.join(', ')}` })
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
        setTestResult({ success: true, message: u.success_updated })
      } else {
        await api.post('/integrations/connected', payload)
        setTestResult({ success: true, message: u.success_connected })
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
        message: err.response?.data?.detail || u.err_connect_failed
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
      setTestResult({ success: false, message: `${u.err_required_fields}: ${missingFields.join(', ')}` })
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
        message: response.data.message || u.success_test
      })
    } catch (err: any) {
      setTestResult({
        success: false,
        message: err.response?.data?.detail || u.err_test_failed
      })
    } finally {
      setConnecting(false)
    }
  }

  const handleDisconnect = async (config: IntegrationConfig) => {
    if (!confirm(`"${config.name}" - ${u.confirm_delete_integration}`)) return

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
          <p className="text-sm text-gray-500">{u.pageSubtitle}</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            {u.connected_label}: {connectedIntegrations.filter(c => c.is_active).length}
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 bg-gray-300 rounded-full"></span>
            {u.available_label}: {AVAILABLE_INTEGRATIONS.length}
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
          🏢 {u.tab_clients}
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
          📦 {u.tab_available}
        </button>
        <button
          onClick={() => setActiveTab('connected')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
            activeTab === 'connected'
              ? 'bg-green-500 text-white shadow-sm'
              : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
        >
          ✓ {u.tab_connected}
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
              {u.clients_description}
            </p>
            <button
              onClick={() => openProjectModal()}
              className="px-4 py-2 bg-[#0a2d5c] hover:bg-[#0a2d5c]/90 text-white rounded-lg text-sm font-medium flex items-center gap-2"
            >
              {Icons.plus} {u.btn_new_client}
            </button>
          </div>

          {/* Mijozlar ro'yxati */}
          {projects.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-3xl">
                🏢
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {u.empty_no_clients}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                {u.empty_no_clients_desc}
              </p>
              <button
                onClick={() => openProjectModal()}
                className="px-4 py-2 bg-[#0a2d5c] hover:bg-[#0a2d5c]/90 text-white rounded-lg text-sm font-medium"
              >
                {u.btn_add_first_client}
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

                      {/* Biznes ma'lumotlari */}
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        {project.company_type && (
                          <span className="px-2 py-0.5 bg-[#00a6a6]/10 text-[#00a6a6] dark:text-[#33cccc] rounded-md text-xs font-medium">
                            {companyTypeLabels[project.company_type] || project.company_type}
                          </span>
                        )}
                        {project.phone && (
                          <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-md text-xs flex items-center gap-1">
                            📞 {project.phone}
                          </span>
                        )}
                        {project.email && (
                          <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-md text-xs flex items-center gap-1 truncate max-w-[180px]">
                            📧 {project.email}
                          </span>
                        )}
                      </div>

                      {/* Statistika */}
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`px-2 py-1 rounded-lg text-xs font-medium ${
                          integrationsCount > 0
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-500'
                        }`}>
                          {integrationsCount > 0 ? `${integrationsCount} ${u.integrations_count}` : u.no_integrations}
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
                        {u.btn_manage}
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
                  {getProjectIntegrationsCount(selectedProject.id)} {u.integrations_count}
                </p>
              </div>
            </div>
            <div className="ml-auto flex gap-2">
              <button
                onClick={() => openProjectModal(selectedProject)}
                className="px-3 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium flex items-center gap-2"
              >
                {Icons.settings} {u.btn_settings}
              </button>
            </div>
          </div>

          {/* Mijoz ma'lumotlari */}
          {(selectedProject.phone || selectedProject.email || selectedProject.website || selectedProject.inn || selectedProject.contact_person || selectedProject.address) && (
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2 text-sm">
                📋 {u.client_info}
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                {selectedProject.company_type && (
                  <div>
                    <span className="text-gray-500 dark:text-gray-400 text-xs">{u.type_label}</span>
                    <p className="font-medium text-gray-900 dark:text-white">{companyTypeLabels[selectedProject.company_type] || selectedProject.company_type}</p>
                  </div>
                )}
                {selectedProject.inn && (
                  <div>
                    <span className="text-gray-500 dark:text-gray-400 text-xs">{u.inn_label}</span>
                    <p className="font-medium text-gray-900 dark:text-white">{selectedProject.inn}</p>
                  </div>
                )}
                {selectedProject.phone && (
                  <div>
                    <span className="text-gray-500 dark:text-gray-400 text-xs">{u.phone_label}</span>
                    <p className="font-medium text-gray-900 dark:text-white">{selectedProject.phone}</p>
                  </div>
                )}
                {selectedProject.email && (
                  <div>
                    <span className="text-gray-500 dark:text-gray-400 text-xs">{u.email_label}</span>
                    <p className="font-medium text-gray-900 dark:text-white">{selectedProject.email}</p>
                  </div>
                )}
                {selectedProject.website && (
                  <div>
                    <span className="text-gray-500 dark:text-gray-400 text-xs">{u.website_label}</span>
                    <a href={selectedProject.website} target="_blank" rel="noopener noreferrer" className="font-medium text-[#00a6a6] hover:underline block truncate">
                      {selectedProject.website}
                    </a>
                  </div>
                )}
                {selectedProject.address && (
                  <div className="col-span-2">
                    <span className="text-gray-500 dark:text-gray-400 text-xs">{u.address_label}</span>
                    <p className="font-medium text-gray-900 dark:text-white">{selectedProject.address}</p>
                  </div>
                )}
                {selectedProject.contact_person && (
                  <div>
                    <span className="text-gray-500 dark:text-gray-400 text-xs">{u.contact_person_label}</span>
                    <p className="font-medium text-gray-900 dark:text-white">{selectedProject.contact_person}</p>
                  </div>
                )}
                {selectedProject.contact_phone && (
                  <div>
                    <span className="text-gray-500 dark:text-gray-400 text-xs">{u.contact_phone_label}</span>
                    <p className="font-medium text-gray-900 dark:text-white">{selectedProject.contact_phone}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Ulangan integratsiyalar */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                🔗 {u.connected_integrations}
              </h3>
              <button
                onClick={() => {
                  setSelectedProjectId(selectedProject.id)
                  setShowAddIntegrationModal(true)
                }}
                className="px-3 py-1.5 bg-[#00a6a6] hover:bg-[#008f8f] text-white rounded-lg text-sm font-medium flex items-center gap-1"
              >
                {Icons.plus} {u.btn_add_integration}
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
                      {u.empty_no_integrations}
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                      {u.empty_no_integrations_desc}
                    </p>
                    <button
                      onClick={() => {
                        setSelectedProjectId(selectedProject.id)
                        setShowAddIntegrationModal(true)
                      }}
                      className="px-4 py-2 bg-[#00a6a6] hover:bg-[#008f8f] text-white rounded-lg text-sm font-medium"
                    >
                      {u.btn_add_first_integration}
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
                                {conn.is_active ? u.status_active : u.status_inactive}
                              </span>
                            </div>
                            <div className="flex gap-1">
                              <button
                                onClick={() => {
                                  if (info) openConnectModal(info, conn)
                                }}
                                className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg text-gray-500"
                                title={u.btn_settings}
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
                                title={conn.is_active ? u.btn_disable : u.btn_enable}
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
                                title={u.btn_delete}
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
                  {u.modal_add_integration}
                </h3>
                <p className="text-sm text-gray-500">
                  {projects.find(p => p.id === selectedProjectId)?.name_uz} {u.for_client}
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
                  {u.all_filter}
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
                                  ✓ {u.status_connected}
                                </span>
                              )}
                            </div>
                            <span className="text-xs text-gray-500 truncate block">
                              {getDesc(integration, lang).slice(0, 50)}...
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
            {u.all_filter} ({AVAILABLE_INTEGRATIONS.length})
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
                {u.empty_no_connected}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                {u.empty_no_connected_desc}
              </p>
              <button
                onClick={() => setActiveTab('available')}
                className="px-4 py-2 bg-[#00a6a6] hover:bg-[#008f8f] text-white rounded-lg text-sm font-medium"
              >
                {u.btn_view_available}
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Mijozlar bo'yicha guruhlash */}
              {(() => {
                // Mijozlar bo'yicha guruhlash
                const grouped = connectedIntegrations.reduce((acc, conn) => {
                  const projectName = conn.integration_project?.name_uz || u.without_client
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
                          {group.integrations.length} {u.integration_word}
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
                                  title={u.btn_settings}
                                >
                                  {Icons.settings}
                                </button>
                                <button
                                  onClick={() => handleDisconnect(conn)}
                                  className="p-1.5 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg text-red-500"
                                  title={u.btn_delete}
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
                        <span className="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full" title={u.status_connected}></span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      {categoryIcons[integration.category]} {categoryLabels[integration.category]}
                    </p>
                  </div>
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
                  {getDesc(integration, lang)}
                </p>

                {isConnected && connectedConfig && (
                  <div className="mb-3 p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-green-700 dark:text-green-400 font-medium">
                        {connectedConfig.is_active ? `✓ ${u.status_active}` : `○ ${u.status_inactive}`}
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

                {/* Ma'lumotlar paneli */}
                <div className="mb-3 space-y-1.5">
                  {integration.phone && (
                    <a
                      href={`tel:${integration.phone.replace(/\s/g, '')}`}
                      className="text-sm text-gray-600 dark:text-gray-400 hover:text-[#00a6a6] dark:hover:text-[#33cccc] flex items-center gap-2 transition-colors"
                    >
                      <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      {integration.phone}
                    </a>
                  )}

                  {(integration as any).signup_url && (
                    <a
                      href={(integration as any).signup_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-gray-600 dark:text-gray-400 hover:text-[#00a6a6] dark:hover:text-[#33cccc] flex items-center gap-2 transition-colors"
                      title="Ro'yxatdan o'tish"
                    >
                      <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                      </svg>
                      <span className="truncate">📝 {(integration as any).signup_url.replace(/^https?:\/\//, '').replace(/\/$/, '')}</span>
                    </a>
                  )}

                  {(integration as any).merchant_portal && (
                    <a
                      href={(integration as any).merchant_portal}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-gray-600 dark:text-gray-400 hover:text-[#00a6a6] dark:hover:text-[#33cccc] flex items-center gap-2 transition-colors"
                      title="Merchant Portal / Kabinet"
                    >
                      <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      <span className="truncate">🏢 {(integration as any).merchant_portal.replace(/^https?:\/\//, '').replace(/\/$/, '')}</span>
                    </a>
                  )}

                  {(integration as any).api_docs && (integration as any).api_docs !== integration.docs_url && (
                    <a
                      href={(integration as any).api_docs}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-gray-600 dark:text-gray-400 hover:text-[#00a6a6] dark:hover:text-[#33cccc] flex items-center gap-2 transition-colors"
                      title="API Dokumentatsiya"
                    >
                      <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                      </svg>
                      <span className="truncate">📚 {(integration as any).api_docs.replace(/^https?:\/\//, '').replace(/\/$/, '')}</span>
                    </a>
                  )}

                  <a
                    href={integration.docs_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-[#00a6a6] dark:hover:text-[#33cccc] flex items-center gap-2 transition-colors"
                    title="Dokumentatsiya"
                  >
                    <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                    <span className="truncate">{integration.docs_url.replace(/^https?:\/\//, '').replace(/\/$/, '')}</span>
                  </a>

                  {(integration as any).support_email && (
                    <a
                      href={`mailto:${(integration as any).support_email}`}
                      className="text-sm text-gray-600 dark:text-gray-400 hover:text-[#00a6a6] dark:hover:text-[#33cccc] flex items-center gap-2 transition-colors"
                      title="Support Email"
                    >
                      <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span className="truncate">📧 {(integration as any).support_email}</span>
                    </a>
                  )}

                  {(integration as any).support_url && !(integration as any).support_email && (
                    <a
                      href={(integration as any).support_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-gray-600 dark:text-gray-400 hover:text-[#00a6a6] dark:hover:text-[#33cccc] flex items-center gap-2 transition-colors"
                      title="Support"
                    >
                      <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                      <span className="truncate">🎧 {(integration as any).support_url.replace(/^https?:\/\//, '').replace(/\/$/, '')}</span>
                    </a>
                  )}

                  {(integration as any).tutorial_url && (
                    <a
                      href={(integration as any).tutorial_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-gray-600 dark:text-gray-400 hover:text-[#00a6a6] dark:hover:text-[#33cccc] flex items-center gap-2 transition-colors"
                      title="Tutorial"
                    >
                      <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                      <span className="truncate">📖 {(integration as any).tutorial_url.replace(/^https?:\/\//, '').replace(/\/$/, '')}</span>
                    </a>
                  )}
                </div>

                {/* Majburiy maydonlar */}
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {integration.fields.filter((f: any) => f.required).slice(0, 3).map((field: any) => (
                    <span key={field.key} className="text-[10px] px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded">
                      {field.label}
                    </span>
                  ))}
                  {integration.fields.filter((f: any) => f.required).length > 3 && (
                    <span className="text-[10px] px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded">
                      +{integration.fields.filter((f: any) => f.required).length - 3}
                    </span>
                  )}
                </div>
              </div>

              <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700/50 flex gap-2">
                {isConnected ? (
                  <>
                    <button
                      onClick={() => openConnectModal(integration, connectedConfig)}
                      className="flex-1 px-3 py-2 bg-[#00a6a6] hover:bg-[#008f8f] text-white rounded-lg text-sm font-medium flex items-center justify-center gap-1"
                    >
                      {Icons.settings} {u.btn_settings}
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
                    {Icons.plus} {u.btn_connect}
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
                  {editingConfig ? `${selectedIntegration.name} ${u.modal_settings}` : `${selectedIntegration.name} ${u.modal_connect}`}
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
                  {u.client_label} <span className="text-red-500">*</span>
                </label>
                <select
                  value={selectedProjectId || ''}
                  onChange={(e) => setSelectedProjectId(e.target.value ? Number(e.target.value) : null)}
                  className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-[#00a6a6] outline-none"
                >
                  <option value="">{u.select_client}</option>
                  {projects.map(project => (
                    <option key={project.id} value={project.id}>
                      {project.name_uz}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">{u.client_hint}</p>
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
                      <span className="text-sm text-gray-600 dark:text-gray-400">{u.enable_label}</span>
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

              {/* Phone & Docs Link */}
              <div className="pt-2 flex flex-col gap-1">
                {selectedIntegration.phone && (
                  <a
                    href={`tel:${selectedIntegration.phone.replace(/\s/g, '')}`}
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-[#00a6a6] dark:hover:text-[#33cccc] flex items-center gap-1.5 transition-colors"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    {u.contact_label}: {selectedIntegration.phone}
                  </a>
                )}
                <a
                  href={selectedIntegration.docs_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-[#00a6a6] hover:underline flex items-center gap-1"
                >
                  {Icons.globe} {u.btn_view_docs} →
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
                {u.btn_check}
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-xl text-sm font-medium"
              >
                {u.btn_cancel}
              </button>
              <button
                onClick={handleConnect}
                disabled={connecting}
                className="flex-1 px-4 py-2.5 bg-[#00a6a6] hover:bg-[#008f8f] disabled:opacity-50 text-white rounded-xl text-sm font-medium flex items-center justify-center gap-2"
              >
                {connecting ? (
                  <>
                    <span className="animate-spin">⟳</span>
                    {u.status_connecting}
                  </>
                ) : (
                  <>
                    {Icons.check}
                    {editingConfig ? u.btn_save : u.btn_connect}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mijoz Modal */}
      {showProjectModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => { setShowProjectModal(false); setFormErrors({}) }}>
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0a2d5c] to-[#00a6a6] flex items-center justify-center text-white text-lg">
                🏢
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {editingProject ? u.modal_edit_client : u.modal_new_client}
                </h3>
                <p className="text-xs text-gray-500">{u.modal_client_desc}</p>
              </div>
              <button onClick={() => { setShowProjectModal(false); setFormErrors({}) }} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-500">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body - scrollable */}
            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">

              {/* SECTION 1: Kompaniya ma'lumotlari */}
              <div>
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 border-l-4 border-[#00a6a6] pl-3">
                  {u.section_company}
                </h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {u.client_name_uz} <span className="text-red-500">*</span>
                    </label>
                    <input type="text" value={projectFormData.name_uz}
                      onChange={(e) => setProjectFormData({ ...projectFormData, name_uz: e.target.value })}
                      placeholder={u.client_name_uz_placeholder}
                      className={`w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-[#00a6a6] outline-none ${formErrors.name_uz ? 'ring-2 ring-red-500' : ''}`}
                    />
                    {formErrors.name_uz && <p className="text-xs text-red-500 mt-1">{formErrors.name_uz}</p>}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{u.client_name_ru}</label>
                      <input type="text" value={projectFormData.name_ru}
                        onChange={(e) => setProjectFormData({ ...projectFormData, name_ru: e.target.value })}
                        placeholder={u.client_name_ru_placeholder}
                        className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-[#00a6a6] outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{u.client_name_en}</label>
                      <input type="text" value={projectFormData.name_en}
                        onChange={(e) => setProjectFormData({ ...projectFormData, name_en: e.target.value })}
                        placeholder={u.client_name_en_placeholder}
                        className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-[#00a6a6] outline-none"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{u.company_type_label}</label>
                      <select value={projectFormData.company_type}
                        onChange={(e) => setProjectFormData({ ...projectFormData, company_type: e.target.value })}
                        className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-[#00a6a6] outline-none"
                      >
                        <option value="">{u.select_placeholder}</option>
                        {Object.entries(companyTypeLabels).map(([value, label]) => (
                          <option key={value} value={value}>{label}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{u.inn_stir}</label>
                      <input type="text" value={projectFormData.inn}
                        onChange={(e) => setProjectFormData({ ...projectFormData, inn: e.target.value.replace(/\D/g, '') })}
                        placeholder="123456789"
                        className={`w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-[#00a6a6] outline-none ${formErrors.inn ? 'ring-2 ring-red-500' : ''}`}
                      />
                      {formErrors.inn && <p className="text-xs text-red-500 mt-1">{formErrors.inn}</p>}
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 2: Aloqa ma'lumotlari */}
              <div>
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 border-l-4 border-[#00a6a6] pl-3">
                  {u.section_contact}
                </h4>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{u.phone_label}</label>
                      <input type="tel" value={projectFormData.phone}
                        onChange={(e) => setProjectFormData({ ...projectFormData, phone: e.target.value })}
                        placeholder="+998 90 123 45 67"
                        className={`w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-[#00a6a6] outline-none ${formErrors.phone ? 'ring-2 ring-red-500' : ''}`}
                      />
                      {formErrors.phone && <p className="text-xs text-red-500 mt-1">{formErrors.phone}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{u.email_label}</label>
                      <input type="email" value={projectFormData.email}
                        onChange={(e) => setProjectFormData({ ...projectFormData, email: e.target.value })}
                        placeholder="info@company.uz"
                        className={`w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-[#00a6a6] outline-none ${formErrors.email ? 'ring-2 ring-red-500' : ''}`}
                      />
                      {formErrors.email && <p className="text-xs text-red-500 mt-1">{formErrors.email}</p>}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{u.website_label}</label>
                    <input type="url" value={projectFormData.website}
                      onChange={(e) => setProjectFormData({ ...projectFormData, website: e.target.value })}
                      placeholder="https://company.uz"
                      className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-[#00a6a6] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{u.address_label}</label>
                    <input type="text" value={projectFormData.address}
                      onChange={(e) => setProjectFormData({ ...projectFormData, address: e.target.value })}
                      placeholder="Toshkent sh., Chilonzor t., ..."
                      className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-[#00a6a6] outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 3: Aloqa shaxsi */}
              <div>
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 border-l-4 border-[#00a6a6] pl-3">
                  {u.section_contact_person}
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{u.fio_label}</label>
                    <input type="text" value={projectFormData.contact_person}
                      onChange={(e) => setProjectFormData({ ...projectFormData, contact_person: e.target.value })}
                      placeholder={u.fio_placeholder}
                      className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-[#00a6a6] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{u.phone_number_label}</label>
                    <input type="tel" value={projectFormData.contact_phone}
                      onChange={(e) => setProjectFormData({ ...projectFormData, contact_phone: e.target.value })}
                      placeholder="+998 90 123 45 67"
                      className={`w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-[#00a6a6] outline-none ${formErrors.contact_phone ? 'ring-2 ring-red-500' : ''}`}
                    />
                    {formErrors.contact_phone && <p className="text-xs text-red-500 mt-1">{formErrors.contact_phone}</p>}
                  </div>
                </div>
              </div>

              {/* SECTION 4: Qo'shimcha */}
              <div>
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 border-l-4 border-[#00a6a6] pl-3">
                  {u.section_additional}
                </h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{u.description_label}</label>
                    <textarea value={projectFormData.description_uz}
                      onChange={(e) => setProjectFormData({ ...projectFormData, description_uz: e.target.value })}
                      placeholder={u.description_placeholder}
                      rows={2}
                      className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-[#00a6a6] outline-none resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{u.logo_url_label}</label>
                    <input type="url" value={projectFormData.logo_url}
                      onChange={(e) => setProjectFormData({ ...projectFormData, logo_url: e.target.value })}
                      placeholder="https://company.uz/logo.png"
                      className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-[#00a6a6] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{u.notes_label}</label>
                    <textarea value={projectFormData.notes}
                      onChange={(e) => setProjectFormData({ ...projectFormData, notes: e.target.value })}
                      placeholder={u.notes_placeholder}
                      rows={3}
                      className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-[#00a6a6] outline-none resize-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex gap-3">
              <button
                onClick={() => { setShowProjectModal(false); setFormErrors({}) }}
                className="px-4 py-2.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-xl text-sm font-medium"
              >
                {u.btn_cancel}
              </button>
              <button
                onClick={handleSaveProject}
                disabled={connecting || !projectFormData.name_uz.trim()}
                className="flex-1 px-4 py-2.5 bg-[#0a2d5c] hover:bg-[#0a2d5c]/90 disabled:opacity-50 text-white rounded-xl text-sm font-medium flex items-center justify-center gap-2"
              >
                {connecting ? (
                  <>
                    <span className="animate-spin">⟳</span>
                    {u.status_saving}
                  </>
                ) : (
                  <>
                    {Icons.check}
                    {editingProject ? u.btn_save : u.btn_add}
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
