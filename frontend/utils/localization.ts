export interface FeatureItem {
  uz: string
  ru: string
  en: string
}

export interface LocalizedEntity {
  name: string
  name_uz?: string
  name_ru?: string
  name_en?: string
  description: string
  description_uz?: string
  description_ru?: string
  description_en?: string
}

// Helper function to convert features from any format to new format
export const normalizeFeatures = (features: (string | FeatureItem)[]): FeatureItem[] => {
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
export const getLocalizedName = (project: LocalizedEntity, lang: string): string => {
  if (lang === 'ru') return project.name_ru || project.name_uz || project.name
  if (lang === 'en') return project.name_en || project.name_uz || project.name
  return project.name_uz || project.name
}

// Helper function to get localized project description based on selected language
export const getLocalizedDescription = (project: LocalizedEntity, lang: string): string => {
  if (lang === 'ru') return project.description_ru || project.description_uz || project.description
  if (lang === 'en') return project.description_en || project.description_uz || project.description
  return project.description_uz || project.description
}

// Helper function to get localized feature based on selected language
export const getLocalizedFeature = (feature: string | FeatureItem, lang: string): string => {
  if (typeof feature === 'string') return feature
  if (lang === 'ru') return feature.ru || feature.uz || ''
  if (lang === 'en') return feature.en || feature.uz || ''
  return feature.uz || ''
}
