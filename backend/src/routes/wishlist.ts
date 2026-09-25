import { Router, type Request, type Response, type NextFunction } from 'express';
import db from '../db';
import { createError } from '../middleware/errorHandler';
import { authenticate, type AuthedRequest } from '../middleware/auth';

const router = Router();

router.use(authenticate);

// GET /api/wishlist
router.get('/', (req: AuthedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const rows: any[] = db.prepare('SELECT package_id FROM wishlists WHERE user_id = ? ORDER BY created_at DESC').all(userId) as any;
    res.json({ success: true, data: rows.map((r) => r.package_id) });
  } catch (err) { next(err); }
});

// POST /api/wishlist { packageId }
router.post('/', (req: AuthedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const { packageId } = req.body as { packageId: string };
    if (!packageId) return next(createError('packageId required', 400));
    // ensure package exists
    const pkg: any = db.prepare('SELECT id FROM packages WHERE id = ? OR slug = ?').get(packageId, packageId);
    const pid = pkg ? pkg.id : packageId;
    const id = crypto.randomUUID();
    const created_at = new Date().toISOString();
    try {
      db.prepare('INSERT INTO wishlists (id,user_id,package_id,created_at) VALUES (?,?,?,?)').run(id, userId, pid, created_at);
    } catch (e: any) {
      if (String(e.message).includes('UNIQUE')) return res.json({ success: true, message: 'Already in wishlist' });
      throw e;
    }
    res.status(201).json({ success: true, message: 'Added to wishlist' });
  } catch (err) { next(err); }
});

// DELETE /api/wishlist/:packageId
router.delete('/:packageId', (req: AuthedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const { packageId } = req.params;
    db.prepare('DELETE FROM wishlists WHERE user_id = ? AND package_id = ?').run(userId, packageId);
    res.json({ success: true, message: 'Removed from wishlist' });
  } catch (err) { next(err); }
});

export default router;
