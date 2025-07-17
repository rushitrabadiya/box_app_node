import { FILE_TYPE } from '../constants/app';
import { IBaseModel } from './base.interface';
export type FIleTypeEnum = (typeof FILE_TYPE)[keyof typeof FILE_TYPE];

// MongoDB Categories Interface
export interface IFile extends IBaseModel {
  fileName: string;
  filePath: string;
  fileType: FIleTypeEnum;
  mimeType: string;
  isDeleted: boolean;
}
