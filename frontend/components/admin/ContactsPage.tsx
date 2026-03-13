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
  const [error, setError] = useState<string | null>(null)
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

  const getToken = () => Cookies.get('access_token') || ''

  const loadContacts = async () => {
    try {
      setLoading(true)
      setError(null)
      const token = getToken()
      if (!token) {
        setError('Token topilmadi. Iltimos, qayta login qiling.')
        window.location.href = '/admin/login'
        return
      }
      const data = await footerApi.getContacts(token)
      setContacts(data)
      setError(null)
    } catch (error: any) {
      console.error('Error loading contacts:', error)
      const errorMessage = error.response?.data?.detail || error.message || t.contactsLoadError
      setError(errorMessage)
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
        alert(t.enterValue)
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
      alert(error instanceof Error ? error.message : t.saveError)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm(t.deleteConfirm)) return

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
      alert(t.deleteError)
    }
  }

  const handleMoveUp = async (index: number) => {
    if (index === 0) return // Already at top

    const newContacts = [...filteredContacts]
    const temp = newContacts[index]
    newContacts[index] = newContacts[index - 1]
    newContacts[index - 1] = temp

    await saveNewOrder(newContacts)
  }

  const handleMoveDown = async (index: number) => {
    if (index === filteredContacts.length - 1) return // Already at bottom

    const newContacts = [...filteredContacts]
    const temp = newContacts[index]
    newContacts[index] = newContacts[index + 1]
    newContacts[index + 1] = temp

    await saveNewOrder(newContacts)
  }

  const saveNewOrder = async (newContacts: FooterContact[]) => {
    try {
      const token = getToken()
      if (!token) {
        alert(t.pleaseReLogin)
        return
      }

      // Update order values
      const reorderData = newContacts.map((contact, index) => ({
        id: contact.id!,
        order: index
      }))

      await footerApi.reorderContacts(reorderData, token)
      loadContacts()
    } catch (error) {
      console.error('Error reordering contacts:', error)
      alert(t.orderUpdateError)
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
      phone: `📞 ${t.phoneType}`,
      email: `📧 ${t.emailType}`,
      address: `📍 ${t.addressType}`,
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
            📞 {t.contactInfo}
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {t.contactInfoDesc}
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="px-4 py-2.5 bg-gradient-to-r from-[#00a6a6] to-[#0a2d5c] text-white rounded-xl hover:shadow-lg transition-all flex items-center gap-2"
        >
          {Icons.plus}
          <span className="font-medium">{t.addContact}</span>
        </button>
      </div>

      {/* Contacts Grid */}
      {error ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="bg-red-100 dark:bg-red-900/30 rounded-full p-6 mb-4">
            <svg className="w-12 h-12 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            {t.errorOccurred}
          </h3>
          <p className="text-red-600 dark:text-red-400 text-center max-w-md mb-4 px-4">
            {error}
          </p>
          <button
            onClick={loadContacts}
            className="px-6 py-2 bg-[#00a6a6] text-white rounded-lg hover:bg-[#0a2d5c] transition-colors font-medium"
          >
            {t.retryAgain}
          </button>
        </div>
      ) : loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00a6a6] mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">{t.loadingContacts}</p>
        </div>
      ) : filteredContacts.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">📞</div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            {t.noContactsFound}
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            {t.clickAddContact}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredContacts.map((contact, index) => (
            <div
              key={contact.id}
              className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-all duration-300 group"
            >
              {/* Header with icon and actions */}
              <div className="bg-gradient-to-r from-[#00a6a6]/10 to-[#0a2d5c]/10 dark:from-[#00a6a6]/20 dark:to-[#0a2d5c]/20 p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {/* SVG Icon */}
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    contact.contact_type === 'phone' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' :
                    contact.contact_type === 'email' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400' :
                    contact.contact_type === 'telegram' ? 'bg-sky-100 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400' :
                    contact.contact_type === 'whatsapp' ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' :
                    'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                  }`}>
                    {contact.contact_type === 'phone' && (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    )}
                    {contact.contact_type === 'email' && (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    )}
                    {contact.contact_type === 'address' && (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    )}
                    {contact.contact_type === 'telegram' && (
                      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18 1.897-.962 6.502-1.359 8.627-.168.9-.5 1.201-.82 1.23-.697.064-1.226-.461-1.901-.903-1.056-.693-1.653-1.124-2.678-1.8-1.185-.781-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.139-5.062 3.345-.479.329-.913.489-1.302.481-.428-.008-1.252-.241-1.865-.44-.752-.244-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.831-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635.099-.002.321.023.465.141.122.1.156.235.172.331.016.095.036.313.02.481z"/>
                      </svg>
                    )}
                    {contact.contact_type === 'whatsapp' && (
                      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                    )}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">
                      {getContactTypeLabel(contact.contact_type)}
                    </div>
                    {contact.label_uz && (
                      <div className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                        {contact.label_uz}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {/* Up/Down buttons */}
                  <button
                    onClick={() => handleMoveUp(index)}
                    disabled={index === 0}
                    className={`p-2 hover:bg-white/50 dark:hover:bg-gray-700/50 rounded-lg transition-colors ${
                      index === 0
                        ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
                        : 'text-gray-600 dark:text-gray-400'
                    }`}
                    title={t.moveUp}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleMoveDown(index)}
                    disabled={index === filteredContacts.length - 1}
                    className={`p-2 hover:bg-white/50 dark:hover:bg-gray-700/50 rounded-lg transition-colors ${
                      index === filteredContacts.length - 1
                        ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
                        : 'text-gray-600 dark:text-gray-400'
                    }`}
                    title={t.moveDown}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <div className="w-px h-6 bg-gray-200 dark:bg-gray-600 mx-1"></div>
                  <button
                    onClick={() => openEditModal(contact)}
                    className="p-2 hover:bg-white/50 dark:hover:bg-gray-700/50 rounded-lg text-gray-600 dark:text-gray-400 transition-colors"
                    title={t.edit}
                  >
                    {Icons.edit}
                  </button>
                  <button
                    onClick={() => contact.id && handleDelete(contact.id)}
                    className="p-2 hover:bg-white/50 dark:hover:bg-gray-700/50 rounded-lg text-red-600 dark:text-red-400 transition-colors"
                    title={t.delete}
                  >
                    {Icons.trash}
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                  <div className="text-base font-medium text-gray-900 dark:text-white break-all">
                    {(contact.contact_type === 'phone' || contact.contact_type === 'whatsapp') && contact.value
                      ? contact.value.replace(/^\+?998\s?/, '+998 ').replace(/^\+998\s?(\d{2})(\d{3})(\d{2})(\d{2})$/, '+998 $1 $2 $3 $4')
                      : contact.value}
                  </div>
                  {contact.link_url && (
                    <a
                      href={contact.link_url}
                      {...(contact.contact_type === 'telegram' || contact.contact_type === 'whatsapp' || contact.contact_type === 'address' ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                      className="inline-flex items-center gap-1 text-sm text-[#00a6a6] hover:text-[#0a2d5c] dark:hover:text-[#00a6a6] mt-2 font-medium transition-colors group/link"
                    >
                      {contact.contact_type === 'phone' ? t.callPhone :
                       contact.contact_type === 'email' ? t.sendEmail :
                       contact.contact_type === 'telegram' ? t.writeTelegram :
                       contact.contact_type === 'whatsapp' ? t.writeWhatsApp :
                       t.goToLink}
                      <svg className="w-4 h-4 group-hover/link:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  )}
                </div>

                <div className="flex items-center justify-between mt-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    contact.is_active !== false
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                      : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400'
                  }`}>
                    {contact.is_active !== false ? `✓ ${t.activeStatus}` : `○ ${t.inactiveStatus}`}
                  </span>
                  {contact.order !== undefined && (
                    <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                      #{contact.order}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => { setShowModal(false); setEditingContact(null) }}
        >
          <div
            className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {editingContact ? t.editContact : t.addContact}
              </h2>
              <button
                onClick={() => { setShowModal(false); setEditingContact(null) }}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                title={t.close}
              >
                {Icons.close}
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Contact Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t.contactType} *
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
                      <div className="mb-1 flex justify-center">
                        {type === 'phone' && (
                          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                        )}
                        {type === 'email' && (
                          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        )}
                        {type === 'address' && (
                          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        )}
                        {type === 'telegram' && (
                          <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18 1.897-.962 6.502-1.359 8.627-.168.9-.5 1.201-.82 1.23-.697.064-1.226-.461-1.901-.903-1.056-.693-1.653-1.124-2.678-1.8-1.185-.781-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.139-5.062 3.345-.479.329-.913.489-1.302.481-.428-.008-1.252-.241-1.865-.44-.752-.244-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.831-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635.099-.002.321.023.465.141.122.1.156.235.172.331.016.095.036.313.02.481z"/>
                          </svg>
                        )}
                        {type === 'whatsapp' && (
                          <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                          </svg>
                        )}
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
                  {t.contactValue} * {formData.contact_type === 'phone' && '(+998 XX XXX XX XX)'}
                  {formData.contact_type === 'whatsapp' && '(+998 XX XXX XX XX)'}
                  {formData.contact_type === 'email' && '(example@mail.com)'}
                </label>
                {(formData.contact_type === 'phone' || formData.contact_type === 'whatsapp') ? (
                  <div className="flex items-center gap-0">
                    <span className="px-3 py-2.5 bg-gray-100 dark:bg-gray-700 border border-r-0 border-gray-200 dark:border-gray-700 rounded-l-xl text-gray-700 dark:text-gray-300 text-sm font-medium select-none">
                      +998
                    </span>
                    <input
                      type="tel"
                      value={formData.value.replace(/^\+?998\s?/, '').replace(/[^\d]/g, '').replace(/(\d{2})(\d{3})?(\d{2})?(\d{2})?/, (_, a, b, c, d) => [a, b, c, d].filter(Boolean).join(' '))}
                      onChange={(e) => {
                        const digits = e.target.value.replace(/[^\d]/g, '').slice(0, 9)
                        const formatted = digits.replace(/(\d{2})(\d{3})?(\d{2})?(\d{2})?/, (_, a, b, c, d) => [a, b, c, d].filter(Boolean).join(' '))
                        setFormData({ ...formData, value: '+998' + digits })
                      }}
                      className="flex-1 px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-r-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-[#00a6a6] tracking-wider"
                      placeholder="90 123 45 67"
                      maxLength={12}
                    />
                  </div>
                ) : (
                  <input
                    type={formData.contact_type === 'email' ? 'email' : 'text'}
                    value={formData.value}
                    onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-[#00a6a6]"
                    placeholder={
                      formData.contact_type === 'email' ? 'info@example.com' :
                      formData.contact_type === 'address' ? 'Toshkent, O\'zbekiston' :
                      formData.contact_type === 'telegram' ? '@username' :
                      'Qiymatni kiriting'
                    }
                  />
                )}
              </div>

              {/* Link URL */}
              {(formData.contact_type === 'telegram' || formData.contact_type === 'whatsapp') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t.contactLinkUrl}
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
                  {t.contactLabel}
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
                  {t.activeStatus}
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
                onClick={() => { setShowModal(false); setEditingContact(null) }}
                className="flex-1 px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 font-medium transition-colors"
              >
                {t.cancel}
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 px-4 py-2.5 bg-gradient-to-r from-[#00a6a6] to-[#0a2d5c] text-white rounded-xl hover:shadow-lg transition-all font-medium disabled:opacity-50"
              >
                {saving ? t.saving : t.save}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
