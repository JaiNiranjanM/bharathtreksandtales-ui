"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = __importDefault(require("../db"));
const errorHandler_1 = require("../middleware/errorHandler");
const router = (0, express_1.Router)();
const getAllStmt = db_1.default.prepare("SELECT * FROM categories");
const getByIdStmt = db_1.default.prepare("SELECT * FROM categories WHERE id = ?");
// ─── GET /api/categories ──────────────────────────────────────────────────────
router.get("/", (_req, res, next) => {
    try {
        const data = getAllStmt.all();
        res.json({ success: true, count: data.length, data });
    }
    catch (err) {
        next(err);
    }
});
// ─── GET /api/categories/:id ──────────────────────────────────────────────────
router.get("/:id", (req, res, next) => {
    try {
        const category = getByIdStmt.get(req.params.id);
        if (!category)
            return next((0, errorHandler_1.createError)("Category not found", 404));
        res.json({ success: true, data: category });
    }
    catch (err) {
        next(err);
    }
});
exports.default = router;
//# sourceMappingURL=categories.js.map