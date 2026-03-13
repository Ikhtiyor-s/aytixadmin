'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { dashboardApi, DashboardStats, AnalyticsData } from '@/lib/api/dashboard'
import { Translations } from '@/lib/admin/translations'

interface DashboardPageProps {
  t: Translations
}

type PeriodType = 'daily' | 'weekly' | 'monthly' | 'yearly' | 'custom'

const formatNumber = (num: number): string => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
  return num.toLocaleString()
}

const formatCurrency = (num: number): string => {
  if (num >= 1000000000) return (num / 1000000000).toFixed(1) + ' mlrd'
  if (num >= 1000000) return (num / 1000000).toFixed(1) + ' mln'
  if (num >= 1000) return (num / 1000).toFixed(0) + ' ming'
  return num.toLocaleString()
}

export default function DashboardPage({ t }: DashboardPageProps) {
  const { token, loading: authLoading } = useAuth()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [period, setPeriod] = useState<PeriodType>('weekly')
  const [category, setCategory] = useState('all')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [showDatePicker, setShowDatePicker] = useState(false)

  useEffect(() => {
    if (!authLoading && token) {
      loadData()
    }
  }, [token, authLoading, period, category])

  const loadData = async () => {
    if (!token) {
      setError(t.tokenNotFoundError)
      return
    }
    try {
      setLoading(true)
      setError(null)
      const [statsData, analyticsData] = await Promise.all([
        dashboardApi.getStats(token, period === 'custom' ? 'monthly' : period),
        dashboardApi.getAnalytics(token, period === 'custom' ? 'monthly' : period, category)
      ])
      setStats(statsData)
      setAnalytics(analyticsData)
    } catch (err: unknown) {
      console.error('Dashboard error:', err)
      const errorMessage = err instanceof Error ? err.message : t.dataLoadError
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleDateFilter = () => {
    if (startDate && endDate) {
      setPeriod('custom')
      loadData()
      setShowDatePicker(false)
    }
  }

  const resetDateFilter = () => {
    setStartDate('')
    setEndDate('')
    setPeriod('weekly')
    setShowDatePicker(false)
  }

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00a6a6]"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <div className="text-red-500 text-center">
          <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p className="font-medium">{error}</p>
        </div>
        <button
          onClick={() => loadData()}
          className="px-4 py-2 bg-[#00a6a6] text-white rounded-lg hover:bg-[#008f8f] text-sm"
        >
          {t.retryAction}
        </button>
      </div>
    )
  }

  if (!stats || !analytics) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">{t.noData}</p>
      </div>
    )
  }

  const periods: { key: PeriodType; label: string }[] = [
    { key: 'daily', label: t.daily },
    { key: 'weekly', label: t.weekly },
    { key: 'monthly', label: t.monthly },
    { key: 'yearly', label: t.yearly },
    { key: 'custom', label: t.dateRange }
  ]

  const categories = [
    { key: 'all', label: t.all },
    { key: 'web', label: t.websitesLabel },
    { key: 'mobile', label: t.mobileAppsLabel },
    { key: 'ecommerce', label: t.ecommerceLabel },
    { key: 'crm', label: t.crmErpLabel },
    { key: 'ai', label: t.aiMlLabel }
  ]

  // Prepare bar chart data
  const chartData = analytics.monthly_data.slice(-8)
  const maxViews = Math.max(...chartData.map(d => d.views || 1), 1)

  // Category icons
  const categoryIcons: Record<string, { icon: string; color: string; bg: string }> = {
    'Veb-saytlar': { icon: '🌐', color: '#00a6a6', bg: 'bg-cyan-50' },
    'Web dasturlash': { icon: '🌐', color: '#00a6a6', bg: 'bg-cyan-50' },
    'Mobil ilovalar': { icon: '📱', color: '#f59e0b', bg: 'bg-amber-50' },
    'E-commerce': { icon: '🛒', color: '#10b981', bg: 'bg-emerald-50' },
    'CRM & ERP': { icon: '📊', color: '#f43f5e', bg: 'bg-rose-50' },
    'AI & ML': { icon: '🤖', color: '#8b5cf6', bg: 'bg-violet-50' },
    'AI/ML loyihalar': { icon: '🤖', color: '#8b5cf6', bg: 'bg-violet-50' },
    'Boshqalar': { icon: '📁', color: '#64748b', bg: 'bg-slate-50' }
  }

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Header */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-base xs:text-lg sm:text-xl font-bold text-gray-900 dark:text-white">{t.dashboard}</h1>
            <p className="text-[10px] xs:text-xs text-gray-500 dark:text-gray-400">Dashboard</p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-1.5 xs:gap-2">
          {/* Period Tabs */}
          <div className="flex bg-gray-100 dark:bg-gray-700 rounded-md xs:rounded-lg p-0.5 overflow-x-auto">
            {periods.map((p) => (
              <button
                key={p.key}
                onClick={() => {
                  if (p.key === 'custom') {
                    setShowDatePicker(true)
                  } else {
                    setPeriod(p.key)
                    setShowDatePicker(false)
                  }
                }}
                className={`px-1.5 xs:px-2 sm:px-3 py-1 xs:py-1.5 rounded-md text-[10px] xs:text-xs font-medium transition-all whitespace-nowrap ${
                  period === p.key
                    ? 'bg-[#00a6a6] text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Category Dropdown */}
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-2 xs:px-3 py-1 xs:py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-md xs:rounded-lg text-[10px] xs:text-xs text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#00a6a6]"
          >
            {categories.map((c) => (
              <option key={c.key} value={c.key}>{c.label}</option>
            ))}
          </select>

          {/* Taqqoslash Button */}
          <button className="px-2 xs:px-3 py-1 xs:py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-md xs:rounded-lg text-[10px] xs:text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-1 xs:gap-1.5">
            <svg className="w-3 h-3 xs:w-3.5 xs:h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <span className="hidden xs:inline">{t.compare}</span>
          </button>

          {/* Export Button */}
          <button className="px-2 xs:px-3 py-1 xs:py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-md xs:rounded-lg text-[10px] xs:text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-1 xs:gap-1.5">
            <svg className="w-3 h-3 xs:w-3.5 xs:h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span className="hidden xs:inline">{t.exportData}</span>
          </button>
        </div>
      </div>

      {/* Date Range Picker */}
      {showDatePicker && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 dark:text-gray-400">{t.from}:</span>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="px-3 py-1.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-xs"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 dark:text-gray-400">{t.to}:</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="px-3 py-1.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-xs"
              />
            </div>
            <button
              onClick={handleDateFilter}
              className="px-4 py-1.5 bg-[#00a6a6] hover:bg-[#008f8f] text-white rounded-lg text-xs font-medium"
            >
              {t.apply}
            </button>
            <button
              onClick={resetDateFilter}
              className="px-4 py-1.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-xs font-medium"
            >
              {t.cancel}
            </button>
          </div>
        </div>
      )}

      {/* Stats Banner */}
      <div className="bg-gradient-to-r from-[#00a6a6] to-[#008080] rounded-lg xs:rounded-xl p-3 xs:p-4 sm:p-5 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 xs:w-40 h-32 xs:h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-2 xs:gap-3">
            <div className="w-8 h-8 xs:w-10 xs:h-10 sm:w-12 sm:h-12 bg-white/20 rounded-lg xs:rounded-xl flex items-center justify-center">
              <svg className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <p className="text-white/70 text-[10px] xs:text-xs">{t.periodStatistics}</p>
              <p className="text-white/90 text-[10px] xs:text-xs mt-0.5">{period === 'custom' ? t.customPeriod : analytics.period_label}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl xs:text-3xl sm:text-4xl font-bold">{formatNumber(analytics.period_stats.views)}</p>
            <p className="text-white/70 text-[10px] xs:text-xs">{t.views}</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 xs:gap-3">
        {/* Users */}
        <div className="bg-white dark:bg-gray-800 rounded-lg xs:rounded-xl p-2 xs:p-3 sm:p-4 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-1.5 xs:mb-2">
            <div className="w-7 h-7 xs:w-9 xs:h-9 sm:w-10 sm:h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg xs:rounded-xl flex items-center justify-center">
              <svg className="w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <div className={`flex items-center gap-0.5 ${stats.users.growth >= 0 ? 'text-green-500' : 'text-red-500'} text-[10px] xs:text-xs font-medium`}>
              <svg className={`w-2.5 h-2.5 xs:w-3 xs:h-3 ${stats.users.growth < 0 ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
              {stats.users.growth >= 0 ? '+' : ''}{stats.users.growth}%
            </div>
          </div>
          <p className="text-lg xs:text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{formatNumber(stats.users.current_period || stats.users.total)}</p>
          <p className="text-[10px] xs:text-xs text-gray-500 dark:text-gray-400 mt-0.5">{t.users} <span className="text-gray-400">({formatNumber(stats.users.total)} {t.totalSuffix})</span></p>
        </div>

        {/* Projects */}
        <div className="bg-white dark:bg-gray-800 rounded-lg xs:rounded-xl p-2 xs:p-3 sm:p-4 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-1.5 xs:mb-2">
            <div className="w-7 h-7 xs:w-9 xs:h-9 sm:w-10 sm:h-10 bg-orange-100 dark:bg-orange-900/30 rounded-lg xs:rounded-xl flex items-center justify-center">
              <svg className="w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-5 sm:h-5 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
            <div className={`flex items-center gap-0.5 ${(stats.projects.growth || 0) >= 0 ? 'text-green-500' : 'text-red-500'} text-[10px] xs:text-xs font-medium`}>
              <svg className={`w-2.5 h-2.5 xs:w-3 xs:h-3 ${(stats.projects.growth || 0) < 0 ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
              {(stats.projects.growth || 0) >= 0 ? '+' : ''}{stats.projects.growth || 0}%
            </div>
          </div>
          <p className="text-lg xs:text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{stats.projects.current_period || stats.projects.total}</p>
          <p className="text-[10px] xs:text-xs text-gray-500 dark:text-gray-400 mt-0.5">{t.projects} <span className="text-gray-400">({stats.projects.total} {t.totalSuffix})</span></p>
        </div>

        {/* Views */}
        <div className="bg-white dark:bg-gray-800 rounded-lg xs:rounded-xl p-2 xs:p-3 sm:p-4 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-1.5 xs:mb-2">
            <div className="w-7 h-7 xs:w-9 xs:h-9 sm:w-10 sm:h-10 bg-cyan-100 dark:bg-cyan-900/30 rounded-lg xs:rounded-xl flex items-center justify-center">
              <svg className="w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-5 sm:h-5 text-cyan-600 dark:text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <div className={`flex items-center gap-0.5 ${(stats.views?.growth || 0) >= 0 ? 'text-green-500' : 'text-red-500'} text-[10px] xs:text-xs font-medium`}>
              <svg className={`w-2.5 h-2.5 xs:w-3 xs:h-3 ${(stats.views?.growth || 0) < 0 ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
              {(stats.views?.growth || 0) >= 0 ? '+' : ''}{stats.views?.growth || 0}%
            </div>
          </div>
          <p className="text-lg xs:text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{formatNumber(stats.views?.total || 0)}</p>
          <p className="text-[10px] xs:text-xs text-gray-500 dark:text-gray-400 mt-0.5">{t.views}</p>
        </div>

        {/* Revenue */}
        <div className="bg-white dark:bg-gray-800 rounded-lg xs:rounded-xl p-2 xs:p-3 sm:p-4 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-1.5 xs:mb-2">
            <div className="w-7 h-7 xs:w-9 xs:h-9 sm:w-10 sm:h-10 bg-green-100 dark:bg-green-900/30 rounded-lg xs:rounded-xl flex items-center justify-center">
              <svg className="w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-5 sm:h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className={`flex items-center gap-0.5 ${(stats.revenue?.growth || 0) >= 0 ? 'text-green-500' : 'text-red-500'} text-[10px] xs:text-xs font-medium`}>
              <svg className={`w-2.5 h-2.5 xs:w-3 xs:h-3 ${(stats.revenue?.growth || 0) < 0 ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
              {(stats.revenue?.growth || 0) >= 0 ? '+' : ''}{stats.revenue?.growth || 0}%
            </div>
          </div>
          <p className="text-lg xs:text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(stats.revenue?.total || 0)}</p>
          <p className="text-[10px] xs:text-xs text-gray-500 dark:text-gray-400 mt-0.5">{t.revenue}</p>
        </div>

        {/* Leads */}
        <div className="bg-white dark:bg-gray-800 rounded-lg xs:rounded-xl p-2 xs:p-3 sm:p-4 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-1.5 xs:mb-2">
            <div className="w-7 h-7 xs:w-9 xs:h-9 sm:w-10 sm:h-10 bg-pink-100 dark:bg-pink-900/30 rounded-lg xs:rounded-xl flex items-center justify-center">
              <svg className="w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-5 sm:h-5 text-pink-600 dark:text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div className={`flex items-center gap-0.5 ${(stats.leads?.growth || 0) >= 0 ? 'text-green-500' : 'text-red-500'} text-[10px] xs:text-xs font-medium`}>
              <svg className={`w-2.5 h-2.5 xs:w-3 xs:h-3 ${(stats.leads?.growth || 0) < 0 ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
              {(stats.leads?.growth || 0) >= 0 ? '+' : ''}{stats.leads?.growth || 0}%
            </div>
          </div>
          <p className="text-lg xs:text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{stats.leads?.total || stats.messages.total || 0}</p>
          <p className="text-[10px] xs:text-xs text-gray-500 dark:text-gray-400 mt-0.5">{t.totalLeadsCount}</p>
        </div>

        {/* Conversion */}
        <div className="bg-white dark:bg-gray-800 rounded-lg xs:rounded-xl p-2 xs:p-3 sm:p-4 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-1.5 xs:mb-2">
            <div className="w-7 h-7 xs:w-9 xs:h-9 sm:w-10 sm:h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg xs:rounded-xl flex items-center justify-center">
              <svg className="w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-5 sm:h-5 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className={`flex items-center gap-0.5 ${(stats.conversion?.growth || 0) >= 0 ? 'text-green-500' : 'text-red-500'} text-[10px] xs:text-xs font-medium`}>
              <svg className={`w-2.5 h-2.5 xs:w-3 xs:h-3 ${(stats.conversion?.growth || 0) < 0 ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
              {(stats.conversion?.growth || 0) >= 0 ? '+' : ''}{stats.conversion?.growth || 0}%
            </div>
          </div>
          <p className="text-lg xs:text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{stats.conversion?.rate || 0}%</p>
          <p className="text-[10px] xs:text-xs text-gray-500 dark:text-gray-400 mt-0.5">{t.conversion}</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Traffic Chart - Bar Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-5 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">{t.trafficDynamics}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">{t.monthlyViewStats}</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 bg-gradient-to-t from-[#00a6a6] to-[#00d4d4] rounded"></span>
                {t.views}
              </span>
            </div>
          </div>

          {/* Bar Chart */}
          <div className="relative">
            <div className="flex">
              {/* Y-axis labels */}
              <div className="w-10 flex flex-col justify-between text-[10px] text-gray-400 dark:text-gray-500 pr-2" style={{ height: '180px' }}>
                <span className="text-right">{formatNumber(maxViews)}</span>
                <span className="text-right">{formatNumber(Math.round(maxViews * 0.75))}</span>
                <span className="text-right">{formatNumber(Math.round(maxViews * 0.5))}</span>
                <span className="text-right">{formatNumber(Math.round(maxViews * 0.25))}</span>
                <span className="text-right">0</span>
              </div>

              {/* Chart Area */}
              <div className="flex-1 relative" style={{ height: '180px' }}>
                {/* Grid lines */}
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <div key={i} className="border-b border-dashed border-gray-200 dark:border-gray-700 w-full"></div>
                  ))}
                </div>

                {/* Bars */}
                <div className="absolute inset-0 flex items-end gap-2 sm:gap-3 px-2">
                  {chartData.map((d, i) => {
                    const barHeight = maxViews > 0 ? ((d.views || 0) / maxViews) * 160 : 0
                    const isHighest = d.views === maxViews && d.views > 0
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center group relative">
                        {/* Tooltip on hover */}
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all z-10 bg-gray-800 text-white text-[10px] font-medium px-2 py-1 rounded shadow-lg whitespace-nowrap">
                          {formatNumber(d.views || 0)} {t.views}
                          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
                        </div>
                        {/* Bar */}
                        <div
                          className="w-full rounded-t-lg transition-all duration-300 cursor-pointer hover:scale-105 relative overflow-hidden"
                          style={{
                            height: `${Math.max(barHeight, 4)}px`,
                            background: isHighest
                              ? 'linear-gradient(180deg, #00d4d4 0%, #00a6a6 100%)'
                              : 'linear-gradient(180deg, #4dd9d9 0%, #00a6a6 100%)',
                            boxShadow: isHighest ? '0 0 20px rgba(0, 166, 166, 0.4)' : '0 2px 4px rgba(0,0,0,0.1)'
                          }}
                        >
                          {/* Highlight effect */}
                          <div className="absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-white/30 to-transparent rounded-t-lg"></div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* X-axis labels */}
            <div className="flex mt-3 ml-10">
              {chartData.map((d, i) => (
                <div key={i} className="flex-1 text-center">
                  <span className="text-[10px] sm:text-xs font-medium text-gray-500 dark:text-gray-400">{d.month}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Summary stats under chart */}
          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                {formatNumber(chartData.reduce((sum, d) => sum + (d.views || 0), 0))}
              </p>
              <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">{t.totalViews}</p>
            </div>
            <div className="text-center">
              <p className="text-lg sm:text-xl font-bold text-[#00a6a6]">
                {formatNumber(Math.round(chartData.reduce((sum, d) => sum + (d.views || 0), 0) / chartData.length))}
              </p>
              <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">{t.avgPerMonth}</p>
            </div>
            <div className="text-center">
              <p className="text-lg sm:text-xl font-bold text-emerald-500">
                {formatNumber(maxViews)}
              </p>
              <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">{t.highestValue}</p>
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-5 border border-gray-100 dark:border-gray-700">
          <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white mb-4">{t.byCategories}</h3>
          <div className="space-y-3">
            {analytics.categories.map((cat, idx) => {
              const iconData = categoryIcons[cat.name] || categoryIcons['Boshqalar']
              const views = (cat as { views?: number }).views || 0
              return (
                <div key={idx} className="flex items-center gap-3">
                  <div className={`w-9 h-9 ${iconData.bg} dark:bg-opacity-20 rounded-lg flex items-center justify-center text-lg`}>
                    {iconData.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{cat.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          {formatNumber(views)}
                        </span>
                        <span className="text-xs font-medium text-gray-900 dark:text-white">{cat.value}%</span>
                      </div>
                    </div>
                    <div className="h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${cat.value}%`, backgroundColor: cat.color }}
                      ></div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Top Projects Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-5 border border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">{t.topProjects}</h3>
          <button className="text-xs text-[#00a6a6] hover:underline">{t.viewAll}</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="text-xs text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-700">
                <th className="text-left py-3 font-medium">{t.project}</th>
                <th className="text-right py-3 font-medium">{t.views}</th>
                <th className="text-right py-3 font-medium">{t.totalLeadsCount}</th>
                <th className="text-right py-3 font-medium">{t.conversion}</th>
                <th className="text-right py-3 font-medium">{t.revenue}</th>
                <th className="text-right py-3 font-medium">{t.trend}</th>
              </tr>
            </thead>
            <tbody>
              {analytics.top_projects.slice(0, 5).map((project, idx) => (
                <tr key={project.id} className="text-xs border-b border-gray-50 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/30">
                  <td className="py-3">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center text-xs font-medium text-gray-600 dark:text-gray-400">
                        {idx + 1}
                      </span>
                      <span className="font-medium text-gray-900 dark:text-white">{project.title || t.noProjectName}</span>
                    </div>
                  </td>
                  <td className="text-right py-3 text-gray-700 dark:text-gray-300">{formatNumber(project.views)}</td>
                  <td className="text-right py-3 text-gray-700 dark:text-gray-300">{project.leads}</td>
                  <td className="text-right py-3 text-gray-700 dark:text-gray-300">{project.conversion}%</td>
                  <td className="text-right py-3 text-gray-700 dark:text-gray-300">{formatCurrency(project.revenue)}</td>
                  <td className="text-right py-3">
                    <span className={`inline-flex items-center gap-0.5 ${project.trend >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      <svg className={`w-3 h-3 ${project.trend < 0 ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                      </svg>
                      {Math.abs(project.trend)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
