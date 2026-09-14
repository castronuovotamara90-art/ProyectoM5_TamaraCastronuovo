import { useCallback, useEffect, useState, useTransition } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/auth'
import { getUserOrders } from '../services/orders.service'
import { LoadingState } from '../assets/common/LoadingState'
import { ErrorState } from '../assets/common/ErrorState'
import { EmptyState } from '../assets/common/EmptyState'
import type { Order } from '../types/order.types'
import { formatPrice } from '../utils/money'

export function OrdersPage() {
	const { user } = useAuth()
	const [orders, setOrders] = useState<Order[]>([])
	const [error, setError] = useState<string | null>(null)
	const [loading, startTransition] = useTransition()

	const loadOrders = useCallback(() => {
		if (!user) return

		startTransition(async () => {
			try {
				const result = await getUserOrders(user.uid)
				setOrders(result)
				setError(null)
			} catch (err) {
				setError(err instanceof Error ? err.message : 'No se pudieron cargar tus pedidos.')
			}
		})
	}, [user])

	useEffect(() => {
		loadOrders()
	}, [loadOrders])

	if (loading) return <LoadingState message="Cargando tus pedidos..." />
	if (error) return <ErrorState message={error} onRetry={loadOrders} />
	if (orders.length === 0) return <EmptyState title="Todavía no hiciste ningún pedido" />

	return (
		<div className="flex flex-col items-center gap-2">
			<h2>Mis pedidos</h2>

			<ul className="flex flex-col gap-2">
				{orders.map((order) => (
					<li key={order.id}>
						<Link to={`/orders/${order.id}`}>
							Pedido #{order.id.slice(0, 8)} — ${formatPrice(order.total)} — {order.status}
						</Link>
					</li>
				))}
			</ul>
		</div>
	)
}
