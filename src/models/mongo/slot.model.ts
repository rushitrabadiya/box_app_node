import { Schema, model, Document, Types } from 'mongoose';
import { ISlot } from '../../interfaces/slot.interface';
import { WEEK_DAYS_ENUM } from '../../constants/app';

export interface ISlotDocument extends Document, ISlot {}

const SlotSchema = new Schema<ISlotDocument>(
  {
    groundHasCategoryId: {
      type: Schema.Types.ObjectId,
      ref: 'GroundHasCategories',
      required: true,
    },
    date: { type: Date, required: true },
    day: {
      type: String,
      required: true,
      enum: Object.values(WEEK_DAYS_ENUM), // Assuming you already use this for "MONDAY", etc.
    },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    isBooked: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  },
);

// ✅ Indexes
SlotSchema.index({ groundHasCategoryId: 1, date: 1, startTime: 1 }, { unique: true });
SlotSchema.index({ isActive: 1 });
SlotSchema.index({ isDeleted: 1 });

export const Slot = model<ISlotDocument>('Slot', SlotSchema);
