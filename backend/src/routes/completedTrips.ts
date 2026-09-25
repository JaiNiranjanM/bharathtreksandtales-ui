import { Router, type Request, type Response, type NextFunction } from "express";
import db from "../db";
import { createError } from "../middleware/errorHandler";

const JSON_FIELDS = ["category", "groups_from", "gallery", "temples", "highlights", "itinerary"];

function parseRow(row: Record<string, unknown>) {
  for (const field of JSON_FIELDS) {
    if (typeof row[field] === "string") {
      row[field] = JSON.parse(row[field] as string);
    }
  }
  return row;
}

const router = Router();

router.get("/", (_req: Request, res: Response, next: NextFunction) => {
  try {
    const rows = db.prepare("SELECT * FROM completed_trips ORDER BY start_date DESC").all() as Record<string, unknown>[];
    res.json({ success: true, count: rows.length, data: rows.map(parseRow) });
  } catch (err) {
    next(err);
  }
});

router.get("/:slug", (req: Request, res: Response, next: NextFunction) => {
  try {
    const slug = req.params.slug as string;
    const row = db.prepare("SELECT * FROM completed_trips WHERE slug = ?").get(slug);
    if (!row) return next(createError("Completed trip not found", 404));
    res.json({ success: true, data: parseRow(row as Record<string, unknown>) });
  } catch (err) {
    next(err);
  }
});

export default router;
