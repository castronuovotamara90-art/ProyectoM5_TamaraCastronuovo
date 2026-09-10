import type { AuthUser } from '../../types/auth.types'

export interface AuthContextValue {
	user: AuthUser | null
	loading: boolean
	signin: (email: string, password: string) => Promise<void>
	signup: (email: string, password: string) => Promise<void>
	signout: () => Promise<void>
	signinWithGoogle: () => Promise<void>
}
