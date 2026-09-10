import { useNavigate } from 'react-router-dom'
import Button from '../assets/layouts/ui/buttons'
import { useCart } from '../contexts/cart'

// Placeholder: no hay integración de pago real todavía, solo
// demuestra que la ruta protegida funciona de punta a punta.
export function CheckoutPage() {
	const { items, total, clearCart } = useCart()
	const navigate = useNavigate()

	if (items.length === 0) {
		return <p>No hay nada para pagar todavía.</p>
	}

	const handleConfirm = () => {
		clearCart()
		navigate('/')
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

			<p>Total: ${total}</p>

			<Button type="button" onClick={handleConfirm}>
				Confirmar pedido
			</Button>
		</div>
	)
}
