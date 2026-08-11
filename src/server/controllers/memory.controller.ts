import type { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { prisma } from '../config/database.ts';
import { AppError } from '../middleware/error.middleware.ts';
import type { AuthRequest } from '../middleware/auth.middleware.ts';

const IMAGE_MIMETYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];

// ── GET /api/admin/memories ──────────────────────────────────────
export const listMemories = async (req: AuthRequest, res: Response) => {
  const eventId = req.eventId;
  if (!eventId) throw new AppError('No autorizado', 401);

  const memories = await prisma.memory.findMany({
    where: { eventId },
    orderBy: { sortOrder: 'asc' },
  });

  res.json(memories);
};

// ── GET /api/event/memories (público) ───────────────────────────
export const listPublicMemories = async (_req: Request, res: Response) => {
  const event = await prisma.event.findFirst();
  if (!event) throw new AppError('Evento no encontrado', 404);

  const memories = await prisma.memory.findMany({
    where: { eventId: event.id, isPublished: true },
    orderBy: { sortOrder: 'asc' },
    select: {
      publicId: true,
      title: true,
      description: true,
      mediaUrl: true,
      mediaType: true,
      eventDate: true,
    },
  });

  res.json(memories);
};

// ── POST /api/admin/memories ─────────────────────────────────────
export const createMemory = async (req: AuthRequest, res: Response) => {
  const eventId = req.eventId;
  if (!eventId) throw new AppError('No autorizado', 401);

  const mediaFile = (req as any).file as Express.Multer.File | undefined;
  if (!mediaFile) throw new AppError('Se requiere un archivo de imagen o video', 400);

  const isImage = IMAGE_MIMETYPES.includes(mediaFile.mimetype);
  const mediaType = isImage ? 'IMAGE' : 'VIDEO';
  const mediaUrl = `/uploads/memories/${mediaFile.filename}`;

  const { title, description, eventDate, isPublished } = req.body;

  // Obtener el último sortOrder
  const lastMemory = await prisma.memory.findFirst({
    where: { eventId },
    orderBy: { sortOrder: 'desc' },
    select: { sortOrder: true },
  });
  const nextSortOrder = (lastMemory?.sortOrder ?? -1) + 1;

  const memory = await prisma.memory.create({
    data: {
      publicId: `memory-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      eventId,
      title: (title as string).trim(),
      description: (description as string | undefined)?.trim() || null,
      mediaUrl,
      mediaType,
      eventDate: eventDate ? new Date(eventDate as string) : null,
      isPublished: isPublished === 'true' || isPublished === true,
      sortOrder: nextSortOrder,
    },
  });

  res.status(201).json(memory);
};

// ── PATCH /api/admin/memories/:memoryId/toggle ───────────────────
export const togglePublish = async (req: AuthRequest, res: Response) => {
  const eventId = req.eventId;
  if (!eventId) throw new AppError('No autorizado', 401);

  const { memoryId } = req.params;
  const id = Array.isArray(memoryId) ? memoryId[0] : memoryId;

  const memory = await prisma.memory.findFirst({
    where: { publicId: id, eventId },
  });

  if (!memory) throw new AppError('Recuerdo no encontrado', 404);

  const updated = await prisma.memory.update({
    where: { id: memory.id },
    data: { isPublished: !memory.isPublished },
  });

  res.json(updated);
};

// ── PATCH /api/admin/memories/reorder ───────────────────────────
export const reorderMemories = async (req: AuthRequest, res: Response) => {
  const eventId = req.eventId;
  if (!eventId) throw new AppError('No autorizado', 401);

  const { orderedIds } = req.body as { orderedIds: string[] };

  // Actualizar sortOrder de cada elemento en paralelo
  await Promise.all(
    orderedIds.map((publicId, index) =>
      prisma.memory.updateMany({
        where: { publicId, eventId },
        data: { sortOrder: index },
      })
    )
  );

  res.json({ message: 'Orden actualizado correctamente' });
};

// ── DELETE /api/admin/memories/:memoryId ─────────────────────────
export const deleteMemory = async (req: AuthRequest, res: Response) => {
  const eventId = req.eventId;
  if (!eventId) throw new AppError('No autorizado', 401);

  const { memoryId } = req.params;
  const id = Array.isArray(memoryId) ? memoryId[0] : memoryId;

  const memory = await prisma.memory.findFirst({
    where: { publicId: id, eventId },
  });

  if (!memory) throw new AppError('Recuerdo no encontrado', 404);

  // Eliminar archivo del disco
  if (memory.mediaUrl.startsWith('/uploads/')) {
    const filePath = path.join(process.cwd(), memory.mediaUrl);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  }

  await prisma.memory.delete({ where: { id: memory.id } });

  res.json({ message: 'Recuerdo eliminado correctamente' });
};
