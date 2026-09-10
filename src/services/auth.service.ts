import {
	createUserWithEmailAndPassword,
	GoogleAuthProvider,
	signInWithEmailAndPassword,
	signInWithPopup,
	signOut,
} from 'firebase/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { auth, db } from '../config/firebase'
import type { AuthUser } from '../types/auth.types'

// Provider de Google
const googleProvider = new GoogleAuthProvider()

//* SIGNUP EMAIL/PASSWORD:
export const signupService = async (email: string, password: string) => {
	const credentials = await createUserWithEmailAndPassword(auth, email, password)

	//* Guardamos rol de usuario en Firestore:
	const uid = credentials.user.uid
	await setDoc(doc(db, 'users', uid), {
		email,
		role: 'customer',
	})
}

//* LOGIN EMAIL/PASSWORD:
export const signinService = async (email: string, password: string) => {
	await signInWithEmailAndPassword(auth, email, password)
}

//* LOGIN GOOGLE:
export const signinWithGoogleService = async () => {
	const credentials = await signInWithPopup(auth, googleProvider)
	const user = credentials.user

	// Referencia al usuario
	const userRef = doc(db, 'users', user.uid)
	const snapshot = await getDoc(userRef)

	// Si es primer login, creamos su documento con rol por defecto.
	if (!snapshot.exists()) {
		await setDoc(userRef, {
			email: user.email,
			role: 'customer',
		})
	}
}

//* LOGOUT:
export const signoutService = async () => {
	await signOut(auth)
}

//* OBTENER PERFIL:
export const getUserProfile = async (uid: string): Promise<AuthUser | null> => {
	const snapshot = await getDoc(doc(db, 'users', uid))

	if (!snapshot.exists()) {
		return null
	}

	const data = snapshot.data()

	return {
		uid,
		email: data.email,
		role: data.role,
	}
}
