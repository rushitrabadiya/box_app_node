import { omit } from './../utils/common';
import { Request, Response, NextFunction } from 'express';
import { MINUTE_MS, OTP_EXPIRY_MINUTES, TOKEN_TYPES } from '../constants/app';
import { sendSuccess } from '../utils/apiResponse';
import crypto from 'crypto';
import { ApiError } from '../utils/apiError';
import {
  comparePassword,
  generatePasswordResetToken,
  hashPassword,
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from '../utils/auth';
import { FRONTEND_URL } from '../constants/app';
import { sendEmail, sendOtpEmail } from '../utils/email';
import { AUTH_ERROR_MESSAGES, USER_ERROR_MESSAGES } from '../constants/errorMessages';
import { AUTH_SUCCESS_MESSAGES, USER_SUCCESS_MESSAGES } from '../constants/successMessages';
import { User } from '../models/mongo/user.model';
import { generateOtp } from '../utils/common';
import { StatusCode } from '../constants/statusCodes';
import { buildResetPasswordEmail } from '../utils/mailer';
import { TokenModel } from '../models/mongo/token.model';

export class AuthController {
  async requestOtp(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email } = req.body;
      const otp = generateOtp();
      const otpExpiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * MINUTE_MS);

      const user = await User.findOne({ email, isDeleted: false });
      if (!user) {
        return next(ApiError.notFound(USER_ERROR_MESSAGES.USER_NOT_FOUND));
      }

      await User.updateOne(
        { _id: user.id },
        {
          otp,
          otpExpiresAt,
        },
      );
      // Send OTP via email
      sendOtpEmail(email, otp, OTP_EXPIRY_MINUTES);

      sendSuccess(res, null, StatusCode.OK, AUTH_SUCCESS_MESSAGES.OTP_SENT);
    } catch (err) {
      return next(ApiError.internal(err instanceof Error ? err.message : String(err)));
    }
  }

  async verifyOtp(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, otp } = req.body;

      const user = await User.findOne({ email, isDeleted: false });

      if (!user) {
        return next(ApiError.notFound(USER_ERROR_MESSAGES.USER_NOT_FOUND));
      }

      if (user.otp !== otp) {
        return next(ApiError.badRequest(AUTH_ERROR_MESSAGES.INVALID_OTP));
      }

      if (user.otpExpiresAt && user.otpExpiresAt < new Date()) {
        return next(ApiError.badRequest(AUTH_ERROR_MESSAGES.OTP_EXPIRED));
      }

      await User.updateOne(
        { _id: user.id },
        {
          emailVerified: true,
          otp: null,
          otpExpires: null,
        },
      );

      sendSuccess(res, null, StatusCode.OK, AUTH_SUCCESS_MESSAGES.EMAIL_VERIFIED);
    } catch (err) {
      return next(ApiError.internal(err instanceof Error ? err.message : String(err)));
    }
  }

  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const reqData = { ...req.body, ...req.query };
      const user = await User.findOne({ email: reqData.email });

      if (reqData.isAdmin) {
        const exitsAdmin = await User.findOne({ isAdmin: true, isDeleted: false });
        if (exitsAdmin) return next(ApiError.badRequest(USER_ERROR_MESSAGES.ADMIN_ALREADY_EXITS));
      }

      if (user) {
        return next(ApiError.badRequest(USER_ERROR_MESSAGES.USER_ALREADY_EXISTS));
      }

      const hashedPassword = await hashPassword(reqData.password);

      const otp = generateOtp();
      const otpExpiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * MINUTE_MS);

      const newUser = await User.create({
        ...reqData,
        password: hashedPassword,
        otp,
        otpExpiresAt,
      });

      // Send OTP via email
      sendOtpEmail(reqData.email, otp, OTP_EXPIRY_MINUTES);

      const accessToken = signAccessToken(newUser.id);
      const refreshToken = signRefreshToken(newUser.id);

      const REFRESH_TOKEN_VALIDITY_MINUTES: number = parseInt(
        process.env.REFRESH_TOKEN_EXPIRY || '7d',
        10,
      );
      // Store refresh token in the database
      await TokenModel.create({
        userId: newUser.id,
        token: crypto.createHash('sha256').update(refreshToken).digest('hex'),
        expiryDate: new Date(Date.now() + REFRESH_TOKEN_VALIDITY_MINUTES * MINUTE_MS),
        name: TOKEN_TYPES.REFRESH,
        createdBy: newUser.id,
        updatedBy: newUser.id,
      });
      const safeUser = omit(newUser.toObject(), ['otp', 'otpExpiresAt', 'password']);
      sendSuccess(
        res,
        {
          accessToken,
          refreshToken,
          safeUser,
        },
        StatusCode.CREATED,
        AUTH_SUCCESS_MESSAGES.REGISTRATION_SUCCESS,
      );
    } catch (err) {
      return next(ApiError.internal(err instanceof Error ? err.message : String(err)));
    }
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({
        email,
        isBlocked: false,
        isDeleted: false,
        isActive: true,
      });

      if (!user) {
        return next(ApiError.notFound(USER_ERROR_MESSAGES.USER_NOT_FOUND));
      }

      const isPasswordValid = await comparePassword(password, user.password as string);
      if (!isPasswordValid) {
        return next(ApiError.badRequest(AUTH_ERROR_MESSAGES.INVALID_CREDENTIALS));
      }

      if (!user.emailVerified) {
        const otp = generateOtp();
        const otpExpiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * MINUTE_MS);
        await User.updateOne(
          { _id: user.id },
          {
            otp,
            otpExpiresAt,
          },
        );
        // Send OTP via email
        sendOtpEmail(email, otp, OTP_EXPIRY_MINUTES);
        sendSuccess(
          res,
          {
            accessToken: null,
            refreshToken: null,
            isOtpVerified: false,
          },
          StatusCode.UNAUTHORIZED,
          AUTH_ERROR_MESSAGES.PLEASE_VERIFY_YOUR_EMAIL_AND_PHONE,
        );
        return;
        // return next(
        //   ApiError.unauthorized(AUTH_ERROR_MESSAGES.PLEASE_VERIFY_YOUR_EMAIL_AND_PHONE, {
        //     isOtpVerified: false,
        //   }),
        // );
      }
      const safeUser = omit(user.toObject(), ['otp', 'otpExpiresAt', 'password']);
      const accessToken = signAccessToken(user.id);
      const refreshToken = signRefreshToken(user.id);

      const REFRESH_TOKEN_VALIDITY_MINUTES: number = parseInt(
        process.env.REFRESH_TOKEN_EXPIRY || '7d',
        10,
      );
      // Store refresh token in the database
      await TokenModel.create({
        userId: user.id,
        token: crypto.createHash('sha256').update(refreshToken).digest('hex'),
        expiryDate: new Date(Date.now() + REFRESH_TOKEN_VALIDITY_MINUTES * MINUTE_MS),
        name: TOKEN_TYPES.REFRESH,
        createdBy: user.id,
        updatedBy: user.id,
      });

      sendSuccess(
        res,
        {
          accessToken,
          refreshToken,
          safeUser,
        },
        StatusCode.OK,
        AUTH_SUCCESS_MESSAGES.LOGIN_SUCCESS,
      );
    } catch (err) {
      return next(ApiError.internal(err instanceof Error ? err.message : String(err)));
    }
  }

  async refreshToken(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const reqData = { ...req.body, ...req.query };

      const userId = verifyRefreshToken(reqData.refreshToken);
      if (!userId) {
        return next(ApiError.unauthorized(AUTH_ERROR_MESSAGES.INVALID_REFRESH_TOKEN));
      }

      const accessToken = signAccessToken(userId);
      sendSuccess(res, accessToken, StatusCode.OK, AUTH_SUCCESS_MESSAGES.TOKEN_REFRESHED);
    } catch (err) {
      return next(ApiError.internal(err instanceof Error ? err.message : String(err)));
    }
  }

  async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { refreshToken } = { ...req.body, ...req.query, ...req.params };

      if (!refreshToken) {
        return next(ApiError.badRequest(AUTH_ERROR_MESSAGES.MISSING_REFRESH_TOKEN));
      }
      //token remove
      const hashedToken = crypto.createHash('sha256').update(refreshToken).digest('hex');
      await TokenModel.findOneAndDelete({
        userId: req.user?._id,
        expiryDate: { $gt: new Date() },
        token: hashedToken,
        name: TOKEN_TYPES.REFRESH,
      });
      sendSuccess(res, null, StatusCode.OK, USER_SUCCESS_MESSAGES.USER_LOGOUT_SUCCESS);
    } catch (err) {
      return next(ApiError.internal(err instanceof Error ? err.message : String(err)));
    }
  }

  async forgotPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email } = req.body;
      const user = await User.findOne({ email, isDeleted: false });
      if (!user) {
        return next(ApiError.notFound(USER_ERROR_MESSAGES.USER_NOT_FOUND));
      }
      const { token, hashedToken, expiry } = generatePasswordResetToken();

      await TokenModel.create({
        userId: user._id,
        token: hashedToken,
        expiryDate: expiry,
        name: TOKEN_TYPES.RESET_PASSWORD,
        createdBy: user._id,
        updatedBy: user._id,
      });

      // Email details
      const validateTime = 15;
      // const resetLink = `https://yourdomain.com/reset-password/${token}`;
      // const resetLink = `http://192.168.162.120:4000/api/v1/auth/reset-password/${token}`;
      const resetLink = `${FRONTEND_URL}/auth/reset-password/${token}`;

      const subject = 'Reset Your Password';
      const html = buildResetPasswordEmail(resetLink, validateTime);

      sendEmail(user.email, subject, html);
      sendSuccess(res, null, StatusCode.OK, AUTH_SUCCESS_MESSAGES.PASSWORD_RESET_LINK_SENT);
    } catch (err) {
      return next(ApiError.internal(err instanceof Error ? err.message : String(err)));
    }
  }

  async changePassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { oldPassword, newPassword } = req.body;
      const userId = req.user?._id;

      if (!userId) {
        return next(ApiError.unauthorized(USER_ERROR_MESSAGES.USER_NOT_FOUND));
      }

      const user = await User.findById(userId);
      if (!user || user.isDeleted) {
        return next(ApiError.notFound(USER_ERROR_MESSAGES.USER_NOT_FOUND));
      }

      const isPasswordValid = await comparePassword(oldPassword, user.password as string);
      if (!isPasswordValid) {
        return next(ApiError.unauthorized(AUTH_ERROR_MESSAGES.INVALID_CREDENTIALS));
      }

      const hashedNewPassword = await hashPassword(newPassword);
      user.password = hashedNewPassword;
      await user.save();

      sendSuccess(res, null, StatusCode.OK, AUTH_SUCCESS_MESSAGES.PASSWORD_CHANGED);
    } catch (err) {
      return next(ApiError.internal(err instanceof Error ? err.message : String(err)));
    }
  }

  async resetPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const reqData = { ...req.body, ...req.query, ...req.params };
      const hashedToken = crypto.createHash('sha256').update(reqData.token).digest('hex');

      const tokenDoc = await TokenModel.findOne({
        token: hashedToken,
        name: TOKEN_TYPES.RESET_PASSWORD,
        expiryDate: { $gt: new Date() },
      });
      if (!tokenDoc) {
        return next(ApiError.unauthorized(AUTH_ERROR_MESSAGES.INVALID_RESET_TOKEN));
      }

      const user = await User.findById(tokenDoc.userId);
      if (!user || user.isDeleted) {
        return next(ApiError.notFound(USER_ERROR_MESSAGES.USER_NOT_FOUND));
      }

      const hashedNewPassword = await hashPassword(reqData.newPassword);
      user.password = hashedNewPassword;
      await user.save();

      await TokenModel.deleteOne({ _id: tokenDoc._id });
      if (req.headers['content-type']?.includes('application/x-www-form-urlencoded')) {
        res.send(`<h2>Password reset successful!</h2>`);
      } else {
        sendSuccess(res, null, StatusCode.OK, AUTH_SUCCESS_MESSAGES.PASSWORD_RESET_SUCCESS);
      }
      // sendSuccess(res, null, StatusCode.OK, AUTH_SUCCESS_MESSAGES.PASSWORD_RESET_SUCCESS);
    } catch (err) {
      return next(ApiError.internal(err instanceof Error ? err.message : String(err)));
    }
  }
}

export const authController = new AuthController();
