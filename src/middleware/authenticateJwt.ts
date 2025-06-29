import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/auth';
import { PgUser } from '../models/pg/user.model';
import { StatusCode } from '../constants/statusCodes';
import { AUTH_ERROR_MESSAGES, USER_ERROR_MESSAGES } from '../constants/errorMessages';

export interface AuthenticatedRequest extends Request {
  user?: PgUser;
}

export const authenticateJwt = async (
  req: AuthenticatedRequest,
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
    const payload = verifyToken<{ sub: number; type: string }>(token);
    if (!payload || payload.type !== 'access') throw new Error(AUTH_ERROR_MESSAGES.INVALID_TOKEN);

    const user = await PgUser.findByPk(payload.sub);
    if (!user) throw new Error(USER_ERROR_MESSAGES.USER_NOT_FOUND);

    req.user = user;
    next();
  } catch (err) {
    res.status(StatusCode.UNAUTHORIZED).json({ error: AUTH_ERROR_MESSAGES.INVALID_TOKEN });
  }
};
