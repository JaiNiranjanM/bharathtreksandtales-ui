export interface Coupon {
    code: string;
    discountPercent: number;
    description: string;
    active: boolean;
}
export declare const coupons: Coupon[];
export declare function validateCoupon(code: string): Coupon | null;
//# sourceMappingURL=coupons.d.ts.map