import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../assets/layouts/ui/buttons'
import Modal from '../assets/layouts/ui/modal'
import { useCart } from '../contexts/cart'

export function CartPage() {
	const { items, total, removeItem, clearCart } = useCart()
	const [isConfirmOpen, setIsConfirmOpen] = useState(false)
	const navigate = useNavigate()

	const handleConfirmClear = () => {
		clearCart()
		setIsConfirmOpen(false)
	}

	return (
		<>
			<h2>Items en el carrito</h2>

			{items.length === 0 ? (
				<p>No hay productos en el carrito</p>
			) : (
				<div className="flex flex-col gap-2 mb-4">
					{items.map(({ product, quantity }) => (
						<div key={product.id} className="flex items-center gap-4">
							<span>
								<strong>{product.name}</strong> - ${product.price} | Cantidad:{' '}
								{quantity}
							</span>
							<Button
								variant="danger"
								type="button"
								onClick={() => removeItem(product.id)}
							>
								Eliminar
							</Button>
						</div>
					))}

					<p>Total: ${total}</p>

					<Button variant="danger" type="button" onClick={() => setIsConfirmOpen(true)}>
						Limpiar carrito
					</Button>

					<Button type="button" onClick={() => navigate('/checkout')}>
						Ir a pagar
					</Button>
				</div>
			)}

			<Modal isOpen={isConfirmOpen} onClose={() => setIsConfirmOpen(false)}>
				<div className="flex items-start justify-between gap-4">
					<h2>Vaciar el carrito</h2>
					<Button
						variant="icon"
						type="button"
						aria-label="Cerrar"
						icon={<span aria-hidden="true">✕</span>}
						onClick={() => setIsConfirmOpen(false)}
					/>
				</div>
				<p>¿Seguro que querés eliminar todos los productos del carrito?</p>
				<div className="flex justify-end gap-2 mt-4">
					<Button type="button" onClick={() => setIsConfirmOpen(false)}>
						Cancelar
					</Button>
					<Button variant="danger" type="button" onClick={handleConfirmClear}>
						Sí, vaciar
					</Button>
				</div>
			</Modal>
		</>
	)
}
