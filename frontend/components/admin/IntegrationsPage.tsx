'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { Icons } from './Icons'
import { Translations, Language } from '@/lib/admin/translations'
import api from '@/services/api'
import IntegrationHub from './IntegrationHub'
import IntegrationsProjectsTab from './IntegrationsProjectsTab'
import IntegrationsAvailableTab from './IntegrationsAvailableTab'
import IntegrationsConnectedTab from './IntegrationsConnectedTab'

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
      {activeTab === 'projects' && (
        <IntegrationsProjectsTab
          projects={projects}
          connectedIntegrations={connectedIntegrations}
          selectedProject={selectedProject}
          selectedProjectId={selectedProjectId}
          showAddIntegrationModal={showAddIntegrationModal}
          categoryFilter={categoryFilter}
          categories={categories}
          u={u}
          lang={lang}
          companyTypeLabels={companyTypeLabels}
          categoryLabels={categoryLabels}
          connecting={connecting}
          showProjectModal={showProjectModal}
          editingProject={editingProject}
          projectFormData={projectFormData}
          formErrors={formErrors}
          getProjectIntegrationsCount={getProjectIntegrationsCount}
          setSelectedProject={setSelectedProject}
          setSelectedProjectId={setSelectedProjectId}
          setShowAddIntegrationModal={setShowAddIntegrationModal}
          setCategoryFilter={setCategoryFilter}
          openProjectModal={openProjectModal}
          openConnectModal={openConnectModal}
          handleDeleteProject={handleDeleteProject}
          handleToggleActive={handleToggleActive}
          handleDisconnect={handleDisconnect}
          setShowProjectModal={setShowProjectModal}
          setFormErrors={setFormErrors}
          setProjectFormData={setProjectFormData}
          handleSaveProject={handleSaveProject}
        />
      )}

      {/* ============== MAVJUD TAB ============== */}
      {activeTab === 'available' && (
        <IntegrationsAvailableTab
          connectedIntegrations={connectedIntegrations}
          filteredIntegrations={filteredIntegrations}
          categoryFilter={categoryFilter}
          categories={categories}
          projects={projects}
          selectedProjectId={selectedProjectId}
          selectedIntegration={selectedIntegration}
          editingConfig={editingConfig}
          formData={formData}
          showModal={showModal}
          connecting={connecting}
          testResult={testResult}
          u={u}
          lang={lang}
          categoryLabels={categoryLabels}
          setCategoryFilter={setCategoryFilter}
          setSelectedProjectId={setSelectedProjectId}
          setFormData={setFormData}
          setShowModal={setShowModal}
          openConnectModal={openConnectModal}
          handleConnect={handleConnect}
          handleTestConnection={handleTestConnection}
          handleToggleActive={handleToggleActive}
          handleDisconnect={handleDisconnect}
          getConnectedConfig={getConnectedConfig}
        />
      )}

      {/* ============== ULANGANLAR TAB ============== */}
      {activeTab === 'connected' && (
        <IntegrationsConnectedTab
          connectedIntegrations={connectedIntegrations}
          u={u}
          categoryLabels={categoryLabels}
          setActiveTab={setActiveTab}
          openConnectModal={openConnectModal}
          handleDisconnect={handleDisconnect}
        />
      )}
    </div>
  )
}
