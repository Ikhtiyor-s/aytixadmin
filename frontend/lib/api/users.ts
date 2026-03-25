import api from '@/services/api'

export interface UserData {
  id: number
  phone: string
  username: string
  full_name?: string
  role: 'user' | 'seller' | 'admin'
  is_active: boolean
  created_at: string
}

export const usersApi = {
  async list(params: { skip?: number; limit?: number } = {}): Promise<UserData[]> {
    const res = await api.get('/users/', { params })
    return res.data
  },
  async get(id: number): Promise<UserData> {
    const res = await api.get(`/users/${id}`)
    return res.data
  },
  async update(id: number, data: Partial<UserData>): Promise<UserData> {
    const res = await api.put(`/users/${id}`, data)
    return res.data
  },
  async updateRole(id: number, role: string): Promise<UserData> {
    const res = await api.put(`/users/${id}/role`, { role })
    return res.data
  },
  async toggleActive(id: number, is_active: boolean): Promise<UserData> {
    const res = await api.put(`/users/${id}/status`, { is_active })
    return res.data
  },
  async delete(id: number): Promise<void> {
    await api.delete(`/users/${id}`)
  },
}
