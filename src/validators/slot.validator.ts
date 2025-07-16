import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/apiError';

class SlotValidator {
  // ✅ Create Slot
  async createSlot(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const schema = Joi.object({
        groundHasCategoryId: Joi.string().required(),
        date: Joi.date().required(),
        day: Joi.string().optional(),
        startTime: Joi.string().required(), // "10:00"
        endTime: Joi.string().required(), // "11:00"
        price: Joi.number().required(),
        isActive: Joi.boolean().optional(),
        isBooked: Joi.boolean().optional(),
      });

      const { error } = schema.validate(req.body);

      if (error) {
        const errorMessage = error.details.map((d) => d.message).join(', ');
        return next(ApiError.badRequest(errorMessage));
      }

      return next();
    } catch (err) {
      return next(ApiError.internal(err instanceof Error ? err.message : String(err)));
    }
  }

  // ✅ Get Slot by ID
  async getSlotById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const schema = Joi.object({
        id: Joi.string().required(),
      });

      const { error } = schema.validate(req.params);

      if (error) {
        const errorMessage = error.details.map((d) => d.message).join(', ');
        return next(ApiError.badRequest(errorMessage));
      }

      return next();
    } catch (err) {
      return next(ApiError.internal(err instanceof Error ? err.message : String(err)));
    }
  }

  // ✅ Get All Categories with Optional Filters
  async getAllSlot(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const schema = Joi.object({
        search: Joi.string().optional(),
        groundHasCategoryId: Joi.alternatives()
          .try(Joi.string(), Joi.array().items(Joi.string()))
          .optional(),
        date: Joi.date().optional(),
        isBooked: Joi.boolean().optional(),
        isActive: Joi.boolean().optional(),
        isDeleted: Joi.boolean().optional(),
        isPaginated: Joi.boolean().optional(),
        page: Joi.number().integer().min(1).default(1),
        limit: Joi.number().integer().min(1).default(10),
      });
      const { error } = schema.validate(req.query);

      if (error) {
        const errorMessage = error.details.map((d) => d.message).join(', ');
        return next(ApiError.badRequest(errorMessage));
      }

      return next();
    } catch (err) {
      return next(ApiError.internal(err instanceof Error ? err.message : String(err)));
    }
  }

  // ✅ Update Slot
  async updateSlot(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const bodySchema = Joi.object({
        id: Joi.string().required(),
        groundHasCategoryId: Joi.string().optional(),
        date: Joi.date().optional(),
        day: Joi.string().optional(),
        startTime: Joi.string().optional(), // "10:00"
        endTime: Joi.string().optional(), // "11:00"
        price: Joi.number().optional(),
        isActive: Joi.boolean().optional(),
        isBooked: Joi.boolean().optional(),
      });

      const bodyError = bodySchema.validate({ ...req.body, ...req.params, ...req.query }).error;
      if (bodyError) {
        return next(ApiError.badRequest(bodyError.details.map((d) => d.message).join(', ')));
      }

      return next();
    } catch (err) {
      return next(ApiError.internal(err instanceof Error ? err.message : String(err)));
    }
  }

  // ✅ Delete Slot
  async deleteSlot(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const schema = Joi.object({
        id: Joi.string().required(),
      });

      const { error } = schema.validate(req.params);

      if (error) {
        const errorMessage = error.details.map((d) => d.message).join(', ');
        return next(ApiError.badRequest(errorMessage));
      }

      return next();
    } catch (err) {
      return next(ApiError.internal(err instanceof Error ? err.message : String(err)));
    }
  }

  // ✅ Auto Slot Generation
  async autoSlotGeneration(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const schema = Joi.object({
        groundHasCategoryId: Joi.alternatives()
          .try(Joi.string(), Joi.array().items(Joi.string()))
          .required(),
      });

      const { error } = schema.validate(req.body);

      if (error) {
        const errorMessage = error.details.map((d) => d.message).join(', ');
        return next(ApiError.badRequest(errorMessage));
      }

      return next();
    } catch (err) {
      return next(ApiError.internal(err instanceof Error ? err.message : String(err)));
    }
  }
}

export const slotValidator = new SlotValidator();
