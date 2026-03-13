const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'

export interface UserData {
  id: number
  phone: string
  username: string
  full_name?: string
  role: 'user' | 'seller' | 'admin'
  is_active: boolean
  created_at: string
}

export interface UsersListParams {
  skip?: number
  limit?: number
}

export const usersApi = {
  async list(params: UsersListParams = {}, token: string): Promise<UserData[]> {
    const queryParams = new URLSearchParams()
    if (params.skip !== undefined) queryParams.append('skip', params.skip.toString())
    if (params.limit !== undefined) queryParams.append('limit', params.limit.toString())

    const response = await fetch(`${API_BASE_URL}/users/?${queryParams}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    if (!response.ok) throw new Error('Failed to fetch users')
    return response.json()
  },

  async get(id: number, token: string): Promise<UserData> {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    if (!response.ok) throw new Error('Failed to fetch user')
    return response.json()
  },

  async update(id: number, data: { full_name?: string; phone?: string; username?: string; role?: string }, token: string): Promise<UserData> {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    })
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || 'Failed to update user')
    }
    return response.json()
  },

  async updateRole(id: number, role: string, token: string): Promise<UserData> {
    const response = await fetch(`${API_BASE_URL}/users/${id}/role`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ role })
    })
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || 'Failed to update user role')
    }
    return response.json()
  },

  async toggleActive(id: number, is_active: boolean, token: string): Promise<UserData> {
    const response = await fetch(`${API_BASE_URL}/users/${id}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ is_active })
    })
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || 'Failed to update user status')
    }
    return response.json()
  },

  async delete(id: number, token: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || 'Failed to delete user')
    }
  }
}
