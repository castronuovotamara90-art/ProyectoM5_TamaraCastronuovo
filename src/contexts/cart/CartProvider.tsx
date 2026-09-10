import {
	useCallback,
	useEffect,
	useMemo,
	useReducer,
	type ReactNode,
} from 'react'
import { cartReducer } from './cartReducer'
import { CartContext } from './CartContext'
import type { CartState } from './CartContext.types'
import type { CartItem } from '../../types/cartItem.types'
import type { Product } from '../../types/product.types'

const STORAGE_KEY = 'cart'

const initialState: CartState = {
	items: [],
	total: 0,
}

function calculateTotal(items: CartItem[]): number {
	return items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
}

// Se llama una sola vez al montar (tercer argumento de useReducer),
// no en cada render — así no leemos localStorage de más.
function loadFromStorage(): CartState {
	try {
		const stored = localStorage.getItem(STORAGE_KEY)

		if (!stored) {
			return initialState
		}

		const parsed = JSON.parse(stored) as { items?: CartItem[] }

		// JSON.stringify serializa Date como string; hay que
		// reconstruirlo o cualquier código que espere un Date falla.
		const items =
			parsed.items?.map((item) => ({
				...item,
				addedAt: new Date(item.addedAt),
			})) ?? []

		// El total confiable es el que se recalcula de items, no el
		// que había guardado (podría estar viejo o corrupto).
		return {
			items,
			total: calculateTotal(items),
		}
	} catch {
		return initialState
	}
}

export function CartProvider({ children }: { children: ReactNode }) {
	const [state, dispatch] = useReducer(cartReducer, undefined, loadFromStorage)

	useEffect(() => {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
	}, [state])

	const addItem = useCallback((product: Product) => {
		dispatch({ type: 'ADD_ITEM', payload: product })
	}, [])

	const removeItem = useCallback((productId: string) => {
		dispatch({ type: 'REMOVE_ITEM', payload: productId })
	}, [])

	const updateQuantity = useCallback((productId: string, quantity: number) => {
		dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, quantity } })
	}, [])

	const clearCart = useCallback(() => {
		dispatch({ type: 'CLEAR_CART' })
	}, [])

	const itemCount = useMemo(
		() => state.items.reduce((sum, item) => sum + item.quantity, 0),
		[state.items],
	)

	// Memoizado: el objeto se recrearía en cada render del provider,
	// y este context lo consumen varios componentes.
	const value = useMemo(
		() => ({
			items: state.items,
			total: state.total,
			itemCount,
			addItem,
			removeItem,
			updateQuantity,
			clearCart,
		}),
		[state.items, state.total, itemCount, addItem, removeItem, updateQuantity, clearCart],
	)

	return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
