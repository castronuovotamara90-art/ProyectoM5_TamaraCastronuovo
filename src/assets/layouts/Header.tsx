import { Link } from 'react-router-dom'
import Button from './ui/buttons'
import Title from './ui/title'
import { useTheme } from '../../contexts/theme'
import { useAuth } from '../../contexts/auth'
import { useCart } from '../../contexts/cart'

function Header() {
	const { theme, toggleTheme } = useTheme()
	const { user, loading, signout } = useAuth()
	const { itemCount } = useCart()

	return (
		<header className="mb-4 flex w-full flex-col items-center gap-4">
			<Title>HENRY-Commerce</Title>

			<nav className="flex flex-wrap items-center justify-center gap-4">
				<Link to="/">Inicio</Link>
				<Link to="/cart">Carrito ({itemCount})</Link>

				{user?.role === 'admin' && <Link to="/admin">Panel de administración</Link>}

				{loading ? (
					<span>Cargando sesión...</span>
				) : user ? (
					<>
						<span>{user.email}</span>
						<Button type="button" onClick={() => signout()}>
							Cerrar sesión
						</Button>
					</>
				) : (
					<Link to="/login">Iniciar sesión</Link>
				)}

				<Button className="theme-toggle" type="button" onClick={toggleTheme}>
					{theme === 'dark' ? '☀ Claro' : '🌙 Oscuro'}
				</Button>
			</nav>
		</header>
	)
}

export default Header
