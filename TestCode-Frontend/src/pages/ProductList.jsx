import React, { useEffect, useState } from 'react'
import api from '../api'
import ProductCard from '../components/ProductCard'

export default function ProductList() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [retrying, setRetrying] = useState(false)

  const fetchProducts = async () => {
    try {
      setLoading(true)
      setError('')
      const res = await api.get('/products')
      setProducts(res.data || [])
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Gagal memuat daftar produk'
      setError(errorMsg)
      console.error('Products error:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const handleRetry = async () => {
    setRetrying(true)
    await fetchProducts()
    setRetrying(false)
  }

  if (loading) {
    return <div className="text-center mt-8">Memuat daftar produk...</div>
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

  if (products.length === 0) {
    return <div className="text-center mt-8 text-gray-600">Tidak ada produk tersedia</div>
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Daftar Produk</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map(p => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  )
}
