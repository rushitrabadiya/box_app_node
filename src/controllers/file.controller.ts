import { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import { ApiError } from '../utils/apiError';
import { sendSuccess } from '../utils/apiResponse';
import { StatusCode } from '../constants/statusCodes';
import { MEDIA_SUCCESS_MESSAGES } from '../constants/successMessages';
import { MEDIA_ERROR_MESSAGES } from '../constants/errorMessages';
import { Files } from '../models/mongo/file.model';
import { ENV } from '../config/env';
import { SELF_URL } from '../constants/app';

class MediaController {
  async upload(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.file) {
        return next(ApiError.badRequest(MEDIA_ERROR_MESSAGES.FILE_REQUIRED));
      }

      const { filename, path: filePath, mimetype } = req.file;

      const doc = await Files.create({
        fileName: filename,
        filePath,
        fileType: mimetype.startsWith('video') ? 'video' : 'image',
        mimeType: mimetype,
        uploadedBy: req.user?._id,
      });
      const normalizedPath = doc.filePath.replace(/\\/g, '/');
      const fileUrl = `${SELF_URL}${normalizedPath}`;

      const result = {
        ...doc.toObject(),
        filePath: normalizedPath,
        url: fileUrl,
      };

      sendSuccess(res, result, StatusCode.CREATED, MEDIA_SUCCESS_MESSAGES.UPLOADED);
    } catch (err) {
      return next(ApiError.internal(err instanceof Error ? err.message : String(err)));
    }
  }

  async getFile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const filePath = req.query.path as string;
      if (!filePath) {
        return next(ApiError.badRequest(MEDIA_ERROR_MESSAGES.FILE_PATH_REQUIRED));
      }

      const absolutePath = path.resolve(filePath);
      if (!fs.existsSync(absolutePath)) {
        return next(ApiError.notFound(MEDIA_ERROR_MESSAGES.FILE_NOT_FOUND));
      }

      return res.sendFile(absolutePath);
    } catch (err) {
      return next(ApiError.internal(err instanceof Error ? err.message : String(err)));
    }
  }
  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id;
      let doc = await Files.findById(id);

      if (!doc) {
        return next(ApiError.notFound(MEDIA_ERROR_MESSAGES.FILE_NOT_FOUND));
      }
      const normalizedPath = doc.filePath.replace(/\\/g, '/');
      const fileUrl = `${SELF_URL}${normalizedPath}`;

      const result = {
        ...doc.toObject(),
        filePath: normalizedPath,
        url: fileUrl,
      };

      sendSuccess(res, result, StatusCode.OK, MEDIA_SUCCESS_MESSAGES.FETCHED);
    } catch (err) {
      return next(ApiError.internal(err instanceof Error ? err.message : String(err)));
    }
  }
}

export const fileController = new MediaController();
