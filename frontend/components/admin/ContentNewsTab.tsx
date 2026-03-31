'use client'

import { Translations } from '@/lib/admin/translations'
import { NewsData, ContentStatus, TargetAudience } from '@/lib/api/content'

interface ContentNewsTabProps {
  t: Translations
  news: NewsData[]
  API_URL: string
  getLanguageBadges: (item: any) => string[]
  getTargetLabel: (target: TargetAudience) => string
  getStatusBadge: (status: ContentStatus) => React.ReactNode
  openEditModal: (item: NewsData) => void
  handleDelete: (id: number) => void
}

export default function ContentNewsTab({
  t,
  news,
  API_URL,
  getLanguageBadges,
  getTargetLabel,
  getStatusBadge,
  openEditModal,
  handleDelete,
}: ContentNewsTabProps) {
  return (
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
  )
}

export interface NewsFormProps {
  t: Translations
  formData: any
  setFormData: (data: any) => void
  imagePreview: string | null
  setImagePreview: (url: string | null) => void
  setImageFile: (file: File | null) => void
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export function NewsFormFields({
  t,
  formData,
  setFormData,
  imagePreview,
  setImagePreview,
  setImageFile,
  handleImageChange,
}: NewsFormProps) {
  return (
    <>
      {/* Content fields */}
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

      {/* Target audience */}
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
    </>
  )
}
