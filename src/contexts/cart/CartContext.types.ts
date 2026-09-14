import type { CartItem } from '../../types/cartItem.types'
import type { CouponType } from '../../types/coupon.types'
import type { Product } from '../../types/product.types'

export type CartState = {
	items: CartItem[]
	total: number
	discountCode: string | null
	discountType: CouponType | null
	discountValue: number
}

export type CartAction =
	| { type: 'ADD_ITEM'; payload: Product }
	| { type: 'REMOVE_ITEM'; payload: string }
	| { type: 'UPDATE_QUANTITY'; payload: { productId: string; quantity: number } }
	| { type: 'CLEAR_CART' }
	| { type: 'APPLY_DISCOUNT'; payload: { code: string; type: CouponType; value: number } }
	| { type: 'REMOVE_DISCOUNT' }

export type ApplyDiscountResult = { success: boolean; message: string }

// Interfaz pública del context: funciones nombradas, no dispatch.
// Los componentes llaman addItem(product) sin saber nada de
// discriminated unions ni del campo `type` — si el reducer cambia
// por dentro, solo hay que tocar el provider, no cada componente.
export type CartContextType = {
	items: CartItem[]
	// Suma de los productos, sin descuento.
	subtotal: number
	discountCode: string | null
	// Monto ($) que se resta del subtotal, ya recalculado contra el
	// subtotal actual (por si el carrito cambió después de aplicar el código).
	discountAmount: number
	// subtotal - discountAmount: lo que realmente se paga.
	total: number
	itemCount: number
	addItem: (product: Product) => void
	removeItem: (productId: string) => void
	updateQuantity: (productId: string, quantity: number) => void
	clearCart: () => void
	applyDiscountCode: (code: string) => Promise<ApplyDiscountResult>
	removeDiscountCode: () => void
}
