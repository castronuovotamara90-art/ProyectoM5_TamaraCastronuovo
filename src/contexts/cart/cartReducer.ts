import type { CartAction, CartState } from './CartContext.types'
import type { CartItem } from '../../types/cartItem.types'
import { roundMoney } from '../../utils/money'

function calculateTotal(items: CartItem[]): number {
	return roundMoney(items.reduce((sum, item) => sum + item.product.price * item.quantity, 0))
}

// Reducer puro: nada de React, nada de context. Dado un estado y una
// acción, siempre devuelve el mismo resultado — se puede testear solo.
export function cartReducer(state: CartState, action: CartAction): CartState {
	switch (action.type) {
		// Cada case en su propio bloque {} para no chocar nombres de
		// variables entre cases dentro del mismo switch.
		case 'ADD_ITEM': {
			const product = action.payload
			const existingItem = state.items.find((item) => item.product.id === product.id)

			const items = existingItem
				? state.items.map((item) =>
						item.product.id === product.id
							? { ...item, quantity: Math.min(item.quantity + 1, product.stock) }
							: item,
					)
				: [...state.items, { product, quantity: 1, addedAt: new Date() }]

			// El total se recalcula siempre a partir de items, nunca se
			// actualiza "a mano": evita que total quede desincronizado.
			return { ...state, items, total: calculateTotal(items) }
		}

		case 'REMOVE_ITEM': {
			const items = state.items.filter((item) => item.product.id !== action.payload)

			return { ...state, items, total: calculateTotal(items) }
		}

		case 'UPDATE_QUANTITY': {
			const { productId, quantity } = action.payload

			// Cantidad cero elimina el item: así los componentes no
			// tienen que decidir entre "actualizar" o "eliminar".
			const items =
				quantity <= 0
					? state.items.filter((item) => item.product.id !== productId)
					: state.items.map((item) =>
							item.product.id === productId
								? { ...item, quantity: Math.min(quantity, item.product.stock) }
								: item,
						)

			return { ...state, items, total: calculateTotal(items) }
		}

		case 'CLEAR_CART': {
			return { items: [], total: 0, discountCode: null, discountType: null, discountValue: 0 }
		}

		case 'APPLY_DISCOUNT': {
			return {
				...state,
				discountCode: action.payload.code,
				discountType: action.payload.type,
				discountValue: action.payload.value,
			}
		}

		case 'REMOVE_DISCOUNT': {
			return { ...state, discountCode: null, discountType: null, discountValue: 0 }
		}

		default:
			return state
	}
}
