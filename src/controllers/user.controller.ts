import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/apiError';
import { sendSuccess } from '../utils/apiResponse';
import { USER_SUCCESS_MESSAGES } from '../constants/successMessages';
import { User } from '../models/mongo/user.model';
import { StatusCode } from '../constants/statusCodes';
import { USER_ERROR_MESSAGES } from '../constants/errorMessages';
import { buildMongoFilter } from '../utils/queryBuilder';

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
        allowedFields: ['email', 'city', 'country', 'state', 'zipCode', 'isDeleted', 'isActive'],
        baseQuery: { isDeleted: false, isActive: true },
        searchFields: ['name', 'email', 'phone'],
      });

      const users = await User.find(searchQuery)
        .select('-password -otp -otpExpiresAt -createdBy')
        .sort({ createdAt: -1 });

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
      }
      if (updateData.isAdmin) {
        const exitsAdmin = await User.findOne({
          isAdmin: true,
          isDeleted: false,
          _id: { $ne: userId },
        });
        if (exitsAdmin) return next(ApiError.badRequest(USER_ERROR_MESSAGES.ADMIN_ALREADY_EXITS));
      }
      await User.findByIdAndUpdate(userId, updateData, {
        new: true,
      });

      sendSuccess(res, user, StatusCode.OK, USER_SUCCESS_MESSAGES.USER_UPDATED);
    } catch (err) {
      return next(ApiError.internal(err instanceof Error ? err.message : String(err)));
    }
  }
}

export const userController = new UserController();
