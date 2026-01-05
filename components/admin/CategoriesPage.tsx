'use client'

import { useState, useEffect } from 'react'
import Cookies from 'js-cookie'
import { Translations } from '@/lib/admin/translations'
import { categoriesApi, CategoryData, SubcategoryData } from '@/lib/api/categories'
import { uploadsApi } from '@/lib/api/uploads'
import { translateApi } from '@/lib/api/translate'

// Category Emoji Icons
const CategoryEmojis = [
  '💼', // Biznes
  '🛒', // Savdo
  '💰', // Moliya
  '🎓', // Ta'lim
  '🏗️', // Qurilish
  '🤖', // AI/Avtomatlashtirish
  '📱', // Mobil
  '🎨', // Dizayn
  '🚚', // Logistika
  '🏭', // Sanoat
  '🚀', // Startap
  '💬', // Chat/Support
  '📊', // Analitika
  '🔒', // Xavfsizlik
  '☁️', // Cloud
]

// Get emoji based on category order/index
const getCategoryEmoji = (index: number): string => {
  return CategoryEmojis[index % CategoryEmojis.length]
}

interface CategoriesPageProps {
  t: Translations
  globalSearch: string
  lang: string
}

export default function CategoriesPage({ t, globalSearch, lang }: CategoriesPageProps) {
  const [categories, setCategories] = useState<CategoryData[]>([])
  const [subcategories, setSubcategories] = useState<Record<number, SubcategoryData[]>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [showCategoryModal, setShowCategoryModal] = useState(false)
  const [showSubcategoryModal, setShowSubcategoryModal] = useState(false)
  const [editingCategory, setEditingCategory] = useState<CategoryData | null>(null)
  const [editingSubcategory, setEditingSubcategory] = useState<SubcategoryData | null>(null)
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null)
  const [expandedCategories, setExpandedCategories] = useState<Set<number>>(new Set())

  const [categoryFormData, setCategoryFormData] = useState({
    name_uz: '',
    name_ru: '',
    name_en: '',
    description_uz: '',
    description_ru: '',
    description_en: '',
    icon: '',
    order: 0,
    is_active: true
  })
  const [iconFile, setIconFile] = useState<File | null>(null)
  const [iconPreview, setIconPreview] = useState<string | null>(null)

  const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || 'http://localhost:8000'

  const [subcategoryFormData, setSubcategoryFormData] = useState({
    name_uz: '',
    name_ru: '',
    name_en: '',
    order: 0,
    is_active: true
  })

  const [activeTab, setActiveTab] = useState<'uz' | 'ru' | 'en'>('uz')
  const [isTranslating, setIsTranslating] = useState(false)

  // AI tarjima - Kategoriya uchun
  const handleCategoryTranslate = async () => {
    let sourceLang: 'uz' | 'ru' | 'en' | null = null

    if (categoryFormData.name_uz.trim()) {
      sourceLang = 'uz'
    } else if (categoryFormData.name_ru.trim()) {
      sourceLang = 'ru'
    } else if (categoryFormData.name_en.trim()) {
      sourceLang = 'en'
    }

    if (!sourceLang) {
      alert(t.pleaseEnterName)
      return
    }

    const targetLangs = ['uz', 'ru', 'en'].filter(l => l !== sourceLang) as ('uz' | 'ru' | 'en')[]

    setIsTranslating(true)
    try {
      const token = getToken()
      const newFormData = { ...categoryFormData }

      // Name tarjimasi
      const nameKey = `name_${sourceLang}` as keyof typeof categoryFormData
      if (categoryFormData[nameKey]) {
        const nameResult = await translateApi.translate({
          text: String(categoryFormData[nameKey]),
          source_lang: sourceLang,
          target_langs: targetLangs
        }, token)

        if (nameResult.success) {
          targetLangs.forEach(lang => {
            if (nameResult.translations[lang]) {
              (newFormData as any)[`name_${lang}`] = nameResult.translations[lang]
            }
          })
        }
      }

      // Description tarjimasi
      const descKey = `description_${sourceLang}` as keyof typeof categoryFormData
      if (categoryFormData[descKey]) {
        const descResult = await translateApi.translate({
          text: String(categoryFormData[descKey]),
          source_lang: sourceLang,
          target_langs: targetLangs
        }, token)

        if (descResult.success) {
          targetLangs.forEach(lang => {
            if (descResult.translations[lang]) {
              (newFormData as any)[`description_${lang}`] = descResult.translations[lang]
            }
          })
        }
      }

      setCategoryFormData(newFormData)
      alert(t.translationSuccess)
    } catch (err) {
      console.error('Translation error:', err)
      alert(err instanceof Error ? err.message : t.translationError)
    } finally {
      setIsTranslating(false)
    }
  }

  // AI tarjima - Subkategoriya uchun
  const handleSubcategoryTranslate = async () => {
    let sourceLang: 'uz' | 'ru' | 'en' | null = null

    if (subcategoryFormData.name_uz.trim()) {
      sourceLang = 'uz'
    } else if (subcategoryFormData.name_ru.trim()) {
      sourceLang = 'ru'
    } else if (subcategoryFormData.name_en.trim()) {
      sourceLang = 'en'
    }

    if (!sourceLang) {
      alert(t.pleaseEnterName)
      return
    }

    const targetLangs = ['uz', 'ru', 'en'].filter(l => l !== sourceLang) as ('uz' | 'ru' | 'en')[]

    setIsTranslating(true)
    try {
      const token = getToken()
      const newFormData = { ...subcategoryFormData }

      const nameKey = `name_${sourceLang}` as keyof typeof subcategoryFormData
      if (subcategoryFormData[nameKey]) {
        const nameResult = await translateApi.translate({
          text: String(subcategoryFormData[nameKey]),
          source_lang: sourceLang,
          target_langs: targetLangs
        }, token)

        if (nameResult.success) {
          targetLangs.forEach(lang => {
            if (nameResult.translations[lang]) {
              (newFormData as any)[`name_${lang}`] = nameResult.translations[lang]
            }
          })
        }
      }

      setSubcategoryFormData(newFormData)
      alert(t.translationSuccess)
    } catch (err) {
      console.error('Translation error:', err)
      alert(err instanceof Error ? err.message : t.translationError)
    } finally {
      setIsTranslating(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await categoriesApi.list()
      setCategories(data)
    } catch (err) {
      console.error('Failed to fetch categories:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch categories')
    } finally {
      setLoading(false)
    }
  }

  const fetchSubcategories = async (categoryId: number) => {
    try {
      const data = await categoriesApi.listSubcategories(categoryId)
      setSubcategories(prev => ({ ...prev, [categoryId]: data }))
    } catch (err) {
      console.error('Failed to fetch subcategories:', err)
    }
  }

  const getToken = () => {
    return Cookies.get('access_token') || ''
  }

  const toggleCategory = async (categoryId: number) => {
    const newExpanded = new Set(expandedCategories)
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId)
    } else {
      newExpanded.add(categoryId)
      // Fetch subcategories if not already loaded
      if (!subcategories[categoryId]) {
        await fetchSubcategories(categoryId)
      }
    }
    setExpandedCategories(newExpanded)
  }

  const handleIconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setIconFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setIconPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const openAddCategoryModal = () => {
    setEditingCategory(null)
    setCategoryFormData({
      name_uz: '',
      name_ru: '',
      name_en: '',
      description_uz: '',
      description_ru: '',
      description_en: '',
      icon: '',
      order: categories.length + 1,
      is_active: true
    })
    setIconFile(null)
    setIconPreview(null)
    setShowCategoryModal(true)
  }

  const openEditCategoryModal = (category: CategoryData) => {
    setEditingCategory(category)
    setCategoryFormData({
      name_uz: category.name_uz,
      name_ru: category.name_ru || '',
      name_en: category.name_en || '',
      description_uz: category.description_uz || '',
      description_ru: category.description_ru || '',
      description_en: category.description_en || '',
      icon: category.icon || '',
      order: category.order || 0,
      is_active: category.is_active !== false
    })
    setIconFile(null)
    // Set preview from existing icon
    if (category.icon) {
      setIconPreview(category.icon.startsWith('http') ? category.icon : `${API_URL}${category.icon}`)
    } else {
      setIconPreview(null)
    }
    setShowCategoryModal(true)
  }

  const openAddSubcategoryModal = (categoryId: number) => {
    setSelectedCategoryId(categoryId)
    setEditingSubcategory(null)
    setSubcategoryFormData({
      name_uz: '',
      name_ru: '',
      name_en: '',
      order: (subcategories[categoryId]?.length || 0) + 1,
      is_active: true
    })
    setShowSubcategoryModal(true)
  }

  const openEditSubcategoryModal = (subcategory: SubcategoryData) => {
    setSelectedCategoryId(subcategory.category_id!)
    setEditingSubcategory(subcategory)
    setSubcategoryFormData({
      name_uz: subcategory.name_uz,
      name_ru: subcategory.name_ru || '',
      name_en: subcategory.name_en || '',
      order: subcategory.order || 0,
      is_active: subcategory.is_active !== false
    })
    setShowSubcategoryModal(true)
  }

  const handleSaveCategory = async () => {
    try {
      const token = getToken()
      if (!token) {
        alert(t.pleaseLoginFirst)
        return
      }

      let iconUrl = categoryFormData.icon

      // Upload icon if selected
      if (iconFile) {
        const result = await uploadsApi.uploadImage(iconFile, token)
        iconUrl = result.url
      }

      const dataToSave = { ...categoryFormData, icon: iconUrl }

      if (editingCategory) {
        await categoriesApi.update(editingCategory.id!, dataToSave, token)
      } else {
        await categoriesApi.create(dataToSave, token)
      }

      await fetchCategories()
      setShowCategoryModal(false)
    } catch (err) {
      console.error('Failed to save category:', err)
      alert(err instanceof Error ? err.message : 'Failed to save category')
    }
  }

  const handleDeleteCategory = async (id: number) => {
    if (!confirm(t.deleteConfirmCategory)) {
      return
    }

    try {
      const token = getToken()
      if (!token) {
        alert(t.pleaseLoginFirst)
        return
      }

      await categoriesApi.delete(id, token)
      await fetchCategories()
    } catch (err) {
      console.error('Failed to delete category:', err)
      alert(err instanceof Error ? err.message : 'Failed to delete category')
    }
  }

  const handleSaveSubcategory = async () => {
    try {
      const token = getToken()
      if (!token || !selectedCategoryId) {
        alert(t.pleaseLoginFirst)
        return
      }

      if (editingSubcategory) {
        await categoriesApi.updateSubcategory(editingSubcategory.id!, subcategoryFormData, token)
      } else {
        await categoriesApi.createSubcategory(selectedCategoryId, subcategoryFormData, token)
      }

      await fetchSubcategories(selectedCategoryId)
      setShowSubcategoryModal(false)
    } catch (err) {
      console.error('Failed to save subcategory:', err)
      alert(err instanceof Error ? err.message : 'Failed to save subcategory')
    }
  }

  const handleDeleteSubcategory = async (id: number, categoryId: number) => {
    if (!confirm(t.deleteConfirmSubcategory)) {
      return
    }

    try {
      const token = getToken()
      if (!token) {
        alert(t.pleaseLoginFirst)
        return
      }

      await categoriesApi.deleteSubcategory(id, token)
      await fetchSubcategories(categoryId)
    } catch (err) {
      console.error('Failed to delete subcategory:', err)
      alert(err instanceof Error ? err.message : 'Failed to delete subcategory')
    }
  }

  const filteredCategories = categories.filter(category =>
    globalSearch.trim() === '' ||
    category.name_uz.toLowerCase().includes(globalSearch.toLowerCase()) ||
    category.name_ru?.toLowerCase().includes(globalSearch.toLowerCase()) ||
    category.name_en?.toLowerCase().includes(globalSearch.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-600">
        <p>{error}</p>
        <button onClick={fetchCategories} className="mt-2 text-sm underline">
          {t.tryAgain}
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{t.categories}</h2>
          <p className="text-sm text-gray-500 mt-1">{t.total}: {categories.length}</p>
        </div>
        <button
          onClick={openAddCategoryModal}
          className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          {t.addCategory}
        </button>
      </div>

      {/* Categories List */}
      <div className="grid gap-4">
        {filteredCategories.map((category, index) => (
          <div key={category.id} className="bg-white rounded-xl border border-gray-200">
            {/* Category Header */}
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-4 flex-1">
                <button
                  onClick={() => toggleCategory(category.id!)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <svg
                    className={`w-5 h-5 transition-transform ${expandedCategories.has(category.id!) ? 'rotate-90' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0a2d5c]/10 to-[#0a2d5c]/5 border border-[#0a2d5c]/20 flex items-center justify-center">
                    {category.icon && (category.icon.startsWith('http') || category.icon.startsWith('/uploads')) ? (
                      <img
                        src={category.icon.startsWith('http') ? category.icon : `${API_URL}${category.icon}`}
                        alt={category[`name_${lang}` as keyof typeof category] as string || category.name_uz}
                        className="w-full h-full object-cover rounded-xl"
                      />
                    ) : (
                      <span className="text-xl">{getCategoryEmoji(index)}</span>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {category[`name_${lang}` as keyof typeof category] as string || category.name_uz}
                    </h3>
                    {(category[`description_${lang}` as keyof typeof category] || category.description_uz) && (
                      <p className="text-sm text-gray-500">
                        {category[`description_${lang}` as keyof typeof category] as string || category.description_uz}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  category.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                }`}>
                  {category.is_active ? t.active : t.inactive}
                </span>

                <button
                  onClick={() => openAddSubcategoryModal(category.id!)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  title={t.newSubcategory}
                >
                  <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>

                <button
                  onClick={() => openEditCategoryModal(category)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  title={t.edit}
                >
                  <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>

                <button
                  onClick={() => handleDeleteCategory(category.id!)}
                  className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                  title={t.delete}
                >
                  <svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Subcategories */}
            {expandedCategories.has(category.id!) && (
              <div className="border-t border-gray-200 p-4 bg-gray-50">
                <h4 className="text-sm font-medium text-gray-700 mb-3">{t.subcategories}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                  {subcategories[category.id!]?.map((subcat) => (
                    <div
                      key={subcat.id}
                      className="flex items-center justify-between bg-white rounded-lg p-3 border border-gray-200"
                    >
                      <span className="text-sm text-gray-700">
                        {subcat[`name_${lang}` as keyof typeof subcat] as string || subcat.name_uz}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => openEditSubcategoryModal(subcat)}
                          className="p-1 hover:bg-gray-100 rounded transition-colors"
                        >
                          <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDeleteSubcategory(subcat.id!, category.id!)}
                          className="p-1 hover:bg-red-50 rounded transition-colors"
                        >
                          <svg className="w-4 h-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                {(!subcategories[category.id!] || subcategories[category.id!].length === 0) && (
                  <p className="text-sm text-gray-500">{t.noSubcategories}</p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Category Modal */}
      {showCategoryModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowCategoryModal(false)}
        >
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 z-10">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-800">
                  {editingCategory ? t.editCategory : t.newCategory}
                </h3>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCategoryTranslate}
                    disabled={isTranslating}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                    title="AI yordamida boshqa tillarga tarjima qilish"
                  >
                    {isTranslating ? (
                      <>
                        <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span className="hidden sm:inline">{t.translating}</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                        <span className="hidden sm:inline">{t.aiTranslate}</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => setShowCategoryModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Language Tabs */}
              <div className="flex gap-2 mt-4">
                {(['uz', 'ru', 'en'] as const).map((l) => (
                  <button
                    key={l}
                    onClick={() => setActiveTab(l)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      activeTab === l
                        ? 'bg-primary-500 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {l.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-6 space-y-4">
              {/* Icon Upload - only on UZ tab */}
              {activeTab === 'uz' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.icon}
                  </label>
                  <div className="flex items-center gap-4">
                    {/* Icon Preview */}
                    <div className="w-16 h-16 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50 overflow-hidden">
                      {iconPreview ? (
                        <img src={iconPreview} alt="Icon" className="w-full h-full object-cover" />
                      ) : (
                        <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      )}
                    </div>

                    {/* Upload Button */}
                    <div className="flex-1">
                      <label className="cursor-pointer">
                        <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors w-fit">
                          <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                          </svg>
                          <span className="text-sm font-medium text-gray-700">{t.uploadIcon}</span>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleIconChange}
                          className="hidden"
                        />
                      </label>
                      <p className="text-xs text-gray-500 mt-1">{t.supportedFormats}</p>
                    </div>

                    {/* Remove Icon Button */}
                    {iconPreview && (
                      <button
                        type="button"
                        onClick={() => {
                          setIconFile(null)
                          setIconPreview(null)
                          setCategoryFormData({ ...categoryFormData, icon: '' })
                        }}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.name} ({activeTab.toUpperCase()})
                </label>
                <input
                  type="text"
                  value={categoryFormData[`name_${activeTab}` as keyof typeof categoryFormData] as string}
                  onChange={(e) => setCategoryFormData({ ...categoryFormData, [`name_${activeTab}`]: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder={`${t.category} (${activeTab})`}
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.description} ({activeTab.toUpperCase()})
                </label>
                <textarea
                  value={categoryFormData[`description_${activeTab}` as keyof typeof categoryFormData] as string}
                  onChange={(e) => setCategoryFormData({ ...categoryFormData, [`description_${activeTab}`]: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                  rows={3}
                  placeholder={`${t.description} (${activeTab})`}
                />
              </div>

              {/* Order and Active (only on UZ tab) */}
              {activeTab === 'uz' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t.order}
                    </label>
                    <input
                      type="number"
                      value={categoryFormData.order}
                      onChange={(e) => setCategoryFormData({ ...categoryFormData, order: parseInt(e.target.value) || 0 })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="is_active"
                      checked={categoryFormData.is_active}
                      onChange={(e) => setCategoryFormData({ ...categoryFormData, is_active: e.target.checked })}
                      className="w-5 h-5 text-primary-500 rounded focus:ring-2 focus:ring-primary-500"
                    />
                    <label htmlFor="is_active" className="text-sm font-medium text-gray-700">
                      {t.active}
                    </label>
                  </div>
                </>
              )}
            </div>

            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-6 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowCategoryModal(false)}
                className="px-6 py-3 border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                {t.cancel}
              </button>
              <button
                onClick={handleSaveCategory}
                className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all"
              >
                {t.save}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Subcategory Modal */}
      {showSubcategoryModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowSubcategoryModal(false)}
        >
          <div className="bg-white rounded-2xl max-w-2xl w-full" onClick={(e) => e.stopPropagation()}>
            <div className="border-b border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-800">
                  {editingSubcategory ? t.editSubcategory : t.newSubcategory}
                </h3>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleSubcategoryTranslate}
                    disabled={isTranslating}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                    title="AI yordamida boshqa tillarga tarjima qilish"
                  >
                    {isTranslating ? (
                      <>
                        <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span className="hidden sm:inline">{t.translating}</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                        <span className="hidden sm:inline">{t.aiTranslate}</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => setShowSubcategoryModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Language Tabs */}
              <div className="flex gap-2 mt-4">
                {(['uz', 'ru', 'en'] as const).map((l) => (
                  <button
                    key={l}
                    onClick={() => setActiveTab(l)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      activeTab === l
                        ? 'bg-primary-500 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {l.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.name} ({activeTab.toUpperCase()})
                </label>
                <input
                  type="text"
                  value={subcategoryFormData[`name_${activeTab}` as keyof typeof subcategoryFormData] as string}
                  onChange={(e) => setSubcategoryFormData({ ...subcategoryFormData, [`name_${activeTab}`]: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder={`${t.subcategory} (${activeTab})`}
                />
              </div>

              {activeTab === 'uz' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t.order}
                    </label>
                    <input
                      type="number"
                      value={subcategoryFormData.order}
                      onChange={(e) => setSubcategoryFormData({ ...subcategoryFormData, order: parseInt(e.target.value) || 0 })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="subcat_active"
                      checked={subcategoryFormData.is_active}
                      onChange={(e) => setSubcategoryFormData({ ...subcategoryFormData, is_active: e.target.checked })}
                      className="w-5 h-5 text-primary-500 rounded focus:ring-2 focus:ring-primary-500"
                    />
                    <label htmlFor="subcat_active" className="text-sm font-medium text-gray-700">
                      {t.active}
                    </label>
                  </div>
                </>
              )}
            </div>

            <div className="bg-gray-50 border-t border-gray-200 p-6 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowSubcategoryModal(false)}
                className="px-6 py-3 border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                {t.cancel}
              </button>
              <button
                onClick={handleSaveSubcategory}
                className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all"
              >
                {t.save}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
