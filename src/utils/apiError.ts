import { ApiErrorType } from '../types/apiError';

export class ApiError extends Error implements ApiErrorType {
  public readonly name: 'ApiError' = 'ApiError';
  public readonly stack: string | undefined;

  constructor(
    public statusCode: number = 500,
    public message: string,
    public code?: string,
    public details?: any,
  ) {
    super(message);
    Object.setPrototypeOf(this, ApiError.prototype);
    this.stack = new Error().stack;
  }

  static badRequest(message: string, details?: any): ApiError {
    return new ApiError(400, message, 'BAD_REQUEST', details);
  }

  static unauthorized(message: string, details?: any): ApiError {
    return new ApiError(401, message, 'UNAUTHORIZED', details);
  }

  static forbidden(message: string, details?: any): ApiError {
    return new ApiError(403, message, 'FORBIDDEN', details);
  }

  static notFound(message: string, details?: any): ApiError {
    return new ApiError(404, message, 'NOT_FOUND', details);
  }

  static internal(message: string, details?: any): ApiError {
    return new ApiError(500, message, 'INTERNAL_SERVER_ERROR', details);
  }

  static internalServerError(message: string, details?: any): ApiError {
    return new ApiError(500, message, 'INTERNAL_SERVER_ERROR', details);
  }
}
