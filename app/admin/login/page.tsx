'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'
import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'

export default function AdminLogin() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Admin login endpoint ga so'rov yuborish
      const formDataObj = new URLSearchParams()
      formDataObj.append('username', formData.username)
      formDataObj.append('password', formData.password)

      // Admin login endpoint
      const response = await axios.post(`${API_URL}/auth/admin/login`, formDataObj, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })

      const { access_token, refresh_token } = response.data
      Cookies.set('access_token', access_token)
      Cookies.set('refresh_token', refresh_token)

      // Redirect to admin panel
      setTimeout(() => {
        window.location.replace('/admin/advanced')
      }, 100)
    } catch (err: any) {
      console.error('Login error:', err)
      const errorMessage = err.response?.data?.detail || err.message || 'Login xatoligi'
      setError(typeof errorMessage === 'string' ? errorMessage : 'Login xatoligi')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#00a6a6] via-[#0a2d5c] to-[#1a1a2e] flex items-center justify-center p-2 xs:p-3 sm:p-4">
      <div className="w-full max-w-[280px] xs:max-w-xs sm:max-w-sm md:max-w-md">
        {/* Logo */}
        <div className="text-center mb-3 xs:mb-4 sm:mb-5 md:mb-6">
          <div className="inline-block bg-white rounded-lg xs:rounded-xl sm:rounded-2xl p-1.5 xs:p-2 sm:p-3 shadow-2xl mb-1.5 xs:mb-2 sm:mb-3">
            <img src="/aytix_logo.png" alt="AyTiX Logo" className="h-8 xs:h-9 sm:h-10 md:h-12 w-auto" />
          </div>
          <h1 className="text-base xs:text-lg sm:text-xl md:text-2xl font-bold text-white mb-0.5 xs:mb-1">Admin Panel</h1>
          <p className="text-gray-200 text-[10px] xs:text-xs sm:text-sm">AyTiX Boshqaruv Tizimi</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-lg xs:rounded-xl sm:rounded-2xl shadow-2xl p-3 xs:p-4 sm:p-5 md:p-6">
          <h2 className="text-sm xs:text-base sm:text-lg md:text-xl font-bold text-gray-800 mb-3 xs:mb-4 sm:mb-5 text-center">Tizimga kirish</h2>

          {error && (
            <div className="mb-2 xs:mb-3 p-2 xs:p-3 bg-red-50 border border-red-200 rounded-md xs:rounded-lg text-red-600 text-[10px] xs:text-xs sm:text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-2 xs:space-y-3 sm:space-y-4">
            <div>
              <label className="block text-[10px] xs:text-xs sm:text-sm font-medium text-gray-700 mb-0.5 xs:mb-1 sm:mb-1.5">
                Login (username yoki telefon)
              </label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="w-full px-2 xs:px-3 py-1.5 xs:py-2 sm:py-2.5 text-xs xs:text-sm border border-gray-300 rounded-md xs:rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00a6a6] focus:border-transparent transition-all"
                placeholder="Username yoki telefon raqam"
                required
              />
            </div>

            <div>
              <label className="block text-[10px] xs:text-xs sm:text-sm font-medium text-gray-700 mb-0.5 xs:mb-1 sm:mb-1.5">
                Parol
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-2 xs:px-3 py-1.5 xs:py-2 sm:py-2.5 pr-10 text-xs xs:text-sm border border-gray-300 rounded-md xs:rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00a6a6] focus:border-transparent transition-all"
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  {showPassword ? (
                    <svg className="w-4 h-4 xs:w-5 xs:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 xs:w-5 xs:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#00a6a6] to-[#0a2d5c] text-white py-1.5 xs:py-2 sm:py-2.5 rounded-md xs:rounded-lg sm:rounded-xl font-medium text-xs xs:text-sm hover:shadow-lg transform hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-1.5 xs:gap-2">
                  <svg className="animate-spin h-3 w-3 xs:h-4 xs:w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Kirish...
                </span>
              ) : (
                'Kirish'
              )}
            </button>
          </form>

          {/* Admin only warning */}
          <div className="mt-3 xs:mt-4 p-2 xs:p-3 bg-amber-50 rounded-md xs:rounded-lg border border-amber-200">
            <p className="text-[9px] xs:text-[10px] sm:text-xs text-amber-700 text-center">
              Faqat admin foydalanuvchilar kirishi mumkin
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-3 xs:mt-4 text-white text-[9px] xs:text-[10px] sm:text-xs">
          <p>© 2024 AyTiX. Barcha huquqlar himoyalangan.</p>
        </div>
      </div>
    </div>
  )
}
