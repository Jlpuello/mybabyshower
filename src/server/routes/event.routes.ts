import { Router } from 'express';
import { getEvent } from '../controllers/event.controller.ts';
import { listPublicMemories } from '../controllers/memory.controller.ts';
import { generalLimiter } from '../middleware/rateLimit.middleware.ts';

const router = Router();

router.get('/', generalLimiter, getEvent);
router.get('/memories', generalLimiter, listPublicMemories);

export default router;
