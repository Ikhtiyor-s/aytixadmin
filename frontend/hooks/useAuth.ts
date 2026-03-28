'use client'

import { useState, useEffect } from 'react'
import { authService } from '@/services/auth'
import { User } from '@/types'
import Cookies from 'js-cookie'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    const initAuth = async () => {
      try {
        const accessToken = Cookies.get('access_token') || null
        setToken(accessToken)

        if (accessToken) {
          const userData = await authService.getCurrentUser()
          setUser(userData)
        }
      } catch (error) {
        console.error('Auth init error:', error)
        // Token yaroqsiz - tozalash
        Cookies.remove('access_token')
        Cookies.remove('refresh_token')
        setToken(null)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    initAuth()
  }, [])

  const login = async (username: string, password: string) => {
    await authService.login({ username, password })
    const accessToken = Cookies.get('access_token') || null
    setToken(accessToken)
    // User will be loaded on next page via initAuth
  }

  const logout = () => {
    authService.logout()
    setUser(null)
    setToken(null)
  }

  const isAuthenticated = Boolean(token)

  return { user, loading, login, logout, token, isAuthenticated }
}


