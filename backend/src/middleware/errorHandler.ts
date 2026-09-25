import type { Request, Response, NextFunction } from "express";

export interface AppError extends Error {
  statusCode?: number;
}

export function errorHandler(
  err: AppError,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
): void {
  const statusCode = err.statusCode ?? 500;
  const message = err.message ?? "Internal Server Error";

  console.error(`\x1b[31m[BTT ERROR]\x1b[0m ${statusCode} — ${message}`);

  res.status(statusCode).json({
    success: false,
    error: message,
  });
}

export function createError(message: string, statusCode = 500): AppError {
  const err: AppError = new Error(message);
  err.statusCode = statusCode;
  return err;
}
