import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/apiError';
import { sendSuccess } from '../utils/apiResponse';
import { StatusCode } from '../constants/statusCodes';
import { buildMongoFilter } from '../utils/queryBuilder';

import { GroundHasCategories } from '../models/mongo/groundHasCategories.model';

import { GROUND_HAS_CATEGORIES_SUCCESS_MESSAGES } from '../constants/successMessages';
import { GROUND_HAS_CATEGORIES_ERROR_MESSAGES } from '../constants/errorMessages';

class GroundHasCategoriesController {
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = { ...req.body, createdBy: req.user?._id };

      const doc = await GroundHasCategories.create(data);
      sendSuccess(res, doc, StatusCode.CREATED, GROUND_HAS_CATEGORIES_SUCCESS_MESSAGES.CREATED);
    } catch (err) {
      return next(ApiError.internal(err instanceof Error ? err.message : String(err)));
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id;
      const doc = await GroundHasCategories.findById(id);

      if (!doc || doc.isDeleted || !doc.isActive) {
        return next(ApiError.notFound(GROUND_HAS_CATEGORIES_ERROR_MESSAGES.NOT_FOUND));
      }

      sendSuccess(res, doc, StatusCode.OK, GROUND_HAS_CATEGORIES_SUCCESS_MESSAGES.FETCHED);
    } catch (err) {
      return next(ApiError.internal(err instanceof Error ? err.message : String(err)));
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { filter, sort } = buildMongoFilter(req.query, {
        allowedFields: ['categoryId', 'status', 'isActive', 'groundId'], // customize as needed
        baseQuery: { isDeleted: false },
        searchFields: ['name', 'email', 'mobile'], // customize as needed
      });

      const docs = await GroundHasCategories.find(filter).sort(sort || { createdAt: -1 });
      sendSuccess(res, docs, StatusCode.OK, GROUND_HAS_CATEGORIES_SUCCESS_MESSAGES.FETCHED);
    } catch (err) {
      return next(ApiError.internal(err instanceof Error ? err.message : String(err)));
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id;
      const data = { ...req.body, updatedBy: req.user?._id };

      const doc = await GroundHasCategories.findById(id);
      if (!doc || doc.isDeleted) {
        return next(ApiError.notFound(GROUND_HAS_CATEGORIES_ERROR_MESSAGES.NOT_FOUND));
      }

      const updated = await GroundHasCategories.findByIdAndUpdate(id, data, { new: true });
      sendSuccess(res, updated, StatusCode.OK, GROUND_HAS_CATEGORIES_SUCCESS_MESSAGES.UPDATED);
    } catch (err) {
      return next(ApiError.internal(err instanceof Error ? err.message : String(err)));
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id;

      const doc = await GroundHasCategories.findById(id);
      if (!doc || doc.isDeleted) {
        return next(ApiError.notFound(GROUND_HAS_CATEGORIES_ERROR_MESSAGES.NOT_FOUND));
      }

      doc.isDeleted = true;
      doc.deletedBy = req.user?._id as string;
      doc.deletedAt = new Date();
      await doc.save();

      sendSuccess(res, null, StatusCode.OK, GROUND_HAS_CATEGORIES_SUCCESS_MESSAGES.DELETED);
    } catch (err) {
      return next(ApiError.internal(err instanceof Error ? err.message : String(err)));
    }
  }
}

export const groundHasCategoriesController = new GroundHasCategoriesController();
