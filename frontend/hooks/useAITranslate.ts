import { useState, useCallback } from 'react'
import { translateApi } from '@/lib/api/translate'

type Lang = 'uz' | 'ru' | 'en'

interface TranslateFieldConfig {
  /** The field key prefix, e.g. 'title', 'name', 'description', 'content', 'message' */
  field: string
  /**
   * How to read the source value from formData.
   * - 'flat': formData[`${field}_${lang}`]  (ContentPage pattern)
   * - 'nested': formData[field][lang]        (ProjectsPage pattern)
   */
  mode?: 'flat' | 'nested'
}

interface TranslateResult {
  /** Updated fields as a partial formData object to merge */
  [key: string]: any
}

interface UseAITranslateReturn {
  isTranslating: boolean
  /**
   * Translates fields from the detected source language to the other two languages.
   *
   * @param formData - The current form state.
   * @param fields - Array of field configs to translate.
   * @param onlyEmpty - If true, only translate into languages where the field is empty. Default: false.
   * @returns An object with updated field values to merge into formData, or null if no source found.
   */
  translateFields: (
    formData: Record<string, any>,
    fields: TranslateFieldConfig[],
    onlyEmpty?: boolean
  ) => Promise<TranslateResult | null>
}

const ALL_LANGS: Lang[] = ['uz', 'ru', 'en']

/**
 * Reads a field value from formData depending on mode.
 */
function readField(
  formData: Record<string, any>,
  field: string,
  lang: Lang,
  mode: 'flat' | 'nested'
): string {
  if (mode === 'nested') {
    return formData[field]?.[lang]?.trim() || ''
  }
  return formData[`${field}_${lang}`]?.trim() || ''
}

/**
 * Detects which language has content by checking all fields in order: uz, ru, en.
 */
function detectSourceLang(
  formData: Record<string, any>,
  fields: TranslateFieldConfig[]
): Lang | null {
  for (const lang of ALL_LANGS) {
    for (const { field, mode = 'flat' } of fields) {
      if (readField(formData, field, lang, mode)) {
        return lang
      }
    }
  }
  return null
}

/**
 * Reusable hook for AI translation across admin pages.
 * Extracted from ProjectsPage.tsx and ContentPage.tsx handleAITranslate patterns.
 *
 * Supports both flat field naming (`title_uz`, `title_ru`) and nested objects
 * (`name: { uz, ru, en }`).
 *
 * Usage example (flat - ContentPage style):
 * ```ts
 * const { isTranslating, translateFields } = useAITranslate()
 * const result = await translateFields(formData, [
 *   { field: 'title', mode: 'flat' },
 *   { field: 'content', mode: 'flat' },
 * ])
 * if (result) setFormData(prev => ({ ...prev, ...result }))
 * ```
 *
 * Usage example (nested - ProjectsPage style):
 * ```ts
 * const result = await translateFields(formData, [
 *   { field: 'name', mode: 'nested' },
 *   { field: 'description', mode: 'nested' },
 * ], true)
 * if (result) setFormData(prev => ({ ...prev, ...result }))
 * ```
 */
export function useAITranslate(): UseAITranslateReturn {
  const [isTranslating, setIsTranslating] = useState(false)

  const translateFields = useCallback(
    async (
      formData: Record<string, any>,
      fields: TranslateFieldConfig[],
      onlyEmpty = false
    ): Promise<TranslateResult | null> => {
      const sourceLang = detectSourceLang(formData, fields)
      if (!sourceLang) return null

      const targetLangs = ALL_LANGS.filter((l) => l !== sourceLang)

      setIsTranslating(true)
      try {
        const updates: TranslateResult = {}

        for (const { field, mode = 'flat' } of fields) {
          const sourceText = readField(formData, field, sourceLang, mode)
          if (!sourceText) continue

          // Determine which target languages actually need translation
          const langsToTranslate = onlyEmpty
            ? targetLangs.filter((lang) => !readField(formData, field, lang, mode))
            : targetLangs

          if (langsToTranslate.length === 0) continue

          const result = await translateApi.translate({
            text: sourceText,
            source_lang: sourceLang,
            target_langs: langsToTranslate,
          })

          if (!result.success) continue

          if (mode === 'nested') {
            const nested = { ...(formData[field] || {}) }
            langsToTranslate.forEach((lang) => {
              if (result.translations[lang]) {
                nested[lang] = result.translations[lang]
              }
            })
            updates[field] = nested
          } else {
            langsToTranslate.forEach((lang) => {
              if (result.translations[lang]) {
                updates[`${field}_${lang}`] = result.translations[lang]
              }
            })
          }
        }

        return updates
      } finally {
        setIsTranslating(false)
      }
    },
    []
  )

  return { isTranslating, translateFields }
}
