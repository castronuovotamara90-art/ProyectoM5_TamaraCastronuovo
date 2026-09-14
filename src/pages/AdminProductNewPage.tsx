import { useNavigate } from 'react-router-dom'
import { ProductForm } from '../assets/common/admin/ProductForm'
import { createProduct } from '../services/products.service'
import type { ProductInput } from '../services/products.service'

export function AdminProductNewPage() {
	const navigate = useNavigate()

	const handleSubmit = async (input: ProductInput) => {
		await createProduct(input)
		navigate('/admin/products')
	}

	return (
		<div className="flex flex-col items-center gap-4">
			<h2>Nuevo producto</h2>
			<ProductForm onSubmit={handleSubmit} submitLabel="Crear producto" />
		</div>
	)
}
