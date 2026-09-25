"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const zod_1 = require("zod");
const db_1 = __importDefault(require("../db"));
const errorHandler_1 = require("../middleware/errorHandler");
const JWT_SECRET = process.env.JWT_SECRET ?? "btt-dev-secret-change-in-production";
const router = (0, express_1.Router)();
// ─── Booking request schema ───────────────────────────────────────────────────
// phone now accepts E.164 with optional country code: +91XXXXXXXXXX or plain digits
const BookingSchema = zod_1.z.object({
    packageSlug: zod_1.z.string().min(1),
    seats: zod_1.z.number().int().min(1).max(20),
    date: zod_1.z.string().min(1),
    pickupLocation: zod_1.z.string().min(1),
    name: zod_1.z.string().min(2),
    email: zod_1.z.string().email(),
    phone: zod_1.z.string().min(6).max(20).refine((v) => /^\+?\d{7,15}$/.test(v.replace(/[\s-]/g, "")), "Enter a valid phone number"),
    phoneCode: zod_1.z.string().regex(/^\+\d{1,4}$/).optional(),
    couponCode: zod_1.z.string().optional(),
    specialRequests: zod_1.z.string().optional(),
});
function generateRef() {
    return `BTT-${Date.now().toString(36).toUpperCase()}-${Math.random()
        .toString(36)
        .slice(2, 6)
        .toUpperCase()}`;
}
// ─── POST /api/bookings ───────────────────────────────────────────────────────
router.post("/", (req, res, next) => {
    try {
        const parseResult = BookingSchema.safeParse(req.body);
        if (!parseResult.success) {
            return next((0, errorHandler_1.createError)(parseResult.error.issues.map((i) => i.message).join(", "), 400));
        }
        const data = parseResult.data;
        const pkg = db_1.default.prepare("SELECT * FROM packages WHERE slug = ?").get(data.packageSlug);
        if (!pkg)
            return next((0, errorHandler_1.createError)("Package not found", 404));
        if (data.seats > pkg.seats_left) {
            return next((0, errorHandler_1.createError)(`Only ${pkg.seats_left} seat(s) available`, 400));
        }
        let discountPercent = 0;
        if (data.couponCode) {
            const coupon = db_1.default.prepare("SELECT * FROM coupons WHERE UPPER(code) = UPPER(?) AND active = 1").get(data.couponCode);
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
        let userId = null;
        const auth = req.headers.authorization;
        if (auth?.startsWith("Bearer ")) {
            try {
                const dec = jsonwebtoken_1.default.verify(auth.slice(7), JWT_SECRET);
                userId = dec.userId;
            }
            catch { /* ignore invalid token for guest checkout */ }
        }
        const phoneFull = data.phoneCode ? `${data.phoneCode}${data.phone.replace(/^\+\d{1,4}/, "")}` : data.phone;
        const insert = db_1.default.prepare(`INSERT INTO bookings (booking_ref, created_at, status, package_slug, seats, date, pickup_location, name, email, phone, coupon_code, special_requests, total_amount, payment_status, user_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
        insert.run(bookingRef, createdAt, "CONFIRMED", data.packageSlug, data.seats, data.date, data.pickupLocation, data.name, data.email, phoneFull, data.couponCode ?? null, data.specialRequests ?? null, totalAmount, "PENDING", userId);
        // decrement seats only on creation (mock confirms immediately for template)
        db_1.default.prepare("UPDATE packages SET seats_left = seats_left - ? WHERE slug = ?").run(data.seats, data.packageSlug);
        // create mock payment order automatically for checkout template
        const orderId = `order_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
        try {
            db_1.default.prepare("INSERT INTO payments (id,order_id,booking_ref,amount,currency,status,provider,created_at) VALUES (?,?,?,?,?,?,?,?)")
                .run(crypto.randomUUID(), orderId, bookingRef, totalAmount, "INR", "PENDING", "mock", createdAt);
            db_1.default.prepare("UPDATE bookings SET order_id=? WHERE booking_ref=?").run(orderId, bookingRef);
        }
        catch { }
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
    }
    catch (err) {
        next(err);
    }
});
// ─── GET /api/bookings/my ────────────────────────────────────────────────────
router.get("/my/list", (req, res, next) => {
    try {
        const auth = req.headers.authorization;
        if (!auth?.startsWith("Bearer "))
            return next((0, errorHandler_1.createError)("Not authenticated", 401));
        const dec = jsonwebtoken_1.default.verify(auth.slice(7), JWT_SECRET);
        const emailRows = db_1.default.prepare("SELECT email FROM users WHERE id=?").get(dec.userId);
        const rows = db_1.default.prepare("SELECT * FROM bookings WHERE user_id=? OR email=? ORDER BY created_at DESC").all(dec.userId, emailRows?.email ?? "");
        res.json({ success: true, count: rows.length, data: rows });
    }
    catch (err) {
        next((0, errorHandler_1.createError)("Invalid token", 401));
    }
});
// keep alias GET /api/bookings/my for convenience
router.get("/my", (req, res, next) => {
    req.url = "/my/list";
    // forward
    const auth = req.headers.authorization;
    if (!auth?.startsWith("Bearer "))
        return next((0, errorHandler_1.createError)("Not authenticated", 401));
    try {
        const dec = jsonwebtoken_1.default.verify(auth.slice(7), JWT_SECRET);
        const emailRows = db_1.default.prepare("SELECT email FROM users WHERE id=?").get(dec.userId);
        const rows = db_1.default.prepare("SELECT * FROM bookings WHERE user_id=? OR email=? ORDER BY created_at DESC").all(dec.userId, emailRows?.email ?? "");
        res.json({ success: true, count: rows.length, data: rows });
    }
    catch (err) {
        next((0, errorHandler_1.createError)("Invalid token", 401));
    }
});
// ─── GET /api/bookings/:ref ───────────────────────────────────────────────────
router.get("/:ref", (req, res, next) => {
    try {
        const ref = req.params.ref;
        if (ref === "my" || ref === "my/list")
            return next();
        const booking = db_1.default.prepare("SELECT * FROM bookings WHERE booking_ref = ?").get(ref);
        if (!booking)
            return next((0, errorHandler_1.createError)("Booking not found", 404));
        res.json({ success: true, data: booking });
    }
    catch (err) {
        next(err);
    }
});
exports.default = router;
//# sourceMappingURL=bookings.js.map