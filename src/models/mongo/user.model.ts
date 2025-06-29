import { Schema, model, Document } from 'mongoose';
import { BaseAttributes } from '../../interfaces/timestamps.interface';

export interface IUserDocument extends Document, BaseAttributes {
  name: string;
}

const userSchema = new Schema<IUserDocument>(
  { name: { type: String, required: true } },
  { timestamps: true },
);

export const MongoUser = model<IUserDocument>('MongoUser', userSchema);
