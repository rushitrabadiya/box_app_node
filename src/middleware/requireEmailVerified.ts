import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './authenticateJwt';
import { StatusCode } from '../constants/statusCodes';

export const requireEmailVerified = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): void => {
  if (!req.user?.isEmailVerified) {
    res.status(StatusCode.FORBIDDEN).json({ error: 'Email not verified' });
    return;
  }
  next();
};
