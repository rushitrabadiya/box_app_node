import Joi from 'joi';
import { NextFunction, Request, Response } from 'express';
import { ApiError } from '../utils/apiError';
import { paginationValidators, sortStringValidator } from '../utils/joi.common';
const options = {
  abortEarly: false, // include all errors
  allowUnknown: false, // ignore unknown props
  // stripUnknown: true, // remove unknown props
};
class UserValidator {
  async validateUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const schema = Joi.object({
        name: Joi.string().min(2).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6), // Optional per interface (with ?)
        isActive: Joi.boolean().default(true),
        isDeleted: Joi.boolean().default(false),
        isAdmin: Joi.boolean().default(false),
        phone: Joi.string()
          .pattern(/^\d{10,15}$/)
          .required(),
        address: Joi.string().allow('', null).required(),
        gender: Joi.string().valid('male', 'female', 'other').required(),
        dateOfBirth: Joi.date().required(),
        profilePicture: Joi.string().uri().allow('', null),
        city: Joi.string().required(),
        country: Joi.string().required(),
        state: Joi.string().required(),
        zipCode: Joi.string().required(),
        emailVerified: Joi.boolean().default(false),
        phoneVerified: Joi.boolean().default(false),
        // isBlocked: Joi.boolean().default(false),
        // otp: Joi.string().required(),
        // otpExpiresAt: Joi.date().required(),
      });

      const { error } = schema.validate(req.body, options);

      if (error) {
        const errorMessage = error.details.map((details) => details.message).join(', ');
        return next(ApiError.badRequest(errorMessage));
      }

      return next();
    } catch (err) {
      return next(ApiError.internal(err instanceof Error ? err.message : String(err)));
    }
  }
  async validateRegisterUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const schema = Joi.object({
        name: Joi.string().min(2).required(),
        email: Joi.string().email().required(),
        phone: Joi.string()
          .pattern(/^\d{10,15}$/)
          .required(),
        address: Joi.string().allow('', null).optional(),
        gender: Joi.string().valid('male', 'female', 'other').optional(),
        dateOfBirth: Joi.date().optional(),
        profilePicture: Joi.string().uri().allow('', null),
        city: Joi.string().optional(),
        country: Joi.string().optional(),
        state: Joi.string().optional(),
        zipCode: Joi.string().optional(),
        emailVerified: Joi.boolean().default(false),
        phoneVerified: Joi.boolean().default(false),
        // isBlocked: Joi.boolean().default(false),
        // otp: Joi.string().required(),
        // otpExpiresAt: Joi.date().required(),
      });

      const { error } = schema.validate(req.body, options);

      if (error) {
        const errorMessage = error.details.map((details) => details.message).join(', ');
        return next(ApiError.badRequest(errorMessage));
      }

      return next();
    } catch (err) {
      return next(ApiError.internal(err instanceof Error ? err.message : String(err)));
    }
  }

  async validateUpdateUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const schema = Joi.object({
        id: Joi.string().required(),
        name: Joi.string().min(2).optional(),
        email: Joi.string().email().optional(),
        password: Joi.string().min(6), // Optional per interface (with ?)
        isActive: Joi.boolean,
        isDeleted: Joi.boolean(),
        isAdmin: Joi.boolean(),
        phone: Joi.string()
          .pattern(/^\d{10,15}$/)
          .optional(),
        address: Joi.string().allow('', null).optional(),
        gender: Joi.string().valid('male', 'female', 'other').optional(),
        dateOfBirth: Joi.date().optional(),
        profilePicture: Joi.string().uri().allow('', null),
        city: Joi.string().optional(),
        country: Joi.string().optional(),
        state: Joi.string().optional(),
        zipCode: Joi.string().optional(),
        emailVerified: Joi.boolean(),
        phoneVerified: Joi.boolean(),
        isBlocked: Joi.boolean(),
        otp: Joi.string().optional(),
        otpExpiresAt: Joi.date().optional(),
      });

      const { error } = schema.validate({ ...req.body, ...req.params, ...req.query }, options);

      if (error) {
        const errorMessage = error.details.map((details) => details.message).join(', ');
        return next(ApiError.badRequest(errorMessage));
      }

      return next();
    } catch (err) {
      return next(ApiError.internal(err instanceof Error ? err.message : String(err)));
    }
  }

  async getUserById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const schema = Joi.object({
        id: Joi.string().required(),
      });

      const { error } = schema.validate(req.params, options);

      if (error) {
        const errorMessage = error.details.map((details) => details.message).join(', ');
        return next(ApiError.badRequest(errorMessage));
      }

      return next();
    } catch (err) {
      return next(ApiError.internal(err instanceof Error ? err.message : String(err)));
    }
  }

  async getAllUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const schema = Joi.object({
        email: Joi.string().email().optional(),
        isDeleted: Joi.boolean().optional(),
        isActive: Joi.boolean().optional(),
        city: Joi.string().optional(),
        country: Joi.string().optional(),
        state: Joi.string().optional(),
        zipCode: Joi.string().optional(),
        ...paginationValidators,
      });

      const { error } = schema.validate(req.query, options);

      if (error) {
        const errorMessage = error.details.map((details) => details.message).join(', ');
        return next(ApiError.badRequest(errorMessage));
      }

      return next();
    } catch (err) {
      return next(ApiError.internal(err instanceof Error ? err.message : String(err)));
    }
  }
}

export const userValidator = new UserValidator();
