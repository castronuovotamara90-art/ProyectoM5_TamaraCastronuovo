import type { ReactNode } from 'react'

type TitleProps = {
	children: ReactNode
}

function Title({ children }: TitleProps) {
	return <h1 className="app-title">
			{children}
		</h1>
}

export default Title
