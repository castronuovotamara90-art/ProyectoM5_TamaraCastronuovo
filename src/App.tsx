import { Route, Routes } from 'react-router-dom'
import Header from './assets/layouts/Header'
import { HomePage } from './pages/HomePage'
import { CartPage } from './pages/CartPage'
import { CheckoutPage } from './pages/CheckoutPage'
import { LoginPage } from './pages/LoginPage'
import { AdminPage } from './pages/AdminPage'
import { ProtectedRoute } from './routes/ProtectedRoute'
import { AdminRoute } from './routes/AdminRoute'

function App() {
    return (
        <main className="app-shell flex flex-col items-center">
            <Header />

            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />

                <Route element={<ProtectedRoute />}>
                    <Route path="/cart" element={<CartPage />} />
                    <Route path="/checkout" element={<CheckoutPage />} />
                </Route>

                <Route element={<AdminRoute />}>
                    <Route path="/admin" element={<AdminPage />} />
                </Route>
            </Routes>
        </main>
    )
}

export default App
