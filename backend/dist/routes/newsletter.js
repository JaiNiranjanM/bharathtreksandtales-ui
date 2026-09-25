"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const zod_1 = require("zod");
const errorHandler_1 = require("../middleware/errorHandler");
const db_1 = __importDefault(require("../db"));
const router = (0, express_1.Router)();
const SubscribeSchema = zod_1.z.object({
    email: zod_1.z.string().email("Please provide a valid email address"),
});
// ─── POST /api/newsletter/subscribe ──────────────────────────────────────────
router.post("/subscribe", (req, res, next) => {
    try {
        const parseResult = SubscribeSchema.safeParse(req.body);
        if (!parseResult.success) {
            return next((0, errorHandler_1.createError)(parseResult.error.issues[0].message, 400));
        }
        const { email } = parseResult.data;
        const existing = db_1.default.prepare("SELECT * FROM newsletter_subscribers WHERE email = ?").get(email);
        if (existing) {
            return res.json({
                success: true,
                message: "You're already subscribed to our newsletter!",
                alreadySubscribed: true,
            });
        }
        db_1.default.prepare("INSERT INTO newsletter_subscribers (email, subscribed_at) VALUES (?, ?)").run(email, new Date().toISOString());
        console.log(`[BTT] Newsletter subscriber: ${email}`);
        res.status(201).json({
            success: true,
            message: "Welcome aboard! You're now subscribed to Bharath Treks & Tales.",
            alreadySubscribed: false,
        });
    }
    catch (err) {
        next(err);
    }
});
exports.default = router;
//# sourceMappingURL=newsletter.js.map