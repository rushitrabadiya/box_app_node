import { Types } from 'mongoose';
import { IBaseModel } from './base.interface';

// MongoDB Slot Interface
export interface ISlot extends IBaseModel {
  groundHasCategoryId: Types.ObjectId;
  date: Date;
  day: string;
  startTime: string; // "10:00"
  endTime: string; // "11:00"
  price: number;
  isActive: boolean;
  isBooked: boolean; // true = already booked
  isDeleted: boolean;
}
