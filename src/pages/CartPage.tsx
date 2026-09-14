import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../assets/layouts/ui/buttons'
import Modal from '../assets/layouts/ui/modal'
import { CartList } from '../assets/common/CartList'
import { useCart } from '../contexts/cart'
import { formatPrice } from '../utils/money'

export function CartPage() {
	const {
		items,
		subtotal,
		discountCode,
		discountAmount,
		total,
		removeItem,
		updateQuantity,
		clearCart,
		applyDiscountCode,
		removeDiscountCode,
	} = useCart()
	const [isConfirmOpen, setIsConfirmOpen] = useState(false)
	const [couponInput, setCouponInput] = useState('')
	const [couponMessage, setCouponMessage] = useState<{ text: string; ok: boolean } | null>(null)
	const [applyingCoupon, setApplyingCoupon] = useState(false)
	const navigate = useNavigate()

	const handleConfirmClear = () => {
		clearCart()
		setIsConfirmOpen(false)
	}

	const handleApplyCoupon = async () => {
		if (!couponInput.trim()) return

		setApplyingCoupon(true)
		setCouponMessage(null)

		const result = await applyDiscountCode(couponInput.trim())

		setCouponMessage({ text: result.message, ok: result.success })
		setApplyingCoupon(false)
		if (result.success) setCouponInput('')
	}

	const handleRemoveCoupon = () => {
		removeDiscountCode()
		setCouponMessage(null)
	}

	return (
		<>
			<h2>Items en el carrito</h2>

			{items.length === 0 ? (
				<p>No hay productos en el carrito</p>
			) : (
				<>
					<CartList items={items} onRemove={removeItem} onUpdateQuantity={updateQuantity} />

					{discountCode ? (
						<div className="mb-2 flex flex-wrap items-center gap-2">
							<span>
								Código <strong>{discountCode}</strong> aplicado (-${formatPrice(discountAmount)})
							</span>
							<Button variant="danger" type="button" onClick={handleRemoveCoupon}>
								Quitar código
							</Button>
						</div>
					) : (
						<div className="mb-2 flex flex-wrap items-center gap-2">
							<input
								type="text"
								value={couponInput}
								onChange={(event) => setCouponInput(event.target.value)}
								placeholder="Código de descuento"
							/>
							<Button type="button" onClick={handleApplyCoupon} disabled={applyingCoupon}>
								{applyingCoupon ? 'Validando...' : 'Aplicar código'}
							</Button>
						</div>
					)}

					{couponMessage && <p role="alert">{couponMessage.text}</p>}

					<p>Subtotal: ${formatPrice(subtotal)}</p>
					{discountCode && <p>Descuento: -${formatPrice(discountAmount)}</p>}
					<p>Total: ${formatPrice(total)}</p>

					<Button variant="danger" type="button" onClick={() => setIsConfirmOpen(true)}>
						Limpiar carrito
					</Button>

					<Button type="button" onClick={() => navigate('/checkout')}>
						Ir a pagar
					</Button>
				</>
			)}

			<Modal isOpen={isConfirmOpen} onClose={() => setIsConfirmOpen(false)}>
				<div className="flex items-start justify-between gap-4">
					<h2>Vaciar el carrito</h2>
					<Button
						variant="icon"
						type="button"
						aria-label="Cerrar"
						icon={<span aria-hidden="true">✕</span>}
						onClick={() => setIsConfirmOpen(false)}
					/>
				</div>
				<p>¿Seguro que querés eliminar todos los productos del carrito?</p>
				<div className="flex justify-end gap-2 mt-4">
					<Button type="button" onClick={() => setIsConfirmOpen(false)}>
						Cancelar
					</Button>
					<Button variant="danger" type="button" onClick={handleConfirmClear}>
						Sí, vaciar
					</Button>
				</div>
			</Modal>
		</>
	)
}
