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

// ============== FAQ INTERFACE ==============

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

// ============== API FUNCTIONS ==============

export const faqApi = {
  // ============== PUBLIC ==============
  async getPublicFAQs(category?: string): Promise<FAQ[]> {
    const url = category
      ? `${API_BASE_URL}/faq/public?category=${encodeURIComponent(category)}`
      : `${API_BASE_URL}/faq/public`
    const response = await fetch(url)
    return handleResponse(response)
  },

  async getCategories(): Promise<string[]> {
    const response = await fetch(`${API_BASE_URL}/faq/categories`)
    return handleResponse(response)
  },

  // ============== ADMIN ==============
  async getFAQs(token: string, category?: string, status?: string): Promise<FAQ[]> {
    let url = `${API_BASE_URL}/faq`
    const params = new URLSearchParams()
    if (category) params.append('category', category)
    if (status) params.append('status', status)
    if (params.toString()) url += `?${params.toString()}`

    const response = await fetch(url, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    return handleResponse(response)
  },

  async getFAQ(id: number, token: string): Promise<FAQ> {
    const response = await fetch(`${API_BASE_URL}/faq/${id}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    return handleResponse(response)
  },

  async createFAQ(data: Omit<FAQ, 'id' | 'created_at' | 'updated_at'>, token: string): Promise<FAQ> {
    const response = await fetch(`${API_BASE_URL}/faq`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    })
    return handleResponse(response)
  },

  async updateFAQ(id: number, data: Partial<FAQ>, token: string): Promise<FAQ> {
    const response = await fetch(`${API_BASE_URL}/faq/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    })
    return handleResponse(response)
  },

  async deleteFAQ(id: number, token: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/faq/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    })
    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        throw new Error('Not authenticated - Sessiya muddati tugagan')
      }
      throw new Error('FAQ ni o\'chirishda xatolik')
    }
  },

  async toggleFAQ(id: number, token: string): Promise<FAQ> {
    const response = await fetch(`${API_BASE_URL}/faq/${id}/toggle`, {
      method: 'PATCH',
      headers: { 'Authorization': `Bearer ${token}` }
    })
    return handleResponse(response)
  },

  async reorderFAQs(items: ReorderItem[], token: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/faq/reorder`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ items })
    })
    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        throw new Error('Not authenticated - Sessiya muddati tugagan')
      }
      throw new Error('Tartibni yangilashda xatolik')
    }
  }
}
