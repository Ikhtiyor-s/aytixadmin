const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'

export interface PartnerData {
  id?: number
  name: string
  logo_url?: string
  website?: string
  description_uz?: string
  description_ru?: string
  description_en?: string
  partner_type?: string
  order?: number
  status?: 'active' | 'inactive' | 'pending'
  created_at?: string
  updated_at?: string
}

export const partnersApi = {
  async list(token: string): Promise<PartnerData[]> {
    const response = await fetch(`${API_BASE_URL}/partners/`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    if (!response.ok) throw new Error('Failed to fetch partners')
    return response.json()
  },

  async get(id: number, token: string): Promise<PartnerData> {
    const response = await fetch(`${API_BASE_URL}/partners/${id}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    if (!response.ok) throw new Error('Failed to fetch partner')
    return response.json()
  },

  async create(data: Omit<PartnerData, 'id' | 'created_at' | 'updated_at'>, token: string): Promise<PartnerData> {
    const response = await fetch(`${API_BASE_URL}/partners/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    })
    if (!response.ok) throw new Error('Failed to create partner')
    return response.json()
  },

  async update(id: number, data: Partial<PartnerData>, token: string): Promise<PartnerData> {
    const response = await fetch(`${API_BASE_URL}/partners/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    })
    if (!response.ok) throw new Error('Failed to update partner')
    return response.json()
  },

  async delete(id: number, token: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/partners/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    })
    if (!response.ok) throw new Error('Failed to delete partner')
  }
}
