import { Schema } from 'joi';
import { Request, Response, NextFunction } from 'express';

export const validateRequest =
  (schema: Schema) =>
  (req: Request, res: Response, next: NextFunction): void => {
    const { error } = schema.validate(req.body);
    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }
    next();
  };
