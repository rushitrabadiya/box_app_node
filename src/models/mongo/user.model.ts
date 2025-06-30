import { Schema, model, Document } from 'mongoose';
import { IUser } from '../../interfaces/user.interface';

export interface IUserDocument extends Document, IUser {
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

const userSchema = new Schema<IUserDocument>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: false },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
    phone: { type: String, default: null },
    address: { type: String, default: null },
    gender: { type: String, default: null },
    dateOfBirth: { type: Date },
    profilePicture: { type: String, default: null },
    city: { type: String, default: null },
    country: { type: String, default: null },
    state: { type: String, default: null },
    zipCode: { type: String, default: null },
    emailVerified: { type: Boolean, default: false },
    phoneVerified: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
    otp: { type: String, default: null },
    otpExpiresAt: { type: Date },
  },

  { timestamps: true },
);

// Ensure the schema is properly indexed for performance
userSchema.index({ email: 1 }, { unique: true, partialFilterExpression: { isDeleted: false } });
userSchema.index({ isActive: 1 });
userSchema.index({ isDeleted: 1 });
userSchema.index({ phone: 1 });

export const User = model<IUserDocument>('User', userSchema);
