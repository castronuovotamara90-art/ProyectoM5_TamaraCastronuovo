import { useCallback, useEffect, useState, useTransition } from 'react'
import { useParams } from 'react-router-dom'
import Button from '../assets/layouts/ui/buttons'
import { LoadingState } from '../assets/common/LoadingState'
import { ErrorState } from '../assets/common/ErrorState'
import { EmptyState } from '../assets/common/EmptyState'
import { getProductById } from '../services/products.service'
import { useCart } from '../contexts/cart'
import { useToast } from '../contexts/toast'
import type { Product } from '../types/product.types'

export function ProductDetailPage() {
	const { id } = useParams<{ id: string }>()
	const { addItem } = useCart()
	const { showToast } = useToast()
	const [product, setProduct] = useState<Product | null>(null)
	const [error, setError] = useState<string | null>(null)
	const [loading, startTransition] = useTransition()

	const loadProduct = useCallback(() => {
		if (!id) return

		startTransition(async () => {
			try {
				const result = await getProductById(id)
				setProduct(result)
				setError(null)
			} catch (err) {
				setError(err instanceof Error ? err.message : 'No se pudo cargar el producto.')
			}
		})
	}, [id])

	useEffect(() => {
		loadProduct()
	}, [loadProduct])

	if (loading) return <LoadingState message="Cargando producto..." />
	if (error) return <ErrorState message={error} onRetry={loadProduct} />
	if (!product) return <EmptyState title="No encontramos ese producto" />

	return (
		<div className="flex flex-col items-center gap-2">
			<img
				src={product.image}
				alt={product.name}
				className="h-48 w-48 rounded-md object-cover"
			/>

			<h2>{product.name}</h2>
			<p>{product.description}</p>
			<p>Precio: ${product.price}</p>
			<p>Stock: {product.stock}</p>
			<p>Material: {product.material}</p>
			<p>Color: {product.color}</p>
			{product.ageRange && <p>Edad recomendada: {product.ageRange}</p>}

			<Button
				type="button"
				onClick={() => {
					addItem(product)
					showToast(`${product.name} se agregó al carrito`)
				}}
				disabled={product.stock === 0}
			>
				{product.stock === 0 ? 'Sin stock' : 'Agregar al Carrito'}
			</Button>
		</div>
	)
}
