const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'

export interface MessageData {
  id: number
  name: string
  email: string
  phone?: string
  subject: string
  message: string
  status: 'new' | 'read' | 'replied' | 'archived'
  reply?: string
  replied_at?: string
  created_at: string
  updated_at?: string
}

export const messagesApi = {
  async list(token: string, status?: string): Promise<MessageData[]> {
    const params = status ? `?status_filter=${status}` : ''
    const response = await fetch(`${API_BASE_URL}/messages/${params}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    if (!response.ok) throw new Error('Failed to fetch messages')
    return response.json()
  },

  async getStats(token: string): Promise<{ total: number; new: number; read: number; replied: number; archived: number }> {
    const response = await fetch(`${API_BASE_URL}/messages/stats`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    if (!response.ok) throw new Error('Failed to fetch stats')
    return response.json()
  },

  async get(id: number, token: string): Promise<MessageData> {
    const response = await fetch(`${API_BASE_URL}/messages/${id}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    if (!response.ok) throw new Error('Failed to fetch message')
    return response.json()
  },

  async update(id: number, data: { status?: string; reply?: string }, token: string): Promise<MessageData> {
    const response = await fetch(`${API_BASE_URL}/messages/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    })
    if (!response.ok) throw new Error('Failed to update message')
    return response.json()
  },

  async delete(id: number, token: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/messages/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    })
    if (!response.ok) throw new Error('Failed to delete message')
  }
}
