export type CategoryId =
	| 'alimentacion'
	| 'paseo'
	| 'higiene'
	| 'dormitorio'
	| 'juguetes'
	| 'organizacion'

export interface Product {
	id: string
	name: string
	nameLower: string
	image: string
	// Imágenes adicionales para el carrusel del ProductCard. Si falta
	// o tiene 0-1 elementos, la card se comporta como una sola imagen
	// (sin flechas) usando `image` como respaldo.
	images?: string[]
	description: string
	price: number
	stock: number
	categoryId: CategoryId
	material: string
	color: string
	ageRange?: string
	createdAt?: Date
	updatedAt?: Date
}
