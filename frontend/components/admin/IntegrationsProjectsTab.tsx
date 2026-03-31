'use client'

import { Language } from '@/lib/admin/translations'
import { Icons } from './Icons'
import {
  AVAILABLE_INTEGRATIONS,
  IntegrationProject,
  IntegrationConfig,
  categoryIcons,
  getDesc
} from './integrations-data'

interface IntegrationsProjectsTabProps {
  projects: IntegrationProject[]
  connectedIntegrations: IntegrationConfig[]
  selectedProject: IntegrationProject | null
  selectedProjectId: number | null
  showAddIntegrationModal: boolean
  categoryFilter: string
  categories: string[]
  u: Record<string, string>
  lang: Language
  companyTypeLabels: Record<string, string>
  categoryLabels: Record<string, string>
  connecting: boolean
  showProjectModal: boolean
  editingProject: IntegrationProject | null
  projectFormData: {
    name_uz: string
    name_ru: string
    name_en: string
    description_uz: string
    description_ru: string
    description_en: string
    phone: string
    email: string
    website: string
    address: string
    inn: string
    company_type: string
    contact_person: string
    contact_phone: string
    logo_url: string
    notes: string
  }
  formErrors: Record<string, string>
  getProjectIntegrationsCount: (projectId: number) => number
  setSelectedProject: (project: IntegrationProject | null) => void
  setSelectedProjectId: (id: number | null) => void
  setShowAddIntegrationModal: (show: boolean) => void
  setCategoryFilter: (filter: string) => void
  openProjectModal: (project?: IntegrationProject) => void
  openConnectModal: (integration: typeof AVAILABLE_INTEGRATIONS[0], existingConfig?: IntegrationConfig) => void
  handleDeleteProject: (project: IntegrationProject) => void
  handleToggleActive: (config: IntegrationConfig) => void
  handleDisconnect: (config: IntegrationConfig) => void
  setShowProjectModal: (show: boolean) => void
  setFormErrors: (errors: Record<string, string>) => void
  setProjectFormData: (data: any) => void
  handleSaveProject: () => void
}

export default function IntegrationsProjectsTab({
  projects,
  connectedIntegrations,
  selectedProject,
  selectedProjectId,
  showAddIntegrationModal,
  categoryFilter,
  categories,
  u,
  lang,
  companyTypeLabels,
  categoryLabels,
  connecting,
  showProjectModal,
  editingProject,
  projectFormData,
  formErrors,
  getProjectIntegrationsCount,
  setSelectedProject,
  setSelectedProjectId,
  setShowAddIntegrationModal,
  setCategoryFilter,
  openProjectModal,
  openConnectModal,
  handleDeleteProject,
  handleToggleActive,
  handleDisconnect,
  setShowProjectModal,
  setFormErrors,
  setProjectFormData,
  handleSaveProject,
}: IntegrationsProjectsTabProps) {
  return (
    <>
      {/* ============== MIJOZLAR TAB ============== */}
      {!selectedProject && (
        <div className="space-y-4">
          {/* Mijoz qo'shish tugmasi */}
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {u.clients_description}
            </p>
            <button
              onClick={() => openProjectModal()}
              className="px-4 py-2 bg-[#0a2d5c] hover:bg-[#0a2d5c]/90 text-white rounded-lg text-sm font-medium flex items-center gap-2"
            >
              {Icons.plus} {u.btn_new_client}
            </button>
          </div>

          {/* Mijozlar ro'yxati */}
          {projects.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-3xl">
                🏢
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {u.empty_no_clients}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                {u.empty_no_clients_desc}
              </p>
              <button
                onClick={() => openProjectModal()}
                className="px-4 py-2 bg-[#0a2d5c] hover:bg-[#0a2d5c]/90 text-white rounded-lg text-sm font-medium"
              >
                {u.btn_add_first_client}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {projects.map(project => {
                const integrationsCount = getProjectIntegrationsCount(project.id)
                return (
                  <div
                    key={project.id}
                    onClick={() => setSelectedProject(project)}
                    className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                  >
                    <div className="p-4">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0a2d5c] to-[#00a6a6] flex items-center justify-center text-white text-xl font-bold">
                          {project.name_uz.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                            {project.name_uz}
                          </h3>
                          {project.name_ru && (
                            <p className="text-xs text-gray-500 truncate">{project.name_ru}</p>
                          )}
                        </div>
                      </div>

                      {/* Biznes ma'lumotlari */}
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        {project.company_type && (
                          <span className="px-2 py-0.5 bg-[#00a6a6]/10 text-[#00a6a6] dark:text-[#33cccc] rounded-md text-xs font-medium">
                            {companyTypeLabels[project.company_type] || project.company_type}
                          </span>
                        )}
                        {project.phone && (
                          <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-md text-xs flex items-center gap-1">
                            📞 {project.phone}
                          </span>
                        )}
                        {project.email && (
                          <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-md text-xs flex items-center gap-1 truncate max-w-[180px]">
                            📧 {project.email}
                          </span>
                        )}
                      </div>

                      {/* Statistika */}
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`px-2 py-1 rounded-lg text-xs font-medium ${
                          integrationsCount > 0
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-500'
                        }`}>
                          {integrationsCount > 0 ? `${integrationsCount} ${u.integrations_count}` : u.no_integrations}
                        </div>
                      </div>

                      {/* Ulangan servislar */}
                      {integrationsCount > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                          {connectedIntegrations
                            .filter(c => c.integration_project_id === project.id)
                            .slice(0, 5)
                            .map(conn => {
                              const info = AVAILABLE_INTEGRATIONS.find(i => i.id === conn.integration_id)
                              return info ? (
                                <span key={conn.id} className="text-lg" title={info.name}>
                                  {info.icon}
                                </span>
                              ) : null
                            })}
                          {integrationsCount > 5 && (
                            <span className="text-xs text-gray-500">+{integrationsCount - 5}</span>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700/50 flex gap-2" onClick={e => e.stopPropagation()}>
                      <button
                        onClick={() => setSelectedProject(project)}
                        className="flex-1 px-3 py-2 bg-[#00a6a6] hover:bg-[#008f8f] text-white rounded-lg text-sm font-medium"
                      >
                        {u.btn_manage}
                      </button>
                      <button
                        onClick={() => openProjectModal(project)}
                        className="px-3 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200 rounded-lg text-sm"
                      >
                        {Icons.settings}
                      </button>
                      <button
                        onClick={() => handleDeleteProject(project)}
                        className="px-3 py-2 bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 rounded-lg text-sm"
                      >
                        {Icons.trash}
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* ============== LOYIHA DETAIL VIEW ============== */}
      {selectedProject && (
        <div className="space-y-4">
          {/* Orqaga tugmasi va sarlavha */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSelectedProject(null)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-500"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0a2d5c] to-[#00a6a6] flex items-center justify-center text-white text-xl font-bold">
                {selectedProject.name_uz.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">{selectedProject.name_uz}</h2>
                <p className="text-sm text-gray-500">
                  {getProjectIntegrationsCount(selectedProject.id)} {u.integrations_count}
                </p>
              </div>
            </div>
            <div className="ml-auto flex gap-2">
              <button
                onClick={() => openProjectModal(selectedProject)}
                className="px-3 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium flex items-center gap-2"
              >
                {Icons.settings} {u.btn_settings}
              </button>
            </div>
          </div>

          {/* Mijoz ma'lumotlari */}
          {(selectedProject.phone || selectedProject.email || selectedProject.website || selectedProject.inn || selectedProject.contact_person || selectedProject.address) && (
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2 text-sm">
                📋 {u.client_info}
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                {selectedProject.company_type && (
                  <div>
                    <span className="text-gray-500 dark:text-gray-400 text-xs">{u.type_label}</span>
                    <p className="font-medium text-gray-900 dark:text-white">{companyTypeLabels[selectedProject.company_type] || selectedProject.company_type}</p>
                  </div>
                )}
                {selectedProject.inn && (
                  <div>
                    <span className="text-gray-500 dark:text-gray-400 text-xs">{u.inn_label}</span>
                    <p className="font-medium text-gray-900 dark:text-white">{selectedProject.inn}</p>
                  </div>
                )}
                {selectedProject.phone && (
                  <div>
                    <span className="text-gray-500 dark:text-gray-400 text-xs">{u.phone_label}</span>
                    <p className="font-medium text-gray-900 dark:text-white">{selectedProject.phone}</p>
                  </div>
                )}
                {selectedProject.email && (
                  <div>
                    <span className="text-gray-500 dark:text-gray-400 text-xs">{u.email_label}</span>
                    <p className="font-medium text-gray-900 dark:text-white">{selectedProject.email}</p>
                  </div>
                )}
                {selectedProject.website && (
                  <div>
                    <span className="text-gray-500 dark:text-gray-400 text-xs">{u.website_label}</span>
                    <a href={selectedProject.website} target="_blank" rel="noopener noreferrer" className="font-medium text-[#00a6a6] hover:underline block truncate">
                      {selectedProject.website}
                    </a>
                  </div>
                )}
                {selectedProject.address && (
                  <div className="col-span-2">
                    <span className="text-gray-500 dark:text-gray-400 text-xs">{u.address_label}</span>
                    <p className="font-medium text-gray-900 dark:text-white">{selectedProject.address}</p>
                  </div>
                )}
                {selectedProject.contact_person && (
                  <div>
                    <span className="text-gray-500 dark:text-gray-400 text-xs">{u.contact_person_label}</span>
                    <p className="font-medium text-gray-900 dark:text-white">{selectedProject.contact_person}</p>
                  </div>
                )}
                {selectedProject.contact_phone && (
                  <div>
                    <span className="text-gray-500 dark:text-gray-400 text-xs">{u.contact_phone_label}</span>
                    <p className="font-medium text-gray-900 dark:text-white">{selectedProject.contact_phone}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Ulangan integratsiyalar */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                🔗 {u.connected_integrations}
              </h3>
              <button
                onClick={() => {
                  setSelectedProjectId(selectedProject.id)
                  setShowAddIntegrationModal(true)
                }}
                className="px-3 py-1.5 bg-[#00a6a6] hover:bg-[#008f8f] text-white rounded-lg text-sm font-medium flex items-center gap-1"
              >
                {Icons.plus} {u.btn_add_integration}
              </button>
            </div>

            {/* Kategoriyalar bo'yicha integratsiyalar */}
            {(() => {
              const projectIntegrations = connectedIntegrations.filter(c => c.integration_project_id === selectedProject.id)

              if (projectIntegrations.length === 0) {
                return (
                  <div className="p-8 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-3xl">
                      🔌
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {u.empty_no_integrations}
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                      {u.empty_no_integrations_desc}
                    </p>
                    <button
                      onClick={() => {
                        setSelectedProjectId(selectedProject.id)
                        setShowAddIntegrationModal(true)
                      }}
                      className="px-4 py-2 bg-[#00a6a6] hover:bg-[#008f8f] text-white rounded-lg text-sm font-medium"
                    >
                      {u.btn_add_first_integration}
                    </button>
                  </div>
                )
              }

              // Kategoriyalar bo'yicha guruhlash
              const byCategory = projectIntegrations.reduce((acc, conn) => {
                const info = AVAILABLE_INTEGRATIONS.find(i => i.id === conn.integration_id)
                const cat = info?.category || 'other'
                if (!acc[cat]) acc[cat] = []
                acc[cat].push({ conn, info })
                return acc
              }, {} as Record<string, { conn: IntegrationConfig, info: typeof AVAILABLE_INTEGRATIONS[0] | undefined }[]>)

              return (
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {Object.entries(byCategory).map(([cat, items]) => (
                    <div key={cat} className="p-4">
                      <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3 flex items-center gap-2">
                        {categoryIcons[cat]} {categoryLabels[cat]}
                        <span className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full">
                          {items.length}
                        </span>
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {items.map(({ conn, info }) => (
                          <div
                            key={conn.id}
                            className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-600"
                          >
                            <div className="w-10 h-10 rounded-lg bg-white dark:bg-gray-800 flex items-center justify-center text-xl shadow-sm">
                              {info?.icon || '🔧'}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-gray-900 dark:text-white text-sm truncate">
                                  {conn.name}
                                </span>
                                <span className={`w-2 h-2 rounded-full ${conn.is_active ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                              </div>
                              <span className="text-xs text-gray-500">
                                {conn.is_active ? u.status_active : u.status_inactive}
                              </span>
                            </div>
                            <div className="flex gap-1">
                              <button
                                onClick={() => {
                                  if (info) openConnectModal(info, conn)
                                }}
                                className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg text-gray-500"
                                title={u.btn_settings}
                              >
                                {Icons.settings}
                              </button>
                              <button
                                onClick={() => handleToggleActive(conn)}
                                className={`p-1.5 rounded-lg ${
                                  conn.is_active
                                    ? 'hover:bg-yellow-100 dark:hover:bg-yellow-900/30 text-yellow-600'
                                    : 'hover:bg-green-100 dark:hover:bg-green-900/30 text-green-600'
                                }`}
                                title={conn.is_active ? u.btn_disable : u.btn_enable}
                              >
                                {conn.is_active ? (
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                                  </svg>
                                ) : Icons.check}
                              </button>
                              <button
                                onClick={() => handleDisconnect(conn)}
                                className="p-1.5 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg text-red-500"
                                title={u.btn_delete}
                              >
                                {Icons.trash}
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )
            })()}
          </div>
        </div>
      )}

      {/* ============== INTEGRATSIYA QO'SHISH MODAL ============== */}
      {showAddIntegrationModal && selectedProjectId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowAddIntegrationModal(false)}>
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {u.modal_add_integration}
                </h3>
                <p className="text-sm text-gray-500">
                  {projects.find(p => p.id === selectedProjectId)?.name_uz} {u.for_client}
                </p>
              </div>
              <button onClick={() => setShowAddIntegrationModal(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-500">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Category Filter */}
            <div className="px-6 py-3 border-b border-gray-200 dark:border-gray-700">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setCategoryFilter('all')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    categoryFilter === 'all'
                      ? 'bg-[#00a6a6] text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {u.all_filter}
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
                    {categoryLabels[cat]}
                  </button>
                ))}
              </div>
            </div>

            {/* Integrations Grid */}
            <div className="p-6 overflow-y-auto flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {(categoryFilter === 'all' ? AVAILABLE_INTEGRATIONS : AVAILABLE_INTEGRATIONS.filter(i => i.category === categoryFilter))
                  .map(integration => {
                    // Bu loyihada allaqachon ulanganmi?
                    const alreadyConnected = connectedIntegrations.some(
                      c => c.integration_project_id === selectedProjectId && c.integration_id === integration.id
                    )

                    return (
                      <div
                        key={integration.id}
                        onClick={() => {
                          if (!alreadyConnected) {
                            setShowAddIntegrationModal(false)
                            openConnectModal(integration)
                          }
                        }}
                        className={`p-3 rounded-xl border transition-all ${
                          alreadyConnected
                            ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700 cursor-not-allowed'
                            : 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:border-[#00a6a6] hover:shadow-md cursor-pointer'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl ${
                            alreadyConnected ? 'bg-green-100 dark:bg-green-900/30' : 'bg-gray-100 dark:bg-gray-600'
                          }`}>
                            {integration.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-gray-900 dark:text-white text-sm truncate">
                                {integration.name}
                              </span>
                              {alreadyConnected && (
                                <span className="text-xs bg-green-200 dark:bg-green-800 text-green-700 dark:text-green-300 px-1.5 py-0.5 rounded">
                                  ✓ {u.status_connected}
                                </span>
                              )}
                            </div>
                            <span className="text-xs text-gray-500 truncate block">
                              {getDesc(integration, lang).slice(0, 50)}...
                            </span>
                          </div>
                        </div>
                      </div>
                    )
                  })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mijoz Modal */}
      {showProjectModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => { setShowProjectModal(false); setFormErrors({}) }}>
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0a2d5c] to-[#00a6a6] flex items-center justify-center text-white text-lg">
                🏢
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {editingProject ? u.modal_edit_client : u.modal_new_client}
                </h3>
                <p className="text-xs text-gray-500">{u.modal_client_desc}</p>
              </div>
              <button onClick={() => { setShowProjectModal(false); setFormErrors({}) }} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-500">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body - scrollable */}
            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">

              {/* SECTION 1: Kompaniya ma'lumotlari */}
              <div>
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 border-l-4 border-[#00a6a6] pl-3">
                  {u.section_company}
                </h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {u.client_name_uz} <span className="text-red-500">*</span>
                    </label>
                    <input type="text" value={projectFormData.name_uz}
                      onChange={(e) => setProjectFormData({ ...projectFormData, name_uz: e.target.value })}
                      placeholder={u.client_name_uz_placeholder}
                      className={`w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-[#00a6a6] outline-none ${formErrors.name_uz ? 'ring-2 ring-red-500' : ''}`}
                    />
                    {formErrors.name_uz && <p className="text-xs text-red-500 mt-1">{formErrors.name_uz}</p>}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{u.client_name_ru}</label>
                      <input type="text" value={projectFormData.name_ru}
                        onChange={(e) => setProjectFormData({ ...projectFormData, name_ru: e.target.value })}
                        placeholder={u.client_name_ru_placeholder}
                        className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-[#00a6a6] outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{u.client_name_en}</label>
                      <input type="text" value={projectFormData.name_en}
                        onChange={(e) => setProjectFormData({ ...projectFormData, name_en: e.target.value })}
                        placeholder={u.client_name_en_placeholder}
                        className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-[#00a6a6] outline-none"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{u.company_type_label}</label>
                      <select value={projectFormData.company_type}
                        onChange={(e) => setProjectFormData({ ...projectFormData, company_type: e.target.value })}
                        className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-[#00a6a6] outline-none"
                      >
                        <option value="">{u.select_placeholder}</option>
                        {Object.entries(companyTypeLabels).map(([value, label]) => (
                          <option key={value} value={value}>{label}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{u.inn_stir}</label>
                      <input type="text" value={projectFormData.inn}
                        onChange={(e) => setProjectFormData({ ...projectFormData, inn: e.target.value.replace(/\D/g, '') })}
                        placeholder="123456789"
                        className={`w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-[#00a6a6] outline-none ${formErrors.inn ? 'ring-2 ring-red-500' : ''}`}
                      />
                      {formErrors.inn && <p className="text-xs text-red-500 mt-1">{formErrors.inn}</p>}
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 2: Aloqa ma'lumotlari */}
              <div>
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 border-l-4 border-[#00a6a6] pl-3">
                  {u.section_contact}
                </h4>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{u.phone_label}</label>
                      <input type="tel" value={projectFormData.phone}
                        onChange={(e) => setProjectFormData({ ...projectFormData, phone: e.target.value })}
                        placeholder="+998 90 123 45 67"
                        className={`w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-[#00a6a6] outline-none ${formErrors.phone ? 'ring-2 ring-red-500' : ''}`}
                      />
                      {formErrors.phone && <p className="text-xs text-red-500 mt-1">{formErrors.phone}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{u.email_label}</label>
                      <input type="email" value={projectFormData.email}
                        onChange={(e) => setProjectFormData({ ...projectFormData, email: e.target.value })}
                        placeholder="info@company.uz"
                        className={`w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-[#00a6a6] outline-none ${formErrors.email ? 'ring-2 ring-red-500' : ''}`}
                      />
                      {formErrors.email && <p className="text-xs text-red-500 mt-1">{formErrors.email}</p>}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{u.website_label}</label>
                    <input type="url" value={projectFormData.website}
                      onChange={(e) => setProjectFormData({ ...projectFormData, website: e.target.value })}
                      placeholder="https://company.uz"
                      className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-[#00a6a6] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{u.address_label}</label>
                    <input type="text" value={projectFormData.address}
                      onChange={(e) => setProjectFormData({ ...projectFormData, address: e.target.value })}
                      placeholder="Toshkent sh., Chilonzor t., ..."
                      className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-[#00a6a6] outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 3: Aloqa shaxsi */}
              <div>
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 border-l-4 border-[#00a6a6] pl-3">
                  {u.section_contact_person}
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{u.fio_label}</label>
                    <input type="text" value={projectFormData.contact_person}
                      onChange={(e) => setProjectFormData({ ...projectFormData, contact_person: e.target.value })}
                      placeholder={u.fio_placeholder}
                      className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-[#00a6a6] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{u.phone_number_label}</label>
                    <input type="tel" value={projectFormData.contact_phone}
                      onChange={(e) => setProjectFormData({ ...projectFormData, contact_phone: e.target.value })}
                      placeholder="+998 90 123 45 67"
                      className={`w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-[#00a6a6] outline-none ${formErrors.contact_phone ? 'ring-2 ring-red-500' : ''}`}
                    />
                    {formErrors.contact_phone && <p className="text-xs text-red-500 mt-1">{formErrors.contact_phone}</p>}
                  </div>
                </div>
              </div>

              {/* SECTION 4: Qo'shimcha */}
              <div>
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 border-l-4 border-[#00a6a6] pl-3">
                  {u.section_additional}
                </h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{u.description_label}</label>
                    <textarea value={projectFormData.description_uz}
                      onChange={(e) => setProjectFormData({ ...projectFormData, description_uz: e.target.value })}
                      placeholder={u.description_placeholder}
                      rows={2}
                      className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-[#00a6a6] outline-none resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{u.logo_url_label}</label>
                    <input type="url" value={projectFormData.logo_url}
                      onChange={(e) => setProjectFormData({ ...projectFormData, logo_url: e.target.value })}
                      placeholder="https://company.uz/logo.png"
                      className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-[#00a6a6] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{u.notes_label}</label>
                    <textarea value={projectFormData.notes}
                      onChange={(e) => setProjectFormData({ ...projectFormData, notes: e.target.value })}
                      placeholder={u.notes_placeholder}
                      rows={3}
                      className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-[#00a6a6] outline-none resize-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex gap-3">
              <button
                onClick={() => { setShowProjectModal(false); setFormErrors({}) }}
                className="px-4 py-2.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-xl text-sm font-medium"
              >
                {u.btn_cancel}
              </button>
              <button
                onClick={handleSaveProject}
                disabled={connecting || !projectFormData.name_uz.trim()}
                className="flex-1 px-4 py-2.5 bg-[#0a2d5c] hover:bg-[#0a2d5c]/90 disabled:opacity-50 text-white rounded-xl text-sm font-medium flex items-center justify-center gap-2"
              >
                {connecting ? (
                  <>
                    <span className="animate-spin">⟳</span>
                    {u.status_saving}
                  </>
                ) : (
                  <>
                    {Icons.check}
                    {editingProject ? u.btn_save : u.btn_add}
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
