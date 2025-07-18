// import { Request, Response, NextFunction } from 'express';
// import { ApiError } from '../utils/apiError';
// import { sendSuccess } from '../utils/apiResponse';
// import { StatusCode } from '../constants/statusCodes';
// import { buildMongoFilter } from '../utils/queryBuilder';

// // Replace with actual messages
// import { SAMPLE_SUCCESS_MESSAGES } from '../constants/successMessages';
// import { SAMPLE_ERROR_MESSAGES } from '../constants/errorMessages';

// class SampleController {
//   async create(req: Request, res: Response, next: NextFunction): Promise<void> {
//     try {
//       const data = { ...req.body, createdBy: req.user?._id };

//       const doc = await Book.create(data);
//       sendSuccess(res, doc, StatusCode.CREATED, SAMPLE_SUCCESS_MESSAGES.CREATED);
//     } catch (err) {
//       return next(ApiError.internal(err instanceof Error ? err.message : String(err)));
//     }
//   }

//   async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
//     try {
//       const id = req.params.id;
//       const doc = await SampleModel.findById(id);

//       if (!doc || doc.isDeleted) {
//         return next(ApiError.notFound(SAMPLE_ERROR_MESSAGES.NOT_FOUND));
//       }

//       sendSuccess(res, doc, StatusCode.OK, SAMPLE_SUCCESS_MESSAGES.FETCHED);
//     } catch (err) {
//       return next(ApiError.internal(err instanceof Error ? err.message : String(err)));
//     }
//   }

//   async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
//     try {
//       const filters = buildMongoFilter(
//         { ...req.query, ...req.body, ...req.params },
//         {
//           allowedFields: ['categoryId', 'status', 'isActive'], // customize as needed
//           baseQuery: { isDeleted: false },
//           searchFields: [], // customize as needed
//         },
//       );

//       const docs = await SampleModel.find(filters).sort({ createdAt: -1 });
//       sendSuccess(res, docs, StatusCode.OK, SAMPLE_SUCCESS_MESSAGES.FETCHED);
//     } catch (err) {
//       return next(ApiError.internal(err instanceof Error ? err.message : String(err)));
//     }
//   }

//   async update(req: Request, res: Response, next: NextFunction): Promise<void> {
//     try {
//       const id = req.params.id;
//       const data = { ...req.body, updatedBy: req.user?._id };

//       const doc = await SampleModel.findById(id);
//       if (!doc || doc.isDeleted) {
//         return next(ApiError.notFound(SAMPLE_ERROR_MESSAGES.NOT_FOUND));
//       }

//       const updated = await SampleModel.findByIdAndUpdate(id, data, { new: true });
//       sendSuccess(res, updated, StatusCode.OK, SAMPLE_SUCCESS_MESSAGES.UPDATED);
//     } catch (err) {
//       return next(ApiError.internal(err instanceof Error ? err.message : String(err)));
//     }
//   }

//   async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
//     try {
//       const id = req.params.id;

//       const doc = await SampleModel.findById(id);
//       if (!doc || doc.isDeleted) {
//         return next(ApiError.notFound(SAMPLE_ERROR_MESSAGES.NOT_FOUND));
//       }

//       doc.isDeleted = true;
//       doc.deletedBy = req.user?._id as string;
//       doc.deletedAt = new Date();
//       await doc.save();

//       sendSuccess(res, null, StatusCode.OK, SAMPLE_SUCCESS_MESSAGES.DELETED);
//     } catch (err) {
//       return next(ApiError.internal(err instanceof Error ? err.message : String(err)));
//     }
//   }
// }

// export const sampleController = new SampleController();
