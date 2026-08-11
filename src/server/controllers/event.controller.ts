import type { Response } from 'express';
import path from 'path';
import fs from 'fs';
import { prisma } from '../config/database.ts';
import { AppError } from '../middleware/error.middleware.ts';
import { setCache, getCache, deleteCache } from '../middleware/cache.middleware.ts';
import type { AuthRequest } from '../middleware/auth.middleware.ts';

export const getEvent = async (_req: unknown, res: Response) => {
  const cacheKey = 'event:public';
  
  const cached = getCache(cacheKey);
  if (cached) {
    return res.json(cached);
  }

  const event = await prisma.event.findFirst();

  if (!event) {
    throw new AppError('Evento no encontrado', 404);
  }

  const eventPublic = {
    publicId: event.publicId,
    title: event.title,
    babyName: event.babyName,
    description: event.description,
    eventDate: event.eventDate,
    eventTime: event.eventTime,
    location: event.location,
    address: event.address,
    latitude: event.latitude,
    longitude: event.longitude,
    heroImage: event.heroImage,
    locationImage: event.locationImage,
    storyTitle: event.storyTitle,
    storyContent: event.storyContent,
    revelationTitle: event.revelationTitle,
    revelationContent: event.revelationContent,
    revelationMediaUrl: event.revelationMediaUrl,
    revelationMediaType: event.revelationMediaType,
    isRevealed: event.isRevealed,
    primaryColor: event.primaryColor,
    secondaryColor: event.secondaryColor,
  };

  setCache(cacheKey, eventPublic, 300); // Cache por 5 minutos

  res.json(eventPublic);
};

// ── GET /api/admin/event ──────────────────────────────────────────
export const getAdminEvent = async (req: AuthRequest, res: Response) => {
  const eventId = req.eventId;
  if (!eventId) throw new AppError('No autorizado', 401);

  const event = await prisma.event.findUnique({
    where: { id: eventId },
  });

  if (!event) throw new AppError('Evento no encontrado', 404);

  res.json(event);
};

// ── PUT /api/admin/event ──────────────────────────────────────────
export const updateEvent = async (req: AuthRequest, res: Response) => {
  const eventId = req.eventId;
  if (!eventId) throw new AppError('No autorizado', 401);

  const currentEvent = await prisma.event.findUnique({
    where: { id: eventId },
  });
  if (!currentEvent) throw new AppError('Evento no encontrado', 404);

  const files = (req as any).files as { [key: string]: Express.Multer.File[] } | undefined;

  let heroImage = currentEvent.heroImage;
  let locationImage = currentEvent.locationImage;
  let revelationMediaUrl = currentEvent.revelationMediaUrl;
  let revelationMediaType = currentEvent.revelationMediaType;

  if (files?.heroImage?.[0]) {
    if (heroImage && heroImage.startsWith('/uploads/')) {
      const oldPath = path.join(process.cwd(), heroImage);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }
    heroImage = `/uploads/event/${files.heroImage[0].filename}`;
  }

  if (files?.locationImage?.[0]) {
    if (locationImage && locationImage.startsWith('/uploads/')) {
      const oldPath = path.join(process.cwd(), locationImage);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }
    locationImage = `/uploads/event/${files.locationImage[0].filename}`;
  }

  if (files?.revelationMedia?.[0]) {
    if (revelationMediaUrl && revelationMediaUrl.startsWith('/uploads/')) {
      const oldPath = path.join(process.cwd(), revelationMediaUrl);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }
    const file = files.revelationMedia[0];
    revelationMediaUrl = `/uploads/event/${file.filename}`;
    revelationMediaType = file.mimetype.startsWith('video/') ? 'VIDEO' : 'IMAGE';
  }

  const {
    title,
    babyName,
    description,
    eventDate,
    eventTime,
    location,
    address,
    latitude,
    longitude,
    storyTitle,
    storyContent,
    revelationTitle,
    revelationContent,
    isRevealed,
    primaryColor,
    secondaryColor,
    metaTitle,
    metaDescription,
  } = req.body;

  const updatedEvent = await prisma.event.update({
    where: { id: eventId },
    data: {
      title: (title as string).trim(),
      babyName: (babyName as string | undefined)?.trim() || null,
      description: (description as string | undefined)?.trim() || null,
      eventDate: new Date(eventDate as string),
      eventTime: (eventTime as string).trim(),
      location: (location as string).trim(),
      address: (address as string).trim(),
      latitude: latitude ? parseFloat(latitude as string) : null,
      longitude: longitude ? parseFloat(longitude as string) : null,
      storyTitle: (storyTitle as string | undefined)?.trim() || null,
      storyContent: (storyContent as string | undefined)?.trim() || null,
      revelationTitle: (revelationTitle as string | undefined)?.trim() || null,
      revelationContent: (revelationContent as string | undefined)?.trim() || null,
      isRevealed: isRevealed === 'true' || isRevealed === true,
      heroImage,
      locationImage,
      revelationMediaUrl,
      revelationMediaType,
      primaryColor: (primaryColor as string | undefined) || '#8B7355',
      secondaryColor: (secondaryColor as string | undefined) || '#D4C4B7',
      metaTitle: (metaTitle as string | undefined)?.trim() || null,
      metaDescription: (metaDescription as string | undefined)?.trim() || null,
    },
  });

  // Limpiar caché público para que la landing refleje los cambios al instante
  deleteCache('event:public');

  res.json(updatedEvent);
};
