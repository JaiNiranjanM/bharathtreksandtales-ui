import Database, { type Database as DatabaseType } from "better-sqlite3";
import path from "path";
import fs from "fs";
import { packages } from "./data/packages";
import { categories } from "./data/categories";
import { completedTrips } from "./data/completedTrips";
import { coupons } from "./data/coupons";

const DB_DIR = path.join(__dirname, "..", "data");
if (!fs.existsSync(DB_DIR)) fs.mkdirSync(DB_DIR, { recursive: true });

const DB_PATH = process.env.DB_PATH ?? path.join(DB_DIR, "btt.db");
const db: DatabaseType = new Database(DB_PATH);

db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

// ─── Schema ──────────────────────────────────────────────────────────────────

db.exec(`
  CREATE TABLE IF NOT EXISTS packages (
    id TEXT PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    state TEXT NOT NULL,
    location TEXT NOT NULL,
    image TEXT NOT NULL,
    gallery TEXT NOT NULL,
    difficulty TEXT NOT NULL,
    duration TEXT NOT NULL,
    duration_days INTEGER,
    price INTEGER,
    discount_price INTEGER,
    rating REAL,
    review_count INTEGER,
    seats_left INTEGER,
    guide_included INTEGER,
    meals TEXT,
    transportation TEXT,
    departure TEXT,
    return_time TEXT,
    highlights TEXT NOT NULL,
    temples TEXT NOT NULL,
    altitude TEXT,
    weather TEXT,
    weekend INTEGER,
    pickup_locations TEXT NOT NULL,
    tags TEXT NOT NULL,
    itinerary TEXT NOT NULL,
    inclusions TEXT NOT NULL,
    exclusions TEXT NOT NULL,
    things_to_carry TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS categories (
    id TEXT PRIMARY KEY,
    label TEXT NOT NULL,
    icon TEXT,
    tagline TEXT,
    description TEXT,
    image TEXT,
    accent TEXT,
    glow TEXT
  );

  CREATE TABLE IF NOT EXISTS completed_trips (
    id TEXT PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    organizer TEXT,
    category TEXT NOT NULL,
    state TEXT,
    location TEXT,
    start_date TEXT,
    dates_label TEXT,
    duration_label TEXT,
    difficulty TEXT,
    groups_from TEXT NOT NULL,
    cost_label TEXT,
    image TEXT,
    gallery TEXT NOT NULL,
    temples TEXT NOT NULL,
    highlights TEXT NOT NULL,
    itinerary TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS coupons (
    code TEXT PRIMARY KEY,
    discount_percent INTEGER,
    description TEXT,
    active INTEGER
  );

  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'user',
    phone TEXT DEFAULT '',
    bio TEXT DEFAULT '',
    avatar TEXT DEFAULT '',
    location TEXT DEFAULT '',
    profile_completed INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS bookings (
    booking_ref TEXT PRIMARY KEY,
    created_at TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'CONFIRMED',
    package_slug TEXT NOT NULL,
    seats INTEGER NOT NULL,
    date TEXT NOT NULL,
    pickup_location TEXT NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    coupon_code TEXT,
    special_requests TEXT,
    total_amount INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS newsletter_subscribers (
    email TEXT PRIMARY KEY,
    subscribed_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS contacts (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TEXT NOT NULL,
    status TEXT DEFAULT 'new'
  );

  CREATE TABLE IF NOT EXISTS blog_posts (
    slug TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    excerpt TEXT NOT NULL,
    content TEXT NOT NULL,
    category TEXT NOT NULL,
    image TEXT NOT NULL,
    date TEXT NOT NULL,
    author TEXT DEFAULT 'Bharath Treks Team',
    published INTEGER DEFAULT 1
  );

  CREATE TABLE IF NOT EXISTS wishlists (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    package_id TEXT NOT NULL,
    created_at TEXT NOT NULL,
    UNIQUE(user_id, package_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS payments (
    id TEXT PRIMARY KEY,
    order_id TEXT UNIQUE NOT NULL,
    booking_ref TEXT,
    amount INTEGER NOT NULL,
    currency TEXT DEFAULT 'INR',
    status TEXT NOT NULL DEFAULT 'PENDING',
    provider TEXT DEFAULT 'mock',
    created_at TEXT NOT NULL,
    updated_at TEXT
  );
`);

// ─── Migrations (safe for existing databases) ────────────────────────────────

const migrations = [
  { table: "users", column: "role", definition: "TEXT NOT NULL DEFAULT 'user'" },
  { table: "users", column: "phone", definition: "TEXT DEFAULT ''" },
  { table: "users", column: "bio", definition: "TEXT DEFAULT ''" },
  { table: "users", column: "avatar", definition: "TEXT DEFAULT ''" },
  { table: "users", column: "location", definition: "TEXT DEFAULT ''" },
  { table: "users", column: "profile_completed", definition: "INTEGER NOT NULL DEFAULT 0" },
  { table: "users", column: "country", definition: "TEXT DEFAULT 'India'" },
  { table: "users", column: "phone_code", definition: "TEXT DEFAULT '+91'" },
  { table: "users", column: "aadhaar_hash", definition: "TEXT DEFAULT ''" },
  { table: "users", column: "aadhaar_last4", definition: "TEXT DEFAULT ''" },
  { table: "users", column: "aadhaar_verified", definition: "INTEGER DEFAULT 0" },
  { table: "users", column: "email_verified", definition: "INTEGER DEFAULT 0" },
  { table: "users", column: "pending_email", definition: "TEXT DEFAULT ''" },
  { table: "users", column: "email_verify_token", definition: "TEXT DEFAULT ''" },
  { table: "users", column: "email_verify_expires", definition: "TEXT DEFAULT ''" },
  { table: "users", column: "reset_token", definition: "TEXT DEFAULT ''" },
  { table: "users", column: "reset_expires", definition: "TEXT DEFAULT ''" },
  { table: "users", column: "profile_data", definition: "TEXT DEFAULT '{}'" },
  { table: "bookings", column: "payment_status", definition: "TEXT DEFAULT 'PENDING'" },
  { table: "bookings", column: "payment_id", definition: "TEXT DEFAULT ''" },
  { table: "bookings", column: "order_id", definition: "TEXT DEFAULT ''" },
  { table: "bookings", column: "user_id", definition: "TEXT DEFAULT ''" },
  { table: "packages", column: "available_dates", definition: "TEXT DEFAULT '[]'" },
];

for (const m of migrations) {
  const cols = db.prepare(`PRAGMA table_info(${m.table})`).all() as { name: string }[];
  if (!cols.some((c) => c.name === m.column)) {
    db.exec(`ALTER TABLE ${m.table} ADD COLUMN ${m.column} ${m.definition}`);
    console.log(`[BTT] Migration: added ${m.table}.${m.column}`);
  }
}

// ─── Seed ────────────────────────────────────────────────────────────────────

function seedIfEmpty() {
  const count = db.prepare("SELECT COUNT(*) as c FROM packages").get() as { c: number };
  if (count.c > 0) return;

  const insertPackage = db.prepare(`
    INSERT INTO packages (id, slug, title, category, state, location, image, gallery,
      difficulty, duration, duration_days, price, discount_price, rating, review_count,
      seats_left, guide_included, meals, transportation, departure, return_time,
      highlights, temples, altitude, weather, weekend, pickup_locations, tags,
      itinerary, inclusions, exclusions, things_to_carry)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertMany = db.transaction(() => {
    for (const p of packages) {
      insertPackage.run(
        p.id, p.slug, p.title, JSON.stringify(p.category), p.state, p.location,
        p.image, JSON.stringify(p.gallery), p.difficulty, p.duration, p.durationDays,
        p.price, p.discountPrice, p.rating, p.reviewCount, p.seatsLeft,
        p.guideIncluded ? 1 : 0, p.meals, p.transportation, p.departure, p.returnTime,
        JSON.stringify(p.highlights), JSON.stringify(p.temples), p.altitude, p.weather,
        p.weekend ? 1 : 0, JSON.stringify(p.pickupLocations), JSON.stringify(p.tags),
        JSON.stringify(p.itinerary), JSON.stringify(p.inclusions), JSON.stringify(p.exclusions),
        JSON.stringify(p.thingsToCarry)
      );
    }

    const insertCategory = db.prepare(
      "INSERT INTO categories (id, label, icon, tagline, description, image, accent, glow) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
    );
    for (const c of categories) {
      insertCategory.run(c.id, c.label, c.icon, c.tagline, c.description, c.image, c.accent, c.glow);
    }

    const insertTrip = db.prepare(`
      INSERT INTO completed_trips (id, slug, title, organizer, category, state, location,
        start_date, dates_label, duration_label, difficulty, groups_from, cost_label,
        image, gallery, temples, highlights, itinerary)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    for (const t of completedTrips) {
      insertTrip.run(
        t.id, t.slug, t.title, t.organizer, JSON.stringify(t.category), t.state,
        t.location, t.startDate, t.datesLabel, t.durationLabel, t.difficulty,
        JSON.stringify(t.groupsFrom), t.costLabel, t.image, JSON.stringify(t.gallery),
        JSON.stringify(t.temples), JSON.stringify(t.highlights), JSON.stringify(t.itinerary)
      );
    }

    const insertCoupon = db.prepare(
      "INSERT INTO coupons (code, discount_percent, description, active) VALUES (?, ?, ?, ?)"
    );
    for (const c of coupons) {
      insertCoupon.run(c.code, c.discountPercent, c.description, c.active ? 1 : 0);
    }
  });

  insertMany();
  console.log("[BTT] Database seeded with initial data");
}

seedIfEmpty();

// ─── Blog seed + packages available_dates backfill ─────────────────────────
function seedBlogAndBackfill() {
  // blog_posts
  try {
    const bc = db.prepare("SELECT COUNT(*) as c FROM blog_posts").get() as { c: number };
    if (bc.c === 0) {
      const posts: Array<[string, string, string, string, string, string, string, string, number]> = [
        [
          "top-10-treks-karnataka",
          "Top 10 Treks in Karnataka You Must Try",
          "From Kudremukh to Kumara Parvatha — our curated list of Karnataka's most rewarding trails, with difficulty and best season.",
          `# Top 10 Treks in Karnataka\n\nKarnataka's Western Ghats hide some of India's most beautiful trails.\n\n## 1. Kudremukh\nGrassland summit, misty valleys.\n\n## 2. Kumara Parvatha\nA true test of endurance.\n\n> Tip: Start early and carry 2L water.\n\n*Book your trek via /packages?category=trekking.*`,
          "trekking",
          "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1600&auto=format&fit=crop",
          "2026-03-10",
          "Bharath Treks Team",
          1,
        ],
        [
          "temple-yatras-south-india",
          "Divine Temple Yatras of South India",
          "Tirupati to Madurai — pilgrimage routes, rituals, and practical tips for first-time yatris.",
          `# Temple Yatras of South India\n\nSouth India's temple towns blend devotion and architecture.\n\n## Tirupati\nSpecial entry darshan guide.\n\n## Madurai\nMeenakshi heritage walk.\n\n*Explore spiritual packages via /packages?category=spiritual.*`,
          "spiritual",
          "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?q=80&w=1600&auto=format&fit=crop",
          "2026-02-22",
          "Bharath Treks Team",
          1,
        ],
        [
          "coorg-couple-getaway-guide",
          "Coorg: The Perfect Couple Getaway",
          "Waterfalls, homestays and candlelight dinners — plan your Coorg retreat step-by-step.",
          `# Coorg Couple Getaway\n\nAbbey Falls, Mallalli Falls, private valley homestay.\n\n*See package: Coorg Waterfalls Couple Retreat.*`,
          "couples",
          "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=1600&auto=format&fit=crop",
          "2026-01-18",
          "Bharath Treks Team",
          1,
        ],
        [
          "family-hill-stations-tamil-nadu",
          "Family-Friendly Hill Stations in Tamil Nadu",
          "Kodaikanal and beyond — where to stay, what to eat, and how to keep kids happy on the trail.",
          `# Family Hill Stations — Tamil Nadu\n\nKodaikanal lake boating, Pillar Rocks, bonfire.\n\n*Family packages via /packages?category=family.*`,
          "family",
          "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=1600&auto=format&fit=crop",
          "2026-01-05",
          "Bharath Treks Team",
          1,
        ],
      ];
      const ins = db.prepare("INSERT INTO blog_posts (slug,title,excerpt,content,category,image,date,author,published) VALUES (?,?,?,?,?,?,?,?,?)");
      const trx = db.transaction(() => { for (const p of posts) ins.run(...p); });
      trx();
      console.log("[BTT] Blog posts seeded");
    }
  } catch (e) { console.warn("[BTT] blog seed skipped", e); }
  // backfill packages.available_dates if empty
  try {
    const cols = db.prepare("PRAGMA table_info(packages)").all() as { name: string }[];
    if (cols.some((c) => c.name === "available_dates")) {
      const rows: Array<{ id: string; available_dates: string | null }> = db.prepare("SELECT id, available_dates FROM packages").all() as any;
      const upd = db.prepare("UPDATE packages SET available_dates = ? WHERE id = ?");
      const defaultDates = JSON.stringify(["2026-08-02","2026-08-03","2026-08-09","2026-08-10","2026-08-16"]);
      let did = 0;
      for (const r of rows) {
        if (!r.available_dates || r.available_dates === "[]" || r.available_dates === "") {
          upd.run(defaultDates, r.id); did++;
        }
      }
      if (did) console.log(`[BTT] Backfilled available_dates for ${did} packages`);
    }
  } catch (e) { console.warn("[BTT] available_dates backfill skipped", e); }
}
seedBlogAndBackfill();

export default db;
