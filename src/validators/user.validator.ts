import Joi from 'joi';
import { NextFunction, Request, Response } from 'express';
import { ApiError } from '../utils/apiError';

class UserValidator {
  async validateUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const schema = Joi.object({
        name: Joi.string().min(2).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6), // Optional per interface (with ?)
        isActive: Joi.boolean().default(true),
        isDeleted: Joi.boolean().default(false),
        phone: Joi.string()
          .pattern(/^\d{10,15}$/)
          .required(),
        address: Joi.string().allow('').required(),
        gender: Joi.string().valid('male', 'female', 'other').required(),
        dateOfBirth: Joi.date().required(),
        profilePicture: Joi.string().uri().allow('', null),
        city: Joi.string().required(),
        country: Joi.string().required(),
        state: Joi.string().required(),
        zipCode: Joi.string().required(),
        emailVerified: Joi.boolean().default(false),
        phoneVerified: Joi.boolean().default(false),
        isBlocked: Joi.boolean().default(false),
        otp: Joi.string().required(),
        otpExpiresAt: Joi.date().required(),
      });

      const { error } = schema.validate(req.body);

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
