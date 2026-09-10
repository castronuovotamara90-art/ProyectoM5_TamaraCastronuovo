import Button from '../layouts/ui/buttons'
import { useCart } from '../../contexts/cart'
import type { Product } from '../../types/product.types'

interface ProductCardProps {
	product: Product
}

export function ProductCard({ product }: ProductCardProps) {
	const { addItem } = useCart()

	return (
		<li className="flex items-center gap-4">
			<img
				src={product.image}
				alt={product.name}
				className="h-16 w-16 rounded-md object-cover"
				loading="lazy"
			/>

			<span className="flex-1">
				{product.name} - ${product.price}
			</span>

			<Button type="button" onClick={() => addItem(product)}>
				Agregar al Carrito
			</Button>
		</li>
	)
}
