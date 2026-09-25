"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = __importDefault(require("../db"));
const router = (0, express_1.Router)();
router.get('/', (req, res, next) => {
    try {
        const q = req.query.q?.trim().toLowerCase();
        if (!q)
            return res.json({ success: true, data: { packages: [], blog: [] } });
        const like = `%${q}%`;
        const packages = db_1.default.prepare('SELECT * FROM packages WHERE LOWER(title) LIKE ? OR LOWER(location) LIKE ? OR LOWER(state) LIKE ? LIMIT 10').all(like, like, like);
        const blogs = db_1.default.prepare('SELECT slug,title,excerpt,category,image,date FROM blog_posts WHERE published=1 AND (LOWER(title) LIKE ? OR LOWER(excerpt) LIKE ?) LIMIT 10').all(like, like);
        // simple mapper
        function mapPkg(r) {
            try {
                return { id: r.id, slug: r.slug, title: r.title, state: r.state, location: r.location, image: r.image, discountPrice: r.discount_price };
            }
            catch {
                return r;
            }
        }
        res.json({ success: true, data: { packages: packages.map(mapPkg), blog: blogs } });
    }
    catch (err) {
        next(err);
    }
});
exports.default = router;
//# sourceMappingURL=search.js.map