import { StatusCode } from './../constants/statusCodes';
import { Response } from 'express';
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export class ApiError extends Error {
  statusCode: number;

  constructor(message: string, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const sendSuccess = <T>(
  res: Response,
  data: T,
  statusCode: StatusCode = StatusCode.OK,
  message: string = 'Success',
): void => {
  res.status(statusCode).json({
    success: true,
    message,
    statusCode,
    data,
  });
};
