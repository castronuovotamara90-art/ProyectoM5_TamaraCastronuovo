import { ProductCard } from './ProductCard'
import type { Product } from '../../types/product.types'

interface ProductListViewProps {
	products: Product[]
}

// Componente presentacional: no sabe de dónde salen los productos
// (Firestore, un mock, tests), solo sabe dibujarlos. El caso "sin
// productos" lo decide el container (ProductList) con <EmptyState />.
export function ProductListView({ products }: ProductListViewProps) {
	return (
		<div className="flex w-full flex-col items-center">
			<h2>Lista de nuestros productos:</h2>
			<hr className="my-4 w-full border-white" />

			<ul className="product-grid w-full">
				{products.map((product) => (
					<ProductCard key={product.id} product={product} />
				))}
			</ul>
		</div>
	)
}
