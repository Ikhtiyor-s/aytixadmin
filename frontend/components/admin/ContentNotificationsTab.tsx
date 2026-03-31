'use client'

import { Translations } from '@/lib/admin/translations'
import { NotificationData, ContentStatus, TargetAudience } from '@/lib/api/content'

interface ContentNotificationsTabProps {
  t: Translations
  notifications: NotificationData[]
  getLanguageBadges: (item: any) => string[]
  getTargetLabel: (target: TargetAudience) => string
  getStatusBadge: (status: ContentStatus) => React.ReactNode
  formatDate: (dateStr?: string) => string
  openEditModal: (item: NotificationData) => void
  handleDelete: (id: number) => void
}

export default function ContentNotificationsTab({
  t,
  notifications,
  getLanguageBadges,
  getTargetLabel,
  getStatusBadge,
  formatDate,
  openEditModal,
  handleDelete,
}: ContentNotificationsTabProps) {
  return (
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
  )
}

export interface NotificationFormProps {
  t: Translations
  formData: any
  setFormData: (data: any) => void
}

export function NotificationFormFields({
  t,
  formData,
  setFormData,
}: NotificationFormProps) {
  return (
    <>
      {/* Message fields */}
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

      {/* Scheduled time */}
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
