import api from '@/services/api'

export interface MessageData {
  id: number
  name: string
  email?: string
  phone?: string
  subject?: string
  message: string
  status: string
  reply?: string
  created_at: string
  updated_at?: string
}

export const messagesApi = {
  async list(status?: string): Promise<MessageData[]> {
    const res = await api.get('/messages/', { params: status ? { status } : {} })
    return res.data
  },
  async getStats(): Promise<{ total: number; new: number; read: number; replied: number; archived: number }> {
    const res = await api.get('/messages/stats')
    return res.data
  },
  async get(id: number): Promise<MessageData> {
    const res = await api.get(`/messages/${id}`)
    return res.data
  },
  async update(id: number, data: { status?: string; reply?: string }): Promise<MessageData> {
    const res = await api.put(`/messages/${id}`, data)
    return res.data
  },
  async delete(id: number): Promise<void> {
    await api.delete(`/messages/${id}`)
  },
}
