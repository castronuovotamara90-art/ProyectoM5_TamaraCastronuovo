import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../../contexts/cart'
import { useFavorites } from '../../contexts/favorites'
import { useToast } from '../../contexts/toast'
import type { Product } from '../../types/product.types'

interface ProductCardProps {
	product: Product
}

export function ProductCard({ product }: ProductCardProps) {
	const { addItem } = useCart()
	const { isFavorite: checkIsFavorite, toggleFavorite } = useFavorites()
	const { showToast } = useToast()

	const handleAddToCart = () => {
		addItem(product)
		showToast(`${product.name} se agregó al carrito`)
	}

	// Si el producto no tiene `images` (o viene vacío), se comporta
	// como una sola imagen: las flechas no se renderizan en ese caso.
	const images = product.images && product.images.length > 0 ? product.images : [product.image]
	const [imageIndex, setImageIndex] = useState(0)

	const isFavorite = checkIsFavorite(product.id)

	const showPrevImage = () => {
		setImageIndex((current) => (current === 0 ? images.length - 1 : current - 1))
	}

	const showNextImage = () => {
		setImageIndex((current) => (current === images.length - 1 ? 0 : current + 1))
	}

	return (
		<li className="product-card">
			<div className="product-card__media">
				{product.stock === 0 && (
					<span className="product-card__badge product-card__badge--out-of-stock">
						Agotado
					</span>
				)}

				<button
					type="button"
					className="product-card__wishlist"
					aria-pressed={isFavorite}
					aria-label={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
					onClick={() => toggleFavorite(product)}
				>
					♥
				</button>

				{images.length > 1 && (
					<>
						<button
							type="button"
							className="product-card__nav product-card__nav--prev"
							aria-label="Imagen anterior"
							onClick={showPrevImage}
						>
							‹
						</button>
						<button
							type="button"
							className="product-card__nav product-card__nav--next"
							aria-label="Imagen siguiente"
							onClick={showNextImage}
						>
							›
						</button>
					</>
				)}

				<Link to={`/products/${product.id}`}>
					<img src={images[imageIndex]} alt={product.name} loading="lazy" />
				</Link>

				<button
					type="button"
					className="product-card__add-to-cart"
					disabled={product.stock === 0}
					onClick={handleAddToCart}
				>
					{product.stock === 0 ? 'Sin stock' : 'Agregar al carrito'}
				</button>
			</div>

			<Link to={`/products/${product.id}`}>
				<h3 className="product-card__name">{product.name}</h3>
			</Link>
			<p className="product-card__price">${product.price}</p>
		</li>
	)
}
