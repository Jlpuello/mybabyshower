import multer from 'multer';
import path from 'path';
import fs from 'fs';

const UPLOAD_DIR = path.join(process.cwd(), 'uploads', 'gifts');

// Crear directorio si no existe
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e6)}`;
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `gift-${uniqueSuffix}${ext}`);
  },
});

const fileFilter = (
  _req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Solo se permiten imágenes (JPEG, PNG, WEBP, GIF)'));
  }
};

export const uploadGiftImage = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
}).single('image');

// ── Memories: imagen + video ──────────────────────────────────────
const MEMORY_DIR = path.join(process.cwd(), 'uploads', 'memories');

if (!fs.existsSync(MEMORY_DIR)) {
  fs.mkdirSync(MEMORY_DIR, { recursive: true });
}

const memoryStorage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, MEMORY_DIR),
  filename: (_req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e6)}`;
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `memory-${uniqueSuffix}${ext}`);
  },
});

const memoryFileFilter = (
  _req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const allowedImages = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
  const allowedVideos = ['video/mp4', 'video/quicktime', 'video/webm', 'video/x-msvideo', 'video/avi'];
  if ([...allowedImages, ...allowedVideos].includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Solo se permiten imágenes (JPEG, PNG, WEBP) o videos (MP4, MOV, WEBM)'));
  }
};

export const uploadMemoryFile = multer({
  storage: memoryStorage,
  fileFilter: memoryFileFilter,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100 MB para videos
}).single('media');

// ── Event: hero, location y revelation ────────────────────────────
const EVENT_DIR = path.join(process.cwd(), 'uploads', 'event');

if (!fs.existsSync(EVENT_DIR)) {
  fs.mkdirSync(EVENT_DIR, { recursive: true });
}

const eventStorage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, EVENT_DIR),
  filename: (_req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e6)}`;
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `event-${file.fieldname}-${uniqueSuffix}${ext}`);
  },
});

export const uploadEventFiles = multer({
  storage: eventStorage,
  fileFilter: memoryFileFilter,
  limits: { fileSize: 100 * 1024 * 1024 },
}).fields([
  { name: 'heroImage', maxCount: 1 },
  { name: 'locationImage', maxCount: 1 },
  { name: 'revelationMedia', maxCount: 1 },
]);
