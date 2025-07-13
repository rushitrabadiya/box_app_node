import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/apiError';
import { sendSuccess } from '../utils/apiResponse';
import { StatusCode } from '../constants/statusCodes';
import { buildMongoFilter } from '../utils/queryBuilder';
import moment from 'moment';

// Replace with actual model
import { Slot } from '../models/mongo/slot.model';

// Replace with actual messages
import { SAMPLE_SUCCESS_MESSAGES } from '../constants/successMessages';
import { SAMPLE_ERROR_MESSAGES } from '../constants/errorMessages';
import { GroundHasCategories } from '../models/mongo/groundHasCategories.model';

class SlotController {
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = { ...req.body, createdBy: req.user?._id };

      const doc = await Slot.create(data);
      sendSuccess(res, doc, StatusCode.CREATED, SAMPLE_SUCCESS_MESSAGES.CREATED);
    } catch (err) {
      return next(ApiError.internal(err instanceof Error ? err.message : String(err)));
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id;
      const doc = await Slot.findById(id);

      if (!doc || doc.isDeleted) {
        return next(ApiError.notFound(SAMPLE_ERROR_MESSAGES.NOT_FOUND));
      }

      sendSuccess(res, doc, StatusCode.OK, SAMPLE_SUCCESS_MESSAGES.FETCHED);
    } catch (err) {
      return next(ApiError.internal(err instanceof Error ? err.message : String(err)));
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const filters = buildMongoFilter(
        { ...req.query, ...req.body, ...req.params },
        {
          allowedFields: ['groundHasCategoryId', 'date', 'isActive', 'isBooked'], // customize as needed
          baseQuery: { isDeleted: false },
          searchFields: ['day'], // customize as needed
        },
      );

      const docs = await Slot.find(filters).sort({ createdAt: -1 });
      sendSuccess(res, docs, StatusCode.OK, SAMPLE_SUCCESS_MESSAGES.FETCHED);
    } catch (err) {
      return next(ApiError.internal(err instanceof Error ? err.message : String(err)));
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id;
      const data = { ...req.body, updatedBy: req.user?._id };

      const doc = await Slot.findById(id);
      if (!doc || doc.isDeleted) {
        return next(ApiError.notFound(SAMPLE_ERROR_MESSAGES.NOT_FOUND));
      }

      const updated = await Slot.findByIdAndUpdate(id, data, { new: true });
      sendSuccess(res, updated, StatusCode.OK, SAMPLE_SUCCESS_MESSAGES.UPDATED);
    } catch (err) {
      return next(ApiError.internal(err instanceof Error ? err.message : String(err)));
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id;

      const doc = await Slot.findById(id);
      if (!doc || doc.isDeleted) {
        return next(ApiError.notFound(SAMPLE_ERROR_MESSAGES.NOT_FOUND));
      }

      doc.isDeleted = true;
      doc.deletedBy = req.user?._id as string;
      doc.deletedAt = new Date();
      await doc.save();

      sendSuccess(res, null, StatusCode.OK, SAMPLE_SUCCESS_MESSAGES.DELETED);
    } catch (err) {
      return next(ApiError.internal(err instanceof Error ? err.message : String(err)));
    }
  }

  async autoSlotGeneration(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const groundId = { ...req.body, ...req.query, ...req.params }.groundId;
      await generateSlotsAutomatically(groundId);
      sendSuccess(res, null, StatusCode.OK, SAMPLE_SUCCESS_MESSAGES.CREATED);
    } catch (err) {
      return next(ApiError.internal(err instanceof Error ? err.message : String(err)));
    }
  }
}

export const slotController = new SlotController();

export const generateSlotsAutomatically = async (groundId?: string) => {
  const allGrounds = await GroundHasCategories.find({
    isActive: true,
    isDeleted: false,
    ...(groundId ? { groundId: groundId } : {}),
  });

  for (const ground of allGrounds) {
    const { slotDuration, dayToAllowUserCanBook, workingDay, _id } = ground;

    for (let i = 0; i < dayToAllowUserCanBook; i++) {
      const currentDate = moment().add(i, 'days');
      const weekDay = currentDate.format('dddd').toUpperCase(); // 'MONDAY', 'TUESDAY'

      const workingDayEntry = workingDay.find((wd) => wd.day === weekDay && wd.isActive);
      if (!workingDayEntry) continue;

      const { startTime, endTime, price } = workingDayEntry;
      const slots = generateTimeSlots(startTime, endTime, slotDuration);

      for (const slot of slots) {
        const exists = await Slot.findOne({
          groundHasCategoryId: _id,
          date: currentDate.startOf('day').toDate(),
          startTime: slot.start,
        });

        if (!exists) {
          await Slot.create({
            groundHasCategoryId: _id,
            date: currentDate.startOf('day').toDate(),
            day: weekDay,
            startTime: slot.start,
            endTime: slot.end,
            price,
          });
        }
      }
    }
  }
};

// Helper to generate time slots from 10:00 to 12:00 every 30 mins
function generateTimeSlots(start: string, end: string, duration: number) {
  const slots = [];
  const startMoment = moment(start, 'HH:mm');
  const endMoment = moment(end, 'HH:mm');

  while (startMoment.clone().add(duration, 'minutes').isSameOrBefore(endMoment)) {
    const endSlot = startMoment.clone().add(duration, 'minutes');
    slots.push({ start: startMoment.format('HH:mm'), end: endSlot.format('HH:mm') });
    startMoment.add(duration, 'minutes');
  }
  return slots;
}
