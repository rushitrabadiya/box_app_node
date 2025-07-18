import { Types } from 'mongoose';
import { IBaseModel } from './base.interface';
import { BOOKING_STATUS, PAYMENT_METHODS, PAYMENT_STATUS } from '../constants/app';

export type BookingStatus = (typeof BOOKING_STATUS)[keyof typeof BOOKING_STATUS];
export type PaymentStatus = (typeof PAYMENT_STATUS)[keyof typeof PAYMENT_STATUS];
export type PaymentMethod = (typeof PAYMENT_METHODS)[keyof typeof PAYMENT_METHODS];

// MongoDB booking Interface
export interface IBooking extends IBaseModel {
  userId: Types.ObjectId;
  groundHasCategoryId: Types.ObjectId;
  date: Date;
  slotIds: Types.ObjectId[]; // multiple slots selected
  totalAmount: string;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  paymentId?: string; // optional, if payment is done
  paymentDetails?: {
    transactionId?: string; // optional, for tracking payment
    provider?: string; // optional, e.g., 'Stripe', 'PayPal'
    payAmount: string;
  };
  isDeleted: boolean;
  paymentDate?: Date;
  cancellationReason?: string; // optional, if booking is cancelled
  cancellationDate?: Date; // optional, if booking is cancelled
  paymentReturnDate?: Date; // optional if return policy have
  paymentReturnAmount?: string; // optional if return policy have
}
