import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/apiError';
import { sendSuccess } from '../utils/apiResponse';
import { StatusCode } from '../constants/statusCodes';
import { buildMongoFilter } from '../utils/queryBuilder';

import { GROUND_REGISTRATION_SUCCESS_MESSAGES } from '../constants/successMessages';
import { GROUND_REGISTRATION_ERROR_MESSAGES } from '../constants/errorMessages';
import { GroundRegistration } from '../models/mongo/groundRegistration.model';

class GroundRegistrationController {
  async createGround(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = { ...req.body, createdBy: req.user?._id };

      if (!data.owner) data.owner = req.user?._id;

      const ground = await GroundRegistration.create(data);
      sendSuccess(res, ground, StatusCode.CREATED, GROUND_REGISTRATION_SUCCESS_MESSAGES.CREATED);
    } catch (err) {
      return next(ApiError.internal(err instanceof Error ? err.message : String(err)));
    }
  }

  async getGroundById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id;
      const ground = await GroundRegistration.findById(id);

      if (!ground || ground.isDeleted) {
        return next(ApiError.notFound(GROUND_REGISTRATION_ERROR_MESSAGES.NOT_FOUND));
      }

      sendSuccess(res, ground, StatusCode.OK, GROUND_REGISTRATION_SUCCESS_MESSAGES.FETCHED);
    } catch (err) {
      return next(ApiError.internal(err instanceof Error ? err.message : String(err)));
    }
  }

  async getAllGrounds(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const reqData = { ...req.query, ...req.body, ...req.params };
      // if (!reqData.owner && !req.user?.isAdmin) reqData.owner = req.user?._id;
      const { filter, sort } = buildMongoFilter(reqData, {
        allowedFields: ['categoryId', 'city', 'state', 'status', 'isActive', 'owner'],
        baseQuery: { isDeleted: false },
        searchFields: ['name', 'city', 'state', 'email', 'mobile'],
      });

      const grounds = await GroundRegistration.find(filter).sort(sort || { createdAt: -1 });

      sendSuccess(res, grounds, StatusCode.OK, GROUND_REGISTRATION_SUCCESS_MESSAGES.FETCHED);
    } catch (err) {
      return next(ApiError.internal(err instanceof Error ? err.message : String(err)));
    }
  }

  async updateGround(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id;
      const data = { ...req.body, updatedBy: req.user?._id };

      const ground = await GroundRegistration.findById(id);
      if (!ground || ground.isDeleted) {
        return next(ApiError.notFound(GROUND_REGISTRATION_ERROR_MESSAGES.NOT_FOUND));
      }

      const updated = await GroundRegistration.findByIdAndUpdate(id, data, { new: true });

      sendSuccess(res, updated, StatusCode.OK, GROUND_REGISTRATION_SUCCESS_MESSAGES.UPDATED);
    } catch (err) {
      return next(ApiError.internal(err instanceof Error ? err.message : String(err)));
    }
  }

  async deleteGround(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id;

      const ground = await GroundRegistration.findById(id);
      if (!ground || ground.isDeleted) {
        return next(ApiError.notFound(GROUND_REGISTRATION_ERROR_MESSAGES.NOT_FOUND));
      }

      ground.isDeleted = true;
      ground.deletedBy = req.user?._id as string;
      ground.deletedAt = new Date();
      await ground.save();

      sendSuccess(res, null, StatusCode.OK, GROUND_REGISTRATION_SUCCESS_MESSAGES.DELETED);
    } catch (err) {
      return next(ApiError.internal(err instanceof Error ? err.message : String(err)));
    }
  }
}

export const groundRegistrationController = new GroundRegistrationController();
