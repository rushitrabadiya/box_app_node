export interface ApiError {
  statusCode: number;
  message: string;
  code?: string;
  details?: any;
  name: 'ApiError';
  stack?: string;
}

export namespace ApiError {
  export function badRequest(message: string, details?: any): ApiError;
  export function unauthorized(message: string, details?: any): ApiError;
  export function forbidden(message: string, details?: any): ApiError;
  export function notFound(message: string, details?: any): ApiError;
  export function internal(message: string, details?: any): ApiError;
}

export type ApiErrorType = ApiError;
