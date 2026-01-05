const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'

export interface ProjectData {
  id?: number
  name_uz: string
  name_ru?: string
  name_en?: string
  description_uz: string
  description_ru?: string
  description_en?: string
  category: string
  subcategory?: string
  technologies?: string[]
  features?: string[]
  integrations?: string[]
  color?: string
  image_url?: string
  video_url?: string
  videos?: string[]
  images?: string[]
  status?: 'active' | 'inactive'
  is_top?: boolean
  is_new?: boolean
  views?: number
  favorites?: number
  created_at?: string
  updated_at?: string
}

export interface ProjectsListParams {
  skip?: number
  limit?: number
  category?: string
  status?: 'active' | 'inactive'
  is_top?: boolean
  is_new?: boolean
  search?: string
}

export const projectsApi = {
  async list(params: ProjectsListParams = {}): Promise<ProjectData[]> {
    const queryParams = new URLSearchParams()
    if (params.skip !== undefined) queryParams.append('skip', params.skip.toString())
    if (params.limit !== undefined) queryParams.append('limit', params.limit.toString())
    if (params.category) queryParams.append('category', params.category)
    if (params.status) queryParams.append('status', params.status)
    if (params.is_top !== undefined) queryParams.append('is_top', params.is_top.toString())
    if (params.is_new !== undefined) queryParams.append('is_new', params.is_new.toString())
    if (params.search) queryParams.append('search', params.search)

    const response = await fetch(`${API_BASE_URL}/projects/?${queryParams}`)
    if (!response.ok) {
      throw new Error('Failed to fetch projects')
    }
    return response.json()
  },

  async get(id: number): Promise<ProjectData> {
    const response = await fetch(`${API_BASE_URL}/projects/${id}`)
    if (!response.ok) {
      throw new Error('Failed to fetch project')
    }
    return response.json()
  },

  async create(data: Omit<ProjectData, 'id' | 'views' | 'favorites' | 'created_at' | 'updated_at'>, token: string): Promise<ProjectData> {
    const response = await fetch(`${API_BASE_URL}/projects/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    })
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || 'Failed to create project')
    }
    return response.json()
  },

  async update(id: number, data: Partial<Omit<ProjectData, 'id' | 'views' | 'favorites' | 'created_at' | 'updated_at'>>, token: string): Promise<ProjectData> {
    const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    })
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || 'Failed to update project')
    }
    return response.json()
  },

  async delete(id: number, token: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || 'Failed to delete project')
    }
  },

  async toggleFavorite(id: number, token: string): Promise<ProjectData> {
    const response = await fetch(`${API_BASE_URL}/projects/${id}/favorite`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    if (!response.ok) {
      throw new Error('Failed to toggle favorite')
    }
    return response.json()
  }
}
