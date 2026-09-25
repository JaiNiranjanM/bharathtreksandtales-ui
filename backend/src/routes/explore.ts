import { Router, type Request, type Response, type NextFunction } from "express";
import db from "../db";
import { createError } from "../middleware/errorHandler";

const router = Router();

const stateSvgIdToName: Record<string, string> = {
  ap: "Andhra Pradesh",
  ka: "Karnataka",
  kl: "Kerala",
  mh: "Maharashtra",
  tn: "Tamil Nadu",
};

const states = ["Tamil Nadu", "Karnataka", "Kerala", "Andhra Pradesh", "Maharashtra"] as const;

// ─── GET /api/explore/states ──────────────────────────────────────────────────
router.get("/states", (_req: Request, res: Response, next: NextFunction) => {
  try {
    res.json({ success: true, data: states, svgIdMap: stateSvgIdToName });
  } catch (err) {
    next(err);
  }
});

// ─── GET /api/explore/states/:state/summary ───────────────────────────────────
router.get("/states/:state/summary", (req: Request, res: Response, next: NextFunction) => {
  try {
    const state = req.params.state as string;
    const stateName = decodeURIComponent(state);

    const resolvedState =
      stateSvgIdToName[stateName.toLowerCase()] ?? stateName;

    if (!(states as readonly string[]).includes(resolvedState)) {
      return next(createError(`State "${resolvedState}" not found`, 404));
    }

    const countRow = db.prepare("SELECT COUNT(*) as count FROM packages WHERE state = ?").get(resolvedState) as { count: number };
    const totalPackages = countRow.count;

    const templeRows = db.prepare("SELECT temples FROM packages WHERE state = ?").all(resolvedState) as { temples: string }[];
    const temples = templeRows
      .flatMap((row) => {
        try {
          return JSON.parse(row.temples) as string[];
        } catch {
          return [];
        }
      });

    const trekRows = db.prepare("SELECT title FROM packages WHERE state = ? AND category LIKE '%trekking%'").all(resolvedState) as { title: string }[];
    const treks = trekRows.map((r) => r.title);

    const summary = {
      totalPackages,
      temples,
      treks,
    };

    res.json({ success: true, state: resolvedState, data: summary });
  } catch (err) {
    next(err);
  }
});

export default router;
