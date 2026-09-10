import { useContext } from 'react'
import { CartContext } from './CartContext'

// La API pública para el resto de la app es useCart, no CartContext
// directo: si cambia la implementación interna, los componentes que
// llaman a useCart() no se enteran.
export function useCart() {
	const context = useContext(CartContext)

	if (!context) {
		throw new Error('useCart debe usarse dentro de un CartProvider')
	}

	return context
}
