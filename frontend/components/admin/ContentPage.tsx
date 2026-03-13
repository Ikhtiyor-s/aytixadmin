'use client'

import { useState, useEffect } from 'react'
import Cookies from 'js-cookie'
import { Icons } from './Icons'
import { Translations } from '@/lib/admin/translations'
import { contentApi, NewsData, BannerData, NotificationData, ContentStatus, TargetAudience } from '@/lib/api/content'
import { uploadsApi } from '@/lib/api/uploads'
import { translateApi } from '@/lib/api/translate'

type TabType = 'news' | 'banners' | 'notifications'

interface ContentPageProps {
  t: Translations
}

export default function ContentPage({ t }: ContentPageProps) {
  const [activeTab, setActiveTab] = useState<TabType>('news')
  const [news, setNews] = useState<NewsData[]>([])
  const [banners, setBanners] = useState<BannerData[]>([])
  const [notifications, setNotifications] = useState<NotificationData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [videoModalUrl, setVideoModalUrl] = useState<string | null>(null)

  // Modal states
  const [showModal, setShowModal] = useState(false)
  const [editingItem, setEditingItem] = useState<NewsData | BannerData | NotificationData | null>(null)
  const [saving, setSaving] = useState(false)

  // Form data
  const [formData, setFormData] = useState<any>({})
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [videoPreview, setVideoPreview] = useState<string | null>(null)
  const [isTranslating, setIsTranslating] = useState(false)

  const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || 'http://localhost:8000'

  const getToken = () => Cookies.get('access_token') || ''

  // AI tarjima funksiyasi
  const handleAITranslate = async () => {
    // Content field ni aniqlash (tab ga qarab)
    let contentField = ''
    if (activeTab === 'news') contentField = 'content'
    else if (activeTab === 'banners') contentField = 'description'
    else contentField = 'message'

    // Qaysi tilda ma'lumot bor tekshirish (title YOKI description/content)
    let sourceLang: 'uz' | 'ru' | 'en' | null = null

    // Avval title tekshirish
    if (formData.title_uz?.trim()) {
      sourceLang = 'uz'
    } else if (formData.title_ru?.trim()) {
      sourceLang = 'ru'
    } else if (formData.title_en?.trim()) {
      sourceLang = 'en'
    }
    // Agar title bo'lmasa, description/content tekshirish
    else if (formData[`${contentField}_uz`]?.trim()) {
      sourceLang = 'uz'
    } else if (formData[`${contentField}_ru`]?.trim()) {
      sourceLang = 'ru'
    } else if (formData[`${contentField}_en`]?.trim()) {
      sourceLang = 'en'
    }

    if (!sourceLang) {
      alert(t.pleaseEnterName)
      return
    }

    const targetLangs = ['uz', 'ru', 'en'].filter(l => l !== sourceLang)

    setIsTranslating(true)
    try {
      const token = getToken()
      const newFormData = { ...formData }

      // Title tarjimasi
      const titleKey = `title_${sourceLang}`
      if (formData[titleKey]?.trim()) {
        const titleResult = await translateApi.translate({
          text: formData[titleKey],
          source_lang: sourceLang,
          target_langs: targetLangs
        }, token)

        if (titleResult.success) {
          targetLangs.forEach(lang => {
            if (titleResult.translations[lang]) {
              newFormData[`title_${lang}`] = titleResult.translations[lang]
            }
          })
        }
      }

      // Content/Description/Message tarjimasi
      const contentKey = `${contentField}_${sourceLang}`
      if (formData[contentKey]?.trim()) {
        const contentResult = await translateApi.translate({
          text: formData[contentKey],
          source_lang: sourceLang,
          target_langs: targetLangs
        }, token)

        if (contentResult.success) {
          targetLangs.forEach(lang => {
            if (contentResult.translations[lang]) {
              newFormData[`${contentField}_${lang}`] = contentResult.translations[lang]
            }
          })
        }
      }

      setFormData(newFormData)
      alert(t.translationSuccess)
    } catch (err) {
      console.error('Translation error:', err)
      alert(err instanceof Error ? err.message : t.translationError)
    } finally {
      setIsTranslating(false)
    }
  }

  useEffect(() => {
    fetchAllData()
  }, [])

  const fetchAllData = async () => {
    setLoading(true)
    setError(null)
    try {
      const token = getToken()
      const [newsData, bannersData, notificationsData] = await Promise.all([
        contentApi.getNews(token),
        contentApi.getBanners(token),
        contentApi.getNotifications(token)
      ])
      setNews(newsData)
      setBanners(bannersData)
      setNotifications(notificationsData)
    } catch (err) {
      setError(err instanceof Error ? err.message : t.userLoadError)
    } finally {
      setLoading(false)
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setVideoFile(file)
      setVideoPreview(URL.createObjectURL(file))
    }
  }

  const openAddModal = () => {
    setEditingItem(null)
    setImageFile(null)
    setImagePreview(null)
    setVideoFile(null)
    setVideoPreview(null)

    if (activeTab === 'news') {
      setFormData({
        title_uz: '', title_ru: '', title_en: '',
        content_uz: '', content_ru: '', content_en: '',
        target: 'all', status: 'active', image_url: ''
      })
    } else if (activeTab === 'banners') {
      setFormData({
        title_uz: '', title_ru: '', title_en: '',
        description_uz: '', description_ru: '', description_en: '',
        link_url: '', project_id: null, video_url: '', order: 0, status: 'active', image_url: ''
      })
    } else {
      setFormData({
        title_uz: '', title_ru: '', title_en: '',
        message_uz: '', message_ru: '', message_en: '',
        icon: 'bell', target: 'all', status: 'active', scheduled_at: ''
      })
    }
    setShowModal(true)
  }

  const openEditModal = (item: NewsData | BannerData | NotificationData) => {
    setEditingItem(item)
    setImageFile(null)
    setVideoFile(null)
    const itemWithImage = item as NewsData | BannerData
    const imgUrl = 'image_url' in item ? itemWithImage.image_url : null
    setImagePreview(imgUrl ? (imgUrl.startsWith('http') ? imgUrl : `${API_URL}${imgUrl}`) : null)
    // Video preview for banners
    const itemWithVideo = item as BannerData
    const vidUrl = 'video_url' in item ? itemWithVideo.video_url : null
    setVideoPreview(vidUrl ? (vidUrl.startsWith('http') ? vidUrl : `${API_URL}${vidUrl}`) : null)
    setFormData({ ...item })
    setShowModal(true)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const token = getToken()
      let imageUrl = formData.image_url || ''
      let videoUrl = formData.video_url || ''

      // Upload image if selected
      if (imageFile) {
        const uploadResult = await uploadsApi.uploadImage(imageFile, token)
        imageUrl = uploadResult.url
      }

      // Upload video/gif if selected
      if (videoFile) {
        const uploadResult = await uploadsApi.uploadVideo(videoFile, token)
        videoUrl = uploadResult.url
      }
      const dataToSave = { ...formData, image_url: imageUrl || undefined, video_url: videoUrl || undefined, project_id: formData.project_id || null }

      if (activeTab === 'news') {
        if (editingItem?.id) {
          await contentApi.updateNews(editingItem.id, dataToSave, token)
        } else {
          await contentApi.createNews(dataToSave, token)
        }
      } else if (activeTab === 'banners') {
        if (editingItem?.id) {
          await contentApi.updateBanner(editingItem.id, dataToSave, token)
        } else {
          await contentApi.createBanner(dataToSave, token)
        }
      } else {
        // Handle scheduled_at for notifications
        if (dataToSave.scheduled_at === '') {
          delete dataToSave.scheduled_at
        }
        if (editingItem?.id) {
          await contentApi.updateNotification(editingItem.id, dataToSave, token)
        } else {
          await contentApi.createNotification(dataToSave, token)
        }
      }

      setShowModal(false)
      fetchAllData()
    } catch (err) {
      setError(err instanceof Error ? err.message : t.translationError)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm(t.deleteConfirm)) return

    try {
      const token = getToken()
      if (activeTab === 'news') {
        await contentApi.deleteNews(id, token)
      } else if (activeTab === 'banners') {
        await contentApi.deleteBanner(id, token)
      } else {
        await contentApi.deleteNotification(id, token)
      }
      fetchAllData()
    } catch (err) {
      setError(err instanceof Error ? err.message : t.userDeleteError)
    }
  }

  const getLanguageBadges = (item: any) => {
    const langs = []
    if (item.title_uz) langs.push('UZ')
    if (item.title_ru) langs.push('RU')
    if (item.title_en) langs.push('EN')
    return langs
  }

  const getTargetLabel = (target: TargetAudience) => {
    const labels: Record<TargetAudience, string> = {
      all: t.toAll,
      users: t.toUsers,
      sellers: t.toSellers,
      admins: t.toAdmins
    }
    return labels[target] || target
  }

  const getStatusBadge = (status: ContentStatus) => {
    return status === 'active' ? (
      <span className="px-2 py-1 text-xs bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-full">
        {t.active}
      </span>
    ) : (
      <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 rounded-full">
        {t.inactive}
      </span>
    )
  }

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '-'
    return new Date(dateStr).toLocaleDateString('uz-UZ', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getMediaUrl = (url: string) => {
    if (!url) return ''
    if (url.startsWith('http')) return url
    return `${API_URL}${url}`
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#33ccff]"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t.content}</h1>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-4 py-2 bg-[#33ccff] hover:bg-[#00bfff] text-white rounded-lg transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          {t.addNew}
        </button>
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setActiveTab('news')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'news'
              ? 'text-[#33ccff] border-b-2 border-[#33ccff]'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          {t.news} ({news.length})
        </button>
        <button
          onClick={() => setActiveTab('banners')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'banners'
              ? 'text-[#33ccff] border-b-2 border-[#33ccff]'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          {t.banners} ({banners.length})
        </button>
        <button
          onClick={() => setActiveTab('notifications')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'notifications'
              ? 'text-[#33ccff] border-b-2 border-[#33ccff]'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          {t.notifications} ({notifications.length})
        </button>
      </div>

      {/* Content based on active tab */}
      {activeTab === 'news' && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">{t.title}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">{t.languages}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">{t.audience}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">{t.status}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">{t.views}</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">{t.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {news.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {item.image_url && (
                        <img
                          src={item.image_url.startsWith('http') ? item.image_url : `${API_URL}${item.image_url}`}
                          alt=""
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                      )}
                      <span className="font-medium text-gray-900 dark:text-white">{item.title_uz}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-1">
                      {getLanguageBadges(item).map((lang) => (
                        <span key={lang} className="px-2 py-0.5 text-xs bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 rounded">
                          {lang}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                    {getTargetLabel(item.target || 'all')}
                  </td>
                  <td className="px-6 py-4">{getStatusBadge(item.status || 'active')}</td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{item.views || 0}</td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => openEditModal(item)}
                        className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(item.id!)}
                        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {news.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                    {t.noNews}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'banners' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {banners.map((banner) => (
            <div key={banner.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
              <div className="h-40 bg-gradient-to-r from-[#33ccff]/20 to-[#33ccff]/10 flex items-center justify-center relative">
                {banner.video_url ? (
                  <>
                    {/* Video thumbnail with play button */}
                    <div className="w-full h-full relative group">
                      {banner.image_url ? (
                        <img
                          src={getMediaUrl(banner.image_url)}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <video
                          src={getMediaUrl(banner.video_url)}
                          className="w-full h-full object-cover"
                          muted
                          playsInline
                        />
                      )}
                      {/* Play button overlay */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          const url = getMediaUrl(banner.video_url!)
                          console.log('Video URL:', url)
                          setVideoModalUrl(url)
                        }}
                        className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors"
                      >
                        <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                          <svg className="w-6 h-6 text-[#33ccff] ml-1" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                          </svg>
                        </div>
                      </button>
                    </div>
                    {/* Video badge */}
                    <div className="absolute top-2 right-2 px-2 py-1 bg-black/50 text-white text-xs rounded-lg flex items-center gap-1">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                      </svg>
                      {t.videoGif}
                    </div>
                  </>
                ) : banner.image_url ? (
                  <img
                    src={getMediaUrl(banner.image_url)}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-[#33ccff]/20 flex items-center justify-center">
                    <svg className="w-8 h-8 text-[#33ccff]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-gray-900 dark:text-white">{banner.title_uz}</h3>
                  {getStatusBadge(banner.status || 'active')}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                  {banner.description_uz || t.noDescription}
                </p>
                {(banner as any).project_id && (
                  <div className="flex items-center gap-1 mb-2">
                    <span className="text-xs px-2 py-0.5 bg-[#33ccff]/10 text-[#33ccff] rounded font-mono">
                      {t.projectIdLabel}: {(banner as any).project_id}
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <div className="flex gap-1">
                    {getLanguageBadges(banner).map((lang) => (
                      <span key={lang} className="px-2 py-0.5 text-xs bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 rounded">
                        {lang}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => openEditModal(banner)}
                      className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(banner.id!)}
                      className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {banners.length === 0 && (
            <div className="col-span-full text-center py-12 text-gray-500 dark:text-gray-400">
              {t.noBanners}
            </div>
          )}
        </div>
      )}

      {activeTab === 'notifications' && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">{t.notification}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">{t.languages}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">{t.audience}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">{t.date}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">{t.status}</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">{t.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {notifications.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#33ccff]/20 flex items-center justify-center">
                        <svg className="w-5 h-5 text-[#33ccff]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                      </div>
                      <div>
                        <span className="font-medium text-gray-900 dark:text-white block">{item.title_uz}</span>
                        <span className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">{item.message_uz}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-1">
                      {getLanguageBadges(item).map((lang) => (
                        <span key={lang} className="px-2 py-0.5 text-xs bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 rounded">
                          {lang}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                    {getTargetLabel(item.target || 'all')}
                  </td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                    {formatDate(item.scheduled_at || item.created_at)}
                  </td>
                  <td className="px-6 py-4">{getStatusBadge(item.status || 'active')}</td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => openEditModal(item)}
                        className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(item.id!)}
                        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {notifications.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                    {t.noNotificationsContent}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Video Player Modal */}
      {videoModalUrl && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80"
          onClick={() => setVideoModalUrl(null)}
        >
          <div
            className="relative w-full max-w-4xl mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setVideoModalUrl(null)}
              className="absolute -top-12 right-0 p-2 text-white hover:text-gray-300 transition-colors z-10"
            >
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <video
              key={videoModalUrl}
              src={videoModalUrl}
              className="w-full max-h-[80vh] rounded-xl shadow-2xl bg-black"
              controls
              autoPlay
              playsInline
            />
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {editingItem ? t.edit : t.addNew}
              </h2>
              <button
                type="button"
                onClick={handleAITranslate}
                disabled={isTranslating}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                title={t.aiTranslate}
              >
                {isTranslating ? (
                  <>
                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>{t.translating}</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    <span>{t.aiTranslate}</span>
                  </>
                )}
              </button>
            </div>
            <div className="p-6 space-y-4">
              {/* Title fields */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t.titleUz} *
                  </label>
                  <input
                    type="text"
                    value={formData.title_uz || ''}
                    onChange={(e) => setFormData({ ...formData, title_uz: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#33ccff] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t.titleRu}
                  </label>
                  <input
                    type="text"
                    value={formData.title_ru || ''}
                    onChange={(e) => setFormData({ ...formData, title_ru: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#33ccff] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t.titleEn}
                  </label>
                  <input
                    type="text"
                    value={formData.title_en || ''}
                    onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#33ccff] focus:border-transparent"
                  />
                </div>
              </div>

              {/* Content/Description/Message fields based on tab */}
              {activeTab === 'news' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t.contentUz} *
                    </label>
                    <textarea
                      value={formData.content_uz || ''}
                      onChange={(e) => setFormData({ ...formData, content_uz: e.target.value })}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#33ccff] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t.contentRu}
                    </label>
                    <textarea
                      value={formData.content_ru || ''}
                      onChange={(e) => setFormData({ ...formData, content_ru: e.target.value })}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#33ccff] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t.contentEn}
                    </label>
                    <textarea
                      value={formData.content_en || ''}
                      onChange={(e) => setFormData({ ...formData, content_en: e.target.value })}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#33ccff] focus:border-transparent"
                    />
                  </div>
                </div>
              )}

              {activeTab === 'banners' && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {t.descUz}
                      </label>
                      <textarea
                        value={formData.description_uz || ''}
                        onChange={(e) => setFormData({ ...formData, description_uz: e.target.value })}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#33ccff] focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {t.descRu}
                      </label>
                      <textarea
                        value={formData.description_ru || ''}
                        onChange={(e) => setFormData({ ...formData, description_ru: e.target.value })}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#33ccff] focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {t.descEn}
                      </label>
                      <textarea
                        value={formData.description_en || ''}
                        onChange={(e) => setFormData({ ...formData, description_en: e.target.value })}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#33ccff] focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {t.linkUrl}
                      </label>
                      <input
                        type="url"
                        value={formData.link_url || ''}
                        onChange={(e) => setFormData({ ...formData, link_url: e.target.value })}
                        placeholder="https://example.com"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#33ccff] focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {t.order}
                      </label>
                      <input
                        type="number"
                        value={formData.order || 0}
                        onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#33ccff] focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Loyiha ID */}
                  <div className="bg-[#33ccff]/5 border border-[#33ccff]/20 rounded-lg p-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t.projectIdLabel}
                    </label>
                    <div className="flex gap-3">
                      <input
                        type="number"
                        value={formData.project_id || ''}
                        onChange={(e) => {
                          const projectId = e.target.value
                          setFormData({
                            ...formData,
                            project_id: projectId,
                            link_url: projectId ? `/projects/${projectId}` : formData.link_url
                          })
                        }}
                        placeholder="Masalan: 12"
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#33ccff] focus:border-transparent"
                      />
                      {formData.project_id && (
                        <div className="flex items-center gap-2 px-3 py-2 bg-[#33ccff]/10 rounded-lg">
                          <svg className="w-4 h-4 text-[#33ccff]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                          </svg>
                          <span className="text-sm text-[#33ccff] font-mono">/projects/{formData.project_id}</span>
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {t.projectIdDesc}
                    </p>
                  </div>
                </>
              )}

              {activeTab === 'notifications' && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {t.messageUz}
                      </label>
                      <textarea
                        value={formData.message_uz || ''}
                        onChange={(e) => setFormData({ ...formData, message_uz: e.target.value })}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#33ccff] focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {t.messageRu}
                      </label>
                      <textarea
                        value={formData.message_ru || ''}
                        onChange={(e) => setFormData({ ...formData, message_ru: e.target.value })}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#33ccff] focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {t.messageEn}
                      </label>
                      <textarea
                        value={formData.message_en || ''}
                        onChange={(e) => setFormData({ ...formData, message_en: e.target.value })}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#33ccff] focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t.scheduledTime}
                    </label>
                    <input
                      type="datetime-local"
                      value={formData.scheduled_at ? formData.scheduled_at.slice(0, 16) : ''}
                      onChange={(e) => setFormData({ ...formData, scheduled_at: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#33ccff] focus:border-transparent"
                    />
                  </div>
                </>
              )}

              {/* Image upload for news and banners */}
              {(activeTab === 'news' || activeTab === 'banners') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t.image}
                  </label>
                  <div className="flex items-center gap-4">
                    {imagePreview && (
                      <div className="relative">
                        <img src={imagePreview} alt="Preview" className="w-20 h-20 rounded-lg object-cover" />
                        <button
                          type="button"
                          onClick={() => {
                            setImagePreview(null)
                            setImageFile(null)
                            setFormData({ ...formData, image_url: null })
                          }}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="block w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-[#33ccff]/10 file:text-[#33ccff] hover:file:bg-[#33ccff]/20"
                    />
                  </div>
                </div>
              )}

              {/* Video/GIF upload for banners only */}
              {activeTab === 'banners' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t.videoGif}
                  </label>
                  <div className="flex items-center gap-4">
                    {(videoPreview || formData.video_url) && (
                      <div className="relative">
                        <video
                          src={videoPreview || (formData.video_url?.startsWith('http') ? formData.video_url : `${API_URL}${formData.video_url}`)}
                          className="w-20 h-20 rounded-lg object-cover"
                          autoPlay
                          loop
                          muted
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setVideoPreview(null)
                            setVideoFile(null)
                            setFormData({ ...formData, video_url: null })
                          }}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    )}
                    <input
                      type="file"
                      accept="video/mp4,video/webm,image/gif"
                      onChange={handleVideoChange}
                      className="block w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-purple-100 file:text-purple-600 hover:file:bg-purple-200 dark:file:bg-purple-900/30 dark:file:text-purple-400"
                    />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{t.videoFormats}</p>
                </div>
              )}

              {/* Target audience for news and notifications */}
              {(activeTab === 'news' || activeTab === 'notifications') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t.audience}
                  </label>
                  <select
                    value={formData.target || 'all'}
                    onChange={(e) => setFormData({ ...formData, target: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#33ccff] focus:border-transparent"
                  >
                    <option value="all">{t.toAll}</option>
                    <option value="users">{t.toUsers}</option>
                    <option value="sellers">{t.toSellers}</option>
                    <option value="admins">{t.toAdmins}</option>
                  </select>
                </div>
              )}

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t.status}
                </label>
                <select
                  value={formData.status || 'active'}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#33ccff] focus:border-transparent"
                >
                  <option value="active">{t.active}</option>
                  <option value="inactive">{t.inactive}</option>
                </select>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
              >
                {t.cancel}
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-2 bg-[#33ccff] hover:bg-[#00bfff] text-white rounded-lg transition-colors disabled:opacity-50"
              >
                {saving ? t.saving : t.save}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
