import React, { createContext, useContext, useState } from 'react'
import api from '../api'

const AuthContext = createContext({
  token: null,
  user: null,
  login: async () => {},
  logout: () => {}
})

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('accessToken'))
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('user')) } catch (e) { return null }
  })

  const login = async (email, password) => {
    try {
      // Use Basic Auth as per API documentation
      const basic = btoa(`${email}:${password}`)
      const res = await api.post('/auth/login', {}, { headers: { Authorization: `Basic ${basic}` } })
      const data = res.data || {}
      const accessToken = data?.accessToken
      
      if (accessToken) {
        localStorage.setItem('accessToken', accessToken)
        setToken(accessToken)
        // Store user info if available
        const userInfo = { email }
        localStorage.setItem('user', JSON.stringify(userInfo))
        setUser(userInfo)
        return data
      }
      throw new Error('No access token returned')
    } catch (err) {
      console.error('AuthProvider.login error:', err)
      const serverMsg = err?.response?.data?.error || err?.response?.data?.message || err?.message
      throw new Error(serverMsg || 'Login failed')
    }
  }

  const logout = () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('user')
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
