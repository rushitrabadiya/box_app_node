import { Request, Response, NextFunction } from 'express';
import { ApiError, ApiResponse } from '../utils/apiResponse';

export const errorHandler = (
  err: Error | ApiError,
  _req: Request,
  res: Response<ApiResponse<null>>,
  _next: NextFunction,
) => {
  const status = err instanceof ApiError ? err.statusCode : 500;
  console.error(err);
  res.status(status).json({ success: false, error: err.message });
};
