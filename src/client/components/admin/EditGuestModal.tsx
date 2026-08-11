import { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { UserCheck, Phone, Mail, User, Ticket, Gift, Check, Copy } from 'lucide-react';
import { motion } from 'framer-motion';
import type { GuestRow } from './GuestsTable';

interface EditGuestModalProps {
  guest: GuestRow | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (updatedGuest: GuestRow) => void;
}

interface FormErrors {
  name?: string;
  phone?: string;
  email?: string;
  general?: string;
}

export const EditGuestModal = ({ guest, isOpen, onClose, onSuccess }: EditGuestModalProps) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [attendanceStatus, setAttendanceStatus] = useState<'PENDING' | 'CONFIRMED' | 'DECLINED'>('PENDING');
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (guest) {
      setName(guest.name || '');
      setPhone(guest.phone || '');
      setEmail(guest.email || '');
      setAttendanceStatus(guest.attendanceStatus || 'PENDING');
      setIsActive(guest.isActive !== false);
      setErrors({});
    }
  }, [guest]);

  const handleCopyCode = async () => {
    if (!guest) return;
    await navigator.clipboard.writeText(guest.invitationCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    const trimmedName = name.trim();
    const trimmedPhone = phone.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName) {
      newErrors.name = 'El nombre es requerido';
    } else if (trimmedName.length < 2) {
      newErrors.name = 'El nombre debe tener al menos 2 caracteres';
    }

    if (!trimmedPhone) {
      newErrors.phone = 'El teléfono es requerido';
    } else if (trimmedPhone.replace(/\D/g, '').length < 7) {
      newErrors.phone = 'El teléfono debe tener al menos 7 dígitos';
    }

    if (trimmedEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      newErrors.email = 'El email no es válido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guest || !validate()) return;

    setLoading(true);
    setErrors({});

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`/api/admin/guests/${guest.publicId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          email: email.trim() || undefined,
          attendanceStatus,
          isActive,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Error al actualizar el invitado');
      }

      const updated = await response.json();
      onSuccess(updated);
      onClose();
    } catch (err) {
      setErrors({
        general: err instanceof Error ? err.message : 'Ocurrió un error inesperado',
      });
    } finally {
      setLoading(false);
    }
  };

  if (!guest) return null;

  const reservedGiftName = guest.reservations && guest.reservations.length > 0
    ? guest.reservations[0].gift.name
    : null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Editar invitado" size="md">
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {errors.general && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3"
          >
            {errors.general}
          </motion.div>
        )}

        {/* Info destacada de Código y Regalo reservado */}
        <div className="bg-ivory rounded-xl p-3.5 border border-warmBeige/60 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-textSecondary">
              <Ticket className="w-4 h-4 text-goldAccent" />
              <span>Código: <strong className="font-mono text-textPrimary">{guest.invitationCode}</strong></span>
            </div>
            <button
              type="button"
              onClick={handleCopyCode}
              className="text-xs text-goldAccent hover:underline flex items-center gap-1 font-medium cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copiado' : 'Copiar'}</span>
            </button>
          </div>

          {/* Indicador de regalo */}
          <div className="flex items-center gap-2 text-xs pt-1 border-t border-warmBeige/40">
            <Gift className="w-4 h-4 text-pink-500" />
            <span className="text-textSecondary">
              Regalo seleccionado:{' '}
              {reservedGiftName ? (
                <strong className="text-pink-700 bg-pink-50 px-2 py-0.5 rounded-full font-medium">
                  🎁 {reservedGiftName}
                </strong>
              ) : (
                <span className="text-textLight italic">Ninguno por el momento</span>
              )}
            </span>
          </div>
        </div>

        {/* Nombre */}
        <div className="relative">
          <div className="absolute left-3 top-9 text-textLight pointer-events-none">
            <User className="w-4 h-4" />
          </div>
          <Input
            id="edit-guest-name"
            label="Nombre completo *"
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
            }}
            placeholder="Nombre completo"
            error={errors.name}
            disabled={loading}
            className="pl-9"
          />
        </div>

        {/* Teléfono */}
        <div className="relative">
          <div className="absolute left-3 top-9 text-textLight pointer-events-none">
            <Phone className="w-4 h-4" />
          </div>
          <Input
            id="edit-guest-phone"
            label="Teléfono *"
            type="tel"
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value);
              if (errors.phone) setErrors((prev) => ({ ...prev, phone: undefined }));
            }}
            placeholder="+57 300 000 0000"
            error={errors.phone}
            disabled={loading}
            className="pl-9"
          />
        </div>

        {/* Email */}
        <div className="relative">
          <div className="absolute left-3 top-9 text-textLight pointer-events-none">
            <Mail className="w-4 h-4" />
          </div>
          <Input
            id="edit-guest-email"
            label="Email (opcional)"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
            }}
            placeholder="maria@ejemplo.com"
            error={errors.email}
            disabled={loading}
            className="pl-9"
          />
        </div>

        {/* Selector de Asistencia */}
        <div>
          <label className="block text-sm font-medium text-textPrimary mb-1.5">
            Estado de Asistencia
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'PENDING', label: 'Pendiente', style: 'border-amber-300 bg-amber-50 text-amber-800' },
              { id: 'CONFIRMED', label: 'Confirmado', style: 'border-green-300 bg-green-50 text-green-800' },
              { id: 'DECLINED', label: 'Declinado', style: 'border-red-300 bg-red-50 text-red-800' },
            ].map((st) => (
              <button
                key={st.id}
                type="button"
                onClick={() => setAttendanceStatus(st.id as 'PENDING' | 'CONFIRMED' | 'DECLINED')}
                className={`py-2 px-2 text-xs font-semibold rounded-lg border transition-all text-center cursor-pointer ${
                  attendanceStatus === st.id
                    ? `${st.style} ring-2 ring-goldAccent/40 font-bold shadow-xs`
                    : 'border-gray-200 bg-white text-textSecondary hover:bg-gray-50'
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>
        </div>

        {/* Switch Estado Activo */}
        <div className="flex items-center justify-between py-2 border-t border-gray-100 mt-2">
          <div>
            <span className="text-sm font-medium text-textPrimary block">Estado del Invitado</span>
            <span className="text-xs text-textLight">Permitir ingresar al sitio y reservar regalos</span>
          </div>
          <button
            type="button"
            onClick={() => setIsActive(!isActive)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
              isActive ? 'bg-goldAccent' : 'bg-gray-300'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                isActive ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {/* Acciones */}
        <div className="flex gap-3 pt-3">
          <Button type="button" variant="secondary" fullWidth onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" fullWidth disabled={loading || !name.trim() || !phone.trim()}>
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Guardando...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <UserCheck className="w-4 h-4" />
                Guardar cambios
              </span>
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
