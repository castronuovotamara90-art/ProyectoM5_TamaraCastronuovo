export type CouponType = 'percentage' | 'fixed'

export interface Coupon {
	code: string
	type: CouponType
	value: number
	minPurchase?: number
	active: boolean
}
