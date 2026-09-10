import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../assets/layouts/ui/buttons'
import { useAuth } from '../contexts/auth'
import { getAuthErrorMessage } from '../utils/authErrors'

function getErrorCode(err: unknown): string {
	return err instanceof Error && 'code' in err ? String(err.code) : ''
}

export function LoginPage() {
	const { signin, signup, signinWithGoogle } = useAuth()
	const navigate = useNavigate()

	const [mode, setMode] = useState<'signin' | 'signup'>('signin')
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [error, setError] = useState<string | null>(null)
	const [submitting, setSubmitting] = useState(false)

	const handleSubmit = async (event: FormEvent) => {
		event.preventDefault()
		setError(null)
		setSubmitting(true)

		try {
			if (mode === 'signin') {
				await signin(email, password)
			} else {
				await signup(email, password)
			}

			navigate('/')
		} catch (err) {
			setError(getAuthErrorMessage(getErrorCode(err)))
		} finally {
			setSubmitting(false)
		}
	}

	const handleGoogle = async () => {
		setError(null)
		setSubmitting(true)

		try {
			await signinWithGoogle()
			navigate('/')
		} catch (err) {
			setError(getAuthErrorMessage(getErrorCode(err)))
		} finally {
			setSubmitting(false)
		}
	}

	return (
		<div className="flex flex-col items-center gap-4">
			<h1>{mode === 'signin' ? 'Iniciar sesión' : 'Crear cuenta'}</h1>

			<form onSubmit={handleSubmit} className="flex flex-col gap-2">
				<input
					type="email"
					value={email}
					onChange={(event) => setEmail(event.target.value)}
					placeholder="Email"
					required
					disabled={submitting}
				/>

				<input
					type="password"
					value={password}
					onChange={(event) => setPassword(event.target.value)}
					placeholder="Contraseña"
					required
					disabled={submitting}
				/>

				{error && <p role="alert">{error}</p>}

				<Button type="submit" disabled={submitting}>
					{submitting ? 'Enviando...' : mode === 'signin' ? 'Ingresar' : 'Registrarme'}
				</Button>
			</form>

			<Button type="button" onClick={handleGoogle} disabled={submitting}>
				Continuar con Google
			</Button>

			<Button
				type="button"
				onClick={() => setMode((current) => (current === 'signin' ? 'signup' : 'signin'))}
			>
				{mode === 'signin' ? '¿No tenés cuenta? Registrate' : '¿Ya tenés cuenta? Ingresá'}
			</Button>
		</div>
	)
}
