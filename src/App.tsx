import { useEffect, useState } from 'react'
import Button from './assets/layouts/ui/buttons'
import Title from './assets/layouts/ui/title'

function App() {
    const [isDark, setIsDark] = useState(() =>
        window.matchMedia('(prefers-color-scheme: dark)').matches,
    )

    useEffect(() => {
        document.documentElement.dataset.theme = isDark ? 'dark' : 'light'
    }, [isDark])

    return (
        <main className="app-shell">
            <Title>HENRY-Commerce</Title>

            <Button
                className="theme-toggle"
                type="button"
                aria-pressed={isDark}
                onClick={() => setIsDark((currentTheme) => !currentTheme)}
            >
                Modo: {isDark ? 'Oscuro 🌙' : 'Claro ☀️'}
            </Button>
        </main>
    )
}

export default App