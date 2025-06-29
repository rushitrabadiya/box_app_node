export class ApiError extends Error {
  statusCode: number;
  message: string;
  code?: string;
  details?: any;
}
