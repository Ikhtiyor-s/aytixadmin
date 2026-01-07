const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'

// Xatolik xabarlarini qaytarish
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      throw new Error('Not authenticated - Sessiya muddati tugagan')
    }
    const error = await response.json().catch(() => ({ detail: 'Xatolik yuz berdi' }))
    throw new Error(error.detail || `Xatolik: ${response.status}`)
  }
  return response.json()
}

// ============== SECTION INTERFACES ==============

export interface FooterSection {
  id?: number
  title_uz: string
  title_ru?: string
  title_en?: string
  slug: string
  order?: number
  is_active?: boolean
  items?: FooterItem[]
  created_at?: string
  updated_at?: string
}

export interface FooterItem {
  id?: number
  section_id: number
  title_uz: string
  title_ru?: string
  title_en?: string
  link_url?: string
  icon?: string
  icon_type?: 'fontawesome' | 'emoji' | 'image' | 'svg'
  new_tab?: boolean
  order?: number
  is_active?: boolean
  created_at?: string
  updated_at?: string
}

// ============== SOCIAL LINK INTERFACES ==============

export interface FooterSocialLink {
  id?: number
  platform: string
  title_uz?: string
  title_ru?: string
  title_en?: string
  link_url: string
  icon?: string
  order?: number
  is_active?: boolean
  created_at?: string
  updated_at?: string
}

// ============== CONTACT INTERFACES ==============

export interface FooterContact {
  id?: number
  contact_type: 'phone' | 'email' | 'address' | 'telegram' | 'whatsapp'
  label_uz?: string
  label_ru?: string
  label_en?: string
  value: string
  link_url?: string
  icon?: string
  order?: number
  is_active?: boolean
  created_at?: string
  updated_at?: string
}

// ============== FULL FOOTER INTERFACE ==============

export interface FooterFull {
  sections: FooterSection[]
  social_links: FooterSocialLink[]
  contacts: FooterContact[]
}

// ============== REORDER INTERFACE ==============

export interface ReorderItem {
  id: number
  order: number
}

// ============== API FUNCTIONS ==============

export const footerApi = {
  // ============== PUBLIC ==============
  async getPublicFooter(): Promise<FooterFull> {
    const response = await fetch(`${API_BASE_URL}/footer/public`)
    return handleResponse(response)
  },

  // ============== SECTIONS ==============
  async getSections(token: string): Promise<FooterSection[]> {
    const response = await fetch(`${API_BASE_URL}/footer/sections`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    return handleResponse(response)
  },

  async getSection(id: number, token: string): Promise<FooterSection> {
    const response = await fetch(`${API_BASE_URL}/footer/sections/${id}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    return handleResponse(response)
  },

  async createSection(data: Omit<FooterSection, 'id' | 'items' | 'created_at' | 'updated_at'>, token: string): Promise<FooterSection> {
    const response = await fetch(`${API_BASE_URL}/footer/sections`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    })
    return handleResponse(response)
  },

  async updateSection(id: number, data: Partial<FooterSection>, token: string): Promise<FooterSection> {
    const response = await fetch(`${API_BASE_URL}/footer/sections/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    })
    return handleResponse(response)
  },

  async deleteSection(id: number, token: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/footer/sections/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    })
    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        throw new Error('Not authenticated - Sessiya muddati tugagan')
      }
      throw new Error('Bo\'limni o\'chirishda xatolik')
    }
  },

  async reorderSections(items: ReorderItem[], token: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/footer/sections/reorder`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ items })
    })
    if (!response.ok) throw new Error('Tartibni yangilashda xatolik')
  },

  // ============== ITEMS ==============
  async getItems(token: string, sectionId?: number): Promise<FooterItem[]> {
    const url = sectionId
      ? `${API_BASE_URL}/footer/items?section_id=${sectionId}`
      : `${API_BASE_URL}/footer/items`
    const response = await fetch(url, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    if (!response.ok) throw new Error('Elementlarni olishda xatolik')
    return response.json()
  },

  async createItem(data: Omit<FooterItem, 'id' | 'created_at' | 'updated_at'>, token: string): Promise<FooterItem> {
    const response = await fetch(`${API_BASE_URL}/footer/items`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    })
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || 'Element yaratishda xatolik')
    }
    return response.json()
  },

  async updateItem(id: number, data: Partial<FooterItem>, token: string): Promise<FooterItem> {
    const response = await fetch(`${API_BASE_URL}/footer/items/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    })
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || 'Elementni yangilashda xatolik')
    }
    return response.json()
  },

  async deleteItem(id: number, token: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/footer/items/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    })
    if (!response.ok) throw new Error('Elementni o\'chirishda xatolik')
  },

  async reorderItems(items: ReorderItem[], token: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/footer/items/reorder`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ items })
    })
    if (!response.ok) throw new Error('Tartibni yangilashda xatolik')
  },

  // ============== SOCIAL LINKS ==============
  async getSocialLinks(token: string): Promise<FooterSocialLink[]> {
    const response = await fetch(`${API_BASE_URL}/footer/social-links`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    if (!response.ok) throw new Error('Ijtimoiy tarmoqlarni olishda xatolik')
    return response.json()
  },

  async createSocialLink(data: Omit<FooterSocialLink, 'id' | 'created_at' | 'updated_at'>, token: string): Promise<FooterSocialLink> {
    const response = await fetch(`${API_BASE_URL}/footer/social-links`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    })
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || 'Ijtimoiy tarmoq yaratishda xatolik')
    }
    return response.json()
  },

  async updateSocialLink(id: number, data: Partial<FooterSocialLink>, token: string): Promise<FooterSocialLink> {
    const response = await fetch(`${API_BASE_URL}/footer/social-links/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    })
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || 'Ijtimoiy tarmoqni yangilashda xatolik')
    }
    return response.json()
  },

  async deleteSocialLink(id: number, token: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/footer/social-links/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    })
    if (!response.ok) throw new Error('Ijtimoiy tarmoqni o\'chirishda xatolik')
  },

  async reorderSocialLinks(items: ReorderItem[], token: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/footer/social-links/reorder`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ items })
    })
    if (!response.ok) throw new Error('Tartibni yangilashda xatolik')
  },

  // ============== CONTACTS ==============
  async getContacts(token: string): Promise<FooterContact[]> {
    const response = await fetch(`${API_BASE_URL}/footer/contacts`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    if (!response.ok) throw new Error('Kontaktlarni olishda xatolik')
    return response.json()
  },

  async createContact(data: Omit<FooterContact, 'id' | 'created_at' | 'updated_at'>, token: string): Promise<FooterContact> {
    const response = await fetch(`${API_BASE_URL}/footer/contacts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    })
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || 'Kontakt yaratishda xatolik')
    }
    return response.json()
  },

  async updateContact(id: number, data: Partial<FooterContact>, token: string): Promise<FooterContact> {
    const response = await fetch(`${API_BASE_URL}/footer/contacts/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    })
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || 'Kontaktni yangilashda xatolik')
    }
    return response.json()
  },

  async deleteContact(id: number, token: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/footer/contacts/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    })
    if (!response.ok) throw new Error('Kontaktni o\'chirishda xatolik')
  },

  async reorderContacts(items: ReorderItem[], token: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/footer/contacts/reorder`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ items })
    })
    if (!response.ok) throw new Error('Tartibni yangilashda xatolik')
  }
}

// Platform icons mapping
export const PLATFORM_ICONS: Record<string, string> = {
  telegram: 'fab fa-telegram',
  instagram: 'fab fa-instagram',
  facebook: 'fab fa-facebook',
  youtube: 'fab fa-youtube',
  tiktok: 'fab fa-tiktok',
  linkedin: 'fab fa-linkedin',
  twitter: 'fab fa-twitter',
  whatsapp: 'fab fa-whatsapp',
}

// Contact type icons mapping
export const CONTACT_TYPE_ICONS: Record<string, string> = {
  phone: 'fas fa-phone',
  email: 'fas fa-envelope',
  address: 'fas fa-map-marker-alt',
  telegram: 'fab fa-telegram',
  whatsapp: 'fab fa-whatsapp',
}
