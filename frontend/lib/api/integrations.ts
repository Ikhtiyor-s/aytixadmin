const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'

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
  async list(token: string): Promise<IntegrationData[]> {
    const response = await fetch(`${API_BASE_URL}/integrations/`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    if (!response.ok) throw new Error('Failed to fetch integrations')
    return response.json()
  },

  async getCategories(token: string): Promise<string[]> {
    const response = await fetch(`${API_BASE_URL}/integrations/categories`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    if (!response.ok) throw new Error('Failed to fetch categories')
    return response.json()
  },

  async get(id: number, token: string): Promise<IntegrationData> {
    const response = await fetch(`${API_BASE_URL}/integrations/${id}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    if (!response.ok) throw new Error('Failed to fetch integration')
    return response.json()
  },

  async create(data: Omit<IntegrationData, 'id' | 'created_at' | 'updated_at'>, token: string): Promise<IntegrationData> {
    const response = await fetch(`${API_BASE_URL}/integrations/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    })
    if (!response.ok) throw new Error('Failed to create integration')
    return response.json()
  },

  async update(id: number, data: Partial<IntegrationData>, token: string): Promise<IntegrationData> {
    const response = await fetch(`${API_BASE_URL}/integrations/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    })
    if (!response.ok) throw new Error('Failed to update integration')
    return response.json()
  },

  async delete(id: number, token: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/integrations/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    })
    if (!response.ok) throw new Error('Failed to delete integration')
  }
}
