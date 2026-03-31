'use client'

import { useState, useEffect } from 'react'
import Cookies from 'js-cookie'
import {
  footerApi,
  FooterSection,
  FooterItem,
  FooterSocialLink,
  FooterContact,
} from '@/lib/api/footer'
import FooterSectionsTab from './FooterSectionsTab'
import FooterSocialTab from './FooterSocialTab'
import FooterContactsTab from './FooterContactsTab'

// Tab types
type TabType = 'sections' | 'social' | 'contacts'

interface FooterPageProps {
  t: any
}

export default function FooterPage({ t }: FooterPageProps) {
  // Contact type options (inside component to access translations)
  const CONTACT_TYPES = [
    { value: 'phone', label: t.phoneContact },
    { value: 'email', label: t.email },
    { value: 'address', label: t.addressType },
    { value: 'telegram', label: 'Telegram' },
    { value: 'whatsapp', label: 'WhatsApp' },
  ]
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

  const getToken = () => Cookies.get('access_token') || ''

  // Error handler - xatoliklarni to'g'ri ko'rsatish
  const handleError = (error: any) => {
    const message = error.message || t.errorOccurred
    // Token xatoliklari - foydalanuvchiga login qilishni taklif qilish
    if (message.includes('authenticated') || message.includes('401') || message.includes('token') || message.includes('Unauthorized')) {
      alert(t.sessionExpired)
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

    // XAVFSIZLIK: URL validatsiya - faqat HTTP va HTTPS ruxsat
    try {
      const parsed = new URL(url)
      if (!['http:', 'https:'].includes(parsed.protocol)) {
        alert('Xavfsizlik: Faqat HTTP yoki HTTPS havolalar ruxsat etilgan')
        return false
      }
    } catch {
      alert('Noto\'g\'ri URL formati')
      return false
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
      await footerApi.createSection(sectionForm as any)
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
      await footerApi.updateSection(selectedSection.id, sectionForm)
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
    if (!confirm(t.deleteConfirm)) return
    try {
      await footerApi.deleteSection(id)
      await loadData()
      if (selectedSection?.id === id) setSelectedSection(null)
    } catch (error: any) {
      handleError(error)
    }
  }

  const handleToggleSection = async (id: number, is_active: boolean) => {
    try { await footerApi.updateSection(id, { is_active: !is_active }); await loadData() } catch (e: any) { handleError(e) }
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
      await footerApi.createItem({ ...itemForm, section_id: selectedSection.id } as any)
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
      await footerApi.updateItem(selectedItem.id, itemForm)
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
    if (!confirm(t.deleteConfirm)) return
    try {
      await footerApi.deleteItem(id)
      await loadData()
    } catch (error: any) {
      handleError(error)
    }
  }

  const handleToggleItem = async (id: number, is_active: boolean) => {
    try { await footerApi.updateItem(id, { is_active: !is_active }); await loadData() } catch (e: any) { handleError(e) }
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
      await footerApi.createSocialLink(socialForm as any)
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
      await footerApi.updateSocialLink(selectedSocialLink.id, socialForm)
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
    if (!confirm(t.deleteConfirm)) return
    try {
      await footerApi.deleteSocialLink(id)
      await loadData()
    } catch (error: any) {
      handleError(error)
    }
  }

  const handleToggleSocialLink = async (id: number, is_active: boolean) => {
    try { await footerApi.updateSocialLink(id, { is_active: !is_active }); await loadData() } catch (e: any) { handleError(e) }
  }

  const resetSocialForm = () => {
    setSocialForm({ platform: 'telegram', link_url: '', order: 0, is_active: true })
  }

  // ============== CONTACT HANDLERS ==============
  const handleCreateContact = async () => {
    if (!validateContact()) return
    setSaving(true)
    try {
      await footerApi.createContact(contactForm as any)
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
      await footerApi.updateContact(selectedContact.id, contactForm)
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
    if (!confirm(t.deleteConfirm)) return
    try {
      await footerApi.deleteContact(id)
      await loadData()
    } catch (error: any) {
      handleError(error)
    }
  }

  const handleToggleContact = async (id: number, is_active: boolean) => {
    try { await footerApi.updateContact(id, { is_active: !is_active }); await loadData() } catch (e: any) { handleError(e) }
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t.footer}</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">{t.footerDesc}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex gap-4">
          {[
            { id: 'sections', label: t.footerSections, icon: '\u{1F4C2}' },
            { id: 'social', label: t.socialLinks, icon: '\u{1F310}' },
            { id: 'contacts', label: t.contacts, icon: '\u{1F4DE}' },
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
        {activeTab === 'sections' && (
          <FooterSectionsTab
            t={t}
            sections={sections}
            selectedSection={selectedSection}
            selectedItem={selectedItem}
            showSectionModal={showSectionModal}
            showItemModal={showItemModal}
            saving={saving}
            sectionForm={sectionForm}
            itemForm={itemForm}
            setSectionForm={setSectionForm}
            setItemForm={setItemForm}
            setSelectedSection={setSelectedSection}
            setSelectedItem={setSelectedItem}
            setShowSectionModal={setShowSectionModal}
            setShowItemModal={setShowItemModal}
            resetSectionForm={resetSectionForm}
            resetItemForm={resetItemForm}
            handleCreateSection={handleCreateSection}
            handleUpdateSection={handleUpdateSection}
            handleDeleteSection={handleDeleteSection}
            handleToggleSection={handleToggleSection}
            openEditSection={openEditSection}
            handleCreateItem={handleCreateItem}
            handleUpdateItem={handleUpdateItem}
            handleDeleteItem={handleDeleteItem}
            handleToggleItem={handleToggleItem}
            openEditItem={openEditItem}
          />
        )}

        {activeTab === 'social' && (
          <FooterSocialTab
            t={t}
            socialLinks={socialLinks}
            selectedSocialLink={selectedSocialLink}
            showSocialModal={showSocialModal}
            saving={saving}
            socialForm={socialForm}
            setSocialForm={setSocialForm}
            setSelectedSocialLink={setSelectedSocialLink}
            setShowSocialModal={setShowSocialModal}
            resetSocialForm={resetSocialForm}
            handleCreateSocialLink={handleCreateSocialLink}
            handleUpdateSocialLink={handleUpdateSocialLink}
            handleDeleteSocialLink={handleDeleteSocialLink}
            handleToggleSocialLink={handleToggleSocialLink}
            openEditSocialLink={openEditSocialLink}
          />
        )}

        {activeTab === 'contacts' && (
          <FooterContactsTab
            t={t}
            contacts={contacts}
            selectedContact={selectedContact}
            showContactModal={showContactModal}
            saving={saving}
            contactForm={contactForm}
            contactTypes={CONTACT_TYPES}
            setContactForm={setContactForm}
            setSelectedContact={setSelectedContact}
            setShowContactModal={setShowContactModal}
            resetContactForm={resetContactForm}
            handleCreateContact={handleCreateContact}
            handleUpdateContact={handleUpdateContact}
            handleDeleteContact={handleDeleteContact}
            handleToggleContact={handleToggleContact}
            openEditContact={openEditContact}
          />
        )}
      </div>
    </div>
  )
}
