import { Router, type Request, type Response, type NextFunction } from "express";
import db from "../db";
import { createError } from "../middleware/errorHandler";

const router = Router();

const getAllStmt = db.prepare("SELECT * FROM categories");
const getByIdStmt = db.prepare("SELECT * FROM categories WHERE id = ?");

// ─── GET /api/categories ──────────────────────────────────────────────────────
router.get("/", (_req: Request, res: Response, next: NextFunction) => {
  try {
    const data = getAllStmt.all();
    res.json({ success: true, count: data.length, data });
  } catch (err) {
    next(err);
  }
});

// ─── GET /api/categories/:id ──────────────────────────────────────────────────
router.get("/:id", (req: Request, res: Response, next: NextFunction) => {
  try {
    const category = getByIdStmt.get(req.params.id);
    if (!category) return next(createError("Category not found", 404));
    res.json({ success: true, data: category });
  } catch (err) {
    next(err);
  }
});

export default router;
