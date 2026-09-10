import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { ThemeContext } from './ThemeContext'
import type { Theme } from './ThemeContext.types'

//* Provider:
export const ThemeProvider = ({ children }: { children: ReactNode }) => {
	const [theme, setTheme] = useState<Theme>(() =>
		window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
	)

	useEffect(() => {
		document.documentElement.dataset.theme = theme
	}, [theme])

	const toggleTheme = () => {
		setTheme((currentTheme) => (currentTheme === 'dark' ? 'light' : 'dark'))
	}

	const value = useMemo(() => ({ theme, toggleTheme }), [theme])

	return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
