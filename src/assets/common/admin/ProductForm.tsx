import { useState, type FormEvent } from 'react'
import Button from '../../layouts/ui/buttons'
import { ImageUploader } from '../ImageUploader'
import type { CategoryId, Product } from '../../../types/product.types'
import type { ProductInput } from '../../../services/products.service'

const CATEGORY_LABELS: Record<CategoryId, string> = {
	alimentacion: 'Alimentación',
	paseo: 'Paseo',
	higiene: 'Higiene',
	dormitorio: 'Dormitorio',
	juguetes: 'Juguetes',
	organizacion: 'Organización',
}

interface ProductFormProps {
	initialProduct?: Product
	onSubmit: (input: ProductInput) => Promise<void>
	submitLabel: string
}

// Un solo formulario para crear y editar: si viene initialProduct,
// arranca precargado; si no, arranca vacío. onSubmit lo decide el
// caller (createProduct vs updateProduct), este componente no sabe
// de Firestore.
export function ProductForm({ initialProduct, onSubmit, submitLabel }: ProductFormProps) {
	const [name, setName] = useState(initialProduct?.name ?? '')
	const [description, setDescription] = useState(initialProduct?.description ?? '')
	const [price, setPrice] = useState(String(initialProduct?.price ?? ''))
	const [stock, setStock] = useState(String(initialProduct?.stock ?? ''))
	const [categoryId, setCategoryId] = useState<CategoryId>(
		initialProduct?.categoryId ?? 'alimentacion',
	)
	const [material, setMaterial] = useState(initialProduct?.material ?? '')
	const [color, setColor] = useState(initialProduct?.color ?? '')
	const [ageRange, setAgeRange] = useState(initialProduct?.ageRange ?? '')
	const [image, setImage] = useState(initialProduct?.image ?? '')
	const [submitting, setSubmitting] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const handleSubmit = async (event: FormEvent) => {
		event.preventDefault()
		setError(null)

		if (!image) {
			setError('Subí una imagen del producto.')
			return
		}

		setSubmitting(true)

		try {
			await onSubmit({
				name,
				description,
				price: Number(price),
				stock: Number(stock),
				categoryId,
				material,
				color,
				ageRange: ageRange || undefined,
				image,
			})
		} catch (err) {
			setError(err instanceof Error ? err.message : 'No se pudo guardar el producto.')
			setSubmitting(false)
		}
	}

	return (
		<form onSubmit={handleSubmit} className="flex w-full max-w-md flex-col gap-2 px-4 sm:px-0">
			<input
				value={name}
				onChange={(event) => setName(event.target.value)}
				placeholder="Nombre"
				required
			/>

			<textarea
				value={description}
				onChange={(event) => setDescription(event.target.value)}
				placeholder="Descripción"
				required
			/>

			<input
				type="number"
				min="0"
				step="0.01"
				value={price}
				onChange={(event) => setPrice(event.target.value)}
				placeholder="Precio"
				required
			/>

			<input
				type="number"
				min="0"
				step="1"
				value={stock}
				onChange={(event) => setStock(event.target.value)}
				placeholder="Stock"
				required
			/>

			<select
				value={categoryId}
				onChange={(event) => setCategoryId(event.target.value as CategoryId)}
			>
				{Object.entries(CATEGORY_LABELS).map(([id, label]) => (
					<option key={id} value={id}>
						{label}
					</option>
				))}
			</select>

			<input
				value={material}
				onChange={(event) => setMaterial(event.target.value)}
				placeholder="Material"
				required
			/>

			<input
				value={color}
				onChange={(event) => setColor(event.target.value)}
				placeholder="Color"
				required
			/>

			<input
				value={ageRange}
				onChange={(event) => setAgeRange(event.target.value)}
				placeholder="Rango de edad (opcional)"
			/>

			<div className="flex flex-col items-center gap-2">
				{image && (
					<img
						src={image}
						alt="Vista previa"
						className="h-24 w-24 rounded-md object-cover"
					/>
				)}
				<ImageUploader onUploaded={setImage} />
			</div>

			{error && <p role="alert">{error}</p>}

			<Button type="submit" disabled={submitting}>
				{submitting ? 'Guardando...' : submitLabel}
			</Button>
		</form>
	)
}
