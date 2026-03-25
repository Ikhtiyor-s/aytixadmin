import api from '@/services/api'

export interface FAQ {
  id?: number
  question_uz: string
  question_ru?: string
  question_en?: string
  answer_uz: string
  answer_ru?: string
  answer_en?: string
  category?: string
  order?: number
  status?: string
  created_at?: string
  updated_at?: string
}

export interface ReorderItem {
  id: number
  order: number
}

export const faqApi = {
  async getPublicFAQs(category?: string): Promise<FAQ[]> {
    const res = await api.get('/faq/public', { params: category ? { category } : {} })
    return res.data
  },
  async getCategories(): Promise<string[]> {
    const res = await api.get('/faq/categories')
    return res.data
  },
  async getFAQs(params: { category?: string; status?: string } = {}): Promise<FAQ[]> {
    const res = await api.get('/faq', { params })
    return res.data
  },
  async getFAQ(id: number): Promise<FAQ> {
    const res = await api.get(`/faq/${id}`)
    return res.data
  },
  async createFAQ(data: Omit<FAQ, 'id' | 'created_at' | 'updated_at'>): Promise<FAQ> {
    const res = await api.post('/faq', data)
    return res.data
  },
  async updateFAQ(id: number, data: Partial<FAQ>): Promise<FAQ> {
    const res = await api.put(`/faq/${id}`, data)
    return res.data
  },
  async deleteFAQ(id: number): Promise<void> {
    await api.delete(`/faq/${id}`)
  },
  async toggleFAQ(id: number): Promise<FAQ> {
    const res = await api.patch(`/faq/${id}/toggle`)
    return res.data
  },
  async reorderFAQs(items: ReorderItem[]): Promise<void> {
    await api.post('/faq/reorder', { items })
  }
}
