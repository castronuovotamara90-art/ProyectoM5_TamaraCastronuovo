import type { ReactNode } from 'react'
import { ThemeProvider } from './theme'
import { AuthProvider } from './auth'
import { ProductsProvider } from './products'
import { CartProvider } from './cart'
import { FavoritesProvider } from './favorites'
import { ToastProvider } from './toast'

// El orden importa: CartProvider depende de los Product que expone
// ProductsProvider, por eso ProductsProvider va primero. ThemeProvider,
// AuthProvider, FavoritesProvider y ToastProvider no dependen de nada,
// pueden ir afuera de todo.
export const AppProviders = ({ children }: { children: ReactNode }) => {
	return (
		<ThemeProvider>
			<AuthProvider>
				<ToastProvider>
					<FavoritesProvider>
						<ProductsProvider>
							<CartProvider>{children}</CartProvider>
						</ProductsProvider>
					</FavoritesProvider>
				</ToastProvider>
			</AuthProvider>
		</ThemeProvider>
	)
}
