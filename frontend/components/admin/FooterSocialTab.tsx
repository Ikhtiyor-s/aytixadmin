'use client'

import { FooterSocialLink, PLATFORM_ICONS } from '@/lib/api/footer'

// Platform options
const PLATFORMS = [
  { value: 'telegram', label: 'Telegram' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'youtube', label: 'YouTube' },
  { value: 'tiktok', label: 'TikTok' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'twitter', label: 'Twitter' },
  { value: 'whatsapp', label: 'WhatsApp' },
]

interface FooterSocialTabProps {
  t: any
  socialLinks: FooterSocialLink[]
  selectedSocialLink: FooterSocialLink | null
  showSocialModal: boolean
  saving: boolean
  socialForm: Partial<FooterSocialLink>
  setSocialForm: (form: Partial<FooterSocialLink>) => void
  setSelectedSocialLink: (link: FooterSocialLink | null) => void
  setShowSocialModal: (show: boolean) => void
  resetSocialForm: () => void
  handleCreateSocialLink: () => void
  handleUpdateSocialLink: () => void
  handleDeleteSocialLink: (id: number) => void
  handleToggleSocialLink: (id: number, is_active: boolean) => void
  openEditSocialLink: (link: FooterSocialLink) => void
}

export default function FooterSocialTab({
  t,
  socialLinks,
  selectedSocialLink,
  showSocialModal,
  saving,
  socialForm,
  setSocialForm,
  setSelectedSocialLink,
  setShowSocialModal,
  resetSocialForm,
  handleCreateSocialLink,
  handleUpdateSocialLink,
  handleDeleteSocialLink,
  handleToggleSocialLink,
  openEditSocialLink,
}: FooterSocialTabProps) {
  return (
    <>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold dark:text-white">{t.socialLinks}</h2>
          <button
            onClick={() => { resetSocialForm(); setSelectedSocialLink(null); setShowSocialModal(true) }}
            className="px-4 py-2 bg-[#00a6a6] text-white rounded-lg hover:bg-[#00a6a6]/90 transition-colors"
          >
            + {t.addSocialLink}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {socialLinks.length === 0 ? (
            <p className="col-span-full text-gray-500 text-center py-8">{t.noSocialLinks}</p>
          ) : (
            socialLinks.map((link) => (
              <div key={link.id} className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">
                      <i className={link.icon || PLATFORM_ICONS[link.platform] || 'fas fa-link'}></i>
                    </span>
                    <div>
                      <p className="font-medium capitalize dark:text-white">{link.platform}</p>
                      <a href={link.link_url} target="_blank" rel="noopener noreferrer" className="text-xs text-[#00a6a6] hover:underline">
                        {link.link_url.substring(0, 30)}...
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleToggleSocialLink(link.id!, !!link.is_active)}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${link.is_active ? 'bg-green-500' : 'bg-gray-300'}`}
                      title={link.is_active ? t.inactiveStatus : t.activeStatus}
                    >
                      <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${link.is_active ? 'translate-x-4' : 'translate-x-1'}`} />
                    </button>
                    <button
                      onClick={() => openEditSocialLink(link)}
                      className="p-1 text-gray-400 hover:text-[#00a6a6]"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDeleteSocialLink(link.id!)}
                      className="p-1 text-gray-400 hover:text-red-500"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* SOCIAL MODAL */}
      {showSocialModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold dark:text-white">
                {selectedSocialLink ? t.editSocialLink : t.newSocialLink}
              </h3>
              <button
                onClick={() => { setShowSocialModal(false); setSelectedSocialLink(null) }}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                title={t.close}
              >
                <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t.platform} *</label>
                <select
                  value={socialForm.platform}
                  onChange={(e) => setSocialForm({ ...socialForm, platform: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#00a6a6] focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  {PLATFORMS.map((p) => (
                    <option key={p.value} value={p.value}>{p.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t.itemLink} *</label>
                <input
                  type="text"
                  value={socialForm.link_url}
                  onChange={(e) => setSocialForm({ ...socialForm, link_url: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#00a6a6] focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="https://t.me/username"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => { setShowSocialModal(false); setSelectedSocialLink(null) }}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                {t.cancel}
              </button>
              <button
                onClick={selectedSocialLink ? handleUpdateSocialLink : handleCreateSocialLink}
                disabled={saving || !socialForm.link_url}
                className="flex-1 px-4 py-2 bg-[#00a6a6] text-white rounded-lg hover:bg-[#00a6a6]/90 disabled:opacity-50"
              >
                {saving ? t.saving : t.save}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
