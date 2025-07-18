import { Schema, model, Document, Types } from 'mongoose';
import { BOOKING_STATUS, PAYMENT_METHODS, PAYMENT_STATUS } from '../../constants/app';
import { IBooking } from '../../interfaces/booking.interface';

export interface IBookingDocument extends Document, IBooking {}

const bookingSchema = new Schema<IBookingDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    groundHasCategoryId: {
      type: Schema.Types.ObjectId,
      ref: 'GroundHasCategories',
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    slotIds: [
      {
        type: Types.ObjectId,
        ref: 'Slot',
        required: true,
      },
    ],
    totalAmount: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: Object.values(BOOKING_STATUS),
      required: false,
      default: BOOKING_STATUS.BOOKED,
    },

    paymentStatus: {
      type: String,
      enum: Object.values(PAYMENT_STATUS),
      required: false,
      default: PAYMENT_STATUS.PENDING,
    },

    paymentMethod: {
      type: String,
      enum: Object.values(PAYMENT_METHODS),
      required: true,
    },
    paymentId: {
      type: String,
    },

    paymentDetails: {
      transactionId: { type: String },
      provider: { type: String },
      payAmount: { type: String, required: true },
    },

    paymentDate: {
      type: Date,
    },
    cancellationReason: {
      type: String,
    },
    cancellationDate: {
      type: Date,
    },
    paymentReturnDate: {
      type: Date,
    },
    paymentReturnAmount: {
      type: String,
    },

    isDeleted: { type: Boolean, default: false },
    createdBy: { type: Types.ObjectId, ref: 'User', required: false },
    updatedBy: { type: Types.ObjectId, ref: 'User', required: false },
    deletedBy: { type: Types.ObjectId, ref: 'User', required: false },
  },

  { timestamps: true },
);

// Ensure the schema is properly indexed for performance
bookingSchema.index({ isActive: 1 });
bookingSchema.index({ fileName: 1 });
bookingSchema.index({ isDeleted: 1 });

export const BookingModel = model<IBookingDocument>('Booking', bookingSchema);
