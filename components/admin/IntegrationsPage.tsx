'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { integrationsApi, IntegrationData } from '@/lib/api/integrations'
import { Icons } from './Icons'
import { Translations } from '@/lib/admin/translations'

interface IntegrationsPageProps {
  t: Translations
}

const emptyIntegration: IntegrationData = {
  name: '',
  icon: '',
  description_uz: '',
  description_ru: '',
  description_en: '',
  category: '',
  docs_url: '',
  status: 'active'
}

const categoryIcons: Record<string, string> = {
  payment: '💳',
  crm: '📊',
  analytics: '📈',
  communication: '💬',
  storage: '☁️',
  security: '🔒',
  other: '🔧'
}

export default function IntegrationsPage({ t }: IntegrationsPageProps) {
  const { token, loading: authLoading } = useAuth()
  const [integrations, setIntegrations] = useState<IntegrationData[]>([])
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [editingIntegration, setEditingIntegration] = useState<IntegrationData | null>(null)
  const [formData, setFormData] = useState<IntegrationData>(emptyIntegration)
  const [categoryFilter, setCategoryFilter] = useState<string>('all')

  useEffect(() => {
    if (!authLoading && token) loadIntegrations()
  }, [token, authLoading])

  const loadIntegrations = async () => {
    try {
      setLoading(true)
      const data = await integrationsApi.list(token!)
      setIntegrations(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async () => {
    try {
      if (editingIntegration?.id) {
        await integrationsApi.update(editingIntegration.id, formData, token!)
      } else {
        await integrationsApi.create(formData, token!)
      }
      setShowModal(false)
      setFormData(emptyIntegration)
      setEditingIntegration(null)
      loadIntegrations()
    } catch (err) {
      console.error(err)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Integratsiyani o'chirmoqchimisiz?")) return
    try {
      await integrationsApi.delete(id, token!)
      loadIntegrations()
    } catch (err) {
      console.error(err)
    }
  }

  const openEditModal = (integration: IntegrationData) => {
    setEditingIntegration(integration)
    setFormData(integration)
    setShowModal(true)
  }

  const openCreateModal = () => {
    setEditingIntegration(null)
    setFormData(emptyIntegration)
    setShowModal(true)
  }

  const getStatusBadge = (status?: string) => {
    const styles: Record<string, string> = {
      active: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      inactive: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
      coming_soon: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
    }
    const labels: Record<string, string> = { active: 'Faol', inactive: 'Nofaol', coming_soon: 'Tez kunda' }
    return <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status || 'active']}`}>{labels[status || 'active']}</span>
  }

  const categories = Array.from(new Set(integrations.map(i => i.category).filter(Boolean))) as string[]
  const filteredIntegrations = categoryFilter === 'all' ? integrations : integrations.filter(i => i.category === categoryFilter)

  if (authLoading || loading) {
    return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00a6a6]"></div></div>
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">{t.integrations}</h1>
          <p className="text-sm text-gray-500">Mavjud integratsiyalarni boshqaring</p>
        </div>
        <button onClick={openCreateModal} className="px-4 py-2 bg-[#00a6a6] hover:bg-[#008f8f] text-white rounded-xl text-sm font-medium flex items-center gap-2">
          {Icons.plus} Yangi integratsiya
        </button>
      </div>

      {/* Category Filter */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setCategoryFilter('all')} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${categoryFilter === 'all' ? 'bg-[#00a6a6] text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}>
            Barchasi ({integrations.length})
          </button>
          {categories.map(cat => (
            <button key={cat} onClick={() => setCategoryFilter(cat!)} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 ${categoryFilter === cat ? 'bg-[#00a6a6] text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}>
              <span>{categoryIcons[cat!] || '🔧'}</span> {cat} ({integrations.filter(i => i.category === cat).length})
            </button>
          ))}
        </div>
      </div>

      {/* Integrations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredIntegrations.length === 0 ? (
          <div className="col-span-full bg-white dark:bg-gray-800 rounded-xl p-8 text-center text-gray-500">Integratsiyalar topilmadi</div>
        ) : filteredIntegrations.map((integration) => (
          <div key={integration.id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#00a6a6]/10 to-[#0a2d5c]/10 flex items-center justify-center text-2xl">
                  {integration.icon || categoryIcons[integration.category || 'other'] || '🔧'}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 dark:text-white">{integration.name}</h3>
                  {integration.category && <p className="text-xs text-gray-500">{integration.category}</p>}
                </div>
                {getStatusBadge(integration.status)}
              </div>
              {integration.description_uz && <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">{integration.description_uz}</p>}
              {integration.docs_url && (
                <a href={integration.docs_url} target="_blank" rel="noopener noreferrer" className="text-sm text-[#00a6a6] hover:underline flex items-center gap-1">
                  {Icons.globe} Hujjatlar
                </a>
              )}
            </div>
            <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700/50 flex justify-end gap-2">
              <button onClick={() => openEditModal(integration)} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg text-gray-500">{Icons.edit}</button>
              <button onClick={() => handleDelete(integration.id!)} className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg text-red-500">{Icons.trash}</button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{editingIntegration ? 'Integratsiyani tahrirlash' : 'Yangi integratsiya'}</h3>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-500">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nomi *</label>
                <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Icon (emoji)</label>
                <input type="text" value={formData.icon || ''} onChange={(e) => setFormData({ ...formData, icon: e.target.value })} className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white" placeholder="💳" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Kategoriya</label>
                <select value={formData.category || ''} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white">
                  <option value="">Tanlang...</option>
                  <option value="payment">To'lov tizimlari</option>
                  <option value="crm">CRM</option>
                  <option value="analytics">Analitika</option>
                  <option value="communication">Aloqa</option>
                  <option value="storage">Saqlash</option>
                  <option value="security">Xavfsizlik</option>
                  <option value="other">Boshqa</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tavsif (UZ)</label>
                <textarea value={formData.description_uz || ''} onChange={(e) => setFormData({ ...formData, description_uz: e.target.value })} rows={3} className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Hujjatlar linki</label>
                <input type="url" value={formData.docs_url || ''} onChange={(e) => setFormData({ ...formData, docs_url: e.target.value })} className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white" placeholder="https://..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Holat</label>
                <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value as any })} className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white">
                  <option value="active">Faol</option>
                  <option value="inactive">Nofaol</option>
                  <option value="coming_soon">Tez kunda</option>
                </select>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex gap-3">
              <button onClick={() => setShowModal(false)} className="flex-1 px-4 py-2.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-xl text-sm font-medium">Bekor qilish</button>
              <button onClick={handleSubmit} disabled={!formData.name} className="flex-1 px-4 py-2.5 bg-[#00a6a6] hover:bg-[#008f8f] disabled:opacity-50 text-white rounded-xl text-sm font-medium">Saqlash</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
