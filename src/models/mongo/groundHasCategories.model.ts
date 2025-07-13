import { Schema, model, Document, Types } from 'mongoose';
import { IGroundHasCategories } from '../../interfaces/groundHasCategories.interface';
import { GROUND_HAS_CATEGORIES_STATUS, WEEK_DAYS_ENUM } from '../../constants/app';

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
        price: { type: Number, min: 0, default: 0 },
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
GroundHasCategoriesSchema.index(
  { groundId: 1, categoryId: 1 },
  { partialFilterExpression: { isDeleted: false }, unique: true },
);

GroundHasCategoriesSchema.pre('save', function (next) {
  if (this.workingDay && Array.isArray(this.workingDay)) {
    this.workingDay.forEach((wd: any) => {
      if (!wd.startTime) wd.startTime = '00:00';
      if (!wd.endTime) wd.endTime = '23:59';
    });
  }
  next();
});

export const GroundHasCategories = model<IGroundHasCategoriesDocument>(
  'GroundHasCategories',
  GroundHasCategoriesSchema,
);
