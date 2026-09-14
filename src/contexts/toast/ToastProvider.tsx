import { useCallback, useMemo, useState, type ReactNode } from 'react'
import { ToastContext } from './ToastContext'

interface ToastItem {
	id: number
	message: string
}

const TOAST_DURATION_MS = 3000

export function ToastProvider({ children }: { children: ReactNode }) {
	const [toasts, setToasts] = useState<ToastItem[]>([])

	const showToast = useCallback((message: string) => {
		const id = Date.now()
		setToasts((current) => [...current, { id, message }])

		window.setTimeout(() => {
			setToasts((current) => current.filter((toast) => toast.id !== id))
		}, TOAST_DURATION_MS)
	}, [])

	const value = useMemo(() => ({ showToast }), [showToast])

	return (
		<ToastContext.Provider value={value}>
			{children}

			<div className="toast-container">
				{toasts.map((toast) => (
					<div key={toast.id} className="toast" role="status">
						{toast.message}
					</div>
				))}
			</div>
		</ToastContext.Provider>
	)
}
