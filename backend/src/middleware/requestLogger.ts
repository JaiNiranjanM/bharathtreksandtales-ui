import type { Request, Response, NextFunction } from "express";

export function requestLogger(req: Request, res: Response, next: NextFunction): void {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    const color =
      res.statusCode >= 500
        ? "\x1b[31m" // red
        : res.statusCode >= 400
        ? "\x1b[33m" // yellow
        : "\x1b[32m"; // green
    console.log(
      `${color}[BTT API]\x1b[0m ${req.method} ${req.originalUrl} → ${res.statusCode} (${duration}ms)`
    );
  });
  next();
}
