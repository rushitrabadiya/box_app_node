import { Document } from 'mongoose';

export interface IBaseModel extends Document {
    createdAt: Date;
    updatedAt: Date;
    isActive: boolean;
    createdBy?: string;
    updatedBy?: string;
}
