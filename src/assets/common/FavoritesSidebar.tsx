import Button from '../layouts/ui/buttons'
import { useCart } from '../../contexts/cart'
import { useFavorites } from '../../contexts/favorites'
import { useToast } from '../../contexts/toast'

interface FavoritesSidebarProps {
	isOpen: boolean
	onClose: () => void
}

export function FavoritesSidebar({ isOpen, onClose }: FavoritesSidebarProps) {
	const { items, removeFavorite } = useFavorites()
	const { addItem } = useCart()
	const { showToast } = useToast()

	if (!isOpen) return null

	return (
		<div className="favorites-sidebar-backdrop" onClick={onClose}>
			<aside
				className="favorites-sidebar flex flex-col gap-4 p-4"
				onClick={(event) => event.stopPropagation()}
			>
				<div className="flex items-center justify-between">
					<h2>Favoritos</h2>
					<Button
						variant="icon"
						type="button"
						aria-label="Cerrar"
						icon={<span aria-hidden="true">✕</span>}
						onClick={onClose}
					/>
				</div>

				{items.length === 0 ? (
					<p>No tenés productos favoritos todavía.</p>
				) : (
					<ul className="flex flex-col gap-3">
						{items.map(({ product }) => (
							<li key={product.id} className="flex items-center gap-2">
								<img
									src={product.image}
									alt={product.name}
									className="h-12 w-12 rounded-md object-cover"
								/>
								<span className="flex-1">
									{product.name} - ${product.price}
								</span>
								<Button
									type="button"
									onClick={() => {
										addItem(product)
										showToast(`${product.name} se agregó al carrito`)
									}}
								>
									Agregar al carrito
								</Button>
								<Button
									variant="danger"
									type="button"
									onClick={() => removeFavorite(product.id)}
								>
									Quitar de favoritos
								</Button>
							</li>
						))}
					</ul>
				)}
			</aside>
		</div>
	)
}
