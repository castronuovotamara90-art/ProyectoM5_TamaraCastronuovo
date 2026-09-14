import type { VercelRequest, VercelResponse } from '@vercel/node'
import { cert, getApps, initializeApp } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import type { CouponType } from '../src/types/coupon.types.ts'

// Firebase Admin: las reglas de Firestore bloquean la lectura directa
// de "coupons" desde el cliente (así nadie puede listar códigos
// activos abriendo la consola del navegador). Solo esta función, con
// credenciales de servidor, puede leerlos.
if (getApps().length === 0) {
	initializeApp({
		credential: cert({
			projectId: process.env.FIREBASE_PROJECT_ID,
			clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
			privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
		}),
	})
}

type CouponDoc = {
	type: CouponType
	value: number
	minPurchase?: number
	active: boolean
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
	if (req.method !== 'POST') {
		return res.status(405).json({ error: 'Method not allowed' })
	}

	const { code, subtotal } = req.body as { code?: string; subtotal?: number }

	if (!code || typeof subtotal !== 'number' || subtotal < 0) {
		return res.status(400).json({ error: 'Faltan datos (código o subtotal)' })
	}

	// Los códigos se guardan en mayúsculas: normalizamos acá para que
	// "bienvenida10" y "BIENVENIDA10" encuentren el mismo documento.
	const normalizedCode = code.trim().toUpperCase()

	const snapshot = await getFirestore().collection('coupons').doc(normalizedCode).get()

	if (!snapshot.exists) {
		return res.status(200).json({ valid: false, message: 'El código no existe' })
	}

	const coupon = snapshot.data() as CouponDoc

	if (!coupon.active) {
		return res.status(200).json({ valid: false, message: 'Este código ya no está activo' })
	}

	if (typeof coupon.minPurchase === 'number' && subtotal < coupon.minPurchase) {
		return res.status(200).json({
			valid: false,
			message: `Necesitás un mínimo de compra de $${coupon.minPurchase} para usar este código`,
		})
	}

	return res.status(200).json({
		valid: true,
		code: normalizedCode,
		type: coupon.type,
		value: coupon.value,
		message: 'Código aplicado correctamente',
	})
}
