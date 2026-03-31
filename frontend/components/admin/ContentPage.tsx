'use client'

import { useState, useEffect } from 'react'
import { Translations } from '@/lib/admin/translations'
import { contentApi, NewsData, BannerData, NotificationData, ContentStatus, TargetAudience } from '@/lib/api/content'
import { uploadsApi } from '@/lib/api/uploads'
import { translateApi } from '@/lib/api/translate'
import ContentNewsTab, { NewsFormFields } from './ContentNewsTab'
import ContentBannersTab, { BannerFormFields } from './ContentBannersTab'
import ContentNotificationsTab, { NotificationFormFields } from './ContentNotificationsTab'

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

  const API_URL = ''

  // AI tarjima funksiyasi
  const handleAITranslate = async () => {
    let contentField = ''
    if (activeTab === 'news') contentField = 'content'
    else if (activeTab === 'banners') contentField = 'description'
    else contentField = 'message'

    let sourceLang: 'uz' | 'ru' | 'en' | null = null

    if (formData.title_uz?.trim()) {
      sourceLang = 'uz'
    } else if (formData.title_ru?.trim()) {
      sourceLang = 'ru'
    } else if (formData.title_en?.trim()) {
      sourceLang = 'en'
    }
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
      const newFormData = { ...formData }

      const titleKey = `title_${sourceLang}`
      if (formData[titleKey]?.trim()) {
        const titleResult = await translateApi.translate({
          text: formData[titleKey],
          source_lang: sourceLang,
          target_langs: targetLangs
        })

        if (titleResult.success) {
          targetLangs.forEach(lang => {
            if (titleResult.translations[lang]) {
              newFormData[`title_${lang}`] = titleResult.translations[lang]
            }
          })
        }
      }

      const contentKey = `${contentField}_${sourceLang}`
      if (formData[contentKey]?.trim()) {
        const contentResult = await translateApi.translate({
          text: formData[contentKey],
          source_lang: sourceLang,
          target_langs: targetLangs
        })

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
      const [newsData, bannersData, notificationsData] = await Promise.all([
        contentApi.getNews(),
        contentApi.getBanners(),
        contentApi.getNotifications()
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
    const itemWithVideo = item as BannerData
    const vidUrl = 'video_url' in item ? itemWithVideo.video_url : null
    setVideoPreview(vidUrl ? (vidUrl.startsWith('http') ? vidUrl : `${API_URL}${vidUrl}`) : null)
    setFormData({ ...item })
    setShowModal(true)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      let imageUrl = formData.image_url || ''
      let videoUrl = formData.video_url || ''

      if (imageFile) {
        const uploadResult = await uploadsApi.uploadImage(imageFile)
        imageUrl = uploadResult.url
      }

      if (videoFile) {
        const uploadResult = await uploadsApi.uploadVideo(videoFile)
        videoUrl = uploadResult.url
      }
      const dataToSave = { ...formData, image_url: imageUrl || undefined, video_url: videoUrl || undefined, project_id: formData.project_id || null }

      if (activeTab === 'news') {
        if (editingItem?.id) {
          await contentApi.updateNews(editingItem.id, dataToSave)
        } else {
          await contentApi.createNews(dataToSave)
        }
      } else if (activeTab === 'banners') {
        if (editingItem?.id) {
          await contentApi.updateBanner(editingItem.id, dataToSave)
        } else {
          await contentApi.createBanner(dataToSave)
        }
      } else {
        if (dataToSave.scheduled_at === '') {
          delete dataToSave.scheduled_at
        }
        if (editingItem?.id) {
          await contentApi.updateNotification(editingItem.id, dataToSave)
        } else {
          await contentApi.createNotification(dataToSave)
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
      if (activeTab === 'news') {
        await contentApi.deleteNews(id)
      } else if (activeTab === 'banners') {
        await contentApi.deleteBanner(id)
      } else {
        await contentApi.deleteNotification(id)
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

      {/* Tab content */}
      {activeTab === 'news' && (
        <ContentNewsTab
          t={t}
          news={news}
          API_URL={API_URL}
          getLanguageBadges={getLanguageBadges}
          getTargetLabel={getTargetLabel}
          getStatusBadge={getStatusBadge}
          openEditModal={openEditModal}
          handleDelete={handleDelete}
        />
      )}

      {activeTab === 'banners' && (
        <ContentBannersTab
          t={t}
          banners={banners}
          getMediaUrl={getMediaUrl}
          getLanguageBadges={getLanguageBadges}
          getStatusBadge={getStatusBadge}
          openEditModal={openEditModal}
          handleDelete={handleDelete}
          setVideoModalUrl={setVideoModalUrl}
        />
      )}

      {activeTab === 'notifications' && (
        <ContentNotificationsTab
          t={t}
          notifications={notifications}
          getLanguageBadges={getLanguageBadges}
          getTargetLabel={getTargetLabel}
          getStatusBadge={getStatusBadge}
          formatDate={formatDate}
          openEditModal={openEditModal}
          handleDelete={handleDelete}
        />
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
              {/* Title fields (shared) */}
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

              {/* Tab-specific form fields */}
              {activeTab === 'news' && (
                <NewsFormFields
                  t={t}
                  formData={formData}
                  setFormData={setFormData}
                  imagePreview={imagePreview}
                  setImagePreview={setImagePreview}
                  setImageFile={setImageFile}
                  handleImageChange={handleImageChange}
                />
              )}

              {activeTab === 'banners' && (
                <BannerFormFields
                  t={t}
                  formData={formData}
                  setFormData={setFormData}
                  imagePreview={imagePreview}
                  setImagePreview={setImagePreview}
                  setImageFile={setImageFile}
                  handleImageChange={handleImageChange}
                  videoPreview={videoPreview}
                  setVideoPreview={setVideoPreview}
                  setVideoFile={setVideoFile}
                  handleVideoChange={handleVideoChange}
                  API_URL={API_URL}
                />
              )}

              {activeTab === 'notifications' && (
                <NotificationFormFields
                  t={t}
                  formData={formData}
                  setFormData={setFormData}
                />
              )}

              {/* Status (shared) */}
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
