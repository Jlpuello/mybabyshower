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

  const gifts = await prisma.gift.findMany({
    where: { eventId: guest.eventId, isActive: true },
    include: {
      reservations: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  const giftsPublic = gifts.map((g) => ({
    publicId: g.publicId,
    name: g.name,
    description: g.description,
    imageUrl: g.imageUrl,
    category: g.category,
    isReserved: g.isReserved || g.reservations.length >= g.maxReservations,
    isReservedByMe: g.reservations.some((r) => r.guestId === guest.id),
  }));

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
      primaryColor: guest.event.primaryColor,
      secondaryColor: guest.event.secondaryColor,
      invitationMessage: guest.event.invitationMessage,
      gifts: giftsPublic,
    },
    reservedGift: guest.reservations[0] ? {
      publicId: guest.reservations[0].gift.publicId,
      name: guest.reservations[0].gift.name,
      description: guest.reservations[0].gift.description,
      imageUrl: guest.reservations[0].gift.imageUrl,
      category: guest.reservations[0].gift.category,
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

export const getGuestGifts = async (req: Request, res: Response) => {
  const { guestId } = req.params;
  const id = Array.isArray(guestId) ? guestId[0] : guestId;

  const guest = await prisma.guest.findUnique({
    where: { publicId: id },
  });

  if (!guest || !guest.isActive) {
    throw new AppError('Invitado no encontrado o inactivo', 404);
  }

  const gifts = await prisma.gift.findMany({
    where: { eventId: guest.eventId, isActive: true },
    include: {
      reservations: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  const giftsPublic = gifts.map((g) => ({
    publicId: g.publicId,
    name: g.name,
    description: g.description,
    imageUrl: g.imageUrl,
    category: g.category,
    isReserved: g.isReserved || g.reservations.length >= g.maxReservations,
    isReservedByMe: g.reservations.some((r) => r.guestId === guest.id),
  }));

  res.json(giftsPublic);
};

export const reserveGift = async (req: Request, res: Response) => {
  const { guestId, giftId } = req.params;
  const gId = Array.isArray(guestId) ? guestId[0] : guestId;
  const gfId = Array.isArray(giftId) ? giftId[0] : giftId;

  const guest = await prisma.guest.findUnique({
    where: { publicId: gId },
    include: {
      reservations: {
        include: { gift: true },
      },
    },
  });

  if (!guest || !guest.isActive) {
    throw new AppError('Invitado no encontrado o inactivo', 404);
  }

  if (guest.reservations.length > 0) {
    throw new AppError('Ya tienes un regalo reservado. Debes cancelar la reserva actual antes de elegir otro.', 400);
  }

  const gift = await prisma.gift.findFirst({
    where: { publicId: gfId, eventId: guest.eventId, isActive: true },
    include: { reservations: true },
  });

  if (!gift) {
    throw new AppError('Regalo no encontrado', 404);
  }

  if (gift.isReserved || gift.reservations.length >= gift.maxReservations) {
    throw new AppError('Este regalo ya no está disponible', 400);
  }

  await prisma.$transaction(async (tx) => {
    await tx.giftReservation.create({
      data: {
        giftId: gift.id,
        guestId: guest.id,
      },
    });

    const currentReservationsCount = gift.reservations.length + 1;
    if (currentReservationsCount >= gift.maxReservations) {
      await tx.gift.update({
        where: { id: gift.id },
        data: { isReserved: true },
      });
    }
  });

  const gifts = await prisma.gift.findMany({
    where: { eventId: guest.eventId, isActive: true },
    include: { reservations: true },
    orderBy: { createdAt: 'desc' },
  });

  const giftsPublic = gifts.map((g) => ({
    publicId: g.publicId,
    name: g.name,
    description: g.description,
    imageUrl: g.imageUrl,
    category: g.category,
    isReserved: g.isReserved || g.reservations.length >= g.maxReservations,
    isReservedByMe: g.reservations.some((r) => r.guestId === guest.id),
  }));

  res.json({
    message: 'Regalo reservado con éxito',
    reservedGift: {
      publicId: gift.publicId,
      name: gift.name,
      description: gift.description,
      imageUrl: gift.imageUrl,
      category: gift.category,
    },
    gifts: giftsPublic,
  });
};

export const cancelGiftReservation = async (req: Request, res: Response) => {
  const { guestId } = req.params;
  const gId = Array.isArray(guestId) ? guestId[0] : guestId;

  const guest = await prisma.guest.findUnique({
    where: { publicId: gId },
    include: {
      reservations: true,
    },
  });

  if (!guest || !guest.isActive) {
    throw new AppError('Invitado no encontrado o inactivo', 404);
  }

  if (guest.reservations.length === 0) {
    throw new AppError('No tienes ningún regalo reservado', 400);
  }

  const reservation = guest.reservations[0];

  await prisma.$transaction(async (tx) => {
    await tx.giftReservation.delete({
      where: { id: reservation.id },
    });

    const gift = await tx.gift.findUnique({
      where: { id: reservation.giftId },
      include: { reservations: true },
    });

    if (gift && gift.reservations.length < gift.maxReservations) {
      await tx.gift.update({
        where: { id: gift.id },
        data: { isReserved: false },
      });
    }
  });

  const gifts = await prisma.gift.findMany({
    where: { eventId: guest.eventId, isActive: true },
    include: { reservations: true },
    orderBy: { createdAt: 'desc' },
  });

  const giftsPublic = gifts.map((g) => ({
    publicId: g.publicId,
    name: g.name,
    description: g.description,
    imageUrl: g.imageUrl,
    category: g.category,
    isReserved: g.isReserved || g.reservations.length >= g.maxReservations,
    isReservedByMe: false,
  }));

  res.json({
    message: 'Reserva cancelada con éxito',
    reservedGift: null,
    gifts: giftsPublic,
  });
};
