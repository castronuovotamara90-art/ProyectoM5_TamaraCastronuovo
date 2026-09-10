import type { ButtonHTMLAttributes, ReactNode } from 'react'

type BaseProps = ButtonHTMLAttributes<HTMLButtonElement>

// Botón "normal": necesita texto (children). El aria-label es opcional
// porque el texto visible ya describe la acción.
type LabeledButtonProps = BaseProps & {
	variant?: 'primary' | 'danger'
	children: ReactNode
}

// Botón solo-ícono: no tiene texto visible, así que TypeScript obliga
// a pasar aria-label (si no, un lector de pantalla no sabría qué hace).
type IconButtonProps = BaseProps & {
	variant: 'icon'
	icon: ReactNode
	'aria-label': string
}

type ButtonProps = LabeledButtonProps | IconButtonProps

function Button(props: ButtonProps) {
	// Chequear "variant === 'icon'" es lo que hace que TypeScript
	// "angoste" el tipo de `props`: dentro de este bloque, props es
	// IconButtonProps (con `icon` y `aria-label` garantizados).
	if (props.variant === 'icon') {
		const { icon, className, variant, ...rest } = props

		return (
			<button
				{...rest}
				data-variant={variant}
				className={`ui-button ui-button--icon${className ? ` ${className}` : ''}`}
			>
				{icon}
			</button>
		)
	}

	// Acá abajo, TypeScript ya sabe que props es LabeledButtonProps.
	const { children, variant, className, ...rest } = props

	return (
		<button
			{...rest}
			data-variant={variant ?? 'primary'}
			className={`ui-button${variant === 'danger' ? ' ui-button--danger' : ''}${
				className ? ` ${className}` : ''
			}`}
		>
			{children}
		</button>
	)
}

export default Button
