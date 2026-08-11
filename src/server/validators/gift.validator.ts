import { z } from 'zod';

export const createGiftSchema = z.object({
  name: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre es demasiado largo')
    .trim(),
  description: z
    .string()
    .max(500, 'La descripción es demasiado larga')
    .optional()
    .or(z.literal(''))
    .transform((v) => (v === '' ? undefined : v)),
  category: z
    .enum(['ropa', 'accesorios', 'juguetes', 'habitación', 'otros'], {
      message: 'Categoría inválida',
    })
    .optional()
    .or(z.literal(''))
    .transform((v) => (v === '' ? undefined : v)),
  maxReservations: z
    .coerce.number()
    .int('Debe ser un número entero')
    .min(1, 'Debe permitir al menos 1 selección')
    .max(50, 'Máximo 50 selecciones')
    .default(1),
});

export type CreateGiftInput = z.infer<typeof createGiftSchema>;
