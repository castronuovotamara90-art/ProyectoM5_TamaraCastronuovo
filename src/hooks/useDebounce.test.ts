import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useDebounce } from './useDebounce'

describe('useDebounce', () => {
	beforeEach(() => {
		vi.useFakeTimers()
	})

	afterEach(() => {
		vi.useRealTimers()
	})

	it('devuelve el valor inicial de inmediato', () => {
		const { result } = renderHook(() => useDebounce('a', 400))

		expect(result.current).toBe('a')
	})

	it('no actualiza el valor antes de que pase el delay', () => {
		const { result, rerender } = renderHook(({ value }) => useDebounce(value, 400), {
			initialProps: { value: 'a' },
		})

		rerender({ value: 'ab' })
		act(() => {
			vi.advanceTimersByTime(399)
		})

		expect(result.current).toBe('a')
	})

	it('actualiza el valor una vez pasado el delay', () => {
		const { result, rerender } = renderHook(({ value }) => useDebounce(value, 400), {
			initialProps: { value: 'a' },
		})

		rerender({ value: 'ab' })
		act(() => {
			vi.advanceTimersByTime(400)
		})

		expect(result.current).toBe('ab')
	})

	it('reinicia el timer si el valor cambia antes de que se cumpla el delay', () => {
		const { result, rerender } = renderHook(({ value }) => useDebounce(value, 400), {
			initialProps: { value: 'a' },
		})

		rerender({ value: 'ab' })
		act(() => {
			vi.advanceTimersByTime(300)
		})
		// Todavía no pasó el delay completo: llega un nuevo cambio y reinicia el timer.
		rerender({ value: 'abc' })
		act(() => {
			vi.advanceTimersByTime(300)
		})

		// Pasaron 600ms en total, pero solo 300ms desde el último cambio.
		expect(result.current).toBe('a')

		act(() => {
			vi.advanceTimersByTime(100)
		})

		expect(result.current).toBe('abc')
	})
})
