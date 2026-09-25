"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = __importDefault(require("../db"));
const errorHandler_1 = require("../middleware/errorHandler");
const router = (0, express_1.Router)();
router.get('/', (req, res, next) => {
    try {
        const { category, query } = req.query;
        const conditions = ['published = 1'];
        const params = [];
        if (category && typeof category === 'string' && category !== 'all') {
            conditions.push('category = ?');
            params.push(category);
        }
        if (query && typeof query === 'string' && query.trim()) {
            const q = `%${query.toLowerCase()}%`;
            conditions.push('(LOWER(title) LIKE ? OR LOWER(excerpt) LIKE ?)');
            params.push(q, q);
        }
        const sql = `SELECT * FROM blog_posts WHERE ${conditions.join(' AND ')} ORDER BY date DESC`;
        const rows = db_1.default.prepare(sql).all(...params);
        res.json({ success: true, count: rows.length, data: rows });
    }
    catch (err) {
        next(err);
    }
});
router.get('/:slug', (req, res, next) => {
    try {
        const row = db_1.default.prepare('SELECT * FROM blog_posts WHERE slug = ?').get(req.params.slug);
        if (!row)
            return next((0, errorHandler_1.createError)('Post not found', 404));
        res.json({ success: true, data: row });
    }
    catch (err) {
        next(err);
    }
});
exports.default = router;
//# sourceMappingURL=blog.js.map