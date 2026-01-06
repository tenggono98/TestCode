import React from 'react'
import { Link } from 'react-router-dom'

export default function ProductCard({ product }) {
  const hasStock = product.qty > 0

  return (
    <div className="border rounded p-4 bg-white shadow hover:shadow-lg transition-shadow">
      <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
      <div className="space-y-2 mt-3">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Harga:</span>
          <span className="text-lg font-bold text-blue-600">Rp {Number(product.price).toLocaleString('id-ID')}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Stok:</span>
          <span className={`font-medium ${hasStock ? 'text-green-600' : 'text-red-600'}`}>
            {product.qty > 0 ? `${product.qty} tersedia` : 'Habis'}
          </span>
        </div>
      </div>
      <div className="mt-4">
        {hasStock ? (
          <Link
            to={`/order?productId=${product.id}`}
            className="block w-full px-3 py-2 bg-blue-600 text-white rounded text-center hover:bg-blue-700 transition-colors"
          >
            Pesan Sekarang
          </Link>
        ) : (
          <button disabled className="block w-full px-3 py-2 bg-gray-400 text-white rounded text-center cursor-not-allowed">
            Stok Habis
          </button>
        )}
      </div>
    </div>
  )
}
