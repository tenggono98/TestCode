import React, { useEffect, useState } from 'react'
import api from '../api'

export default function OrderHistory() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [retrying, setRetrying] = useState(false)

  const fetchOrders = async () => {
    try {
      setLoading(true)
      setError('')
      const res = await api.get('/orders')
      setOrders(res.data || [])
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Gagal memuat riwayat pesanan'
      setError(errorMsg)
      console.error('Orders error:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  const handleRetry = async () => {
    setRetrying(true)
    await fetchOrders()
    setRetrying(false)
  }

  if (loading) {
    return <div className="text-center mt-8">Memuat riwayat pesanan...</div>
  }

  if (error) {
    return (
      <div className="text-center mt-8">
        <div className="p-4 text-red-600 bg-red-50 border border-red-200 rounded inline-block mb-4">
          <p className="mb-2">{error}</p>
          <button
            onClick={handleRetry}
            disabled={retrying}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:bg-gray-400"
          >
            {retrying ? 'Sedang mengulang...' : 'Coba Lagi'}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Riwayat Pesanan</h1>
      {orders.length === 0 ? (
        <div className="text-center text-gray-600 p-8 bg-gray-50 rounded">
          Anda belum memiliki pesanan
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(o => (
            <div key={o.id} className="bg-white p-4 rounded shadow hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-semibold text-lg">Pesanan #{o.id}</p>
                  <p className="text-sm text-gray-600">Email: {o.email}</p>
                </div>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded text-sm font-medium">
                  Diterima
                </span>
              </div>
              <p className="text-sm text-gray-500">
                {new Date(o.created_at).toLocaleDateString('id-ID', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
