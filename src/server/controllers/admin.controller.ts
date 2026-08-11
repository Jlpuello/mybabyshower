import type { Response } from 'express';
import { prisma } from '../config/database.ts';
import { AppError } from '../middleware/error.middleware.ts';
import type { AuthRequest } from '../middleware/auth.middleware.ts';

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

/**
 * Genera un código de invitación único con el formato BS-XXXX.
 * Reintenta hasta maxAttempts veces si el código ya existe en BD.
 */
const CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // sin I, O, 0, 1 para evitar confusiones

function generateCode(): string {
  let code = 'BS-';
  for (let i = 0; i < 4; i++) {
    code += CHARS[Math.floor(Math.random() * CHARS.length)];
  }
  return code;
}

async function generateUniqueCode(maxAttempts = 10): Promise<string> {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const code = generateCode();
    const existing = await prisma.guest.findUnique({
      where: { invitationCode: code },
    });
    if (!existing) return code;
  }
  throw new AppError('No se pudo generar un código único. Inténtalo de nuevo.', 500);
}

// ─────────────────────────────────────────────
// Controllers
// ─────────────────────────────────────────────

/** GET /api/admin/guests — Lista todos los invitados del evento del admin */
export const listGuests = async (req: AuthRequest, res: Response) => {
  const eventId = req.eventId;

  if (!eventId) {
    throw new AppError('No autorizado', 401);
  }

  const guests = await prisma.guest.findMany({
    where: { eventId },
    orderBy: { createdAt: 'desc' },
    select: {
      publicId: true,
      name: true,
      phone: true,
      email: true,
      invitationCode: true,
      attendanceStatus: true,
      isActive: true,
      createdAt: true,
      reservations: {
        select: {
          gift: {
            select: { name: true },
          },
        },
      },
    },
  });

  res.json(guests);
};

/** POST /api/admin/guests — Crea un nuevo invitado con código de invitación generado */
export const createGuest = async (req: AuthRequest, res: Response) => {
  const eventId = req.eventId;

  if (!eventId) {
    throw new AppError('No autorizado', 401);
  }

  const { name, phone, email } = req.body as {
    name: string;
    phone: string;
    email?: string;
  };

  const invitationCode = await generateUniqueCode();

  const guest = await prisma.guest.create({
    data: {
      publicId: `guest-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      eventId,
      name: name.trim(),
      phone: phone.trim(),
      email: email?.trim() || null,
      invitationCode,
    },
    select: {
      publicId: true,
      name: true,
      phone: true,
      email: true,
      invitationCode: true,
      attendanceStatus: true,
      isActive: true,
      createdAt: true,
    },
  });

  res.status(201).json(guest);
};
