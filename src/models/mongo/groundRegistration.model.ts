import { Schema, model, Document, Types } from 'mongoose';
import { IGroundRegistration, ImageInterface } from '../../interfaces/groundRegistration.interface';
import { GROUND_REGISTRATION_STATUS } from '../../constants/app';

export interface IGroundRegistrationDocument extends Document, IGroundRegistration {
  images: ImageInterface[];
}

const imageSchema = new Schema<ImageInterface>(
  {
    image: { type: String, required: true },
    isActive: { type: Boolean, default: true },
  },
  { _id: false },
);

const groundRegistrationSchema = new Schema<IGroundRegistrationDocument>(
  {
    name: { type: String, required: true, trim: true },
    subtitle: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    location: { type: String, required: false, trim: true },
    address1: { type: String, required: true, trim: true },
    address2: { type: String, trim: true },
    city: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    zipcode: { type: String, required: true, trim: true },
    country: { type: String, required: true, trim: true },
    mobile: { type: String, required: false, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    // coverImage: { type: String, required: true, trim: true },
    // images: { type: [imageSchema], default: [] },
    isBlocked: { type: Boolean, default: false },
    // categoryId: { type: Schema.Types.ObjectId, ref: 'Categories', required: true },
    status: {
      type: String,
      enum: Object.values(GROUND_REGISTRATION_STATUS),
      default: GROUND_REGISTRATION_STATUS.PENDING,
    },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },

    // From IBaseModel
    createdBy: { type: Types.ObjectId, ref: 'User', required: false },
    updatedBy: { type: Types.ObjectId, ref: 'User', required: false },
    deletedBy: { type: Types.ObjectId, ref: 'User', required: false },
  },
  { timestamps: true },
);

// Indexes for performance and uniqueness
groundRegistrationSchema.index(
  { name: 1, city: 1 },
  { partialFilterExpression: { isDeleted: false } },
);
groundRegistrationSchema.index({ isActive: 1 });
groundRegistrationSchema.index({ isDeleted: 1 });

export const GroundRegistration = model<IGroundRegistrationDocument>(
  'GroundRegistration',
  groundRegistrationSchema,
);
