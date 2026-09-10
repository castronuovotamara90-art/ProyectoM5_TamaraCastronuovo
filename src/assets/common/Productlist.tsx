import Button from '../layouts/ui/buttons'
import { useProducts } from '../../contexts/products'
import { ProductListView } from './ProductListView'
import { LoadingState } from './LoadingState'
import { ErrorState } from './ErrorState'
import { EmptyState } from './EmptyState'
import type { CategoryId } from '../../types/product.types'

const CATEGORY_LABELS: Record<CategoryId, string> = {
	alimentacion: 'Alimentación',
	paseo: 'Paseo',
	higiene: 'Higiene',
	dormitorio: 'Dormitorio',
	juguetes: 'Juguetes',
	organizacion: 'Organización',
}

// Container: se conecta al contexto/Firestore y decide qué estado
// mostrar. No dibuja la lista en sí, eso lo delega a ProductListView.
export function ProductList() {
	const {
		products,
		isLoading,
		error,
		categoryId,
		setCategoryId,
		searchText,
		setSearchText,
		hasNextPage,
		isLoadingMore,
		loadProducts,
		resetFilters,
	} = useProducts()

	const hasFilters = Boolean(categoryId) || Boolean(searchText.trim())

	return (
		<div className="flex flex-col items-center">
			<div className="mb-4 flex flex-wrap items-center justify-center gap-4">
				<select value={categoryId} onChange={(event) => setCategoryId(event.target.value)}>
					<option value="">Todas las categorías</option>
					{Object.entries(CATEGORY_LABELS).map(([id, label]) => (
						<option key={id} value={id}>
							{label}
						</option>
					))}
				</select>

				<input
					type="search"
					placeholder="Buscar por nombre..."
					value={searchText}
					onChange={(event) => setSearchText(event.target.value)}
				/>

				{hasFilters && (
					<Button type="button" onClick={resetFilters}>
						Limpiar filtros
					</Button>
				)}
			</div>

			{isLoading && <LoadingState message="Cargando productos..." />}

			{!isLoading && error && (
				<ErrorState message={error} onRetry={() => loadProducts({ reset: true })} />
			)}

			{!isLoading && !error && products.length === 0 && (
				<EmptyState title={hasFilters ? 'No hay resultados' : 'No hay productos'} />
			)}

			{!isLoading && !error && products.length > 0 && (
				<>
					<ProductListView products={products} />

					{hasNextPage && (
						<Button
							className="mt-4"
							type="button"
							onClick={() => loadProducts()}
							disabled={isLoadingMore}
						>
							{isLoadingMore ? 'Cargando...' : 'Cargar más'}
						</Button>
					)}
				</>
			)}
		</div>
	)
}
