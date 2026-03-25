import api from '@/services/api'

export interface PartnerData {
  id?: number
  name: string
  logo_url?: string
  website?: string
  website_url?: string
  description_uz?: string
  description_ru?: string
  description_en?: string
  partner_type?: string
  is_active?: boolean
  order?: number
  order_index?: number
  status?: string
  created_at?: string
  updated_at?: string
}

export const partnersApi = {
  async list(): Promise<PartnerData[]> {
    const res = await api.get('/partners/')
    return res.data
  },
  async get(id: number): Promise<PartnerData> {
    const res = await api.get(`/partners/${id}`)
    return res.data
  },
  async create(data: Partial<PartnerData>): Promise<PartnerData> {
    const res = await api.post('/partners/', data)
    return res.data
  },
  async update(id: number, data: Partial<PartnerData>): Promise<PartnerData> {
    const res = await api.put(`/partners/${id}`, data)
    return res.data
  },
  async delete(id: number): Promise<void> {
    await api.delete(`/partners/${id}`)
  },
}
