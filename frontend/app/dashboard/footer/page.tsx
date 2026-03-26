'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  footerApi,
  FooterSection,
  FooterItem,
  FooterSocialLink,
  FooterContact,
  PLATFORM_ICONS,
  CONTACT_TYPE_ICONS
} from '@/lib/api/footer'

// Tab types
type TabType = 'sections' | 'social' | 'contacts'

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

// Contact type options
const CONTACT_TYPES = [
  { value: 'phone', label: 'Telefon' },
  { value: 'email', label: 'Email' },
  { value: 'address', label: 'Manzil' },
  { value: 'telegram', label: 'Telegram' },
  { value: 'whatsapp', label: 'WhatsApp' },
]

export default function FooterPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<TabType>('sections')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Data states
  const [sections, setSections] = useState<FooterSection[]>([])
  const [socialLinks, setSocialLinks] = useState<FooterSocialLink[]>([])
  const [contacts, setContacts] = useState<FooterContact[]>([])

  // Selected states
  const [selectedSection, setSelectedSection] = useState<FooterSection | null>(null)
  const [selectedItem, setSelectedItem] = useState<FooterItem | null>(null)
  const [selectedSocialLink, setSelectedSocialLink] = useState<FooterSocialLink | null>(null)
  const [selectedContact, setSelectedContact] = useState<FooterContact | null>(null)

  // Modal states
  const [showSectionModal, setShowSectionModal] = useState(false)
  const [showItemModal, setShowItemModal] = useState(false)
  const [showSocialModal, setShowSocialModal] = useState(false)
  const [showContactModal, setShowContactModal] = useState(false)

  // Form states
  const [sectionForm, setSectionForm] = useState<Partial<FooterSection>>({
    title_uz: '', title_ru: '', title_en: '', slug: '', order: 0, is_active: true
  })
  const [itemForm, setItemForm] = useState<Partial<FooterItem>>({
    section_id: 0, title_uz: '', title_ru: '', title_en: '', link_url: '',
    icon: '', icon_type: 'fontawesome', new_tab: false, order: 0, is_active: true
  })
  const [socialForm, setSocialForm] = useState<Partial<FooterSocialLink>>({
    platform: 'telegram', link_url: '', order: 0, is_active: true
  })
  const [contactForm, setContactForm] = useState<Partial<FooterContact>>({
    contact_type: 'phone', value: '', order: 0, is_active: true
  })

  // Load data
  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const [sectionsData, socialData, contactsData] = await Promise.all([
        footerApi.getSections(),
        footerApi.getSocialLinks(),
        footerApi.getContacts()
      ])
      setSections(sectionsData)
      setSocialLinks(socialData)
      setContacts(contactsData)
    } catch (error) {
      console.error('Ma\'lumotlarni yuklashda xatolik:', error)
    } finally {
      setLoading(false)
    }
  }

  const getToken = () => localStorage.getItem('access_token') || ''

  // ============== SECTION HANDLERS ==============
  const handleCreateSection = async () => {
    setSaving(true)
    try {
      await footerApi.createSection(sectionForm as any)
      await loadData()
      setShowSectionModal(false)
      resetSectionForm()
    } catch (error: any) {
      alert(error.message)
    } finally {
      setSaving(false)
    }
  }

  const handleUpdateSection = async () => {
    if (!selectedSection?.id) return
    setSaving(true)
    try {
      await footerApi.updateSection(selectedSection.id, sectionForm)
      await loadData()
      setShowSectionModal(false)
      setSelectedSection(null)
      resetSectionForm()
    } catch (error: any) {
      alert(error.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteSection = async (id: number) => {
    if (!confirm('Bu bo\'limni o\'chirishni xohlaysizmi? Barcha elementlar ham o\'chiriladi.')) return
    try {
      await footerApi.deleteSection(id)
      await loadData()
      if (selectedSection?.id === id) setSelectedSection(null)
    } catch (error: any) {
      alert(error.message)
    }
  }

  const handleToggleSection = async (id: number, is_active: boolean) => {
    try {
      await footerApi.updateSection(id, { is_active: !is_active })
      await loadData()
    } catch (error: any) { alert(error.message) }
  }

  const resetSectionForm = () => {
    setSectionForm({ title_uz: '', title_ru: '', title_en: '', slug: '', order: 0, is_active: true })
  }

  // ============== ITEM HANDLERS ==============
  const handleCreateItem = async () => {
    if (!selectedSection?.id) return
    setSaving(true)
    try {
      await footerApi.createItem({ ...itemForm, section_id: selectedSection.id } as any)
      await loadData()
      setShowItemModal(false)
      resetItemForm()
    } catch (error: any) {
      alert(error.message)
    } finally {
      setSaving(false)
    }
  }

  const handleUpdateItem = async () => {
    if (!selectedItem?.id) return
    setSaving(true)
    try {
      await footerApi.updateItem(selectedItem.id, itemForm)
      await loadData()
      setShowItemModal(false)
      setSelectedItem(null)
      resetItemForm()
    } catch (error: any) {
      alert(error.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteItem = async (id: number) => {
    if (!confirm('Bu elementni o\'chirishni xohlaysizmi?')) return
    try {
      await footerApi.deleteItem(id)
      await loadData()
    } catch (error: any) {
      alert(error.message)
    }
  }

  const handleToggleItem = async (id: number, is_active: boolean) => {
    try {
      await footerApi.updateItem(id, { is_active: !is_active })
      await loadData()
    } catch (error: any) { alert(error.message) }
  }

  const resetItemForm = () => {
    setItemForm({
      section_id: 0, title_uz: '', title_ru: '', title_en: '', link_url: '',
      icon: '', icon_type: 'fontawesome', new_tab: false, order: 0, is_active: true
    })
  }

  // ============== SOCIAL LINK HANDLERS ==============
  const handleCreateSocialLink = async () => {
    setSaving(true)
    try {
      await footerApi.createSocialLink(socialForm as any)
      await loadData()
      setShowSocialModal(false)
      resetSocialForm()
    } catch (error: any) {
      alert(error.message)
    } finally {
      setSaving(false)
    }
  }

  const handleUpdateSocialLink = async () => {
    if (!selectedSocialLink?.id) return
    setSaving(true)
    try {
      await footerApi.updateSocialLink(selectedSocialLink.id, socialForm)
      await loadData()
      setShowSocialModal(false)
      setSelectedSocialLink(null)
      resetSocialForm()
    } catch (error: any) {
      alert(error.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteSocialLink = async (id: number) => {
    if (!confirm('Bu ijtimoiy tarmoqni o\'chirishni xohlaysizmi?')) return
    try {
      await footerApi.deleteSocialLink(id)
      await loadData()
    } catch (error: any) {
      alert(error.message)
    }
  }

  const handleToggleSocialLink = async (id: number, is_active: boolean) => {
    try {
      await footerApi.updateSocialLink(id, { is_active: !is_active })
      await loadData()
    } catch (error: any) { alert(error.message) }
  }

  const resetSocialForm = () => {
    setSocialForm({ platform: 'telegram', link_url: '', order: 0, is_active: true })
  }

  // ============== CONTACT HANDLERS ==============
  const handleCreateContact = async () => {
    setSaving(true)
    try {
      await footerApi.createContact(contactForm as any)
      await loadData()
      setShowContactModal(false)
      resetContactForm()
    } catch (error: any) {
      alert(error.message)
    } finally {
      setSaving(false)
    }
  }

  const handleUpdateContact = async () => {
    if (!selectedContact?.id) return
    setSaving(true)
    try {
      await footerApi.updateContact(selectedContact.id, contactForm)
      await loadData()
      setShowContactModal(false)
      setSelectedContact(null)
      resetContactForm()
    } catch (error: any) {
      alert(error.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteContact = async (id: number) => {
    if (!confirm('Bu kontaktni o\'chirishni xohlaysizmi?')) return
    try {
      await footerApi.deleteContact(id)
      await loadData()
    } catch (error: any) {
      alert(error.message)
    }
  }

  const handleToggleContact = async (id: number, is_active: boolean) => {
    try {
      await footerApi.updateContact(id, { is_active: !is_active })
      await loadData()
    } catch (error: any) { alert(error.message) }
  }

  const resetContactForm = () => {
    setContactForm({ contact_type: 'phone', value: '', order: 0, is_active: true })
  }

  // Edit handlers
  const openEditSection = (section: FooterSection) => {
    setSelectedSection(section)
    setSectionForm({
      title_uz: section.title_uz,
      title_ru: section.title_ru || '',
      title_en: section.title_en || '',
      slug: section.slug,
      order: section.order,
      is_active: section.is_active
    })
    setShowSectionModal(true)
  }

  const openEditItem = (item: FooterItem) => {
    setSelectedItem(item)
    setItemForm({
      section_id: item.section_id,
      title_uz: item.title_uz,
      title_ru: item.title_ru || '',
      title_en: item.title_en || '',
      link_url: item.link_url || '',
      icon: item.icon || '',
      icon_type: item.icon_type || 'fontawesome',
      new_tab: item.new_tab,
      order: item.order,
      is_active: item.is_active
    })
    setShowItemModal(true)
  }

  const openEditSocialLink = (link: FooterSocialLink) => {
    setSelectedSocialLink(link)
    setSocialForm({
      platform: link.platform,
      title_uz: link.title_uz || '',
      title_ru: link.title_ru || '',
      title_en: link.title_en || '',
      link_url: link.link_url,
      icon: link.icon || '',
      order: link.order,
      is_active: link.is_active
    })
    setShowSocialModal(true)
  }

  const openEditContact = (contact: FooterContact) => {
    setSelectedContact(contact)
    setContactForm({
      contact_type: contact.contact_type,
      label_uz: contact.label_uz || '',
      label_ru: contact.label_ru || '',
      label_en: contact.label_en || '',
      value: contact.value,
      link_url: contact.link_url || '',
      icon: contact.icon || '',
      order: contact.order,
      is_active: contact.is_active
    })
    setShowContactModal(true)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Footer Boshqaruvi</h1>
          <p className="text-gray-500 mt-1">Sayt pastki qismidagi ma'lumotlarni boshqaring</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex gap-4">
          {[
            { id: 'sections', label: 'Bo\'limlar', icon: '📂' },
            { id: 'social', label: 'Ijtimoiy Tarmoqlar', icon: '🌐' },
            { id: 'contacts', label: 'Kontaktlar', icon: '📞' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        {/* SECTIONS TAB */}
        {activeTab === 'sections' && (
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">Footer Bo'limlari</h2>
              <button
                onClick={() => { resetSectionForm(); setSelectedSection(null); setShowSectionModal(true) }}
                className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
              >
                + Yangi Bo'lim
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Sections list */}
              <div className="space-y-4">
                <h3 className="font-medium text-gray-700">Bo'limlar ro'yxati</h3>
                {sections.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">Hozircha bo'lim yo'q</p>
                ) : (
                  sections.map((section) => (
                    <div
                      key={section.id}
                      onClick={() => setSelectedSection(section)}
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${
                        selectedSection?.id === section.id
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">{section.title_uz}</h4>
                          <p className="text-sm text-gray-500">/{section.slug}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => { e.stopPropagation(); handleToggleSection(section.id!, section.is_active) }}
                            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                              section.is_active ? 'bg-green-500' : 'bg-gray-300'
                            }`}
                            title={section.is_active ? 'Nofaol qilish' : 'Faollashtirish'}
                          >
                            <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${
                              section.is_active ? 'translate-x-4' : 'translate-x-1'
                            }`} />
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); openEditSection(section) }}
                            className="p-1 text-gray-500 hover:text-primary-500"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleDeleteSection(section.id!) }}
                            className="p-1 text-gray-500 hover:text-red-500"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                      <p className="text-xs text-gray-400 mt-2">
                        {section.items?.length || 0} ta element
                      </p>
                    </div>
                  ))
                )}
              </div>

              {/* Section items */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-gray-700">
                    {selectedSection ? `"${selectedSection.title_uz}" elementlari` : 'Bo\'limni tanlang'}
                  </h3>
                  {selectedSection && (
                    <button
                      onClick={() => { resetItemForm(); setSelectedItem(null); setShowItemModal(true) }}
                      className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                    >
                      + Element
                    </button>
                  )}
                </div>
                {selectedSection ? (
                  selectedSection.items && selectedSection.items.length > 0 ? (
                    <div className="space-y-2">
                      {selectedSection.items.map((item) => (
                        <div
                          key={item.id}
                          className="p-3 border border-gray-200 rounded-lg flex items-center justify-between"
                        >
                          <div className="flex items-center gap-3">
                            {item.icon && (
                              <span className="text-gray-400">
                                <i className={item.icon}></i>
                              </span>
                            )}
                            <div>
                              <p className="font-medium text-sm">{item.title_uz}</p>
                              {item.link_url && (
                                <p className="text-xs text-gray-500">{item.link_url}</p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleToggleItem(item.id!, item.is_active)}
                              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                                item.is_active ? 'bg-green-500' : 'bg-gray-300'
                              }`}
                              title={item.is_active ? 'Nofaol qilish' : 'Faollashtirish'}
                            >
                              <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${
                                item.is_active ? 'translate-x-4' : 'translate-x-1'
                              }`} />
                            </button>
                            <button
                              onClick={() => openEditItem(item)}
                              className="p-1 text-gray-400 hover:text-primary-500"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDeleteItem(item.id!)}
                              className="p-1 text-gray-400 hover:text-red-500"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-8">Bu bo'limda element yo'q</p>
                  )
                ) : (
                  <p className="text-gray-400 text-center py-8">Chap tarafdan bo'limni tanlang</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* SOCIAL TAB */}
        {activeTab === 'social' && (
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">Ijtimoiy Tarmoqlar</h2>
              <button
                onClick={() => { resetSocialForm(); setSelectedSocialLink(null); setShowSocialModal(true) }}
                className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
              >
                + Yangi Ijtimoiy Tarmoq
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {socialLinks.length === 0 ? (
                <p className="col-span-full text-gray-500 text-center py-8">Hozircha ijtimoiy tarmoq yo'q</p>
              ) : (
                socialLinks.map((link) => (
                  <div key={link.id} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">
                          <i className={link.icon || PLATFORM_ICONS[link.platform] || 'fas fa-link'}></i>
                        </span>
                        <div>
                          <p className="font-medium capitalize">{link.platform}</p>
                          <a href={link.link_url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary-500 hover:underline">
                            {link.link_url.substring(0, 30)}...
                          </a>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleToggleSocialLink(link.id!, link.is_active)}
                          className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                            link.is_active ? 'bg-green-500' : 'bg-gray-300'
                          }`}
                          title={link.is_active ? 'Nofaol qilish' : 'Faollashtirish'}
                        >
                          <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${
                            link.is_active ? 'translate-x-4' : 'translate-x-1'
                          }`} />
                        </button>
                        <button
                          onClick={() => openEditSocialLink(link)}
                          className="p-1 text-gray-400 hover:text-primary-500"
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
        )}

        {/* CONTACTS TAB */}
        {activeTab === 'contacts' && (
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">Kontaktlar</h2>
              <button
                onClick={() => { resetContactForm(); setSelectedContact(null); setShowContactModal(true) }}
                className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
              >
                + Yangi Kontakt
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {contacts.length === 0 ? (
                <p className="col-span-full text-gray-500 text-center py-8">Hozircha kontakt yo'q</p>
              ) : (
                contacts.map((contact) => (
                  <div key={contact.id} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-xl text-gray-500">
                          <i className={contact.icon || CONTACT_TYPE_ICONS[contact.contact_type] || 'fas fa-info'}></i>
                        </span>
                        <div>
                          <p className="text-xs text-gray-500 uppercase">{contact.contact_type}</p>
                          <p className="font-medium">{contact.value}</p>
                          {contact.label_uz && (
                            <p className="text-sm text-gray-500">{contact.label_uz}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleToggleContact(contact.id!, contact.is_active)}
                          className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                            contact.is_active ? 'bg-green-500' : 'bg-gray-300'
                          }`}
                          title={contact.is_active ? 'Nofaol qilish' : 'Faollashtirish'}
                        >
                          <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${
                            contact.is_active ? 'translate-x-4' : 'translate-x-1'
                          }`} />
                        </button>
                        <button
                          onClick={() => openEditContact(contact)}
                          className="p-1 text-gray-400 hover:text-primary-500"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDeleteContact(contact.id!)}
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
        )}
      </div>

      {/* SECTION MODAL */}
      {showSectionModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">
              {selectedSection ? 'Bo\'limni Tahrirlash' : 'Yangi Bo\'lim'}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nomi (UZ) *</label>
                <input
                  type="text"
                  value={sectionForm.title_uz}
                  onChange={(e) => setSectionForm({ ...sectionForm, title_uz: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Sahifalar"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nomi (RU)</label>
                <input
                  type="text"
                  value={sectionForm.title_ru}
                  onChange={(e) => setSectionForm({ ...sectionForm, title_ru: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Страницы"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nomi (EN)</label>
                <input
                  type="text"
                  value={sectionForm.title_en}
                  onChange={(e) => setSectionForm({ ...sectionForm, title_en: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Pages"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Slug *</label>
                <input
                  type="text"
                  value={sectionForm.slug}
                  onChange={(e) => setSectionForm({ ...sectionForm, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="pages"
                />
              </div>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tartib</label>
                  <input
                    type="number"
                    value={sectionForm.order}
                    onChange={(e) => setSectionForm({ ...sectionForm, order: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Holat</label>
                  <select
                    value={sectionForm.is_active ? 'true' : 'false'}
                    onChange={(e) => setSectionForm({ ...sectionForm, is_active: e.target.value === 'true' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="true">Faol</option>
                    <option value="false">Nofaol</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => { setShowSectionModal(false); setSelectedSection(null) }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Bekor qilish
              </button>
              <button
                onClick={selectedSection ? handleUpdateSection : handleCreateSection}
                disabled={saving || !sectionForm.title_uz || !sectionForm.slug}
                className="flex-1 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50"
              >
                {saving ? 'Saqlanmoqda...' : 'Saqlash'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ITEM MODAL */}
      {showItemModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">
              {selectedItem ? 'Elementni Tahrirlash' : 'Yangi Element'}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nomi (UZ) *</label>
                <input
                  type="text"
                  value={itemForm.title_uz}
                  onChange={(e) => setItemForm({ ...itemForm, title_uz: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nomi (RU)</label>
                <input
                  type="text"
                  value={itemForm.title_ru}
                  onChange={(e) => setItemForm({ ...itemForm, title_ru: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nomi (EN)</label>
                <input
                  type="text"
                  value={itemForm.title_en}
                  onChange={(e) => setItemForm({ ...itemForm, title_en: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Havola URL</label>
                <input
                  type="text"
                  value={itemForm.link_url}
                  onChange={(e) => setItemForm({ ...itemForm, link_url: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="https://example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ikonka (FontAwesome class)</label>
                <input
                  type="text"
                  value={itemForm.icon}
                  onChange={(e) => setItemForm({ ...itemForm, icon: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="fas fa-home"
                />
              </div>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={itemForm.new_tab}
                    onChange={(e) => setItemForm({ ...itemForm, new_tab: e.target.checked })}
                    className="rounded text-primary-500"
                  />
                  <span className="text-sm">Yangi tabda ochish</span>
                </label>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tartib</label>
                  <input
                    type="number"
                    value={itemForm.order}
                    onChange={(e) => setItemForm({ ...itemForm, order: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Holat</label>
                  <select
                    value={itemForm.is_active ? 'true' : 'false'}
                    onChange={(e) => setItemForm({ ...itemForm, is_active: e.target.value === 'true' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="true">Faol</option>
                    <option value="false">Nofaol</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => { setShowItemModal(false); setSelectedItem(null) }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Bekor qilish
              </button>
              <button
                onClick={selectedItem ? handleUpdateItem : handleCreateItem}
                disabled={saving || !itemForm.title_uz}
                className="flex-1 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50"
              >
                {saving ? 'Saqlanmoqda...' : 'Saqlash'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SOCIAL MODAL */}
      {showSocialModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">
              {selectedSocialLink ? 'Ijtimoiy Tarmoqni Tahrirlash' : 'Yangi Ijtimoiy Tarmoq'}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Platforma *</label>
                <select
                  value={socialForm.platform}
                  onChange={(e) => setSocialForm({ ...socialForm, platform: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  {PLATFORMS.map((p) => (
                    <option key={p.value} value={p.value}>{p.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Havola URL *</label>
                <input
                  type="text"
                  value={socialForm.link_url}
                  onChange={(e) => setSocialForm({ ...socialForm, link_url: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="https://t.me/username"
                />
              </div>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tartib</label>
                  <input
                    type="number"
                    value={socialForm.order}
                    onChange={(e) => setSocialForm({ ...socialForm, order: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Holat</label>
                  <select
                    value={socialForm.is_active ? 'true' : 'false'}
                    onChange={(e) => setSocialForm({ ...socialForm, is_active: e.target.value === 'true' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="true">Faol</option>
                    <option value="false">Nofaol</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => { setShowSocialModal(false); setSelectedSocialLink(null) }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Bekor qilish
              </button>
              <button
                onClick={selectedSocialLink ? handleUpdateSocialLink : handleCreateSocialLink}
                disabled={saving || !socialForm.link_url}
                className="flex-1 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50"
              >
                {saving ? 'Saqlanmoqda...' : 'Saqlash'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONTACT MODAL */}
      {showContactModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">
              {selectedContact ? 'Kontaktni Tahrirlash' : 'Yangi Kontakt'}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Turi *</label>
                <select
                  value={contactForm.contact_type}
                  onChange={(e) => setContactForm({ ...contactForm, contact_type: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  {CONTACT_TYPES.map((ct) => (
                    <option key={ct.value} value={ct.value}>{ct.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Qiymat *</label>
                <input
                  type="text"
                  value={contactForm.value}
                  onChange={(e) => setContactForm({ ...contactForm, value: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="+998 90 123 45 67"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Yorliq (UZ)</label>
                <input
                  type="text"
                  value={contactForm.label_uz}
                  onChange={(e) => setContactForm({ ...contactForm, label_uz: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Asosiy telefon"
                />
              </div>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tartib</label>
                  <input
                    type="number"
                    value={contactForm.order}
                    onChange={(e) => setContactForm({ ...contactForm, order: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Holat</label>
                  <select
                    value={contactForm.is_active ? 'true' : 'false'}
                    onChange={(e) => setContactForm({ ...contactForm, is_active: e.target.value === 'true' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="true">Faol</option>
                    <option value="false">Nofaol</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => { setShowContactModal(false); setSelectedContact(null) }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Bekor qilish
              </button>
              <button
                onClick={selectedContact ? handleUpdateContact : handleCreateContact}
                disabled={saving || !contactForm.value}
                className="flex-1 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50"
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
