'use client'

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { HUB_CATEGORIES, type HubCategory } from './IntegrationHubBrandLogos'
import './IntegrationHubAnimations.css'

type Language = 'uz' | 'ru' | 'en'

interface ConnectedItem {
  integration_id: string
  is_active: boolean
}

interface IntegrationHubProps {
  lang: Language
  connectedIntegrations: ConnectedItem[]
  onSelectCategory: (category: string) => void
  onSelectIntegration: (integrationId: string) => void
  totalIntegrations: number
}

// Kategoriya pozitsiyalari (soat yo'nalishida: tepa, tepa-o'ng, past-o'ng, past, past-chap, tepa-chap)
const ANGLE_OFFSETS = [-90, -30, 30, 90, 150, 210]

// Bazaviy o'lchamlar (ideal holatda)
const BASE_RADIUS = 280
const BASE_BRAND_SIZE = 48
const BASE_CENTER_W = 280
const BASE_CENTER_H = 200

interface Position {
  x: number
  y: number
}

export default function IntegrationHub({
  lang,
  connectedIntegrations,
  onSelectCategory,
  onSelectIntegration,
  totalIntegrations,
}: IntegrationHubProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 })
  const [isLargeScreen, setIsLargeScreen] = useState(true)

  // Container o'lchamini kuzatish
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        setContainerSize({ width: rect.width, height: rect.height })
      }
      setIsLargeScreen(window.innerWidth >= 1024)
    }
    updateSize()
    window.addEventListener('resize', updateSize)
    return () => window.removeEventListener('resize', updateSize)
  }, [])

  // Ulangan integratsiyalar soni
  const connectedCount = useMemo(
    () => connectedIntegrations.filter(c => c.is_active).length,
    [connectedIntegrations]
  )

  // Integratsiya ulangan mi?
  const isConnected = useCallback(
    (brandId: string) => connectedIntegrations.some(c => c.integration_id === brandId && c.is_active),
    [connectedIntegrations]
  )

  // Kategoriyada ulangan integratsiya bor mi?
  const categoryHasConnected = useCallback(
    (cat: HubCategory) => cat.brands.some(b => isConnected(b.id)),
    [isConnected]
  )

  // Scale faktor - ekranga moslashish uchun
  const scale = useMemo(() => {
    if (!containerSize.width || !containerSize.height) return 1
    // Kerakli joy: radius + brand karta + badge (~130px har tomonga)
    const needed = (BASE_RADIUS + 130) * 2
    const scaleX = containerSize.width / needed
    const scaleY = containerSize.height / needed
    return Math.min(scaleX, scaleY, 1.15)
  }, [containerSize])

  // Radius va o'lchamlar
  const radius = BASE_RADIUS * scale
  const brandSize = Math.round(BASE_BRAND_SIZE * scale)
  const brandLogoSize = Math.round(28 * scale)
  const centerW = Math.round(BASE_CENTER_W * scale)
  const centerH = Math.round(BASE_CENTER_H * scale)
  const maxBrands = scale < 0.7 ? 3 : scale < 0.85 ? 4 : 5
  const brandGap = Math.round(6 * scale)
  const brandMaxWidth = Math.round(180 * scale)

  // Pozitsiyalarni hisoblash - doiraviy (bir xil masofa)
  const positions = useMemo((): Position[] => {
    if (!containerSize.width || !containerSize.height) return ANGLE_OFFSETS.map(() => ({ x: 0, y: 0 }))
    const cx = containerSize.width / 2
    const cy = containerSize.height / 2
    return ANGLE_OFFSETS.map(angle => {
      const rad = (angle * Math.PI) / 180
      return { x: cx + radius * Math.cos(rad), y: cy + radius * Math.sin(rad) }
    })
  }, [containerSize, radius])

  const centerX = containerSize.width / 2
  const centerY = containerSize.height / 2

  // Mobile/Tablet layout
  if (!isLargeScreen) {
    return (
      <div className="space-y-6">
        {/* Markaziy element */}
        <div className="hub-center mx-auto hub-fade-in">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <span className="text-white text-lg font-bold">A</span>
            </div>
            <div>
              <h3 className="text-white font-bold text-lg">AyTiX</h3>
              <p className="text-white/70 text-xs">
                {lang === 'ru' ? 'Центр управления' : lang === 'en' ? 'Control Center' : 'Boshqaruv Markazi'}
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <span className="hub-stat-badge bg-white/15 text-white/90">
              <span className="w-2 h-2 bg-green-400 rounded-full inline-block" />
              {connectedCount} {lang === 'ru' ? 'подключено' : lang === 'en' ? 'connected' : 'ulangan'}
            </span>
            <span className="hub-stat-badge bg-white/15 text-white/90">
              <span className="w-2 h-2 bg-gray-400 rounded-full inline-block" />
              {totalIntegrations} {lang === 'ru' ? 'доступно' : lang === 'en' ? 'available' : 'mavjud'}
            </span>
          </div>
        </div>

        {/* Kategoriyalar grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {HUB_CATEGORIES.map((cat, idx) => (
            <div
              key={cat.id}
              className={`bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-all cursor-pointer hub-fade-in hub-fade-in-delay-${idx + 1}`}
              onClick={() => onSelectCategory(cat.id)}
            >
              <div className="flex items-center gap-2 mb-3">
                <span className={`hub-category-badge hub-badge-${cat.id}`}>
                  {cat.icon} {cat.labels[lang]}
                </span>
                {categoryHasConnected(cat) && (
                  <span className="w-2 h-2 bg-green-500 rounded-full" />
                )}
              </div>
              <div className="flex gap-2 flex-wrap">
                {cat.brands.map(brand => (
                  <div
                    key={brand.id}
                    className={`hub-brand-card ${isConnected(brand.id) ? 'active' : ''}`}
                    onClick={(e) => { e.stopPropagation(); onSelectIntegration(brand.id) }}
                    title={brand.name}
                  >
                    <brand.Logo size={30} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Desktop layout - vizual hub
  return (
    <div className="hub-container" ref={containerRef}>
      {/* SVG Layer - Connection Lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
        <defs>
          <linearGradient id="hubGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00a6a6" />
            <stop offset="100%" stopColor="#0a2d5c" />
          </linearGradient>
        </defs>
        {positions.map((pos, idx) => {
          if (!pos.x && !pos.y) return null
          const cat = HUB_CATEGORIES[idx]
          if (!cat) return null
          return (
            <line
              key={cat.id}
              x1={pos.x} y1={pos.y}
              x2={centerX} y2={centerY}
              className={`hub-connection-line ${categoryHasConnected(cat) ? 'connected' : ''}`}
            />
          )
        })}
      </svg>

      {/* Markaziy AyTiX Element */}
      <div
        className="hub-center hub-fade-in"
        style={{ zIndex: 10, width: centerW, minHeight: centerH }}
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="w-11 h-11 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm" style={{ width: 40 * scale, height: 40 * scale }}>
            <span className="text-white font-bold" style={{ fontSize: 18 * scale }}>A</span>
          </div>
          <div>
            <h3 className="text-white font-bold tracking-tight" style={{ fontSize: 18 * scale }}>AyTiX</h3>
            <p className="text-white/60" style={{ fontSize: 11 * scale }}>
              {lang === 'ru' ? 'Центр управления' : lang === 'en' ? 'Control Center' : 'Boshqaruv Markazi'}
            </p>
          </div>
        </div>
        <div className="w-full h-px bg-white/20 my-2" />
        <p className="text-white/80 text-center mb-2" style={{ fontSize: 11 * scale }}>
          {lang === 'ru'
            ? 'Все интеграции в одном месте'
            : lang === 'en'
            ? 'All integrations in one place'
            : "Barcha integratsiyalar bir joyda"}
        </p>
        <div className="flex gap-2">
          <span className="hub-stat-badge bg-white/15 text-white/90" style={{ fontSize: 11 * scale, padding: `3px ${10 * scale}px` }}>
            <span className="w-2 h-2 bg-green-400 rounded-full inline-block" />
            {connectedCount} {lang === 'ru' ? 'подкл.' : lang === 'en' ? 'conn.' : 'ulangan'}
          </span>
          <span className="hub-stat-badge bg-white/15 text-white/90" style={{ fontSize: 11 * scale, padding: `3px ${10 * scale}px` }}>
            <span className="w-2 h-2 bg-gray-400 rounded-full inline-block" />
            {totalIntegrations}+
          </span>
        </div>
      </div>

      {/* 6 ta kategoriya guruhi */}
      {HUB_CATEGORIES.map((cat, idx) => {
        const pos = positions[idx]
        if (!pos) return null
        const visibleBrands = cat.brands.slice(0, maxBrands)
        const extraCount = cat.brands.length - maxBrands
        return (
          <div
            key={cat.id}
            className={`hub-category-group hub-fade-in hub-fade-in-delay-${idx + 1}`}
            style={{
              left: pos.x,
              top: pos.y,
              transform: 'translate(-50%, -50%)',
            }}
            onClick={() => onSelectCategory(cat.id)}
          >
            <div
              className={`hub-category-badge hub-badge-${cat.id}`}
              style={{ fontSize: Math.max(11, 13 * scale), padding: `${5 * scale}px ${14 * scale}px` }}
            >
              {cat.icon} {cat.labels[lang]}
              {categoryHasConnected(cat) && (
                <span className="w-2 h-2 bg-green-500 rounded-full ml-1" />
              )}
            </div>
            <div className="flex flex-wrap justify-center" style={{ gap: brandGap, maxWidth: brandMaxWidth }}>
              {visibleBrands.map(brand => (
                <div
                  key={brand.id}
                  className={`hub-brand-card ${isConnected(brand.id) ? 'active' : ''}`}
                  style={{ width: brandSize, height: brandSize, borderRadius: Math.round(12 * scale) }}
                  onClick={(e) => { e.stopPropagation(); onSelectIntegration(brand.id) }}
                  title={brand.name}
                >
                  <brand.Logo size={brandLogoSize} />
                </div>
              ))}
              {extraCount > 0 && (
                <div
                  className="hub-brand-card !bg-gray-50 dark:!bg-gray-700 text-gray-500 dark:text-gray-400 font-bold"
                  style={{ width: brandSize, height: brandSize, borderRadius: Math.round(12 * scale), fontSize: Math.max(10, 12 * scale) }}
                >
                  +{extraCount}
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
