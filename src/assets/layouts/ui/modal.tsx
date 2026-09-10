import { useEffect } from 'react'
import type { ReactNode } from 'react'

interface ModalProps {
	isOpen: boolean
	onClose: () => void
	children: ReactNode
}

function Modal({ isOpen, onClose, children }: ModalProps) {
	// Cerrar con Escape. El listener se registra/limpia según isOpen
	// para no escuchar teclas cuando el modal ni siquiera está abierto.
	useEffect(() => {
		if (!isOpen) return

		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'Escape') onClose()
		}

		document.addEventListener('keydown', handleKeyDown)
		return () => document.removeEventListener('keydown', handleKeyDown)
	}, [isOpen, onClose])

	if (!isOpen) return null

	return (
		<div className="modal-backdrop" onClick={onClose}>
			<div
				className="modal-content"
				role="dialog"
				aria-modal="true"
				// Frena la propagación para que clickear adentro del modal
				// no dispare el onClose del backdrop.
				onClick={(event) => event.stopPropagation()}
			>
				{children}
			</div>
		</div>
	)
}

export default Modal
