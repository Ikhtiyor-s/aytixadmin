const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'

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
  async translate(data: TranslateRequest, token: string): Promise<TranslateResponse> {
    const response = await fetch(`${API_BASE_URL}/translate/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || 'Tarjima qilishda xatolik')
    }

    return response.json()
  },

  async translateBatch(
    texts: Record<string, string>,
    source_lang: string,
    target_langs: string[],
    token: string
  ): Promise<TranslateResponse> {
    const response = await fetch(`${API_BASE_URL}/translate/batch`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        texts,
        source_lang,
        target_langs
      })
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || 'Tarjima qilishda xatolik')
    }

    return response.json()
  }
}
