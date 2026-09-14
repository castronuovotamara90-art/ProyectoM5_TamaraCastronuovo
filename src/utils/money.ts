// La aritmética de punto flotante de JS puede dar resultados como
// 189.95000000000002 al sumar precios (0.1 + 0.2 !== 0.3). roundMoney
// se usa al calcular montos (para no arrastrar el error de un cálculo
// al siguiente); formatPrice, al mostrarlos (siempre 2 decimales).

export function roundMoney(amount: number): number {
	return Math.round(amount * 100) / 100
}

export function formatPrice(amount: number): string {
	return amount.toFixed(2)
}
