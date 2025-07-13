import { Types } from 'mongoose';
import { IBaseModel } from './base.interface';
import { GROUND_HAS_CATEGORIES_STATUS, WEEK_DAYS_ENUM } from '../constants/app';

export type GroundCategoriesStatus =
  (typeof GROUND_HAS_CATEGORIES_STATUS)[keyof typeof GROUND_HAS_CATEGORIES_STATUS];

export type WeekDaysEnum = (typeof WEEK_DAYS_ENUM)[keyof typeof WEEK_DAYS_ENUM];

// Working Day Interface
export interface IWorkingDay {
  day: WeekDaysEnum;
  startTime: string;
  endTime: string;
  price: number;
  isActive: boolean;
}
// Image Interface
export interface ImageInterface {
  image: string;
  video?: string;
  isActive: boolean;
}
// MongoDB Ground Has Categories Interface
export interface IGroundHasCategories extends IBaseModel {
  groundId: Types.ObjectId;
  categoryId: Types.ObjectId;
  isActive: boolean;
  name?: string;
  isDeleted: boolean;
  slotDuration: number;
  dayToAllowUserCanBook: number;
  status: GroundCategoriesStatus;
  workingDay: IWorkingDay[];
  coverImage: string;
  images: ImageInterface[];
}
