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
