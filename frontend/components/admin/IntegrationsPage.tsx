'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { Icons } from './Icons'
import { Translations, Language } from '@/lib/admin/translations'
import api from '@/services/api'
import IntegrationHub from './IntegrationHub'

interface IntegrationsPageProps {
  t: Translations
  lang: Language
}


import {
  AVAILABLE_INTEGRATIONS,
  IntegrationProject,
  IntegrationConfig,
  categoryIcons,
  CATEGORY_LABELS,
  COMPANY_TYPE_LABELS,
  UI_TEXT,
  INTEGRATION_TRANSLATIONS,
  getDesc
} from './integrations-data'

export default function IntegrationsPage({ t, lang }: IntegrationsPageProps) {
  // UI text qisqartmasi
  const u = UI_TEXT[lang] || UI_TEXT.uz
  const categoryLabels = CATEGORY_LABELS[lang] || CATEGORY_LABELS.uz
  const companyTypeLabels = COMPANY_TYPE_LABELS[lang] || COMPANY_TYPE_LABELS.uz
  const { token, loading: authLoading } = useAuth()
  const [connectedIntegrations, setConnectedIntegrations] = useState<IntegrationConfig[]>([])
  const [projects, setProjects] = useState<IntegrationProject[]>([])
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [selectedIntegration, setSelectedIntegration] = useState<typeof AVAILABLE_INTEGRATIONS[0] | null>(null)
  const [editingConfig, setEditingConfig] = useState<IntegrationConfig | null>(null)
  const [formData, setFormData] = useState<Record<string, string | boolean>>({})
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null)
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [activeTab, setActiveTab] = useState<'hub' | 'projects' | 'available' | 'connected'>('available')
  const [connecting, setConnecting] = useState(false)
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null)

  // Loyiha detail view
  const [selectedProject, setSelectedProject] = useState<IntegrationProject | null>(null)
  const [showAddIntegrationModal, setShowAddIntegrationModal] = useState(false)

  // Loyihalar uchun modal
  const [showProjectModal, setShowProjectModal] = useState(false)
  const [editingProject, setEditingProject] = useState<IntegrationProject | null>(null)
  const [projectFormData, setProjectFormData] = useState({
    name_uz: '',
    name_ru: '',
    name_en: '',
    description_uz: '',
    description_ru: '',
    description_en: '',
    phone: '',
    email: '',
    website: '',
    address: '',
    inn: '',
    company_type: '' as string,
    contact_person: '',
    contact_phone: '',
    logo_url: '',
    notes: ''
  })
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  const validateProjectForm = (): boolean => {
    const errors: Record<string, string> = {}
    if (!projectFormData.name_uz.trim()) {
      errors.name_uz = u.err_name_required
    }
    if (projectFormData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(projectFormData.email)) {
      errors.email = u.err_email_invalid
    }
    if (projectFormData.inn && !/^\d+$/.test(projectFormData.inn)) {
      errors.inn = u.err_inn_digits
    }
    if (projectFormData.phone && !/^\+?[\d\s\-()]+$/.test(projectFormData.phone)) {
      errors.phone = u.err_phone_invalid
    }
    if (projectFormData.contact_phone && !/^\+?[\d\s\-()]+$/.test(projectFormData.contact_phone)) {
      errors.contact_phone = u.err_phone_invalid
    }
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  useEffect(() => {
    if (!authLoading && token) {
      loadConnectedIntegrations()
      loadProjects()
    }
  }, [token, authLoading])

  const loadConnectedIntegrations = async () => {
    try {
      setLoading(true)
      const response = await api.get('/integrations/connected')
      setConnectedIntegrations(response.data || [])
    } catch (err) {
      console.error('Error loading integrations:', err)
      setConnectedIntegrations([])
    } finally {
      setLoading(false)
    }
  }

  const loadProjects = async () => {
    try {
      // IntegrationProject - Aytix integratsiya xizmati loyihalari (marketplace Project EMAS!)
      const response = await api.get('/integrations/projects')
      setProjects(response.data || [])
    } catch (err) {
      console.error('Error loading integration projects:', err)
      setProjects([])
    }
  }

  // Loyihalar CRUD
  const openProjectModal = (project?: IntegrationProject) => {
    setFormErrors({})
    if (project) {
      setEditingProject(project)
      setProjectFormData({
        name_uz: project.name_uz || '',
        name_ru: project.name_ru || '',
        name_en: project.name_en || '',
        description_uz: project.description_uz || '',
        description_ru: project.description_ru || '',
        description_en: project.description_en || '',
        phone: project.phone || '',
        email: project.email || '',
        website: project.website || '',
        address: project.address || '',
        inn: project.inn || '',
        company_type: project.company_type || '',
        contact_person: project.contact_person || '',
        contact_phone: project.contact_phone || '',
        logo_url: project.logo_url || '',
        notes: project.notes || ''
      })
    } else {
      setEditingProject(null)
      setProjectFormData({
        name_uz: '',
        name_ru: '',
        name_en: '',
        description_uz: '',
        description_ru: '',
        description_en: '',
        phone: '',
        email: '',
        website: '',
        address: '',
        inn: '',
        company_type: '',
        contact_person: '',
        contact_phone: '',
        logo_url: '',
        notes: ''
      })
    }
    setShowProjectModal(true)
  }

  const handleSaveProject = async () => {
    if (!validateProjectForm()) return

    const cleanedData = Object.fromEntries(
      Object.entries(projectFormData).map(([key, value]) => [
        key,
        typeof value === 'string' && value.trim() === '' ? null : value
      ])
    )

    try {
      setConnecting(true)
      if (editingProject?.id) {
        await api.put(`/integrations/projects/${editingProject.id}`, cleanedData)
      } else {
        await api.post('/integrations/projects', cleanedData)
      }
      setShowProjectModal(false)
      setFormErrors({})
      loadProjects()
    } catch (err) {
      console.error('Error saving integration project:', err)
      alert(u.err_save_client)
    } finally {
      setConnecting(false)
    }
  }

  const handleDeleteProject = async (project: IntegrationProject) => {
    // Tekshirish - ushbu mijozga ulangan integratsiyalar bormi
    const projectIntegrations = connectedIntegrations.filter(c => c.integration_project_id === project.id)
    if (projectIntegrations.length > 0) {
      alert(`Bu mijozga ${projectIntegrations.length} ${u.err_has_integrations}`)
      return
    }

    if (!confirm(`"${project.name_uz}" - ${u.confirm_delete_client}`)) return

    try {
      await api.delete(`/integrations/projects/${project.id}`)
      loadProjects()
    } catch (err: any) {
      console.error('Error deleting integration project:', err)
      alert(err.response?.data?.detail || u.err_delete_client)
    }
  }

  // Loyihaga ulangan integratsiyalar sonini olish
  const getProjectIntegrationsCount = (projectId: number) => {
    return connectedIntegrations.filter(c => c.integration_project_id === projectId).length
  }

  const openConnectModal = (integration: typeof AVAILABLE_INTEGRATIONS[0], existingConfig?: IntegrationConfig) => {
    setSelectedIntegration(integration)
    setTestResult(null)

    if (existingConfig) {
      setEditingConfig(existingConfig)
      setFormData(existingConfig.config || {})
      setSelectedProjectId(existingConfig.integration_project_id || null)
    } else {
      setEditingConfig(null)
      // Agar selectedProject tanlangan bo'lsa yoki selectedProjectId allaqachon set bo'lsa - saqla
      if (!selectedProjectId && selectedProject) {
        setSelectedProjectId(selectedProject.id)
      }
      // Initialize with empty values
      const initialData: Record<string, string | boolean> = {}
      integration.fields.forEach(field => {
        initialData[field.key] = field.type === 'checkbox' ? false : ''
      })
      setFormData(initialData)
    }

    setShowModal(true)
  }

  const handleConnect = async () => {
    if (!selectedIntegration) return

    // Mijoz tanlangan bo'lishi kerak
    if (!selectedProjectId) {
      setTestResult({ success: false, message: u.err_select_client })
      return
    }

    // Validate required fields
    const missingFields = selectedIntegration.fields
      .filter(f => f.required && !formData[f.key])
      .map(f => f.label)

    if (missingFields.length > 0) {
      setTestResult({ success: false, message: `${u.err_required_fields}: ${missingFields.join(', ')}` })
      return
    }

    try {
      setConnecting(true)
      setTestResult(null)

      const payload = {
        integration_project_id: selectedProjectId,
        integration_id: selectedIntegration.id,
        name: selectedIntegration.name,
        config: formData,
        is_active: true
      }

      if (editingConfig?.id) {
        await api.put(`/integrations/connected/${editingConfig.id}`, payload)
        setTestResult({ success: true, message: u.success_updated })
      } else {
        await api.post('/integrations/connected', payload)
        setTestResult({ success: true, message: u.success_connected })
      }

      // Reload after short delay to show success message
      setTimeout(() => {
        setShowModal(false)
        loadConnectedIntegrations()
      }, 1500)

    } catch (err: any) {
      console.error('Error connecting integration:', err)
      setTestResult({
        success: false,
        message: err.response?.data?.detail || u.err_connect_failed
      })
    } finally {
      setConnecting(false)
    }
  }

  const handleTestConnection = async () => {
    if (!selectedIntegration) return

    // Validate required fields first
    const missingFields = selectedIntegration.fields
      .filter(f => f.required && !formData[f.key])
      .map(f => f.label)

    if (missingFields.length > 0) {
      setTestResult({ success: false, message: `${u.err_required_fields}: ${missingFields.join(', ')}` })
      return
    }

    try {
      setConnecting(true)
      setTestResult(null)

      const response = await api.post('/integrations/test', {
        integration_id: selectedIntegration.id,
        config: formData
      })

      setTestResult({
        success: response.data.success,
        message: response.data.message || u.success_test
      })
    } catch (err: any) {
      setTestResult({
        success: false,
        message: err.response?.data?.detail || u.err_test_failed
      })
    } finally {
      setConnecting(false)
    }
  }

  const handleDisconnect = async (config: IntegrationConfig) => {
    if (!confirm(`"${config.name}" - ${u.confirm_delete_integration}`)) return

    try {
      await api.delete(`/integrations/connected/${config.id}`)
      loadConnectedIntegrations()
    } catch (err) {
      console.error('Error disconnecting:', err)
    }
  }

  const handleToggleActive = async (config: IntegrationConfig) => {
    try {
      await api.put(`/integrations/connected/${config.id}`, {
        ...config,
        is_active: !config.is_active
      })
      loadConnectedIntegrations()
    } catch (err) {
      console.error('Error toggling:', err)
    }
  }

  const getConnectedConfig = (integrationId: string) => {
    return connectedIntegrations.find(c => c.integration_id === integrationId)
  }

  const categories = Array.from(new Set(AVAILABLE_INTEGRATIONS.map(i => i.category)))

  // Filter integrations based on selected category or "connected" filter
  const filteredIntegrations = categoryFilter === 'all'
    ? AVAILABLE_INTEGRATIONS
    : categoryFilter === 'connected'
    ? AVAILABLE_INTEGRATIONS.filter(i => connectedIntegrations.some(c => c.integration_id === i.id))
    : AVAILABLE_INTEGRATIONS.filter(i => i.category === categoryFilter)

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00a6a6]"></div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header with Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">{t.integrations}</h1>
          <p className="text-sm text-gray-500">{u.pageSubtitle}</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            {u.connected_label}: {connectedIntegrations.filter(c => c.is_active).length}
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 bg-gray-300 rounded-full"></span>
            {u.available_label}: {AVAILABLE_INTEGRATIONS.length}
          </span>
        </div>
      </div>

      {/* Subkategoriya Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-1 inline-flex flex-wrap">
        <button
          onClick={() => setActiveTab('hub')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
            activeTab === 'hub'
              ? 'bg-gradient-to-r from-[#0a2d5c] to-[#00a6a6] text-white shadow-sm'
              : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
        >
          🌐 {lang === 'ru' ? 'Обзор' : lang === 'en' ? 'Hub Overview' : 'Hub'}
        </button>
        <button
          onClick={() => { setActiveTab('projects'); setSelectedProject(null) }}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
            activeTab === 'projects'
              ? 'bg-[#0a2d5c] text-white shadow-sm'
              : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
        >
          🏢 {u.tab_clients}
          {projects.length > 0 && (
            <span className={`px-1.5 py-0.5 rounded-full text-xs ${
              activeTab === 'projects' ? 'bg-white/20' : 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-400'
            }`}>
              {projects.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('available')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'available'
              ? 'bg-[#00a6a6] text-white shadow-sm'
              : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
        >
          📦 {u.tab_available}
        </button>
        <button
          onClick={() => setActiveTab('connected')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
            activeTab === 'connected'
              ? 'bg-green-500 text-white shadow-sm'
              : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
        >
          ✓ {u.tab_connected}
          {connectedIntegrations.length > 0 && (
            <span className={`px-1.5 py-0.5 rounded-full text-xs ${
              activeTab === 'connected' ? 'bg-white/20' : 'bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-400'
            }`}>
              {connectedIntegrations.length}
            </span>
          )}
        </button>
      </div>

      {/* ============== HUB OVERVIEW TAB ============== */}
      {activeTab === 'hub' && (
        <IntegrationHub
          lang={lang}
          connectedIntegrations={connectedIntegrations.map(c => ({
            integration_id: c.integration_id,
            is_active: c.is_active
          }))}
          onSelectCategory={(cat) => {
            setCategoryFilter(cat)
            setActiveTab('available')
          }}
          onSelectIntegration={(id) => {
            const integration = AVAILABLE_INTEGRATIONS.find(i => i.id === id)
            if (integration) {
              openConnectModal(integration)
            }
          }}
          totalIntegrations={AVAILABLE_INTEGRATIONS.length}
        />
      )}

      {/* ============== MIJOZLAR TAB ============== */}
      {activeTab === 'projects' && !selectedProject && (
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
      {activeTab === 'projects' && selectedProject && (
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

      {/* Category Filter - faqat "Mavjud" tabda ko'rsatiladi */}
      {activeTab === 'available' && (
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
      )}

      {/* Connected integrations grouped by project - "Ulanganlar" tabda */}
      {activeTab === 'connected' && (
        <>
          {connectedIntegrations.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-3xl">
                🔌
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {u.empty_no_connected}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                {u.empty_no_connected_desc}
              </p>
              <button
                onClick={() => setActiveTab('available')}
                className="px-4 py-2 bg-[#00a6a6] hover:bg-[#008f8f] text-white rounded-lg text-sm font-medium"
              >
                {u.btn_view_available}
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Mijozlar bo'yicha guruhlash */}
              {(() => {
                // Mijozlar bo'yicha guruhlash
                const grouped = connectedIntegrations.reduce((acc, conn) => {
                  const projectName = conn.integration_project?.name_uz || u.without_client
                  const projectId = conn.integration_project_id || 0
                  if (!acc[projectId]) {
                    acc[projectId] = {
                      name: projectName,
                      integrations: []
                    }
                  }
                  acc[projectId].integrations.push(conn)
                  return acc
                }, {} as Record<number, { name: string, integrations: IntegrationConfig[] }>)

                return Object.entries(grouped).map(([projectId, group]) => (
                  <div key={projectId} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                    {/* Mijoz sarlavhasi */}
                    <div className="px-4 py-3 bg-gradient-to-r from-[#00a6a6]/10 to-[#0a2d5c]/10 border-b border-gray-200 dark:border-gray-700">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">🏢</span>
                        <h3 className="font-semibold text-gray-900 dark:text-white">{group.name}</h3>
                        <span className="text-xs text-gray-500 bg-gray-200 dark:bg-gray-700 px-2 py-0.5 rounded-full">
                          {group.integrations.length} {u.integration_word}
                        </span>
                      </div>
                    </div>

                    {/* Ulangan servislar */}
                    <div className="p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {group.integrations.map(conn => {
                          const integrationInfo = AVAILABLE_INTEGRATIONS.find(i => i.id === conn.integration_id)
                          if (!integrationInfo) return null

                          return (
                            <div
                              key={conn.id}
                              className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-600"
                            >
                              <div className="w-10 h-10 rounded-lg bg-white dark:bg-gray-800 flex items-center justify-center text-xl shadow-sm">
                                {integrationInfo.icon}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium text-gray-900 dark:text-white text-sm truncate">
                                    {conn.name}
                                  </span>
                                  <span className={`w-2 h-2 rounded-full ${conn.is_active ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                                </div>
                                <span className="text-xs text-gray-500">
                                  {categoryIcons[integrationInfo.category]} {categoryLabels[integrationInfo.category]}
                                </span>
                              </div>
                              <div className="flex gap-1">
                                <button
                                  onClick={() => openConnectModal(integrationInfo, conn)}
                                  className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg text-gray-500"
                                  title={u.btn_settings}
                                >
                                  {Icons.settings}
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
                          )
                        })}
                      </div>
                    </div>
                  </div>
                ))
              })()}
            </div>
          )}
        </>
      )}

      {/* Bo'lim-bo'lim ro'yxat — barcha kategoriyalar */}
      {activeTab === 'available' && categoryFilter === 'all' && (
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

      {/* Integrations Grid - faqat "Mavjud" tabda ko'rsatiladi */}
      {activeTab === 'available' && categoryFilter !== 'all' && (
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
    </div>
  )
}
