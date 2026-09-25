import { Router, type Request, type Response, type NextFunction } from 'express';
import db from '../db';
import { createError } from '../middleware/errorHandler';

const router = Router();

router.get('/', (req: Request, res: Response, next: NextFunction) => {
  try {
    const { category, query } = req.query;
    const conditions: string[] = ['published = 1'];
    const params: any[] = [];
    if (category && typeof category === 'string' && category !== 'all') {
      conditions.push('category = ?'); params.push(category);
    }
    if (query && typeof query === 'string' && query.trim()) {
      const q = `%${query.toLowerCase()}%`;
      conditions.push('(LOWER(title) LIKE ? OR LOWER(excerpt) LIKE ?)');
      params.push(q, q);
    }
    const sql = `SELECT * FROM blog_posts WHERE ${conditions.join(' AND ')} ORDER BY date DESC`;
    const rows = db.prepare(sql).all(...params);
    res.json({ success: true, count: (rows as any[]).length, data: rows });
  } catch (err) { next(err); }
});

router.get('/:slug', (req: Request, res: Response, next: NextFunction) => {
  try {
    const row: any = db.prepare('SELECT * FROM blog_posts WHERE slug = ?').get(req.params.slug);
    if (!row) return next(createError('Post not found', 404));
    res.json({ success: true, data: row });
  } catch (err) { next(err); }
});

export default router;
