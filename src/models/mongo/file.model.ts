import { Schema, model, Document, Types } from 'mongoose';
import { IFile } from '../../interfaces/file.interface';
import { FILE_TYPE } from '../../constants/app';

export interface IFIlesDocument extends Document, IFile {}

const filesSchema = new Schema<IFIlesDocument>(
  {
    fileName: { type: String, required: true },
    filePath: { type: String, required: true },
    mimeType: { type: String, required: true },
    fileType: {
      type: String,
      enum: Object.values(FILE_TYPE),
      default: FILE_TYPE.IMAGE,
    },
    isDeleted: { type: Boolean, default: false },
    createdBy: { type: Types.ObjectId, ref: 'User', required: false },
    updatedBy: { type: Types.ObjectId, ref: 'User', required: false },
    deletedBy: { type: Types.ObjectId, ref: 'User', required: false },
  },

  { timestamps: true },
);

// Ensure the schema is properly indexed for performance
filesSchema.index({ isActive: 1 });
filesSchema.index({ fileName: 1 });
filesSchema.index({ isDeleted: 1 });

export const Files = model<IFIlesDocument>('Files', filesSchema);
