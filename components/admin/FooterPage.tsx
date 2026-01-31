'use client'

import { useState, useEffect } from 'react'
import Cookies from 'js-cookie'
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

interface FooterPageProps {
  t: any
}

export default function FooterPage({ t }: FooterPageProps) {
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
    const token = getToken()
    if (!token) {
      setLoading(false)
      return
    }

    setLoading(true)
    try {
      const [sectionsData, socialData, contactsData] = await Promise.all([
        footerApi.getSections(token),
        footerApi.getSocialLinks(token),
        footerApi.getContacts(token)
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

  const getToken = () => Cookies.get('access_token') || ''

  // Error handler - xatoliklarni to'g'ri ko'rsatish
  const handleError = (error: any) => {
    const message = error.message || 'Xatolik yuz berdi'
    // Token xatoliklari - foydalanuvchiga login qilishni taklif qilish
    if (message.includes('authenticated') || message.includes('401') || message.includes('token') || message.includes('Unauthorized')) {
      alert('Sessiya muddati tugagan. Iltimos, qayta login qiling.')
      window.location.href = '/admin/login'
      return
    }
    // Boshqa xatoliklar
    alert(message)
  }

  // Validatsiya funksiyalari
  const validateSection = () => {
    if (!sectionForm.title_uz?.trim()) {
      alert('Nomi (UZ) majburiy maydon')
      return false
    }
    if (!sectionForm.slug?.trim()) {
      alert('Slug majburiy maydon')
      return false
    }
    return true
  }

  const validateItem = () => {
    if (!itemForm.title_uz?.trim()) {
      alert('Nomi (UZ) majburiy maydon')
      return false
    }
    return true
  }

  const validateSocial = () => {
    if (!socialForm.link_url?.trim()) {
      alert('Havola URL majburiy maydon')
      return false
    }

    // Avtomatik URL yaratish
    let url = socialForm.link_url.trim()

    // Agar @ bilan boshlansa, platform URL qo'shish
    if (url.startsWith('@')) {
      const username = url.substring(1) // @ ni olib tashlash

      switch (socialForm.platform) {
        case 'telegram':
          url = `https://t.me/${username}`
          break
        case 'instagram':
          url = `https://instagram.com/${username}`
          break
        case 'facebook':
          url = `https://facebook.com/${username}`
          break
        case 'twitter':
          url = `https://twitter.com/${username}`
          break
        case 'tiktok':
          url = `https://tiktok.com/@${username}`
          break
        case 'linkedin':
          url = `https://linkedin.com/in/${username}`
          break
        case 'youtube':
          url = `https://youtube.com/@${username}`
          break
        case 'whatsapp':
          url = `https://wa.me/${username}`
          break
        default:
          url = `https://${socialForm.platform}.com/${username}`
      }

      // URL ni yangilash
      setSocialForm({ ...socialForm, link_url: url })
    }
    // Agar oddiy username bo'lsa (@ siz)
    else if (!url.startsWith('http')) {
      switch (socialForm.platform) {
        case 'telegram':
          url = `https://t.me/${url}`
          break
        case 'instagram':
          url = `https://instagram.com/${url}`
          break
        case 'facebook':
          url = `https://facebook.com/${url}`
          break
        case 'twitter':
          url = `https://twitter.com/${url}`
          break
        case 'tiktok':
          url = `https://tiktok.com/@${url}`
          break
        case 'linkedin':
          url = `https://linkedin.com/in/${url}`
          break
        case 'youtube':
          url = `https://youtube.com/@${url}`
          break
        case 'whatsapp':
          url = `https://wa.me/${url}`
          break
      }

      setSocialForm({ ...socialForm, link_url: url })
    }

    return true
  }

  const validateContact = () => {
    if (!contactForm.value?.trim()) {
      alert('Qiymat majburiy maydon')
      return false
    }
    return true
  }

  // ============== SECTION HANDLERS ==============
  const handleCreateSection = async () => {
    if (!validateSection()) return
    setSaving(true)
    try {
      await footerApi.createSection(sectionForm as any, getToken())
      await loadData()
      setShowSectionModal(false)
      resetSectionForm()
    } catch (error: any) {
      handleError(error)
    } finally {
      setSaving(false)
    }
  }

  const handleUpdateSection = async () => {
    if (!selectedSection?.id) return
    if (!validateSection()) return
    setSaving(true)
    try {
      await footerApi.updateSection(selectedSection.id, sectionForm, getToken())
      await loadData()
      setShowSectionModal(false)
      setSelectedSection(null)
      resetSectionForm()
    } catch (error: any) {
      handleError(error)
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteSection = async (id: number) => {
    if (!confirm('Bu bo\'limni o\'chirishni xohlaysizmi? Barcha elementlar ham o\'chiriladi.')) return
    try {
      await footerApi.deleteSection(id, getToken())
      await loadData()
      if (selectedSection?.id === id) setSelectedSection(null)
    } catch (error: any) {
      handleError(error)
    }
  }

  const resetSectionForm = () => {
    setSectionForm({ title_uz: '', title_ru: '', title_en: '', slug: '', order: 0, is_active: true })
  }

  // ============== ITEM HANDLERS ==============
  const handleCreateItem = async () => {
    if (!selectedSection?.id) return
    if (!validateItem()) return
    setSaving(true)
    try {
      await footerApi.createItem({ ...itemForm, section_id: selectedSection.id } as any, getToken())
      await loadData()
      setShowItemModal(false)
      resetItemForm()
    } catch (error: any) {
      handleError(error)
    } finally {
      setSaving(false)
    }
  }

  const handleUpdateItem = async () => {
    if (!selectedItem?.id) return
    if (!validateItem()) return
    setSaving(true)
    try {
      await footerApi.updateItem(selectedItem.id, itemForm, getToken())
      await loadData()
      setShowItemModal(false)
      setSelectedItem(null)
      resetItemForm()
    } catch (error: any) {
      handleError(error)
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteItem = async (id: number) => {
    if (!confirm('Bu elementni o\'chirishni xohlaysizmi?')) return
    try {
      await footerApi.deleteItem(id, getToken())
      await loadData()
    } catch (error: any) {
      handleError(error)
    }
  }

  const resetItemForm = () => {
    setItemForm({
      section_id: 0, title_uz: '', title_ru: '', title_en: '', link_url: '',
      icon: '', icon_type: 'fontawesome', new_tab: false, order: 0, is_active: true
    })
  }

  // ============== SOCIAL LINK HANDLERS ==============
  const handleCreateSocialLink = async () => {
    if (!validateSocial()) return
    setSaving(true)
    try {
      await footerApi.createSocialLink(socialForm as any, getToken())
      await loadData()
      setShowSocialModal(false)
      resetSocialForm()
    } catch (error: any) {
      handleError(error)
    } finally {
      setSaving(false)
    }
  }

  const handleUpdateSocialLink = async () => {
    if (!selectedSocialLink?.id) return
    if (!validateSocial()) return
    setSaving(true)
    try {
      await footerApi.updateSocialLink(selectedSocialLink.id, socialForm, getToken())
      await loadData()
      setShowSocialModal(false)
      setSelectedSocialLink(null)
      resetSocialForm()
    } catch (error: any) {
      handleError(error)
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteSocialLink = async (id: number) => {
    if (!confirm('Bu ijtimoiy tarmoqni o\'chirishni xohlaysizmi?')) return
    try {
      await footerApi.deleteSocialLink(id, getToken())
      await loadData()
    } catch (error: any) {
      handleError(error)
    }
  }

  const resetSocialForm = () => {
    setSocialForm({ platform: 'telegram', link_url: '', order: 0, is_active: true })
  }

  // ============== CONTACT HANDLERS ==============
  const handleCreateContact = async () => {
    if (!validateContact()) return
    setSaving(true)
    try {
      await footerApi.createContact(contactForm as any, getToken())
      await loadData()
      setShowContactModal(false)
      resetContactForm()
    } catch (error: any) {
      handleError(error)
    } finally {
      setSaving(false)
    }
  }

  const handleUpdateContact = async () => {
    if (!selectedContact?.id) return
    if (!validateContact()) return
    setSaving(true)
    try {
      await footerApi.updateContact(selectedContact.id, contactForm, getToken())
      await loadData()
      setShowContactModal(false)
      setSelectedContact(null)
      resetContactForm()
    } catch (error: any) {
      handleError(error)
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteContact = async (id: number) => {
    if (!confirm('Bu kontaktni o\'chirishni xohlaysizmi?')) return
    try {
      await footerApi.deleteContact(id, getToken())
      await loadData()
    } catch (error: any) {
      handleError(error)
    }
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00a6a6]"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Footer Boshqaruvi</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Sayt pastki qismidagi ma'lumotlarni boshqaring</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
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
                  ? 'border-[#00a6a6] text-[#00a6a6]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
        {/* SECTIONS TAB */}
        {activeTab === 'sections' && (
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold dark:text-white">Footer Bo'limlari</h2>
              <button
                onClick={() => { resetSectionForm(); setSelectedSection(null); setShowSectionModal(true) }}
                className="px-4 py-2 bg-[#00a6a6] text-white rounded-lg hover:bg-[#00a6a6]/90 transition-colors"
              >
                + Yangi Bo'lim
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Sections list */}
              <div className="space-y-4">
                <h3 className="font-medium text-gray-700 dark:text-gray-300">Bo'limlar ro'yxati</h3>
                {sections.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">Hozircha bo'lim yo'q</p>
                ) : (
                  sections.map((section) => (
                    <div
                      key={section.id}
                      onClick={() => setSelectedSection(section)}
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${
                        selectedSection?.id === section.id
                          ? 'border-[#00a6a6] bg-[#00a6a6]/10'
                          : 'border-gray-200 dark:border-gray-600 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium dark:text-white">{section.title_uz}</h4>
                          <p className="text-sm text-gray-500">/{section.slug}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 text-xs rounded ${
                            section.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                          }`}>
                            {section.is_active ? 'Faol' : 'Nofaol'}
                          </span>
                          <button
                            onClick={(e) => { e.stopPropagation(); openEditSection(section) }}
                            className="p-1 text-gray-500 hover:text-[#00a6a6]"
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
                  <h3 className="font-medium text-gray-700 dark:text-gray-300">
                    {selectedSection ? `"${selectedSection.title_uz}" elementlari` : 'Bo\'limni tanlang'}
                  </h3>
                  {selectedSection && (
                    <button
                      onClick={() => { resetItemForm(); setSelectedItem(null); setShowItemModal(true) }}
                      className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
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
                          className="p-3 border border-gray-200 dark:border-gray-600 rounded-lg flex items-center justify-between"
                        >
                          <div className="flex items-center gap-3">
                            {item.icon && (
                              <span className="text-gray-400">
                                <i className={item.icon}></i>
                              </span>
                            )}
                            <div>
                              <p className="font-medium text-sm dark:text-white">{item.title_uz}</p>
                              {item.link_url && (
                                <p className="text-xs text-gray-500">{item.link_url}</p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => openEditItem(item)}
                              className="p-1 text-gray-400 hover:text-[#00a6a6]"
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
              <h2 className="text-lg font-semibold dark:text-white">Ijtimoiy Tarmoqlar</h2>
              <button
                onClick={() => { resetSocialForm(); setSelectedSocialLink(null); setShowSocialModal(true) }}
                className="px-4 py-2 bg-[#00a6a6] text-white rounded-lg hover:bg-[#00a6a6]/90 transition-colors"
              >
                + Yangi Ijtimoiy Tarmoq
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {socialLinks.length === 0 ? (
                <p className="col-span-full text-gray-500 text-center py-8">Hozircha ijtimoiy tarmoq yo'q</p>
              ) : (
                socialLinks.map((link) => (
                  <div key={link.id} className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">
                          <i className={link.icon || PLATFORM_ICONS[link.platform] || 'fas fa-link'}></i>
                        </span>
                        <div>
                          <p className="font-medium capitalize dark:text-white">{link.platform}</p>
                          <a href={link.link_url} target="_blank" rel="noopener noreferrer" className="text-xs text-[#00a6a6] hover:underline">
                            {link.link_url.substring(0, 30)}...
                          </a>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className={`px-2 py-1 text-xs rounded ${
                          link.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {link.is_active ? 'Faol' : 'Nofaol'}
                        </span>
                        <button
                          onClick={() => openEditSocialLink(link)}
                          className="p-1 text-gray-400 hover:text-[#00a6a6]"
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
              <h2 className="text-lg font-semibold dark:text-white">Kontaktlar</h2>
              <button
                onClick={() => { resetContactForm(); setSelectedContact(null); setShowContactModal(true) }}
                className="px-4 py-2 bg-[#00a6a6] text-white rounded-lg hover:bg-[#00a6a6]/90 transition-colors"
              >
                + Yangi Kontakt
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {contacts.length === 0 ? (
                <p className="col-span-full text-gray-500 text-center py-8">Hozircha kontakt yo'q</p>
              ) : (
                contacts.map((contact) => (
                  <div key={contact.id} className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-xl text-gray-500">
                          <i className={contact.icon || CONTACT_TYPE_ICONS[contact.contact_type] || 'fas fa-info'}></i>
                        </span>
                        <div>
                          <p className="text-xs text-gray-500 uppercase">{contact.contact_type}</p>
                          <p className="font-medium dark:text-white">{contact.value}</p>
                          {contact.label_uz && (
                            <p className="text-sm text-gray-500">{contact.label_uz}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className={`px-2 py-1 text-xs rounded ${
                          contact.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {contact.is_active ? 'Faol' : 'Nofaol'}
                        </span>
                        <button
                          onClick={() => openEditContact(contact)}
                          className="p-1 text-gray-400 hover:text-[#00a6a6]"
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
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4 dark:text-white">
              {selectedSection ? 'Bo\'limni Tahrirlash' : 'Yangi Bo\'lim'}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nomi (UZ) *</label>
                <input
                  type="text"
                  value={sectionForm.title_uz}
                  onChange={(e) => setSectionForm({ ...sectionForm, title_uz: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#00a6a6] focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Sahifalar"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nomi (RU)</label>
                <input
                  type="text"
                  value={sectionForm.title_ru}
                  onChange={(e) => setSectionForm({ ...sectionForm, title_ru: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#00a6a6] focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Страницы"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Slug *</label>
                <input
                  type="text"
                  value={sectionForm.slug}
                  onChange={(e) => setSectionForm({ ...sectionForm, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#00a6a6] focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="pages"
                />
              </div>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tartib</label>
                  <input
                    type="number"
                    value={sectionForm.order}
                    onChange={(e) => setSectionForm({ ...sectionForm, order: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#00a6a6] focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Holat</label>
                  <select
                    value={sectionForm.is_active ? 'true' : 'false'}
                    onChange={(e) => setSectionForm({ ...sectionForm, is_active: e.target.value === 'true' })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#00a6a6] focus:border-transparent dark:bg-gray-700 dark:text-white"
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
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Bekor qilish
              </button>
              <button
                onClick={selectedSection ? handleUpdateSection : handleCreateSection}
                disabled={saving || !sectionForm.title_uz || !sectionForm.slug}
                className="flex-1 px-4 py-2 bg-[#00a6a6] text-white rounded-lg hover:bg-[#00a6a6]/90 disabled:opacity-50"
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
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4 dark:text-white">
              {selectedItem ? 'Elementni Tahrirlash' : 'Yangi Element'}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nomi (UZ) *</label>
                <input
                  type="text"
                  value={itemForm.title_uz}
                  onChange={(e) => setItemForm({ ...itemForm, title_uz: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#00a6a6] focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Havola URL</label>
                <input
                  type="text"
                  value={itemForm.link_url}
                  onChange={(e) => setItemForm({ ...itemForm, link_url: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#00a6a6] focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="https://example.com"
                />
              </div>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={itemForm.new_tab}
                    onChange={(e) => setItemForm({ ...itemForm, new_tab: e.target.checked })}
                    className="rounded text-[#00a6a6]"
                  />
                  <span className="text-sm dark:text-gray-300">Yangi tabda ochish</span>
                </label>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => { setShowItemModal(false); setSelectedItem(null) }}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Bekor qilish
              </button>
              <button
                onClick={selectedItem ? handleUpdateItem : handleCreateItem}
                disabled={saving || !itemForm.title_uz}
                className="flex-1 px-4 py-2 bg-[#00a6a6] text-white rounded-lg hover:bg-[#00a6a6]/90 disabled:opacity-50"
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
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4 dark:text-white">
              {selectedSocialLink ? 'Ijtimoiy Tarmoqni Tahrirlash' : 'Yangi Ijtimoiy Tarmoq'}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Platforma *</label>
                <select
                  value={socialForm.platform}
                  onChange={(e) => setSocialForm({ ...socialForm, platform: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#00a6a6] focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  {PLATFORMS.map((p) => (
                    <option key={p.value} value={p.value}>{p.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Havola URL *</label>
                <input
                  type="text"
                  value={socialForm.link_url}
                  onChange={(e) => setSocialForm({ ...socialForm, link_url: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#00a6a6] focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="https://t.me/username"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => { setShowSocialModal(false); setSelectedSocialLink(null) }}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Bekor qilish
              </button>
              <button
                onClick={selectedSocialLink ? handleUpdateSocialLink : handleCreateSocialLink}
                disabled={saving || !socialForm.link_url}
                className="flex-1 px-4 py-2 bg-[#00a6a6] text-white rounded-lg hover:bg-[#00a6a6]/90 disabled:opacity-50"
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
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4 dark:text-white">
              {selectedContact ? 'Kontaktni Tahrirlash' : 'Yangi Kontakt'}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Turi *</label>
                <select
                  value={contactForm.contact_type}
                  onChange={(e) => setContactForm({ ...contactForm, contact_type: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#00a6a6] focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  {CONTACT_TYPES.map((ct) => (
                    <option key={ct.value} value={ct.value}>{ct.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Qiymat *</label>
                <input
                  type="text"
                  value={contactForm.value}
                  onChange={(e) => setContactForm({ ...contactForm, value: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#00a6a6] focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="+998 90 123 45 67"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Yorliq (UZ)</label>
                <input
                  type="text"
                  value={contactForm.label_uz}
                  onChange={(e) => setContactForm({ ...contactForm, label_uz: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#00a6a6] focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Asosiy telefon"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => { setShowContactModal(false); setSelectedContact(null) }}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Bekor qilish
              </button>
              <button
                onClick={selectedContact ? handleUpdateContact : handleCreateContact}
                disabled={saving || !contactForm.value}
                className="flex-1 px-4 py-2 bg-[#00a6a6] text-white rounded-lg hover:bg-[#00a6a6]/90 disabled:opacity-50"
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
