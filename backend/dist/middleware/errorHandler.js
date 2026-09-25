"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
exports.createError = createError;
function errorHandler(err, _req, res, 
// eslint-disable-next-line @typescript-eslint/no-unused-vars
_next) {
    const statusCode = err.statusCode ?? 500;
    const message = err.message ?? "Internal Server Error";
    console.error(`\x1b[31m[BTT ERROR]\x1b[0m ${statusCode} — ${message}`);
    res.status(statusCode).json({
        success: false,
        error: message,
    });
}
function createError(message, statusCode = 500) {
    const err = new Error(message);
    err.statusCode = statusCode;
    return err;
}
//# sourceMappingURL=errorHandler.js.map