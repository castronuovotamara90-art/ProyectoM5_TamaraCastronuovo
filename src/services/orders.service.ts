import {
	addDoc,
	collection,
	doc,
	getDoc,
	getDocs,
	orderBy,
	query,
	serverTimestamp,
	updateDoc,
	where,
	type QueryDocumentSnapshot,
} from 'firebase/firestore'
import { db } from '../config/firebase'
import type { CartItem } from '../types/cartItem.types'
import type { Order, OrderStatus } from '../types/order.types'

const ordersCollection = collection(db, 'orders')

function mapOrder(snapshot: QueryDocumentSnapshot): Order {
	return {
		id: snapshot.id,
		...snapshot.data(),
	} as Order
}

//* Crear una orden a partir del carrito:
export const createOrder = async (
	userId: string,
	items: CartItem[],
	total: number,
	discount?: { code: string; amount: number },
): Promise<string> => {
	const ref = await addDoc(ordersCollection, {
		userId,
		items,
		total,
		// Firestore rechaza campos con valor `undefined`: solo se
		// agregan si realmente hubo un código aplicado.
		...(discount ? { discountCode: discount.code, discountAmount: discount.amount } : {}),
		status: 'pending' satisfies OrderStatus,
		createdAt: serverTimestamp(),
		updatedAt: serverTimestamp(),
	})

	return ref.id
}

//* Historial de órdenes del usuario logueado:
export const getUserOrders = async (userId: string): Promise<Order[]> => {
	const q = query(
		ordersCollection,
		where('userId', '==', userId),
		orderBy('createdAt', 'desc'),
	)

	const snapshot = await getDocs(q)

	return snapshot.docs.map(mapOrder)
}

//* Detalle de una orden puntual:
export const getOrderById = async (id: string): Promise<Order | null> => {
	const snapshot = await getDoc(doc(db, 'orders', id))

	if (!snapshot.exists()) return null

	return mapOrder(snapshot)
}

//* Todas las órdenes (uso admin):
export const listAllOrders = async (): Promise<Order[]> => {
	const q = query(ordersCollection, orderBy('createdAt', 'desc'))
	const snapshot = await getDocs(q)

	return snapshot.docs.map(mapOrder)
}

//* Cambiar el estado de una orden (uso admin):
export const updateOrderStatus = async (id: string, status: OrderStatus): Promise<void> => {
	await updateDoc(doc(db, 'orders', id), {
		status,
		updatedAt: serverTimestamp(),
	})
}
