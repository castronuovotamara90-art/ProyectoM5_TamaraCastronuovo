import { useContext } from 'react'
import { ThemeContext } from './ThemeContext'

//* Hook:
export const useTheme = () => {
	const context = useContext(ThemeContext)

	if (!context) {
		throw new Error('useTheme debe usarse dentro de un ThemeProvider')
	}

	return context
}
