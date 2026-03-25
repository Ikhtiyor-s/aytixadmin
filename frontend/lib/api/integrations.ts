import api from '@/services/api'

export interface IntegrationData {
  id?: number
  name: string
  icon?: string
  description_uz?: string
  description_ru?: string
  description_en?: string
  category?: string
  docs_url?: string
  status?: 'active' | 'inactive' | 'coming_soon'
  created_at?: string
  updated_at?: string
}

export const integrationsApi = {
  async list(): Promise<IntegrationData[]> {
    const res = await api.get('/integrations/')
    return res.data
  },
  async getCategories(): Promise<string[]> {
    const res = await api.get('/integrations/categories')
    return res.data
  },
  async get(id: number): Promise<IntegrationData> {
    const res = await api.get(`/integrations/${id}`)
    return res.data
  },
  async create(data: Omit<IntegrationData, 'id' | 'created_at' | 'updated_at'>): Promise<IntegrationData> {
    const res = await api.post('/integrations/', data)
    return res.data
  },
  async update(id: number, data: Partial<IntegrationData>): Promise<IntegrationData> {
    const res = await api.put(`/integrations/${id}`, data)
    return res.data
  },
  async delete(id: number): Promise<void> {
    await api.delete(`/integrations/${id}`)
  }
}
