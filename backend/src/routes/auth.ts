import { Router, type Request, type Response, type NextFunction } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { z } from "zod";
import db from "../db";
import { createError } from "../middleware/errorHandler";
import { isValidAadhaar } from "../utils/aadhaar";
import { isValidCountry } from "../utils/countries";

const router = Router();

const JWT_SECRET = process.env.JWT_SECRET ?? "btt-dev-secret-change-in-production";
const JWT_EXPIRES_IN = "7d";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["user", "vendor", "guide"]).default("user"),
  phone: z.string().default(""),
  phoneCode: z.string().regex(/^\+\d{1,4}$/).default("+91"),
  location: z.string().default(""),
  country: z.string().default("India"),
  bio: z.string().default(""),
  aadhaar: z.string().optional(),
  profileData: z.unknown().optional(),
});

// ─── Role-specific profile data ──────────────────────────────────────────────
const travellerProfileSchema = z.object({
  interests: z.array(z.string()).min(1, "Pick at least one travel interest"),
  fitnessLevel: z.enum(["beginner", "moderate", "experienced"]),
  medicalInfo: z.string().default(""),
  emergencyName: z.string().min(2, "Emergency contact name is required"),
  emergencyPhone: z.string().min(6, "Emergency contact phone is required"),
});

const vendorProfileSchema = z.object({
  businessName: z.string().min(2, "Business name is required"),
  businessType: z.enum(["stay", "transport", "food", "activity", "other"]),
  yearsInBusiness: z.coerce.number().int().min(0).max(100),
  serviceRegions: z.array(z.string()).min(1, "Add at least one service region"),
  capacity: z.coerce.number().int().min(1, "Capacity must be at least 1"),
  priceRange: z.string().default(""),
  taxId: z.string().min(4, "Tax / registration ID is required"),
});

const guideProfileSchema = z.object({
  yearsExperience: z.coerce.number().int().min(0).max(80),
  languages: z.array(z.string()).min(1, "Pick at least one language"),
  specializations: z.array(z.string()).min(1, "Pick at least one specialization"),
  operatingRegions: z.array(z.string()).min(1, "Add at least one operating region"),
});

const profileSchemas = {
  user: travellerProfileSchema,
  vendor: vendorProfileSchema,
  guide: guideProfileSchema,
} as const;

function parseProfileData(role: "user" | "vendor" | "guide", data: unknown) {
  return profileSchemas[role].safeParse(data ?? {});
}

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

const profileUpdateSchema = z.object({
  role: z.enum(["user", "vendor", "guide"]).optional(),
  phone: z.string().optional(),
  phoneCode: z.string().regex(/^\+\d{1,4}$/).optional(),
  location: z.string().optional(),
  country: z.string().optional(),
  bio: z.string().optional(),
  avatar: z.string().optional(),
  profileCompleted: z.boolean().optional(),
  email: z.string().email().optional(),
  aadhaar: z.string().optional(),
  profileData: z.unknown().optional(),
});

interface UserRow {
  id: string;
  name: string;
  email: string;
  password: string;
  role: string;
  phone: string;
  phone_code: string;
  country: string;
  bio: string;
  avatar: string;
  location: string;
  profile_completed: number;
  aadhaar_hash: string;
  aadhaar_last4: string;
  aadhaar_verified: number;
  email_verified: number;
  pending_email: string;
  email_verify_token: string;
  email_verify_expires: string;
  reset_token: string;
  reset_expires: string;
  profile_data: string;
  created_at: string;
}

function signToken(userId: string, role: string): string {
  return jwt.sign({ userId, role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

function parseStoredProfileData(raw: unknown): Record<string, unknown> {
  if (!raw) return {};
  try {
    const parsed = JSON.parse(String(raw));
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function sanitizeUser(row: UserRow) {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    role: row.role,
    phone: row.phone,
    phoneCode: (row as any).phone_code ?? "+91",
    country: (row as any).country ?? "India",
    bio: row.bio,
    avatar: row.avatar,
    location: row.location,
    profileCompleted: !!row.profile_completed,
    aadhaarLast4: (row as any).aadhaar_last4 ?? "",
    aadhaarVerified: !!((row as any).aadhaar_verified),
    emailVerified: !!((row as any).email_verified),
    pendingEmail: (row as any).pending_email ?? "",
    profileData: parseStoredProfileData((row as any).profile_data),
  };
}

function hashAadhaar(aadhaar: string): string {
  const salt = process.env.AADHAAR_SALT ?? "btt-aadhaar-salt";
  return crypto.createHash("sha256").update(salt + aadhaar).digest("hex");
}

// ─── POST /api/auth/register ─────────────────────────────────────────────────
router.post("/register", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
      return next(createError(parsed.error.errors[0].message, 400));
    }

    const { name, email, password, role, phone, phoneCode, location, country, bio, aadhaar, profileData } = parsed.data;

    const existing = db.prepare("SELECT * FROM users WHERE email = ?").get(email);
    if (existing) {
      return next(createError("An account with this email already exists", 409));
    }
    if (country && !isValidCountry(country)) return next(createError("Invalid country", 400));
    const profileParsed = parseProfileData(role, profileData);
    if (!profileParsed.success) {
      return next(createError(profileParsed.error.errors[0].message, 400));
    }
    let aadhaarHash = ""; let aadhaarLast4 = ""; let aadhaarVerified = 0;
    if (aadhaar) {
      if (!isValidAadhaar(aadhaar)) return next(createError("Invalid Aadhaar number (must be 12 digits)", 400));
      aadhaarHash = hashAadhaar(aadhaar);
      const dup = db.prepare("SELECT id FROM users WHERE aadhaar_hash = ?").get(aadhaarHash) as any;
      if (dup) return next(createError("Aadhaar already linked to another account", 409));
      aadhaarLast4 = aadhaar.slice(-4);
      aadhaarVerified = 1;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const id = crypto.randomUUID();
    const created_at = new Date().toISOString();

    db.prepare(
      "INSERT INTO users (id, name, email, password, role, phone, phone_code, location, country, bio, aadhaar_hash, aadhaar_last4, aadhaar_verified, email_verified, profile_completed, profile_data, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
    ).run(id, name, email, hashedPassword, role, phone, phoneCode, location, country, bio, aadhaarHash, aadhaarLast4, aadhaarVerified, 1, 1, JSON.stringify(profileParsed.data), created_at);

    const token = signToken(id, role);
    const row = db.prepare("SELECT * FROM users WHERE id = ?").get(id) as UserRow;

    res.status(201).json({
      success: true,
      data: {
        user: sanitizeUser(row),
        token,
      },
    });
  } catch (err) {
    next(err);
  }
});

// ─── POST /api/auth/login ────────────────────────────────────────────────────
router.post("/login", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      return next(createError(parsed.error.errors[0].message, 400));
    }

    const { email, password } = parsed.data;

    const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email) as UserRow | undefined;

    if (!user) {
      return next(createError("Invalid email or password", 401));
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return next(createError("Invalid email or password", 401));
    }

    const token = signToken(user.id, user.role);

    res.json({
      success: true,
      data: {
        user: sanitizeUser(user),
        token,
      },
    });
  } catch (err) {
    next(err);
  }
});

// ─── GET /api/auth/me ────────────────────────────────────────────────────────
router.get("/me", (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      return next(createError("Not authenticated", 401));
    }

    const token = authHeader.slice(7);
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; role: string };

    const user = db.prepare("SELECT * FROM users WHERE id = ?").get(decoded.userId) as UserRow | undefined;
    if (!user) return next(createError("User not found", 404));

    res.json({ success: true, data: sanitizeUser(user) });
  } catch (err) {
    next(createError("Invalid or expired token", 401));
  }
});

// ─── PUT /api/auth/profile ───────────────────────────────────────────────────
router.put("/profile", (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      return next(createError("Not authenticated", 401));
    }

    const token = authHeader.slice(7);
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; role: string };

    const parsed = profileUpdateSchema.safeParse(req.body);
    if (!parsed.success) {
      return next(createError(parsed.error.errors[0].message, 400));
    }

    const updates = parsed.data as any;
    const setClauses: string[] = [];
    const values: unknown[] = [];
    let emailPendingInfo: { token: string } | null = null;

    if (updates.role !== undefined) { setClauses.push("role = ?"); values.push(updates.role); }
    if (updates.phone !== undefined) { setClauses.push("phone = ?"); values.push(updates.phone); }
    if (updates.phoneCode !== undefined) { setClauses.push("phone_code = ?"); values.push(updates.phoneCode); }
    if (updates.location !== undefined) { setClauses.push("location = ?"); values.push(updates.location); }
    if (updates.country !== undefined) {
      if (!isValidCountry(updates.country)) return next(createError("Invalid country", 400));
      setClauses.push("country = ?"); values.push(updates.country);
    }
    if (updates.bio !== undefined) { setClauses.push("bio = ?"); values.push(updates.bio); }
    if (updates.avatar !== undefined) { setClauses.push("avatar = ?"); values.push(updates.avatar); }
    if (updates.profileCompleted !== undefined) {
      setClauses.push("profile_completed = ?");
      values.push(updates.profileCompleted ? 1 : 0);
    }
    if (updates.aadhaar !== undefined) {
      if (updates.aadhaar === "") {
        setClauses.push("aadhaar_hash = ?"); values.push("");
        setClauses.push("aadhaar_last4 = ?"); values.push("");
        setClauses.push("aadhaar_verified = ?"); values.push(0);
      } else {
        if (!isValidAadhaar(updates.aadhaar)) return next(createError("Invalid Aadhaar number (must be 12 digits)", 400));
        const h = hashAadhaar(updates.aadhaar);
        const dup = db.prepare("SELECT id FROM users WHERE aadhaar_hash = ? AND id != ?").get(h, decoded.userId) as any;
        if (dup) return next(createError("Aadhaar already linked to another account", 409));
        setClauses.push("aadhaar_hash = ?"); values.push(h);
        setClauses.push("aadhaar_last4 = ?"); values.push(updates.aadhaar.slice(-4));
        setClauses.push("aadhaar_verified = ?"); values.push(1);
      }
    }
    if (updates.profileData !== undefined || updates.role !== undefined) {
      const currentProfile = db.prepare("SELECT role, profile_data FROM users WHERE id = ?").get(decoded.userId) as any;
      const effectiveRole = ((updates.role ?? currentProfile?.role ?? "user") as "user" | "vendor" | "guide");
      if (updates.profileData !== undefined) {
        const patch = (updates.profileData ?? {}) as Record<string, unknown>;
        const merged = { ...parseStoredProfileData(currentProfile?.profile_data), ...patch };
        const pp = parseProfileData(effectiveRole, merged);
        if (!pp.success) return next(createError(pp.error.errors[0].message, 400));
        setClauses.push("profile_data = ?"); values.push(JSON.stringify(pp.data));
      }
    }
    if (updates.email !== undefined) {
      const current = db.prepare("SELECT email FROM users WHERE id = ?").get(decoded.userId) as any;
      if (current && current.email !== updates.email) {
        const exists = db.prepare("SELECT id FROM users WHERE email = ?").get(updates.email) as any;
        if (exists) return next(createError("Email already taken", 409));
        const token = crypto.randomBytes(32).toString("hex");
        const expires = new Date(Date.now() + 60 * 60 * 1000).toISOString();
        setClauses.push("pending_email = ?"); values.push(updates.email);
        setClauses.push("email_verify_token = ?"); values.push(token);
        setClauses.push("email_verify_expires = ?"); values.push(expires);
        setClauses.push("email_verified = ?"); values.push(0);
        emailPendingInfo = { token };
        console.log(`[BTT] Email verification token for ${updates.email}: ${token} (expires ${expires}) — GET /api/auth/verify-email?token=${token}`);
      }
    }

    if (setClauses.length === 0) {
      return next(createError("No fields to update", 400));
    }

    values.push(decoded.userId);
    db.prepare(`UPDATE users SET ${setClauses.join(", ")} WHERE id = ?`).run(...values);

    const user = db.prepare("SELECT * FROM users WHERE id = ?").get(decoded.userId) as UserRow;
    const response: any = { success: true, data: sanitizeUser(user) };
    if (emailPendingInfo) {
      response.message = "Verification email sent to your new address (check server log for token in dev).";
      // expose token in dev for UX
      if (process.env.NODE_ENV !== "production") response.verifyToken = emailPendingInfo.token;
    }
    res.json(response);
  } catch (err) {
    next(err);
  }
});

// ─── POST /api/auth/verify-aadhaar ───────────────────────────────────────────
router.post("/verify-aadhaar", (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) return next(createError("Not authenticated", 401));
    const decoded = jwt.verify(authHeader.slice(7), JWT_SECRET) as { userId: string };
    const { aadhaar } = req.body as { aadhaar: string };
    if (!aadhaar || !isValidAadhaar(aadhaar)) return next(createError("Invalid Aadhaar number (must be 12 digits)", 400));
    const h = hashAadhaar(aadhaar);
    const dup = db.prepare("SELECT id FROM users WHERE aadhaar_hash = ? AND id != ?").get(h, decoded.userId) as any;
    if (dup) return next(createError("Aadhaar already linked elsewhere", 409));
    db.prepare("UPDATE users SET aadhaar_hash=?, aadhaar_last4=?, aadhaar_verified=1 WHERE id=?").run(h, aadhaar.slice(-4), decoded.userId);
    const user = db.prepare("SELECT * FROM users WHERE id=?").get(decoded.userId) as UserRow;
    res.json({ success: true, data: sanitizeUser(user) });
  } catch (err) { next(createError("Invalid token", 401)); }
});

// ─── POST /api/auth/verify-email ─────────────────────────────────────────────
router.post("/verify-email", (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token } = req.body as { token: string };
    if (!token) return next(createError("Token required", 400));
    const row = db.prepare("SELECT * FROM users WHERE email_verify_token = ?").get(token) as UserRow | undefined;
    if (!row) return next(createError("Invalid token", 400));
    if (row.email_verify_expires && new Date(row.email_verify_expires) < new Date()) return next(createError("Token expired", 400));
    db.prepare("UPDATE users SET email=pending_email, pending_email='', email_verify_token='', email_verify_expires='', email_verified=1 WHERE id=?").run(row.id);
    const updated = db.prepare("SELECT * FROM users WHERE id=?").get(row.id) as UserRow;
    res.json({ success: true, data: sanitizeUser(updated) });
  } catch (err) { next(err); }
});
router.get("/verify-email", (req: Request, res: Response, next: NextFunction) => {
  // convenience GET for link click
  const token = req.query.token as string;
  (req.body as any) = { token };
  // delegate
  const authHeader = req.headers.authorization;
  // allow without auth via token lookup only
  try {
    if (!token) return next(createError("Token required", 400));
    const row = db.prepare("SELECT * FROM users WHERE email_verify_token = ?").get(token) as UserRow | undefined;
    if (!row) return next(createError("Invalid token", 400));
    if (row.email_verify_expires && new Date(row.email_verify_expires) < new Date()) return next(createError("Token expired", 400));
    db.prepare("UPDATE users SET email=pending_email, pending_email='', email_verify_token='', email_verify_expires='', email_verified=1 WHERE id=?").run(row.id);
    const updated = db.prepare("SELECT * FROM users WHERE id=?").get(row.id) as UserRow;
    res.json({ success: true, data: sanitizeUser(updated) });
  } catch (err) { next(err); }
});

// ─── POST /api/auth/forgot-password ──────────────────────────────────────────
router.post("/forgot-password", (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body as { email: string };
    if (!email) return next(createError("Email required", 400));
    const user = db.prepare("SELECT * FROM users WHERE email=?").get(email) as UserRow | undefined;
    // always respond success to avoid enumeration
    if (user) {
      const token = crypto.randomBytes(32).toString("hex");
      const expires = new Date(Date.now() + 60 * 60 * 1000).toISOString();
      db.prepare("UPDATE users SET reset_token=?, reset_expires=? WHERE id=?").run(token, expires, user.id);
      console.log(`[BTT] Password reset token for ${email}: ${token} — POST /api/auth/reset-password {token, password}`);
    }
    res.json({ success: true, message: "If that email exists, a reset link has been sent (check server log in dev)." });
  } catch (err) { next(err); }
});

// ─── POST /api/auth/reset-password ───────────────────────────────────────────
router.post("/reset-password", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token, password } = req.body as { token: string; password: string };
    if (!token || !password || password.length < 6) return next(createError("Token and password (min 6) required", 400));
    const user = db.prepare("SELECT * FROM users WHERE reset_token=?").get(token) as UserRow | undefined;
    if (!user) return next(createError("Invalid token", 400));
    if (user.reset_expires && new Date(user.reset_expires) < new Date()) return next(createError("Token expired", 400));
    const hashed = await bcrypt.hash(password, 10);
    db.prepare("UPDATE users SET password=?, reset_token='', reset_expires='' WHERE id=?").run(hashed, user.id);
    res.json({ success: true, message: "Password reset successful. Please log in." });
  } catch (err) { next(err); }
});

export default router;
