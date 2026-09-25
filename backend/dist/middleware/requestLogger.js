"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestLogger = requestLogger;
function requestLogger(req, res, next) {
    const start = Date.now();
    res.on("finish", () => {
        const duration = Date.now() - start;
        const color = res.statusCode >= 500
            ? "\x1b[31m" // red
            : res.statusCode >= 400
                ? "\x1b[33m" // yellow
                : "\x1b[32m"; // green
        console.log(`${color}[BTT API]\x1b[0m ${req.method} ${req.originalUrl} → ${res.statusCode} (${duration}ms)`);
    });
    next();
}
//# sourceMappingURL=requestLogger.js.map