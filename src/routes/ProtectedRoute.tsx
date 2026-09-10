import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../contexts/auth'

// Orden importa: primero loading (todavía no sabemos si hay sesión),
// después user (recién ahí podemos decidir si hay que redirigir).
export function ProtectedRoute() {
	const { user, loading } = useAuth()

	if (loading) {
		return <p>Cargando sesión...</p>
	}

	if (!user) {
		return <Navigate to="/login" replace />
	}

	return <Outlet />
}
