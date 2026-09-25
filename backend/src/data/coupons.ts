// ─── Coupon Registry ─────────────────────────────────────────────────────────
// Server-side coupon definitions. Never sent to the client directly.

export interface Coupon {
  code: string;
  discountPercent: number;
  description: string;
  active: boolean;
}

export const coupons: Coupon[] = [
  {
    code: "TREK5",
    discountPercent: 5,
    description: "5% off on any trek",
    active: true,
  },
  {
    code: "BTT10",
    discountPercent: 10,
    description: "10% off — loyal explorer discount",
    active: true,
  },
  {
    code: "FIRST15",
    discountPercent: 15,
    description: "15% off for your first booking",
    active: true,
  },
  {
    code: "SPIRITUAL8",
    discountPercent: 8,
    description: "8% off on spiritual tours",
    active: true,
  },
];

export function validateCoupon(code: string): Coupon | null {
  const coupon = coupons.find(
    (c) => c.code.toUpperCase() === code.toUpperCase() && c.active
  );
  return coupon ?? null;
}
