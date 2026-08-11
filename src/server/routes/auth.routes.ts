import { Router } from 'express';
import { login } from '../controllers/auth.controller.ts';
import { loginLimiter } from '../middleware/rateLimit.middleware.ts';
import { validate } from '../middleware/validate.middleware.ts';
import { loginSchema } from '../validators/auth.validator.ts';

const router = Router();

router.post('/login', loginLimiter, validate(loginSchema), login);

export default router;
