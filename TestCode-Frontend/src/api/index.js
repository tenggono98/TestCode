import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use(config => {
  const accessToken = localStorage.getItem('accessToken')
  if (accessToken) {
    config.headers = config.headers || {}
    config.headers.Authorization = `Bearer ${accessToken}`
  }
  return config
})

api.interceptors.response.use(
  res => res,
  err => {
    const status = err?.response?.status
    if (status === 401) {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('user')
      try { window.location.href = '/login' } catch (e) {}
    }
    return Promise.reject(err)
  }
)

export default api
