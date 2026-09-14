import {
	useCallback,
	useEffect,
	useMemo,
	useReducer,
	type ReactNode,
} from 'react'
import { cartReducer } from './cartReducer'
import { CartContext } from './CartContext'
import type { ApplyDiscountResult, CartState } from './CartContext.types'
import type { CartItem } from '../../types/cartItem.types'
import type { Product } from '../../types/product.types'

const STORAGE_KEY = 'cart'

const initialState: CartState = {
	items: [],
	total: 0,
	discountCode: null,
	discountType: null,
	discountValue: 0,
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

		const parsed = JSON.parse(stored) as Partial<CartState> & { items?: CartItem[] }

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
			// ?? en vez de asumir presentes: carritos guardados antes de
			// que existiera el descuento no tienen estos campos.
			discountCode: parsed.discountCode ?? null,
			discountType: parsed.discountType ?? null,
			discountValue: parsed.discountValue ?? 0,
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

	// Valida el código contra api/apply-coupon.ts (Firebase Admin del
	// lado del servidor) en vez de leer Firestore directo: así nadie
	// puede listar los códigos activos abriendo la consola del navegador.
	const applyDiscountCode = useCallback(
		async (code: string): Promise<ApplyDiscountResult> => {
			try {
				const response = await fetch('/api/apply-coupon', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ code, subtotal: state.total }),
				})

				const data = (await response.json()) as {
					valid: boolean
					code?: string
					type?: 'percentage' | 'fixed'
					value?: number
					message: string
				}

				if (!data.valid || !data.code || !data.type || typeof data.value !== 'number') {
					return { success: false, message: data.message }
				}

				dispatch({
					type: 'APPLY_DISCOUNT',
					payload: { code: data.code, type: data.type, value: data.value },
				})

				return { success: true, message: data.message }
			} catch {
				return { success: false, message: 'No se pudo validar el código, probá de nuevo.' }
			}
		},
		[state.total],
	)

	const removeDiscountCode = useCallback(() => {
		dispatch({ type: 'REMOVE_DISCOUNT' })
	}, [])

	const itemCount = useMemo(
		() => state.items.reduce((sum, item) => sum + item.quantity, 0),
		[state.items],
	)

	// Recalculado contra el subtotal actual (no guardado "a mano"): si
	// el carrito cambia después de aplicar el código, el descuento de
	// porcentaje se ajusta solo y el fijo nunca deja el total negativo.
	const discountAmount = useMemo(() => {
		if (!state.discountType) return 0

		const raw =
			state.discountType === 'percentage'
				? state.total * (state.discountValue / 100)
				: state.discountValue

		return Math.min(Math.round(raw * 100) / 100, state.total)
	}, [state.discountType, state.discountValue, state.total])

	// Memoizado: el objeto se recrearía en cada render del provider,
	// y este context lo consumen varios componentes.
	const value = useMemo(
		() => ({
			items: state.items,
			subtotal: state.total,
			discountCode: state.discountCode,
			discountAmount,
			total: Math.max(0, state.total - discountAmount),
			itemCount,
			addItem,
			removeItem,
			updateQuantity,
			clearCart,
			applyDiscountCode,
			removeDiscountCode,
		}),
		[
			state.items,
			state.total,
			state.discountCode,
			discountAmount,
			itemCount,
			addItem,
			removeItem,
			updateQuantity,
			clearCart,
			applyDiscountCode,
			removeDiscountCode,
		],
	)

	return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
