import { Router } from 'express';
import { validateInvitation, updateRsvp } from '../controllers/guest.controller.ts';
import { codeValidationLimiter } from '../middleware/rateLimit.middleware.ts';
import { validate } from '../middleware/validate.middleware.ts';
import { validateInvitationSchema, rsvpSchema } from '../validators/guest.validator.ts';

const router = Router();

router.post('/validate', codeValidationLimiter, validate(validateInvitationSchema), validateInvitation);
router.patch('/:guestId/rsvp', validate(rsvpSchema), updateRsvp);

export default router;
