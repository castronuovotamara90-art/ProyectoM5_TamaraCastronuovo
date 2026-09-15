import { useState } from 'react'
import { Link } from 'react-router-dom'
import Button from './ui/buttons'
import { Logo } from '../../assets/logo/logo'
import { FavoritesSidebar } from '../common/FavoritesSidebar'
import { useTheme } from '../../contexts/theme'
import { useAuth } from '../../contexts/auth'
import { useCart } from '../../contexts/cart'
import { useFavorites } from '../../contexts/favorites'

function Header() {
	const { theme, toggleTheme } = useTheme()
	const { user, loading, signout } = useAuth()
	const { itemCount } = useCart()
	const { count: favoritesCount } = useFavorites()
	const [isMenuOpen, setIsMenuOpen] = useState(false)
	const [isFavoritesOpen, setIsFavoritesOpen] = useState(false)

	return (
		<header className="mb-4 flex w-full flex-col items-center gap-2 sm:gap-4">
			<div className="flex w-full items-center justify-between px-4 sm:w-auto sm:justify-center sm:px-0">
				<Link to="/" aria-label="Salvia & Co. — Inicio">
					<Logo variant={theme === 'dark' ? 'dark' : 'light'} height={68} />
				</Link>

				{/* Solo visible en mobile: en sm+ el nav ya queda siempre abierto. */}
				<Button
					type="button"
					className="sm:hidden"
					aria-expanded={isMenuOpen}
					aria-label={isMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
					onClick={() => setIsMenuOpen((current) => !current)}
				>
					☰
				</Button>
			</div>

			<nav
				className={`header-nav ${
					isMenuOpen ? 'flex' : 'hidden'
				} w-full flex-col items-center gap-2 sm:flex sm:w-auto sm:flex-row sm:flex-wrap sm:justify-center sm:gap-4`}
			>
				<Link to="/">Productos</Link>
				<Link to="/cart">Carrito ({itemCount})</Link>

				<Button type="button" onClick={() => setIsFavoritesOpen(true)}>
					♥ Favoritos ({favoritesCount})
				</Button>

				{user && <Link to="/orders">Mis pedidos</Link>}

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

			<FavoritesSidebar isOpen={isFavoritesOpen} onClose={() => setIsFavoritesOpen(false)} />
		</header>
	)
}

export default Header