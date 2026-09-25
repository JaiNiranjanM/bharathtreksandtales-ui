import { Router, type Request, type Response, type NextFunction } from "express";
import { z } from "zod";
import { createError } from "../middleware/errorHandler";
import db from "../db";

const router = Router();

const SubscribeSchema = z.object({
  email: z.string().email("Please provide a valid email address"),
});

// ─── POST /api/newsletter/subscribe ──────────────────────────────────────────
router.post("/subscribe", (req: Request, res: Response, next: NextFunction) => {
  try {
    const parseResult = SubscribeSchema.safeParse(req.body);
    if (!parseResult.success) {
      return next(createError(parseResult.error.issues[0].message, 400));
    }

    const { email } = parseResult.data;

    const existing = db.prepare("SELECT * FROM newsletter_subscribers WHERE email = ?").get(email);

    if (existing) {
      return res.json({
        success: true,
        message: "You're already subscribed to our newsletter!",
        alreadySubscribed: true,
      });
    }

    db.prepare("INSERT INTO newsletter_subscribers (email, subscribed_at) VALUES (?, ?)").run(email, new Date().toISOString());
    console.log(`[BTT] Newsletter subscriber: ${email}`);

    res.status(201).json({
      success: true,
      message: "Welcome aboard! You're now subscribed to Bharath Treks & Tales.",
      alreadySubscribed: false,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
