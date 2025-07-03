import { Schema, model, Document, Types } from 'mongoose';
import { ICategories } from '../../interfaces/categories.interface';

export interface ICategoriesDocument extends Document, ICategories {
  name: string;
  img: string;
  isActive: boolean;
  isDeleted: boolean;
}

const categoriesSchema = new Schema<ICategoriesDocument>(
  {
    name: { type: String, required: true, trim: true },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
    img: { type: String, required: false },
    createdBy: { type: Types.ObjectId, ref: 'User', required: false },
    updatedBy: { type: Types.ObjectId, ref: 'User', required: false },
    deletedBy: { type: Types.ObjectId, ref: 'User', required: false },
  },

  { timestamps: true },
);

// Ensure the schema is properly indexed for performance
categoriesSchema.index(
  { name: 1 },
  { unique: true, partialFilterExpression: { isDeleted: false } },
);
categoriesSchema.index({ isActive: 1 });
categoriesSchema.index({ isDeleted: 1 });

export const Categories = model<ICategoriesDocument>('Categories', categoriesSchema);
