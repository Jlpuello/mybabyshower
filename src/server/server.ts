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
import { errorHandler, notFoundHandler } from './middleware/error.middleware.ts';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
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

// API routes
app.use('/api/event', eventRoutes);
app.use('/api/invitations', guestRoutes);
app.use('/api/admin', authRoutes);
app.use('/api/admin', adminRoutes);

// Servir frontend en producción (SPA fallback)
const publicPath = path.join(process.cwd(), 'public');
if (fs.existsSync(publicPath)) {
  app.use(express.static(publicPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/uploads') || req.path === '/health') {
      return next();
    }
    res.sendFile(path.join(publicPath, 'index.html'));
  });
}

// 404 handler
app.use(notFoundHandler);

// Error handler (debe ser el último middleware)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
