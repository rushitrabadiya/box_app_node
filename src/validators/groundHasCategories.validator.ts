import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/apiError';
import { GROUND_HAS_CATEGORIES_STATUS, WEEK_DAYS_ENUM } from '../constants/app';
import { paginationValidators, sortStringValidator } from '../utils/joi.common';
const options = {
  abortEarly: false, // include all errors
  allowUnknown: false, // ignore unknown props
  // stripUnknown: true, // remove unknown props
};
class GroundHasCategoriesValidator {
  // ✅ Create
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const workingDaySchema = Joi.array().items(
        Joi.object({
          day: Joi.string()
            .valid(...Object.values(WEEK_DAYS_ENUM))
            .required(),
          startTime: Joi.string().optional().allow(null), // Ideally in HH:mm format
          endTime: Joi.string().optional().allow(null), // Ideally in HH:mm format
          isActive: Joi.boolean().optional(),
          prices: Joi.array()
            .items(
              Joi.object({
                startTime: Joi.string().required(),
                endTime: Joi.string().required(),
                typeWisePrice: Joi.number().required().min(0),
                isActive: Joi.boolean().optional(),
              }),
            )
            .required(),
        }),
      );

      const imageSchema = Joi.array().items(
        Joi.object({
          image: Joi.string().uri().required(),
          video: Joi.string().uri().optional().allow('', null),
          isActive: Joi.boolean().optional(),
        }),
      );

      const schema = Joi.object({
        groundId: Joi.string()
          .regex(/^[0-9a-fA-F]{24}$/)
          .required(),
        categoryId: Joi.string()
          .regex(/^[0-9a-fA-F]{24}$/)
          .required(),
        slotDuration: Joi.number().min(30).default(60),
        dayToAllowUserCanBook: Joi.number().min(0).max(30),
        name: Joi.string().trim().optional(),
        status: Joi.string()
          .valid(...Object.values(GROUND_HAS_CATEGORIES_STATUS))
          .default(GROUND_HAS_CATEGORIES_STATUS.PENDING),
        isActive: Joi.boolean().default(true),
        isDeleted: Joi.boolean().default(false),
        workingDay: workingDaySchema.optional(),
        coverImage: Joi.string().uri().required(),
        images: imageSchema.optional(),
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

  // ✅ Get All
  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const schema = Joi.object({
        groundId: Joi.string()
          .regex(/^[0-9a-fA-F]{24}$/)
          .optional(),
        categoryId: Joi.string()
          .regex(/^[0-9a-fA-F]{24}$/)
          .optional(),
        status: Joi.string()
          .valid(...Object.values(GROUND_HAS_CATEGORIES_STATUS))
          .optional(),
        isActive: Joi.boolean().optional(),
        isDeleted: Joi.boolean().optional(),
        ...paginationValidators,
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
      const workingDaySchema = Joi.array().items(
        Joi.object({
          day: Joi.string()
            .valid(...Object.values(WEEK_DAYS_ENUM))
            .required(),
          startTime: Joi.string().optional(),
          endTime: Joi.string().optional(),
          prices: Joi.array()
            .items(
              Joi.object({
                startTime: Joi.string().required(),
                endTime: Joi.string().required(),
                typeWisePrice: Joi.number().required().min(0),
                isActive: Joi.boolean().optional(),
              }),
            )
            .optional(),
          isActive: Joi.boolean().optional(),
        }),
      );

      const imageSchema = Joi.array().items(
        Joi.object({
          image: Joi.string().uri().required(),
          video: Joi.string().uri().optional().allow('', null),
          isActive: Joi.boolean().optional(),
        }),
      );

      const schema = Joi.object({
        id: Joi.string().required(),

        groundId: Joi.string()
          .regex(/^[0-9a-fA-F]{24}$/)
          .optional(),
        categoryId: Joi.string()
          .regex(/^[0-9a-fA-F]{24}$/)
          .optional(),
        slotDuration: Joi.number().min(30).optional(),
        dayToAllowUserCanBook: Joi.number().min(0).max(30),
        name: Joi.string().trim().optional(),
        status: Joi.string()
          .valid(...Object.values(GROUND_HAS_CATEGORIES_STATUS))
          .optional(),
        isActive: Joi.boolean().optional(),
        isDeleted: Joi.boolean().optional(),
        workingDay: workingDaySchema.optional(),
        coverImage: Joi.string().uri().optional(),
        images: imageSchema.optional(),
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

export const groundHasCategoriesValidator = new GroundHasCategoriesValidator();
