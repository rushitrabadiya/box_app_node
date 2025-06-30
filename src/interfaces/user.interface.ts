import { Document } from 'mongoose';
import { IBaseModel } from './base.interface';

// MongoDB User Interface
export interface IUser extends IBaseModel {
  name: string;
  email: string;
  password?: string;
  isActive: boolean;
  isDeleted: boolean;
  phone: string;
  address: string;
  gender: string;
  dateOfBirth: Date;
  profilePicture: string;
  city: string;
  country: string;
  state: string;
  zipCode: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  isBlocked: boolean;
  otp: string;
  otpExpiresAt: Date;
}
