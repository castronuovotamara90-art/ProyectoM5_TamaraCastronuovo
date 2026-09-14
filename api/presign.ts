import { randomUUID } from 'node:crypto'
import type { VercelRequest, VercelResponse } from '@vercel/node'
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { cert, getApps, initializeApp } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import { getFirestore } from 'firebase-admin/firestore'

//* Credenciales de AWS y Bucket (Conecta con AWS):
const s3 = new S3Client({
	region: process.env.AWS_REGION!,
	credentials: {
		accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
		secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
	},
})

const BUCKET = process.env.S3_BUCKET!

// Firebase Admin se inicializa una sola vez: Vercel reutiliza la
// misma instancia de la función entre invocaciones "en caliente", y
// initializeApp() vuelve a llamarse tira error si ya existe una app.
if (getApps().length === 0) {
	initializeApp({
		credential: cert({
			projectId: process.env.FIREBASE_PROJECT_ID,
			clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
			privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
		}),
	})
}

//* Formatos y tamaño permitidos:
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5 MB

// Solo letras/números/puntos/guiones: corta cualquier intento de
// path traversal (../, /, etc.) metido en el nombre del archivo.
function sanitizeFilename(filename: string): string {
	return filename.replace(/[^a-zA-Z0-9._-]/g, '_').slice(-100)
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
	// Solo permitimos POST:
	if (req.method !== 'POST') {
		return res.status(405).json({
			error: 'Method not allowed',
		})
	}

	//* Autenticación: exigimos un ID token de Firebase válido.
	const authHeader = req.headers.authorization
	const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null

	if (!token) {
		return res.status(401).json({ error: 'Falta el token de autenticación' })
	}

	let uid: string

	try {
		const decoded = await getAuth().verifyIdToken(token)
		uid = decoded.uid
	} catch {
		return res.status(401).json({ error: 'Token inválido o expirado' })
	}

	//* Autorización: solo un usuario con role "admin" puede subir imágenes.
	const userDoc = await getFirestore().collection('users').doc(uid).get()

	if (!userDoc.exists || userDoc.data()?.role !== 'admin') {
		return res.status(403).json({ error: 'No tenés permiso para subir imágenes' })
	}

	const { filename, contentType, fileSize } = req.body as {
		filename: string
		contentType: string
		fileSize?: number
	}

	if (!ALLOWED_TYPES.includes(contentType)) {
		return res.status(400).json({
			error: 'File type not allowed',
		})
	}

	if (typeof fileSize === 'number' && fileSize > MAX_FILE_SIZE) {
		return res.status(400).json({
			error: 'El archivo supera el tamaño máximo permitido (5MB)',
		})
	}

	//* Generamos path único, para no pisar archivos con el mismo nombre:
	const key = `products/${randomUUID()}-${sanitizeFilename(filename)}`

	try {
		const url = await getSignedUrl(
			s3,
			new PutObjectCommand({
				Bucket: BUCKET,
				Key: key,
				ContentType: contentType,
			}),
			{
				expiresIn: 60,
			},
		)

		const publicUrl = `https://${BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`

		return res.status(200).json({
			url,
			key,
			publicUrl,
		})
	} catch (error) {
		console.error('[presign] failed', error)

		return res.status(500).json({
			error: 'No se pudo generar la URL firmada',
		})
	}
}
