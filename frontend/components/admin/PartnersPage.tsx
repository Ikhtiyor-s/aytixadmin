'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { partnersApi, PartnerData } from '@/lib/api/partners'
import { uploadsApi } from '@/lib/api/uploads'
import { Icons } from './Icons'
import { Translations } from '@/lib/admin/translations'

interface PartnersPageProps {
  t: Translations
}

const emptyPartner: PartnerData = {
  name: '',
  logo_url: '',
  website: '',
  description_uz: '',
  description_ru: '',
  description_en: '',
  partner_type: '',
  order: 0,
  status: 'active'
}

export default function PartnersPage({ t }: PartnersPageProps) {
  const { token, loading: authLoading } = useAuth()
  const [partners, setPartners] = useState<PartnerData[]>([])
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [editingPartner, setEditingPartner] = useState<PartnerData | null>(null)
  const [formData, setFormData] = useState<PartnerData>(emptyPartner)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    if (!authLoading && token) loadPartners()
  }, [token, authLoading])

  const loadPartners = async () => {
    try {
      setLoading(true)
      const data = await partnersApi.list(token!)
      setPartners(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async () => {
    try {
      if (editingPartner?.id) {
        await partnersApi.update(editingPartner.id, formData, token!)
      } else {
        await partnersApi.create(formData, token!)
      }
      setShowModal(false)
      setFormData(emptyPartner)
      setEditingPartner(null)
      loadPartners()
    } catch (err) {
      console.error(err)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm(t.deletePartnerConfirm)) return
    try {
      await partnersApi.delete(id, token!)
      loadPartners()
    } catch (err) {
      console.error(err)
    }
  }

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      setUploading(true)
      const result = await uploadsApi.uploadImage(file, token!)
      setFormData({ ...formData, logo_url: result.url })
    } catch (err) {
      console.error(err)
    } finally {
      setUploading(false)
    }
  }

  const openEditModal = (partner: PartnerData) => {
    setEditingPartner(partner)
    setFormData(partner)
    setShowModal(true)
  }

  const openCreateModal = () => {
    setEditingPartner(null)
    setFormData(emptyPartner)
    setShowModal(true)
  }

  const getStatusBadge = (status?: string) => {
    const styles: Record<string, string> = {
      active: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      inactive: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
      pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
    }
    const labels: Record<string, string> = { active: t.active, inactive: t.inactive, pending: t.waitingStatus }
    return <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status || 'active']}`}>{labels[status || 'active']}</span>
  }

  if (authLoading || loading) {
    return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00a6a6]"></div></div>
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">{t.partners}</h1>
          <p className="text-sm text-gray-500">{t.managePartners}</p>
        </div>
        <button onClick={openCreateModal} className="px-4 py-2 bg-[#00a6a6] hover:bg-[#008f8f] text-white rounded-xl text-sm font-medium flex items-center gap-2">
          {Icons.plus} {t.newPartner}
        </button>
      </div>

      {/* Partners Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {partners.length === 0 ? (
          <div className="col-span-full bg-white dark:bg-gray-800 rounded-xl p-8 text-center text-gray-500">{t.noPartners}</div>
        ) : partners.map((partner) => (
          <div key={partner.id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="p-4">
              <div className="flex items-center gap-3 mb-3">
                {partner.logo_url ? (
                  <img src={partner.logo_url} alt={partner.name} className="w-12 h-12 rounded-lg object-contain bg-gray-100 dark:bg-gray-700" />
                ) : (
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#00a6a6] to-[#0a2d5c] flex items-center justify-center text-white font-bold">
                    {partner.name.slice(0, 2).toUpperCase()}
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 dark:text-white">{partner.name}</h3>
                  {partner.partner_type && <p className="text-xs text-gray-500">{partner.partner_type}</p>}
                </div>
                {getStatusBadge(partner.status)}
              </div>
              {partner.description_uz && <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">{partner.description_uz}</p>}
              {partner.website && (
                <a href={partner.website} target="_blank" rel="noopener noreferrer" className="text-sm text-[#00a6a6] hover:underline flex items-center gap-1">
                  {Icons.globe} {partner.website}
                </a>
              )}
            </div>
            <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700/50 flex justify-end gap-2">
              <button onClick={() => openEditModal(partner)} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg text-gray-500">{Icons.edit}</button>
              <button onClick={() => handleDelete(partner.id!)} className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg text-red-500">{Icons.trash}</button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{editingPartner ? t.editPartnerTitle : t.newPartner}</h3>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-500">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t.partnerName} *</label>
                <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t.partnerLogo}</label>
                <div className="flex items-center gap-3">
                  {formData.logo_url && <img src={formData.logo_url} alt="" className="w-16 h-16 rounded-lg object-contain bg-gray-100 dark:bg-gray-700" />}
                  <label className="px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl cursor-pointer text-sm">
                    {uploading ? t.uploading : t.uploadLogo}
                    <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t.partnerWebsite}</label>
                <input type="url" value={formData.website || ''} onChange={(e) => setFormData({ ...formData, website: e.target.value })} className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white" placeholder="https://..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t.partnerType}</label>
                <input type="text" value={formData.partner_type || ''} onChange={(e) => setFormData({ ...formData, partner_type: e.target.value })} className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white" placeholder={t.partnerTypeHint} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t.partnerDescUz}</label>
                <textarea value={formData.description_uz || ''} onChange={(e) => setFormData({ ...formData, description_uz: e.target.value })} rows={3} className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white" />
              </div>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t.partnerOrder}</label>
                  <input type="number" value={formData.order || 0} onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })} className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white" />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t.partnerStatus}</label>
                  <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value as any })} className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white">
                    <option value="active">{t.active}</option>
                    <option value="inactive">{t.inactive}</option>
                    <option value="pending">{t.waitingStatus}</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex gap-3">
              <button onClick={() => setShowModal(false)} className="flex-1 px-4 py-2.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-xl text-sm font-medium">{t.cancel}</button>
              <button onClick={handleSubmit} disabled={!formData.name} className="flex-1 px-4 py-2.5 bg-[#00a6a6] hover:bg-[#008f8f] disabled:opacity-50 text-white rounded-xl text-sm font-medium">{t.save}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
