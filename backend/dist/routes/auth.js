"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crypto_1 = __importDefault(require("crypto"));
const zod_1 = require("zod");
const db_1 = __importDefault(require("../db"));
const errorHandler_1 = require("../middleware/errorHandler");
const aadhaar_1 = require("../utils/aadhaar");
const countries_1 = require("../utils/countries");
const router = (0, express_1.Router)();
const JWT_SECRET = process.env.JWT_SECRET ?? "btt-dev-secret-change-in-production";
const JWT_EXPIRES_IN = "7d";
const registerSchema = zod_1.z.object({
    name: zod_1.z.string().min(2, "Name must be at least 2 characters"),
    email: zod_1.z.string().email("Invalid email address"),
    password: zod_1.z.string().min(6, "Password must be at least 6 characters"),
    role: zod_1.z.enum(["user", "vendor", "guide"]).default("user"),
    phone: zod_1.z.string().default(""),
    phoneCode: zod_1.z.string().regex(/^\+\d{1,4}$/).default("+91"),
    location: zod_1.z.string().default(""),
    country: zod_1.z.string().default("India"),
    bio: zod_1.z.string().default(""),
    aadhaar: zod_1.z.string().optional(),
    profileData: zod_1.z.unknown().optional(),
});
// ─── Role-specific profile data ──────────────────────────────────────────────
const travellerProfileSchema = zod_1.z.object({
    interests: zod_1.z.array(zod_1.z.string()).min(1, "Pick at least one travel interest"),
    fitnessLevel: zod_1.z.enum(["beginner", "moderate", "experienced"]),
    medicalInfo: zod_1.z.string().default(""),
    emergencyName: zod_1.z.string().min(2, "Emergency contact name is required"),
    emergencyPhone: zod_1.z.string().min(6, "Emergency contact phone is required"),
});
const vendorProfileSchema = zod_1.z.object({
    businessName: zod_1.z.string().min(2, "Business name is required"),
    businessType: zod_1.z.enum(["stay", "transport", "food", "activity", "other"]),
    yearsInBusiness: zod_1.z.coerce.number().int().min(0).max(100),
    serviceRegions: zod_1.z.array(zod_1.z.string()).min(1, "Add at least one service region"),
    capacity: zod_1.z.coerce.number().int().min(1, "Capacity must be at least 1"),
    priceRange: zod_1.z.string().default(""),
    taxId: zod_1.z.string().min(4, "Tax / registration ID is required"),
});
const guideProfileSchema = zod_1.z.object({
    yearsExperience: zod_1.z.coerce.number().int().min(0).max(80),
    languages: zod_1.z.array(zod_1.z.string()).min(1, "Pick at least one language"),
    specializations: zod_1.z.array(zod_1.z.string()).min(1, "Pick at least one specialization"),
    operatingRegions: zod_1.z.array(zod_1.z.string()).min(1, "Add at least one operating region"),
});
const profileSchemas = {
    user: travellerProfileSchema,
    vendor: vendorProfileSchema,
    guide: guideProfileSchema,
};
function parseProfileData(role, data) {
    return profileSchemas[role].safeParse(data ?? {});
}
const loginSchema = zod_1.z.object({
    email: zod_1.z.string().email("Invalid email address"),
    password: zod_1.z.string().min(1, "Password is required"),
});
const profileUpdateSchema = zod_1.z.object({
    role: zod_1.z.enum(["user", "vendor", "guide"]).optional(),
    phone: zod_1.z.string().optional(),
    phoneCode: zod_1.z.string().regex(/^\+\d{1,4}$/).optional(),
    location: zod_1.z.string().optional(),
    country: zod_1.z.string().optional(),
    bio: zod_1.z.string().optional(),
    avatar: zod_1.z.string().optional(),
    profileCompleted: zod_1.z.boolean().optional(),
    email: zod_1.z.string().email().optional(),
    aadhaar: zod_1.z.string().optional(),
    profileData: zod_1.z.unknown().optional(),
});
function signToken(userId, role) {
    return jsonwebtoken_1.default.sign({ userId, role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}
function parseStoredProfileData(raw) {
    if (!raw)
        return {};
    try {
        const parsed = JSON.parse(String(raw));
        return parsed && typeof parsed === "object" ? parsed : {};
    }
    catch {
        return {};
    }
}
function sanitizeUser(row) {
    return {
        id: row.id,
        name: row.name,
        email: row.email,
        role: row.role,
        phone: row.phone,
        phoneCode: row.phone_code ?? "+91",
        country: row.country ?? "India",
        bio: row.bio,
        avatar: row.avatar,
        location: row.location,
        profileCompleted: !!row.profile_completed,
        aadhaarLast4: row.aadhaar_last4 ?? "",
        aadhaarVerified: !!(row.aadhaar_verified),
        emailVerified: !!(row.email_verified),
        pendingEmail: row.pending_email ?? "",
        profileData: parseStoredProfileData(row.profile_data),
    };
}
function hashAadhaar(aadhaar) {
    const salt = process.env.AADHAAR_SALT ?? "btt-aadhaar-salt";
    return crypto_1.default.createHash("sha256").update(salt + aadhaar).digest("hex");
}
// ─── POST /api/auth/register ─────────────────────────────────────────────────
router.post("/register", async (req, res, next) => {
    try {
        const parsed = registerSchema.safeParse(req.body);
        if (!parsed.success) {
            return next((0, errorHandler_1.createError)(parsed.error.errors[0].message, 400));
        }
        const { name, email, password, role, phone, phoneCode, location, country, bio, aadhaar, profileData } = parsed.data;
        const existing = db_1.default.prepare("SELECT * FROM users WHERE email = ?").get(email);
        if (existing) {
            return next((0, errorHandler_1.createError)("An account with this email already exists", 409));
        }
        if (country && !(0, countries_1.isValidCountry)(country))
            return next((0, errorHandler_1.createError)("Invalid country", 400));
        const profileParsed = parseProfileData(role, profileData);
        if (!profileParsed.success) {
            return next((0, errorHandler_1.createError)(profileParsed.error.errors[0].message, 400));
        }
        let aadhaarHash = "";
        let aadhaarLast4 = "";
        let aadhaarVerified = 0;
        if (aadhaar) {
            if (!(0, aadhaar_1.isValidAadhaar)(aadhaar))
                return next((0, errorHandler_1.createError)("Invalid Aadhaar number (must be 12 digits)", 400));
            aadhaarHash = hashAadhaar(aadhaar);
            const dup = db_1.default.prepare("SELECT id FROM users WHERE aadhaar_hash = ?").get(aadhaarHash);
            if (dup)
                return next((0, errorHandler_1.createError)("Aadhaar already linked to another account", 409));
            aadhaarLast4 = aadhaar.slice(-4);
            aadhaarVerified = 1;
        }
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        const id = crypto_1.default.randomUUID();
        const created_at = new Date().toISOString();
        db_1.default.prepare("INSERT INTO users (id, name, email, password, role, phone, phone_code, location, country, bio, aadhaar_hash, aadhaar_last4, aadhaar_verified, email_verified, profile_completed, profile_data, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)").run(id, name, email, hashedPassword, role, phone, phoneCode, location, country, bio, aadhaarHash, aadhaarLast4, aadhaarVerified, 1, 1, JSON.stringify(profileParsed.data), created_at);
        const token = signToken(id, role);
        const row = db_1.default.prepare("SELECT * FROM users WHERE id = ?").get(id);
        res.status(201).json({
            success: true,
            data: {
                user: sanitizeUser(row),
                token,
            },
        });
    }
    catch (err) {
        next(err);
    }
});
// ─── POST /api/auth/login ────────────────────────────────────────────────────
router.post("/login", async (req, res, next) => {
    try {
        const parsed = loginSchema.safeParse(req.body);
        if (!parsed.success) {
            return next((0, errorHandler_1.createError)(parsed.error.errors[0].message, 400));
        }
        const { email, password } = parsed.data;
        const user = db_1.default.prepare("SELECT * FROM users WHERE email = ?").get(email);
        if (!user) {
            return next((0, errorHandler_1.createError)("Invalid email or password", 401));
        }
        const valid = await bcrypt_1.default.compare(password, user.password);
        if (!valid) {
            return next((0, errorHandler_1.createError)("Invalid email or password", 401));
        }
        const token = signToken(user.id, user.role);
        res.json({
            success: true,
            data: {
                user: sanitizeUser(user),
                token,
            },
        });
    }
    catch (err) {
        next(err);
    }
});
// ─── GET /api/auth/me ────────────────────────────────────────────────────────
router.get("/me", (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader?.startsWith("Bearer ")) {
            return next((0, errorHandler_1.createError)("Not authenticated", 401));
        }
        const token = authHeader.slice(7);
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        const user = db_1.default.prepare("SELECT * FROM users WHERE id = ?").get(decoded.userId);
        if (!user)
            return next((0, errorHandler_1.createError)("User not found", 404));
        res.json({ success: true, data: sanitizeUser(user) });
    }
    catch (err) {
        next((0, errorHandler_1.createError)("Invalid or expired token", 401));
    }
});
// ─── PUT /api/auth/profile ───────────────────────────────────────────────────
router.put("/profile", (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader?.startsWith("Bearer ")) {
            return next((0, errorHandler_1.createError)("Not authenticated", 401));
        }
        const token = authHeader.slice(7);
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        const parsed = profileUpdateSchema.safeParse(req.body);
        if (!parsed.success) {
            return next((0, errorHandler_1.createError)(parsed.error.errors[0].message, 400));
        }
        const updates = parsed.data;
        const setClauses = [];
        const values = [];
        let emailPendingInfo = null;
        if (updates.role !== undefined) {
            setClauses.push("role = ?");
            values.push(updates.role);
        }
        if (updates.phone !== undefined) {
            setClauses.push("phone = ?");
            values.push(updates.phone);
        }
        if (updates.phoneCode !== undefined) {
            setClauses.push("phone_code = ?");
            values.push(updates.phoneCode);
        }
        if (updates.location !== undefined) {
            setClauses.push("location = ?");
            values.push(updates.location);
        }
        if (updates.country !== undefined) {
            if (!(0, countries_1.isValidCountry)(updates.country))
                return next((0, errorHandler_1.createError)("Invalid country", 400));
            setClauses.push("country = ?");
            values.push(updates.country);
        }
        if (updates.bio !== undefined) {
            setClauses.push("bio = ?");
            values.push(updates.bio);
        }
        if (updates.avatar !== undefined) {
            setClauses.push("avatar = ?");
            values.push(updates.avatar);
        }
        if (updates.profileCompleted !== undefined) {
            setClauses.push("profile_completed = ?");
            values.push(updates.profileCompleted ? 1 : 0);
        }
        if (updates.aadhaar !== undefined) {
            if (updates.aadhaar === "") {
                setClauses.push("aadhaar_hash = ?");
                values.push("");
                setClauses.push("aadhaar_last4 = ?");
                values.push("");
                setClauses.push("aadhaar_verified = ?");
                values.push(0);
            }
            else {
                if (!(0, aadhaar_1.isValidAadhaar)(updates.aadhaar))
                    return next((0, errorHandler_1.createError)("Invalid Aadhaar number (must be 12 digits)", 400));
                const h = hashAadhaar(updates.aadhaar);
                const dup = db_1.default.prepare("SELECT id FROM users WHERE aadhaar_hash = ? AND id != ?").get(h, decoded.userId);
                if (dup)
                    return next((0, errorHandler_1.createError)("Aadhaar already linked to another account", 409));
                setClauses.push("aadhaar_hash = ?");
                values.push(h);
                setClauses.push("aadhaar_last4 = ?");
                values.push(updates.aadhaar.slice(-4));
                setClauses.push("aadhaar_verified = ?");
                values.push(1);
            }
        }
        if (updates.profileData !== undefined || updates.role !== undefined) {
            const currentProfile = db_1.default.prepare("SELECT role, profile_data FROM users WHERE id = ?").get(decoded.userId);
            const effectiveRole = (updates.role ?? currentProfile?.role ?? "user");
            if (updates.profileData !== undefined) {
                const patch = (updates.profileData ?? {});
                const merged = { ...parseStoredProfileData(currentProfile?.profile_data), ...patch };
                const pp = parseProfileData(effectiveRole, merged);
                if (!pp.success)
                    return next((0, errorHandler_1.createError)(pp.error.errors[0].message, 400));
                setClauses.push("profile_data = ?");
                values.push(JSON.stringify(pp.data));
            }
        }
        if (updates.email !== undefined) {
            const current = db_1.default.prepare("SELECT email FROM users WHERE id = ?").get(decoded.userId);
            if (current && current.email !== updates.email) {
                const exists = db_1.default.prepare("SELECT id FROM users WHERE email = ?").get(updates.email);
                if (exists)
                    return next((0, errorHandler_1.createError)("Email already taken", 409));
                const token = crypto_1.default.randomBytes(32).toString("hex");
                const expires = new Date(Date.now() + 60 * 60 * 1000).toISOString();
                setClauses.push("pending_email = ?");
                values.push(updates.email);
                setClauses.push("email_verify_token = ?");
                values.push(token);
                setClauses.push("email_verify_expires = ?");
                values.push(expires);
                setClauses.push("email_verified = ?");
                values.push(0);
                emailPendingInfo = { token };
                console.log(`[BTT] Email verification token for ${updates.email}: ${token} (expires ${expires}) — GET /api/auth/verify-email?token=${token}`);
            }
        }
        if (setClauses.length === 0) {
            return next((0, errorHandler_1.createError)("No fields to update", 400));
        }
        values.push(decoded.userId);
        db_1.default.prepare(`UPDATE users SET ${setClauses.join(", ")} WHERE id = ?`).run(...values);
        const user = db_1.default.prepare("SELECT * FROM users WHERE id = ?").get(decoded.userId);
        const response = { success: true, data: sanitizeUser(user) };
        if (emailPendingInfo) {
            response.message = "Verification email sent to your new address (check server log for token in dev).";
            // expose token in dev for UX
            if (process.env.NODE_ENV !== "production")
                response.verifyToken = emailPendingInfo.token;
        }
        res.json(response);
    }
    catch (err) {
        next(err);
    }
});
// ─── POST /api/auth/verify-aadhaar ───────────────────────────────────────────
router.post("/verify-aadhaar", (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader?.startsWith("Bearer "))
            return next((0, errorHandler_1.createError)("Not authenticated", 401));
        const decoded = jsonwebtoken_1.default.verify(authHeader.slice(7), JWT_SECRET);
        const { aadhaar } = req.body;
        if (!aadhaar || !(0, aadhaar_1.isValidAadhaar)(aadhaar))
            return next((0, errorHandler_1.createError)("Invalid Aadhaar number (must be 12 digits)", 400));
        const h = hashAadhaar(aadhaar);
        const dup = db_1.default.prepare("SELECT id FROM users WHERE aadhaar_hash = ? AND id != ?").get(h, decoded.userId);
        if (dup)
            return next((0, errorHandler_1.createError)("Aadhaar already linked elsewhere", 409));
        db_1.default.prepare("UPDATE users SET aadhaar_hash=?, aadhaar_last4=?, aadhaar_verified=1 WHERE id=?").run(h, aadhaar.slice(-4), decoded.userId);
        const user = db_1.default.prepare("SELECT * FROM users WHERE id=?").get(decoded.userId);
        res.json({ success: true, data: sanitizeUser(user) });
    }
    catch (err) {
        next((0, errorHandler_1.createError)("Invalid token", 401));
    }
});
// ─── POST /api/auth/verify-email ─────────────────────────────────────────────
router.post("/verify-email", (req, res, next) => {
    try {
        const { token } = req.body;
        if (!token)
            return next((0, errorHandler_1.createError)("Token required", 400));
        const row = db_1.default.prepare("SELECT * FROM users WHERE email_verify_token = ?").get(token);
        if (!row)
            return next((0, errorHandler_1.createError)("Invalid token", 400));
        if (row.email_verify_expires && new Date(row.email_verify_expires) < new Date())
            return next((0, errorHandler_1.createError)("Token expired", 400));
        db_1.default.prepare("UPDATE users SET email=pending_email, pending_email='', email_verify_token='', email_verify_expires='', email_verified=1 WHERE id=?").run(row.id);
        const updated = db_1.default.prepare("SELECT * FROM users WHERE id=?").get(row.id);
        res.json({ success: true, data: sanitizeUser(updated) });
    }
    catch (err) {
        next(err);
    }
});
router.get("/verify-email", (req, res, next) => {
    // convenience GET for link click
    const token = req.query.token;
    req.body = { token };
    // delegate
    const authHeader = req.headers.authorization;
    // allow without auth via token lookup only
    try {
        if (!token)
            return next((0, errorHandler_1.createError)("Token required", 400));
        const row = db_1.default.prepare("SELECT * FROM users WHERE email_verify_token = ?").get(token);
        if (!row)
            return next((0, errorHandler_1.createError)("Invalid token", 400));
        if (row.email_verify_expires && new Date(row.email_verify_expires) < new Date())
            return next((0, errorHandler_1.createError)("Token expired", 400));
        db_1.default.prepare("UPDATE users SET email=pending_email, pending_email='', email_verify_token='', email_verify_expires='', email_verified=1 WHERE id=?").run(row.id);
        const updated = db_1.default.prepare("SELECT * FROM users WHERE id=?").get(row.id);
        res.json({ success: true, data: sanitizeUser(updated) });
    }
    catch (err) {
        next(err);
    }
});
// ─── POST /api/auth/forgot-password ──────────────────────────────────────────
router.post("/forgot-password", (req, res, next) => {
    try {
        const { email } = req.body;
        if (!email)
            return next((0, errorHandler_1.createError)("Email required", 400));
        const user = db_1.default.prepare("SELECT * FROM users WHERE email=?").get(email);
        // always respond success to avoid enumeration
        if (user) {
            const token = crypto_1.default.randomBytes(32).toString("hex");
            const expires = new Date(Date.now() + 60 * 60 * 1000).toISOString();
            db_1.default.prepare("UPDATE users SET reset_token=?, reset_expires=? WHERE id=?").run(token, expires, user.id);
            console.log(`[BTT] Password reset token for ${email}: ${token} — POST /api/auth/reset-password {token, password}`);
        }
        res.json({ success: true, message: "If that email exists, a reset link has been sent (check server log in dev)." });
    }
    catch (err) {
        next(err);
    }
});
// ─── POST /api/auth/reset-password ───────────────────────────────────────────
router.post("/reset-password", async (req, res, next) => {
    try {
        const { token, password } = req.body;
        if (!token || !password || password.length < 6)
            return next((0, errorHandler_1.createError)("Token and password (min 6) required", 400));
        const user = db_1.default.prepare("SELECT * FROM users WHERE reset_token=?").get(token);
        if (!user)
            return next((0, errorHandler_1.createError)("Invalid token", 400));
        if (user.reset_expires && new Date(user.reset_expires) < new Date())
            return next((0, errorHandler_1.createError)("Token expired", 400));
        const hashed = await bcrypt_1.default.hash(password, 10);
        db_1.default.prepare("UPDATE users SET password=?, reset_token='', reset_expires='' WHERE id=?").run(hashed, user.id);
        res.json({ success: true, message: "Password reset successful. Please log in." });
    }
    catch (err) {
        next(err);
    }
});
exports.default = router;
//# sourceMappingURL=auth.js.map