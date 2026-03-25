import api from '@/services/api'

export interface MonthlyData {
  month: string
  year: number
  users: number
  projects: number
  messages: number
  views: number
}

export interface DailyData {
  day: string
  date: string
  users: number
  messages: number
}

export interface TopProject {
  id: number
  title: string
  views: number
}

export interface MessageStats {
  new: number
  read: number
  replied: number
  archived: number
}

export interface UserRoles {
  admin: number
  seller: number
  buyer: number
}

export interface RecentUser {
  id: number
  username: string
  email: string
  created_at: string | null
}

export interface RecentMessage {
  id: number
  name: string
  subject: string
  status: string
  created_at: string | null
}

export interface AnalyticsData {
  monthly_data: MonthlyData[]
  daily_data: DailyData[]
  top_projects: TopProject[]
  message_stats: MessageStats
  user_roles: UserRoles
  recent_users: RecentUser[]
  recent_messages: RecentMessage[]
}

export const analyticsApi = {
  async getAnalytics(): Promise<AnalyticsData> {
    const res = await api.get('/admin/analytics')
    return res.data
  }
}
