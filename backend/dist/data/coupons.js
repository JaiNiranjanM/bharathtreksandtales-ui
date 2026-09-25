"use strict";
// ─── Coupon Registry ─────────────────────────────────────────────────────────
// Server-side coupon definitions. Never sent to the client directly.
Object.defineProperty(exports, "__esModule", { value: true });
exports.coupons = void 0;
exports.validateCoupon = validateCoupon;
exports.coupons = [
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
function validateCoupon(code) {
    const coupon = exports.coupons.find((c) => c.code.toUpperCase() === code.toUpperCase() && c.active);
    return coupon ?? null;
}
//# sourceMappingURL=coupons.js.map