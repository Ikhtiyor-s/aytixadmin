const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'

export interface DashboardStats {
  period?: string
  users: {
    total: number
    active: number
    current_period?: number
    new_this_month?: number
    new_this_week?: number
    growth: number
  }
  projects: {
    total: number
    views?: number
    current_period?: number
    new_this_month?: number
    growth?: number
  }
  views?: {
    total: number
    growth: number
  }
  messages: {
    total: number
    new: number
  }
  revenue?: {
    total: number
    growth: number
  }
  leads?: {
    total: number
    growth: number
  }
  conversion?: {
    rate: number
    growth: number
  }
  partners?: number
  integrations?: number
  content?: {
    news: number
    banners: number
  }
}

export interface AnalyticsData {
  period: string
  period_label: string
  period_stats: {
    views: number
    users: number
    messages: number
  }
  monthly_data: Array<{
    month: string
    year: number
    users: number
    projects: number
    messages: number
    views: number
  }>
  daily_data: Array<{
    day: string
    date: string
    users: number
    messages: number
    views: number
  }>
  top_projects: Array<{
    id: number
    title: string
    views: number
    leads: number
    conversion: number
    revenue: number
    trend: number
  }>
  categories: Array<{
    name: string
    value: number
    views?: number
    color: string
  }>
  message_stats: {
    new: number
    read: number
    replied: number
    archived: number
  }
  user_roles: {
    admin: number
    seller: number
    buyer: number
  }
  recent_users: Array<{
    id: number
    username: string
    email: string
    created_at: string | null
  }>
  recent_messages: Array<{
    id: number
    name: string
    subject: string
    status: string
    created_at: string | null
  }>
  recent_activities: Array<{
    type: string
    title: string
    description: string
    time: string | null
    icon: string
  }>
}

export const dashboardApi = {
  async getStats(token: string, period: string = 'weekly'): Promise<DashboardStats> {
    const response = await fetch(`${API_BASE_URL}/admin/dashboard-stats?period=${period}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    if (!response.ok) throw new Error('Failed to fetch dashboard stats')
    return response.json()
  },

  async getAnalytics(token: string, period: string = 'weekly', category: string = 'all'): Promise<AnalyticsData> {
    const response = await fetch(`${API_BASE_URL}/admin/analytics?period=${period}&category=${category}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    if (!response.ok) throw new Error('Failed to fetch analytics')
    return response.json()
  }
}
