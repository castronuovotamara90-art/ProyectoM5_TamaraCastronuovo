import { useCallback, useEffect, useState, useTransition } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ProductForm } from '../assets/common/admin/ProductForm'
import { LoadingState } from '../assets/common/LoadingState'
import { ErrorState } from '../assets/common/ErrorState'
import { EmptyState } from '../assets/common/EmptyState'
import { getProductById, updateProduct } from '../services/products.service'
import type { Product } from '../types/product.types'
import type { ProductInput } from '../services/products.service'

export function AdminProductEditPage() {
	const { id } = useParams<{ id: string }>()
	const navigate = useNavigate()
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

	const handleSubmit = async (input: ProductInput) => {
		if (!id) return
		await updateProduct(id, input)
		navigate('/admin/products')
	}

	if (loading) return <LoadingState message="Cargando producto..." />
	if (error) return <ErrorState message={error} onRetry={loadProduct} />
	if (!product) return <EmptyState title="No encontramos ese producto" />

	return (
		<div className="flex flex-col items-center gap-4">
			<h2>Editar producto</h2>
			<ProductForm
				initialProduct={product}
				onSubmit={handleSubmit}
				submitLabel="Guardar cambios"
			/>
		</div>
	)
}
