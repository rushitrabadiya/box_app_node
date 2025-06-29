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
    this.stack = new Error().stack;
  }

  static badRequest(message: string, details?: any): ApiError {
    return new ApiError(400, message, undefined, details);
  }

  static unauthorized(message: string, details?: any): ApiError {
    return new ApiError(401, message, undefined, details);
  }

  static forbidden(message: string, details?: any): ApiError {
    return new ApiError(403, message, undefined, details);
  }

  static notFound(message: string, details?: any): ApiError {
    return new ApiError(404, message, undefined, details);
  }

  static internal(message: string, details?: any): ApiError {
    return new ApiError(500, message, undefined, details);
  }

  static internalServerError(message: string, details?: any): ApiError {
    return new ApiError(500, message, undefined, details);
  }
}
