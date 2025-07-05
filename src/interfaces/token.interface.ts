import { Types } from 'mongoose';
import { TOKEN_TYPES } from '../constants/app';
import { IBaseModel } from './base.interface';
export type TokenType = (typeof TOKEN_TYPES)[keyof typeof TOKEN_TYPES];

export interface IToken extends IBaseModel {
  userId: Types.ObjectId;
  expiryDate: Date;
  token: string;
  name: TokenType;
}
