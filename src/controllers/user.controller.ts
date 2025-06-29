import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/apiError';
import { PgUser } from '../models/pg/user.model';
import { sendSuccess } from '../utils/apiResponse';
import { USER_SUCCESS_MESSAGES } from '../constants/successMessages';

class UserController {
  async createUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { name, phone } = req.body;

      const user = await PgUser.create({
        name,
        phone,
        isPhoneVerified: false,
        isEmailVerified: false,
        email: '',
        passwordHash: '',
        emailVerificationToken: '',
        otp: '',
        otpExpires: null,
        refreshToken: '',
      });

      sendSuccess(res, { message: USER_SUCCESS_MESSAGES.USER_CREATED, user }, 201);
    } catch (err) {
      return next(ApiError.internal(err instanceof Error ? err.message : String(err)));
    }
  }
}

export const userController = new UserController();
