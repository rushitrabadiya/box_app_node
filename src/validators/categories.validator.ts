import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/apiError';

class CategoryValidator {
  // ✅ Create Category
  async createCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const schema = Joi.object({
        name: Joi.string().trim().required(),
        isActive: Joi.boolean().optional(),
        img: Joi.string().allow('', null).optional(),
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

  // ✅ Get Category by ID
  async getCategoryById(req: Request, res: Response, next: NextFunction): Promise<void> {
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
  async getAllCategories(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const schema = Joi.object({
        // name: Joi.string().optional(),
        search: Joi.string().optional(),
        isActive: Joi.boolean().optional(),
        isDeleted: Joi.boolean().optional(),
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

  // ✅ Update Category
  async updateCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const bodySchema = Joi.object({
        id: Joi.string().required(),
        name: Joi.string().trim().optional(),
        isActive: Joi.boolean().optional(),
        isDeleted: Joi.boolean().optional(),
        img: Joi.string().allow('', null).optional(),
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

  // ✅ Delete Category
  async deleteCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
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
}

export const categoryValidator = new CategoryValidator();
