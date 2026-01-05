import api from '@/services/api'

export interface TranslateRequest {
  text: string
  source_lang: string  // uz, ru, en
  target_langs: string[]  // ["ru", "en"]
}

export interface TranslateResponse {
  translations: Record<string, string>  // {"ru": "...", "en": "..."}
  success: boolean
  message?: string
}

export const translateApi = {
  async translate(data: TranslateRequest, _token?: string): Promise<TranslateResponse> {
    // Token is now handled by axios interceptor automatically
    const response = await api.post('/translate/', data)
    return response.data
  },

  async translateBatch(
    texts: Record<string, string>,
    source_lang: string,
    target_langs: string[],
    _token?: string
  ): Promise<TranslateResponse> {
    // Token is now handled by axios interceptor automatically
    const response = await api.post('/translate/batch', {
      texts,
      source_lang,
      target_langs
    })
    return response.data
  }
}
