import Button from '../layouts/ui/buttons'

interface ErrorStateProps {
	message: string
	onRetry: () => void
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
	return (
		<div role="alert" className="flex flex-col items-center gap-2">
			<p>Error: {message}</p>
			<Button type="button" onClick={onRetry}>
				Reintentar
			</Button>
		</div>
	)
}
