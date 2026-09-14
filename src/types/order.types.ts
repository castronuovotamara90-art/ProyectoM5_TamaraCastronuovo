import type { CartItem } from './cartItem.types'

export type OrderStatus = 'pending' | 'processing' | 'completed' | 'cancelled'

export interface Order {
	id: string
	userId: string
	items: CartItem[]
	total: number
	discountCode?: string
	discountAmount?: number
	status: OrderStatus
	createdAt?: Date
	updatedAt?: Date
}
