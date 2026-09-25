import { Router, type Request, type Response, type NextFunction } from 'express';
import db from '../db';
import { createError } from '../middleware/errorHandler';

const router = Router();

// POST /api/payments/create-order { bookingRef, amount }
router.post('/create-order', (req: Request, res: Response, next: NextFunction) => {
  try {
    const { bookingRef, amount } = req.body as { bookingRef?: string; amount?: number };
    if (!amount || amount <= 0) return next(createError('amount required', 400));
    const orderId = `order_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
    const id = crypto.randomUUID();
    const created_at = new Date().toISOString();
    db.prepare('INSERT INTO payments (id,order_id,booking_ref,amount,currency,status,provider,created_at) VALUES (?,?,?,?,?,?,?,?)')
      .run(id, orderId, bookingRef ?? null, Math.round(amount), 'INR', 'PENDING', 'mock', created_at);
    console.log(`[BTT] Mock order created ${orderId} for ${bookingRef} amount ${amount}`);
    res.status(201).json({ success: true, orderId, amount, currency: 'INR', status: 'PENDING', provider: 'mock', instructions: 'Call POST /api/payments/verify with {orderId} to mark PAID (template).' });
  } catch (err) { next(err); }
});

router.post('/verify', (req: Request, res: Response, next: NextFunction) => {
  try {
    const { orderId } = req.body as { orderId: string };
    if (!orderId) return next(createError('orderId required', 400));
    const row: any = db.prepare('SELECT * FROM payments WHERE order_id = ?').get(orderId);
    if (!row) return next(createError('Order not found', 404));
    const now = new Date().toISOString();
    db.prepare("UPDATE payments SET status='PAID', updated_at=? WHERE order_id=?").run(now, orderId);
    if (row.booking_ref) {
      try { db.prepare("UPDATE bookings SET payment_status='PAID', status='CONFIRMED', payment_id=?, order_id=? WHERE booking_ref=?").run(orderId, orderId, row.booking_ref); } catch {}
    }
    res.json({ success: true, message: 'Payment verified (mock). Booking is now CONFIRMED.', orderId, status: 'PAID' });
  } catch (err) { next(err); }
});

router.get('/:orderId', (req: Request, res: Response, next: NextFunction) => {
  try {
    const row: any = db.prepare('SELECT * FROM payments WHERE order_id=?').get(req.params.orderId);
    if (!row) return next(createError('Order not found', 404));
    res.json({ success: true, data: row });
  } catch (err) { next(err); }
});

export default router;
