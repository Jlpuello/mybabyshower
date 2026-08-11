import { z } from 'zod';

export const updateEventSchema = z.object({
  title: z
    .string()
    .min(2, 'El título debe tener al menos 2 caracteres')
    .max(150, 'El título es demasiado largo')
    .trim(),
  babyName: z
    .string()
    .max(100, 'El nombre es demasiado largo')
    .optional()
    .or(z.literal(''))
    .transform((v) => (v === '' ? undefined : v)),
  description: z
    .string()
    .max(1000, 'La descripción es demasiado larga')
    .optional()
    .or(z.literal(''))
    .transform((v) => (v === '' ? undefined : v)),
  eventDate: z
    .string()
    .min(1, 'La fecha es requerida'),
  eventTime: z
    .string()
    .min(1, 'La hora es requerida'),
  location: z
    .string()
    .min(2, 'El lugar es requerido')
    .max(200, 'El nombre del lugar es demasiado largo')
    .trim(),
  address: z
    .string()
    .min(2, 'La dirección es requerida')
    .max(300, 'La dirección es demasiado larga')
    .trim(),
  latitude: z
    .coerce.number()
    .optional()
    .or(z.literal(''))
    .transform((v) => (v === '' ? undefined : v)),
  longitude: z
    .coerce.number()
    .optional()
    .or(z.literal(''))
    .transform((v) => (v === '' ? undefined : v)),
  storyTitle: z
    .string()
    .max(150)
    .optional()
    .or(z.literal(''))
    .transform((v) => (v === '' ? undefined : v)),
  storyContent: z
    .string()
    .max(2000)
    .optional()
    .or(z.literal(''))
    .transform((v) => (v === '' ? undefined : v)),
  revelationTitle: z
    .string()
    .max(150)
    .optional()
    .or(z.literal(''))
    .transform((v) => (v === '' ? undefined : v)),
  revelationContent: z
    .string()
    .max(2000)
    .optional()
    .or(z.literal(''))
    .transform((v) => (v === '' ? undefined : v)),
  isRevealed: z
    .boolean()
    .or(z.enum(['true', 'false']).transform((v) => v === 'true'))
    .default(false),
  primaryColor: z
    .string()
    .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Color primario inválido')
    .optional()
    .or(z.literal(''))
    .transform((v) => (v === '' ? undefined : v)),
  secondaryColor: z
    .string()
    .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Color secundario inválido')
    .optional()
    .or(z.literal(''))
    .transform((v) => (v === '' ? undefined : v)),
  metaTitle: z
    .string()
    .max(150)
    .optional()
    .or(z.literal(''))
    .transform((v) => (v === '' ? undefined : v)),
  metaDescription: z
    .string()
    .max(300)
    .optional()
    .or(z.literal(''))
    .transform((v) => (v === '' ? undefined : v)),
});

export type UpdateEventInput = z.infer<typeof updateEventSchema>;
