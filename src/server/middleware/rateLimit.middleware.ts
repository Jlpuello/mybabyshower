import rateLimit from 'express-rate-limit';

// Rate limiting general
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo 100 requests por ventana
  message: 'Demasiadas solicitudes desde esta IP, por favor intenta más tarde.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiting estricto para validación de códigos
export const codeValidationLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minuto
  max: 5, // máximo 5 intentos por minuto
  message: 'Demasiados intentos de validación, por favor espera un minuto.',
  skipSuccessfulRequests: true,
});

// Rate limiting para login
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // máximo 5 intentos de login por ventana
  message: 'Demasiados intentos de login, por favor intenta más tarde.',
  skipSuccessfulRequests: true,
});
