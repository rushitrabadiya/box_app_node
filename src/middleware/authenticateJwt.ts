import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/auth';
import { StatusCode } from '../constants/statusCodes';
import { AUTH_ERROR_MESSAGES, USER_ERROR_MESSAGES } from '../constants/errorMessages';
import { IUserDocument, User } from '../models/mongo/user.model';
import { omit } from '../utils/common';

export const authenticateJwt = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(StatusCode.UNAUTHORIZED).json({ error: AUTH_ERROR_MESSAGES.MISSING_TOKEN });
      return;
    }

    const token = authHeader.split(' ')[1];
    const payload = verifyToken<{ sub: string; type: string }>(token);
    if (!payload || payload.type !== 'access') throw new Error(AUTH_ERROR_MESSAGES.INVALID_TOKEN);

    const user = await User.findById(payload.sub);
    if (!user || user.isDeleted || !user.isActive || user.isBlocked) {
      throw new Error(USER_ERROR_MESSAGES.USER_NOT_FOUND);
    }
    req.user = omit(user, ['password']);
    next();
  } catch (err) {
    res.status(StatusCode.UNAUTHORIZED).json({ error: AUTH_ERROR_MESSAGES.INVALID_TOKEN });
  }
};

export const verifyUser = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.user) {
    res.status(StatusCode.UNAUTHORIZED).json({ error: USER_ERROR_MESSAGES.USER_NOT_FOUND });
    return;
  }

  if (!req.user.phoneVerified && !req.user.emailVerified) {
    res.status(StatusCode.FORBIDDEN).json({ error: AUTH_ERROR_MESSAGES.USER_NOT_VERIFIED });
    return;
  }
  next();
};
