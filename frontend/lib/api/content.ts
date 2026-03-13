const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'

export type ContentStatus = 'active' | 'inactive'
export type TargetAudience = 'all' | 'users' | 'sellers' | 'admins'

// News interfaces
export interface NewsData {
  id?: number
  title_uz: string
  title_ru?: string
  title_en?: string
  content_uz: string
  content_ru?: string
  content_en?: string
  image_url?: string
  target?: TargetAudience
  status?: ContentStatus
  views?: number
  created_at?: string
  updated_at?: string
}

// Banner interfaces
export interface BannerData {
  id?: number
  title_uz: string
  title_ru?: string
  title_en?: string
  description_uz?: string
  description_ru?: string
  description_en?: string
  image_url?: string
  video_url?: string  // Video yoki GIF URL
  link_url?: string
  project_id?: number
  order?: number
  status?: ContentStatus
  created_at?: string
  updated_at?: string
}

// Notification interfaces
export interface NotificationData {
  id?: number
  title_uz: string
  title_ru?: string
  title_en?: string
  message_uz?: string
  message_ru?: string
  message_en?: string
  icon?: string
  target?: TargetAudience
  scheduled_at?: string
  status?: ContentStatus
  created_at?: string
  updated_at?: string
}

export const contentApi = {
  // News API
  async getNews(token: string): Promise<NewsData[]> {
    const response = await fetch(`${API_BASE_URL}/content/news`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    if (!response.ok) throw new Error('Failed to fetch news')
    return response.json()
  },

  async createNews(data: Omit<NewsData, 'id' | 'views' | 'created_at' | 'updated_at'>, token: string): Promise<NewsData> {
    const response = await fetch(`${API_BASE_URL}/content/news`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    })
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || 'Failed to create news')
    }
    return response.json()
  },

  async updateNews(id: number, data: Partial<NewsData>, token: string): Promise<NewsData> {
    const response = await fetch(`${API_BASE_URL}/content/news/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    })
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || 'Failed to update news')
    }
    return response.json()
  },

  async deleteNews(id: number, token: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/content/news/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    })
    if (!response.ok) throw new Error('Failed to delete news')
  },

  // Banner API
  async getBanners(token: string): Promise<BannerData[]> {
    const response = await fetch(`${API_BASE_URL}/content/banners`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    if (!response.ok) throw new Error('Failed to fetch banners')
    return response.json()
  },

  async createBanner(data: Omit<BannerData, 'id' | 'created_at' | 'updated_at'>, token: string): Promise<BannerData> {
    const response = await fetch(`${API_BASE_URL}/content/banners`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    })
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || 'Failed to create banner')
    }
    return response.json()
  },

  async updateBanner(id: number, data: Partial<BannerData>, token: string): Promise<BannerData> {
    const response = await fetch(`${API_BASE_URL}/content/banners/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    })
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || 'Failed to update banner')
    }
    return response.json()
  },

  async deleteBanner(id: number, token: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/content/banners/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    })
    if (!response.ok) throw new Error('Failed to delete banner')
  },

  // Notification API
  async getNotifications(token: string): Promise<NotificationData[]> {
    const response = await fetch(`${API_BASE_URL}/content/notifications`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    if (!response.ok) throw new Error('Failed to fetch notifications')
    return response.json()
  },

  async createNotification(data: Omit<NotificationData, 'id' | 'created_at' | 'updated_at'>, token: string): Promise<NotificationData> {
    const response = await fetch(`${API_BASE_URL}/content/notifications`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    })
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || 'Failed to create notification')
    }
    return response.json()
  },

  async updateNotification(id: number, data: Partial<NotificationData>, token: string): Promise<NotificationData> {
    const response = await fetch(`${API_BASE_URL}/content/notifications/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    })
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || 'Failed to update notification')
    }
    return response.json()
  },

  async deleteNotification(id: number, token: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/content/notifications/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    })
    if (!response.ok) throw new Error('Failed to delete notification')
  }
}
