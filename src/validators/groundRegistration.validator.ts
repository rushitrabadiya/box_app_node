import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/apiError';
import { GROUND_REGISTRATION_STATUS } from '../constants/app';
import { paginationValidators, sortStringValidator } from '../utils/joi.common';
const options = {
  abortEarly: false, // include all errors
  allowUnknown: false, // ignore unknown props
  // stripUnknown: true, // remove unknown props
};
class GroundRegistrationValidator {
  // ✅ Create Ground Registration
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const schema = Joi.object({
        name: Joi.string().trim().required(),
        owner: Joi.string().trim().optional(),
        subtitle: Joi.string().trim().optional(),
        description: Joi.string().allow('', null).optional(),
        location: Joi.string().trim().required(),
        address1: Joi.string().trim().required(),
        address2: Joi.string().trim().allow('', null).optional(),
        city: Joi.string().trim().required(),
        state: Joi.string().trim().required(),
        zipcode: Joi.string().trim().required(),
        country: Joi.string().trim().required(),
        mobile: Joi.string()
          .pattern(/^[0-9]{10,15}$/)
          .required(),
        email: Joi.string().email().required(),
        coverImage: Joi.string().required(),
        // images: Joi.array()
        //   .items(
        //     Joi.object({
        //       image: Joi.string().uri().required(),
        //       isActive: Joi.boolean().required(),
        //     }),
        //   )
        //   .optional(),

        isBlocked: Joi.boolean().default(false),
        // categoryId: Joi.string()
        //   .regex(/^[0-9a-fA-F]{24}$/)
        //   .required(),

        status: Joi.string()
          .valid(...Object.values(GROUND_REGISTRATION_STATUS))
          .default(GROUND_REGISTRATION_STATUS.PENDING),

        isActive: Joi.boolean().default(true),
        isDeleted: Joi.boolean().default(false),
      });

      const { error } = schema.validate(req.body, options);
      if (error) {
        return next(ApiError.badRequest(error.details.map((d) => d.message).join(', ')));
      }

      return next();
    } catch (err) {
      return next(ApiError.internal(err instanceof Error ? err.message : String(err)));
    }
  }

  // ✅ Get By ID
  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const schema = Joi.object({
        id: Joi.string().required(),
      });

      const { error } = schema.validate(req.params, options);
      if (error) {
        return next(ApiError.badRequest(error.details.map((d) => d.message).join(', ')));
      }

      return next();
    } catch (err) {
      return next(ApiError.internal(err instanceof Error ? err.message : String(err)));
    }
  }

  // ✅ Get All (with Filters)
  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const schema = Joi.object({
        isActive: Joi.boolean().optional(),
        isDeleted: Joi.boolean().optional(),
        city: Joi.string().trim().optional(),
        state: Joi.string().trim().optional(),
        owner: Joi.string().trim().optional(),
        // categoryId: Joi.string()
        //   .regex(/^[0-9a-fA-F]{24}$/)
        //   .optional(),
        isBlocked: Joi.boolean().optional(),
        ...paginationValidators,
        status: Joi.string()
          .valid(...Object.values(GROUND_REGISTRATION_STATUS))
          .optional(),
      });

      const { error } = schema.validate(req.query, options);
      if (error) {
        return next(ApiError.badRequest(error.details.map((d) => d.message).join(', ')));
      }

      return next();
    } catch (err) {
      return next(ApiError.internal(err instanceof Error ? err.message : String(err)));
    }
  }

  // ✅ Update
  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const schema = Joi.object({
        id: Joi.string().required(),

        name: Joi.string().trim().optional(),
        owner: Joi.string().trim().optional(),
        subtitle: Joi.string().trim().optional(),
        description: Joi.string().allow('', null).optional(),
        location: Joi.string().trim().optional(),
        address1: Joi.string().trim().optional(),
        address2: Joi.string().trim().allow('', null).optional(),
        city: Joi.string().trim().optional(),
        state: Joi.string().trim().optional(),
        zipcode: Joi.string().trim().optional(),
        country: Joi.string().trim().optional(),
        mobile: Joi.string()
          .pattern(/^[0-9]{10,15}$/)
          .optional(),
        email: Joi.string().email().optional(),
        coverImage: Joi.string().uri().optional(),
        images: Joi.array()
          .items(
            Joi.object({
              image: Joi.string().uri().required(),
              isActive: Joi.boolean().required(),
            }),
          )
          .optional(),
        isBlocked: Joi.boolean().optional(),
        categoryId: Joi.string()
          .regex(/^[0-9a-fA-F]{24}$/)
          .optional(),
        status: Joi.string()
          .valid(...Object.values(GROUND_REGISTRATION_STATUS))
          .optional(),
        isActive: Joi.boolean().optional(),
        isDeleted: Joi.boolean().optional(),
      });

      const { error } = schema.validate({ ...req.body, ...req.params }, options);
      if (error) {
        return next(ApiError.badRequest(error.details.map((d) => d.message).join(', ')));
      }

      return next();
    } catch (err) {
      return next(ApiError.internal(err instanceof Error ? err.message : String(err)));
    }
  }

  // ✅ Delete
  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const schema = Joi.object({
        id: Joi.string().required(),
      });

      const { error } = schema.validate(req.params, options);
      if (error) {
        return next(ApiError.badRequest(error.details.map((d) => d.message).join(', ')));
      }

      return next();
    } catch (err) {
      return next(ApiError.internal(err instanceof Error ? err.message : String(err)));
    }
  }
}

export const groundRegistrationValidator = new GroundRegistrationValidator();
