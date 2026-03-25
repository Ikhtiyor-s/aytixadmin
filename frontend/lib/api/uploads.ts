import api from '@/services/api'

export const uploadsApi = {
  async uploadImage(file: File): Promise<{ url: string }> {
    const formData = new FormData()
    formData.append('file', file)
    const res = await api.post('/uploads/image', formData)
    return res.data
  },

  async uploadMultipleImages(files: File[]): Promise<{ urls: string[] }> {
    const formData = new FormData()
    files.forEach(file => formData.append('files', file))
    const res = await api.post('/uploads/images', formData)
    return res.data
  },

  async uploadVideo(file: File): Promise<{ url: string }> {
    const formData = new FormData()
    formData.append('file', file)
    const res = await api.post('/uploads/video', formData)
    return res.data
  }
}
