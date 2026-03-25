import api from '@/services/api'

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
  is_verified?: boolean
  views?: number
  favorites?: number
  created_at?: string
  updated_at?: string
}

export const projectsApi = {
  async list(params: { skip?: number; limit?: number; category?: string; status?: string; is_top?: boolean; is_new?: boolean; search?: string } = {}): Promise<ProjectData[]> {
    const res = await api.get('/projects/', { params })
    return res.data
  },
  async get(id: number): Promise<ProjectData> {
    const res = await api.get(`/projects/${id}`)
    return res.data
  },
  async create(data: Partial<ProjectData>): Promise<ProjectData> {
    const res = await api.post('/projects/', data)
    return res.data
  },
  async update(id: number, data: Partial<ProjectData>): Promise<ProjectData> {
    const res = await api.put(`/projects/${id}`, data)
    return res.data
  },
  async delete(id: number): Promise<void> {
    await api.delete(`/projects/${id}`)
  },
}
