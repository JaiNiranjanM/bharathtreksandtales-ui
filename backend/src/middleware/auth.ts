import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import db from '../db';
import { createError } from './errorHandler';

const JWT_SECRET = process.env.JWT_SECRET ?? 'btt-dev-secret-change-in-production';

export interface AuthedRequest extends Request {
  user?: { userId: string; role: string };
}

export function authenticate(req: AuthedRequest, _res: Response, next: NextFunction) {
  const auth = req.headers.authorization;
  if (!auth?.startsWith('Bearer ')) return next(createError('Not authenticated', 401));
  try {
    const decoded = jwt.verify(auth.slice(7), JWT_SECRET) as { userId: string; role: string };
    // Ensure user exists
    const u: any = db.prepare('SELECT id FROM users WHERE id = ?').get(decoded.userId);
    if (!u) return next(createError('User not found', 404));
    req.user = decoded;
    next();
  } catch {
    next(createError('Invalid or expired token', 401));
  }
}

export function authorize(...roles: string[]) {
  return (req: AuthedRequest, _res: Response, next: NextFunction) => {
    if (!req.user) return next(createError('Not authenticated', 401));
    if (roles.length && !roles.includes(req.user.role)) return next(createError('Forbidden', 403));
    next();
  };
}
