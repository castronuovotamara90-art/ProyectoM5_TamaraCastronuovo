import { useState, type ChangeEvent } from 'react'
import Button from '../layouts/ui/buttons'
import { uploadImage } from '../../services/upload.service'

interface ImageUploaderProps {
	// Si se pasa, además de mostrar su propia preview, avisa al padre
	// (por ejemplo un ProductForm) con la URL final de S3.
	onUploaded?: (url: string) => void
}

export function ImageUploader({ onUploaded }: ImageUploaderProps = {}) {
	const [file, setFile] = useState<File | null>(null)
	const [uploading, setUploading] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [uploadedUrl, setUploadedUrl] = useState<string | null>(null)

	const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
		setUploadedUrl(null)
		setError(null)
		setFile(event.target.files?.[0] ?? null)
	}

	const handleUpload = async () => {
		if (!file) return

		setUploading(true)
		setError(null)

		try {
			const url = await uploadImage(file)
			setUploadedUrl(url)
			onUploaded?.(url)
		} catch (err) {
			setError(err instanceof Error ? err.message : 'No se pudo subir la imagen.')
		} finally {
			setUploading(false)
		}
	}

	return (
		<div className="flex flex-col items-center gap-2">
			<input
				type="file"
				accept="image/png, image/jpeg, image/webp"
				onChange={handleFileChange}
			/>

			<Button type="button" onClick={handleUpload} disabled={!file || uploading}>
				{uploading ? 'Subiendo...' : 'Subir imagen'}
			</Button>

			{error && <p role="alert">{error}</p>}

			{uploadedUrl && (
				<div className="flex flex-col items-center gap-2">
					<img
						src={uploadedUrl}
						alt="Imagen subida"
						className="h-32 w-32 rounded-md object-cover"
					/>
					{!onUploaded && (
						<code className="max-w-full break-all text-sm">{uploadedUrl}</code>
					)}
				</div>
			)}
		</div>
	)
}
