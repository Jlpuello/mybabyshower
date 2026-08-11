import { Router } from 'express';
import {
  validateInvitation,
  updateRsvp,
  getGuestGifts,
  reserveGift,
  cancelGiftReservation,
} from '../controllers/guest.controller.ts';
import { codeValidationLimiter } from '../middleware/rateLimit.middleware.ts';
import { validate } from '../middleware/validate.middleware.ts';
import { validateInvitationSchema, rsvpSchema } from '../validators/guest.validator.ts';

const router = Router();

router.post('/validate', codeValidationLimiter, validate(validateInvitationSchema), validateInvitation);
router.patch('/:guestId/rsvp', validate(rsvpSchema), updateRsvp);
router.get('/:guestId/gifts', getGuestGifts);
router.post('/:guestId/gifts/:giftId/reserve', reserveGift);
router.delete('/:guestId/gifts/reserve', cancelGiftReservation);

export default router;
