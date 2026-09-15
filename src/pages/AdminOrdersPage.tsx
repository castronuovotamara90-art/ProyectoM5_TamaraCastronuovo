import { useEffect, useState } from 'react'
import { LoadingState } from '../assets/common/LoadingState'
import { ErrorState } from '../assets/common/ErrorState'
import { EmptyState } from '../assets/common/EmptyState'
import { subscribeToAllOrders, updateOrderStatus } from '../services/orders.service'
import type { Order, OrderStatus } from '../types/order.types'

const STATUS_LABELS: Record<OrderStatus, string> = {
	pending: 'Pendiente',
	processing: 'En proceso',
	completed: 'Completado',
	cancelled: 'Cancelado',
}

const STATUS_OPTIONS: OrderStatus[] = ['pending', 'processing', 'completed', 'cancelled']

export function AdminOrdersPage() {
	const [orders, setOrders] = useState<Order[]>([])
	const [error, setError] = useState<string | null>(null)
	const [loading, setLoading] = useState(true)
	const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all')
	const [updatingId, setUpdatingId] = useState<string | null>(null)
	// Cambiar este valor fuerza al efecto de abajo a resuscribirse: es
	// el "reintentar" de un listener en vivo (no hay una sola llamada
	// que repetir, como con un fetch tradicional).
	const [retryKey, setRetryKey] = useState(0)

	// Listener en tiempo real: el panel se actualiza solo cuando entra
	// un pedido nuevo o alguien cambia el estado de uno, sin recargar.
	// (loading/error para el reintento se resetean en el onClick del
	// botón, no acá: llamar setState sincrónico en el cuerpo de un
	// efecto dispara un render en cascada innecesario).
	useEffect(() => {
		const unsubscribe = subscribeToAllOrders(
			(result) => {
				setOrders(result)
				setLoading(false)
			},
			(err) => {
				setError(err.message || 'No se pudieron cargar las órdenes.')
				setLoading(false)
			},
		)

		return unsubscribe
	}, [retryKey])

	const handleStatusChange = async (orderId: string, status: OrderStatus) => {
		setUpdatingId(orderId)

		try {
			await updateOrderStatus(orderId, status)
			// No hace falta actualizar `orders` a mano: el listener de
			// arriba recibe el cambio solo (con latencia compensada, se
			// ve al instante igual que con un setState local).
		} catch (err) {
			setError(err instanceof Error ? err.message : 'No se pudo actualizar el estado.')
		} finally {
			setUpdatingId(null)
		}
	}

	const handleRetry = () => {
		setLoading(true)
		setError(null)
		setRetryKey((key) => key + 1)
	}

	if (loading) return <LoadingState message="Cargando órdenes..." />
	if (error) return <ErrorState message={error} onRetry={handleRetry} />

	const filteredOrders =
		statusFilter === 'all' ? orders : orders.filter((order) => order.status === statusFilter)

	return (
		<div className="flex w-full flex-col items-center gap-4">
			<h2>Todas las órdenes</h2>

			<select
				value={statusFilter}
				onChange={(event) => setStatusFilter(event.target.value as OrderStatus | 'all')}
			>
				<option value="all">Todos los estados</option>
				{STATUS_OPTIONS.map((status) => (
					<option key={status} value={status}>
						{STATUS_LABELS[status]}
					</option>
				))}
			</select>

			{filteredOrders.length === 0 ? (
				<EmptyState title="No hay órdenes con ese estado" />
			) : (
				<div className="flex w-full max-w-2xl flex-col gap-2">
					{filteredOrders.map((order) => (
						<div
							key={order.id}
							className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:gap-4"
						>
							<span className="flex-1">
								#{order.id.slice(0, 8)} — usuario {order.userId.slice(0, 8)} — $
								{order.total}
							</span>
							<select
								value={order.status}
								disabled={updatingId === order.id}
								onChange={(event) =>
									handleStatusChange(order.id, event.target.value as OrderStatus)
								}
							>
								{STATUS_OPTIONS.map((status) => (
									<option key={status} value={status}>
										{STATUS_LABELS[status]}
									</option>
								))}
							</select>
						</div>
					))}
				</div>
			)}
		</div>
	)
}
