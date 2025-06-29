import Joi from 'joi';
import { NextFunction, Request, Response } from 'express';
import { ApiError } from '../utils/apiError';

const options = {
  abortEarly: false,
  allowUnknown: false,
};

class AuthValidator {
  async validateRequestOtp(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const schema = Joi.object({
        phone: Joi.string()
          .pattern(/^\d{10,15}$/)
          .required(),
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

  async validateVerifyOtp(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const schema = Joi.object({
        phone: Joi.string()
          .pattern(/^\d{10,15}$/)
          .required(),
        otp: Joi.string().length(6).required(),
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

  async validateRegister(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const schema = Joi.object({
        name: Joi.string().min(2).required(),
        email: Joi.string().email().required(),
        phone: Joi.string()
          .pattern(/^\d{10,15}$/)
          .required(),
        password: Joi.string().min(6).required(),
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

  async validateLogin(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required(),
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
}

export const authValidator = new AuthValidator();
