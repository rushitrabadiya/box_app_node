import Joi from 'joi';
import { NextFunction, Request, Response } from 'express';
import { ApiError } from '../utils/apiError';

class UserValidator {
  async validateUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const schema = Joi.object({
        name: Joi.string().min(2).required(),
        phone: Joi.string()
          .pattern(/^\d{10,15}$/)
          .required(),
      });

      const { error } = schema.validate(req.body);

      if (error) {
        const errorMessage = error.details.map(details => details.message).join(', ');
        return next(ApiError.badRequest(errorMessage));
      }

      return next();
    } catch (err) {
      return next(ApiError.internal(err instanceof Error ? err.message : String(err)));
    }
  }
}

export const userValidator = new UserValidator();
