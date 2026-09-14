import { Link, Outlet } from 'react-router-dom'

export function AdminLayout() {
	return (
		<div className="flex w-full flex-col sm:flex-row">
			<aside className="flex flex-row flex-wrap items-center gap-3 border-b border-white/20 p-4 sm:w-48 sm:flex-shrink-0 sm:flex-col sm:items-start sm:border-b-0 sm:border-r">
				<h2 className="w-full sm:w-auto">Panel de administración</h2>
				<Link to="/">← Volver al inicio</Link>
				<Link to="/admin/products">Productos</Link>
				<Link to="/admin/orders">Órdenes</Link>
			</aside>

			<main className="flex-1 p-4">
				<Outlet />
			</main>
		</div>
	)
}
