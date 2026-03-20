import axios from 'axios'
import api from './api'
import Cookies from 'js-cookie'
import { User } from '@/types'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'
const BASE_URL = typeof window !== 'undefined' && window.location.hostname === 'localhost' ? '/api/v1' : API_URL

export interface LoginData {
  phone: string
  password: string
}

export interface RegisterData {
  phone?: string
  email?: string
  username: string
  password: string
  full_name?: string
  first_name?: string
  last_name?: string
}

export type { User }

export const authService = {
  async login(data: LoginData) {
    const formData = new URLSearchParams()
    formData.append('username', data.phone)
    formData.append('password', data.password)
    const response = await axios.post(`${BASE_URL}/auth/admin/login`, formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
    const { access_token, refresh_token } = response.data
    Cookies.set('access_token', access_token, { path: '/' })
    Cookies.set('refresh_token', refresh_token, { path: '/' })
    return response.data
  },

  async register(data: RegisterData) {
    const response = await api.post('/auth/register', data)
    return response.data
  },

  async getCurrentUser(): Promise<User> {
    const response = await api.get('/users/me')
    return response.data
  },

  async logout() {
    Cookies.remove('access_token')
    Cookies.remove('refresh_token')
  },

  isAuthenticated(): boolean {
    return Boolean(Cookies.get('access_token'))
  },
}
