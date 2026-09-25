import { Router, type Request, type Response, type NextFunction } from "express";
import db from "../db";
import { createError } from "../middleware/errorHandler";

const router = Router();

// ─── Types ────────────────────────────────────────────────────────────────────

type Difficulty = "Easy" | "Moderate" | "Challenging" | "Extreme";

interface TravelPackage {
  id: string;
  slug: string;
  title: string;
  category: string[];
  state: string;
  location: string;
  image: string;
  gallery: string[];
  difficulty: Difficulty;
  duration: string;
  durationDays: number;
  price: number;
  discountPrice: number;
  rating: number;
  reviewCount: number;
  seatsLeft: number;
  guideIncluded: boolean;
  meals: string;
  transportation: string;
  departure: string;
  returnTime: string;
  highlights: string[];
  temples: string[];
  altitude: string;
  weather: string;
  weekend: boolean;
  pickupLocations: string[];
  tags: string[];
  itinerary: { time: string; activity: string }[];
  inclusions: string[];
  exclusions: string[];
  thingsToCarry: string[];
  availableDates: string[];
}

// ─── Row mapper ───────────────────────────────────────────────────────────────

function rowToPackage(row: any): TravelPackage {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    category: JSON.parse(row.category),
    state: row.state,
    location: row.location,
    image: row.image,
    gallery: JSON.parse(row.gallery),
    difficulty: row.difficulty,
    duration: row.duration,
    durationDays: row.duration_days,
    price: row.price,
    discountPrice: row.discount_price,
    rating: row.rating,
    reviewCount: row.review_count,
    seatsLeft: row.seats_left,
    guideIncluded: row.guide_included === 1,
    meals: row.meals,
    transportation: row.transportation,
    departure: row.departure,
    returnTime: row.return_time,
    highlights: JSON.parse(row.highlights),
    temples: JSON.parse(row.temples),
    altitude: row.altitude,
    weather: row.weather,
    weekend: row.weekend === 1,
    pickupLocations: JSON.parse(row.pickup_locations),
    tags: JSON.parse(row.tags),
    itinerary: JSON.parse(row.itinerary),
    inclusions: JSON.parse(row.inclusions),
    exclusions: JSON.parse(row.exclusions),
    thingsToCarry: JSON.parse(row.things_to_carry),
    availableDates: (() => { try { return JSON.parse(row.available_dates ?? "[]"); } catch { return []; } })(),
  };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getPackageBySlug(slug: string): TravelPackage | undefined {
  const row = db.prepare("SELECT * FROM packages WHERE slug = ?").get(slug);
  return row ? rowToPackage(row) : undefined;
}

function getRelatedPackages(pkg: TravelPackage, limit = 3): TravelPackage[] {
  const rows = db
    .prepare(
      `SELECT * FROM packages WHERE id != ? AND category LIKE ? LIMIT ?`
    )
    .all(pkg.id, `%${pkg.category[0]}%`, limit) as any[];
  return rows.map(rowToPackage);
}

// ─── GET /api/packages ───────────────────────────────────────────────────────
// Supports query params: category, state, difficulty, query, maxBudget,
// weekendOnly, sort (rating | price_asc | price_desc), date, travelers
router.get("/", (req: Request, res: Response, next: NextFunction) => {
  try {
    const { category, state, difficulty, query, maxBudget, weekendOnly, sort, date, travelers } = req.query as Record<string, string | undefined>;

    const conditions: string[] = [];
    const params: any[] = [];

    if (category && typeof category === "string" && category !== "all") {
      conditions.push("category LIKE ?");
      params.push(`%${category}%`);
    }

    if (state && typeof state === "string" && state !== "all") {
      conditions.push("state = ?");
      params.push(state);
    }

    if (difficulty && typeof difficulty === "string" && difficulty !== "all") {
      conditions.push("difficulty = ?");
      params.push(difficulty);
    }

    if (query && typeof query === "string" && query.trim()) {
      const q = `%${query.toLowerCase()}%`;
      conditions.push(
        "(LOWER(title) LIKE ? OR LOWER(location) LIKE ? OR LOWER(state) LIKE ?)"
      );
      params.push(q, q, q);
    }

    if (maxBudget && !isNaN(Number(maxBudget))) {
      conditions.push("discount_price <= ?");
      params.push(Number(maxBudget));
    }

    if (weekendOnly === "true") {
      conditions.push("weekend = 1");
    }

    let travelersNum: number | undefined;
    if (travelers && !isNaN(Number(travelers))) {
      travelersNum = Number(travelers);
      if (travelersNum > 0) {
        conditions.push("seats_left >= ?");
        params.push(travelersNum);
      }
    }
    // date filter handled post-SQL via available_dates JSON for now

    let sql = "SELECT * FROM packages";
    if (conditions.length > 0) {
      sql += " WHERE " + conditions.join(" AND ");
    }

    if (sort === "price_asc") {
      sql += " ORDER BY discount_price ASC";
    } else if (sort === "price_desc") {
      sql += " ORDER BY discount_price DESC";
    } else if (sort === "rating") {
      sql += " ORDER BY rating DESC";
    }

    const rows = db.prepare(sql).all(...params);
    let results = rows.map(rowToPackage);
    // post-filter by date if provided: check availableDates includes query date
    if (date && typeof date === 'string' && date.trim()) {
      const want = date.trim();
      results = results.filter((p: any) => {
        if (!Array.isArray(p.availableDates) || p.availableDates.length === 0) return true; // if no dates, keep
        return p.availableDates.includes(want);
      });
    }

    res.json({ success: true, count: results.length, data: results });
  } catch (err) {
    next(err);
  }
});

// ─── GET /api/packages/:slug ─────────────────────────────────────────────────
router.get("/:slug", (req: Request, res: Response, next: NextFunction) => {
  try {
    const slug = req.params.slug as string;
    const pkg = getPackageBySlug(slug);
    if (!pkg) return next(createError("Package not found", 404));
    res.json({ success: true, data: pkg });
  } catch (err) {
    next(err);
  }
});

// ─── GET /api/packages/:slug/related ─────────────────────────────────────────
router.get("/:slug/related", (req: Request, res: Response, next: NextFunction) => {
  try {
    const slug = req.params.slug as string;
    const pkg = getPackageBySlug(slug);
    if (!pkg) return next(createError("Package not found", 404));
    const limit = req.query.limit ? Number(req.query.limit) : 3;
    const related = getRelatedPackages(pkg, limit);
    res.json({ success: true, count: related.length, data: related });
  } catch (err) {
    next(err);
  }
});

export default router;
