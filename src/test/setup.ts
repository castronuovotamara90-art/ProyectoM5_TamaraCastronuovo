import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'

// Sin `globals: true` en la config de vitest, React Testing Library no
// engancha su cleanup automático al afterEach global — hay que
// registrarlo a mano, si no el DOM de un test queda montado para el
// siguiente (ej: dos botones "Eliminar" en vez de uno).
afterEach(cleanup)
