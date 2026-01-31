'use client'

import { useState, useEffect } from 'react'
import Cookies from 'js-cookie'
import { Icons } from './Icons'
import { Translations } from '@/lib/admin/translations'
import { footerApi, FooterContact, CONTACT_TYPE_ICONS } from '@/lib/api/footer'

interface ContactsPageProps {
  t: Translations
  globalSearch: string
  lang: 'uz' | 'ru' | 'en'
}

export default function ContactsPage({ t, globalSearch, lang }: ContactsPageProps) {
  const [contacts, setContacts] = useState<FooterContact[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingContact, setEditingContact] = useState<FooterContact | null>(null)
  const [saving, setSaving] = useState(false)

  const [formData, setFormData] = useState<{
    contact_type: 'phone' | 'email' | 'address' | 'telegram' | 'whatsapp'
    label_uz: string
    label_ru: string
    label_en: string
    value: string
    link_url: string
    icon: string
    is_active: boolean
  }>({
    contact_type: 'phone',
    label_uz: '',
    label_ru: '',
    label_en: '',
    value: '',
    link_url: '',
    icon: '',
    is_active: true
  })

  const getToken = () => Cookies.get('token') || ''

  const loadContacts = async () => {
    try {
      setLoading(true)
      const token = getToken()
      if (!token) {
        alert(t.pleaseReLogin)
        return
      }
      const data = await footerApi.getContacts(token)
      setContacts(data)
    } catch (error) {
      console.error('Error loading contacts:', error)
      alert('Kontaktlarni yuklashda xatolik')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadContacts()
  }, [])

  const openAddModal = () => {
    setEditingContact(null)
    setFormData({
      contact_type: 'phone',
      label_uz: '',
      label_ru: '',
      label_en: '',
      value: '',
      link_url: '',
      icon: CONTACT_TYPE_ICONS.phone,
      is_active: true
    })
    setShowModal(true)
  }

  const openEditModal = (contact: FooterContact) => {
    setEditingContact(contact)
    setFormData({
      contact_type: contact.contact_type,
      label_uz: contact.label_uz || '',
      label_ru: contact.label_ru || '',
      label_en: contact.label_en || '',
      value: contact.value,
      link_url: contact.link_url || '',
      icon: contact.icon || CONTACT_TYPE_ICONS[contact.contact_type] || '',
      is_active: contact.is_active !== false
    })
    setShowModal(true)
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      const token = getToken()
      if (!token) {
        alert(t.pleaseReLogin)
        return
      }

      if (!formData.value.trim()) {
        alert('Qiymatni kiriting!')
        setSaving(false)
        return
      }

      const contactData = {
        contact_type: formData.contact_type,
        label_uz: formData.label_uz || undefined,
        label_ru: formData.label_ru || undefined,
        label_en: formData.label_en || undefined,
        value: formData.value,
        link_url: formData.link_url || undefined,
        icon: formData.icon || CONTACT_TYPE_ICONS[formData.contact_type],
        is_active: formData.is_active
      }

      if (editingContact?.id) {
        await footerApi.updateContact(editingContact.id, contactData, token)
        alert('✅ Kontakt muvaffaqiyatli yangilandi!')
      } else {
        await footerApi.createContact(contactData, token)
        alert('✅ Kontakt muvaffaqiyatli qo\'shildi!')
      }

      setShowModal(false)
      loadContacts()
    } catch (error) {
      console.error('Error saving contact:', error)
      alert(error instanceof Error ? error.message : 'Saqlashda xatolik')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Rostdan ham o\'chirmoqchimisiz?')) return

    try {
      const token = getToken()
      if (!token) {
        alert(t.pleaseReLogin)
        return
      }

      await footerApi.deleteContact(id, token)
      alert('✅ Kontakt o\'chirildi!')
      loadContacts()
    } catch (error) {
      console.error('Error deleting contact:', error)
      alert('O\'chirishda xatolik')
    }
  }

  const handleTypeChange = (type: 'phone' | 'email' | 'address' | 'telegram' | 'whatsapp') => {
    setFormData({
      ...formData,
      contact_type: type,
      icon: CONTACT_TYPE_ICONS[type] || ''
    })
  }

  const filteredContacts = contacts.filter(contact => {
    if (!globalSearch) return true
    const search = globalSearch.toLowerCase()
    return (
      contact.value.toLowerCase().includes(search) ||
      contact.label_uz?.toLowerCase().includes(search) ||
      contact.label_ru?.toLowerCase().includes(search) ||
      contact.label_en?.toLowerCase().includes(search)
    )
  })

  const getContactTypeLabel = (type: string) => {
    const labels = {
      phone: '📞 Telefon',
      email: '📧 Email',
      address: '📍 Manzil',
      telegram: '✈️ Telegram',
      whatsapp: '💬 WhatsApp'
    }
    return labels[type as keyof typeof labels] || type
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            📞 Aloqa ma'lumotlari
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Telefon, email, manzil va boshqa aloqa ma'lumotlarini boshqaring
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="px-4 py-2.5 bg-gradient-to-r from-[#00a6a6] to-[#0a2d5c] text-white rounded-xl hover:shadow-lg transition-all flex items-center gap-2"
        >
          {Icons.plus}
          <span className="font-medium">Kontakt qo'shish</span>
        </button>
      </div>

      {/* Contacts Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00a6a6]"></div>
        </div>
      ) : filteredContacts.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">📞</div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Kontaktlar topilmadi
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Yangi kontakt qo'shish uchun yuqoridagi tugmani bosing
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredContacts.map(contact => (
            <div
              key={contact.id}
              className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 hover:shadow-lg transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">
                    {contact.contact_type === 'phone' && '📞'}
                    {contact.contact_type === 'email' && '📧'}
                    {contact.contact_type === 'address' && '📍'}
                    {contact.contact_type === 'telegram' && '✈️'}
                    {contact.contact_type === 'whatsapp' && '💬'}
                  </div>
                  <div>
                    <div className="text-xs font-medium text-gray-500 dark:text-gray-400">
                      {getContactTypeLabel(contact.contact_type)}
                    </div>
                    {contact.label_uz && (
                      <div className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                        {contact.label_uz}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditModal(contact)}
                    className="p-1.5 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg text-blue-600"
                    title="Tahrirlash"
                  >
                    {Icons.edit}
                  </button>
                  <button
                    onClick={() => contact.id && handleDelete(contact.id)}
                    className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-red-600"
                    title="O'chirish"
                  >
                    {Icons.trash}
                  </button>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                <div className="text-sm font-medium text-gray-900 dark:text-white break-all">
                  {contact.value}
                </div>
                {contact.link_url && (
                  <a
                    href={contact.link_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:underline mt-1 inline-block"
                  >
                    Havolaga o'tish →
                  </a>
                )}
              </div>

              <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                <span className={`px-2 py-0.5 rounded-md text-xs font-medium ${
                  contact.is_active !== false
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                    : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400'
                }`}>
                  {contact.is_active !== false ? 'Faol' : 'Faol emas'}
                </span>
                {contact.order !== undefined && (
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    #{contact.order}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {editingContact ? 'Kontaktni tahrirlash' : 'Yangi kontakt qo\'shish'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                {Icons.close}
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Contact Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Kontakt turi *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {(['phone', 'email', 'address', 'telegram', 'whatsapp'] as const).map(type => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => handleTypeChange(type)}
                      className={`p-3 rounded-xl border-2 transition-all text-center ${
                        formData.contact_type === type
                          ? 'border-[#00a6a6] bg-[#00a6a6]/10 dark:bg-[#00a6a6]/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-2xl mb-1">
                        {type === 'phone' && '📞'}
                        {type === 'email' && '📧'}
                        {type === 'address' && '📍'}
                        {type === 'telegram' && '✈️'}
                        {type === 'whatsapp' && '💬'}
                      </div>
                      <div className="text-xs font-medium text-gray-700 dark:text-gray-300">
                        {getContactTypeLabel(type).split(' ')[1]}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Value */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Qiymat * {formData.contact_type === 'phone' && '(+998901234567)'}
                  {formData.contact_type === 'email' && '(example@mail.com)'}
                </label>
                <input
                  type={formData.contact_type === 'email' ? 'email' : 'text'}
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-[#00a6a6]"
                  placeholder={
                    formData.contact_type === 'phone' ? '+998901234567' :
                    formData.contact_type === 'email' ? 'info@example.com' :
                    formData.contact_type === 'address' ? 'Toshkent, O\'zbekiston' :
                    formData.contact_type === 'telegram' ? '@username' :
                    '+998901234567'
                  }
                />
              </div>

              {/* Link URL */}
              {(formData.contact_type === 'telegram' || formData.contact_type === 'whatsapp') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Havola URL
                  </label>
                  <input
                    type="url"
                    value={formData.link_url}
                    onChange={(e) => setFormData({ ...formData, link_url: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-[#00a6a6]"
                    placeholder={
                      formData.contact_type === 'telegram' ? 'https://t.me/username' :
                      'https://wa.me/998901234567'
                    }
                  />
                </div>
              )}

              {/* Labels - 3 languages */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Yorliq (ixtiyoriy)
                </label>
                <input
                  type="text"
                  value={formData.label_uz}
                  onChange={(e) => setFormData({ ...formData, label_uz: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-[#00a6a6]"
                  placeholder="O'zbekcha yorliq (masalan: Qo'ng'iroq markazi)"
                />
                <input
                  type="text"
                  value={formData.label_ru}
                  onChange={(e) => setFormData({ ...formData, label_ru: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-[#00a6a6]"
                  placeholder="Русская метка (например: Колл-центр)"
                />
                <input
                  type="text"
                  value={formData.label_en}
                  onChange={(e) => setFormData({ ...formData, label_en: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-[#00a6a6]"
                  placeholder="English label (e.g: Call center)"
                />
              </div>

              {/* Active toggle */}
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Faol
                </span>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, is_active: !formData.is_active })}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    formData.is_active ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                >
                  <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    formData.is_active ? 'translate-x-6' : 'translate-x-0'
                  }`} />
                </button>
              </div>
            </div>

            <div className="sticky bottom-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-6 py-4 flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 font-medium"
              >
                Bekor qilish
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 px-4 py-2.5 bg-gradient-to-r from-[#00a6a6] to-[#0a2d5c] text-white rounded-xl hover:shadow-lg transition-all font-medium disabled:opacity-50"
              >
                {saving ? 'Saqlanmoqda...' : 'Saqlash'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
