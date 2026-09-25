"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
require("./db"); // initialize database + seed
const requestLogger_1 = require("./middleware/requestLogger");
const errorHandler_1 = require("./middleware/errorHandler");
const packages_1 = __importDefault(require("./routes/packages"));
const categories_1 = __importDefault(require("./routes/categories"));
const explore_1 = __importDefault(require("./routes/explore"));
const completedTrips_1 = __importDefault(require("./routes/completedTrips"));
const bookings_1 = __importDefault(require("./routes/bookings"));
const coupons_1 = __importDefault(require("./routes/coupons"));
const newsletter_1 = __importDefault(require("./routes/newsletter"));
const auth_1 = __importDefault(require("./routes/auth"));
const contact_1 = __importDefault(require("./routes/contact"));
const blog_1 = __importDefault(require("./routes/blog"));
const wishlist_1 = __importDefault(require("./routes/wishlist"));
const payments_1 = __importDefault(require("./routes/payments"));
const search_1 = __importDefault(require("./routes/search"));
const app = (0, express_1.default)();
const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;
const FRONTEND_URL = process.env.FRONTEND_URL ?? "http://localhost:3000";
// ─── Middleware ───────────────────────────────────────────────────────────────
app.use((0, cors_1.default)({
    origin: [FRONTEND_URL, "http://localhost:3000", "http://localhost:3001"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(requestLogger_1.requestLogger);
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
app.use("/api/packages", packages_1.default);
app.use("/api/categories", categories_1.default);
app.use("/api/explore", explore_1.default);
app.use("/api/completed-trips", completedTrips_1.default);
app.use("/api/bookings", bookings_1.default);
app.use("/api/coupons", coupons_1.default);
app.use("/api/newsletter", newsletter_1.default);
app.use("/api/auth", auth_1.default);
app.use("/api/contact", contact_1.default);
app.use("/api/blog", blog_1.default);
app.use("/api/wishlist", wishlist_1.default);
app.use("/api/payments", payments_1.default);
app.use("/api/search", search_1.default);
// ─── 404 handler ─────────────────────────────────────────────────────────────
app.use((_req, res) => {
    res.status(404).json({ success: false, error: "Route not found" });
});
// ─── Global error handler ─────────────────────────────────────────────────────
app.use(errorHandler_1.errorHandler);
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
exports.default = app;
//# sourceMappingURL=index.js.map