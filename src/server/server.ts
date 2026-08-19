import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import eventRoutes from './routes/event.routes.ts';
import guestRoutes from './routes/guest.routes.ts';
import authRoutes from './routes/auth.routes.ts';
import adminRoutes from './routes/admin.routes.ts';
import sitemapRoutes from './routes/sitemap.routes.ts';
import { seoMiddleware } from './middleware/seo.middleware.ts';
import { errorHandler, notFoundHandler } from './middleware/error.middleware.ts';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Trust proxy para rate-limit cuando está detrás de proxy/reverse proxy (Docker, nginx, etc.)
app.set('trust proxy', true);

// Middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  contentSecurityPolicy: false,
  hsts: false,
}));
app.use(cors({
  origin: process.env.FRONTEND_URL || true,
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos subidos
const uploadsPath = fs.existsSync(path.join(process.cwd(), 'uploads'))
  ? path.join(process.cwd(), 'uploads')
  : path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '..', 'uploads');
app.use('/uploads', express.static(uploadsPath));

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Rutas de sitemap y robots
app.use(sitemapRoutes);

// API routes
app.use('/api/event', eventRoutes);
app.use('/api/invitations', guestRoutes);
app.use('/api/admin', authRoutes);
app.use('/api/admin', adminRoutes);

// Servir archivos estáticos del frontend (dist o public)
const distPath = path.join(process.cwd(), 'dist');
const publicPath = path.join(process.cwd(), 'public');

if (fs.existsSync(distPath)) {
  app.use(express.static(distPath, { index: false }));
}
if (fs.existsSync(publicPath)) {
  app.use(express.static(publicPath, { index: false }));
}

// Middleware de SEO para servir index.html inyectado con Open Graph y meta tags dinámicos
app.use(seoMiddleware);

// 404 handler
app.use(notFoundHandler);

// Error handler (debe ser el último middleware)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
