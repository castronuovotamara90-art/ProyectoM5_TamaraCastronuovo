import type { Product } from '../../types/product.types'

export interface FavoriteItem {
	product: Product
	addedAt: Date
}

export type FavoritesState = {
	items: FavoriteItem[]
}

export type FavoritesAction =
	| { type: 'ADD_FAVORITE'; payload: Product }
	| { type: 'REMOVE_FAVORITE'; payload: string }
	| { type: 'CLEAR_FAVORITES' }

export type FavoritesContextType = {
	items: FavoriteItem[]
	count: number
	isFavorite: (productId: string) => boolean
	toggleFavorite: (product: Product) => void
	removeFavorite: (productId: string) => void
	clearFavorites: () => void
}
