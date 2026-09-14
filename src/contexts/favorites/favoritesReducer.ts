import type { FavoritesAction, FavoritesState } from './FavoritesContext.types'

export function favoritesReducer(state: FavoritesState, action: FavoritesAction): FavoritesState {
	switch (action.type) {
		case 'ADD_FAVORITE': {
			const product = action.payload
			const alreadyFavorite = state.items.some((item) => item.product.id === product.id)

			if (alreadyFavorite) return state

			return { items: [...state.items, { product, addedAt: new Date() }] }
		}

		case 'REMOVE_FAVORITE': {
			return { items: state.items.filter((item) => item.product.id !== action.payload) }
		}

		case 'CLEAR_FAVORITES': {
			return { items: [] }
		}

		default:
			return state
	}
}
