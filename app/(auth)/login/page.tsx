'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import Image from 'next/image'

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()

  const [formData, setFormData] = useState({
    phone: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [logoError, setLogoError] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await login(formData.phone, formData.password)
      router.push('/admin/advanced')
    } catch (err: any) {
      setError(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#00a6a6] via-[#0a2d5c] to-[#1a1a2e] flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo - kichikroq */}
        <div className="text-center mb-4">
          <div className="inline-block bg-white rounded-xl p-3 shadow-xl mb-2">
            {logoError ? (
              <div className="h-10 flex items-center justify-center">
                <span className="text-2xl font-bold bg-gradient-to-r from-[#00a6a6] to-[#0a2d5c] bg-clip-text text-transparent">AyTiX</span>
              </div>
            ) : (
              <Image
                src="/aytix_logo.png"
                alt="AyTiX Logo"
                width={150}
                height={45}
                className="h-10 w-auto"
                onError={() => setLogoError(true)}
                priority
              />
            )}
          </div>
          <h1 className="text-xl font-bold text-white">Admin Panel</h1>
          <p className="text-sm text-white/70">AyTiX Boshqaruv Tizimi</p>
        </div>

        {/* Login Form - kichikroq */}
        <div className="bg-white rounded-xl shadow-xl p-5">
          <h2 className="text-lg font-bold text-gray-800 mb-4 text-center">Tizimga kirish</h2>

          {error && (
            <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-xs">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Login
              </label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00a6a6] focus:border-transparent transition-all"
                placeholder="Login kiriting"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Parol
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-3 py-2 pr-10 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00a6a6] focus:border-transparent transition-all"
                  placeholder="********"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  {showPassword ? (
                    // Ko'z yopiq icon
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    // Ko'z ochiq icon
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
              className="w-full bg-gradient-to-r from-[#00a6a6] to-[#0a2d5c] text-white py-2.5 rounded-lg text-sm font-semibold hover:shadow-lg transform hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Kirish...' : 'Kirish'}
            </button>
          </form>
        </div>

        {/* Footer - kichikroq */}
        <div className="text-center mt-3 text-white/70 text-xs">
          <p>2024 AyTiX</p>
        </div>
      </div>
    </div>
  )
}
