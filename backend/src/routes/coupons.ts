import { Router, type Request, type Response, type NextFunction } from "express";
import { z } from "zod";
import db from "../db";
import { createError } from "../middleware/errorHandler";

const router = Router();

const ValidateCouponSchema = z.object({
  code: z.string().min(1, "Coupon code is required"),
  packageSlug: z.string().optional(),
});

// ─── POST /api/coupons/validate ───────────────────────────────────────────────
router.post("/validate", (req: Request, res: Response, next: NextFunction) => {
  try {
    const parseResult = ValidateCouponSchema.safeParse(req.body);
    if (!parseResult.success) {
      return next(createError(parseResult.error.issues[0].message, 400));
    }

    const { code } = parseResult.data;

    const coupon = db
      .prepare("SELECT * FROM coupons WHERE UPPER(code) = UPPER(?) AND active = 1")
      .get(code) as { code: string; discount_percent: number; description: string; active: number } | undefined;

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
  } catch (err) {
    next(err);
  }
});

export default router;
