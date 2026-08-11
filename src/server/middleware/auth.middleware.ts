import jwt from 'jsonwebtoken';
import type { Request, Response, NextFunction } from 'express';
import { AppError } from './error.middleware.ts';

export interface AuthRequest extends Request {
  userId?: string;
  eventId?: string;
}

export const authenticate = (req: AuthRequest, _res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new AppError('No autorizado: Token no proporcionado', 401);
  }

  const token = authHeader.substring(7);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
      eventId: string;
    };

    req.userId = decoded.userId;
    req.eventId = decoded.eventId;

    next();
  } catch (error) {
    throw new AppError('No autorizado: Token inválido', 401);
  }
};
