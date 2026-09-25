import { Router, type Request, type Response, type NextFunction } from 'express';
import { z } from 'zod';
import db from '../db';
import { createError } from '../middleware/errorHandler';

const router = Router();

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email'),
  message: z.string().min(10, 'Message must be at least 10 characters').max(2000),
});

router.post('/', (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) return next(createError(parsed.error.errors[0].message, 400));
    const { name, email, message } = parsed.data;
    const id = crypto.randomUUID();
    const created_at = new Date().toISOString();
    db.prepare('INSERT INTO contacts (id,name,email,message,created_at,status) VALUES (?,?,?,?,?,?)').run(id, name, email, message, created_at, 'new');
    console.log(`[BTT] Contact from ${name} <${email}>: ${message.slice(0,80)}`);
    res.status(201).json({ success: true, message: 'Thank you! We will get back to you within 24 hours.', id });
  } catch (err) { next(err); }
});

router.get('/', (_req, res) => {
  const rows = db.prepare('SELECT * FROM contacts ORDER BY created_at DESC LIMIT 100').all();
  res.json({ success: true, count: (rows as any[]).length, data: rows });
});

export default router;
