import { z } from 'zod';

export const validateInvitationSchema = z.object({
  code: z.string().min(1, 'El código es requerido').max(20, 'Código inválido'),
});

export const rsvpSchema = z.object({
  status: z.enum(['CONFIRMED', 'DECLINED'], {
    message: 'El estado debe ser CONFIRMED o DECLINED',
  }),
});

export type ValidateInvitationInput = z.infer<typeof validateInvitationSchema>;
export type RsvpInput = z.infer<typeof rsvpSchema>;
