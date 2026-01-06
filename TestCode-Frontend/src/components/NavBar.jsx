import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from './AuthProvider'

export default function NavBar() {
  const auth = useAuth()
  const navigate = useNavigate()
  const [loggingOut, setLoggingOut] = useState(false)

  const handleLogout = async () => {
    setLoggingOut(true)
    try {
      auth.logout()
      navigate('/login')
    } finally {
      setLoggingOut(false)
    }
  }

  return (
    <nav className="bg-white shadow sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex gap-6 items-center">
          <Link to="/" className="font-bold text-xl text-blue-600">Toko Online</Link>
          {auth?.token && (
            <div className="hidden md:flex gap-6">
              <Link to="/products" className="text-gray-700 hover:text-blue-600 font-medium">Produk</Link>
              <Link to="/orders" className="text-gray-700 hover:text-blue-600 font-medium">Pesanan</Link>
            </div>
          )}
        </div>
        <div>
          {auth?.token ? (
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">{auth.user?.email || 'Pengguna'}</span>
              <button
                onClick={handleLogout}
                disabled={loggingOut}
                className="px-4 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700 disabled:bg-gray-400 transition-colors"
              >
                {loggingOut ? 'Keluar...' : 'Keluar'}
              </button>
            </div>
          ) : (
            <Link to="/login" className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">
              Masuk
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}
