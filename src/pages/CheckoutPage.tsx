import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../assets/layouts/ui/buttons'
import { useCart } from '../contexts/cart'
import { useAuth } from '../contexts/auth'
import { createOrder } from '../services/orders.service'

export function CheckoutPage() {
	const { items, subtotal, discountCode, discountAmount, total, clearCart } = useCart()
	const { user } = useAuth()
	const navigate = useNavigate()
	const [submitting, setSubmitting] = useState(false)
	const [error, setError] = useState<string | null>(null)

	if (items.length === 0) {
		return <p>No hay nada para pagar todavía.</p>
	}

	const handleConfirm = async () => {
		if (!user) return

		setSubmitting(true)
		setError(null)

		try {
			const orderId = await createOrder(
				user.uid,
				items,
				total,
				discountCode ? { code: discountCode, amount: discountAmount } : undefined,
			)
			clearCart()
			navigate(`/orders/${orderId}`)
		} catch (err) {
			setError(err instanceof Error ? err.message : 'No se pudo confirmar el pedido.')
			setSubmitting(false)
		}
	}

	return (
		<div className="flex flex-col items-center gap-4">
			<h2>Resumen de tu compra</h2>

			<ul className="flex flex-col gap-1">
				{items.map(({ product, quantity }) => (
					<li key={product.id}>
						{product.name} x {quantity}
					</li>
				))}
			</ul>

			<p>Subtotal: ${subtotal}</p>
			{discountCode && (
				<p>
					Descuento ({discountCode}): -${discountAmount}
				</p>
			)}
			<p>Total: ${total}</p>

			{error && <p role="alert">{error}</p>}

			<Button type="button" onClick={handleConfirm} disabled={submitting}>
				{submitting ? 'Confirmando...' : 'Confirmar pedido'}
			</Button>
		</div>
	)
}
