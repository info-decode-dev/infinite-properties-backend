import { Request, Response, NextFunction } from "express";

export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const statusCode = err instanceof AppError ? err.statusCode : 500;
  
  // Handle Prisma connection pool exhaustion errors
  let message = err.message || "Internal Server Error";
  let finalStatusCode = statusCode;
  
  if (err.message?.includes("MaxClientsInSessionMode") || 
      err.message?.includes("max clients reached") ||
      err.message?.includes("connection pool")) {
    finalStatusCode = 503; // Service Unavailable
    message = "Database connection pool is busy. Please try again in a moment.";
    
    // Log the error for monitoring
    console.error("Connection pool exhaustion detected:", {
      path: req.path,
      method: req.method,
      timestamp: new Date().toISOString(),
    });
  }

  res.status(finalStatusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

