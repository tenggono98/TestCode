import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './components/AuthProvider'
import RequireAuth from './components/RequireAuth'
import LoginPage from './pages/LoginPage'
import ProductList from './pages/ProductList'
import OrderForm from './pages/OrderForm'
import OrderHistory from './pages/OrderHistory'
import NavBar from './components/NavBar'

export default function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen">
        <NavBar />

        <main className="max-w-4xl mx-auto p-4">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/products"
              element={
                <RequireAuth>
                  <ProductList />
                </RequireAuth>
              }
            />
            <Route
              path="/order"
              element={
                <RequireAuth>
                  <OrderForm />
                </RequireAuth>
              }
            />
            <Route
              path="/orders"
              element={
                <RequireAuth>
                  <OrderHistory />
                </RequireAuth>
              }
            />
            <Route path="/" element={<LoginPage />} />
          </Routes>
        </main>
      </div>
    </AuthProvider>
  )
}
