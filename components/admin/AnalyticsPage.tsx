'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { analyticsApi, AnalyticsData } from '@/lib/api/analytics'
import { Icons } from './Icons'
import { Translations } from '@/lib/admin/translations'

interface AnalyticsPageProps {
  t: Translations
}

export default function AnalyticsPage({ t }: AnalyticsPageProps) {
  const { token, loading: authLoading } = useAuth()
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'projects' | 'messages'>('overview')

  useEffect(() => {
    if (!authLoading && token) loadAnalytics()
  }, [token, authLoading])

  const loadAnalytics = async () => {
    try {
      setLoading(true)
      const data = await analyticsApi.getAnalytics(token!)
      setAnalytics(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (authLoading || loading || !analytics) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00a6a6]"></div>
      </div>
    )
  }

  const totalUsers = analytics.monthly_data.reduce((sum, m) => sum + m.users, 0)
  const totalProjects = analytics.monthly_data.reduce((sum, m) => sum + m.projects, 0)
  const totalMessages = analytics.monthly_data.reduce((sum, m) => sum + m.messages, 0)
  const totalViews = analytics.monthly_data.reduce((sum, m) => sum + m.views, 0)
  const maxMonthlyValue = Math.max(...analytics.monthly_data.map(m => Math.max(m.users, m.projects, m.messages)))

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Tahlillar</h1>
          <p className="text-sm text-gray-500">Platforma statistikasi va tahlillari</p>
        </div>
        <button
          onClick={loadAnalytics}
          className="px-4 py-2 bg-[#00a6a6] hover:bg-[#008f8f] text-white rounded-xl text-sm font-medium flex items-center gap-2 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Yangilash
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-2 border border-gray-200 dark:border-gray-700">
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'overview', label: 'Umumiy', icon: Icons.dashboard },
            { id: 'users', label: 'Foydalanuvchilar', icon: Icons.users },
            { id: 'projects', label: 'Loyihalar', icon: Icons.projects },
            { id: 'messages', label: 'Xabarlar', icon: Icons.messages }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'bg-[#00a6a6] text-white'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-4">
          {/* Summary Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="bg-gradient-to-br from-[#00a6a6] to-[#008080] rounded-xl p-4 text-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  {Icons.users}
                </div>
                <div>
                  <p className="text-2xl font-bold">{totalUsers}</p>
                  <p className="text-xs text-white/80">Jami foydalanuvchilar</p>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-[#0a2d5c] to-[#1e3a5f] rounded-xl p-4 text-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  {Icons.projects}
                </div>
                <div>
                  <p className="text-2xl font-bold">{totalProjects}</p>
                  <p className="text-xs text-white/80">Jami loyihalar</p>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-[#6366f1] to-[#4f46e5] rounded-xl p-4 text-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  {Icons.messages}
                </div>
                <div>
                  <p className="text-2xl font-bold">{totalMessages}</p>
                  <p className="text-xs text-white/80">Jami xabarlar</p>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-[#f59e0b] to-[#d97706] rounded-xl p-4 text-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  {Icons.eye}
                </div>
                <div>
                  <p className="text-2xl font-bold">{totalViews}</p>
                  <p className="text-xs text-white/80">Jami ko'rishlar</p>
                </div>
              </div>
            </div>
          </div>

          {/* Monthly Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Oylik statistika</h3>
            <div className="flex items-end gap-2 h-48">
              {analytics.monthly_data.map((month, index) => (
                <div key={index} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full flex flex-col gap-0.5" style={{ height: '160px' }}>
                    <div
                      className="w-full bg-[#00a6a6] rounded-t"
                      style={{ height: `${maxMonthlyValue > 0 ? (month.users / maxMonthlyValue) * 100 : 0}%` }}
                      title={`Foydalanuvchilar: ${month.users}`}
                    ></div>
                    <div
                      className="w-full bg-[#0a2d5c]"
                      style={{ height: `${maxMonthlyValue > 0 ? (month.projects / maxMonthlyValue) * 100 : 0}%` }}
                      title={`Loyihalar: ${month.projects}`}
                    ></div>
                    <div
                      className="w-full bg-[#6366f1] rounded-b"
                      style={{ height: `${maxMonthlyValue > 0 ? (month.messages / maxMonthlyValue) * 100 : 0}%` }}
                      title={`Xabarlar: ${month.messages}`}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-500">{month.month}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-[#00a6a6] rounded"></div>
                <span className="text-xs text-gray-500">Foydalanuvchilar</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-[#0a2d5c] rounded"></div>
                <span className="text-xs text-gray-500">Loyihalar</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-[#6366f1] rounded"></div>
                <span className="text-xs text-gray-500">Xabarlar</span>
              </div>
            </div>
          </div>

          {/* Daily Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Oxirgi 7 kun</h3>
            <div className="grid grid-cols-7 gap-2">
              {analytics.daily_data.map((day, index) => {
                const maxDaily = Math.max(...analytics.daily_data.map(d => d.users + d.messages))
                const dayTotal = day.users + day.messages
                return (
                  <div key={index} className="flex flex-col items-center gap-2">
                    <div className="w-full h-24 bg-gray-100 dark:bg-gray-700 rounded-lg flex flex-col justify-end overflow-hidden">
                      <div
                        className="w-full bg-gradient-to-t from-[#00a6a6] to-[#00a6a6]/60 transition-all"
                        style={{ height: `${maxDaily > 0 ? (dayTotal / maxDaily) * 100 : 0}%` }}
                      ></div>
                    </div>
                    <div className="text-center">
                      <p className="text-xs font-medium text-gray-900 dark:text-white">{day.day}</p>
                      <p className="text-xs text-gray-500">{day.date}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Top Projects & Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Top Projects */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Eng ko'p ko'rilgan loyihalar</h3>
              <div className="space-y-3">
                {analytics.top_projects.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-4">Loyihalar topilmadi</p>
                ) : analytics.top_projects.map((project, index) => (
                  <div key={project.id} className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm ${
                      index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-amber-600' : 'bg-gray-300'
                    }`}>
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 dark:text-white text-sm truncate">{project.title}</p>
                    </div>
                    <div className="flex items-center gap-1 text-gray-500">
                      {Icons.eye}
                      <span className="text-sm">{project.views}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">So'nggi faoliyat</h3>
              <div className="space-y-3">
                {analytics.recent_users.slice(0, 3).map(user => (
                  <div key={user.id} className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#00a6a6]/10 rounded-lg flex items-center justify-center text-[#00a6a6]">
                      {Icons.user}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{user.username}</p>
                      <p className="text-xs text-gray-500">Yangi foydalanuvchi</p>
                    </div>
                    <span className="text-xs text-gray-400">
                      {user.created_at ? new Date(user.created_at).toLocaleDateString('uz') : '-'}
                    </span>
                  </div>
                ))}
                {analytics.recent_messages.slice(0, 2).map(msg => (
                  <div key={msg.id} className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-purple-500/10 rounded-lg flex items-center justify-center text-purple-500">
                      {Icons.messages}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{msg.name}</p>
                      <p className="text-xs text-gray-500 truncate">{msg.subject}</p>
                    </div>
                    <span className="text-xs text-gray-400">
                      {msg.created_at ? new Date(msg.created_at).toLocaleDateString('uz') : '-'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          {/* User Roles Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Foydalanuvchi rollari</h3>
              <div className="space-y-4">
                {Object.entries(analytics.user_roles).map(([role, count]) => {
                  const total = Object.values(analytics.user_roles).reduce((a, b) => a + b, 0)
                  const percentage = total > 0 ? Math.round((count / total) * 100) : 0
                  const colors: Record<string, string> = {
                    admin: 'bg-red-500',
                    seller: 'bg-blue-500',
                    buyer: 'bg-green-500'
                  }
                  const labels: Record<string, string> = {
                    admin: 'Adminlar',
                    seller: 'Sotuvchilar',
                    buyer: 'Xaridorlar'
                  }
                  return (
                    <div key={role}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{labels[role]}</span>
                        <span className="text-sm text-gray-500">{count} ({percentage}%)</span>
                      </div>
                      <div className="w-full h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div className={`h-full ${colors[role]} transition-all`} style={{ width: `${percentage}%` }}></div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Recent Users */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">So'nggi foydalanuvchilar</h3>
              <div className="space-y-3">
                {analytics.recent_users.map(user => (
                  <div key={user.id} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#00a6a6] to-[#0a2d5c] rounded-lg flex items-center justify-center text-white">
                      {Icons.user}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 dark:text-white">{user.username}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                    <span className="text-xs text-gray-400">
                      {user.created_at ? new Date(user.created_at).toLocaleDateString('uz') : '-'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Projects Tab */}
      {activeTab === 'projects' && (
        <div className="space-y-4">
          {/* Top Projects Table */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="p-5 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Eng mashhur loyihalar</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">#</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Loyiha nomi</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Ko'rishlar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {analytics.top_projects.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="px-6 py-8 text-center text-gray-500">Loyihalar topilmadi</td>
                    </tr>
                  ) : analytics.top_projects.map((project, index) => (
                    <tr key={project.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="px-6 py-4">
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          index === 0 ? 'bg-yellow-100 text-yellow-700' :
                          index === 1 ? 'bg-gray-100 text-gray-700' :
                          index === 2 ? 'bg-amber-100 text-amber-700' :
                          'bg-gray-50 text-gray-500'
                        }`}>
                          {index + 1}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{project.title}</td>
                      <td className="px-6 py-4 text-right">
                        <span className="inline-flex items-center gap-1 text-gray-600 dark:text-gray-300">
                          {Icons.eye}
                          {project.views}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Messages Tab */}
      {activeTab === 'messages' && (
        <div className="space-y-4">
          {/* Message Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {Object.entries(analytics.message_stats).map(([status, count]) => {
              const colors: Record<string, string> = {
                new: 'from-blue-500 to-blue-600',
                read: 'from-gray-500 to-gray-600',
                replied: 'from-green-500 to-green-600',
                archived: 'from-orange-500 to-orange-600'
              }
              const labels: Record<string, string> = {
                new: 'Yangi',
                read: "O'qilgan",
                replied: 'Javob berilgan',
                archived: 'Arxivlangan'
              }
              return (
                <div key={status} className={`bg-gradient-to-br ${colors[status]} rounded-xl p-4 text-white`}>
                  <p className="text-2xl font-bold">{count}</p>
                  <p className="text-xs text-white/80">{labels[status]}</p>
                </div>
              )
            })}
          </div>

          {/* Recent Messages */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="p-5 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">So'nggi xabarlar</h3>
            </div>
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {analytics.recent_messages.length === 0 ? (
                <div className="px-6 py-8 text-center text-gray-500">Xabarlar topilmadi</div>
              ) : analytics.recent_messages.map(msg => {
                const statusColors: Record<string, string> = {
                  new: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
                  read: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
                  replied: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
                  archived: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                }
                const statusLabels: Record<string, string> = {
                  new: 'Yangi',
                  read: "O'qilgan",
                  replied: 'Javob berilgan',
                  archived: 'Arxivlangan'
                }
                return (
                  <div key={msg.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900 dark:text-white">{msg.name}</span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[msg.status] || statusColors.new}`}>
                        {statusLabels[msg.status] || 'Yangi'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{msg.subject}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {msg.created_at ? new Date(msg.created_at).toLocaleString('uz') : '-'}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
