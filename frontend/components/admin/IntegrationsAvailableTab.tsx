'use client'

import { Icons } from './Icons'
import { Language } from '@/lib/admin/translations'
import {
  AVAILABLE_INTEGRATIONS,
  IntegrationConfig,
  categoryIcons,
  getDesc
} from './integrations-data'

interface IntegrationsAvailableTabProps {
  connectedIntegrations: IntegrationConfig[]
  filteredIntegrations: typeof AVAILABLE_INTEGRATIONS
  categoryFilter: string
  categories: string[]
  projects: { id: number; name_uz: string }[]
  selectedProjectId: number | null
  selectedIntegration: typeof AVAILABLE_INTEGRATIONS[0] | null
  editingConfig: IntegrationConfig | null
  formData: Record<string, string | boolean>
  showModal: boolean
  connecting: boolean
  testResult: { success: boolean; message: string } | null
  u: Record<string, string>
  lang: Language
  categoryLabels: Record<string, string>
  setCategoryFilter: (filter: string) => void
  setSelectedProjectId: (id: number | null) => void
  setFormData: (data: Record<string, string | boolean>) => void
  setShowModal: (show: boolean) => void
  openConnectModal: (integration: typeof AVAILABLE_INTEGRATIONS[0], existingConfig?: IntegrationConfig) => void
  handleConnect: () => void
  handleTestConnection: () => void
  handleToggleActive: (config: IntegrationConfig) => void
  handleDisconnect: (config: IntegrationConfig) => void
  getConnectedConfig: (integrationId: string) => IntegrationConfig | undefined
}

export default function IntegrationsAvailableTab({
  connectedIntegrations,
  filteredIntegrations,
  categoryFilter,
  categories,
  projects,
  selectedProjectId,
  selectedIntegration,
  editingConfig,
  formData,
  showModal,
  connecting,
  testResult,
  u,
  lang,
  categoryLabels,
  setCategoryFilter,
  setSelectedProjectId,
  setFormData,
  setShowModal,
  openConnectModal,
  handleConnect,
  handleTestConnection,
  handleToggleActive,
  handleDisconnect,
  getConnectedConfig,
}: IntegrationsAvailableTabProps) {
  return (
    <>
      {/* Category Filter */}
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

      {/* Bo'lim-bo'lim ro'yxat — barcha kategoriyalar */}
      {categoryFilter === 'all' && (
        <div className="space-y-6">
          {categories.map(cat => {
            const catIntegrations = AVAILABLE_INTEGRATIONS.filter(i => i.category === cat)
            return (
              <div key={cat} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="px-4 py-3 bg-gradient-to-r from-[#00a6a6]/10 to-[#0a2d5c]/10 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{categoryIcons[cat]}</span>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{categoryLabels[cat]}</h3>
                    <span className="text-xs text-gray-500 bg-gray-200 dark:bg-gray-700 px-2 py-0.5 rounded-full">
                      {catIntegrations.length}
                    </span>
                  </div>
                  <button
                    onClick={() => setCategoryFilter(cat)}
                    className="text-xs text-[#00a6a6] hover:underline"
                  >
                    {u.all_filter} →
                  </button>
                </div>
                <div className="divide-y divide-gray-100 dark:divide-gray-700">
                  {catIntegrations.map(integration => {
                    const connectedConfig = getConnectedConfig(integration.id)
                    const isConnected = !!connectedConfig
                    return (
                      <div key={integration.id} className="px-4 py-3 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl flex-shrink-0 ${
                          isConnected ? 'bg-green-100 dark:bg-green-900/30' : 'bg-gray-100 dark:bg-gray-700'
                        }`}>
                          {integration.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm text-gray-900 dark:text-white">{integration.name}</span>
                            {isConnected && <span className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></span>}
                          </div>
                          <p className="text-xs text-gray-500 truncate">{getDesc(integration, lang)}</p>
                        </div>
                        <button
                          onClick={() => isConnected ? openConnectModal(integration, connectedConfig) : openConnectModal(integration)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium flex-shrink-0 ${
                            isConnected
                              ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                              : 'bg-[#00a6a6] text-white hover:bg-[#008f8f]'
                          }`}
                        >
                          {isConnected ? u.btn_settings : u.btn_connect}
                        </button>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Integrations Grid - filtered by category */}
      {categoryFilter !== 'all' && (
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
    </>
  )
}
