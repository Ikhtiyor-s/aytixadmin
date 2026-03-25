import api from '@/services/api'

export interface DashboardStats {
  period: string
  users: { total: number; active: number; current_period: number; growth: number }
  projects: { total: number; current_period: number; growth: number }
  views: { total: number; growth: number }
  messages: { total: number; new: number }
  revenue: { total: number; growth: number }
  leads: { total: number; growth: number }
  conversion: { rate: number; growth: number }
  partners: number
  integrations: number
  content: { news: number; banners: number }
}

export interface AnalyticsData {
  period: string
  period_label: string
  period_stats: { views: number; users: number; messages: number }
  monthly_data: Array<{ month: string; year: number; users: number; projects: number; messages: number; views: number }>
  daily_data: Array<{ day: string; date: string; users: number; messages: number; views: number }>
  top_projects: Array<{ id: number; title: string; views: number; leads: number; conversion: number; revenue: number; trend: number }>
  categories: Array<{ name: string; value: number; views: number; color: string }>
  message_stats: { new: number; read: number; replied: number; archived: number }
  user_roles: { admin: number; seller: number; user: number }
  recent_users: Array<{ id: number; username: string; email: string; created_at: string | null }>
  recent_messages: Array<{ id: number; name: string; subject: string; status: string; created_at: string | null }>
  recent_activities: Array<{ type: string; title: string; description: string; time: string | null; icon: string }>
}

export const dashboardApi = {
  async getStats(period = 'weekly'): Promise<DashboardStats> {
    const res = await api.get('/admin/dashboard-stats', { params: { period } })
    return res.data
  },
  async getAnalytics(period = 'weekly', category = 'all'): Promise<AnalyticsData> {
    const res = await api.get('/admin/analytics', { params: { period, category } })
    return res.data
  },
}
