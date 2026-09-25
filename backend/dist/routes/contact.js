"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const zod_1 = require("zod");
const db_1 = __importDefault(require("../db"));
const errorHandler_1 = require("../middleware/errorHandler");
const router = (0, express_1.Router)();
const schema = zod_1.z.object({
    name: zod_1.z.string().min(2, 'Name must be at least 2 characters'),
    email: zod_1.z.string().email('Invalid email'),
    message: zod_1.z.string().min(10, 'Message must be at least 10 characters').max(2000),
});
router.post('/', (req, res, next) => {
    try {
        const parsed = schema.safeParse(req.body);
        if (!parsed.success)
            return next((0, errorHandler_1.createError)(parsed.error.errors[0].message, 400));
        const { name, email, message } = parsed.data;
        const id = crypto.randomUUID();
        const created_at = new Date().toISOString();
        db_1.default.prepare('INSERT INTO contacts (id,name,email,message,created_at,status) VALUES (?,?,?,?,?,?)').run(id, name, email, message, created_at, 'new');
        console.log(`[BTT] Contact from ${name} <${email}>: ${message.slice(0, 80)}`);
        res.status(201).json({ success: true, message: 'Thank you! We will get back to you within 24 hours.', id });
    }
    catch (err) {
        next(err);
    }
});
router.get('/', (_req, res) => {
    const rows = db_1.default.prepare('SELECT * FROM contacts ORDER BY created_at DESC LIMIT 100').all();
    res.json({ success: true, count: rows.length, data: rows });
});
exports.default = router;
//# sourceMappingURL=contact.js.map