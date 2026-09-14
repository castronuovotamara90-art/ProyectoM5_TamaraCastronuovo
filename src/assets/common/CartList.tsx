import Button from '../layouts/ui/buttons'
import type { CartItem } from '../../types/cartItem.types'

interface CartListProps {
	items: CartItem[]
	onRemove: (productId: string) => void
	onUpdateQuantity: (productId: string, quantity: number) => void
}

// Presentacional: no sabe de dónde vienen los items ni cómo se
// eliminan/actualizan, solo los dibuja y delega la acción a los callbacks.
export function CartList({ items, onRemove, onUpdateQuantity }: CartListProps) {
	return (
		<div className="mb-4 flex flex-col gap-2">
			{items.map(({ product, quantity }) => (
				<div
					key={product.id}
					className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:gap-4"
				>
					<span>
						<strong>{product.name}</strong> - ${product.price}
					</span>

					<div className="flex items-center gap-2">
						<Button
							variant="icon"
							type="button"
							aria-label="Quitar una unidad"
							icon={<span aria-hidden="true">−</span>}
							disabled={quantity <= 1}
							onClick={() => onUpdateQuantity(product.id, quantity - 1)}
						/>
						<span>Cantidad: {quantity}</span>
						<Button
							variant="icon"
							type="button"
							aria-label="Agregar una unidad"
							icon={<span aria-hidden="true">+</span>}
							disabled={quantity >= product.stock}
							onClick={() => onUpdateQuantity(product.id, quantity + 1)}
						/>
					</div>

					<Button variant="danger" type="button" onClick={() => onRemove(product.id)}>
						Eliminar
					</Button>
				</div>
			))}
		</div>
	)
}
