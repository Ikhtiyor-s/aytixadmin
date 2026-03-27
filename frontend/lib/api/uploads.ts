import api from '@/services/api'

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/quicktime']
const MAX_IMAGE_SIZE = 10 * 1024 * 1024  // 10MB
const MAX_VIDEO_SIZE = 100 * 1024 * 1024 // 100MB

function validateFile(file: File, allowedTypes: string[], maxSize: number): void {
  if (!allowedTypes.includes(file.type)) {
    throw new Error(`Fayl turi ruxsat etilmagan: ${file.type}. Ruxsat etilgan: ${allowedTypes.join(', ')}`)
  }
  if (file.size > maxSize) {
    const maxMB = Math.round(maxSize / 1024 / 1024)
    throw new Error(`Fayl hajmi ${maxMB}MB dan oshmasligi kerak`)
  }
}

export const uploadsApi = {
  async uploadImage(file: File): Promise<{ url: string }> {
    validateFile(file, ALLOWED_IMAGE_TYPES, MAX_IMAGE_SIZE)
    const formData = new FormData()
    formData.append('file', file)
    const res = await api.post('/uploads/image', formData)
    return res.data
  },

  async uploadMultipleImages(files: File[]): Promise<{ urls: string[] }> {
    files.forEach(f => validateFile(f, ALLOWED_IMAGE_TYPES, MAX_IMAGE_SIZE))
    const formData = new FormData()
    files.forEach(file => formData.append('files', file))
    const res = await api.post('/uploads/images', formData)
    return res.data
  },

  async uploadVideo(file: File): Promise<{ url: string }> {
    validateFile(file, ALLOWED_VIDEO_TYPES, MAX_VIDEO_SIZE)
    const formData = new FormData()
    formData.append('file', file)
    const res = await api.post('/uploads/video', formData)
    return res.data
  }
}
