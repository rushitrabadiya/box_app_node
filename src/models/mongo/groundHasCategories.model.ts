import { Schema, model, Document, Types, CallbackError } from 'mongoose';
import { IGroundHasCategories } from '../../interfaces/groundHasCategories.interface';
import { GROUND_HAS_CATEGORIES_STATUS, WEEK_DAYS_ENUM } from '../../constants/app';
import moment from 'moment';

export interface IGroundHasCategoriesDocument extends Document, IGroundHasCategories {}
const GroundHasCategoriesSchema = new Schema<IGroundHasCategoriesDocument>(
  {
    groundId: { type: Schema.Types.ObjectId, ref: 'GroundRegistration', required: true },
    categoryId: { type: Schema.Types.ObjectId, ref: 'Categories', required: true },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
    name: { type: String, required: false, trim: true },
    slotDuration: { type: Number, default: 60, min: 30 },
    dayToAllowUserCanBook: {
      type: Number,
      required: true,
      min: 0,
      max: 30,
      default: 7,
    },
    status: {
      type: String,
      enum: Object.values(GROUND_HAS_CATEGORIES_STATUS),
      default: GROUND_HAS_CATEGORIES_STATUS.PENDING,
    },
    workingDay: [
      {
        day: {
          type: String,
          enum: Object.values(WEEK_DAYS_ENUM),
          required: true,
        },
        startTime: { type: String, required: true },
        endTime: { type: String, required: true },
        isActive: { type: Boolean, default: true },
        prices: [
          {
            startTime: {
              type: String,
              required: true,
            },
            endTime: {
              type: String,
              required: true,
            },
            typeWisePrice: { type: Number, required: true, min: 0 },
            isActive: { type: Boolean, default: true },
          },
        ],
      },
    ],
    coverImage: { type: String, required: true, trim: true },
    images: [
      {
        image: { type: String, required: true },
        video: { type: String, required: false },
        isActive: { type: Boolean, default: true },
      },
    ],

    createdBy: { type: Types.ObjectId, ref: 'User', required: false },
    updatedBy: { type: Types.ObjectId, ref: 'User', required: false },
    deletedBy: { type: Types.ObjectId, ref: 'User', required: false },
  },

  { timestamps: true },
);

GroundHasCategoriesSchema.index({ isActive: 1 });
GroundHasCategoriesSchema.index({ isDeleted: 1 });
// GroundHasCategoriesSchema.index(
//   { groundId: 1, categoryId: 1 },
//   { partialFilterExpression: { isDeleted: false }, unique: true },
// );

GroundHasCategoriesSchema.pre('save', function (next) {
  try {
    if (this.workingDay && Array.isArray(this.workingDay)) {
      this.workingDay.forEach((wd: any) => {
        // 1. Set default startTime & endTime if not provided
        if (!wd.startTime) wd.startTime = '00:00';
        if (!wd.endTime) wd.endTime = '23:59';

        const wdStart = moment(wd.startTime, 'HH:mm');
        const wdEnd = moment(wd.endTime, 'HH:mm');

        // 2. Validate prices array exists
        if (!Array.isArray(wd.prices) || wd.prices.length === 0) {
          throw new Error(`Prices not provided for working day [${wd.day}]`);
        }

        // 3. Filter inactive prices and sort
        const sortedPrices = wd.prices
          .filter((p: any) => p.isActive !== false)
          .sort((a: any, b: any) =>
            moment(a.startTime, 'HH:mm').diff(moment(b.startTime, 'HH:mm')),
          );

        const firstPriceStart = moment(sortedPrices[0].startTime, 'HH:mm');
        const lastPriceEnd = moment(sortedPrices[sortedPrices.length - 1].endTime, 'HH:mm');

        // 4. Check that first & last price blocks match the working day time
        if (!firstPriceStart.isSame(wdStart) || !lastPriceEnd.isSame(wdEnd)) {
          throw new Error(
            `Price time range [${sortedPrices[0].startTime} - ${sortedPrices[sortedPrices.length - 1].endTime}] does not match working day time [${wd.startTime} - ${wd.endTime}] for ${wd.day}`,
          );
        }

        // 5. Ensure price time blocks are continuous (optional)
        for (let i = 0; i < sortedPrices.length - 1; i++) {
          const currentEnd = moment(sortedPrices[i].endTime, 'HH:mm');
          const nextStart = moment(sortedPrices[i + 1].startTime, 'HH:mm');

          if (!currentEnd.isSame(nextStart)) {
            throw new Error(
              `❗ Prices in working day [${wd.day}] are not continuous between ${sortedPrices[i].endTime} and ${sortedPrices[i + 1].startTime}`,
            );
          }
        }
      });
    }

    next();
  } catch (err) {
    next(err as CallbackError); // Throw validation error
  }
});

export const GroundHasCategories = model<IGroundHasCategoriesDocument>(
  'GroundHasCategories',
  GroundHasCategoriesSchema,
);
