import type { Request, Response } from 'express';
import { prisma } from '../config/database.ts';
import { AppError } from '../middleware/error.middleware.ts';

export const validateInvitation = async (req: Request, res: Response) => {
  const { code } = req.body;
  
  const sanitizedCode = code.trim().toUpperCase();

  const guest = await prisma.guest.findUnique({
    where: { invitationCode: sanitizedCode },
    include: {
      event: true,
      reservations: {
        include: {
          gift: true,
        },
      },
    },
  });

  if (!guest) {
    throw new AppError('Código de invitación inválido', 404);
  }

  if (!guest.isActive) {
    throw new AppError('Esta invitación ha sido desactivada', 403);
  }

  const guestPublic = {
    publicId: guest.publicId,
    name: guest.name,
    attendanceStatus: guest.attendanceStatus,
    event: {
      publicId: guest.event.publicId,
      title: guest.event.title,
      babyName: guest.event.babyName,
      eventDate: guest.event.eventDate,
      eventTime: guest.event.eventTime,
      location: guest.event.location,
      address: guest.event.address,
    },
    reservedGift: guest.reservations[0] ? {
      name: guest.reservations[0].gift.name,
      description: guest.reservations[0].gift.description,
    } : null,
  };

  res.json(guestPublic);
};

export const updateRsvp = async (req: Request, res: Response) => {
  const { status } = req.body;
  const { guestId } = req.params;
  const id = Array.isArray(guestId) ? guestId[0] : guestId;

  const guest = await prisma.guest.update({
    where: { publicId: id },
    data: {
      attendanceStatus: status,
      attendanceUpdatedAt: new Date(),
    },
  });

  res.json({
    publicId: guest.publicId,
    name: guest.name,
    attendanceStatus: guest.attendanceStatus,
  });
};
