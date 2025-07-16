import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/apiError';
import { sendSuccess } from '../utils/apiResponse';
import { USER_SUCCESS_MESSAGES } from '../constants/successMessages';
import { IUserDocument, User } from '../models/mongo/user.model';
import { StatusCode } from '../constants/statusCodes';
import { USER_ERROR_MESSAGES } from '../constants/errorMessages';
import { buildMongoFilter } from '../utils/queryBuilder';
import { generateOtp, generateStrongPassword } from '../utils/common';
import { MINUTE_MS, OTP_EXPIRY_MINUTES } from '../constants/app';
import { sendOtpEmail, sendPasswordEmail } from '../utils/email';
import { paginateQuery } from '../helpers/paginationHelper';
import { hashPassword } from '../utils/auth';

class UserController {
  async createUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const reqData = { ...req.body, ...req.query, ...req.params };

      const existingUser = await User.findOne({ email: reqData.email, isDeleted: false });
      if (existingUser) {
        return next(ApiError.badRequest(USER_ERROR_MESSAGES.USER_ALREADY_EXISTS));
      }
      if (reqData.isAdmin) {
        const exitsAdmin = await User.findOne({ isAdmin: true, isDeleted: false });
        if (exitsAdmin) return next(ApiError.badRequest(USER_ERROR_MESSAGES.ADMIN_ALREADY_EXITS));
      }

      const user = await User.create({ ...reqData, createdBy: req.user?._id });

      sendSuccess(res, user, StatusCode.CREATED, USER_SUCCESS_MESSAGES.USER_CREATED);
    } catch (err) {
      return next(ApiError.internal(err instanceof Error ? err.message : String(err)));
    }
  }

  async getUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.params.id;
      const user = await User.findById(userId).select('-password -otp -otpExpiresAt -createdBy');
      if (!user || user.isDeleted) {
        return next(ApiError.notFound(USER_ERROR_MESSAGES.USER_NOT_FOUND));
      }
      sendSuccess(res, user, StatusCode.OK, USER_SUCCESS_MESSAGES.USER_GET_SUCCESS);
    } catch (err) {
      return next(ApiError.internal(err instanceof Error ? err.message : String(err)));
    }
  }

  async getCurrentUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        return next(ApiError.unauthorized(USER_ERROR_MESSAGES.USER_NOT_FOUND));
      }
      const user = await User.findById(req.user._id).select(
        '-password -otp -otpExpiresAt -createdBy',
      );
      if (!user || user.isDeleted) {
        return next(ApiError.notFound(USER_ERROR_MESSAGES.USER_NOT_FOUND));
      }
      sendSuccess(res, user, StatusCode.OK, USER_SUCCESS_MESSAGES.USER_GET_SUCCESS);
    } catch (err) {
      return next(ApiError.internal(err instanceof Error ? err.message : String(err)));
    }
  }

  async getAllUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const reqData = { ...req.body, ...req.query, ...req.params };

      const searchQuery = buildMongoFilter(reqData, {
        allowedFields: ['email', 'city', 'country', 'state', 'zipCode'],
        baseQuery: { isDeleted: false, isActive: true },
        searchFields: ['name', 'email', 'phone'],
      });
      let users;
      if (reqData.isPaginated) {
        const query = User.find(searchQuery)
          .select('-password -otp -otpExpiresAt -createdBy')
          .sort({ createdAt: -1 });

        users = await paginateQuery(query, reqData);
      } else {
        users = await User.find(searchQuery)
          .select('-password -otp -otpExpiresAt -createdBy')
          .sort({ createdAt: -1 });
      }

      sendSuccess(res, users, StatusCode.OK, USER_SUCCESS_MESSAGES.USER_GET_SUCCESS);
    } catch (err) {
      return next(ApiError.internal(err instanceof Error ? err.message : String(err)));
    }
  }

  async deleteUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.params.id;
      const user = await User.findById(userId);
      if (!user || user.isDeleted) {
        return next(ApiError.notFound(USER_ERROR_MESSAGES.USER_NOT_FOUND));
      }
      user.isDeleted = true;
      await user.save();

      sendSuccess(res, null, StatusCode.OK, USER_SUCCESS_MESSAGES.USER_DELETED);
    } catch (err) {
      return next(ApiError.internal(err instanceof Error ? err.message : String(err)));
    }
  }

  async updateUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.params.id;
      const updateData = req.body;

      const user = await User.findById(userId);
      if (!user || user.isDeleted) {
        return next(ApiError.notFound(USER_ERROR_MESSAGES.USER_NOT_FOUND));
      }

      if (updateData.email) {
        const existingUser = await User.findOne({
          email: updateData.email,
          _id: { $ne: userId },
          isDeleted: false,
        });
        if (existingUser) {
          return next(ApiError.badRequest(USER_ERROR_MESSAGES.USER_ALREADY_EXISTS));
        }
        if (user.email !== updateData.email) {
          if (!updateData.emailVerified) updateData.emailVerified = false;
        }
      }
      if (updateData.isAdmin) {
        const exitsAdmin = await User.findOne({
          isAdmin: true,
          isDeleted: false,
          _id: { $ne: userId },
        });
        if (exitsAdmin) return next(ApiError.badRequest(USER_ERROR_MESSAGES.ADMIN_ALREADY_EXITS));
      }
      const updateUser = await User.findByIdAndUpdate(userId, updateData, {
        new: true,
      });
      if (updateUser?.emailVerified === false) {
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
        sendOtpEmail(updateUser.email, otp, OTP_EXPIRY_MINUTES);
      }
      sendSuccess(res, updateUser, StatusCode.OK, USER_SUCCESS_MESSAGES.USER_UPDATED);
    } catch (err) {
      return next(ApiError.internal(err instanceof Error ? err.message : String(err)));
    }
  }

  async registerUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const reqData = { ...req.body, ...req.query, ...req.params } as IUserDocument;

      const existingUser = await User.findOne({ email: reqData.email, isDeleted: false });
      if (existingUser) {
        return next(ApiError.badRequest(USER_ERROR_MESSAGES.USER_ALREADY_EXISTS));
      }
      if (reqData.isAdmin) {
        const exitsAdmin = await User.findOne({ isAdmin: true, isDeleted: false });
        if (exitsAdmin) return next(ApiError.badRequest(USER_ERROR_MESSAGES.ADMIN_ALREADY_EXITS));
      }
      reqData.otp = generateOtp();
      reqData.otpExpiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * MINUTE_MS);
      const password = generateStrongPassword();
      reqData.password = await hashPassword(password);
      const user = await User.create({ ...reqData, createdBy: req.user?._id });
      // Send OTP via email
      sendOtpEmail(user.email, user.otp, OTP_EXPIRY_MINUTES);
      // Send password via email
      sendPasswordEmail(user.email, password);

      sendSuccess(res, user, StatusCode.CREATED, USER_SUCCESS_MESSAGES.USER_REGISTERED);
    } catch (err) {
      return next(ApiError.internal(err instanceof Error ? err.message : String(err)));
    }
  }
}

export const userController = new UserController();
