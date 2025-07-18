import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/apiError';
import { sendSuccess } from '../utils/apiResponse';
import { StatusCode } from '../constants/statusCodes';
import { CATEGORY_SUCCESS_MESSAGES } from '../constants/successMessages';
import { CATEGORY_ERROR_MESSAGES } from '../constants/errorMessages';
import { buildMongoFilter } from '../utils/queryBuilder';
import { Categories } from '../models/mongo/categories.model';

class CategoryController {
  async createCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const reqData = { ...req.body, ...req.query, ...req.params };

      const existingCategory = await Categories.findOne({
        name: reqData.name,
        isDeleted: false,
      });
      if (existingCategory) {
        return next(ApiError.badRequest(CATEGORY_ERROR_MESSAGES.CATEGORY_ALREADY_EXISTS));
      }

      const category = await Categories.create({
        ...reqData,
        createdBy: req.user?._id,
      });

      sendSuccess(res, category, StatusCode.CREATED, CATEGORY_SUCCESS_MESSAGES.CATEGORY_CREATED);
    } catch (err) {
      next(ApiError.internal(err instanceof Error ? err.message : String(err)));
    }
  }

  async getCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const categoryId = req.params.id;
      const category = await Categories.findById(categoryId);
      if (!category || category.isDeleted) {
        return next(ApiError.notFound(CATEGORY_ERROR_MESSAGES.CATEGORY_NOT_FOUND));
      }

      sendSuccess(res, category, StatusCode.OK, CATEGORY_SUCCESS_MESSAGES.CATEGORY_FETCHED);
    } catch (err) {
      next(ApiError.internal(err instanceof Error ? err.message : String(err)));
    }
  }

  async getAllCategories(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const reqData = { ...req.body, ...req.query, ...req.params };

      const { filter, sort } = buildMongoFilter(reqData, {
        allowedFields: ['isActive', 'isDeleted'],
        baseQuery: { isDeleted: false },
        searchFields: ['name', 'description'],
      });

      const categories = await Categories.find(filter).sort(sort || { createdAt: -1 });

      sendSuccess(res, categories, StatusCode.OK, CATEGORY_SUCCESS_MESSAGES.CATEGORY_FETCHED);
    } catch (err) {
      next(ApiError.internal(err instanceof Error ? err.message : String(err)));
    }
  }

  async updateCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const categoryId = req.params.id;
      const updateData = req.body;

      const category = await Categories.findById(categoryId);
      if (!category || category.isDeleted) {
        return next(ApiError.notFound(CATEGORY_ERROR_MESSAGES.CATEGORY_NOT_FOUND));
      }

      if (updateData.name) {
        const duplicate = await Categories.findOne({
          name: updateData.name,
          _id: { $ne: categoryId },
          isDeleted: false,
        });
        if (duplicate) {
          return next(ApiError.badRequest(CATEGORY_ERROR_MESSAGES.CATEGORY_ALREADY_EXISTS));
        }
      }

      const updatedCategory = await Categories.findByIdAndUpdate(categoryId, updateData, {
        new: true,
      });

      sendSuccess(res, updatedCategory, StatusCode.OK, CATEGORY_SUCCESS_MESSAGES.CATEGORY_UPDATED);
    } catch (err) {
      next(ApiError.internal(err instanceof Error ? err.message : String(err)));
    }
  }

  async deleteCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const categoryId = req.params.id;

      const category = await Categories.findById(categoryId);
      if (!category || category.isDeleted) {
        return next(ApiError.notFound(CATEGORY_ERROR_MESSAGES.CATEGORY_NOT_FOUND));
      }

      category.isDeleted = true;
      await category.save();

      sendSuccess(res, null, StatusCode.OK, CATEGORY_SUCCESS_MESSAGES.CATEGORY_DELETED);
    } catch (err) {
      next(ApiError.internal(err instanceof Error ? err.message : String(err)));
    }
  }
}

export const categoryController = new CategoryController();
