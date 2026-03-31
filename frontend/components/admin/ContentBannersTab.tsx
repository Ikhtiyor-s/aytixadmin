'use client'

import { Translations } from '@/lib/admin/translations'
import { BannerData, ContentStatus } from '@/lib/api/content'

interface ContentBannersTabProps {
  t: Translations
  banners: BannerData[]
  getMediaUrl: (url: string) => string
  getLanguageBadges: (item: any) => string[]
  getStatusBadge: (status: ContentStatus) => React.ReactNode
  openEditModal: (item: BannerData) => void
  handleDelete: (id: number) => void
  setVideoModalUrl: (url: string | null) => void
}

export default function ContentBannersTab({
  t,
  banners,
  getMediaUrl,
  getLanguageBadges,
  getStatusBadge,
  openEditModal,
  handleDelete,
  setVideoModalUrl,
}: ContentBannersTabProps) {
  return (
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
  )
}

export interface BannerFormProps {
  t: Translations
  formData: any
  setFormData: (data: any) => void
  imagePreview: string | null
  setImagePreview: (url: string | null) => void
  setImageFile: (file: File | null) => void
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  videoPreview: string | null
  setVideoPreview: (url: string | null) => void
  setVideoFile: (file: File | null) => void
  handleVideoChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  API_URL: string
}

export function BannerFormFields({
  t,
  formData,
  setFormData,
  imagePreview,
  setImagePreview,
  setImageFile,
  handleImageChange,
  videoPreview,
  setVideoPreview,
  setVideoFile,
  handleVideoChange,
  API_URL,
}: BannerFormProps) {
  return (
    <>
      {/* Description fields */}
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

      {/* Link and order */}
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

      {/* Project ID */}
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

      {/* Image upload */}
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

      {/* Video/GIF upload */}
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
    </>
  )
}
