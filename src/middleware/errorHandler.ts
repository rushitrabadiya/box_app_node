import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/apiError';

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
      code: err.code || 'INTERNAL_SERVER_ERROR',
      statusCode: err.statusCode, // ✅ this line added
      details: err.details || null,
    });
  } else {
    console.error('Unhandled Error:', err);
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong',
      code: 'INTERNAL_SERVER_ERROR',
      statusCode: 500, // ✅ add even for fallback
      details: null,
    });
  }
};
