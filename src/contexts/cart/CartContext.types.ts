import type { CartItem } from '../../types/cartItem.types'
import type { Product } from '../../types/product.types'

export type CartState = {
	items: CartItem[]
	total: number
}

export type CartAction =
	| { type: 'ADD_ITEM'; payload: Product }
	| { type: 'REMOVE_ITEM'; payload: string }
	| { type: 'UPDATE_QUANTITY'; payload: { productId: string; quantity: number } }
	| { type: 'CLEAR_CART' }

// Interfaz pública del context: funciones nombradas, no dispatch.
// Los componentes llaman addItem(product) sin saber nada de
// discriminated unions ni del campo `type` — si el reducer cambia
// por dentro, solo hay que tocar el provider, no cada componente.
export type CartContextType = {
	items: CartItem[]
	total: number
	itemCount: number
	addItem: (product: Product) => void
	removeItem: (productId: string) => void
	updateQuantity: (productId: string, quantity: number) => void
	clearCart: () => void
}
