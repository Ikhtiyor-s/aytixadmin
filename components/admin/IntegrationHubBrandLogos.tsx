'use client'

import React from 'react'

interface BrandLogoProps {
  className?: string
  size?: number
}

// ==================== TO'LOV TIZIMLARI ====================

export const PaymeLogo = ({ size = 40 }: BrandLogoProps) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
    <rect width="40" height="40" rx="10" fill="#33CCCC" />
    <text x="20" y="25" textAnchor="middle" fill="white" fontSize="11" fontWeight="700" fontFamily="Arial">payme</text>
  </svg>
)

export const ClickLogo = ({ size = 40 }: BrandLogoProps) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
    <circle cx="20" cy="20" r="18" fill="#E31E25" />
    <text x="20" y="24" textAnchor="middle" fill="white" fontSize="9" fontWeight="700" fontFamily="Arial">CLICK</text>
  </svg>
)

export const UzumBankLogo = ({ size = 40 }: BrandLogoProps) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
    <rect width="40" height="40" rx="10" fill="#7B2FF2" />
    <text x="20" y="18" textAnchor="middle" fill="white" fontSize="7" fontWeight="600" fontFamily="Arial">uzum</text>
    <text x="20" y="28" textAnchor="middle" fill="white" fontSize="8" fontWeight="700" fontFamily="Arial">bank</text>
  </svg>
)

export const VisaLogo = ({ size = 40 }: BrandLogoProps) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
    <rect width="40" height="40" rx="10" fill="#1A1F71" />
    <text x="20" y="25" textAnchor="middle" fill="white" fontSize="12" fontWeight="700" fontFamily="Arial" fontStyle="italic">VISA</text>
  </svg>
)

export const MastercardLogo = ({ size = 40 }: BrandLogoProps) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
    <rect width="40" height="40" rx="10" fill="#f5f5f5" />
    <circle cx="16" cy="20" r="9" fill="#EB001B" />
    <circle cx="24" cy="20" r="9" fill="#F79E1B" />
    <path d="M20 13.5a9 9 0 0 1 0 13" fill="#FF5F00" />
  </svg>
)

export const HumoLogo = ({ size = 40 }: BrandLogoProps) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
    <rect width="40" height="40" rx="10" fill="#00875A" />
    <text x="20" y="25" textAnchor="middle" fill="white" fontSize="10" fontWeight="700" fontFamily="Arial">HUMO</text>
  </svg>
)

// ==================== YETKAZIB BERISH ====================

export const YandexDeliveryLogo = ({ size = 40 }: BrandLogoProps) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
    <rect width="40" height="40" rx="10" fill="#FFCC00" />
    <text x="20" y="24" textAnchor="middle" fill="#333" fontSize="8" fontWeight="700" fontFamily="Arial">Yandex</text>
  </svg>
)

export const Express24Logo = ({ size = 40 }: BrandLogoProps) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
    <rect width="40" height="40" rx="10" fill="#FF3B30" />
    <text x="20" y="19" textAnchor="middle" fill="white" fontSize="7" fontWeight="600" fontFamily="Arial">express</text>
    <text x="20" y="29" textAnchor="middle" fill="white" fontSize="10" fontWeight="700" fontFamily="Arial">24</text>
  </svg>
)

export const WoltLogo = ({ size = 40 }: BrandLogoProps) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
    <rect width="40" height="40" rx="10" fill="#009DE0" />
    <text x="20" y="25" textAnchor="middle" fill="white" fontSize="10" fontWeight="700" fontFamily="Arial">Wolt</text>
  </svg>
)

export const GlovoLogo = ({ size = 40 }: BrandLogoProps) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
    <rect width="40" height="40" rx="10" fill="#FFC244" />
    <text x="20" y="25" textAnchor="middle" fill="#333" fontSize="9" fontWeight="700" fontFamily="Arial">Glovo</text>
  </svg>
)

export const UzumTezkorLogo = ({ size = 40 }: BrandLogoProps) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
    <rect width="40" height="40" rx="10" fill="#7B2FF2" />
    <text x="20" y="18" textAnchor="middle" fill="white" fontSize="7" fontWeight="600" fontFamily="Arial">uzum</text>
    <text x="20" y="28" textAnchor="middle" fill="#FFD700" fontSize="7" fontWeight="700" fontFamily="Arial">tezkor</text>
  </svg>
)

// ==================== POS TERMINALLARI ====================

export const IikoLogo = ({ size = 40 }: BrandLogoProps) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
    <rect width="40" height="40" rx="10" fill="#E74C3C" />
    <text x="20" y="25" textAnchor="middle" fill="white" fontSize="11" fontWeight="700" fontFamily="Arial">iiko</text>
  </svg>
)

export const RKeeperLogo = ({ size = 40 }: BrandLogoProps) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
    <rect width="40" height="40" rx="10" fill="#1B4F72" />
    <text x="20" y="18" textAnchor="middle" fill="white" fontSize="7" fontWeight="500" fontFamily="Arial">r</text>
    <text x="20" y="28" textAnchor="middle" fill="white" fontSize="7" fontWeight="700" fontFamily="Arial">keeper</text>
  </svg>
)

export const PosterLogo = ({ size = 40 }: BrandLogoProps) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
    <rect width="40" height="40" rx="10" fill="#4CAF50" />
    <text x="20" y="25" textAnchor="middle" fill="white" fontSize="9" fontWeight="700" fontFamily="Arial">Poster</text>
  </svg>
)

export const JowiLogo = ({ size = 40 }: BrandLogoProps) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
    <rect width="40" height="40" rx="10" fill="#FF9800" />
    <text x="20" y="25" textAnchor="middle" fill="white" fontSize="10" fontWeight="700" fontFamily="Arial">Jowi</text>
  </svg>
)

export const Paloma365Logo = ({ size = 40 }: BrandLogoProps) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
    <rect width="40" height="40" rx="10" fill="#2196F3" />
    <text x="20" y="19" textAnchor="middle" fill="white" fontSize="7" fontWeight="600" fontFamily="Arial">Paloma</text>
    <text x="20" y="29" textAnchor="middle" fill="white" fontSize="8" fontWeight="700" fontFamily="Arial">365</text>
  </svg>
)

// ==================== CRM & ANALITIKA ====================

export const AmoCRMLogo = ({ size = 40 }: BrandLogoProps) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
    <rect width="40" height="40" rx="10" fill="#339DC9" />
    <text x="20" y="19" textAnchor="middle" fill="white" fontSize="7" fontWeight="600" fontFamily="Arial">amo</text>
    <text x="20" y="29" textAnchor="middle" fill="white" fontSize="8" fontWeight="700" fontFamily="Arial">CRM</text>
  </svg>
)

export const Bitrix24Logo = ({ size = 40 }: BrandLogoProps) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
    <rect width="40" height="40" rx="10" fill="#2FC6F6" />
    <text x="20" y="19" textAnchor="middle" fill="white" fontSize="7" fontWeight="600" fontFamily="Arial">Bitrix</text>
    <text x="20" y="29" textAnchor="middle" fill="white" fontSize="9" fontWeight="700" fontFamily="Arial">24</text>
  </svg>
)

export const GoogleAnalyticsLogo = ({ size = 40 }: BrandLogoProps) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
    <rect width="40" height="40" rx="10" fill="#F9AB00" />
    <rect x="10" y="22" width="6" height="10" rx="2" fill="white" />
    <rect x="17" y="16" width="6" height="16" rx="2" fill="white" />
    <rect x="24" y="10" width="6" height="22" rx="2" fill="white" />
  </svg>
)

// ==================== ALOQA KANALLARI ====================

export const TelegramLogo = ({ size = 40 }: BrandLogoProps) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
    <rect width="40" height="40" rx="10" fill="#0088CC" />
    <path d="M10 20l3 9 4-4 7 5 8-18-22 8z" fill="white" />
  </svg>
)

export const EskizSMSLogo = ({ size = 40 }: BrandLogoProps) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
    <rect width="40" height="40" rx="10" fill="#E53935" />
    <text x="20" y="19" textAnchor="middle" fill="white" fontSize="7" fontWeight="600" fontFamily="Arial">Eskiz</text>
    <text x="20" y="29" textAnchor="middle" fill="white" fontSize="8" fontWeight="700" fontFamily="Arial">SMS</text>
  </svg>
)

export const ZadarmaLogo = ({ size = 40 }: BrandLogoProps) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
    <rect width="40" height="40" rx="10" fill="#4CAF50" />
    <text x="20" y="18" textAnchor="middle" fill="white" fontSize="6" fontWeight="600" fontFamily="Arial">Zadar</text>
    <text x="20" y="28" textAnchor="middle" fill="white" fontSize="7" fontWeight="700" fontFamily="Arial">ma</text>
  </svg>
)

// ==================== INTERNET & TELECOM ====================

export const UztelecomLogo = ({ size = 40 }: BrandLogoProps) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
    <rect width="40" height="40" rx="10" fill="#003B8E" />
    <text x="20" y="19" textAnchor="middle" fill="white" fontSize="6" fontWeight="600" fontFamily="Arial">UZ</text>
    <text x="20" y="28" textAnchor="middle" fill="#FFD700" fontSize="6" fontWeight="700" fontFamily="Arial">telecom</text>
  </svg>
)

export const BeelineLogo = ({ size = 40 }: BrandLogoProps) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
    <circle cx="20" cy="20" r="18" fill="#FFCC00" />
    <circle cx="20" cy="20" r="14" fill="#333" />
    <circle cx="20" cy="20" r="10" fill="#FFCC00" />
    <circle cx="20" cy="20" r="6" fill="#333" />
    <circle cx="20" cy="20" r="3" fill="#FFCC00" />
  </svg>
)

export const UcellLogo = ({ size = 40 }: BrandLogoProps) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
    <rect width="40" height="40" rx="10" fill="#7B2FF2" />
    <text x="20" y="25" textAnchor="middle" fill="white" fontSize="9" fontWeight="700" fontFamily="Arial">Ucell</text>
  </svg>
)

// ==================== KATEGORIYA → BRAND MAPPING ====================

export interface BrandItem {
  id: string
  name: string
  Logo: React.FC<BrandLogoProps>
  color: string
}

export interface HubCategory {
  id: string
  icon: string
  labels: { uz: string; ru: string; en: string }
  brands: BrandItem[]
  gradient: string
}

export const HUB_CATEGORIES: HubCategory[] = [
  {
    id: 'payment',
    icon: '💳',
    labels: { uz: "To'lov tizimlari", ru: 'Платёжные системы', en: 'Payment Systems' },
    gradient: 'from-blue-100 to-blue-200',
    brands: [
      { id: 'payme', name: 'Payme', Logo: PaymeLogo, color: '#33CCCC' },
      { id: 'click', name: 'Click', Logo: ClickLogo, color: '#E31E25' },
      { id: 'uzum_bank', name: 'Uzum Bank', Logo: UzumBankLogo, color: '#7B2FF2' },
      { id: 'visa', name: 'Visa', Logo: VisaLogo, color: '#1A1F71' },
      { id: 'mastercard', name: 'Mastercard', Logo: MastercardLogo, color: '#EB001B' },
      { id: 'humo', name: 'Humo', Logo: HumoLogo, color: '#00875A' },
    ],
  },
  {
    id: 'crm',
    icon: '📊',
    labels: { uz: 'CRM & Analitika', ru: 'CRM & Аналитика', en: 'CRM & Analytics' },
    gradient: 'from-green-100 to-green-200',
    brands: [
      { id: 'amocrm', name: 'AmoCRM', Logo: AmoCRMLogo, color: '#339DC9' },
      { id: 'bitrix24', name: 'Bitrix24', Logo: Bitrix24Logo, color: '#2FC6F6' },
      { id: 'google_analytics', name: 'Google Analytics', Logo: GoogleAnalyticsLogo, color: '#F9AB00' },
    ],
  },
  {
    id: 'delivery',
    icon: '🚚',
    labels: { uz: 'Yetkazib berish', ru: 'Доставка', en: 'Delivery' },
    gradient: 'from-yellow-100 to-yellow-200',
    brands: [
      { id: 'yandex_delivery', name: 'Yandex Delivery', Logo: YandexDeliveryLogo, color: '#FFCC00' },
      { id: 'express24', name: 'Express24', Logo: Express24Logo, color: '#FF3B30' },
      { id: 'wolt', name: 'Wolt', Logo: WoltLogo, color: '#009DE0' },
      { id: 'glovo', name: 'Glovo', Logo: GlovoLogo, color: '#FFC244' },
      { id: 'uzum_tezkor', name: 'Uzum Tezkor', Logo: UzumTezkorLogo, color: '#7B2FF2' },
    ],
  },
  {
    id: 'pos',
    icon: '🖥️',
    labels: { uz: 'POS Terminallari', ru: 'POS-Терминалы', en: 'POS Terminals' },
    gradient: 'from-purple-100 to-purple-200',
    brands: [
      { id: 'iiko', name: 'iiko', Logo: IikoLogo, color: '#E74C3C' },
      { id: 'rkeeper', name: 'R-Keeper', Logo: RKeeperLogo, color: '#1B4F72' },
      { id: 'poster', name: 'Poster', Logo: PosterLogo, color: '#4CAF50' },
      { id: 'jowi', name: 'Jowi', Logo: JowiLogo, color: '#FF9800' },
      { id: 'paloma365', name: 'Paloma365', Logo: Paloma365Logo, color: '#2196F3' },
    ],
  },
  {
    id: 'communication',
    icon: '💬',
    labels: { uz: 'Aloqa kanallari', ru: 'Каналы связи', en: 'Communication' },
    gradient: 'from-cyan-100 to-cyan-200',
    brands: [
      { id: 'telegram', name: 'Telegram', Logo: TelegramLogo, color: '#0088CC' },
      { id: 'eskiz_sms', name: 'Eskiz SMS', Logo: EskizSMSLogo, color: '#E53935' },
      { id: 'zadarma', name: 'Zadarma', Logo: ZadarmaLogo, color: '#4CAF50' },
    ],
  },
  {
    id: 'internet',
    icon: '🌐',
    labels: { uz: 'Internet & Telecom', ru: 'Интернет & Телеком', en: 'Internet & Telecom' },
    gradient: 'from-indigo-100 to-indigo-200',
    brands: [
      { id: 'uztelecom', name: 'Uztelecom', Logo: UztelecomLogo, color: '#003B8E' },
      { id: 'beeline', name: 'Beeline', Logo: BeelineLogo, color: '#FFCC00' },
      { id: 'ucell', name: 'Ucell', Logo: UcellLogo, color: '#7B2FF2' },
    ],
  },
]
