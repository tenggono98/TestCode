import React, { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import api from '../api'
import { validateQuantity } from '../utils/validation'

export default function OrderForm() {
  const [searchParams] = useSearchParams()
  const productId = searchParams.get('productId')
  const [product, setProduct] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [error, setError] = useState('')
  const [errors, setErrors] = useState({})
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (!productId) return
    // Fetch all products and find the one with matching ID
    api.get('/products')
      .then(res => {
        const foundProduct = res.data.find(p => p.id === Number(productId))
        if (foundProduct) {
          setProduct(foundProduct)
        } else {
          setError('Produk tidak ditemukan')
        }
      })
      .catch(err => setError(err.message || 'Gagal memuat produk'))
      .finally(() => setLoading(false))
  }, [productId])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setErrors({})
    setSuccess('')
    setSubmitting(true)

    // Validasi quantity (frontend)
    const newErrors = {}
    
    if (!quantity || quantity < 1) {
      newErrors.quantity = 'Jumlah minimal 1'
    } else if (quantity > product.qty) {
      newErrors.quantity = `Jumlah maksimal ${product.qty}`
    } else if (!Number.isInteger(Number(quantity))) {
      newErrors.quantity = 'Jumlah harus berupa angka bulat'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      setSubmitting(false)
      return
    }

    try {
      const res = await api.post('/orders', {
        items: [{ 
          productId: product.id, 
          qty: Number(quantity) 
        }]
      })
      
      setSuccess(`Pesanan berhasil dibuat (ID: ${res.data.data?.orderId || res.data.orderId})`)
      setTimeout(() => navigate('/orders'), 1500)
    } catch (err) {
      // Handle error dari backend validation
      const errorMsg = err.response?.data?.message || err.message || 'Gagal membuat pesanan'
      setError(errorMsg)
      console.error('Order error:', err)
    } finally {
      setSubmitting(false)
    }
  }

  if (!productId) return <div className="text-center mt-8 text-gray-600">Produk tidak dipilih</div>
  if (loading) return <div className="text-center mt-8">Memuat produk...</div>
  if (!product) return <div className="text-center mt-8 text-red-600">Produk tidak ditemukan</div>

  return (
    <div className="max-w-lg mx-auto mt-8">
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Pesan: {product.name}</h2>
        <div className="mb-4 p-3 bg-gray-50 rounded border border-gray-200">
          <div className="flex justify-between">
            <span>Harga:</span>
            <span className="font-medium">Rp {Number(product.price).toLocaleString('id-ID')}</span>
          </div>
          <div className="flex justify-between">
            <span>Stok tersedia:</span>
            <span className="font-medium">{product.qty}</span>
          </div>
        </div>

        {error && <div className="mb-4 p-3 text-red-600 bg-red-50 border border-red-200 rounded">{error}</div>}
        {success && <div className="mb-4 p-3 text-green-600 bg-green-50 border border-green-200 rounded">{success}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Jumlah Pemesanan</label>
            <input
              type="number"
              value={quantity}
              onChange={e => setQuantity(e.target.value)}
              min="1"
              max={product.qty}
              className={`w-full border rounded px-3 py-2 ${errors.quantity ? 'border-red-500' : 'border-gray-300'}`}
              disabled={submitting}
            />
            {errors.quantity && <p className="text-red-600 text-sm mt-1">{errors.quantity}</p>}
          </div>

          <div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
              disabled={submitting}
            >
              {submitting ? 'Sedang memproses...' : 'Kirim Pesanan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
