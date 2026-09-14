import { useCallback, useEffect, useState, useTransition } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../../layouts/ui/buttons'
import Modal from '../../layouts/ui/modal'
import { LoadingState } from '../LoadingState'
import { ErrorState } from '../ErrorState'
import { EmptyState } from '../EmptyState'
import { deleteProduct, listProducts } from '../../../services/products.service'
import type { Product } from '../../../types/product.types'

export function AdminProductList() {
	const navigate = useNavigate()
	const [products, setProducts] = useState<Product[]>([])
	const [error, setError] = useState<string | null>(null)
	const [loading, startTransition] = useTransition()
	const [productToDelete, setProductToDelete] = useState<Product | null>(null)
	const [deleting, setDeleting] = useState(false)

	const loadProducts = useCallback(() => {
		startTransition(async () => {
			try {
				// pageSize alto porque acá el admin necesita ver todo el
				// catálogo, no una página paginada como en la tienda.
				const { items } = await listProducts({ pageSize: 100 })
				setProducts(items)
				setError(null)
			} catch (err) {
				setError(err instanceof Error ? err.message : 'No se pudieron cargar los productos.')
			}
		})
	}, [])

	useEffect(() => {
		loadProducts()
	}, [loadProducts])

	const handleDelete = async () => {
		if (!productToDelete) return

		setDeleting(true)

		try {
			await deleteProduct(productToDelete.id)
			setProducts((current) => current.filter((product) => product.id !== productToDelete.id))
			setProductToDelete(null)
		} catch (err) {
			setError(err instanceof Error ? err.message : 'No se pudo eliminar el producto.')
		} finally {
			setDeleting(false)
		}
	}

	if (loading) return <LoadingState message="Cargando productos..." />
	if (error) return <ErrorState message={error} onRetry={loadProducts} />

	return (
		<div className="flex w-full flex-col items-center gap-4">
			<Button type="button" onClick={() => navigate('/admin/products/new')}>
				Nuevo producto
			</Button>

			{products.length === 0 ? (
				<EmptyState title="No hay productos cargados" />
			) : (
				<div className="flex w-full max-w-2xl flex-col gap-2">
					{products.map((product) => (
						<div
							key={product.id}
							className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:gap-4"
						>
							<img
								src={product.image}
								alt={product.name}
								className="h-12 w-12 rounded-md object-cover"
							/>
							<span className="flex-1">
								{product.name} - ${product.price} - Stock: {product.stock}
							</span>
							<Button
								type="button"
								onClick={() => navigate(`/admin/products/${product.id}/edit`)}
							>
								Editar
							</Button>
							<Button
								variant="danger"
								type="button"
								onClick={() => setProductToDelete(product)}
							>
								Eliminar
							</Button>
						</div>
					))}
				</div>
			)}

			<Modal isOpen={productToDelete !== null} onClose={() => setProductToDelete(null)}>
				<h2>Eliminar producto</h2>
				<p>¿Seguro que querés eliminar "{productToDelete?.name}"?</p>
				<div className="mt-4 flex justify-end gap-2">
					<Button type="button" onClick={() => setProductToDelete(null)}>
						Cancelar
					</Button>
					<Button variant="danger" type="button" onClick={handleDelete} disabled={deleting}>
						{deleting ? 'Eliminando...' : 'Sí, eliminar'}
					</Button>
				</div>
			</Modal>
		</div>
	)
}
