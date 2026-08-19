import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware.ts';
import { validate } from '../middleware/validate.middleware.ts';
import { createGuestSchema, updateGuestSchema } from '../validators/admin.validator.ts';
import { createGiftSchema } from '../validators/gift.validator.ts';
import { reorderMemoriesSchema } from '../validators/memory.validator.ts';
import { updateEventSchema } from '../validators/event.validator.ts';
import { listGuests, createGuest, updateGuest } from '../controllers/admin.controller.ts';
import { listGifts, createGift, updateGift, deleteGift } from '../controllers/gift.controller.ts';
import { listMemories, createMemory, updateMemory, togglePublish, reorderMemories, deleteMemory } from '../controllers/memory.controller.ts';
import { getAdminEvent, updateEvent } from '../controllers/event.controller.ts';
import { uploadGiftImage, uploadMemoryFile, uploadEventFiles } from '../config/upload.ts';

const router = Router();

// Todos los endpoints admin requieren JWT
router.use(authenticate);

// Invitados
router.get('/guests', listGuests);
router.post('/guests', validate(createGuestSchema), createGuest);
router.put('/guests/:publicId', validate(updateGuestSchema), updateGuest);

// Regalos
router.get('/gifts', listGifts);
router.post('/gifts', uploadGiftImage, validate(createGiftSchema), createGift);
router.put('/gifts/:giftId', uploadGiftImage, updateGift);
router.delete('/gifts/:giftId', deleteGift);

// Recuerdos
router.get('/memories', listMemories);
router.post('/memories', uploadMemoryFile, createMemory);
router.put('/memories/:memoryId', uploadMemoryFile, updateMemory);
router.patch('/memories/reorder', validate(reorderMemoriesSchema), reorderMemories);
router.patch('/memories/:memoryId/toggle', togglePublish);
router.delete('/memories/:memoryId', deleteMemory);

// Datos del Evento
router.get('/event', getAdminEvent);
router.put('/event', uploadEventFiles, validate(updateEventSchema), updateEvent);

export default router;
