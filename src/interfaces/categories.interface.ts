import { IBaseModel } from './base.interface';

// MongoDB Categories Interface
export interface ICategories extends IBaseModel {
  name: string;
  img: string;
  isActive: boolean;
  isDeleted: boolean;
}
