import { act, renderHook, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { ReactNode } from 'react'
import { CartProvider } from './CartProvider'
import { useCart } from './useCart'
import type { Product } from '../../types/product.types'

// Wrapper de provider reutilizable: renderHook necesita que useCart()
// se ejecute dentro de un <CartProvider>, no aislado.
function wrapper({ children }: { children: ReactNode }) {
	return <CartProvider>{children}</CartProvider>
}

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

describe('useCart (integrado con CartProvider)', () => {
	beforeEach(() => {
		localStorage.clear()
	})

	afterEach(() => {
		vi.unstubAllGlobals()
	})

	it('arranca vacío', () => {
		const { result } = renderHook(() => useCart(), { wrapper })

		expect(result.current.items).toHaveLength(0)
		expect(result.current.itemCount).toBe(0)
		expect(result.current.total).toBe(0)
	})

	it('agrega, actualiza cantidad y elimina un producto', () => {
		const { result } = renderHook(() => useCart(), { wrapper })
		const product = makeProduct()

		act(() => result.current.addItem(product))
		expect(result.current.itemCount).toBe(1)
		expect(result.current.subtotal).toBe(12.99)

		act(() => result.current.updateQuantity(product.id, 3))
		expect(result.current.itemCount).toBe(3)
		expect(result.current.subtotal).toBe(38.97)

		act(() => result.current.removeItem(product.id))
		expect(result.current.items).toHaveLength(0)
		expect(result.current.subtotal).toBe(0)
	})

	it('clearCart vacía el carrito', () => {
		const { result } = renderHook(() => useCart(), { wrapper })

		act(() => result.current.addItem(makeProduct()))
		act(() => result.current.clearCart())

		expect(result.current.items).toHaveLength(0)
		expect(result.current.total).toBe(0)
	})

	it('applyDiscountCode aplica el descuento cuando el servidor lo valida (fetch mockeado)', async () => {
		vi.stubGlobal(
			'fetch',
			vi.fn().mockResolvedValue({
				json: () =>
					Promise.resolve({
						valid: true,
						code: 'BIENVENIDA10',
						type: 'percentage',
						value: 10,
						message: 'Código aplicado correctamente',
					}),
			}),
		)

		const { result } = renderHook(() => useCart(), { wrapper })
		act(() => result.current.addItem(makeProduct({ price: 100 })))

		let outcome: { success: boolean; message: string } | undefined
		await act(async () => {
			outcome = await result.current.applyDiscountCode('bienvenida10')
		})

		expect(outcome).toEqual({ success: true, message: 'Código aplicado correctamente' })
		await waitFor(() => {
			expect(result.current.discountCode).toBe('BIENVENIDA10')
			expect(result.current.discountAmount).toBe(10)
			expect(result.current.total).toBe(90)
		})
	})

	it('applyDiscountCode no aplica nada si el servidor rechaza el código', async () => {
		vi.stubGlobal(
			'fetch',
			vi.fn().mockResolvedValue({
				json: () => Promise.resolve({ valid: false, message: 'El código no existe' }),
			}),
		)

		const { result } = renderHook(() => useCart(), { wrapper })
		act(() => result.current.addItem(makeProduct({ price: 100 })))

		let outcome: { success: boolean; message: string } | undefined
		await act(async () => {
			outcome = await result.current.applyDiscountCode('XXXX')
		})

		expect(outcome).toEqual({ success: false, message: 'El código no existe' })
		expect(result.current.discountCode).toBeNull()
		expect(result.current.total).toBe(100)
	})
})
