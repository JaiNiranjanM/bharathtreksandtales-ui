"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = authenticate;
exports.authorize = authorize;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = __importDefault(require("../db"));
const errorHandler_1 = require("./errorHandler");
const JWT_SECRET = process.env.JWT_SECRET ?? 'btt-dev-secret-change-in-production';
function authenticate(req, _res, next) {
    const auth = req.headers.authorization;
    if (!auth?.startsWith('Bearer '))
        return next((0, errorHandler_1.createError)('Not authenticated', 401));
    try {
        const decoded = jsonwebtoken_1.default.verify(auth.slice(7), JWT_SECRET);
        // Ensure user exists
        const u = db_1.default.prepare('SELECT id FROM users WHERE id = ?').get(decoded.userId);
        if (!u)
            return next((0, errorHandler_1.createError)('User not found', 404));
        req.user = decoded;
        next();
    }
    catch {
        next((0, errorHandler_1.createError)('Invalid or expired token', 401));
    }
}
function authorize(...roles) {
    return (req, _res, next) => {
        if (!req.user)
            return next((0, errorHandler_1.createError)('Not authenticated', 401));
        if (roles.length && !roles.includes(req.user.role))
            return next((0, errorHandler_1.createError)('Forbidden', 403));
        next();
    };
}
//# sourceMappingURL=auth.js.map