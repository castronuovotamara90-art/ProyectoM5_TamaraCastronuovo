import {
	collection,
	doc,
	endAt,
	getDoc,
	getDocs,
	limit,
	orderBy,
	query,
	startAfter,
	startAt,
	where,
	type DocumentSnapshot,
	type QueryConstraint,
	type QueryDocumentSnapshot,
} from 'firebase/firestore'
import { db } from '../config/firebase'
import type { CategoryId, Product } from '../types/product.types'

const productsCollection = collection(db, 'products')

function mapProduct(snapshot: QueryDocumentSnapshot): Product {
	return {
		id: snapshot.id,
		...snapshot.data(),
	} as Product
}

//* Obtener un producto por ID:
export const getProductById = async (id: string): Promise<Product | null> => {
	const ref = doc(db, 'products', id)
	const snapshot = await getDoc(ref)

	if (!snapshot.exists()) return null

	return mapProduct(snapshot)
}

//* ===== FILTRADO Y ORDENAMIENTO DE PRODUCTOS =====
export type ListProductsParams = {
	categoryId?: CategoryId | null
	searchPrefix?: string // lowercase
	pageSize?: number
	cursor?: DocumentSnapshot | null
}

export type ListProductsResult = {
	items: Product[]
	lastDoc: DocumentSnapshot | null
}

export async function listProducts(
	params: ListProductsParams = {},
): Promise<ListProductsResult> {
	const { categoryId, searchPrefix, pageSize = 20, cursor } = params

	//* Array de restricciones de la consulta:
	const constraints: QueryConstraint[] = []

	//* Filtros dinámicos:
	if (categoryId) {
		constraints.push(where('categoryId', '==', categoryId))
	}

	//* Orden requerido por Firestore al utilizar cursores de paginación:
	constraints.push(orderBy('nameLower'))

	//* constraints: [ where("categoryId" === "dormitorio"), orderBy("nameLower"), ... ]
	//* Búsqueda por prefijo:
	if (searchPrefix && searchPrefix.length >= 2) {
		constraints.push(startAt(searchPrefix))
		constraints.push(endAt(searchPrefix + '\uf8ff'))
	}

	//* Paginación, utilizando cursores a documentos reales:
	if (cursor) {
		constraints.push(startAfter(cursor))
	}

	constraints.push(limit(pageSize))

	const productsQuery = query(productsCollection, ...constraints)

	//* Ejecutar consulta a Firestore:
	const snapshot = await getDocs(productsQuery)

	//* Convertir documentos de Firestore a Product:
	const items = snapshot.docs.map(mapProduct)

	//* Cursor para la siguiente página:
	const lastDoc =
		snapshot.docs.length > 0 ? snapshot.docs[snapshot.docs.length - 1] : null

	return {
		items, // Listado de productos
		lastDoc, // Último producto enviado
	}
}
