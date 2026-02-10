'use client'

import { useState, useEffect, useRef } from 'react'
import Cookies from 'js-cookie'
import { Icons } from './Icons'
import { Translations } from '@/lib/admin/translations'
import { projectsApi, ProjectData } from '@/lib/api/projects'
import { categoriesApi, CategoryData, SubcategoryData } from '@/lib/api/categories'
import { uploadsApi } from '@/lib/api/uploads'
import { translateApi } from '@/lib/api/translate'
import MultiSelectDropdown from '@/components/ui/MultiSelectDropdown'

// Image Carousel Component for Project Cards
function ProjectImageCarousel({ images }: { images: string[] }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || 'http://localhost:8000'

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrentIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  const getImageUrl = (url: string) => {
    if (url.startsWith('http')) return url
    return `${API_URL}${url}`
  }

  return (
    <div className="relative h-40 bg-gray-100 dark:bg-gray-700 group">
      <img
        src={getImageUrl(images[currentIndex])}
        alt="Project"
        className="w-full h-full object-cover"
      />
      {images.length > 1 && (
        <>
          {/* Left Arrow */}
          <button
            onClick={prevImage}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          {/* Right Arrow */}
          <button
            onClick={nextImage}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          {/* Dots */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
            {images.map((_, idx) => (
              <button
                key={idx}
                onClick={(e) => { e.stopPropagation(); setCurrentIndex(idx) }}
                className={`w-2 h-2 rounded-full transition-colors ${
                  idx === currentIndex ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        </>
      )}
      {/* Image counter */}
      {images.length > 1 && (
        <div className="absolute top-2 right-2 px-2 py-1 bg-black/50 text-white text-xs rounded-lg">
          {currentIndex + 1}/{images.length}
        </div>
      )}
    </div>
  )
}

interface FeatureItem {
  uz: string
  ru: string
  en: string
}

interface Project {
  id: number
  name: string
  name_uz?: string
  name_ru?: string
  name_en?: string
  description: string
  description_uz?: string
  description_ru?: string
  description_en?: string
  category: string
  subcategory: string
  technologies: string[]
  views: number
  favorites: number
  status: 'active' | 'inactive'
  color: string
  features: (string | FeatureItem)[]  // Can be old format (string[]) or new format ({uz,ru,en}[])
  integrations: string[]
  createdAt: string
  image_url?: string
  video_url?: string
  videos?: string[]
  images?: string[]
  is_top?: boolean
  is_new?: boolean
}

// Helper function to convert features from any format to new format
const normalizeFeatures = (features: (string | FeatureItem)[]): FeatureItem[] => {
  if (!features || !Array.isArray(features)) return []
  return features.map(f => {
    if (typeof f === 'string') {
      // Old format - string only, assume it's Uzbek
      return { uz: f, ru: '', en: '' }
    }
    // New format - already has uz, ru, en
    return { uz: f.uz || '', ru: f.ru || '', en: f.en || '' }
  })
}

// Helper function to get localized project name based on selected language
const getLocalizedName = (project: Project, lang: string): string => {
  if (lang === 'ru') return project.name_ru || project.name_uz || project.name
  if (lang === 'en') return project.name_en || project.name_uz || project.name
  return project.name_uz || project.name
}

// Helper function to get localized project description based on selected language
const getLocalizedDescription = (project: Project, lang: string): string => {
  if (lang === 'ru') return project.description_ru || project.description_uz || project.description
  if (lang === 'en') return project.description_en || project.description_uz || project.description
  return project.description_uz || project.description
}

// Helper function to get localized feature based on selected language
const getLocalizedFeature = (feature: string | FeatureItem, lang: string): string => {
  if (typeof feature === 'string') return feature
  if (lang === 'ru') return feature.ru || feature.uz || ''
  if (lang === 'en') return feature.en || feature.uz || ''
  return feature.uz || ''
}

interface ProjectsPageProps {
  t: Translations
  globalSearch: string
  lang: string
}

export default function ProjectsPage({ t, globalSearch, lang }: ProjectsPageProps) {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [showModal, setShowModal] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [viewProject, setViewProject] = useState<Project | null>(null)
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all')
  const [filterCategory, setFilterCategory] = useState('all')

  // Categories from database
  const [categories, setCategories] = useState<CategoryData[]>([])
  const [subcategoriesMap, setSubcategoriesMap] = useState<Record<number, SubcategoryData[]>>({})
  // Integration config types
  interface IntegrationConfig {
    telegram?: {
      bot_token: string
      chat_id: string
      webhook_url: string
    }
    api?: {
      api_key: string
      endpoint_url: string
      secret_key: string
    }
    phone?: {
      phone_number: string
      whatsapp_enabled: boolean
      call_enabled: boolean
    }
    payment?: {
      provider: string
      merchant_id: string
      api_key: string
      test_mode: boolean
    }
    sms?: {
      provider: string
      api_key: string
      sender_name: string
    }
    email?: {
      smtp_host: string
      smtp_port: string
      smtp_user: string
      smtp_password: string
      from_email: string
    }
  }

  const [formData, setFormData] = useState({
    name: { uz: '', ru: '', en: '' },
    description: { uz: '', ru: '', en: '' },
    categories: [] as string[],
    subcategories: [] as string[],
    technologies: '',
    color: 'from-[#00a6a6] to-[#00a6a6]/80',
    status: 'active' as 'active' | 'inactive',
    features: [] as { uz: string; ru: string; en: string }[],
    integrations: [] as { name: string; enabled: boolean }[],
    integrationConfigs: {} as IntegrationConfig,
    isTop: false,
    isNew: false,
    image: null as File | null,
    videos: [] as File[],
    images: [] as File[],
    // Existing media from server
    existingImage: '' as string,
    existingVideos: [] as string[],
    existingImages: [] as string[],
  })
  const [activeTab, setActiveTab] = useState<'uz' | 'ru' | 'en'>('uz')
  const [newFeature, setNewFeature] = useState({ uz: '', ru: '', en: '' })
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [videoPreviews, setVideoPreviews] = useState<string[]>([])
  const [additionalImagePreviews, setAdditionalImagePreviews] = useState<string[]>([])
  const [isTranslating, setIsTranslating] = useState(false)

  const availableIntegrations = [
    { id: 'telegram', name: 'Telegram' },
    { id: 'api', name: 'API' },
    { id: 'phone', name: 'Telefon' },
    { id: 'payment', name: "To'lov tizimlari" },
    { id: 'sms', name: 'SMS' },
    { id: 'email', name: 'Email' }
  ]


  // Fetch categories on mount
  useEffect(() => {
    fetchCategories()
  }, [])

  // Fetch projects from API
  useEffect(() => {
    fetchProjects()
  }, [filterStatus, filterCategory])

  const fetchCategories = async () => {
    try {
      const data = await categoriesApi.list({ is_active: true })
      setCategories(data)

      // Fetch subcategories for all categories
      const subcatsMap: Record<number, SubcategoryData[]> = {}
      for (const cat of data) {
        try {
          const subcats = await categoriesApi.listSubcategories(cat.id!, true)
          subcatsMap[cat.id!] = subcats
        } catch (err) {
          console.error(`Failed to fetch subcategories for category ${cat.id}:`, err)
        }
      }
      setSubcategoriesMap(subcatsMap)
    } catch (err) {
      console.error('Failed to fetch categories:', err)
    }
  }

  const fetchProjects = async () => {
    try {
      setLoading(true)
      setError(null)
      const params: any = {}
      if (filterStatus !== 'all') params.status = filterStatus
      if (filterCategory !== 'all') params.category = filterCategory
      if (globalSearch.trim()) params.search = globalSearch

      const data = await projectsApi.list(params)

      // Convert backend format to frontend format
      const convertedProjects: Project[] = data.map((p: ProjectData) => ({
        id: p.id!,
        name: p.name_uz,
        name_uz: p.name_uz,
        name_ru: p.name_ru || '',
        name_en: p.name_en || '',
        description: p.description_uz,
        description_uz: p.description_uz,
        description_ru: p.description_ru || '',
        description_en: p.description_en || '',
        category: p.category,
        subcategory: p.subcategory || '',
        technologies: p.technologies || [],
        views: p.views || 0,
        favorites: p.favorites || 0,
        status: p.status || 'active',
        color: p.color || 'from-primary-500 to-primary-600',
        features: p.features || [],
        integrations: p.integrations || [],
        createdAt: p.created_at ? new Date(p.created_at).toISOString().split('T')[0] : '',
        image_url: p.image_url || undefined,
        video_url: p.video_url || undefined,
        videos: p.videos || [],
        images: p.images || []
      }))

      setProjects(convertedProjects)
    } catch (err) {
      console.error('Failed to fetch projects:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch projects')
    } finally {
      setLoading(false)
    }
  }

  const getToken = () => {
    return Cookies.get('access_token') || ''
  }

  // AI tarjima funksiyasi
  const handleAITranslate = async () => {
    // Qaysi tilda ma'lumot bor tekshirish
    let sourceLang: 'uz' | 'ru' | 'en' | null = null
    let sourceText = { name: '', description: '' }

    if (formData.name.uz.trim() || formData.description.uz.trim()) {
      sourceLang = 'uz'
      sourceText = { name: formData.name.uz, description: formData.description.uz }
    } else if (formData.name.ru.trim() || formData.description.ru.trim()) {
      sourceLang = 'ru'
      sourceText = { name: formData.name.ru, description: formData.description.ru }
    } else if (formData.name.en.trim() || formData.description.en.trim()) {
      sourceLang = 'en'
      sourceText = { name: formData.name.en, description: formData.description.en }
    }

    if (!sourceLang) {
      alert(t.pleaseEnterName)
      return
    }

    // Faqat bo'sh maydonlarni tarjima qilish uchun targetLangs ni filtrlash
    const allTargetLangs = ['uz', 'ru', 'en'].filter(l => l !== sourceLang) as ('uz' | 'ru' | 'en')[]
    const emptyNameLangs = allTargetLangs.filter(lang => !formData.name[lang].trim())
    const emptyDescLangs = allTargetLangs.filter(lang => !formData.description[lang].trim())

    if (emptyNameLangs.length === 0 && emptyDescLangs.length === 0) {
      alert('⚠️ Barcha maydonlar to\'ldirilgan. Tarjima kerak emas.')
      return
    }

    setIsTranslating(true)
    try {
      const token = getToken()

      // Name tarjimasi - faqat bo'sh maydonlar uchun
      if (sourceText.name.trim() && emptyNameLangs.length > 0) {
        const nameResult = await translateApi.translate({
          text: sourceText.name,
          source_lang: sourceLang,
          target_langs: emptyNameLangs
        }, token)

        if (nameResult.success) {
          const newName = { ...formData.name }
          emptyNameLangs.forEach(lang => {
            if (nameResult.translations[lang]) {
              newName[lang] = nameResult.translations[lang]
            }
          })
          setFormData(prev => ({ ...prev, name: newName }))
        }
      }

      // Description tarjimasi - faqat bo'sh maydonlar uchun
      if (sourceText.description.trim() && emptyDescLangs.length > 0) {
        const descResult = await translateApi.translate({
          text: sourceText.description,
          source_lang: sourceLang,
          target_langs: emptyDescLangs
        }, token)

        if (descResult.success) {
          const newDesc = { ...formData.description }
          emptyDescLangs.forEach(lang => {
            if (descResult.translations[lang]) {
              newDesc[lang] = descResult.translations[lang]
            }
          })
          setFormData(prev => ({ ...prev, description: newDesc }))
        }
      }

      // Technologies tarjima qilinmaydi - texnik terminlar
      // Foydalanuvchi o'zi kiritishi kerak

      alert('✅ ' + t.translationSuccess + '\n\n⚠️ Eslatma: Texnik terminlarni (Teknologiyalar) o\'zingiz kiriting - AI noto\'g\'ri tarjima qilishi mumkin.')
    } catch (err) {
      console.error('Translation error:', err)
      alert(err instanceof Error ? err.message : t.translationError)
    } finally {
      setIsTranslating(false)
    }
  }

  const getDefaultIntegrationConfigs = (): IntegrationConfig => ({
    telegram: { bot_token: '', chat_id: '', webhook_url: '' },
    api: { api_key: '', endpoint_url: '', secret_key: '' },
    phone: { phone_number: '', whatsapp_enabled: false, call_enabled: true },
    payment: { provider: 'payme', merchant_id: '', api_key: '', test_mode: true },
    sms: { provider: 'eskiz', api_key: '', sender_name: '' },
    email: { smtp_host: '', smtp_port: '587', smtp_user: '', smtp_password: '', from_email: '' }
  })

  const openAddModal = () => {
    setEditingProject(null)
    setFormData({
      name: { uz: '', ru: '', en: '' },
      description: { uz: '', ru: '', en: '' },
      categories: [],
      subcategories: [],
      technologies: '',
      color: 'from-[#00a6a6] to-[#00a6a6]/80',
      status: 'active',
      features: [],
      integrations: availableIntegrations.map(i => ({ name: i.name, enabled: false })),
      integrationConfigs: getDefaultIntegrationConfigs(),
      isTop: false,
      isNew: false,
      image: null,
      videos: [],
      images: [],
      existingImage: '',
      existingVideos: [],
      existingImages: [],
    })
    setImagePreview(null)
    setVideoPreviews([])
    setAdditionalImagePreviews([])
    setActiveTab('uz')
    setShowModal(true)
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData({ ...formData, image: file })
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleVideosChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      const newFiles = Array.from(files)
      setFormData({ ...formData, videos: [...formData.videos, ...newFiles] })
      newFiles.forEach(file => {
        const reader = new FileReader()
        reader.onloadend = () => {
          setVideoPreviews(prev => [...prev, reader.result as string])
        }
        reader.readAsDataURL(file)
      })
    }
  }

  const removeVideo = (index: number) => {
    // Check if it's an existing video or a new one
    const existingCount = formData.existingVideos.length
    if (index < existingCount) {
      // Remove from existing videos
      setFormData({
        ...formData,
        existingVideos: formData.existingVideos.filter((_, i) => i !== index)
      })
    } else {
      // Remove from new videos
      const newIndex = index - existingCount
      setFormData({
        ...formData,
        videos: formData.videos.filter((_, i) => i !== newIndex)
      })
    }
    setVideoPreviews(prev => prev.filter((_, i) => i !== index))
  }

  const handleAdditionalImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      const newFiles = Array.from(files)
      setFormData({ ...formData, images: [...formData.images, ...newFiles] })
      newFiles.forEach(file => {
        const reader = new FileReader()
        reader.onloadend = () => {
          setAdditionalImagePreviews(prev => [...prev, reader.result as string])
        }
        reader.readAsDataURL(file)
      })
    }
  }

  const removeAdditionalImage = (index: number) => {
    // Check if it's an existing image or a new one
    const existingCount = formData.existingImages.length
    if (index < existingCount) {
      // Remove from existing images
      setFormData({
        ...formData,
        existingImages: formData.existingImages.filter((_, i) => i !== index)
      })
    } else {
      // Remove from new images
      const newIndex = index - existingCount
      setFormData({
        ...formData,
        images: formData.images.filter((_, i) => i !== newIndex)
      })
    }
    setAdditionalImagePreviews(prev => prev.filter((_, i) => i !== index))
  }

  const removeExistingMainImage = () => {
    setFormData({ ...formData, existingImage: '' })
    setImagePreview(null)
  }

  const addFeature = () => {
    if (newFeature.uz.trim() || newFeature.ru.trim() || newFeature.en.trim()) {
      setFormData({ ...formData, features: [...formData.features, { ...newFeature }] })
      setNewFeature({ uz: '', ru: '', en: '' })
    }
  }

  const removeFeature = (index: number) => {
    setFormData({ ...formData, features: formData.features.filter((_, i) => i !== index) })
  }

  const updateFeature = (index: number, lang: 'uz' | 'ru' | 'en', value: string) => {
    const updatedFeatures = [...formData.features]
    updatedFeatures[index] = { ...updatedFeatures[index], [lang]: value }
    setFormData({ ...formData, features: updatedFeatures })
  }

  // Helper function for WYSIWYG text formatting
  const editorRef = useRef<HTMLDivElement>(null)

  // Update editor content when activeTab or formData changes
  useEffect(() => {
    if (editorRef.current && showModal) {
      const currentContent = formData.description[activeTab] || ''
      // Only update if content is different to preserve cursor position
      if (editorRef.current.innerHTML !== currentContent) {
        editorRef.current.innerHTML = currentContent
      }
    }
  }, [activeTab, showModal])

  const formatText = (command: string, value: string | undefined = undefined) => {
    if (!editorRef.current) return

    editorRef.current.focus()

    // For better browser compatibility, use setTimeout
    setTimeout(() => {
      if (!editorRef.current) return

      try {
        // Enable design mode temporarily for better execCommand support
        document.execCommand('styleWithCSS', false, 'true')
        document.execCommand(command, false, value)

        // Update formData with the new HTML
        const newContent = editorRef.current.innerHTML
        setFormData({ ...formData, description: { ...formData.description, [activeTab]: newContent } })
      } catch (error) {
        console.error('Format error:', error)
      }
    }, 0)
  }

  const handleEditorInput = (e: React.FormEvent<HTMLDivElement>) => {
    const newContent = e.currentTarget.innerHTML
    setFormData({ ...formData, description: { ...formData.description, [activeTab]: newContent } })
  }

  const handleEditorKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    // Handle Enter key for proper line breaks
    if (e.key === 'Enter' && !e.shiftKey) {
      // Check if we're in a list - if so, let default behavior work
      const selection = window.getSelection()
      if (selection && selection.anchorNode) {
        const parentElement = selection.anchorNode.parentElement
        if (parentElement && (parentElement.closest('ul') || parentElement.closest('ol'))) {
          // We're in a list, let default behavior work
          return
        }
      }

      // Otherwise, insert a line break
      e.preventDefault()
      document.execCommand('insertLineBreak', false, undefined)

      // Update state
      setTimeout(() => {
        if (editorRef.current) {
          const newContent = editorRef.current.innerHTML
          setFormData({ ...formData, description: { ...formData.description, [activeTab]: newContent } })
        }
      }, 0)
    }
  }

  const moveFeatureUp = (index: number) => {
    if (index === 0) return
    const updatedFeatures = [...formData.features]
    const temp = updatedFeatures[index]
    updatedFeatures[index] = updatedFeatures[index - 1]
    updatedFeatures[index - 1] = temp
    setFormData({ ...formData, features: updatedFeatures })
  }

  const moveFeatureDown = (index: number) => {
    if (index === formData.features.length - 1) return
    const updatedFeatures = [...formData.features]
    const temp = updatedFeatures[index]
    updatedFeatures[index] = updatedFeatures[index + 1]
    updatedFeatures[index + 1] = temp
    setFormData({ ...formData, features: updatedFeatures })
  }

  // AI tarjima - faqat bitta feature uchun
  const handleFeatureTranslate = async (index: number) => {
    const feature = formData.features[index]

    let sourceLang: 'uz' | 'ru' | 'en' | null = null
    let sourceText = ''

    if (feature.uz.trim()) {
      sourceLang = 'uz'
      sourceText = feature.uz
    } else if (feature.ru.trim()) {
      sourceLang = 'ru'
      sourceText = feature.ru
    } else if (feature.en.trim()) {
      sourceLang = 'en'
      sourceText = feature.en
    }

    if (!sourceLang) {
      alert(t.pleaseEnterName)
      return
    }

    // Faqat bo'sh maydonlarni tarjima qilish
    const allTargetLangs = ['uz', 'ru', 'en'].filter(l => l !== sourceLang) as ('uz' | 'ru' | 'en')[]
    const emptyLangs = allTargetLangs.filter(lang => !feature[lang].trim())

    if (emptyLangs.length === 0) {
      alert('⚠️ Barcha maydonlar to\'ldirilgan.')
      return
    }

    try {
      const result = await translateApi.translate({
        text: sourceText,
        source_lang: sourceLang,
        target_langs: emptyLangs
      })

      if (result.success) {
        const updatedFeatures = [...formData.features]
        emptyLangs.forEach(lang => {
          if (result.translations[lang]) {
            updatedFeatures[index] = { ...updatedFeatures[index], [lang]: result.translations[lang] }
          }
        })
        setFormData({ ...formData, features: updatedFeatures })
      }
    } catch (err) {
      console.error('Feature translation error:', err)
      alert(err instanceof Error ? err.message : t.translationError)
    }
  }

  // AI tarjima - yangi feature uchun
  const handleNewFeatureTranslate = async () => {
    let sourceLang: 'uz' | 'ru' | 'en' | null = null
    let sourceText = ''

    if (newFeature.uz.trim()) {
      sourceLang = 'uz'
      sourceText = newFeature.uz
    } else if (newFeature.ru.trim()) {
      sourceLang = 'ru'
      sourceText = newFeature.ru
    } else if (newFeature.en.trim()) {
      sourceLang = 'en'
      sourceText = newFeature.en
    }

    if (!sourceLang) {
      alert(t.pleaseEnterName)
      return
    }

    // Faqat bo'sh maydonlarni tarjima qilish
    const allTargetLangs = ['uz', 'ru', 'en'].filter(l => l !== sourceLang) as ('uz' | 'ru' | 'en')[]
    const emptyLangs = allTargetLangs.filter(lang => !newFeature[lang].trim())

    if (emptyLangs.length === 0) {
      alert('⚠️ Barcha maydonlar to\'ldirilgan.')
      return
    }

    try {
      const result = await translateApi.translate({
        text: sourceText,
        source_lang: sourceLang,
        target_langs: emptyLangs
      })

      if (result.success) {
        const updatedFeature = { ...newFeature }
        emptyLangs.forEach(lang => {
          if (result.translations[lang]) {
            updatedFeature[lang] = result.translations[lang]
          }
        })
        setNewFeature(updatedFeature)
      }
    } catch (err) {
      console.error('Feature translation error:', err)
      alert(err instanceof Error ? err.message : t.translationError)
    }
  }

  const openEditModal = (project: Project) => {
    setEditingProject(project)

    // Get API URL for existing media
    const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || 'http://localhost:8000'
    const getFullUrl = (url: string) => {
      if (!url) return ''
      if (url.startsWith('http')) return url
      return `${API_URL}${url}`
    }

    setFormData({
      name: {
        uz: project.name_uz || project.name,
        ru: project.name_ru || '',
        en: project.name_en || ''
      },
      description: {
        uz: project.description_uz || project.description,
        ru: project.description_ru || '',
        en: project.description_en || ''
      },
      categories: project.category ? project.category.split(',').map((c: string) => c.trim()).filter(Boolean) : [],
      subcategories: project.subcategory ? project.subcategory.split(',').map((s: string) => s.trim()).filter(Boolean) : [],
      technologies: project.technologies.join(', '),
      color: project.color,
      status: project.status,
      features: normalizeFeatures(project.features),
      integrations: availableIntegrations.map(i => ({
        name: i.name,
        enabled: project.integrations.includes(i.name)
      })),
      integrationConfigs: getDefaultIntegrationConfigs(),
      isTop: project.is_top || false,
      isNew: project.is_new || false,
      image: null,
      videos: [],
      images: [],
      // Set existing media
      existingImage: project.image_url || '',
      existingVideos: project.videos || (project.video_url ? [project.video_url] : []),
      existingImages: project.images || [],
    })

    // Set preview for existing main image
    if (project.image_url) {
      setImagePreview(getFullUrl(project.image_url))
    } else {
      setImagePreview(null)
    }

    // Set previews for existing videos
    if (project.videos && project.videos.length > 0) {
      setVideoPreviews(project.videos.map(v => getFullUrl(v)))
    } else if (project.video_url) {
      setVideoPreviews([getFullUrl(project.video_url)])
    } else {
      setVideoPreviews([])
    }

    // Set previews for existing additional images
    if (project.images && project.images.length > 0) {
      setAdditionalImagePreviews(project.images.map(img => getFullUrl(img)))
    } else {
      setAdditionalImagePreviews([])
    }

    setActiveTab('uz')
    setShowModal(true)
  }

  const openViewModal = (project: Project) => {
    setViewProject(project)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingProject(null)
  }

  const closeViewModal = () => {
    setViewProject(null)
  }

  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    try {
      setSaving(true)
      const token = getToken()
      if (!token) {
        alert(t.pleaseReLogin)
        return
      }

      // Validate required fields
      if (!formData.name.uz.trim()) {
        alert('Loyiha nomi (O\'zbekcha) kiritilishi shart!')
        setSaving(false)
        return
      }

      if (!formData.description.uz.trim()) {
        alert('Loyiha izohi (O\'zbekcha) kiritilishi shart!')
        setSaving(false)
        return
      }

      // Upload main image or keep existing
      let imageUrl = formData.existingImage || null
      if (formData.image) {
        const result = await uploadsApi.uploadImage(formData.image, token)
        imageUrl = result.url
      }

      // Upload videos or keep existing
      let videoUrls: string[] = [...formData.existingVideos]
      if (formData.videos.length > 0) {
        for (const video of formData.videos) {
          const result = await uploadsApi.uploadVideo(video, token)
          videoUrls.push(result.url)
        }
      }

      // Upload additional images or keep existing
      let imagesUrls: string[] = [...formData.existingImages]
      if (formData.images.length > 0) {
        const result = await uploadsApi.uploadMultipleImages(formData.images, token)
        imagesUrls = [...imagesUrls, ...result.urls]
      }

      const projectData: any = {
        name_uz: formData.name.uz,
        name_ru: formData.name.ru || null,
        name_en: formData.name.en || null,
        description_uz: formData.description.uz,
        description_ru: formData.description.ru || null,
        description_en: formData.description.en || null,
        category: formData.categories.join(', '),
        subcategory: formData.subcategories.join(', ') || null,
        technologies: formData.technologies.split(',').map(t => t.trim()).filter(Boolean),
        features: formData.features,
        integrations: formData.integrations.filter(i => i.enabled).map(i => i.name),
        color: formData.color,
        status: formData.status,
        is_top: formData.isTop,
        is_new: formData.isNew,
        image_url: imageUrl,
        video_url: videoUrls.length > 0 ? videoUrls[0] : null,
        videos: videoUrls,
        images: imagesUrls
      }

      if (editingProject) {
        await projectsApi.update(editingProject.id, projectData, token)
      } else {
        await projectsApi.create(projectData, token)
      }

      await fetchProjects()
      closeModal()
    } catch (err) {
      console.error('Failed to save project:', err)
      const errorMessage = err instanceof Error ? err.message : 'Failed to save project'

      // Check if it's an authentication error
      if (errorMessage.includes('Could not validate credentials') || errorMessage.includes('401')) {
        alert(t.sessionExpired)
        // Clear cookies and redirect to login
        Cookies.remove('access_token')
        Cookies.remove('refresh_token')
        window.location.reload()
      } else {
        alert(errorMessage)
      }
    } finally {
      setSaving(false)
    }
  }

  const deleteProject = async (id: number) => {
    if (confirm(t.deleteProjectConfirm)) {
      try {
        const token = getToken()
        if (!token) {
          alert(t.pleaseReLogin)
          return
        }

        await projectsApi.delete(id, token)

        // Update local state without refetching (prevents scroll jump)
        setProjects(prev => prev.filter(p => p.id !== id))
      } catch (err) {
        console.error('Failed to delete project:', err)
        const errorMessage = err instanceof Error ? err.message : t.errorLoadingProjects

        // Check for authentication/permission errors
        if (errorMessage.includes('Could not validate credentials') || errorMessage.includes('401')) {
          alert(t.sessionExpired)
          Cookies.remove('access_token')
          Cookies.remove('refresh_token')
          window.location.reload()
        } else if (errorMessage.includes('Not enough permissions') || errorMessage.includes('403')) {
          alert(t.noPermission)
        } else {
          alert(errorMessage)
        }
      }
    }
  }

  const toggleStatus = async (id: number) => {
    try {
      const token = getToken()
      if (!token) {
        alert(t.pleaseReLogin)
        return
      }

      const project = projects.find(p => p.id === id)
      if (!project) return

      const newStatus = project.status === 'active' ? 'inactive' : 'active'
      await projectsApi.update(id, { status: newStatus }, token)

      // Update local state without refetching (prevents scroll jump)
      setProjects(prev => prev.map(p =>
        p.id === id ? { ...p, status: newStatus } : p
      ))
    } catch (err) {
      console.error('Failed to toggle status:', err)
      const errorMessage = err instanceof Error ? err.message : t.statusChangeError2

      if (errorMessage.includes('Could not validate credentials') || errorMessage.includes('401')) {
        alert(t.sessionExpired)
        Cookies.remove('access_token')
        Cookies.remove('refresh_token')
        window.location.reload()
      } else if (errorMessage.includes('Not enough permissions') || errorMessage.includes('403')) {
        alert(t.noPermission)
      } else {
        alert(errorMessage)
      }
    }
  }

  const filteredProjects = projects.filter(p => {
    if (filterStatus !== 'all' && p.status !== filterStatus) return false
    if (filterCategory !== 'all' && !p.category.split(',').map(c => c.trim()).includes(filterCategory)) return false
    if (globalSearch.trim()) {
      const query = globalSearch.toLowerCase()
      if (!p.name.toLowerCase().includes(query) && !p.description.toLowerCase().includes(query)) return false
    }
    return true
  })

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">{t.projects}</h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">{t.total}: {filteredProjects.length}</p>
        </div>
        <button
          onClick={openAddModal}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 bg-[#00a6a6] hover:bg-[#00a6a6]/90 text-white rounded-xl font-medium transition-all"
        >
          {Icons.plus}
          <span>{t.newProject}</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as any)}
          className="flex-1 sm:flex-none px-3 sm:px-4 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-[#00a6a6]"
        >
          <option value="all">{t.all} {t.status}</option>
          <option value="active">{t.active}</option>
          <option value="inactive">{t.blocked}</option>
        </select>

        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="flex-1 sm:flex-none px-3 sm:px-4 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-[#00a6a6]"
        >
          <option value="all">{t.all} {t.categories}</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.name_uz}>
              {lang === 'uz' ? cat.name_uz : lang === 'ru' ? (cat.name_ru || cat.name_uz) : (cat.name_en || cat.name_uz)}
            </option>
          ))}
        </select>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00a6a6]"></div>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 text-center">
          <p className="text-red-600 dark:text-red-400 font-medium mb-2">{t.errorLoadingProjects}</p>
          <p className="text-red-500 dark:text-red-300 text-sm mb-4">{error}</p>
          <button
            onClick={fetchProjects}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm"
          >
            {t.tryAgain}
          </button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && filteredProjects.length === 0 && (
        <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-12 text-center">
          <p className="text-gray-600 dark:text-gray-400 text-lg mb-2">{t.noProjectsFoundEmpty}</p>
          <p className="text-gray-500 dark:text-gray-500 text-sm mb-4">{t.startByCreatingProject}</p>
          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#00a6a6] hover:bg-[#00a6a6]/90 text-white rounded-xl font-medium transition-all"
          >
            {Icons.plus}
            <span>{t.newProject}</span>
          </button>
        </div>
      )}

      {/* Projects Grid */}
      {!loading && !error && filteredProjects.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredProjects.map(project => {
            const allImages = [project.image_url, ...(project.images || [])].filter(Boolean) as string[]
            return (
          <div
            key={project.id}
            className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-all flex flex-col"
          >
            {/* Image Carousel */}
            {allImages.length > 0 ? (
              <ProjectImageCarousel images={allImages} />
            ) : (
              <div className="h-40 bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                <div className="text-center">
                  <svg className="w-12 h-12 text-gray-300 dark:text-gray-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{t.noImage}</p>
                </div>
              </div>
            )}
            <div className="p-3 sm:p-4 flex flex-col flex-1">
              <div className="flex items-start justify-between mb-2">
                <div className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg">
                  <span className="text-xs font-mono text-gray-600 dark:text-gray-400">ID: {project.id}</span>
                </div>
                <span className={`px-2 py-0.5 rounded-md text-xs font-medium ${
                  project.status === 'active'
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                    : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400'
                }`}>
                  {project.status === 'active' ? t.active : t.blocked}
                </span>
              </div>

              <h3 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white mb-1">{getLocalizedName(project, lang)}</h3>
              <div
                className="text-xs text-gray-600 dark:text-gray-400 mb-2 line-clamp-2"
                dangerouslySetInnerHTML={{ __html: getLocalizedDescription(project, lang) }}
              />

              <div className="flex items-center gap-1 mb-2 flex-wrap">
                {project.category && project.category.split(',').map((cat: string) => cat.trim()).filter(Boolean).map((cat, i) => (
                  <span key={`cat-${i}`} className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded">
                    {cat}
                  </span>
                ))}
                {project.subcategory && project.subcategory.split(',').map((sub: string) => sub.trim()).filter(Boolean).map((sub, i) => (
                  <span key={`sub-${i}`} className="px-1.5 py-0.5 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded">
                    {sub}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-3 mb-2 text-xs text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-1">
                  {Icons.eye}
                  <span>{project.views.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-1">
                  {Icons.heartFilled}
                  <span>{project.favorites}</span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 flex-wrap mb-2 flex-1">
                {project.technologies.slice(0, 3).map((tech, idx) => (
                  <span key={idx} className="px-1.5 py-0.5 bg-[#00a6a6]/10 text-[#00a6a6] text-xs rounded">
                    {tech}
                  </span>
                ))}
                {project.technologies.length > 3 && (
                  <span className="text-xs text-gray-500">+{project.technologies.length - 3}</span>
                )}
              </div>

              <div className="flex items-center gap-1.5 mt-auto">
                <button
                  onClick={() => openViewModal(project)}
                  className="flex-1 px-2 sm:px-3 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-xl text-xs sm:text-sm font-medium transition-all"
                >
                  {t.view}
                </button>
                <button
                  onClick={() => openEditModal(project)}
                  className="p-2 sm:px-3 sm:py-2 bg-[#00a6a6]/10 hover:bg-[#00a6a6]/20 text-[#00a6a6] rounded-xl transition-all"
                >
                  {Icons.edit}
                </button>
                <button
                  onClick={() => toggleStatus(project.id)}
                  className="p-2 sm:px-3 sm:py-2 bg-[#33ccff]/20 hover:bg-[#33ccff]/30 dark:bg-[#33ccff]/20 dark:hover:bg-[#33ccff]/30 text-[#33ccff] rounded-xl transition-all"
                >
                  {project.status === 'active' ? Icons.shield : Icons.check}
                </button>
                <button
                  onClick={() => deleteProject(project.id)}
                  className="p-2 sm:px-3 sm:py-2 bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-700 dark:text-red-400 rounded-xl transition-all"
                >
                  {Icons.trash}
                </button>
              </div>
            </div>
          </div>
          )})}
        </div>
      )}

      {/* View Modal */}
      {viewProject && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4 overflow-y-auto" onClick={closeViewModal}>
          <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl w-full max-w-2xl my-4 sm:my-8 max-h-[95vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            {/* Project Image */}
            {(() => {
              const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || 'http://localhost:8000'
              const getImageUrl = (url: string) => url?.startsWith('http') ? url : `${API_URL}${url}`
              const allImages = [viewProject.image_url, ...(viewProject.images || [])].filter(Boolean) as string[]

              return allImages.length > 0 && (
                <div className="relative h-48 sm:h-56 bg-gray-100 dark:bg-gray-700">
                  <img
                    src={getImageUrl(allImages[0])}
                    alt={viewProject.name}
                    className="w-full h-full object-cover"
                  />
                  {allImages.length > 1 && (
                    <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/50 text-white text-xs rounded-lg">
                      +{allImages.length - 1} {t.moreImages}
                    </div>
                  )}
                  <div className="absolute top-2 left-2 flex gap-2">
                    <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                      viewProject.status === 'active'
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-500 text-white'
                    }`}>
                      {viewProject.status === 'active' ? t.active : t.inactive}
                    </span>
                  </div>
                </div>
              )
            })()}

            <div className="p-4 sm:p-6 border-b border-gray-100 dark:border-gray-700">
              <div className="flex items-start sm:items-center justify-between gap-2">
                <div className="flex items-start sm:items-center gap-3 sm:gap-4 flex-1">
                  <div className="px-3 py-2 bg-[#00a6a6]/10 rounded-xl flex-shrink-0">
                    <span className="text-sm font-mono font-bold text-[#00a6a6]">ID: {viewProject.id}</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white truncate">{getLocalizedName(viewProject, lang)}</h2>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">{viewProject.category} / {viewProject.subcategory}</p>
                  </div>
                </div>
                <button onClick={closeViewModal} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg flex-shrink-0">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              {/* Multi-language names */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{t.uzLang}</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{viewProject.name_uz || viewProject.name}</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{t.ruLang}</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{viewProject.name_ru || '-'}</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{t.enLang}</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{viewProject.name_en || '-'}</p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">{t.description}</h3>
                <div
                  className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: getLocalizedDescription(viewProject, lang) }}
                />
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">{t.technology}</h3>
                <div className="flex items-center gap-2 flex-wrap">
                  {viewProject.technologies.map((tech, idx) => (
                    <span key={idx} className="px-3 py-1 bg-[#00a6a6]/10 text-[#00a6a6] rounded-lg text-sm">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {viewProject.features.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">{t.features}</h3>
                  <ul className="space-y-2">
                    {viewProject.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                          <span className="text-green-500">{Icons.check}</span>
                          <span className="text-sm">{getLocalizedFeature(feature, lang)}</span>
                        </li>
                    ))}
                  </ul>
                </div>
              )}

              {viewProject.integrations.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">{t.integrations}</h3>
                  <div className="flex items-center gap-2 flex-wrap">
                    {viewProject.integrations.map((integration, idx) => (
                      <span key={idx} className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm">
                        {integration}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{t.views}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{viewProject.views.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{t.favorites}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{viewProject.favorites}</p>
                </div>
              </div>

              {/* Action Buttons in View Modal */}
              <div className="flex items-center gap-2 pt-4 border-t border-gray-100 dark:border-gray-700">
                <button
                  onClick={() => { closeViewModal(); openEditModal(viewProject); }}
                  className="flex-1 px-4 py-2.5 bg-[#00a6a6] hover:bg-[#00a6a6]/90 text-white rounded-xl font-medium transition-all flex items-center justify-center gap-2"
                >
                  {Icons.edit}
                  <span>{t.edit}</span>
                </button>
                <button
                  onClick={() => { closeViewModal(); deleteProject(viewProject.id); }}
                  className="px-4 py-2.5 bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-700 dark:text-red-400 rounded-xl font-medium transition-all flex items-center justify-center gap-2"
                >
                  {Icons.trash}
                  <span>{t.delete}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4 overflow-y-auto" onClick={closeModal}>
          <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl w-full max-w-2xl my-4 sm:my-8 max-h-[95vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="p-3 sm:p-4 md:p-6 border-b border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4">
              <h2 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 dark:text-white">
                {editingProject ? t.editProject : t.newProject}
              </h2>
              <button
                type="button"
                onClick={handleAITranslate}
                disabled={isTranslating}
                className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl w-full sm:w-auto"
                title="AI yordamida boshqa tillarga tarjima qilish"
              >
                {isTranslating ? (
                  <>
                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="hidden sm:inline">Tarjima...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    <span className="hidden sm:inline">AI Tarjima</span>
                  </>
                )}
              </button>
            </div>

            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              {/* Rasm yuklash */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  {t.projectImage}
                </label>
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-6 text-center hover:border-[#00a6a6] transition-colors">
                  <input
                    type="file"
                    id="image-upload"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  {imagePreview ? (
                    <div className="space-y-2 relative inline-block">
                      <img src={imagePreview} alt="Preview" className="w-32 h-32 object-cover mx-auto rounded-lg" />
                      <div className="flex items-center justify-center gap-2 mt-2">
                        <label htmlFor="image-upload" className="cursor-pointer px-3 py-1 bg-[#00a6a6] text-white text-xs rounded-lg hover:bg-[#008f8f]">
                          {t.changeImage}
                        </label>
                        <button
                          type="button"
                          onClick={removeExistingMainImage}
                          className="px-3 py-1 bg-red-500 text-white text-xs rounded-lg hover:bg-red-600"
                        >
                          {t.deleteImage}
                        </button>
                      </div>
                      {formData.existingImage && !formData.image && (
                        <p className="text-xs text-green-600 dark:text-green-400 mt-1">{t.existingImage}</p>
                      )}
                    </div>
                  ) : (
                    <label htmlFor="image-upload" className="cursor-pointer block">
                      <div className="space-y-2">
                        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto">
                          {Icons.image}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{t.dropImageHere}</p>
                        <p className="text-xs text-gray-500">{t.imageFormats}</p>
                      </div>
                    </label>
                  )}
                </div>
              </div>


              {/* Video yuklash */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  {t.projectVideos}
                </label>
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-4 text-center hover:border-[#00a6a6] transition-colors cursor-pointer">
                  <input
                    type="file"
                    id="video-upload"
                    accept="video/*"
                    multiple
                    onChange={handleVideosChange}
                    className="hidden"
                  />
                  <label htmlFor="video-upload" className="cursor-pointer">
                    <div className="space-y-2">
                      <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto">
                        <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{t.addVideo}</p>
                      <p className="text-xs text-gray-500">{t.videoFormatsShort}</p>
                    </div>
                  </label>
                </div>
                {videoPreviews.length > 0 && (
                  <div className="space-y-3 mt-3">
                    {videoPreviews.map((preview, idx) => {
                      const isExisting = idx < formData.existingVideos.length
                      return (
                        <div key={idx} className="relative group border-2 border-dashed border-[#00a6a6] rounded-xl p-2 bg-gray-50 dark:bg-gray-800">
                          <video
                            src={preview}
                            className="w-full rounded-lg"
                            style={{ maxHeight: '200px' }}
                            controls
                            preload="metadata"
                          />
                          <button
                            type="button"
                            onClick={() => removeVideo(idx)}
                            className="absolute top-3 right-3 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg transition-colors"
                          >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                          {isExisting && (
                            <span className="absolute bottom-3 left-3 px-2 py-1 bg-green-500 text-white text-xs font-medium rounded-lg shadow">
                              {t.existing}
                            </span>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>

              {/* Qo'shimcha rasmlar */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  {t.additionalImages}
                </label>
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-4 hover:border-[#00a6a6] transition-colors">
                  <input
                    type="file"
                    id="additional-images-upload"
                    accept="image/*"
                    multiple
                    onChange={handleAdditionalImagesChange}
                    className="hidden"
                  />
                  <label htmlFor="additional-images-upload" className="cursor-pointer block text-center">
                    <div className="flex items-center justify-center gap-2 text-gray-600 dark:text-gray-400">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      <span className="text-sm">{t.addImage}</span>
                    </div>
                  </label>
                </div>
                {additionalImagePreviews.length > 0 && (
                  <div className="grid grid-cols-4 gap-2 mt-3">
                    {additionalImagePreviews.map((preview, idx) => {
                      const isExisting = idx < formData.existingImages.length
                      return (
                        <div key={idx} className="relative group">
                          <img src={preview} alt={`Preview ${idx + 1}`} className="w-full h-16 object-cover rounded-lg" />
                          <button
                            type="button"
                            onClick={() => removeAdditionalImage(idx)}
                            className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                          {isExisting && (
                            <span className="absolute bottom-0.5 left-0.5 px-1 py-0.5 bg-green-500 text-white text-[8px] rounded">
                              {t.existing}
                            </span>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
              {/* Loyiha nomi - Multi-language */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  {t.projectName} *
                </label>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setActiveTab('uz')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        activeTab === 'uz' ? 'bg-[#00a6a6] text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      UZ
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('ru')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        activeTab === 'ru' ? 'bg-[#00a6a6] text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      RU
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('en')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        activeTab === 'en' ? 'bg-[#00a6a6] text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      EN
                    </button>
                  </div>
                  <input
                    type="text"
                    value={formData.name[activeTab]}
                    onChange={(e) => setFormData({ ...formData, name: { ...formData.name, [activeTab]: e.target.value } })}
                    placeholder={`Loyiha nomini kiriting (${activeTab.toUpperCase()})`}
                    className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-[#00a6a6]"
                  />
                </div>
              </div>

              {/* Texnologiyalar */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  {t.technology} *
                </label>
                <input
                  type="text"
                  value={formData.technologies}
                  onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
                  placeholder="React, Node.js, MongoDB..."
                  className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-[#00a6a6]"
                />
                <p className="text-xs text-gray-500 mt-1">{t.separateWithComma}</p>
              </div>

              {/* Izoh - Multi-language with Rich Text Editor */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  {t.description} *
                </label>

                {/* Rich Text Formatting Toolbar */}
                <div className="bg-gray-100 dark:bg-gray-700 rounded-t-xl p-2 border border-b-0 border-gray-200 dark:border-gray-600">
                  <div className="flex flex-wrap gap-1">
                    {/* Bold */}
                    <button
                      type="button"
                      onClick={() => formatText('bold')}
                      className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded text-gray-700 dark:text-gray-300 transition-colors"
                      title="Qalin (Bold)"
                    >
                      <b className="text-sm">B</b>
                    </button>

                    {/* Italic */}
                    <button
                      type="button"
                      onClick={() => formatText('italic')}
                      className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded text-gray-700 dark:text-gray-300 transition-colors"
                      title="Qiyshiq (Italic)"
                    >
                      <i className="text-sm">I</i>
                    </button>

                    {/* Underline */}
                    <button
                      type="button"
                      onClick={() => formatText('underline')}
                      className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded text-gray-700 dark:text-gray-300 transition-colors"
                      title="Tagiga chiziq (Underline)"
                    >
                      <u className="text-sm">U</u>
                    </button>

                    {/* Strikethrough */}
                    <button
                      type="button"
                      onClick={() => formatText('strikeThrough')}
                      className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded text-gray-700 dark:text-gray-300 transition-colors"
                      title="Chizilgan (Strikethrough)"
                    >
                      <s className="text-sm">S</s>
                    </button>

                    <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1"></div>

                    {/* Heading 1 */}
                    <button
                      type="button"
                      onClick={() => formatText('formatBlock', 'h1')}
                      className="px-2 py-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded text-gray-700 dark:text-gray-300 text-xs font-semibold transition-colors"
                      title="Sarlavha 1 (H1)"
                    >
                      H1
                    </button>

                    {/* Heading 2 */}
                    <button
                      type="button"
                      onClick={() => formatText('formatBlock', 'h2')}
                      className="px-2 py-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded text-gray-700 dark:text-gray-300 text-xs font-semibold transition-colors"
                      title="Sarlavha 2 (H2)"
                    >
                      H2
                    </button>

                    {/* Heading 3 */}
                    <button
                      type="button"
                      onClick={() => formatText('formatBlock', 'h3')}
                      className="px-2 py-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded text-gray-700 dark:text-gray-300 text-xs font-semibold transition-colors"
                      title="Sarlavha 3 (H3)"
                    >
                      H3
                    </button>

                    <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1"></div>

                    {/* Text Colors */}
                    <button
                      type="button"
                      onClick={() => formatText('foreColor', '#ef4444')}
                      className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
                      title="Qizil rang"
                    >
                      <div className="w-4 h-4 bg-red-500 rounded"></div>
                    </button>

                    <button
                      type="button"
                      onClick={() => formatText('foreColor', '#3b82f6')}
                      className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
                      title="Ko'k rang"
                    >
                      <div className="w-4 h-4 bg-blue-500 rounded"></div>
                    </button>

                    <button
                      type="button"
                      onClick={() => formatText('foreColor', '#10b981')}
                      className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
                      title="Yashil rang"
                    >
                      <div className="w-4 h-4 bg-green-500 rounded"></div>
                    </button>

                    {/* Highlight */}
                    <button
                      type="button"
                      onClick={() => formatText('backColor', '#fef08a')}
                      className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
                      title="Belgilash (Highlight)"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" clipRule="evenodd" />
                      </svg>
                    </button>

                    <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1"></div>

                    {/* Unordered List */}
                    <button
                      type="button"
                      onClick={() => formatText('insertUnorderedList')}
                      className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded text-gray-700 dark:text-gray-300 transition-colors"
                      title="Nuqtali ro'yxat"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                      </svg>
                    </button>

                    {/* Ordered List */}
                    <button
                      type="button"
                      onClick={() => formatText('insertOrderedList')}
                      className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded text-gray-700 dark:text-gray-300 transition-colors"
                      title="Raqamli ro'yxat"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                      </svg>
                    </button>

                    {/* Link */}
                    <button
                      type="button"
                      onClick={() => {
                        const url = prompt('Havola URL manzilini kiriting:', 'https://')
                        if (url) formatText('createLink', url)
                      }}
                      className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded text-gray-700 dark:text-gray-300 transition-colors"
                      title="Havola (Link)"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                    </button>

                    <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1"></div>

                    {/* Clear Formatting */}
                    <button
                      type="button"
                      onClick={() => formatText('removeFormat')}
                      className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded text-gray-700 dark:text-gray-300 transition-colors"
                      title="Formatni tozalash"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* WYSIWYG Editor */}
                <div
                  ref={editorRef}
                  contentEditable
                  suppressContentEditableWarning
                  onInput={handleEditorInput}
                  onKeyDown={handleEditorKeyDown}
                  onBlur={(e) => {
                    const newContent = e.currentTarget.innerHTML
                    setFormData({ ...formData, description: { ...formData.description, [activeTab]: newContent } })
                  }}
                  className="w-full min-h-[250px] px-4 py-3 border border-t-0 border-gray-200 dark:border-gray-600 rounded-b-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-[#00a6a6] overflow-y-auto"
                  style={{
                    maxHeight: '400px',
                  }}
                  data-placeholder={formData.description[activeTab] ? '' : `Loyiha haqida yozing (${activeTab.toUpperCase()})...`}
                />

                {/* Editor and List Styles */}
                <style jsx global>{`
                  [contenteditable][data-placeholder]:empty:before {
                    content: attr(data-placeholder);
                    color: #9ca3af;
                    pointer-events: none;
                    position: absolute;
                  }
                  [contenteditable] {
                    position: relative;
                  }

                  /* List styling for editor and display */
                  [contenteditable] ul,
                  [contenteditable] ol,
                  .line-clamp-2 ul,
                  .line-clamp-2 ol,
                  .leading-relaxed ul,
                  .leading-relaxed ol {
                    margin-left: 1.5rem;
                    margin-top: 0.5rem;
                    margin-bottom: 0.5rem;
                  }

                  [contenteditable] ul,
                  .line-clamp-2 ul,
                  .leading-relaxed ul {
                    list-style-type: disc;
                  }

                  [contenteditable] ol,
                  .line-clamp-2 ol,
                  .leading-relaxed ol {
                    list-style-type: decimal;
                  }

                  [contenteditable] li,
                  .line-clamp-2 li,
                  .leading-relaxed li {
                    margin-bottom: 0.25rem;
                    padding-left: 0.25rem;
                  }

                  /* Preserve line breaks */
                  [contenteditable] br,
                  .line-clamp-2 br,
                  .leading-relaxed br {
                    display: block;
                    content: "";
                    margin-top: 0.5rem;
                  }

                  /* Paragraph spacing */
                  [contenteditable] p,
                  .line-clamp-2 p,
                  .leading-relaxed p {
                    margin-bottom: 0.5rem;
                  }

                  /* Heading styles */
                  [contenteditable] h1,
                  .line-clamp-2 h1,
                  .leading-relaxed h1 {
                    font-size: 1.5rem;
                    font-weight: 700;
                    margin-top: 0.75rem;
                    margin-bottom: 0.5rem;
                  }

                  [contenteditable] h2,
                  .line-clamp-2 h2,
                  .leading-relaxed h2 {
                    font-size: 1.25rem;
                    font-weight: 600;
                    margin-top: 0.75rem;
                    margin-bottom: 0.5rem;
                  }

                  [contenteditable] h3,
                  .line-clamp-2 h3,
                  .leading-relaxed h3 {
                    font-size: 1.125rem;
                    font-weight: 600;
                    margin-top: 0.5rem;
                    margin-bottom: 0.5rem;
                  }

                  /* Link styles */
                  [contenteditable] a,
                  .line-clamp-2 a,
                  .leading-relaxed a {
                    color: #3b82f6;
                    text-decoration: underline;
                  }

                  /* Bold, italic, underline, strikethrough */
                  [contenteditable] strong,
                  [contenteditable] b,
                  .line-clamp-2 strong,
                  .line-clamp-2 b,
                  .leading-relaxed strong,
                  .leading-relaxed b {
                    font-weight: 700;
                  }

                  [contenteditable] em,
                  [contenteditable] i,
                  .line-clamp-2 em,
                  .line-clamp-2 i,
                  .leading-relaxed em,
                  .leading-relaxed i {
                    font-style: italic;
                  }

                  [contenteditable] u,
                  .line-clamp-2 u,
                  .leading-relaxed u {
                    text-decoration: underline;
                  }

                  [contenteditable] strike,
                  .line-clamp-2 strike,
                  .leading-relaxed strike {
                    text-decoration: line-through;
                  }
                `}</style>
              </div>

              {/* Imkoniyatlar - 3 tilli */}
              <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-3 sm:p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-green-600 dark:text-green-400">{Icons.check}</span>
                    <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">{t.featuresList}</h3>
                  </div>
                </div>

                {/* Yangi feature qo'shish - 3 ustun */}
                <div className="space-y-3">
                  {/* Sarlavhalar */}
                  <div className="grid grid-cols-3 gap-1 sm:gap-2">
                    <span className="text-[10px] sm:text-xs font-medium text-gray-500 dark:text-gray-400 text-center">UZ</span>
                    <span className="text-[10px] sm:text-xs font-medium text-gray-500 dark:text-gray-400 text-center">RU</span>
                    <span className="text-[10px] sm:text-xs font-medium text-gray-500 dark:text-gray-400 text-center">EN</span>
                  </div>

                  {/* Yangi feature inputlari */}
                  <div className="flex flex-col sm:flex-row gap-2">
                    <div className="flex-1 grid grid-cols-3 gap-1 sm:gap-2">
                      <input
                        type="text"
                        value={newFeature.uz}
                        onChange={(e) => setNewFeature({ ...newFeature, uz: e.target.value })}
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                        placeholder="O'z"
                        className="px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-xs sm:text-sm outline-none focus:ring-2 focus:ring-green-500"
                      />
                      <input
                        type="text"
                        value={newFeature.ru}
                        onChange={(e) => setNewFeature({ ...newFeature, ru: e.target.value })}
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                        placeholder="Ру"
                        className="px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-xs sm:text-sm outline-none focus:ring-2 focus:ring-green-500"
                      />
                      <input
                        type="text"
                        value={newFeature.en}
                        onChange={(e) => setNewFeature({ ...newFeature, en: e.target.value })}
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                        placeholder="En"
                        className="px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-xs sm:text-sm outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={handleNewFeatureTranslate}
                        title={t.aiTranslate}
                        className="flex-1 sm:flex-none px-3 py-1.5 sm:py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg text-xs sm:text-sm font-medium transition-colors"
                      >
                        {Icons.sparkles}
                      </button>
                      <button
                        type="button"
                        onClick={addFeature}
                        className="flex-1 sm:flex-none px-3 py-1.5 sm:py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-xs sm:text-sm font-medium transition-colors"
                      >
                        {Icons.plus}
                      </button>
                    </div>
                  </div>

                  {/* Mavjud features ro'yxati */}
                  {formData.features.length > 0 && (
                    <div className="space-y-2 mt-3">
                      {formData.features.map((feature, idx) => (
                        <div key={idx} className="flex gap-1 sm:gap-2 bg-white dark:bg-gray-800 p-2 rounded-lg">
                          {/* Up/Down buttons */}
                          <div className="flex flex-col gap-0.5">
                            <button
                              type="button"
                              onClick={() => moveFeatureUp(idx)}
                              disabled={idx === 0}
                              title="Yuqoriga ko'tarish"
                              className={`p-0.5 rounded text-xs ${
                                idx === 0
                                  ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
                                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                              }`}
                            >
                              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                              </svg>
                            </button>
                            <button
                              type="button"
                              onClick={() => moveFeatureDown(idx)}
                              disabled={idx === formData.features.length - 1}
                              title="Pastga tushirish"
                              className={`p-0.5 rounded text-xs ${
                                idx === formData.features.length - 1
                                  ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
                                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                              }`}
                            >
                              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </button>
                          </div>
                          <div className="flex-1 grid grid-cols-3 gap-1 sm:gap-2">
                            <input
                              type="text"
                              value={feature.uz}
                              onChange={(e) => updateFeature(idx, 'uz', e.target.value)}
                              placeholder="O'z"
                              className="px-1.5 sm:px-2 py-1 sm:py-1.5 border border-gray-200 dark:border-gray-700 rounded bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white text-xs sm:text-sm outline-none focus:ring-1 focus:ring-green-500"
                            />
                            <input
                              type="text"
                              value={feature.ru}
                              onChange={(e) => updateFeature(idx, 'ru', e.target.value)}
                              placeholder="Ру"
                              className="px-1.5 sm:px-2 py-1 sm:py-1.5 border border-gray-200 dark:border-gray-700 rounded bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white text-xs sm:text-sm outline-none focus:ring-1 focus:ring-green-500"
                            />
                            <input
                              type="text"
                              value={feature.en}
                              onChange={(e) => updateFeature(idx, 'en', e.target.value)}
                              placeholder="En"
                              className="px-1.5 sm:px-2 py-1 sm:py-1.5 border border-gray-200 dark:border-gray-700 rounded bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white text-xs sm:text-sm outline-none focus:ring-1 focus:ring-green-500"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => handleFeatureTranslate(idx)}
                            title={t.aiTranslate}
                            className="p-1.5 text-purple-500 hover:bg-purple-100 dark:hover:bg-purple-900/30 rounded"
                          >
                            {Icons.sparkles}
                          </button>
                          <button
                            type="button"
                            onClick={() => removeFeature(idx)}
                            className="p-1.5 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 rounded"
                          >
                            {Icons.trash}
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Kategoriya va Subkategoriya */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    {t.category} *
                  </label>
                  <MultiSelectDropdown
                    items={categories.map(cat => ({
                      value: cat.name_uz,
                      label: lang === 'uz' ? cat.name_uz : lang === 'ru' ? (cat.name_ru || cat.name_uz) : (cat.name_en || cat.name_uz)
                    }))}
                    selectedValues={formData.categories}
                    onChange={(values) => {
                      setFormData(prev => ({
                        ...prev,
                        categories: values,
                        subcategories: prev.subcategories.filter(sub =>
                          values.some(catName => {
                            const cat = categories.find(c => c.name_uz === catName)
                            return cat && subcategoriesMap[cat.id!]?.some(s => s.name_uz === sub)
                          })
                        )
                      }))
                    }}
                    placeholder={t.select}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    {t.subcategory}
                  </label>
                  <MultiSelectDropdown
                    items={formData.categories.flatMap(catName => {
                      const cat = categories.find(c => c.name_uz === catName)
                      if (!cat || !subcategoriesMap[cat.id!]) return []
                      return subcategoriesMap[cat.id!].map(sub => ({
                        value: sub.name_uz,
                        label: lang === 'uz' ? sub.name_uz : lang === 'ru' ? (sub.name_ru || sub.name_uz) : (sub.name_en || sub.name_uz),
                        group: lang === 'uz' ? cat.name_uz : lang === 'ru' ? (cat.name_ru || cat.name_uz) : (cat.name_en || cat.name_uz)
                      }))
                    })}
                    selectedValues={formData.subcategories}
                    onChange={(values) => setFormData(prev => ({ ...prev, subcategories: values }))}
                    placeholder={t.select}
                  />
                </div>
              </div>

              {/* Integratsiyalar */}
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-blue-600 dark:text-blue-400">{Icons.globe}</span>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{t.integrationsSection}</h3>
                </div>
                <div className="space-y-3">
                  {formData.integrations.map((integration, idx) => {
                    const integrationId = availableIntegrations[idx]?.id
                    return (
                      <div key={idx} className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                        {/* Checkbox header */}
                        <label className="flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                          <input
                            type="checkbox"
                            checked={integration.enabled}
                            onChange={(e) => {
                              const newIntegrations = [...formData.integrations]
                              newIntegrations[idx].enabled = e.target.checked
                              setFormData({ ...formData, integrations: newIntegrations })
                            }}
                            className="w-5 h-5 rounded border-gray-300 text-[#00a6a6] focus:ring-[#00a6a6]"
                          />
                          <div className="flex items-center gap-2 flex-1">
                            {integrationId === 'telegram' && (
                              <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295l.213-3.053 5.56-5.023c.242-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.828.94z"/></svg>
                            )}
                            {integrationId === 'api' && (
                              <svg className="w-5 h-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
                            )}
                            {integrationId === 'phone' && (
                              <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                            )}
                            {integrationId === 'payment' && (
                              <svg className="w-5 h-5 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                            )}
                            {integrationId === 'sms' && (
                              <svg className="w-5 h-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                            )}
                            {integrationId === 'email' && (
                              <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                            )}
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{integration.name}</span>
                          </div>
                          {integration.enabled && (
                            <span className="px-2 py-0.5 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-xs rounded-full">
                              {t.active}
                            </span>
                          )}
                        </label>

                        {/* Config form - shown when enabled */}
                        {integration.enabled && (
                          <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 space-y-3">
                            {/* Telegram Config */}
                            {integrationId === 'telegram' && (
                              <>
                                <div>
                                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Bot Token *</label>
                                  <input
                                    type="text"
                                    value={formData.integrationConfigs.telegram?.bot_token || ''}
                                    onChange={(e) => setFormData({
                                      ...formData,
                                      integrationConfigs: {
                                        ...formData.integrationConfigs,
                                        telegram: { ...formData.integrationConfigs.telegram!, bot_token: e.target.value }
                                      }
                                    })}
                                    placeholder="123456789:ABCdefGHIjklMNOpqrsTUVwxyz"
                                    className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Chat ID *</label>
                                  <input
                                    type="text"
                                    value={formData.integrationConfigs.telegram?.chat_id || ''}
                                    onChange={(e) => setFormData({
                                      ...formData,
                                      integrationConfigs: {
                                        ...formData.integrationConfigs,
                                        telegram: { ...formData.integrationConfigs.telegram!, chat_id: e.target.value }
                                      }
                                    })}
                                    placeholder="-1001234567890"
                                    className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">{t.webhookOptional}</label>
                                  <input
                                    type="text"
                                    value={formData.integrationConfigs.telegram?.webhook_url || ''}
                                    onChange={(e) => setFormData({
                                      ...formData,
                                      integrationConfigs: {
                                        ...formData.integrationConfigs,
                                        telegram: { ...formData.integrationConfigs.telegram!, webhook_url: e.target.value }
                                      }
                                    })}
                                    placeholder="https://yourdomain.com/webhook"
                                    className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                                  />
                                </div>
                              </>
                            )}

                            {/* API Config */}
                            {integrationId === 'api' && (
                              <>
                                <div>
                                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">API Key *</label>
                                  <input
                                    type="text"
                                    value={formData.integrationConfigs.api?.api_key || ''}
                                    onChange={(e) => setFormData({
                                      ...formData,
                                      integrationConfigs: {
                                        ...formData.integrationConfigs,
                                        api: { ...formData.integrationConfigs.api!, api_key: e.target.value }
                                      }
                                    })}
                                    placeholder="your-api-key-here"
                                    className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-purple-500"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Endpoint URL *</label>
                                  <input
                                    type="text"
                                    value={formData.integrationConfigs.api?.endpoint_url || ''}
                                    onChange={(e) => setFormData({
                                      ...formData,
                                      integrationConfigs: {
                                        ...formData.integrationConfigs,
                                        api: { ...formData.integrationConfigs.api!, endpoint_url: e.target.value }
                                      }
                                    })}
                                    placeholder="https://api.example.com/v1"
                                    className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-purple-500"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">{t.secretKeyOptional}</label>
                                  <input
                                    type="password"
                                    value={formData.integrationConfigs.api?.secret_key || ''}
                                    onChange={(e) => setFormData({
                                      ...formData,
                                      integrationConfigs: {
                                        ...formData.integrationConfigs,
                                        api: { ...formData.integrationConfigs.api!, secret_key: e.target.value }
                                      }
                                    })}
                                    placeholder="••••••••••••"
                                    className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-purple-500"
                                  />
                                </div>
                              </>
                            )}

                            {/* Phone Config */}
                            {integrationId === 'phone' && (
                              <>
                                <div>
                                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">{t.phoneNumber2} *</label>
                                  <input
                                    type="tel"
                                    value={formData.integrationConfigs.phone?.phone_number || ''}
                                    onChange={(e) => setFormData({
                                      ...formData,
                                      integrationConfigs: {
                                        ...formData.integrationConfigs,
                                        phone: { ...formData.integrationConfigs.phone!, phone_number: e.target.value }
                                      }
                                    })}
                                    placeholder="+998 90 123 45 67"
                                    className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-green-500"
                                  />
                                </div>
                                <div className="flex items-center gap-4">
                                  <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                      type="checkbox"
                                      checked={formData.integrationConfigs.phone?.whatsapp_enabled || false}
                                      onChange={(e) => setFormData({
                                        ...formData,
                                        integrationConfigs: {
                                          ...formData.integrationConfigs,
                                          phone: { ...formData.integrationConfigs.phone!, whatsapp_enabled: e.target.checked }
                                        }
                                      })}
                                      className="w-4 h-4 rounded border-gray-300 text-green-500 focus:ring-green-500"
                                    />
                                    <span className="text-sm text-gray-700 dark:text-gray-300">WhatsApp</span>
                                  </label>
                                  <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                      type="checkbox"
                                      checked={formData.integrationConfigs.phone?.call_enabled || false}
                                      onChange={(e) => setFormData({
                                        ...formData,
                                        integrationConfigs: {
                                          ...formData.integrationConfigs,
                                          phone: { ...formData.integrationConfigs.phone!, call_enabled: e.target.checked }
                                        }
                                      })}
                                      className="w-4 h-4 rounded border-gray-300 text-green-500 focus:ring-green-500"
                                    />
                                    <span className="text-sm text-gray-700 dark:text-gray-300">{t.call}</span>
                                  </label>
                                </div>
                              </>
                            )}

                            {/* Payment Config */}
                            {integrationId === 'payment' && (
                              <>
                                <div>
                                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">{t.paymentSystem} *</label>
                                  <select
                                    value={formData.integrationConfigs.payment?.provider || 'payme'}
                                    onChange={(e) => setFormData({
                                      ...formData,
                                      integrationConfigs: {
                                        ...formData.integrationConfigs,
                                        payment: { ...formData.integrationConfigs.payment!, provider: e.target.value }
                                      }
                                    })}
                                    className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-yellow-500"
                                  >
                                    <option value="payme">Payme</option>
                                    <option value="click">Click</option>
                                    <option value="uzum">Uzum</option>
                                    <option value="paynet">Paynet</option>
                                  </select>
                                </div>
                                <div>
                                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Merchant ID *</label>
                                  <input
                                    type="text"
                                    value={formData.integrationConfigs.payment?.merchant_id || ''}
                                    onChange={(e) => setFormData({
                                      ...formData,
                                      integrationConfigs: {
                                        ...formData.integrationConfigs,
                                        payment: { ...formData.integrationConfigs.payment!, merchant_id: e.target.value }
                                      }
                                    })}
                                    placeholder="your-merchant-id"
                                    className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-yellow-500"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">API Key *</label>
                                  <input
                                    type="password"
                                    value={formData.integrationConfigs.payment?.api_key || ''}
                                    onChange={(e) => setFormData({
                                      ...formData,
                                      integrationConfigs: {
                                        ...formData.integrationConfigs,
                                        payment: { ...formData.integrationConfigs.payment!, api_key: e.target.value }
                                      }
                                    })}
                                    placeholder="••••••••••••"
                                    className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-yellow-500"
                                  />
                                </div>
                                <label className="flex items-center gap-2 cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={formData.integrationConfigs.payment?.test_mode || false}
                                    onChange={(e) => setFormData({
                                      ...formData,
                                      integrationConfigs: {
                                        ...formData.integrationConfigs,
                                        payment: { ...formData.integrationConfigs.payment!, test_mode: e.target.checked }
                                      }
                                    })}
                                    className="w-4 h-4 rounded border-gray-300 text-yellow-500 focus:ring-yellow-500"
                                  />
                                  <span className="text-sm text-gray-700 dark:text-gray-300">{t.testMode}</span>
                                </label>
                              </>
                            )}

                            {/* SMS Config */}
                            {integrationId === 'sms' && (
                              <>
                                <div>
                                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">{t.smsProvider} *</label>
                                  <select
                                    value={formData.integrationConfigs.sms?.provider || 'eskiz'}
                                    onChange={(e) => setFormData({
                                      ...formData,
                                      integrationConfigs: {
                                        ...formData.integrationConfigs,
                                        sms: { ...formData.integrationConfigs.sms!, provider: e.target.value }
                                      }
                                    })}
                                    className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                                  >
                                    <option value="eskiz">Eskiz</option>
                                    <option value="playmobile">PlayMobile</option>
                                    <option value="infobip">Infobip</option>
                                  </select>
                                </div>
                                <div>
                                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">API Key *</label>
                                  <input
                                    type="password"
                                    value={formData.integrationConfigs.sms?.api_key || ''}
                                    onChange={(e) => setFormData({
                                      ...formData,
                                      integrationConfigs: {
                                        ...formData.integrationConfigs,
                                        sms: { ...formData.integrationConfigs.sms!, api_key: e.target.value }
                                      }
                                    })}
                                    placeholder="••••••••••••"
                                    className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">{t.senderName} *</label>
                                  <input
                                    type="text"
                                    value={formData.integrationConfigs.sms?.sender_name || ''}
                                    onChange={(e) => setFormData({
                                      ...formData,
                                      integrationConfigs: {
                                        ...formData.integrationConfigs,
                                        sms: { ...formData.integrationConfigs.sms!, sender_name: e.target.value }
                                      }
                                    })}
                                    placeholder="YourBrand"
                                    className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                                  />
                                </div>
                              </>
                            )}

                            {/* Email Config */}
                            {integrationId === 'email' && (
                              <>
                                <div className="grid grid-cols-2 gap-3">
                                  <div>
                                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">SMTP Host *</label>
                                    <input
                                      type="text"
                                      value={formData.integrationConfigs.email?.smtp_host || ''}
                                      onChange={(e) => setFormData({
                                        ...formData,
                                        integrationConfigs: {
                                          ...formData.integrationConfigs,
                                          email: { ...formData.integrationConfigs.email!, smtp_host: e.target.value }
                                        }
                                      })}
                                      placeholder="smtp.gmail.com"
                                      className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-red-500"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Port *</label>
                                    <input
                                      type="text"
                                      value={formData.integrationConfigs.email?.smtp_port || ''}
                                      onChange={(e) => setFormData({
                                        ...formData,
                                        integrationConfigs: {
                                          ...formData.integrationConfigs,
                                          email: { ...formData.integrationConfigs.email!, smtp_port: e.target.value }
                                        }
                                      })}
                                      placeholder="587"
                                      className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-red-500"
                                    />
                                  </div>
                                </div>
                                <div>
                                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">SMTP User *</label>
                                  <input
                                    type="text"
                                    value={formData.integrationConfigs.email?.smtp_user || ''}
                                    onChange={(e) => setFormData({
                                      ...formData,
                                      integrationConfigs: {
                                        ...formData.integrationConfigs,
                                        email: { ...formData.integrationConfigs.email!, smtp_user: e.target.value }
                                      }
                                    })}
                                    placeholder="your@email.com"
                                    className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-red-500"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">SMTP Password *</label>
                                  <input
                                    type="password"
                                    value={formData.integrationConfigs.email?.smtp_password || ''}
                                    onChange={(e) => setFormData({
                                      ...formData,
                                      integrationConfigs: {
                                        ...formData.integrationConfigs,
                                        email: { ...formData.integrationConfigs.email!, smtp_password: e.target.value }
                                      }
                                    })}
                                    placeholder="••••••••••••"
                                    className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-red-500"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">{t.senderEmail} *</label>
                                  <input
                                    type="email"
                                    value={formData.integrationConfigs.email?.from_email || ''}
                                    onChange={(e) => setFormData({
                                      ...formData,
                                      integrationConfigs: {
                                        ...formData.integrationConfigs,
                                        email: { ...formData.integrationConfigs.email!, from_email: e.target.value }
                                      }
                                    })}
                                    placeholder="noreply@yourdomain.com"
                                    className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-red-500"
                                  />
                                </div>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Status */}
              <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-amber-600 dark:text-amber-400">{Icons.settings}</span>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{t.marketplaceSettings}</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isTop}
                      onChange={(e) => setFormData({ ...formData, isTop: e.target.checked })}
                      className="w-4 h-4 rounded border-gray-300 text-green-500 focus:ring-green-500"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="px-1.5 py-0.5 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded text-xs font-medium">TOP</span>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{t.topBest}</span>
                      </div>
                    </div>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isNew}
                      onChange={(e) => setFormData({ ...formData, isNew: e.target.checked })}
                      className="w-4 h-4 rounded border-gray-300 text-green-500 focus:ring-green-500"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="px-1.5 py-0.5 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded text-xs font-medium">NEW</span>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{t.newLabel}</span>
                      </div>
                    </div>
                  </label>
                </div>
                <div className="mt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{t.status}</span>
                    <button
                      onClick={() => setFormData({ ...formData, status: formData.status === 'active' ? 'inactive' : 'active' })}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        formData.status === 'active' ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
                      }`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        formData.status === 'active' ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={closeModal}
                  className="w-full sm:flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-medium transition-all"
                >
                  {t.cancel}
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="w-full sm:flex-1 px-4 py-2.5 bg-[#00a6a6] hover:bg-[#00a6a6]/90 text-white rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? t.savingProject : t.save}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
