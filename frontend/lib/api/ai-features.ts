import api from '@/services/api'

export interface AIFeatureData {
  id?: number
  name_uz: string
  name_ru?: string
  name_en?: string
  description_uz?: string
  description_ru?: string
  description_en?: string
  icon?: string
  category?: string
  is_available?: boolean
  order?: number
  created_at?: string
  updated_at?: string
}

export const aiFeaturesApi = {
  async list(): Promise<AIFeatureData[]> {
    const res = await api.get('/ai-features/')
    return res.data
  },
  async getCategories(): Promise<string[]> {
    const res = await api.get('/ai-features/categories')
    return res.data
  },
  async get(id: number): Promise<AIFeatureData> {
    const res = await api.get(`/ai-features/${id}`)
    return res.data
  },
  async create(data: Omit<AIFeatureData, 'id' | 'created_at' | 'updated_at'>): Promise<AIFeatureData> {
    const res = await api.post('/ai-features/', data)
    return res.data
  },
  async update(id: number, data: Partial<AIFeatureData>): Promise<AIFeatureData> {
    const res = await api.put(`/ai-features/${id}`, data)
    return res.data
  },
  async delete(id: number): Promise<void> {
    await api.delete(`/ai-features/${id}`)
  }
}
