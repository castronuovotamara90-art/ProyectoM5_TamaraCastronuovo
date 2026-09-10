interface EmptyStateProps {
	title: string
	description?: string
}

export function EmptyState({ title, description }: EmptyStateProps) {
	return (
		<div className="flex flex-col items-center gap-1">
			<p>{title}</p>
			{description && <p>{description}</p>}
		</div>
	)
}
