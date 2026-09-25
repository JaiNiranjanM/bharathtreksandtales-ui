"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = __importDefault(require("../db"));
const errorHandler_1 = require("../middleware/errorHandler");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.use(auth_1.authenticate);
// GET /api/wishlist
router.get('/', (req, res, next) => {
    try {
        const userId = req.user.userId;
        const rows = db_1.default.prepare('SELECT package_id FROM wishlists WHERE user_id = ? ORDER BY created_at DESC').all(userId);
        res.json({ success: true, data: rows.map((r) => r.package_id) });
    }
    catch (err) {
        next(err);
    }
});
// POST /api/wishlist { packageId }
router.post('/', (req, res, next) => {
    try {
        const userId = req.user.userId;
        const { packageId } = req.body;
        if (!packageId)
            return next((0, errorHandler_1.createError)('packageId required', 400));
        // ensure package exists
        const pkg = db_1.default.prepare('SELECT id FROM packages WHERE id = ? OR slug = ?').get(packageId, packageId);
        const pid = pkg ? pkg.id : packageId;
        const id = crypto.randomUUID();
        const created_at = new Date().toISOString();
        try {
            db_1.default.prepare('INSERT INTO wishlists (id,user_id,package_id,created_at) VALUES (?,?,?,?)').run(id, userId, pid, created_at);
        }
        catch (e) {
            if (String(e.message).includes('UNIQUE'))
                return res.json({ success: true, message: 'Already in wishlist' });
            throw e;
        }
        res.status(201).json({ success: true, message: 'Added to wishlist' });
    }
    catch (err) {
        next(err);
    }
});
// DELETE /api/wishlist/:packageId
router.delete('/:packageId', (req, res, next) => {
    try {
        const userId = req.user.userId;
        const { packageId } = req.params;
        db_1.default.prepare('DELETE FROM wishlists WHERE user_id = ? AND package_id = ?').run(userId, packageId);
        res.json({ success: true, message: 'Removed from wishlist' });
    }
    catch (err) {
        next(err);
    }
});
exports.default = router;
//# sourceMappingURL=wishlist.js.map