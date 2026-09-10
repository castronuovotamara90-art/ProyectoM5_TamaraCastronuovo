import { createContext } from 'react'
import type { ThemeContextType } from './ThemeContext.types'

//* Context:
export const ThemeContext = createContext<ThemeContextType | undefined>(undefined)
