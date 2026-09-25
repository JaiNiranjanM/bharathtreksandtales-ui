import { BASE_URL } from "./api";

export interface CouponValidationResult {
  valid: boolean;
  discountPercent?: number;
  message: string;
}

export async function validateCoupon(
  code: string,
  packageSlug?: string
): Promise<CouponValidationResult> {
  const res = await fetch(`${BASE_URL}/api/coupons/validate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code, packageSlug }),
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.error ?? "Coupon validation failed.");
  }

  return {
    valid: json.valid,
    discountPercent: json.discountPercent,
    message: json.message,
  };
}
