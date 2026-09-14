import { auth } from '../config/firebase'

interface PresignResponse {
	url: string
	key: string
	publicUrl: string
}

// Sube una imagen a S3 en dos pasos:
// 1. Le pedimos a nuestra propia API (/api/presign) una URL firmada,
//    mandando nuestro ID token de Firebase (el servidor verifica que
//    seamos admin antes de firmar nada — el secreto de AWS nunca
//    sale de ese servidor).
// 2. Con esa URL, subimos el archivo directo a S3 desde el navegador.
export const uploadImage = async (file: File): Promise<string> => {
	const currentUser = auth.currentUser

	if (!currentUser) {
		throw new Error('Necesitás iniciar sesión para subir imágenes.')
	}

	const token = await currentUser.getIdToken()

	const presignResponse = await fetch('/api/presign', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify({
			filename: file.name,
			contentType: file.type,
			fileSize: file.size,
		}),
	})

	if (!presignResponse.ok) {
		const body = await presignResponse.json().catch(() => null)
		throw new Error(body?.error ?? 'No se pudo obtener la URL firmada')
	}

	const { url, publicUrl }: PresignResponse = await presignResponse.json()

	const uploadResponse = await fetch(url, {
		method: 'PUT',
		headers: { 'Content-Type': file.type },
		body: file,
	})

	if (!uploadResponse.ok) {
		throw new Error('No se pudo subir la imagen a S3')
	}

	return publicUrl
}
