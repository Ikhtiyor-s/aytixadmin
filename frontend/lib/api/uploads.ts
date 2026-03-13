const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'

export const uploadsApi = {
  async uploadImage(file: File, token: string): Promise<{ url: string }> {
    const formData = new FormData()
    formData.append('file', file)

    const response = await fetch(`${API_BASE_URL}/uploads/image`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    })

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Could not validate credentials')
      }
      const error = await response.json().catch(() => ({ detail: 'Failed to upload image' }))
      throw new Error(error.detail || 'Failed to upload image')
    }

    return response.json()
  },

  async uploadMultipleImages(files: File[], token: string): Promise<{ urls: string[] }> {
    const formData = new FormData()
    files.forEach(file => {
      formData.append('files', file)
    })

    const response = await fetch(`${API_BASE_URL}/uploads/images`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    })

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Could not validate credentials')
      }
      const error = await response.json().catch(() => ({ detail: 'Failed to upload images' }))
      throw new Error(error.detail || 'Failed to upload images')
    }

    return response.json()
  },

  async uploadVideo(file: File, token: string): Promise<{ url: string }> {
    const formData = new FormData()
    formData.append('file', file)

    const response = await fetch(`${API_BASE_URL}/uploads/video`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    })

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Could not validate credentials')
      }
      const error = await response.json().catch(() => ({ detail: 'Failed to upload video' }))
      throw new Error(error.detail || 'Failed to upload video')
    }

    return response.json()
  }
}
