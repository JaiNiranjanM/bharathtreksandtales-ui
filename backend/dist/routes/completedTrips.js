"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = __importDefault(require("../db"));
const errorHandler_1 = require("../middleware/errorHandler");
const JSON_FIELDS = ["category", "groups_from", "gallery", "temples", "highlights", "itinerary"];
function parseRow(row) {
    for (const field of JSON_FIELDS) {
        if (typeof row[field] === "string") {
            row[field] = JSON.parse(row[field]);
        }
    }
    return row;
}
const router = (0, express_1.Router)();
router.get("/", (_req, res, next) => {
    try {
        const rows = db_1.default.prepare("SELECT * FROM completed_trips ORDER BY start_date DESC").all();
        res.json({ success: true, count: rows.length, data: rows.map(parseRow) });
    }
    catch (err) {
        next(err);
    }
});
router.get("/:slug", (req, res, next) => {
    try {
        const slug = req.params.slug;
        const row = db_1.default.prepare("SELECT * FROM completed_trips WHERE slug = ?").get(slug);
        if (!row)
            return next((0, errorHandler_1.createError)("Completed trip not found", 404));
        res.json({ success: true, data: parseRow(row) });
    }
    catch (err) {
        next(err);
    }
});
exports.default = router;
//# sourceMappingURL=completedTrips.js.map