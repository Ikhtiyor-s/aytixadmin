'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { authService } from '@/services/auth'
import Link from 'next/link'
import CountrySelector from '@/components/CountrySelector'
import { Country, defaultCountry } from '@/lib/countries'

export default function RegisterPage() {
  const router = useRouter()
  const [selectedCountry, setSelectedCountry] = useState<Country>(defaultCountry)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    password: '',
    passwordConfirm: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false)

  // Password validation checks
  const hasMinLength = formData.password.length >= 8
  const hasUpperCase = /[A-Z]/.test(formData.password)
  const hasLowerCase = /[a-z]/.test(formData.password)
  const hasNumber = /\d/.test(formData.password)

  const handleSubmit = async () => {
    if (!formData.firstName.trim()) {
      setError('Ismingizni kiriting!')
      return
    }
    if (!formData.lastName.trim()) {
      setError('Familiyangizni kiriting!')
      return
    }
    if (formData.phone.length !== selectedCountry.phoneLength) {
      setError(`Telefon raqam ${selectedCountry.phoneLength} ta raqamdan iborat bo'lishi kerak!`)
      return
    }
    if (!hasMinLength) {
      setError('Parol kamida 8 ta belgidan iborat bo\'lishi kerak!')
      return
    }
    if (!hasUpperCase) {
      setError('Parolda kamida bitta katta harf bo\'lishi kerak!')
      return
    }
    if (!hasLowerCase) {
      setError('Parolda kamida bitta kichik harf bo\'lishi kerak!')
      return
    }
    if (!hasNumber) {
      setError('Parolda kamida bitta raqam bo\'lishi kerak!')
      return
    }
    if (formData.password !== formData.passwordConfirm) {
      setError('Parollar mos kelmayapti!')
      return
    }

    try {
      setLoading(true)
      setError('')
      // Register user
      const email = `${formData.phone}@temp.uz`
      const fullName = `${formData.firstName} ${formData.lastName}`
      const username = `${formData.firstName.toLowerCase()}${formData.phone.slice(-4)}`
      await authService.register({
        email,
        username,
        password: formData.password,
        full_name: fullName,
      })
      router.push('/login')
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Ro\'yxatdan o\'tishda xatolik')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl max-w-md w-full p-8 relative">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">A</span>
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Ro'yxatdan o'tish</h2>
          <p className="text-slate-600">Yangi akkaunt yarating</p>
        </div>

        <div>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Ism</label>
                <input
                  type="text"
                  placeholder="Ismingiz"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-2xl outline-none focus:border-indigo-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Familiya</label>
                <input
                  type="text"
                  placeholder="Familiyangiz"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-2xl outline-none focus:border-indigo-500 transition-all"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold text-slate-700 mb-2">Telefon raqam</label>
              <div className="relative flex">
                <CountrySelector
                  selectedCountry={selectedCountry}
                  onCountryChange={setSelectedCountry}
                />
                <input
                  type="tel"
                  placeholder={selectedCountry.placeholder}
                  maxLength={selectedCountry.phoneLength}
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '') })}
                  className="flex-1 px-4 py-3 border-2 border-slate-200 rounded-r-2xl outline-none focus:border-indigo-500 transition-all"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold text-slate-700 mb-2">Parol</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Kamida 8 ta belgi"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-4 py-3 pr-12 border-2 border-slate-200 rounded-2xl outline-none focus:border-indigo-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>

              {formData.password && (
                <div className="mt-2 space-y-1 text-xs">
                  <div className={`flex items-center gap-2 ${hasMinLength ? 'text-green-600' : 'text-slate-400'}`}>
                    <span>{hasMinLength ? '✓' : '○'}</span>
                    <span>Kamida 8 ta belgi</span>
                  </div>
                  <div className={`flex items-center gap-2 ${hasUpperCase ? 'text-green-600' : 'text-slate-400'}`}>
                    <span>{hasUpperCase ? '✓' : '○'}</span>
                    <span>Bitta katta harf (A-Z)</span>
                  </div>
                  <div className={`flex items-center gap-2 ${hasLowerCase ? 'text-green-600' : 'text-slate-400'}`}>
                    <span>{hasLowerCase ? '✓' : '○'}</span>
                    <span>Bitta kichik harf (a-z)</span>
                  </div>
                  <div className={`flex items-center gap-2 ${hasNumber ? 'text-green-600' : 'text-slate-400'}`}>
                    <span>{hasNumber ? '✓' : '○'}</span>
                    <span>Bitta raqam (0-9)</span>
                  </div>
                  {formData.passwordConfirm && (
                    <div>
                      {formData.password === formData.passwordConfirm ? (
                        <div className="flex items-center gap-2 text-green-600">
                          <span>✓</span>
                          <span>Parollar mos keladi</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-red-500">
                          <span>✗</span>
                          <span>Parollar mos kelmayapti</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-slate-700 mb-2">Parolni tasdiqlang</label>
              <div className="relative">
                <input
                  type={showPasswordConfirm ? "text" : "password"}
                  placeholder="Parolni qayta kiriting"
                  value={formData.passwordConfirm}
                  onChange={(e) => setFormData({ ...formData, passwordConfirm: e.target.value })}
                  className="w-full px-4 py-3 pr-12 border-2 border-slate-200 rounded-2xl outline-none focus:border-indigo-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPasswordConfirm ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm text-center">
                {error}
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white font-semibold py-3 rounded-2xl transition-all hover:scale-105 mb-4 disabled:opacity-50"
            >
              {loading ? 'Ro\'yxatdan o\'tilmoqda...' : 'Ro\'yxatdan o\'tish'}
            </button>

            <p className="text-center text-sm text-slate-600">
              Akkauntingiz bormi?{' '}
              <Link href="/login" className="text-indigo-600 hover:text-indigo-700 font-semibold">
                Kirish
              </Link>
            </p>
          </div>
      </div>
    </div>
  )
}
