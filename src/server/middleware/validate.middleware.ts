import type { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError } from './error.middleware.ts';

export const validate = (schema: any) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const messages = error.issues.map((e) => e.message);
        throw new AppError(messages.join(', '), 400);
      }
      throw new AppError('Error de validación', 400);
    }
  };
};
