import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/apiError';
import { sendSuccess } from '../utils/apiResponse';
import { StatusCode } from '../constants/statusCodes';
import { buildMongoFilter } from '../utils/queryBuilder';
import moment from 'moment';

// Replace with actual model
import { Slot } from '../models/mongo/slot.model';

// Replace with actual messages
import { SLOT_SUCCESS_MESSAGES } from '../constants/successMessages';
import { SLOT_ERROR_MESSAGES } from '../constants/errorMessages';
import { GroundHasCategories } from '../models/mongo/groundHasCategories.model';
import { paginateQuery } from '../helpers/paginationHelper';

class SlotController {
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = { ...req.body, createdBy: req.user?._id };

      const doc = await Slot.create(data);
      sendSuccess(res, doc, StatusCode.CREATED, SLOT_SUCCESS_MESSAGES.CREATED);
    } catch (err) {
      return next(ApiError.internal(err instanceof Error ? err.message : String(err)));
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id;
      const doc = await Slot.findById(id);

      if (!doc || doc.isDeleted) {
        return next(ApiError.notFound(SLOT_ERROR_MESSAGES.NOT_FOUND));
      }

      sendSuccess(res, doc, StatusCode.OK, SLOT_SUCCESS_MESSAGES.FETCHED);
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
      let slot;
      if ({ ...req.query, ...req.body, ...req.params }?.isPaginated) {
        const query = Slot.find(filters).sort({ date: -1 });
        slot = await paginateQuery(query, { ...req.query, ...req.body, ...req.params });
      } else {
        slot = await Slot.find(filters).sort({ date: -1 });
      }
      sendSuccess(res, slot, StatusCode.OK, SLOT_SUCCESS_MESSAGES.FETCHED);
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
        return next(ApiError.notFound(SLOT_ERROR_MESSAGES.NOT_FOUND));
      }

      const updated = await Slot.findByIdAndUpdate(id, data, { new: true });
      sendSuccess(res, updated, StatusCode.OK, SLOT_SUCCESS_MESSAGES.UPDATED);
    } catch (err) {
      return next(ApiError.internal(err instanceof Error ? err.message : String(err)));
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id;

      const doc = await Slot.findById(id);
      if (!doc || doc.isDeleted) {
        return next(ApiError.notFound(SLOT_ERROR_MESSAGES.NOT_FOUND));
      }

      doc.isDeleted = true;
      doc.deletedBy = req.user?._id as string;
      doc.deletedAt = new Date();
      await doc.save();

      sendSuccess(res, null, StatusCode.OK, SLOT_SUCCESS_MESSAGES.DELETED);
    } catch (err) {
      return next(ApiError.internal(err instanceof Error ? err.message : String(err)));
    }
  }

  async autoSlotGeneration(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const groundHasCategoryId = { ...req.body, ...req.query, ...req.params }.groundHasCategoryId;
      await generateSlotsAutomatically(groundHasCategoryId);
      // await generateSlotsAutomatically();
      sendSuccess(res, null, StatusCode.OK, SLOT_SUCCESS_MESSAGES.AUTO_GENERATED);
    } catch (err) {
      return next(ApiError.internal(err instanceof Error ? err.message : String(err)));
    }
  }
}

export const slotController = new SlotController();

// export const generateSlotsAutomatically = async (id?: string) => {
//   const allGrounds = await GroundHasCategories.find({
//     isActive: true,
//     isDeleted: false,
//     ...(id ? { _id: id } : {}),
//   });

//   for (const ground of allGrounds) {
//     const { slotDuration, dayToAllowUserCanBook, workingDay, _id } = ground;

//     for (let i = 0; i < dayToAllowUserCanBook; i++) {
//       const currentDate = moment().add(i, 'days');
//       const dateOnly = currentDate.startOf('day').toDate();
//       const weekDay = currentDate.format('dddd').toLowerCase(); // MONDAY, TUESDAY...

//       const workingDayEntry = workingDay.find((wd) => wd.day === weekDay && wd.isActive);
//       if (!workingDayEntry) continue;

//       const existingSlots = await Slot.find({
//         groundHasCategoryId: _id,
//         date: dateOnly,
//       });
//       const existingStartTimes = new Set(existingSlots.map((slot) => slot.startTime));
//       const newSlots = [];

//       for (const priceBlock of workingDayEntry.prices || []) {
//         if (!priceBlock.isActive) continue;

//         const timeSlots = generateTimeSlots(priceBlock.startTime, priceBlock.endTime, slotDuration);

//         for (const slot of timeSlots) {
//           if (!existingStartTimes.has(slot.start)) {
//             newSlots.push({
//               groundHasCategoryId: _id,
//               date: dateOnly,
//               day: weekDay,
//               startTime: slot.start,
//               endTime: slot.end,
//               price: priceBlock.typeWisePrice,
//             });
//           }
//         }
//       }
//       if (newSlots.length > 0) {
//         await Slot.insertMany(newSlots);
//       }
//     }
//   }
// };

// // Helper function
// function generateTimeSlots(start: string, end: string, duration: number) {
//   const slots = [];
//   const startMoment = moment(start, 'HH:mm');
//   const endMoment = moment(end, 'HH:mm');

//   while (startMoment.clone().add(duration, 'minutes').isSameOrBefore(endMoment)) {
//     const endSlot = startMoment.clone().add(duration, 'minutes');
//     slots.push({
//       start: startMoment.format('HH:mm'),
//       end: endSlot.format('HH:mm'),
//     });
//     startMoment.add(duration, 'minutes');
//   }

//   return slots;
// }

export const generateSlotsAutomatically = async (id?: string) => {
  // const ids = await GroundHasCategories.find({
  //   isActive: true,
  //   isDeleted: false,
  // });
  // const idList = ids.map((ground) => ground._id);
  const allGrounds = await GroundHasCategories.find({
    isActive: true,
    isDeleted: false,
    ...(id ? { _id: id } : {}),
    // _id: { $in: idList },
  });

  await Promise.all(
    allGrounds.map(async (ground) => {
      const { slotDuration, dayToAllowUserCanBook, workingDay, _id } = ground;

      const allSlotDocs: any[] = [];

      for (let i = 0; i < dayToAllowUserCanBook; i++) {
        const currentDate = moment().add(i, 'days');
        const weekDay = currentDate.format('dddd').toLowerCase();

        const workingDayEntry = workingDay.find((wd) => wd.day === weekDay && wd.isActive);
        if (!workingDayEntry) continue;

        for (const priceBlock of workingDayEntry.prices || []) {
          if (priceBlock.isActive === false) continue;

          const timeSlots = generateTimeSlots(
            priceBlock.startTime,
            priceBlock.endTime,
            slotDuration,
          );

          for (const slot of timeSlots) {
            allSlotDocs.push({
              updateOne: {
                filter: {
                  groundHasCategoryId: _id,
                  date: currentDate.startOf('day').toDate(),
                  startTime: slot.start,
                },
                update: {
                  $setOnInsert: {
                    groundHasCategoryId: _id,
                    date: currentDate.startOf('day').toDate(),
                    day: weekDay,
                    startTime: slot.start,
                    endTime: slot.end,
                    price: priceBlock.typeWisePrice,
                  },
                },
                upsert: true,
              },
            });
          }
        }
      }

      if (allSlotDocs.length > 0) {
        await Slot.bulkWrite(allSlotDocs, { ordered: false });
      }
    }),
  );
};

// Helper: Generate time slots between start & end based on duration
function generateTimeSlots(start: string, end: string, duration: number) {
  const slots = [];
  let startMoment = moment(start, 'HH:mm');
  const endMoment = moment(end, 'HH:mm');

  while (startMoment.clone().add(duration, 'minutes').isSameOrBefore(endMoment)) {
    const endSlot = startMoment.clone().add(duration, 'minutes');
    slots.push({
      start: startMoment.format('HH:mm'),
      end: endSlot.format('HH:mm'),
    });
    startMoment.add(duration, 'minutes');
  }

  return slots;
}
