import { Route, Routes } from 'react-router-dom'
import { Layout } from './assets/layouts/Layout'
import { AdminLayout } from './assets/layouts/AdminLayout'
import { HomePage } from './pages/HomePage'
import { ProductDetailPage } from './pages/ProductDetailPage'
import { CartPage } from './pages/CartPage'
import { CheckoutPage } from './pages/CheckoutPage'
import { OrdersPage } from './pages/OrdersPage'
import { OrderDetailPage } from './pages/OrderDetailPage'
import { LoginPage } from './pages/LoginPage'
import { AdminPage } from './pages/AdminPage'
import { AdminProductsPage } from './pages/AdminProductsPage'
import { AdminProductNewPage } from './pages/AdminProductNewPage'
import { AdminProductEditPage } from './pages/AdminProductEditPage'
import { AdminOrdersPage } from './pages/AdminOrdersPage'
import { ProtectedRoute } from './routes/ProtectedRoute'
import { AdminRoute } from './routes/AdminRoute'

function App() {
    return (
        <Routes>
            <Route element={<Layout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/products/:id" element={<ProductDetailPage />} />
                <Route path="/login" element={<LoginPage />} />

                <Route element={<ProtectedRoute />}>
                    <Route path="/cart" element={<CartPage />} />
                    <Route path="/checkout" element={<CheckoutPage />} />
                    <Route path="/orders" element={<OrdersPage />} />
                    <Route path="/orders/:id" element={<OrderDetailPage />} />
                </Route>
            </Route>

            <Route element={<AdminRoute />}>
                <Route element={<AdminLayout />}>
                    <Route path="/admin" element={<AdminPage />} />
                    <Route path="/admin/products" element={<AdminProductsPage />} />
                    <Route path="/admin/products/new" element={<AdminProductNewPage />} />
                    <Route path="/admin/products/:id/edit" element={<AdminProductEditPage />} />
                    <Route path="/admin/orders" element={<AdminOrdersPage />} />
                </Route>
            </Route>
        </Routes>
    )
}

export default App
