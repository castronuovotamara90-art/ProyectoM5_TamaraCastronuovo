import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../contexts/auth'

// Mismo orden que ProtectedRoute, con un chequeo más al final:
// loading -> user -> role. Sin sesión va a /login; con sesión pero
// sin rol admin va a /, no a /login (ya está logueado, solo no tiene permiso).
export function AdminRoute() {
	const { user, loading } = useAuth()

	if (loading) {
		return <p>Cargando sesión...</p>
	}

	if (!user) {
		return <Navigate to="/login" replace />
	}

	if (user.role !== 'admin') {
		return <Navigate to="/" replace />
	}

	return <Outlet />
}
