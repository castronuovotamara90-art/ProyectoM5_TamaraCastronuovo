export type Role = 'customer' | 'admin'

export interface AuthUser {
	uid: string
	email: string
	role: Role
}
