'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { aiFeaturesApi, AIFeatureData } from '@/lib/api/ai-features'
import { Icons } from './Icons'
import { Translations } from '@/lib/admin/translations'

interface AIPageProps {
  t: Translations
}

const emptyFeature: AIFeatureData = {
  name_uz: '',
  name_ru: '',
  name_en: '',
  description_uz: '',
  description_ru: '',
  description_en: '',
  icon: '',
  category: '',
  is_available: true,
  order: 0
}

const categoryColors: Record<string, string> = {
  chatbot: 'from-blue-500 to-blue-600',
  analytics: 'from-green-500 to-green-600',
  automation: 'from-purple-500 to-purple-600',
  generation: 'from-pink-500 to-pink-600',
  recognition: 'from-orange-500 to-orange-600',
  other: 'from-gray-500 to-gray-600'
}

export default function AIPage({ t }: AIPageProps) {
  const { token, loading: authLoading } = useAuth()
  const [features, setFeatures] = useState<AIFeatureData[]>([])
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [editingFeature, setEditingFeature] = useState<AIFeatureData | null>(null)
  const [formData, setFormData] = useState<AIFeatureData>(emptyFeature)

  useEffect(() => {
    if (!authLoading && token) loadFeatures()
  }, [token, authLoading])

  const loadFeatures = async () => {
    try {
      setLoading(true)
      const data = await aiFeaturesApi.list()
      setFeatures(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async () => {
    try {
      if (editingFeature?.id) {
        await aiFeaturesApi.update(editingFeature.id, formData)
      } else {
        await aiFeaturesApi.create(formData)
      }
      setShowModal(false)
      setFormData(emptyFeature)
      setEditingFeature(null)
      loadFeatures()
    } catch (err) {
      console.error(err)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm(t.deleteAiConfirm)) return
    try {
      await aiFeaturesApi.delete(id)
      loadFeatures()
    } catch (err) {
      console.error(err)
    }
  }

  const openEditModal = (feature: AIFeatureData) => {
    setEditingFeature(feature)
    setFormData(feature)
    setShowModal(true)
  }

  const openCreateModal = () => {
    setEditingFeature(null)
    setFormData(emptyFeature)
    setShowModal(true)
  }

  const availableCount = features.filter(f => f.is_available).length
  const categories = Array.from(new Set(features.map(f => f.category).filter(Boolean))) as string[]

  if (authLoading || loading) {
    return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00a6a6]"></div></div>
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">{t.ai}</h1>
          <p className="text-sm text-gray-500">{t.aiDesc}</p>
        </div>
        <button onClick={openCreateModal} className="px-4 py-2 bg-[#00a6a6] hover:bg-[#008f8f] text-white rounded-xl text-sm font-medium flex items-center gap-2">
          {Icons.plus} {t.newFeature}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#00a6a6] to-[#0a2d5c] flex items-center justify-center text-white mb-2">{Icons.sparkles}</div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{features.length}</p>
          <p className="text-xs text-gray-500">{t.totalFeatures}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white mb-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{availableCount}</p>
          <p className="text-xs text-gray-500">{t.availableStatus}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center text-white mb-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{features.length - availableCount}</p>
          <p className="text-xs text-gray-500">{t.comingSoon}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white mb-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{categories.length}</p>
          <p className="text-xs text-gray-500">{t.categories}</p>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {features.length === 0 ? (
          <div className="col-span-full bg-white dark:bg-gray-800 rounded-xl p-8 text-center text-gray-500">{t.noAiFeatures}</div>
        ) : features.map((feature) => (
          <div key={feature.id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="p-4">
              <div className="flex items-start gap-3 mb-3">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${categoryColors[feature.category || 'other']} flex items-center justify-center text-2xl text-white`}>
                  {feature.icon || '🤖'}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-gray-900 dark:text-white">{feature.name_uz}</h3>
                    {feature.is_available ? (
                      <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">{t.availableStatus}</span>
                    ) : (
                      <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">{t.comingSoon}</span>
                    )}
                  </div>
                  {feature.category && <p className="text-xs text-gray-500 mt-0.5">{feature.category}</p>}
                </div>
              </div>
              {feature.description_uz && <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">{feature.description_uz}</p>}
            </div>
            <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700/50 flex justify-end gap-2">
              <button onClick={() => openEditModal(feature)} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg text-gray-500">{Icons.edit}</button>
              <button onClick={() => handleDelete(feature.id!)} className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg text-red-500">{Icons.trash}</button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{editingFeature ? t.editFeatureTitle : t.newAiFeature}</h3>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-500">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t.nameUzRequired}</label>
                <input type="text" value={formData.name_uz} onChange={(e) => setFormData({ ...formData, name_uz: e.target.value })} className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t.nameRuLabel}</label>
                  <input type="text" value={formData.name_ru || ''} onChange={(e) => setFormData({ ...formData, name_ru: e.target.value })} className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t.nameEnLabel}</label>
                  <input type="text" value={formData.name_en || ''} onChange={(e) => setFormData({ ...formData, name_en: e.target.value })} className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t.iconEmoji}</label>
                <input type="text" value={formData.icon || ''} onChange={(e) => setFormData({ ...formData, icon: e.target.value })} className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white" placeholder="🤖" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t.category}</label>
                <select value={formData.category || ''} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white">
                  <option value="">{t.select}...</option>
                  <option value="chatbot">{t.chatbotOption}</option>
                  <option value="analytics">{t.analyticsOption}</option>
                  <option value="automation">{t.automationOption}</option>
                  <option value="generation">{t.generationOption}</option>
                  <option value="recognition">{t.recognitionOption}</option>
                  <option value="other">{t.otherOption}</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t.descriptionUz}</label>
                <textarea value={formData.description_uz || ''} onChange={(e) => setFormData({ ...formData, description_uz: e.target.value })} rows={3} className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white" />
              </div>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t.order}</label>
                  <input type="number" value={formData.order || 0} onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })} className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white" />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t.status}</label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={formData.is_available} onChange={(e) => setFormData({ ...formData, is_available: e.target.checked })} className="w-5 h-5 rounded text-[#00a6a6]" />
                    <span className="text-sm text-gray-600 dark:text-gray-300">{t.availableStatus}</span>
                  </label>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex gap-3">
              <button onClick={() => setShowModal(false)} className="flex-1 px-4 py-2.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-xl text-sm font-medium">{t.cancel}</button>
              <button onClick={handleSubmit} disabled={!formData.name_uz} className="flex-1 px-4 py-2.5 bg-[#00a6a6] hover:bg-[#008f8f] disabled:opacity-50 text-white rounded-xl text-sm font-medium">{t.save}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
