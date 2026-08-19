import { useState, useEffect, useRef } from 'react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Camera, Video, Upload, X, Calendar, AlignLeft, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import type { MemoryRow } from './CreateMemoryModal';

interface EditMemoryModalProps {
  memory: MemoryRow | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (updatedMemory: MemoryRow) => void;
}

interface FormErrors {
  title?: string;
  media?: string;
  general?: string;
}

export const EditMemoryModal = ({ memory, isOpen, onClose, onSuccess }: EditMemoryModalProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [isPublished, setIsPublished] = useState(true);
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<'IMAGE' | 'VIDEO' | null>(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const IMAGE_MIMES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
  const VIDEO_MIMES = ['video/mp4', 'video/quicktime', 'video/webm', 'video/x-msvideo', 'video/avi'];

  useEffect(() => {
    if (memory) {
      setTitle(memory.title || '');
      setDescription(memory.description || '');
      setEventDate(memory.eventDate ? new Date(memory.eventDate).toISOString().split('T')[0] : '');
      setIsPublished(memory.isPublished);
      setMediaPreview(memory.mediaUrl || null);
      setMediaType(memory.mediaType || 'IMAGE');
      setMediaFile(null);
      setErrors({});
    }
  }, [memory, isOpen]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isImg = IMAGE_MIMES.includes(file.type);
    const isVid = VIDEO_MIMES.includes(file.type);

    if (!isImg && !isVid) {
      setErrors((p) => ({ ...p, media: 'Solo se permiten imágenes (JPEG, PNG, WEBP) o videos (MP4, MOV, WEBM)' }));
      return;
    }
    if (file.size > 100 * 1024 * 1024) {
      setErrors((p) => ({ ...p, media: 'El archivo no puede superar 100 MB' }));
      return;
    }

    setErrors((p) => ({ ...p, media: undefined }));
    setMediaFile(file);
    setMediaType(isImg ? 'IMAGE' : 'VIDEO');
    setMediaPreview(URL.createObjectURL(file));
  };

  const removeMedia = () => {
    setMediaFile(null);
    setMediaPreview(null);
    setMediaType(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const validate = (): boolean => {
    const errs: FormErrors = {};
    if (!title.trim()) errs.title = 'El título es requerido';
    else if (title.trim().length < 2) errs.title = 'Mínimo 2 caracteres';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!memory || !validate()) return;

    setLoading(true);
    setErrors({});

    try {
      const token = localStorage.getItem('authToken');
      const formData = new FormData();
      formData.append('title', title.trim());
      formData.append('description', description.trim());
      formData.append('eventDate', eventDate);
      formData.append('isPublished', String(isPublished));
      if (mediaFile) formData.append('media', mediaFile);

      const res = await fetch(`/api/admin/memories/${memory.publicId}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Error al actualizar el recuerdo');
      }

      const updatedMemory: MemoryRow = await res.json();
      onSuccess(updatedMemory);
      onClose();
    } catch (err) {
      setErrors({ general: err instanceof Error ? err.message : 'Error inesperado' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Editar recuerdo" size="lg">
      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        {errors.general && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3"
          >
            {errors.general}
          </motion.div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Columna izquierda — campos */}
          <div className="space-y-4">
            <Input
              id="edit-memory-title"
              label="Título *"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errors.title) setErrors((p) => ({ ...p, title: undefined }));
              }}
              placeholder="Ej: El día que supimos la noticia"
              error={errors.title}
              disabled={loading}
              autoFocus
            />

            <div>
              <label className="block text-sm font-medium text-textSecondary mb-1">
                <AlignLeft className="inline w-3.5 h-3.5 mr-1" />
                Descripción
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Un momento especial..."
                disabled={loading}
                rows={3}
                className="w-full px-4 py-2 rounded-lg border border-warmBeige bg-white text-textPrimary placeholder:text-textLight focus:outline-none focus:ring-2 focus:ring-goldAccent transition-colors resize-none text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-textSecondary mb-1">
                <Calendar className="inline w-3.5 h-3.5 mr-1" />
                Fecha del recuerdo
              </label>
              <input
                type="date"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                disabled={loading}
                className="w-full px-4 py-2 rounded-lg border border-warmBeige bg-white text-textPrimary focus:outline-none focus:ring-2 focus:ring-goldAccent transition-colors text-sm"
              />
            </div>

            {/* Toggle publicar */}
            <div className="flex items-center justify-between bg-ivory rounded-xl px-4 py-3">
              <div>
                <p className="text-sm font-medium text-textPrimary">Publicar en la galería</p>
                <p className="text-xs text-textLight mt-0.5">Visible para todos los visitantes</p>
              </div>
              <button
                type="button"
                onClick={() => setIsPublished((v) => !v)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-goldAccent focus:ring-offset-2 ${
                  isPublished ? 'bg-goldAccent' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                    isPublished ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center gap-2 text-xs text-textLight">
              {isPublished ? (
                <><Eye className="w-3.5 h-3.5 text-green-500" /> <span className="text-green-600">Publicado</span></>
              ) : (
                <><EyeOff className="w-3.5 h-3.5" /> Guardado como borrador</>
              )}
            </div>
          </div>

          {/* Columna derecha — media */}
          <div>
            <label className="block text-sm font-medium text-textSecondary mb-1">
              Foto o video
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp,image/gif,video/mp4,video/quicktime,video/webm"
              onChange={handleFileChange}
              className="hidden"
              id="edit-memory-media-input"
            />

            {mediaPreview ? (
              <div className="relative w-full aspect-square rounded-xl overflow-hidden border-2 border-goldAccent/30">
                {mediaType === 'IMAGE' ? (
                  <img src={mediaPreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <video src={mediaPreview} className="w-full h-full object-cover" controls muted />
                )}
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-xs font-semibold bg-black/60 text-white flex items-center gap-1">
                  {mediaType === 'IMAGE' ? <Camera className="w-3 h-3" /> : <Video className="w-3 h-3" />}
                  {mediaType === 'IMAGE' ? 'Imagen' : 'Video'}
                </div>
                <button
                  type="button"
                  onClick={removeMedia}
                  className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <label
                htmlFor="edit-memory-media-input"
                className={`flex flex-col items-center justify-center w-full aspect-square rounded-xl border-2 border-dashed cursor-pointer transition-colors ${
                  errors.media
                    ? 'border-red-300 bg-red-50 hover:border-red-400'
                    : 'border-warmBeige bg-ivory hover:border-goldAccent hover:bg-cream'
                }`}
              >
                <Upload className="w-10 h-10 text-textLight mb-3" />
                <p className="text-sm font-medium text-textSecondary">Cambiar foto o video</p>
                <p className="text-xs text-textLight mt-1 text-center px-4">
                  JPEG, PNG, WEBP · MP4, MOV, WEBM
                </p>
                <p className="text-xs text-textLight mt-0.5">Máx 100 MB</p>
              </label>
            )}
            {errors.media && (
              <p className="mt-1.5 text-sm text-red-600">{errors.media}</p>
            )}
          </div>
        </div>

        <div className="flex gap-3 pt-1 border-t border-gray-100">
          <Button type="button" variant="secondary" fullWidth onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" fullWidth disabled={loading || !title.trim()}>
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Guardando...
              </span>
            ) : (
              <span>Guardar cambios</span>
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
