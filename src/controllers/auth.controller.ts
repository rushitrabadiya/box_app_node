import { Request, Response, NextFunction } from 'express';
import { PgUser } from '../models/pg/user.model';
import { MINUTE_MS, OTP_EXPIRY_MINUTES } from '../constants/app';
import { sendSuccess } from '../utils/apiResponse';
import { ApiError } from '../utils/apiError';
import { signAccessToken, signRefreshToken } from '../utils/auth';
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import { FRONTEND_URL } from '../constants/app';
import { sendEmail } from '../utils/email';
import { AUTH_ERROR_MESSAGES, USER_ERROR_MESSAGES } from '../constants/errorMessages';
import { AUTH_SUCCESS_MESSAGES } from '../constants/successMessages';

export class AuthController {
  private generateOtp = () => String(Math.floor(100000 + Math.random() * 900000));

  async requestOtp(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { phone } = req.body;
      const otp = this.generateOtp();
      const otpExpires = new Date(Date.now() + OTP_EXPIRY_MINUTES * MINUTE_MS);

      await PgUser.upsert({ phone, otp, otpExpires, isPhoneVerified: false, name: '' });

      console.log(`OTP for ${phone}: ${otp}`);

      sendSuccess(res, { message: AUTH_SUCCESS_MESSAGES.OTP_SENT });
    } catch (err) {
      return next(ApiError.internal(err instanceof Error ? err.message : String(err)));
    }
  }

  async verifyOtp(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { phone, otp } = req.body;

      const user = await PgUser.findOne({ where: { phone } });

      if (!user) {
        return next(ApiError.notFound(USER_ERROR_MESSAGES.USER_NOT_FOUND));
      }

      if (user.otp !== otp) {
        return next(ApiError.badRequest(AUTH_ERROR_MESSAGES.INVALID_OTP));
      }

      if (user.otpExpires && user.otpExpires < new Date()) {
        return next(ApiError.badRequest(AUTH_ERROR_MESSAGES.OTP_EXPIRED));
      }

      await user.update({
        isPhoneVerified: true,
        otp: '',
        otpExpires: null,
      });

      sendSuccess(res, { message: AUTH_SUCCESS_MESSAGES.PHONE_VERIFIED });
    } catch (err) {
      return next(ApiError.internal(err instanceof Error ? err.message : String(err)));
    }
  }

  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { name, email, phone, password } = req.body;
      const user = await PgUser.findOne({ where: { phone } });

      if (user) {
        return next(ApiError.badRequest(USER_ERROR_MESSAGES.USER_ALREADY_EXISTS));
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const emailVerificationToken = crypto.randomBytes(32).toString('hex') as string;
      const otp = this.generateOtp();
      const otpExpires = new Date(Date.now() + OTP_EXPIRY_MINUTES * MINUTE_MS);

      const newUser = await PgUser.create({
        name,
        email,
        phone,
        passwordHash: hashedPassword,
        emailVerificationToken,
        otp,
        otpExpires,
        isPhoneVerified: false,
        isEmailVerified: false,
      });

      // Send verification email
      const verificationLink = `${FRONTEND_URL}/verify-email?token=${emailVerificationToken}`;
      await sendEmail(
        email,
        'Verify your email',
        `
        <h3>Verify your email</h3>
        <p>Please click the link below to verify your email:</p>
        <a href="${verificationLink}">${verificationLink}</a>
      `,
      );

      console.log(`OTP for ${phone}: ${otp}`);

      sendSuccess(res, { message: AUTH_SUCCESS_MESSAGES.REGISTRATION_SUCCESS });
    } catch (err) {
      return next(ApiError.internal(err instanceof Error ? err.message : String(err)));
    }
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password } = req.body;
      const user = await PgUser.findOne({ where: { email } });

      if (!user) {
        return next(ApiError.notFound(USER_ERROR_MESSAGES.USER_NOT_FOUND));
      }

      const isPasswordValid = await bcrypt.compare(password, user.passwordHash as string);
      if (!isPasswordValid) {
        return next(ApiError.unauthorized(AUTH_ERROR_MESSAGES.INVALID_CREDENTIALS));
      }

      if (!user.isEmailVerified || !user.isPhoneVerified) {
        return next(ApiError.unauthorized(AUTH_ERROR_MESSAGES.PLEASE_VERIFY_YOUR_EMAIL_AND_PHONE));
      }

      const accessToken = signAccessToken(user.id);
      const refreshToken = signRefreshToken(user.id);

      await user.update({ refreshToken });

      sendSuccess(res, {
        message: AUTH_SUCCESS_MESSAGES.LOGIN_SUCCESS,
        accessToken,
        refreshToken,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
        },
      });
    } catch (err) {
      return next(ApiError.internal(err instanceof Error ? err.message : String(err)));
    }
  }
}

export const authController = new AuthController();
export default new AuthController();
