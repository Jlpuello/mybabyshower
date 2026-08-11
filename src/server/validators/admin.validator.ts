import { z } from 'zod';

export const createGuestSchema = z.object({
  name: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre es demasiado largo')
    .trim(),
  phone: z
    .string()
    .min(7, 'El teléfono debe tener al menos 7 dígitos')
    .max(20, 'El teléfono es demasiado largo')
    .trim(),
  email: z
    .string()
    .email('El email no es válido')
    .optional()
    .or(z.literal(''))
    .transform((val) => (val === '' ? undefined : val)),
});

export type CreateGuestInput = z.infer<typeof createGuestSchema>;

export const updateGuestSchema = z.object({
  name: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre es demasiado largo')
    .trim()
    .optional(),
  phone: z
    .string()
    .min(7, 'El teléfono debe tener al menos 7 dígitos')
    .max(20, 'El teléfono es demasiado largo')
    .trim()
    .optional(),
  email: z
    .string()
    .email('El email no es válido')
    .optional()
    .nullable()
    .or(z.literal(''))
    .transform((val) => (val === '' ? null : val)),
  attendanceStatus: z.enum(['PENDING', 'CONFIRMED', 'DECLINED']).optional(),
  isActive: z.boolean().optional(),
});

export type UpdateGuestInput = z.infer<typeof updateGuestSchema>;
