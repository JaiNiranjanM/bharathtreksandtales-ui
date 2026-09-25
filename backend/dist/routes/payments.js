"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = __importDefault(require("../db"));
const errorHandler_1 = require("../middleware/errorHandler");
const router = (0, express_1.Router)();
// POST /api/payments/create-order { bookingRef, amount }
router.post('/create-order', (req, res, next) => {
    try {
        const { bookingRef, amount } = req.body;
        if (!amount || amount <= 0)
            return next((0, errorHandler_1.createError)('amount required', 400));
        const orderId = `order_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
        const id = crypto.randomUUID();
        const created_at = new Date().toISOString();
        db_1.default.prepare('INSERT INTO payments (id,order_id,booking_ref,amount,currency,status,provider,created_at) VALUES (?,?,?,?,?,?,?,?)')
            .run(id, orderId, bookingRef ?? null, Math.round(amount), 'INR', 'PENDING', 'mock', created_at);
        console.log(`[BTT] Mock order created ${orderId} for ${bookingRef} amount ${amount}`);
        res.status(201).json({ success: true, orderId, amount, currency: 'INR', status: 'PENDING', provider: 'mock', instructions: 'Call POST /api/payments/verify with {orderId} to mark PAID (template).' });
    }
    catch (err) {
        next(err);
    }
});
router.post('/verify', (req, res, next) => {
    try {
        const { orderId } = req.body;
        if (!orderId)
            return next((0, errorHandler_1.createError)('orderId required', 400));
        const row = db_1.default.prepare('SELECT * FROM payments WHERE order_id = ?').get(orderId);
        if (!row)
            return next((0, errorHandler_1.createError)('Order not found', 404));
        const now = new Date().toISOString();
        db_1.default.prepare("UPDATE payments SET status='PAID', updated_at=? WHERE order_id=?").run(now, orderId);
        if (row.booking_ref) {
            try {
                db_1.default.prepare("UPDATE bookings SET payment_status='PAID', status='CONFIRMED', payment_id=?, order_id=? WHERE booking_ref=?").run(orderId, orderId, row.booking_ref);
            }
            catch { }
        }
        res.json({ success: true, message: 'Payment verified (mock). Booking is now CONFIRMED.', orderId, status: 'PAID' });
    }
    catch (err) {
        next(err);
    }
});
router.get('/:orderId', (req, res, next) => {
    try {
        const row = db_1.default.prepare('SELECT * FROM payments WHERE order_id=?').get(req.params.orderId);
        if (!row)
            return next((0, errorHandler_1.createError)('Order not found', 404));
        res.json({ success: true, data: row });
    }
    catch (err) {
        next(err);
    }
});
exports.default = router;
//# sourceMappingURL=payments.js.map