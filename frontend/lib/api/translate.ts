import api from '@/services/api'

export interface TranslateRequest {
  text: string
  source_lang: string
  target_langs: string[]
}

export interface TranslateResponse {
  translations: Record<string, string>
  success: boolean
  message?: string
}

export const translateApi = {
  async translate(data: TranslateRequest): Promise<TranslateResponse> {
    const res = await api.post('/translate/', data)
    return res.data
  },
  async translateBatch(
    texts: Record<string, string>,
    source_lang: string,
    target_langs: string[]
  ): Promise<TranslateResponse> {
    const res = await api.post('/translate/batch', { texts, source_lang, target_langs })
    return res.data
  }
}
