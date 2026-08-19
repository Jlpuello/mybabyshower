import { useState, useEffect, useRef } from 'react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Gift, ImagePlus, X, Hash, AlignLeft, Tag } from 'lucide-react';
import { motion } from 'framer-motion';
import type { GiftRow } from './CreateGiftModal';

const CATEGORIES = [
  { value: 'ropa', label: '👕 Ropa' },
  { value: 'accesorios', label: '🎀 Accesorios' },
  { value: 'juguetes', label: '🧸 Juguetes' },
  { value: 'habitación', label: '🛏 Habitación' },
  { value: 'otros', label: '📦 Otros' },
];

interface EditGiftModalProps {
  gift: GiftRow | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (updatedGift: GiftRow) => void;
}

interface FormErrors {
  name?: string;
  maxReservations?: string;
  image?: string;
  general?: string;
}

export const EditGiftModal = ({ gift, isOpen, onClose, onSuccess }: EditGiftModalProps) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [maxReservations, setMaxReservations] = useState(1);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (gift) {
      setName(gift.name || '');
      setDescription(gift.description || '');
      setCategory(gift.category || '');
      setMaxReservations(gift.maxReservations || 1);
      setImagePreview(gift.imageUrl || null);
      setImageFile(null);
      setErrors({});
    }
  }, [gift, isOpen]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setErrors((p) => ({ ...p, image: 'La imagen no puede superar 5 MB' }));
      return;
    }
    setErrors((p) => ({ ...p, image: undefined }));
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const validate = (): boolean => {
    const errs: FormErrors = {};
    if (!name.trim()) errs.name = 'El nombre es requerido';
    else if (name.trim().length < 2) errs.name = 'Mínimo 2 caracteres';
    if (maxReservations < 1) errs.maxReservations = 'Mínimo 1';
    if (maxReservations > 50) errs.maxReservations = 'Máximo 50';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gift || !validate()) return;

    setLoading(true);
    setErrors({});

    try {
      const token = localStorage.getItem('authToken');
      const formData = new FormData();
      formData.append('name', name.trim());
      formData.append('description', description.trim());
      formData.append('category', category);
      formData.append('maxReservations', String(maxReservations));
      if (imageFile) formData.append('image', imageFile);

      const res = await fetch(`/api/admin/gifts/${gift.publicId}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Error al actualizar el regalo');
      }

      const updatedGift: GiftRow = await res.json();
      onSuccess(updatedGift);
      onClose();
    } catch (err) {
      setErrors({ general: err instanceof Error ? err.message : 'Error inesperado' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Editar regalo" size="lg">
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
          {/* Columna izquierda */}
          <div className="space-y-4">
            {/* Nombre */}
            <div className="relative">
              <div className="absolute left-3 top-9 text-textLight pointer-events-none">
                <Gift className="w-4 h-4" />
              </div>
              <Input
                id="edit-gift-name"
                label="Nombre del regalo *"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name) setErrors((p) => ({ ...p, name: undefined }));
                }}
                placeholder="Ej: Set de ropa 0-3 meses"
                error={errors.name}
                disabled={loading}
                autoFocus
                className="pl-9"
              />
            </div>

            {/* Descripción */}
            <div>
              <label className="block text-sm font-medium text-textSecondary mb-1">
                <AlignLeft className="inline w-3.5 h-3.5 mr-1" />
                Descripción
              </label>
              <textarea
                id="edit-gift-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Descripción breve del regalo..."
                disabled={loading}
                rows={3}
                className="w-full px-4 py-2 rounded-lg border border-warmBeige bg-white text-textPrimary placeholder:text-textLight focus:outline-none focus:ring-2 focus:ring-goldAccent focus:border-transparent transition-colors resize-none text-sm"
              />
            </div>

            {/* Categoría */}
            <div>
              <label className="block text-sm font-medium text-textSecondary mb-1">
                <Tag className="inline w-3.5 h-3.5 mr-1" />
                Categoría
              </label>
              <select
                id="edit-gift-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                disabled={loading}
                className="w-full px-4 py-2 rounded-lg border border-warmBeige bg-white text-textPrimary focus:outline-none focus:ring-2 focus:ring-goldAccent focus:border-transparent transition-colors text-sm"
              >
                <option value="">Sin categoría</option>
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Máximo de selecciones */}
            <div>
              <label className="block text-sm font-medium text-textSecondary mb-1">
                <Hash className="inline w-3.5 h-3.5 mr-1" />
                Veces que puede seleccionarse *
              </label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setMaxReservations((v) => Math.max(1, v - 1))}
                  disabled={loading || maxReservations <= 1}
                  className="w-9 h-9 rounded-lg border border-warmBeige bg-ivory text-textPrimary font-bold hover:bg-warmBeige transition-colors disabled:opacity-40 flex items-center justify-center text-lg"
                >
                  −
                </button>
                <input
                  type="number"
                  value={maxReservations}
                  onChange={(e) => {
                    const v = parseInt(e.target.value, 10);
                    if (!isNaN(v)) setMaxReservations(Math.max(1, Math.min(50, v)));
                  }}
                  min={1}
                  max={50}
                  disabled={loading}
                  className="w-16 text-center px-2 py-2 rounded-lg border border-warmBeige text-textPrimary focus:outline-none focus:ring-2 focus:ring-goldAccent text-sm font-semibold"
                />
                <button
                  type="button"
                  onClick={() => setMaxReservations((v) => Math.min(50, v + 1))}
                  disabled={loading || maxReservations >= 50}
                  className="w-9 h-9 rounded-lg border border-warmBeige bg-ivory text-textPrimary font-bold hover:bg-warmBeige transition-colors disabled:opacity-40 flex items-center justify-center text-lg"
                >
                  +
                </button>
              </div>
              {errors.maxReservations && (
                <p className="mt-1 text-sm text-red-600">{errors.maxReservations}</p>
              )}
            </div>
          </div>

          {/* Columna derecha — imagen */}
          <div>
            <label className="block text-sm font-medium text-textSecondary mb-1">
              <ImagePlus className="inline w-3.5 h-3.5 mr-1" />
              Imagen del regalo
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
              onChange={handleImageChange}
              className="hidden"
              id="edit-gift-image-input"
            />

            {imagePreview ? (
              <div className="relative w-full aspect-square rounded-xl overflow-hidden border-2 border-goldAccent/30">
                <img
                  src={imagePreview}
                  alt="Vista previa"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <label
                htmlFor="edit-gift-image-input"
                className="flex flex-col items-center justify-center w-full aspect-square rounded-xl border-2 border-dashed border-warmBeige bg-ivory hover:border-goldAccent hover:bg-cream transition-colors cursor-pointer"
              >
                <ImagePlus className="w-10 h-10 text-textLight mb-3" />
                <p className="text-sm font-medium text-textSecondary">Cambiar imagen</p>
                <p className="text-xs text-textLight mt-1">JPEG, PNG, WEBP · Máx 5 MB</p>
              </label>
            )}
            {errors.image && (
              <p className="mt-1 text-sm text-red-600">{errors.image}</p>
            )}
          </div>
        </div>

        {/* Acciones */}
        <div className="flex gap-3 pt-1 border-t border-gray-100">
          <Button type="button" variant="secondary" fullWidth onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="primary"
            fullWidth
            disabled={loading || !name.trim()}
          >
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
