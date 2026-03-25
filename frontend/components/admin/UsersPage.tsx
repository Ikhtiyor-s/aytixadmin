'use client'

import { useState, useEffect, useRef } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { usersApi, UserData } from '@/lib/api/users'
import { Icons } from './Icons'
import { Translations } from '@/lib/admin/translations'

interface UsersPageProps {
  t: Translations
  globalSearch: string
}

interface DropdownPosition {
  top: number
  right: number
}

export default function UsersPage({ t, globalSearch }: UsersPageProps) {
  const { token, loading: authLoading } = useAuth()
  const [users, setUsers] = useState<UserData[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null)
  const [showViewModal, setShowViewModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDropdown, setShowDropdown] = useState<number | null>(null)
  const [dropdownPosition, setDropdownPosition] = useState<DropdownPosition | null>(null)
  const [roleFilter, setRoleFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [initialLoad, setInitialLoad] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [editForm, setEditForm] = useState<{
    full_name: string
    phone: string
    username: string
    role: 'user' | 'seller' | 'admin'
  }>({
    full_name: '',
    phone: '',
    username: '',
    role: 'user'
  })

  useEffect(() => {
    if (!authLoading && token) {
      loadUsers()
    } else if (!authLoading && !token) {
      setInitialLoad(false)
    }
  }, [token, authLoading])

  const loadUsers = async () => {
    try {
      setLoading(true)
      setInitialLoad(false)
      const data = await usersApi.list({ limit: 100 })
      setUsers(data)
      setError(null)
    } catch (err) {
      setError(t.usersLoadError)
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
            {t.admins}
          </span>
        )
      case 'seller':
        return (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
            {t.sellerLabel}
          </span>
        )
      default:
        return (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
            {t.userLabel}
          </span>
        )
    }
  }

  const getStatusBadge = (isActive: boolean) => {
    if (isActive) {
      return (
        <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
          {t.activeStatus}
        </span>
      )
    }
    return (
      <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400 flex items-center gap-1">
        <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
        {t.inactiveStatus}
      </span>
    )
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('uz-UZ', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getInitials = (user: UserData) => {
    if (user.full_name) {
      return user.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    }
    return user.username.slice(0, 2).toUpperCase()
  }

  // Handler functions for user actions
  const handleToggleStatus = async (user: UserData) => {
    if (!token) return
    try {
      setActionLoading(true)
      await usersApi.toggleActive(user.id, !user.is_active)
      // Update local state
      setUsers(users.map(u =>
        u.id === user.id ? { ...u, is_active: !u.is_active } : u
      ))
      setError(null)
    } catch (err: any) {
      console.error('Status change error:', err)
      const errorMessage = err.message || t.statusChangeError
      if (errorMessage.includes('own account') || errorMessage.includes('deactivate')) {
        setError(t.cannotBlockSelf)
      } else {
        setError(errorMessage)
      }
    } finally {
      setActionLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!selectedUser || !token) return
    try {
      setActionLoading(true)
      await usersApi.delete(selectedUser.id)
      // Remove from local state
      setUsers(users.filter(u => u.id !== selectedUser.id))
      setShowDeleteModal(false)
      setSelectedUser(null)
    } catch (err) {
      console.error('Delete error:', err)
      setError(t.userDeleteError)
    } finally {
      setActionLoading(false)
    }
  }

  const handleDropdownClick = (e: React.MouseEvent<HTMLButtonElement>, userId: number) => {
    e.stopPropagation()
    if (showDropdown === userId) {
      setShowDropdown(null)
      setDropdownPosition(null)
    } else {
      const rect = e.currentTarget.getBoundingClientRect()
      const menuWidth = 180
      const menuHeight = 200
      // Ensure dropdown stays within viewport
      let rightPos = window.innerWidth - rect.right
      if (rightPos < 12) rightPos = 12
      if (rightPos + menuWidth > window.innerWidth - 12) {
        rightPos = window.innerWidth - menuWidth - 12
      }
      let topPos = rect.bottom + 4
      if (topPos + menuHeight > window.innerHeight) {
        topPos = rect.top - menuHeight - 4
      }
      setDropdownPosition({
        top: topPos,
        right: rightPos
      })
      setShowDropdown(userId)
    }
  }

  const openEditModal = (user: UserData) => {
    setSelectedUser(user)
    setEditForm({
      full_name: user.full_name || '',
      phone: user.phone,
      username: user.username,
      role: user.role
    })
    setShowEditModal(true)
    setShowDropdown(null)
    setDropdownPosition(null)
  }

  const openViewModal = (user: UserData) => {
    setSelectedUser(user)
    setShowViewModal(true)
    setShowDropdown(null)
    setDropdownPosition(null)
  }

  const openDeleteModal = (user: UserData) => {
    setSelectedUser(user)
    setShowDeleteModal(true)
    setShowDropdown(null)
    setDropdownPosition(null)
  }

  const handleBlockUser = async (user: UserData) => {
    setShowDropdown(null)
    setDropdownPosition(null)
    await handleToggleStatus(user)
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (showDropdown) {
        setShowDropdown(null)
        setDropdownPosition(null)
      }
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [showDropdown])

  const handleEditUser = async () => {
    if (!selectedUser || !token) return
    try {
      setActionLoading(true)
      const updatedUser = await usersApi.update(selectedUser.id, editForm)
      // Update local state
      setUsers(users.map(u =>
        u.id === selectedUser.id ? { ...u, ...updatedUser } : u
      ))
      setShowEditModal(false)
      setSelectedUser(null)
      setError(null)
    } catch (err: any) {
      console.error('Edit error:', err)
      setError(err.message || t.userEditError)
    } finally {
      setActionLoading(false)
    }
  }

  const getAvatarColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'from-red-500 to-red-600'
      case 'seller':
        return 'from-blue-500 to-blue-600'
      default:
        return 'from-[#00a6a6] to-[#0a2d5c]'
    }
  }

  // Filter users - admin foydalanuvchilarni chiqarib tashlash
  const filteredUsers = users.filter(user => {
    // Admin foydalanuvchilarni ro'yxatdan chiqarish
    if (user.role === 'admin') return false

    // Global search
    const searchLower = globalSearch.toLowerCase()
    const matchesSearch = !globalSearch ||
      user.username.toLowerCase().includes(searchLower) ||
      user.phone.toLowerCase().includes(searchLower) ||
      (user.full_name && user.full_name.toLowerCase().includes(searchLower))

    // Role filter
    const matchesRole = roleFilter === 'all' || user.role === roleFilter

    // Status filter
    const matchesStatus = statusFilter === 'all' ||
      (statusFilter === 'active' && user.is_active) ||
      (statusFilter === 'inactive' && !user.is_active)

    return matchesSearch && matchesRole && matchesStatus
  })

  // Stats - adminlarni hisobga olmaslik
  const nonAdminUsers = users.filter(u => u.role !== 'admin')
  const totalUsers = nonAdminUsers.length
  const activeUsers = nonAdminUsers.filter(u => u.is_active).length
  const sellerUsers = nonAdminUsers.filter(u => u.role === 'seller').length
  const regularUsers = nonAdminUsers.filter(u => u.role === 'user').length

  if (authLoading || initialLoad || loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00a6a6]"></div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">{t.users}</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {t.manageUsers}
          </p>
        </div>
        <button
          onClick={loadUsers}
          className="px-4 py-2 bg-[#00a6a6] hover:bg-[#008f8f] text-white rounded-xl text-sm font-medium flex items-center gap-2 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          {t.refresh}
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#00a6a6] to-[#0a2d5c] flex items-center justify-center text-white">
              {Icons.users}
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalUsers}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{t.totalUsersLabel}</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{activeUsers}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{t.activeUsersLabel}</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{regularUsers}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{t.regularUsersLabel}</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{sellerUsers}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{t.sellersLabel}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600 dark:text-gray-400">{t.role}:</label>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 border-0 rounded-lg text-sm dark:text-white focus:ring-2 focus:ring-[#00a6a6]"
            >
              <option value="all">{t.allRoles}</option>
              <option value="user">{t.userRole}</option>
              <option value="seller">{t.sellerRole}</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600 dark:text-gray-400">{t.status}:</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 border-0 rounded-lg text-sm dark:text-white focus:ring-2 focus:ring-[#00a6a6]"
            >
              <option value="all">{t.allRoles}</option>
              <option value="active">{t.active}</option>
              <option value="inactive">{t.inactive}</option>
            </select>
          </div>
          <div className="ml-auto text-sm text-gray-500 dark:text-gray-400">
            {filteredUsers.length} {t.usersFound}
          </div>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Users Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
        <div className="overflow-x-auto overflow-y-visible">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {t.users}
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {t.phoneLabel}
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {t.role}
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {t.status}
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {t.registeredDate}
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {t.actions}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                    {t.noUsersFound}
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${getAvatarColor(user.role)} flex items-center justify-center text-white text-sm font-medium`}>
                          {getInitials(user)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white text-sm">
                            {user.full_name || user.username}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            @{user.username}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-gray-600 dark:text-gray-300">{user.phone}</span>
                    </td>
                    <td className="px-4 py-3">
                      {getRoleBadge(user.role)}
                    </td>
                    <td className="px-4 py-3">
                      {getStatusBadge(user.is_active)}
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(user.created_at)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={(e) => handleDropdownClick(e, user.id)}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-500 dark:text-gray-400 transition-colors"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* View User Modal */}
      {showViewModal && selectedUser && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowViewModal(false)}
        >
          <div
            className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {t.userDetails}
              </h3>
              <button
                onClick={() => setShowViewModal(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-500 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Avatar and Name */}
              <div className="flex flex-col items-center mb-6">
                <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${getAvatarColor(selectedUser.role)} flex items-center justify-center text-white text-2xl font-bold mb-3`}>
                  {getInitials(selectedUser)}
                </div>
                <h4 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {selectedUser.full_name || selectedUser.username}
                </h4>
                <p className="text-gray-500 dark:text-gray-400">@{selectedUser.username}</p>
                <div className="flex items-center gap-2 mt-2">
                  {getRoleBadge(selectedUser.role)}
                  {getStatusBadge(selectedUser.is_active)}
                </div>
              </div>

              {/* Details */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                  <div className="w-10 h-10 rounded-lg bg-[#00a6a6]/10 flex items-center justify-center text-[#00a6a6]">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{t.phoneContact}</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{selectedUser.phone}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                  <div className="w-10 h-10 rounded-lg bg-[#00a6a6]/10 flex items-center justify-center text-[#00a6a6]">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">ID</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white font-mono">{selectedUser.id}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                  <div className="w-10 h-10 rounded-lg bg-[#00a6a6]/10 flex items-center justify-center text-[#00a6a6]">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{t.date}</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{formatDate(selectedUser.created_at)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setShowViewModal(false)}
                className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-xl text-sm font-medium transition-colors"
              >
                {t.close}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedUser && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowDeleteModal(false)}
        >
          <div
            className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {t.deleteUser}
              </h3>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="flex items-center justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-500">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
              </div>
              <p className="text-center text-gray-600 dark:text-gray-300 mb-2">
                <strong className="text-gray-900 dark:text-white">{selectedUser.full_name || selectedUser.username}</strong> {t.deleteUserConfirm}
              </p>
              <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                {t.deleteIrreversible}
              </p>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-xl text-sm font-medium transition-colors"
              >
                {t.cancel}
              </button>
              <button
                onClick={handleDelete}
                disabled={actionLoading}
                className="flex-1 px-4 py-2.5 bg-red-500 hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2"
              >
                {actionLoading && (
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
                {t.delete}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dropdown Menu - Rendered outside table to avoid overflow issues */}
      {showDropdown && dropdownPosition && (
        <div
          className="fixed z-50 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 py-1 w-[180px]"
          style={{
            top: `${dropdownPosition.top}px`,
            right: `${dropdownPosition.right}px`
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {filteredUsers.find(u => u.id === showDropdown) && (
            <>
              <button
                onClick={() => openViewModal(filteredUsers.find(u => u.id === showDropdown)!)}
                className="w-full px-4 py-2.5 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3 transition-colors"
              >
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                {t.userDetails}
              </button>
              <button
                onClick={() => openEditModal(filteredUsers.find(u => u.id === showDropdown)!)}
                className="w-full px-4 py-2.5 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3 transition-colors"
              >
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                {t.edit}
              </button>
              <button
                onClick={() => handleBlockUser(filteredUsers.find(u => u.id === showDropdown)!)}
                className="w-full px-4 py-2.5 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3 transition-colors"
              >
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                </svg>
                {filteredUsers.find(u => u.id === showDropdown)?.is_active ? t.blockUser : t.activateUser}
              </button>
              <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
              <button
                onClick={() => openDeleteModal(filteredUsers.find(u => u.id === showDropdown)!)}
                className="w-full px-4 py-2.5 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-3 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                {t.delete}
              </button>
            </>
          )}
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && selectedUser && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4"
          onClick={() => setShowEditModal(false)}
        >
          <div
            className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl w-full max-w-[95%] sm:max-w-md overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                {t.editUserTitle}
              </h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-1.5 sm:p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-500 transition-colors"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-1.5">
                  {t.fullName}
                </label>
                <input
                  type="text"
                  value={editForm.full_name}
                  onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })}
                  className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-gray-100 dark:bg-gray-700 border-0 rounded-lg sm:rounded-xl text-sm sm:text-base text-gray-900 dark:text-white focus:ring-2 focus:ring-[#00a6a6] outline-none"
                  placeholder={t.enterFullName}
                />
              </div>

              {/* Username */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-1.5">
                  {t.usernameLabel}
                </label>
                <input
                  type="text"
                  value={editForm.username}
                  onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                  className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-gray-100 dark:bg-gray-700 border-0 rounded-lg sm:rounded-xl text-sm sm:text-base text-gray-900 dark:text-white focus:ring-2 focus:ring-[#00a6a6] outline-none"
                  placeholder={t.enterUsername}
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-1.5">
                  {t.phoneNumber}
                </label>
                <input
                  type="tel"
                  value={editForm.phone}
                  onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                  className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-gray-100 dark:bg-gray-700 border-0 rounded-lg sm:rounded-xl text-sm sm:text-base text-gray-900 dark:text-white focus:ring-2 focus:ring-[#00a6a6] outline-none"
                  placeholder={t.enterPhone}
                />
              </div>

              {/* Role */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-1.5">
                  {t.role}
                </label>
                <select
                  value={editForm.role}
                  onChange={(e) => setEditForm({ ...editForm, role: e.target.value as 'user' | 'seller' | 'admin' })}
                  className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-gray-100 dark:bg-gray-700 border-0 rounded-lg sm:rounded-xl text-sm sm:text-base text-gray-900 dark:text-white focus:ring-2 focus:ring-[#00a6a6] outline-none"
                >
                  <option value="user">{t.userRole}</option>
                  <option value="seller">{t.sellerRole}</option>
                </select>
              </div>
            </div>

            {/* Footer */}
            <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-200 dark:border-gray-700 flex gap-2 sm:gap-3">
              <button
                onClick={() => setShowEditModal(false)}
                className="flex-1 px-3 sm:px-4 py-2 sm:py-2.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-colors"
              >
                {t.cancel}
              </button>
              <button
                onClick={handleEditUser}
                disabled={actionLoading}
                className="flex-1 px-3 sm:px-4 py-2 sm:py-2.5 bg-[#00a6a6] hover:bg-[#008f8f] disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-colors flex items-center justify-center gap-2"
              >
                {actionLoading && (
                  <svg className="animate-spin h-3 w-3 sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
                {t.save}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
