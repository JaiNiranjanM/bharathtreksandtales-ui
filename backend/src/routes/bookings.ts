import { Router, type Request, type Response, type NextFunction } from "express";
import jwt from "jsonwebtoken";
import { z } from "zod";
import db from "../db";
import { createError } from "../middleware/errorHandler";

const JWT_SECRET = process.env.JWT_SECRET ?? "btt-dev-secret-change-in-production";

const router = Router();

// ─── Booking request schema ───────────────────────────────────────────────────
// phone now accepts E.164 with optional country code: +91XXXXXXXXXX or plain digits
const BookingSchema = z.object({
  packageSlug: z.string().min(1),
  seats: z.number().int().min(1).max(20),
  date: z.string().min(1),
  pickupLocation: z.string().min(1),
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(6).max(20).refine((v) => /^\+?\d{7,15}$/.test(v.replace(/[\s-]/g, "")), "Enter a valid phone number"),
  phoneCode: z.string().regex(/^\+\d{1,4}$/).optional(),
  couponCode: z.string().optional(),
  specialRequests: z.string().optional(),
});

function generateRef(): string {
  return `BTT-${Date.now().toString(36).toUpperCase()}-${Math.random()
    .toString(36)
    .slice(2, 6)
    .toUpperCase()}`;
}

// ─── POST /api/bookings ───────────────────────────────────────────────────────
router.post("/", (req: Request, res: Response, next: NextFunction) => {
  try {
    const parseResult = BookingSchema.safeParse(req.body);
    if (!parseResult.success) {
      return next(
        createError(
          parseResult.error.issues.map((i) => i.message).join(", "),
          400
        )
      );
    }

    const data = parseResult.data;

    const pkg: any = db.prepare("SELECT * FROM packages WHERE slug = ?").get(data.packageSlug);
    if (!pkg) return next(createError("Package not found", 404));

    if (data.seats > pkg.seats_left) {
      return next(createError(`Only ${pkg.seats_left} seat(s) available`, 400));
    }

    let discountPercent = 0;
    if (data.couponCode) {
      const coupon: any = db.prepare("SELECT * FROM coupons WHERE UPPER(code) = UPPER(?) AND active = 1").get(data.couponCode);
      if (coupon) {
        discountPercent = coupon.discount_percent;
      }
    }

    const baseAmount = pkg.discount_price * data.seats;
    const discountAmount = Math.round((baseAmount * discountPercent) / 100);
    const totalAmount = baseAmount - discountAmount;
    const bookingRef = generateRef();
    const createdAt = new Date().toISOString();
    // try to associate booking with logged-in user if Authorization present
    let userId: string | null = null;
    const auth = (req.headers.authorization as string | undefined);
    if (auth?.startsWith("Bearer ")) {
      try {
        const dec = jwt.verify(auth.slice(7), JWT_SECRET) as { userId: string };
        userId = dec.userId;
      } catch { /* ignore invalid token for guest checkout */ }
    }
    const phoneFull = data.phoneCode ? `${data.phoneCode}${data.phone.replace(/^\+\d{1,4}/, "")}` : data.phone;

    const insert = db.prepare(
      `INSERT INTO bookings (booking_ref, created_at, status, package_slug, seats, date, pickup_location, name, email, phone, coupon_code, special_requests, total_amount, payment_status, user_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    );

    insert.run(
      bookingRef,
      createdAt,
      "CONFIRMED",
      data.packageSlug,
      data.seats,
      data.date,
      data.pickupLocation,
      data.name,
      data.email,
      phoneFull,
      data.couponCode ?? null,
      data.specialRequests ?? null,
      totalAmount,
      "PENDING",
      userId
    );

    // decrement seats only on creation (mock confirms immediately for template)
    db.prepare("UPDATE packages SET seats_left = seats_left - ? WHERE slug = ?").run(data.seats, data.packageSlug);

    // create mock payment order automatically for checkout template
    const orderId = `order_${Date.now().toString(36)}_${Math.random().toString(36).slice(2,6)}`;
    try {
      db.prepare("INSERT INTO payments (id,order_id,booking_ref,amount,currency,status,provider,created_at) VALUES (?,?,?,?,?,?,?,?)")
        .run(crypto.randomUUID(), orderId, bookingRef, totalAmount, "INR", "PENDING", "mock", createdAt);
      db.prepare("UPDATE bookings SET order_id=? WHERE booking_ref=?").run(orderId, bookingRef);
    } catch {}

    console.log(`[BTT] New booking ${bookingRef} — ${data.name} — ${pkg.title} × ${data.seats} order ${orderId}`);

    res.status(201).json({
      success: true,
      message: "Booking created (PENDING payment). Proceed to /checkout/payment template to 'Pay' (mock).",
      bookingRef,
      totalAmount,
      orderId,
      paymentStatus: "PENDING",
      packageTitle: pkg.title,
    });
  } catch (err) {
    next(err);
  }
});

// ─── GET /api/bookings/my ────────────────────────────────────────────────────
router.get("/my/list", (req: Request, res: Response, next: NextFunction) => {
  try {
    const auth = (req.headers.authorization as string | undefined);
    if (!auth?.startsWith("Bearer ")) return next(createError("Not authenticated", 401));
    const dec = jwt.verify(auth.slice(7), JWT_SECRET) as { userId: string };
    const emailRows: any = db.prepare("SELECT email FROM users WHERE id=?").get(dec.userId) as any;
    const rows: any[] = db.prepare("SELECT * FROM bookings WHERE user_id=? OR email=? ORDER BY created_at DESC").all(dec.userId, emailRows?.email ?? "") as any;
    res.json({ success: true, count: rows.length, data: rows });
  } catch (err) { next(createError("Invalid token", 401)); }
});

// keep alias GET /api/bookings/my for convenience
router.get("/my", (req: Request, res: Response, next: NextFunction) => {
  (req as any).url = "/my/list";
  // forward
  const auth = (req.headers.authorization as string | undefined);
  if (!auth?.startsWith("Bearer ")) return next(createError("Not authenticated", 401));
  try {
    const dec = jwt.verify(auth.slice(7), JWT_SECRET) as { userId: string };
    const emailRows: any = db.prepare("SELECT email FROM users WHERE id=?").get(dec.userId) as any;
    const rows: any[] = db.prepare("SELECT * FROM bookings WHERE user_id=? OR email=? ORDER BY created_at DESC").all(dec.userId, emailRows?.email ?? "") as any;
    res.json({ success: true, count: rows.length, data: rows });
  } catch (err) { next(createError("Invalid token", 401)); }
});

// ─── GET /api/bookings/:ref ───────────────────────────────────────────────────
router.get("/:ref", (req: Request, res: Response, next: NextFunction) => {
  try {
    const ref = req.params.ref as string;
    if (ref === "my" || ref === "my/list") return next();
    const booking: any = db.prepare("SELECT * FROM bookings WHERE booking_ref = ?").get(ref);
    if (!booking) return next(createError("Booking not found", 404));
    res.json({ success: true, data: booking });
  } catch (err) {
    next(err);
  }
});

export default router;
