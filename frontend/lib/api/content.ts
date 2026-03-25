import api from '@/services/api'

export type ContentStatus = 'active' | 'inactive'
export type TargetAudience = 'all' | 'users' | 'sellers' | 'admins'

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

export interface BannerData {
  id?: number
  title_uz: string
  title_ru?: string
  title_en?: string
  description_uz?: string
  description_ru?: string
  description_en?: string
  image_url?: string
  video_url?: string
  link_url?: string
  project_id?: number
  order?: number
  status?: ContentStatus
  created_at?: string
  updated_at?: string
}

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
  async getNews(): Promise<NewsData[]> {
    const res = await api.get('/content/news')
    return res.data
  },
  async createNews(data: Omit<NewsData, 'id' | 'views' | 'created_at' | 'updated_at'>): Promise<NewsData> {
    const res = await api.post('/content/news', data)
    return res.data
  },
  async updateNews(id: number, data: Partial<NewsData>): Promise<NewsData> {
    const res = await api.put(`/content/news/${id}`, data)
    return res.data
  },
  async deleteNews(id: number): Promise<void> {
    await api.delete(`/content/news/${id}`)
  },

  async getBanners(): Promise<BannerData[]> {
    const res = await api.get('/content/banners')
    return res.data
  },
  async createBanner(data: Omit<BannerData, 'id' | 'created_at' | 'updated_at'>): Promise<BannerData> {
    const res = await api.post('/content/banners', data)
    return res.data
  },
  async updateBanner(id: number, data: Partial<BannerData>): Promise<BannerData> {
    const res = await api.put(`/content/banners/${id}`, data)
    return res.data
  },
  async deleteBanner(id: number): Promise<void> {
    await api.delete(`/content/banners/${id}`)
  },

  async getNotifications(): Promise<NotificationData[]> {
    const res = await api.get('/content/notifications')
    return res.data
  },
  async createNotification(data: Omit<NotificationData, 'id' | 'created_at' | 'updated_at'>): Promise<NotificationData> {
    const res = await api.post('/content/notifications', data)
    return res.data
  },
  async updateNotification(id: number, data: Partial<NotificationData>): Promise<NotificationData> {
    const res = await api.put(`/content/notifications/${id}`, data)
    return res.data
  },
  async deleteNotification(id: number): Promise<void> {
    await api.delete(`/content/notifications/${id}`)
  }
}
