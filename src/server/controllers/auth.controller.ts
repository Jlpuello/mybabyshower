import type { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { prisma } from '../config/database.ts';
import { AppError } from '../middleware/error.middleware.ts';

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const sanitizedEmail = email.trim().toLowerCase();

  const admin = await prisma.adminUser.findUnique({
    where: { email: sanitizedEmail },
    include: { event: true },
  });

  if (!admin) {
    throw new AppError('Credenciales inválidas', 401);
  }

  const isValidPassword = await bcrypt.compare(password, admin.passwordHash);

  if (!isValidPassword) {
    throw new AppError('Credenciales inválidas', 401);
  }

  const expiresIn = (process.env.JWT_EXPIRES_IN || '24h') as `${number}${'s' | 'm' | 'h' | 'd'}` | number;
  const token = jwt.sign(
    {
      userId: admin.id,
      eventId: admin.eventId,
    },
    process.env.JWT_SECRET!,
    { expiresIn }
  ) as string;

  res.json({
    token,
    user: {
      id: admin.id,
      email: admin.email,
      name: admin.name,
      event: {
        publicId: admin.event.publicId,
        title: admin.event.title,
      },
    },
  });
};
