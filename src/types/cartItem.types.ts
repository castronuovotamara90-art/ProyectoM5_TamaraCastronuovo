import type { Product } from './product.types'

export interface CartItem {
	product: Product
	quantity: number
	addedAt: Date
}

// Cart: [ { product: prod1, quantity: 2 }, { product: prod2, quantity: 1 } ]
