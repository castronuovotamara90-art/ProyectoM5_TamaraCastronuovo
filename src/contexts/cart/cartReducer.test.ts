import { describe, expect, it } from 'vitest'
import { cartReducer } from './cartReducer'
import type { CartState } from './CartContext.types'
import type { Product } from '../../types/product.types'

function makeProduct(overrides: Partial<Product> = {}): Product {
	return {
		id: 'p1',
		name: 'Babero de Muselina Natural',
		nameLower: 'babero de muselina natural',
		image: 'https://example.com/babero.jpg',
		description: 'Babero suave para las primeras comidas.',
		price: 12.99,
		stock: 5,
		categoryId: 'alimentacion',
		material: 'Muselina de algodón',
		color: 'Natural',
		...overrides,
	}
}

const emptyState: CartState = {
	items: [],
	total: 0,
	discountCode: null,
	discountType: null,
	discountValue: 0,
}

describe('cartReducer', () => {
	describe('ADD_ITEM', () => {
		it('agrega un producto nuevo con cantidad 1', () => {
			const product = makeProduct()

			const state = cartReducer(emptyState, { type: 'ADD_ITEM', payload: product })

			expect(state.items).toHaveLength(1)
			expect(state.items[0].product.id).toBe('p1')
			expect(state.items[0].quantity).toBe(1)
			expect(state.total).toBe(12.99)
		})

		it('incrementa la cantidad si el producto ya está en el carrito', () => {
			const product = makeProduct()
			const withOne = cartReducer(emptyState, { type: 'ADD_ITEM', payload: product })

			const state = cartReducer(withOne, { type: 'ADD_ITEM', payload: product })

			expect(state.items).toHaveLength(1)
			expect(state.items[0].quantity).toBe(2)
			expect(state.total).toBe(25.98)
		})

		it('no supera el stock disponible', () => {
			const product = makeProduct({ stock: 1 })
			const withOne = cartReducer(emptyState, { type: 'ADD_ITEM', payload: product })

			const state = cartReducer(withOne, { type: 'ADD_ITEM', payload: product })

			expect(state.items[0].quantity).toBe(1)
		})
	})

	describe('REMOVE_ITEM', () => {
		it('elimina el producto indicado y recalcula el total', () => {
			const product = makeProduct()
			const withItem = cartReducer(emptyState, { type: 'ADD_ITEM', payload: product })

			const state = cartReducer(withItem, { type: 'REMOVE_ITEM', payload: 'p1' })

			expect(state.items).toHaveLength(0)
			expect(state.total).toBe(0)
		})

		it('no cambia nada si el producto no está en el carrito', () => {
			const state = cartReducer(emptyState, { type: 'REMOVE_ITEM', payload: 'inexistente' })

			expect(state).toEqual(emptyState)
		})
	})

	describe('UPDATE_QUANTITY', () => {
		it('actualiza la cantidad de un producto existente', () => {
			const product = makeProduct({ stock: 10 })
			const withItem = cartReducer(emptyState, { type: 'ADD_ITEM', payload: product })

			const state = cartReducer(withItem, {
				type: 'UPDATE_QUANTITY',
				payload: { productId: 'p1', quantity: 4 },
			})

			expect(state.items[0].quantity).toBe(4)
			expect(state.total).toBe(51.96)
		})

		it('respeta el stock disponible como tope', () => {
			const product = makeProduct({ stock: 3 })
			const withItem = cartReducer(emptyState, { type: 'ADD_ITEM', payload: product })

			const state = cartReducer(withItem, {
				type: 'UPDATE_QUANTITY',
				payload: { productId: 'p1', quantity: 99 },
			})

			expect(state.items[0].quantity).toBe(3)
		})

		it('elimina el producto si la cantidad es 0 o menor', () => {
			const product = makeProduct()
			const withItem = cartReducer(emptyState, { type: 'ADD_ITEM', payload: product })

			const state = cartReducer(withItem, {
				type: 'UPDATE_QUANTITY',
				payload: { productId: 'p1', quantity: 0 },
			})

			expect(state.items).toHaveLength(0)
		})
	})

	describe('CLEAR_CART', () => {
		it('vacía los items y también el descuento aplicado', () => {
			const product = makeProduct()
			const withItem = cartReducer(emptyState, { type: 'ADD_ITEM', payload: product })
			const withDiscount = cartReducer(withItem, {
				type: 'APPLY_DISCOUNT',
				payload: { code: 'BIENVENIDA10', type: 'percentage', value: 10 },
			})

			const state = cartReducer(withDiscount, { type: 'CLEAR_CART' })

			expect(state).toEqual(emptyState)
		})
	})

	describe('APPLY_DISCOUNT', () => {
		it('guarda el código y los datos del descuento sin tocar los items', () => {
			const product = makeProduct()
			const withItem = cartReducer(emptyState, { type: 'ADD_ITEM', payload: product })

			const state = cartReducer(withItem, {
				type: 'APPLY_DISCOUNT',
				payload: { code: 'BIENVENIDA10', type: 'percentage', value: 10 },
			})

			expect(state.discountCode).toBe('BIENVENIDA10')
			expect(state.discountType).toBe('percentage')
			expect(state.discountValue).toBe(10)
			expect(state.items).toBe(withItem.items)
		})
	})

	describe('REMOVE_DISCOUNT', () => {
		it('limpia el descuento sin tocar los items del carrito', () => {
			const product = makeProduct()
			const withItem = cartReducer(emptyState, { type: 'ADD_ITEM', payload: product })
			const withDiscount = cartReducer(withItem, {
				type: 'APPLY_DISCOUNT',
				payload: { code: 'BIENVENIDA10', type: 'percentage', value: 10 },
			})

			const state = cartReducer(withDiscount, { type: 'REMOVE_DISCOUNT' })

			expect(state.discountCode).toBeNull()
			expect(state.discountType).toBeNull()
			expect(state.discountValue).toBe(0)
			expect(state.items).toHaveLength(1)
		})
	})
})
