'use client'

import { useState, useEffect } from 'react'
import { faqApi, FAQ } from '@/lib/api/faq'
import Cookies from 'js-cookie'

interface FAQPageProps {
  t: any
}

export default function FAQPage({ t }: FAQPageProps) {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [faqs, setFaqs] = useState<FAQ[]>([])
  const [selectedFAQ, setSelectedFAQ] = useState<FAQ | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [filterCategory, setFilterCategory] = useState<string>('')
  const [categories, setCategories] = useState<string[]>([])

  // Form state
  const [form, setForm] = useState<Partial<FAQ>>({
    question_uz: '',
    question_ru: '',
    question_en: '',
    answer_uz: '',
    answer_ru: '',
    answer_en: '',
    category: '',
    order: 0,
    status: 'active'
  })

  const getToken = () => Cookies.get('access_token') || ''

  // Error handler
  const handleError = (error: any) => {
    const message = error.message || 'Xatolik yuz berdi'
    if (message.includes('authenticated') || message.includes('401') || message.includes('token') || message.includes('Unauthorized')) {
      alert('Sessiya muddati tugagan. Iltimos, qayta login qiling.')
      window.location.href = '/admin/login'
      return
    }
    alert(message)
  }

  // Load data
  useEffect(() => {
    loadData()
  }, [filterCategory])

  const loadData = async () => {
    const token = getToken()
    if (!token) {
      setLoading(false)
      return
    }

    setLoading(true)
    try {
      const [faqsData, categoriesData] = await Promise.all([
        faqApi.getFAQs(token, filterCategory || undefined),
        faqApi.getCategories()
      ])
      setFaqs(faqsData)
      setCategories(categoriesData)
    } catch (error) {
      handleError(error)
    } finally {
      setLoading(false)
    }
  }

  // Validate form
  const validateForm = () => {
    if (!form.question_uz?.trim()) {
      alert('Savol (UZ) majburiy maydon')
      return false
    }
    if (!form.answer_uz?.trim()) {
      alert('Javob (UZ) majburiy maydon')
      return false
    }
    return true
  }

  // Reset form
  const resetForm = () => {
    setForm({
      question_uz: '',
      question_ru: '',
      question_en: '',
      answer_uz: '',
      answer_ru: '',
      answer_en: '',
      category: '',
      order: 0,
      status: 'active'
    })
  }

  // Create FAQ
  const handleCreate = async () => {
    if (!validateForm()) return
    setSaving(true)
    try {
      await faqApi.createFAQ(form as any, getToken())
      await loadData()
      setShowModal(false)
      resetForm()
    } catch (error) {
      handleError(error)
    } finally {
      setSaving(false)
    }
  }

  // Update FAQ
  const handleUpdate = async () => {
    if (!selectedFAQ?.id) return
    if (!validateForm()) return
    setSaving(true)
    try {
      await faqApi.updateFAQ(selectedFAQ.id, form, getToken())
      await loadData()
      setShowModal(false)
      setSelectedFAQ(null)
      resetForm()
    } catch (error) {
      handleError(error)
    } finally {
      setSaving(false)
    }
  }

  // Delete FAQ
  const handleDelete = async (id: number) => {
    if (!confirm('Bu savolni o\'chirishni xohlaysizmi?')) return
    try {
      await faqApi.deleteFAQ(id, getToken())
      await loadData()
    } catch (error) {
      handleError(error)
    }
  }

  // Toggle status
  const handleToggle = async (id: number) => {
    try {
      await faqApi.toggleFAQ(id, getToken())
      await loadData()
    } catch (error) {
      handleError(error)
    }
  }

  // Open edit modal
  const openEdit = (faq: FAQ) => {
    setSelectedFAQ(faq)
    setForm({
      question_uz: faq.question_uz,
      question_ru: faq.question_ru || '',
      question_en: faq.question_en || '',
      answer_uz: faq.answer_uz,
      answer_ru: faq.answer_ru || '',
      answer_en: faq.answer_en || '',
      category: faq.category || '',
      order: faq.order || 0,
      status: faq.status || 'active'
    })
    setShowModal(true)
  }

  // Open create modal
  const openCreate = () => {
    setSelectedFAQ(null)
    resetForm()
    setShowModal(true)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00a6a6]"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t.faq || "Ko'p so'raladigan savollar"}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            {t.faqDesc || "FAQ savollarini boshqaring"}
          </p>
        </div>
        <button
          onClick={openCreate}
          className="px-4 py-2 bg-[#00a6a6] text-white rounded-lg hover:bg-[#00a6a6]/90 transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          {t.addFaq || "Savol qo'shish"}
        </button>
      </div>

      {/* Filter */}
      {categories.length > 0 && (
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {t.category || 'Kategoriya'}:
          </label>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#00a6a6] dark:bg-gray-700 dark:text-white"
          >
            <option value="">{t.all || 'Barchasi'}</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      )}

      {/* FAQ List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="p-6">
          {faqs.length === 0 ? (
            <div className="text-center py-12">
              <svg className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-gray-500 dark:text-gray-400">
                {t.noFaqs || "Hozircha savollar yo'q"}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div
                  key={faq.id}
                  className={`border rounded-lg overflow-hidden ${
                    faq.status === 'active'
                      ? 'border-gray-200 dark:border-gray-600'
                      : 'border-gray-200 dark:border-gray-700 opacity-60'
                  }`}
                >
                  <div className="p-4 bg-gray-50 dark:bg-gray-700/50 flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          #{index + 1}
                        </span>
                        {faq.category && (
                          <span className="px-2 py-0.5 text-xs bg-[#00a6a6]/10 text-[#00a6a6] rounded">
                            {faq.category}
                          </span>
                        )}
                        <span className={`px-2 py-0.5 text-xs rounded ${
                          faq.status === 'active'
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                            : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                        }`}>
                          {faq.status === 'active' ? (t.active || 'Faol') : (t.inactive || 'Nofaol')}
                        </span>
                      </div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {faq.question_uz}
                      </h3>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={() => handleToggle(faq.id!)}
                        className={`p-2 rounded-lg transition-colors ${
                          faq.status === 'active'
                            ? 'text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20'
                            : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                        title={faq.status === 'active' ? 'Nofaol qilish' : 'Faol qilish'}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={
                            faq.status === 'active'
                              ? "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                              : "M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                          } />
                        </svg>
                      </button>
                      <button
                        onClick={() => openEdit(faq)}
                        className="p-2 text-gray-500 hover:text-[#00a6a6] hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(faq.id!)}
                        className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap">
                      {faq.answer_uz}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 xs:p-3 sm:p-4"
          onClick={() => { setShowModal(false); setSelectedFAQ(null); resetForm() }}
        >
          <div
            className="bg-white dark:bg-gray-800 rounded-lg xs:rounded-xl w-full max-w-[95%] xs:max-w-xl sm:max-w-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-3 xs:p-4 sm:p-5 md:p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <h3 className="text-base xs:text-lg font-semibold dark:text-white">
                {selectedFAQ ? (t.editFaq || 'Savolni tahrirlash') : (t.addFaq || "Yangi savol qo'shish")}
              </h3>
              <button
                onClick={() => { setShowModal(false); setSelectedFAQ(null); resetForm() }}
                className="p-1.5 xs:p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
              >
                <svg className="w-5 h-5 xs:w-6 xs:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-3 xs:p-4 sm:p-5 md:p-6 space-y-3 xs:space-y-4">
              {/* Savol UZ */}
              <div>
                <label className="block text-xs xs:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t.questionUz || 'Savol (UZ)'} *
                </label>
                <input
                  type="text"
                  value={form.question_uz}
                  onChange={(e) => setForm({ ...form, question_uz: e.target.value })}
                  className="w-full px-2.5 xs:px-3 py-1.5 xs:py-2 text-xs xs:text-sm border border-gray-300 dark:border-gray-600 rounded-md xs:rounded-lg focus:ring-2 focus:ring-[#00a6a6] focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Savolni kiriting..."
                />
              </div>

              {/* Savol RU */}
              <div>
                <label className="block text-xs xs:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t.questionRu || 'Savol (RU)'}
                </label>
                <input
                  type="text"
                  value={form.question_ru}
                  onChange={(e) => setForm({ ...form, question_ru: e.target.value })}
                  className="w-full px-2.5 xs:px-3 py-1.5 xs:py-2 text-xs xs:text-sm border border-gray-300 dark:border-gray-600 rounded-md xs:rounded-lg focus:ring-2 focus:ring-[#00a6a6] focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Введите вопрос..."
                />
              </div>

              {/* Savol EN */}
              <div>
                <label className="block text-xs xs:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t.questionEn || 'Savol (EN)'}
                </label>
                <input
                  type="text"
                  value={form.question_en}
                  onChange={(e) => setForm({ ...form, question_en: e.target.value })}
                  className="w-full px-2.5 xs:px-3 py-1.5 xs:py-2 text-xs xs:text-sm border border-gray-300 dark:border-gray-600 rounded-md xs:rounded-lg focus:ring-2 focus:ring-[#00a6a6] focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Enter question..."
                />
              </div>

              {/* Javob UZ */}
              <div>
                <label className="block text-xs xs:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t.answerUz || 'Javob (UZ)'} *
                </label>
                <textarea
                  rows={3}
                  value={form.answer_uz}
                  onChange={(e) => setForm({ ...form, answer_uz: e.target.value })}
                  className="w-full px-2.5 xs:px-3 py-1.5 xs:py-2 text-xs xs:text-sm border border-gray-300 dark:border-gray-600 rounded-md xs:rounded-lg focus:ring-2 focus:ring-[#00a6a6] focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
                  placeholder="Javobni kiriting..."
                />
              </div>

              {/* Javob RU */}
              <div>
                <label className="block text-xs xs:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t.answerRu || 'Javob (RU)'}
                </label>
                <textarea
                  rows={3}
                  value={form.answer_ru}
                  onChange={(e) => setForm({ ...form, answer_ru: e.target.value })}
                  className="w-full px-2.5 xs:px-3 py-1.5 xs:py-2 text-xs xs:text-sm border border-gray-300 dark:border-gray-600 rounded-md xs:rounded-lg focus:ring-2 focus:ring-[#00a6a6] focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
                  placeholder="Введите ответ..."
                />
              </div>

              {/* Javob EN */}
              <div>
                <label className="block text-xs xs:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t.answerEn || 'Javob (EN)'}
                </label>
                <textarea
                  rows={3}
                  value={form.answer_en}
                  onChange={(e) => setForm({ ...form, answer_en: e.target.value })}
                  className="w-full px-2.5 xs:px-3 py-1.5 xs:py-2 text-xs xs:text-sm border border-gray-300 dark:border-gray-600 rounded-md xs:rounded-lg focus:ring-2 focus:ring-[#00a6a6] focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
                  placeholder="Enter answer..."
                />
              </div>

              {/* Category and Status */}
              <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 xs:gap-4">
                <div>
                  <label className="block text-xs xs:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t.category || 'Kategoriya'}
                  </label>
                  <input
                    type="text"
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-2.5 xs:px-3 py-1.5 xs:py-2 text-xs xs:text-sm border border-gray-300 dark:border-gray-600 rounded-md xs:rounded-lg focus:ring-2 focus:ring-[#00a6a6] focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="Umumiy"
                    list="categories"
                  />
                  <datalist id="categories">
                    {categories.map((cat) => (
                      <option key={cat} value={cat} />
                    ))}
                  </datalist>
                </div>
                <div>
                  <label className="block text-xs xs:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t.status || 'Holat'}
                  </label>
                  <select
                    value={form.status || 'active'}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                    className="w-full px-2.5 xs:px-3 py-1.5 xs:py-2 text-xs xs:text-sm border border-gray-300 dark:border-gray-600 rounded-md xs:rounded-lg focus:ring-2 focus:ring-[#00a6a6] focus:border-transparent dark:bg-gray-700 dark:text-white"
                  >
                    <option value="active">{t.active || 'Faol'}</option>
                    <option value="inactive">{t.inactive || 'Nofaol'}</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="p-3 xs:p-4 sm:p-5 md:p-6 border-t border-gray-200 dark:border-gray-700 flex flex-col xs:flex-row gap-2 xs:gap-3">
              <button
                onClick={() => { setShowModal(false); setSelectedFAQ(null); resetForm() }}
                className="flex-1 px-3 xs:px-4 py-1.5 xs:py-2 text-xs xs:text-sm border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md xs:rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                {t.cancel || 'Bekor qilish'}
              </button>
              <button
                onClick={selectedFAQ ? handleUpdate : handleCreate}
                disabled={saving || !form.question_uz || !form.answer_uz}
                className="flex-1 px-3 xs:px-4 py-1.5 xs:py-2 text-xs xs:text-sm bg-[#00a6a6] text-white rounded-md xs:rounded-lg hover:bg-[#00a6a6]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {saving ? (t.saving || 'Saqlanmoqda...') : (t.save || 'Saqlash')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
