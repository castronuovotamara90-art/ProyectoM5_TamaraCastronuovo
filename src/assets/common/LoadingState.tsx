import Spinner from '../layouts/ui/spinner'

interface LoadingStateProps {
	message?: string
}

export function LoadingState({ message = 'Cargando...' }: LoadingStateProps) {
	return (
		<div className="flex flex-col items-center gap-2">
			<Spinner />
			<p>{message}</p>
		</div>
	)
}
