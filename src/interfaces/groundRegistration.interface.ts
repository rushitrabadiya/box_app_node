import { Types } from 'mongoose';
import { GROUND_REGISTRATION_STATUS } from './../constants/app';
import { IBaseModel } from './base.interface';
export type GroundRegistrationStatus =
  (typeof GROUND_REGISTRATION_STATUS)[keyof typeof GROUND_REGISTRATION_STATUS];

export interface ImageInterface {
  image: string;
  isActive: boolean;
}

// MongoDB groundRegistration Interface
export interface IGroundRegistration extends IBaseModel {
  name: string;
  subtitle: string;
  description?: string;
  location: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zipcode: string;
  country: string;
  mobile: string;
  email: string;
  // coverImage: string;
  // images: ImageInterface[];
  isBlocked: boolean;
  // categoryId: Types.ObjectId;
  status: GroundRegistrationStatus;
  isActive: boolean;
  isDeleted: boolean;
}
