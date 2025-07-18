import { Document } from 'mongoose';

export interface IBaseModel extends Document {
  createdAt: Date;
  updatedAt: Date;
  // isActive: boolean;
  createdBy?: string;
  updatedBy?: string;
  deletedBy?: string;
  deletedAt?: Date;
}
export type Frequency = 'minute' | 'hour' | 'day' | 'month';

export interface FlexibleCronJob {
  name: string;
  every: Frequency;
  time?: string; // Format: 'HH:mm'
  dayOfMonth?: number; // Required only for monthly
  job: () => void;
  allowedEnvironments: string[];
}
