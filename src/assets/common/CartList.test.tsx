import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { CartList } from './CartList'
import type { CartItem } from '../../types/cartItem.types'
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

function makeItem(overrides: Partial<CartItem> = {}): CartItem {
	return {
		product: makeProduct(),
		quantity: 1,
		addedAt: new Date(),
		...overrides,
	}
}

describe('<CartList />', () => {
	it('muestra el nombre, precio y cantidad de cada item', () => {
		render(
			<CartList
				items={[makeItem({ quantity: 2 })]}
				onRemove={vi.fn()}
				onUpdateQuantity={vi.fn()}
			/>,
		)

		expect(screen.getByText('Babero de Muselina Natural')).toBeInTheDocument()
		expect(screen.getByText('Cantidad: 2')).toBeInTheDocument()
	})

	it('llama a onUpdateQuantity con la cantidad +1 al tocar el botón +', async () => {
		const onUpdateQuantity = vi.fn()
		const user = userEvent.setup()

		render(
			<CartList
				items={[makeItem({ quantity: 2 })]}
				onRemove={vi.fn()}
				onUpdateQuantity={onUpdateQuantity}
			/>,
		)

		await user.click(screen.getByRole('button', { name: 'Agregar una unidad' }))

		expect(onUpdateQuantity).toHaveBeenCalledWith('p1', 3)
	})

	it('llama a onUpdateQuantity con la cantidad -1 al tocar el botón -', async () => {
		const onUpdateQuantity = vi.fn()
		const user = userEvent.setup()

		render(
			<CartList
				items={[makeItem({ quantity: 2 })]}
				onRemove={vi.fn()}
				onUpdateQuantity={onUpdateQuantity}
			/>,
		)

		await user.click(screen.getByRole('button', { name: 'Quitar una unidad' }))

		expect(onUpdateQuantity).toHaveBeenCalledWith('p1', 1)
	})

	it('deshabilita el botón - cuando la cantidad es 1', () => {
		render(
			<CartList
				items={[makeItem({ quantity: 1 })]}
				onRemove={vi.fn()}
				onUpdateQuantity={vi.fn()}
			/>,
		)

		expect(screen.getByRole('button', { name: 'Quitar una unidad' })).toBeDisabled()
	})

	it('deshabilita el botón + cuando la cantidad llega al stock disponible', () => {
		render(
			<CartList
				items={[makeItem({ quantity: 3, product: makeProduct({ stock: 3 }) })]}
				onRemove={vi.fn()}
				onUpdateQuantity={vi.fn()}
			/>,
		)

		expect(screen.getByRole('button', { name: 'Agregar una unidad' })).toBeDisabled()
	})

	it('llama a onRemove con el id del producto al tocar Eliminar', async () => {
		const onRemove = vi.fn()
		const user = userEvent.setup()

		render(<CartList items={[makeItem()]} onRemove={onRemove} onUpdateQuantity={vi.fn()} />)

		await user.click(screen.getByRole('button', { name: 'Eliminar' }))

		expect(onRemove).toHaveBeenCalledWith('p1')
	})
})
