'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { contentApi, BannerData } from '@/lib/api/content'

const API_BASE = ''

function getMediaUrl(path: string | null | undefined): string {
  if (!path) return ''
  if (path.startsWith('http')) return path
  return `${API_BASE}${path}`
}

function isVideo(url: string): boolean {
  return /\.(mp4|webm|mov|ogg)(\?.*)?$/i.test(url)
}

export default function BannerSlider() {
  const [banners, setBanners] = useState<BannerData[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const videoRefs = useRef<Record<number, HTMLVideoElement | null>>({})

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const data = await contentApi.getBanners()
        const activeBanners = data
          .filter((b) => b.status !== 'inactive')
          .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
        setBanners(activeBanners)
      } catch (err) {
        console.error('Bannerlarni yuklashda xatolik:', err)
        setError('Bannerlarni yuklashda xatolik')
      } finally {
        setLoading(false)
      }
    }
    fetchBanners()
  }, [])

  useEffect(() => {
    if (banners.length <= 1) return
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [banners.length])

  // Active video play/pause
  useEffect(() => {
    banners.forEach((banner, idx) => {
      const video = videoRefs.current[idx]
      if (!video) return
      if (idx === currentIndex) {
        video.play().catch(() => {})
      } else {
        video.pause()
        video.currentTime = 0
      }
    })
  }, [currentIndex, banners])

  const goToBanner = (index: number) => setCurrentIndex(index)
  const nextBanner = () => setCurrentIndex((prev) => (prev + 1) % banners.length)
  const prevBanner = () => setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length)

  if (loading) {
    return (
      <div className="relative bg-gradient-to-r from-indigo-600 to-purple-600 overflow-hidden h-[300px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-white border-t-transparent" />
      </div>
    )
  }

  if (error || banners.length === 0) {
    return null
  }

  return (
    <div className="relative bg-gradient-to-r from-indigo-600 to-purple-600 overflow-hidden h-[300px]">
      {banners.map((banner, index) => {
        const imageUrl = getMediaUrl(banner.image_url)
        const videoUrl = getMediaUrl(banner.video_url)
        const hasVideo = videoUrl && isVideo(videoUrl)
        const hasImage = imageUrl && !isVideo(imageUrl)

        return (
          <div
            key={banner.id}
            className={`absolute inset-0 transition-opacity duration-500 ${
              index === currentIndex ? 'opacity-100 z-[1]' : 'opacity-0 z-0'
            }`}
            style={{ height: '300px' }}
          >
            {/* Video background */}
            {hasVideo && (
              <video
                ref={(el) => { videoRefs.current[index] = el }}
                src={videoUrl}
                muted
                loop
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
              />
            )}

            {/* Image background */}
            {hasImage && !hasVideo && (
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: `url('${imageUrl}')`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              />
            )}

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30" />

            {/* Content */}
            <div className="relative max-w-7xl mx-auto px-6 h-[300px] flex items-center z-[2]">
              <div className="max-w-2xl text-white">
                {banner.title_uz && (
                  <h2 className="text-3xl md:text-4xl font-bold mb-2">
                    {banner.title_uz}
                  </h2>
                )}
                {banner.description_uz && (
                  <p className="text-base md:text-lg mb-4">{banner.description_uz}</p>
                )}
                {(banner.link_url || banner.project_id) && (
                  <Link
                    href={banner.link_url || `/products/${banner.project_id}`}
                    className="px-6 py-3 bg-white text-indigo-600 font-semibold rounded-xl hover:bg-indigo-50 transition-all inline-block text-sm"
                  >
                    Batafsil →
                  </Link>
                )}
              </div>
            </div>
          </div>
        )
      })}

      {/* Navigation Arrows */}
      {banners.length > 1 && (
        <>
          <button
            onClick={prevBanner}
            className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-sm hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110 z-10"
          >
            <svg className="w-6 h-6 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/>
            </svg>
          </button>
          <button
            onClick={nextBanner}
            className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-sm hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110 z-10"
          >
            <svg className="w-6 h-6 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
            </svg>
          </button>
        </>
      )}

      {/* Dots */}
      {banners.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {banners.map((_, idx) => (
            <button
              key={idx}
              onClick={() => goToBanner(idx)}
              className={`w-3 h-3 rounded-full transition-all ${
                idx === currentIndex ? 'bg-white w-8' : 'bg-white/50 hover:bg-white/70'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

