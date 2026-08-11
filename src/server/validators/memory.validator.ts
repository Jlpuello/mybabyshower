import { z } from 'zod';

export const createMemorySchema = z.object({
  title: z
    .string()
    .min(2, 'El título debe tener al menos 2 caracteres')
    .max(120, 'El título es demasiado largo')
    .trim(),
  description: z
    .string()
    .max(1000, 'La descripción es demasiado larga')
    .optional()
    .or(z.literal(''))
    .transform((v) => (v === '' ? undefined : v)),
  eventDate: z
    .string()
    .optional()
    .or(z.literal(''))
    .transform((v) => (v ? new Date(v) : undefined))
    .refine((v) => !v || !isNaN(v as unknown as number), { message: 'Fecha inválida' }),
  isPublished: z
    .boolean()
    .or(z.enum(['true', 'false']).transform((v) => v === 'true'))
    .default(false),
});

export const reorderMemoriesSchema = z.object({
  orderedIds: z.array(z.string()).min(1, 'Se requiere al menos un elemento'),
});

export type CreateMemoryInput = z.infer<typeof createMemorySchema>;
export type ReorderMemoriesInput = z.infer<typeof reorderMemoriesSchema>;
