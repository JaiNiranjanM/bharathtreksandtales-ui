"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const zod_1 = require("zod");
const db_1 = __importDefault(require("../db"));
const errorHandler_1 = require("../middleware/errorHandler");
const router = (0, express_1.Router)();
const ValidateCouponSchema = zod_1.z.object({
    code: zod_1.z.string().min(1, "Coupon code is required"),
    packageSlug: zod_1.z.string().optional(),
});
// ─── POST /api/coupons/validate ───────────────────────────────────────────────
router.post("/validate", (req, res, next) => {
    try {
        const parseResult = ValidateCouponSchema.safeParse(req.body);
        if (!parseResult.success) {
            return next((0, errorHandler_1.createError)(parseResult.error.issues[0].message, 400));
        }
        const { code } = parseResult.data;
        const coupon = db_1.default
            .prepare("SELECT * FROM coupons WHERE UPPER(code) = UPPER(?) AND active = 1")
            .get(code);
        if (!coupon) {
            return res.status(200).json({
                success: true,
                valid: false,
                message: "Invalid or expired coupon code.",
            });
        }
        res.json({
            success: true,
            valid: true,
            discountPercent: coupon.discount_percent,
            message: `${coupon.description} applied!`,
        });
    }
    catch (err) {
        next(err);
    }
});
exports.default = router;
//# sourceMappingURL=coupons.js.map