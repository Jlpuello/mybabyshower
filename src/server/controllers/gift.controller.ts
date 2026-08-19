import type { Response } from 'express';
import path from 'path';
import fs from 'fs';
import { prisma } from '../config/database.ts';
import { AppError } from '../middleware/error.middleware.ts';
import type { AuthRequest } from '../middleware/auth.middleware.ts';

// ─────────────────────────────────────────────────────────────────
// GET /api/admin/gifts  —  Lista regalos con quién los ha reservado
// ─────────────────────────────────────────────────────────────────
export const listGifts = async (req: AuthRequest, res: Response) => {
  const eventId = req.eventId;
  if (!eventId) throw new AppError('No autorizado', 401);

  const gifts = await prisma.gift.findMany({
    where: { eventId },
    orderBy: { createdAt: 'desc' },
    include: {
      reservations: {
        include: {
          guest: {
            select: {
              publicId: true,
              name: true,
              phone: true,
              attendanceStatus: true,
            },
          },
        },
        orderBy: { reservedAt: 'asc' },
      },
    },
  });

  // Calcular estado dinámicamente
  const giftsWithStatus = gifts.map((g) => ({
    ...g,
    reservationCount: g.reservations.length,
    isFull: g.reservations.length >= g.maxReservations,
  }));

  res.json(giftsWithStatus);
};

// ─────────────────────────────────────────────────────────────────
// POST /api/admin/gifts  —  Crea un regalo (con imagen opcional)
// ─────────────────────────────────────────────────────────────────
export const createGift = async (req: AuthRequest, res: Response) => {
  const eventId = req.eventId;
  if (!eventId) throw new AppError('No autorizado', 401);

  const { name, description, category, maxReservations } = req.body;

  // Construir URL de imagen si fue subida
  const imageFile = (req as any).file as Express.Multer.File | undefined;
  const imageUrl = imageFile
    ? `/uploads/gifts/${imageFile.filename}`
    : null;

  const gift = await prisma.gift.create({
    data: {
      publicId: `gift-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      eventId,
      name: (name as string).trim(),
      description: (description as string | undefined)?.trim() || null,
      category: (category as string | undefined) || null,
      imageUrl,
      maxReservations: Number(maxReservations ?? 1),
    },
    include: { reservations: true },
  });

  res.status(201).json({ ...gift, reservationCount: 0, isFull: false });
};

// ─────────────────────────────────────────────────────────────────
// DELETE /api/admin/gifts/:giftId  —  Elimina un regalo
// ─────────────────────────────────────────────────────────────────
export const deleteGift = async (req: AuthRequest, res: Response) => {
  const eventId = req.eventId;
  if (!eventId) throw new AppError('No autorizado', 401);

  const { giftId } = req.params;
  const id = Array.isArray(giftId) ? giftId[0] : giftId;

  const gift = await prisma.gift.findFirst({
    where: { publicId: id, eventId },
  });

  if (!gift) throw new AppError('Regalo no encontrado', 404);

  // Eliminar imagen del disco si existe y es local
  if (gift.imageUrl && gift.imageUrl.startsWith('/uploads/')) {
    const filePath = path.join(process.cwd(), gift.imageUrl);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  }

  await prisma.gift.delete({ where: { id: gift.id } });

  res.json({ message: 'Regalo eliminado correctamente' });
};

// ─────────────────────────────────────────────────────────────────
// PUT /api/admin/gifts/:giftId  —  Actualiza un regalo
// ─────────────────────────────────────────────────────────────────
export const updateGift = async (req: AuthRequest, res: Response) => {
  const eventId = req.eventId;
  if (!eventId) throw new AppError('No autorizado', 401);

  const { giftId } = req.params;
  const id = Array.isArray(giftId) ? giftId[0] : giftId;

  const gift = await prisma.gift.findFirst({
    where: { publicId: id, eventId },
    include: { reservations: true },
  });

  if (!gift) throw new AppError('Regalo no encontrado', 404);

  const { name, description, category, maxReservations } = req.body;

  let imageUrl = gift.imageUrl;
  const imageFile = (req as any).file as Express.Multer.File | undefined;

  if (imageFile) {
    // Si se subió una nueva imagen y existía una anterior local, eliminar la anterior
    if (gift.imageUrl && gift.imageUrl.startsWith('/uploads/')) {
      const oldPath = path.join(process.cwd(), gift.imageUrl);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }
    imageUrl = `/uploads/gifts/${imageFile.filename}`;
  }

  const updatedGift = await prisma.gift.update({
    where: { id: gift.id },
    data: {
      ...(name !== undefined && { name: (name as string).trim() }),
      ...(description !== undefined && { description: (description as string | undefined)?.trim() || null }),
      ...(category !== undefined && { category: (category as string | undefined) || null }),
      ...(maxReservations !== undefined && { maxReservations: Number(maxReservations) }),
      imageUrl,
    },
    include: {
      reservations: {
        include: {
          guest: {
            select: {
              publicId: true,
              name: true,
              phone: true,
              attendanceStatus: true,
            },
          },
        },
        orderBy: { reservedAt: 'asc' },
      },
    },
  });

  const reservationCount = updatedGift.reservations.length;
  const isFull = reservationCount >= updatedGift.maxReservations;

  res.json({ ...updatedGift, reservationCount, isFull });
};
