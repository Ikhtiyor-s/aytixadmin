import api from '@/services/api'

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

export interface FooterFull {
  sections: FooterSection[]
  social_links: FooterSocialLink[]
  contacts: FooterContact[]
}

export interface ReorderItem {
  id: number
  order: number
}

export const footerApi = {
  async getPublicFooter(): Promise<FooterFull> {
    const res = await api.get('/footer/public')
    return res.data
  },

  async getSections(): Promise<FooterSection[]> {
    const res = await api.get('/footer/sections')
    return res.data
  },
  async getSection(id: number): Promise<FooterSection> {
    const res = await api.get(`/footer/sections/${id}`)
    return res.data
  },
  async createSection(data: Omit<FooterSection, 'id' | 'items' | 'created_at' | 'updated_at'>): Promise<FooterSection> {
    const res = await api.post('/footer/sections', data)
    return res.data
  },
  async updateSection(id: number, data: Partial<FooterSection>): Promise<FooterSection> {
    const res = await api.put(`/footer/sections/${id}`, data)
    return res.data
  },
  async deleteSection(id: number): Promise<void> {
    await api.delete(`/footer/sections/${id}`)
  },
  async reorderSections(items: ReorderItem[]): Promise<void> {
    await api.post('/footer/sections/reorder', { items })
  },

  async getItems(sectionId?: number): Promise<FooterItem[]> {
    const res = await api.get('/footer/items', { params: sectionId ? { section_id: sectionId } : {} })
    return res.data
  },
  async createItem(data: Omit<FooterItem, 'id' | 'created_at' | 'updated_at'>): Promise<FooterItem> {
    const res = await api.post('/footer/items', data)
    return res.data
  },
  async updateItem(id: number, data: Partial<FooterItem>): Promise<FooterItem> {
    const res = await api.put(`/footer/items/${id}`, data)
    return res.data
  },
  async deleteItem(id: number): Promise<void> {
    await api.delete(`/footer/items/${id}`)
  },
  async reorderItems(items: ReorderItem[]): Promise<void> {
    await api.post('/footer/items/reorder', { items })
  },

  async getSocialLinks(): Promise<FooterSocialLink[]> {
    const res = await api.get('/footer/social-links')
    return res.data
  },
  async createSocialLink(data: Omit<FooterSocialLink, 'id' | 'created_at' | 'updated_at'>): Promise<FooterSocialLink> {
    const res = await api.post('/footer/social-links', data)
    return res.data
  },
  async updateSocialLink(id: number, data: Partial<FooterSocialLink>): Promise<FooterSocialLink> {
    const res = await api.put(`/footer/social-links/${id}`, data)
    return res.data
  },
  async deleteSocialLink(id: number): Promise<void> {
    await api.delete(`/footer/social-links/${id}`)
  },
  async reorderSocialLinks(items: ReorderItem[]): Promise<void> {
    await api.post('/footer/social-links/reorder', { items })
  },

  async getContacts(): Promise<FooterContact[]> {
    const res = await api.get('/footer/contacts')
    return res.data
  },
  async createContact(data: Omit<FooterContact, 'id' | 'created_at' | 'updated_at'>): Promise<FooterContact> {
    const res = await api.post('/footer/contacts', data)
    return res.data
  },
  async updateContact(id: number, data: Partial<FooterContact>): Promise<FooterContact> {
    const res = await api.put(`/footer/contacts/${id}`, data)
    return res.data
  },
  async deleteContact(id: number): Promise<void> {
    await api.delete(`/footer/contacts/${id}`)
  },
  async reorderContacts(items: ReorderItem[]): Promise<void> {
    await api.post('/footer/contacts/reorder', { items })
  }
}

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

export const CONTACT_TYPE_ICONS: Record<string, string> = {
  phone: 'fas fa-phone',
  email: 'fas fa-envelope',
  address: 'fas fa-map-marker-alt',
  telegram: 'fab fa-telegram',
  whatsapp: 'fab fa-whatsapp',
}
