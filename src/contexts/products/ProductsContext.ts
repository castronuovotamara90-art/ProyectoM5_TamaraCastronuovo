import { createContext } from 'react'
import type { ProductContextType } from './ProductContext.types'

//* Context:
export const ProductsContext = createContext<ProductContextType | undefined>(undefined)
