import axios from 'axios'
import Cookies from 'js-cookie'

const BASE_URL = '/api/v1'

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

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const currentPath = typeof window !== 'undefined' ? window.location.pathname : ''
    const isAuthPage = currentPath.includes('/login') || currentPath.includes('/register')

    if (error.response?.status === 401 && !isAuthPage) {
      // Try to refresh token
      const refreshToken = Cookies.get('refresh_token')
      if (refreshToken) {
        try {
          const response = await axios.post(`/api/v1/auth/refresh`, {
            refresh_token: refreshToken,
          }, {
            headers: {
              'Content-Type': 'application/json',
            },
          })
          const { access_token, refresh_token } = response.data
          Cookies.set('access_token', access_token, { path: '/' })
          Cookies.set('refresh_token', refresh_token, { path: '/' })
          // Retry original request
          error.config.headers.Authorization = `Bearer ${access_token}`
          return api.request(error.config)
        } catch (refreshError) {
          // Refresh failed, logout
          Cookies.remove('access_token')
          Cookies.remove('refresh_token')
          // Redirect to correct login page
          const loginPath = currentPath.includes('/admin') ? '/admin/login' : '/login'
          window.location.href = loginPath
        }
      } else {
        Cookies.remove('access_token')
        Cookies.remove('refresh_token')
        // Redirect to correct login page
        const loginPath = currentPath.includes('/admin') ? '/admin/login' : '/login'
        window.location.href = loginPath
      }
    }
    return Promise.reject(error)
  }
)

export default api

