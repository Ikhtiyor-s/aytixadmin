'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { Icons } from '@/components/admin/Icons'
import { translations, languages, Language, Translations } from '@/lib/admin/translations'
import ProjectsPage from '@/components/admin/ProjectsPage'
import CategoriesPage from '@/components/admin/CategoriesPage'
import ContactsPage from '@/components/admin/ContactsPage'

export default function AdminPanel() {
  const { user, logout, isAuthenticated } = useAuth()
  const router = useRouter()
  const [currentPage, setCurrentPage] = useState('dashboard')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showLangDropdown, setShowLangDropdown] = useState(false)
  const [globalSearch, setGlobalSearch] = useState('')
  const [lang, setLang] = useState<Language>('uz')
  const [showMobileSidebar, setShowMobileSidebar] = useState(false)

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/admin/login')
    }
  }, [isAuthenticated, router])

  // Dark mode effect
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  const t = translations[lang]
  const currentLang = languages.find(l => l.id === lang)

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  const menuItems = [
    { id: 'dashboard', name: t.dashboard, icon: Icons.dashboard },
    { id: 'users', name: t.users, icon: Icons.users },
    { id: 'projects', name: t.projects, icon: Icons.projects },
    { id: 'categories', name: t.categories, icon: Icons.grid },
    { id: 'leads', name: t.leads, icon: Icons.trendingUp },
    { id: 'content', name: t.content, icon: Icons.content },
    { id: 'comments', name: t.comments, icon: Icons.comments },
    { id: 'messages', name: t.messages, icon: Icons.messages },
    { id: 'contacts', name: 'Kontaktlar', icon: Icons.phone },
    { id: 'partners', name: t.partners, icon: Icons.partners },
    { id: 'integrations', name: t.integrations, icon: Icons.globe },
    { id: 'ai', name: t.ai, icon: Icons.sparkles },
    { id: 'settings', name: t.settings, icon: Icons.settings },
  ]

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className={`flex h-screen ${darkMode ? 'dark' : ''}`}>
      {/* Mobile Sidebar Overlay */}
      {showMobileSidebar && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setShowMobileSidebar(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        ${sidebarCollapsed ? 'w-20' : 'w-64'}
        bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700
        flex flex-col transition-all duration-300
        fixed lg:relative h-full z-50
        ${showMobileSidebar ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className={`h-16 flex items-center ${sidebarCollapsed ? 'justify-center' : 'px-4'} border-b border-gray-200 dark:border-gray-700`}>
          {sidebarCollapsed ? (
            <div className="w-10 h-10 bg-gradient-to-br from-[#00a6a6] to-[#0a2d5c] rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">A</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <img src="/aytix_logo.png" alt="AyTiX Logo" className="h-10 w-auto" />
            </div>
          )}
        </div>
        <nav className="flex-1 py-4 overflow-y-auto">
          {menuItems.map(item => (
            <button
              key={item.id}
              onClick={() => {
                setCurrentPage(item.id)
                setShowMobileSidebar(false)
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 transition-all ${
                currentPage === item.id
                  ? 'bg-gradient-to-r from-[#00a6a6]/10 to-[#0a2d5c]/10 dark:from-[#00a6a6]/20 dark:to-[#0a2d5c]/20 text-[#00a6a6] dark:text-[#00a6a6] border-r-2 border-[#00a6a6]'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 dark:hover:from-blue-900/20 dark:hover:to-cyan-900/20 hover:text-[#00a6a6] dark:hover:text-[#00a6a6]'
              }`}
            >
              <span className="flex-shrink-0">{item.icon}</span>
              {!sidebarCollapsed && <span className="flex-1 text-left text-sm font-medium">{item.name}</span>}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className={`flex items-center gap-3 ${sidebarCollapsed ? 'justify-center' : ''}`}>
            <div className="w-10 h-10 bg-gradient-to-br from-[#00a6a6] to-[#0a2d5c] rounded-xl flex items-center justify-center text-white">
              {Icons.user}
            </div>
            {!sidebarCollapsed && (
              <div>
                <div className="font-medium text-sm dark:text-white">{user?.username || 'Admin'}</div>
                <div className="text-xs text-gray-500">Super Admin</div>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden bg-gray-50 dark:bg-gray-900">
        {/* Topbar */}
        <header className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-3 sm:px-6">
          <div className="flex items-center gap-2 sm:gap-4 flex-1">
            {/* Mobile menu button */}
            <button
              onClick={() => setShowMobileSidebar(!showMobileSidebar)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-500 lg:hidden"
            >
              {Icons.menu}
            </button>
            {/* Desktop collapse button */}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-500 hidden lg:block"
            >
              {Icons.menu}
            </button>
            <div className="relative flex-1 max-w-md">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{Icons.search}</span>
              <input
                type="text"
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
                placeholder={t.search}
                className="pl-10 pr-4 py-2.5 w-full bg-gray-100 dark:bg-gray-700 rounded-xl outline-none text-sm dark:text-white focus:ring-2 focus:ring-[#00a6a6] transition-all"
              />
              {globalSearch && (
                <button
                  onClick={() => setGlobalSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 sm:p-2.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl text-gray-500"
            >
              {darkMode ? Icons.sun : Icons.moon}
            </button>

            <button className="p-2 sm:p-2.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl relative text-gray-500 hidden sm:block">
              {Icons.bell}
              <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center">
                0
              </span>
            </button>

            {/* Language Switcher */}
            <div className="relative">
              <button
                onClick={() => setShowLangDropdown(!showLangDropdown)}
                className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl text-gray-600 dark:text-gray-300"
              >
                <span className="text-lg">{currentLang?.flag}</span>
                <span className="text-sm font-medium hidden sm:block">{currentLang?.label}</span>
                <svg className="w-4 h-4 hidden sm:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {showLangDropdown && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowLangDropdown(false)}></div>
                  <div className="absolute right-0 top-12 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-xl border dark:border-gray-700 z-50 py-2">
                    {languages.map(l => (
                      <button
                        key={l.id}
                        onClick={() => {
                          setLang(l.id)
                          setShowLangDropdown(false)
                        }}
                        className={`w-full px-4 py-2.5 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-700 text-left ${
                          lang === l.id ? 'bg-[#00a6a6]/10 dark:bg-[#00a6a6]/20 text-[#00a6a6]' : 'text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        <span className="text-lg">{l.flag}</span>
                        <span className="text-sm font-medium">{l.fullName}</span>
                        {lang === l.id && <span className="ml-auto text-[#00a6a6]">{Icons.check}</span>}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            <button
              onClick={handleLogout}
              className="ml-1 sm:ml-2 px-2 sm:px-4 py-2 sm:py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-medium flex items-center gap-1 sm:gap-2"
            >
              {Icons.logout}
              <span className="hidden sm:inline">{t.logout}</span>
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            {/* Projects Page */}
            {currentPage === 'projects' && (
              <ProjectsPage t={t} globalSearch={globalSearch} lang={lang} />
            )}

            {/* Categories Page */}
            {currentPage === 'categories' && (
              <CategoriesPage t={t} globalSearch={globalSearch} lang={lang} />
            )}

            {/* Contacts Page */}
            {currentPage === 'contacts' && (
              <ContactsPage t={t} globalSearch={globalSearch} lang={lang} />
            )}

            {/* Other Pages */}
            {currentPage !== 'projects' && currentPage !== 'categories' && currentPage !== 'contacts' && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  {currentPage === 'dashboard' && t.dashboard}
                  {currentPage === 'users' && t.users}
                  {currentPage === 'categories' && t.categories}
                  {currentPage === 'leads' && t.leads}
                  {currentPage === 'content' && t.content}
                  {currentPage === 'comments' && t.comments}
                  {currentPage === 'messages' && t.messages}
                  {currentPage === 'partners' && t.partners}
                  {currentPage === 'integrations' && t.integrations}
                  {currentPage === 'ai' && t.ai}
                  {currentPage === 'settings' && t.settings}
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Bu yerda {currentPage} sahifasining kontenti bo'ladi. Admin panel hozircha faqat interfeys sifatida yaratilgan. Backend API bilan integratsiya qilish kerak.
                </p>

                {/* Dashboard Preview */}
                {currentPage === 'dashboard' && (
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-gradient-to-br from-[#00a6a6] to-[#00a6a6]/80 rounded-xl p-6 text-white">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium opacity-90">{t.totalProjects}</span>
                      {Icons.projects}
                    </div>
                    <p className="text-3xl font-bold">0</p>
                    <p className="text-xs opacity-75 mt-2">+0% {t.thisMonth}</p>
                  </div>
                  <div className="bg-gradient-to-br from-[#0a2d5c] to-[#0a2d5c]/80 rounded-xl p-6 text-white">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium opacity-90">{t.totalUsers}</span>
                      {Icons.users}
                    </div>
                    <p className="text-3xl font-bold">0</p>
                    <p className="text-xs opacity-75 mt-2">+0% {t.thisMonth}</p>
                  </div>
                  <div className="bg-gradient-to-br from-[#6366f1] to-[#6366f1]/80 rounded-xl p-6 text-white">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium opacity-90">{t.totalLeadsCount}</span>
                      {Icons.trendingUp}
                    </div>
                    <p className="text-3xl font-bold">0</p>
                    <p className="text-xs opacity-75 mt-2">+0% {t.thisMonth}</p>
                  </div>
                  <div className="bg-gradient-to-br from-[#f59e0b] to-[#f59e0b]/80 rounded-xl p-6 text-white">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium opacity-90">{t.totalViews}</span>
                      {Icons.eye}
                    </div>
                    <p className="text-3xl font-bold">0</p>
                    <p className="text-xs opacity-75 mt-2">+0% {t.thisMonth}</p>
                  </div>
                </div>
              )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
