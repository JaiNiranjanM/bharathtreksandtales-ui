import "dotenv/config";
import express from "express";
import cors from "cors";

import "./db"; // initialize database + seed
import { requestLogger } from "./middleware/requestLogger";
import { errorHandler } from "./middleware/errorHandler";

import packagesRouter from "./routes/packages";
import categoriesRouter from "./routes/categories";
import exploreRouter from "./routes/explore";
import completedTripsRouter from "./routes/completedTrips";
import bookingsRouter from "./routes/bookings";
import couponsRouter from "./routes/coupons";
import newsletterRouter from "./routes/newsletter";
import authRouter from "./routes/auth";
import contactRouter from "./routes/contact";
import blogRouter from "./routes/blog";
import wishlistRouter from "./routes/wishlist";
import paymentsRouter from "./routes/payments";
import searchRouter from "./routes/search";

const app = express();
const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;
const FRONTEND_URL = process.env.FRONTEND_URL ?? "http://localhost:3000";

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(
  cors({
    origin: [FRONTEND_URL, "http://localhost:3000", "http://localhost:3001"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

// ─── Health check ─────────────────────────────────────────────────────────────
app.get("/", (_req, res) => {
  res.json({
    status: "ok",
    service: "Bharath Treks & Tales API",
    version: "2.0.0",
    timestamp: new Date().toISOString(),
  });
});

app.get("/health", (_req, res) => {
  res.json({ status: "healthy", uptime: process.uptime() });
});

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use("/api/packages", packagesRouter);
app.use("/api/categories", categoriesRouter);
app.use("/api/explore", exploreRouter);
app.use("/api/completed-trips", completedTripsRouter);
app.use("/api/bookings", bookingsRouter);
app.use("/api/coupons", couponsRouter);
app.use("/api/newsletter", newsletterRouter);
app.use("/api/auth", authRouter);
app.use("/api/contact", contactRouter);
app.use("/api/blog", blogRouter);
app.use("/api/wishlist", wishlistRouter);
app.use("/api/payments", paymentsRouter);
app.use("/api/search", searchRouter);

// ─── 404 handler ─────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ success: false, error: "Route not found" });
});

// ─── Global error handler ─────────────────────────────────────────────────────
app.use(errorHandler);

// ─── Start server ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\x1b[36m`);
  console.log(`  🏔  Bharath Treks & Tales API`);
  console.log(`  ─────────────────────────────`);
  console.log(`  ✓  Server running on http://localhost:${PORT}`);
  console.log(`  ✓  Accepting requests from ${FRONTEND_URL}`);
  console.log(`  ✓  Environment: ${process.env.NODE_ENV ?? "development"}`);
  console.log(`  ✓  Database: SQLite (better-sqlite3)`);
  console.log(`\x1b[0m`);
});

export default app;
