import axios from 'axios'
import Cookies from 'js-cookie'

const BASE_URL = '/api/v1'

const cookieOptions = () => ({
  path: '/',
  secure: typeof window !== 'undefined' && window.location.protocol === 'https:',
  sameSite: 'strict' as const,
})

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('access_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Token refresh uchun mutex — bir vaqtda faqat bitta refresh bo'ladi
let isRefreshing = false
let refreshQueue: Array<{ resolve: (token: string) => void; reject: (err: unknown) => void }> = []

function processQueue(error: unknown, token: string | null) {
  refreshQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error)
    else resolve(token!)
  })
  refreshQueue = []
}

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const currentPath = typeof window !== 'undefined' ? window.location.pathname : ''
    const isAuthPage = currentPath.includes('/login') || currentPath.includes('/register')
    const originalRequest = error.config

    if (error.response?.status === 401 && !isAuthPage && !originalRequest._retry) {
      const refreshToken = Cookies.get('refresh_token')
      if (!refreshToken) {
        Cookies.remove('access_token')
        Cookies.remove('refresh_token')
        const loginPath = currentPath.includes('/admin') ? '/admin/login' : '/login'
        window.location.href = loginPath
        return Promise.reject(error)
      }

      // Agar refresh allaqachon ishlayotgan bo'lsa — navbatga qo'shish
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          refreshQueue.push({
            resolve: (token: string) => {
              originalRequest.headers.Authorization = `Bearer ${token}`
              resolve(api.request(originalRequest))
            },
            reject,
          })
        })
      }

      isRefreshing = true
      originalRequest._retry = true

      try {
        const response = await axios.post(`/api/v1/auth/refresh`, {
          refresh_token: refreshToken,
        }, {
          headers: { 'Content-Type': 'application/json' },
        })
        const { access_token, refresh_token: newRefreshToken } = response.data
        Cookies.set('access_token', access_token, cookieOptions())
        Cookies.set('refresh_token', newRefreshToken, cookieOptions())

        processQueue(null, access_token)

        originalRequest.headers.Authorization = `Bearer ${access_token}`
        return api.request(originalRequest)
      } catch (refreshError) {
        processQueue(refreshError, null)
        Cookies.remove('access_token')
        Cookies.remove('refresh_token')
        const loginPath = currentPath.includes('/admin') ? '/admin/login' : '/login'
        window.location.href = loginPath
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }
    return Promise.reject(error)
  }
)

export default api

