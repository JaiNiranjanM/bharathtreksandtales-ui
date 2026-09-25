"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = __importDefault(require("../db"));
const errorHandler_1 = require("../middleware/errorHandler");
const router = (0, express_1.Router)();
const stateSvgIdToName = {
    ap: "Andhra Pradesh",
    ka: "Karnataka",
    kl: "Kerala",
    mh: "Maharashtra",
    tn: "Tamil Nadu",
};
const states = ["Tamil Nadu", "Karnataka", "Kerala", "Andhra Pradesh", "Maharashtra"];
// ─── GET /api/explore/states ──────────────────────────────────────────────────
router.get("/states", (_req, res, next) => {
    try {
        res.json({ success: true, data: states, svgIdMap: stateSvgIdToName });
    }
    catch (err) {
        next(err);
    }
});
// ─── GET /api/explore/states/:state/summary ───────────────────────────────────
router.get("/states/:state/summary", (req, res, next) => {
    try {
        const state = req.params.state;
        const stateName = decodeURIComponent(state);
        const resolvedState = stateSvgIdToName[stateName.toLowerCase()] ?? stateName;
        if (!states.includes(resolvedState)) {
            return next((0, errorHandler_1.createError)(`State "${resolvedState}" not found`, 404));
        }
        const countRow = db_1.default.prepare("SELECT COUNT(*) as count FROM packages WHERE state = ?").get(resolvedState);
        const totalPackages = countRow.count;
        const templeRows = db_1.default.prepare("SELECT temples FROM packages WHERE state = ?").all(resolvedState);
        const temples = templeRows
            .flatMap((row) => {
            try {
                return JSON.parse(row.temples);
            }
            catch {
                return [];
            }
        });
        const trekRows = db_1.default.prepare("SELECT title FROM packages WHERE state = ? AND category LIKE '%trekking%'").all(resolvedState);
        const treks = trekRows.map((r) => r.title);
        const summary = {
            totalPackages,
            temples,
            treks,
        };
        res.json({ success: true, state: resolvedState, data: summary });
    }
    catch (err) {
        next(err);
    }
});
exports.default = router;
//# sourceMappingURL=explore.js.map