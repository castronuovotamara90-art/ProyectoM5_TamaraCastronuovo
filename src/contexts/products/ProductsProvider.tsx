import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { useDebounce } from '../../hooks/useDebounce'
import { listProducts } from '../../services/products.service'
import { ProductsContext } from './ProductsContext'
import type { ProductsState } from './ProductContext.types'
import type { CategoryId } from '../../types/product.types'

const PAGE_SIZE = 20
const SEARCH_DEBOUNCE_MS = 400

const initialState: ProductsState = {
	products: [],

	// Estados de la consulta:
	isLoading: false,
	error: null,

	// Paginación:
	cursor: null,
	hasNextPage: true,
	isLoadingMore: false,

	// Filtros:
	searchText: '',
	categoryId: '',
}

export function ProductsProvider({ children }: { children: ReactNode }) {
	const [state, setState] = useState<ProductsState>(initialState)
	const debouncedSearchText = useDebounce(state.searchText, SEARCH_DEBOUNCE_MS)

	const loadProducts = useCallback(
		async ({ reset = false }: { reset?: boolean } = {}) => {
			if (state.isLoading || state.isLoadingMore) {
				return
			}

			const isFirstPage = reset || state.cursor === null

			const searchPrefix =
				state.searchText.trim().length >= 2
					? state.searchText.trim().toLowerCase()
					: undefined

			const cursor = isFirstPage ? null : state.cursor

			setState((current) => ({
				...current,
				...(isFirstPage
					? { products: [], isLoading: true }
					: { isLoadingMore: true }),
			}))

			try {
				const { items, lastDoc } = await listProducts({
					categoryId: (state.categoryId || null) as CategoryId | null,
					searchPrefix,
					pageSize: PAGE_SIZE,
					cursor,
				})

				setState((current) => ({
					...current,
					products: isFirstPage ? items : [...current.products, ...items],
					cursor: lastDoc,
					hasNextPage: items.length === PAGE_SIZE,
					isLoading: false,
					isLoadingMore: false,
					error: null,
				}))
			} catch (err) {
				setState((current) => ({
					...current,
					isLoading: false,
					isLoadingMore: false,
					error:
						err instanceof Error ? err.message : 'No se pudieron cargar los productos.',
				}))
			}
		},
		[
			state.searchText,
			state.categoryId,
			state.cursor,
			state.isLoading,
			state.isLoadingMore,
		],
	)

	// Carga inicial y cada cambio de filtro. La búsqueda usa el valor
	// debounced: mientras el usuario escribe, no dispara una consulta
	// a Firestore por cada tecla, solo cuando se queda quieto 400ms.
	useEffect(() => {
		loadProducts({ reset: true })
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [debouncedSearchText, state.categoryId])

	const setSearchText = useCallback((value: string) => {
		setState((current) => ({ ...current, searchText: value }))
	}, [])

	const setCategoryId = useCallback((value: string) => {
		setState((current) => ({ ...current, categoryId: value }))
	}, [])

	const resetFilters = useCallback(() => {
		setState((current) => ({ ...current, searchText: '', categoryId: '' }))
	}, [])

	const value = useMemo(
		() => ({
			...state,
			loadProducts,
			resetFilters,
			setSearchText,
			setCategoryId,
		}),
		[state, loadProducts, resetFilters, setSearchText, setCategoryId],
	)

	return (
		<ProductsContext.Provider value={value}>
			{children}
		</ProductsContext.Provider>
	)
}
