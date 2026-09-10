import type { ReactNode } from 'react'
import { ThemeProvider } from './theme'
import { AuthProvider } from './auth'
import { ProductsProvider } from './products'
import { CartProvider } from './cart'

// El orden importa: CartProvider depende de los Product que expone
// ProductsProvider, por eso ProductsProvider va primero. ThemeProvider
// y AuthProvider no dependen de nada, pueden ir afuera de todo.
export const AppProviders = ({ children }: { children: ReactNode }) => {
	return (
		<ThemeProvider>
			<AuthProvider>
				<ProductsProvider>
					<CartProvider>{children}</CartProvider>
				</ProductsProvider>
			</AuthProvider>
		</ThemeProvider>
	)
}
