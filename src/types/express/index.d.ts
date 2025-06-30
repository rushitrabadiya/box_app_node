import { IUserDocument } from '../../models/mongo/user.model';

declare module 'express-serve-static-core' {
  interface Request {
    user?: IUserDocument;
  }
}
