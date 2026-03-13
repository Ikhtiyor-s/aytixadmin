const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'

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
  async list(token: string): Promise<AIFeatureData[]> {
    const response = await fetch(`${API_BASE_URL}/ai-features/`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    if (!response.ok) throw new Error('Failed to fetch AI features')
    return response.json()
  },

  async getCategories(token: string): Promise<string[]> {
    const response = await fetch(`${API_BASE_URL}/ai-features/categories`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    if (!response.ok) throw new Error('Failed to fetch categories')
    return response.json()
  },

  async get(id: number, token: string): Promise<AIFeatureData> {
    const response = await fetch(`${API_BASE_URL}/ai-features/${id}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    if (!response.ok) throw new Error('Failed to fetch AI feature')
    return response.json()
  },

  async create(data: Omit<AIFeatureData, 'id' | 'created_at' | 'updated_at'>, token: string): Promise<AIFeatureData> {
    const response = await fetch(`${API_BASE_URL}/ai-features/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    })
    if (!response.ok) throw new Error('Failed to create AI feature')
    return response.json()
  },

  async update(id: number, data: Partial<AIFeatureData>, token: string): Promise<AIFeatureData> {
    const response = await fetch(`${API_BASE_URL}/ai-features/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    })
    if (!response.ok) throw new Error('Failed to update AI feature')
    return response.json()
  },

  async delete(id: number, token: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/ai-features/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    })
    if (!response.ok) throw new Error('Failed to delete AI feature')
  }
}
