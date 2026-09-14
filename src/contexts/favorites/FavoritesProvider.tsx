import {
	useCallback,
	useEffect,
	useMemo,
	useReducer,
	type ReactNode,
} from 'react'
import { favoritesReducer } from './favoritesReducer'
import { FavoritesContext } from './FavoritesContext'
import type { FavoriteItem, FavoritesState } from './FavoritesContext.types'
import type { Product } from '../../types/product.types'

const STORAGE_KEY = 'favorites'

const initialState: FavoritesState = { items: [] }

// Se llama una sola vez al montar (tercer argumento de useReducer),
// igual patrón que el carrito.
function loadFromStorage(): FavoritesState {
	try {
		const stored = localStorage.getItem(STORAGE_KEY)

		if (!stored) return initialState

		const parsed = JSON.parse(stored) as { items?: FavoriteItem[] }

		const items =
			parsed.items?.map((item) => ({
				...item,
				addedAt: new Date(item.addedAt),
			})) ?? []

		return { items }
	} catch {
		return initialState
	}
}

export function FavoritesProvider({ children }: { children: ReactNode }) {
	const [state, dispatch] = useReducer(favoritesReducer, undefined, loadFromStorage)

	useEffect(() => {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
	}, [state])

	const isFavorite = useCallback(
		(productId: string) => state.items.some((item) => item.product.id === productId),
		[state.items],
	)

	const toggleFavorite = useCallback(
		(product: Product) => {
			if (isFavorite(product.id)) {
				dispatch({ type: 'REMOVE_FAVORITE', payload: product.id })
			} else {
				dispatch({ type: 'ADD_FAVORITE', payload: product })
			}
		},
		[isFavorite],
	)

	const removeFavorite = useCallback((productId: string) => {
		dispatch({ type: 'REMOVE_FAVORITE', payload: productId })
	}, [])

	const clearFavorites = useCallback(() => {
		dispatch({ type: 'CLEAR_FAVORITES' })
	}, [])

	const value = useMemo(
		() => ({
			items: state.items,
			count: state.items.length,
			isFavorite,
			toggleFavorite,
			removeFavorite,
			clearFavorites,
		}),
		[state.items, isFavorite, toggleFavorite, removeFavorite, clearFavorites],
	)

	return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>
}
