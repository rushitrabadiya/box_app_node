import { Request, Response, NextFunction } from 'express';

export const logger = (req: Request, _res: Response, next: NextFunction) => {
  console.info(`[${req.method}] ${req.originalUrl}`);
  next();
};
