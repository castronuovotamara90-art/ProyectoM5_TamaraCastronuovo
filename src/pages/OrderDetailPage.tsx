import { useCallback, useEffect, useState, useTransition } from 'react'
import { useParams } from 'react-router-dom'
import { getOrderById } from '../services/orders.service'
import { LoadingState } from '../assets/common/LoadingState'
import { ErrorState } from '../assets/common/ErrorState'
import { EmptyState } from '../assets/common/EmptyState'
import type { Order } from '../types/order.types'
import { formatPrice } from '../utils/money'

export function OrderDetailPage() {
	const { id } = useParams<{ id: string }>()
	const [order, setOrder] = useState<Order | null>(null)
	const [error, setError] = useState<string | null>(null)
	const [loading, startTransition] = useTransition()

	const loadOrder = useCallback(() => {
		if (!id) return

		startTransition(async () => {
			try {
				const result = await getOrderById(id)
				setOrder(result)
				setError(null)
			} catch (err) {
				setError(err instanceof Error ? err.message : 'No se pudo cargar el pedido.')
			}
		})
	}, [id])

	useEffect(() => {
		loadOrder()
	}, [loadOrder])

	if (loading) return <LoadingState message="Cargando pedido..." />
	if (error) return <ErrorState message={error} onRetry={loadOrder} />
	if (!order) return <EmptyState title="No encontramos ese pedido" />

	return (
		<div className="flex flex-col items-center gap-2">
			<h2>Pedido #{order.id.slice(0, 8)}</h2>
			<p>Estado: {order.status}</p>

			<ul className="flex flex-col gap-1">
				{order.items.map(({ product, quantity }) => (
					<li key={product.id}>
						{product.name} x {quantity} — ${formatPrice(product.price * quantity)}
					</li>
				))}
			</ul>

			<p>Total: ${formatPrice(order.total)}</p>
		</div>
	)
}
