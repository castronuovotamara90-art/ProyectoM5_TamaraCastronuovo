import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../../config/firebase'
import {
	getUserProfile,
	signinService,
	signinWithGoogleService,
	signoutService,
	signupService,
} from '../../services/auth.service'
import { AuthContext } from './AuthContext'
import type { AuthUser } from '../../types/auth.types'

export function AuthProvider({ children }: { children: ReactNode }) {
	const [user, setUser] = useState<AuthUser | null>(null)
	const [loading, setLoading] = useState(true)

	// Se ejecuta una sola vez: registra el listener de Firebase y
	// devuelve unsubscribe para no dejar el listener colgado si el
	// provider se desmonta (patrón estándar para suscripciones externas).
	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
			// 1. No hay usuario logueado:
			if (!firebaseUser) {
				setUser(null)
				setLoading(false)
				return
			}

			// 2. Hay usuario logueado:
			const profile = await getUserProfile(firebaseUser.uid)
			setUser(profile)
			setLoading(false)
		})

		return unsubscribe
	}, [])

	// Ninguna de estas funciones llama a setUser directamente: el
	// estado del usuario se actualiza únicamente desde
	// onAuthStateChanged, para tener una sola fuente de verdad.
	const signin = useCallback(async (email: string, password: string) => {
		await signinService(email, password)
	}, [])

	const signup = useCallback(async (email: string, password: string) => {
		await signupService(email, password)
	}, [])

	const signout = useCallback(async () => {
		await signoutService()
	}, [])

	const signinWithGoogle = useCallback(async () => {
		await signinWithGoogleService()
	}, [])

	const value = useMemo(
		() => ({ user, loading, signin, signup, signout, signinWithGoogle }),
		[user, loading, signin, signup, signout, signinWithGoogle],
	)

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
