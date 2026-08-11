import { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { UserPlus, Phone, Mail, User, Ticket } from 'lucide-react';
import { motion } from 'framer-motion';

interface CreateGuestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (guest: {
    publicId: string;
    name: string;
    phone: string;
    email: string | null;
    invitationCode: string;
    attendanceStatus: 'PENDING' | 'CONFIRMED' | 'DECLINED';
    isActive: boolean;
    createdAt: string;
  }) => void;
}

interface FormErrors {
  name?: string;
  phone?: string;
  email?: string;
  general?: string;
}

export const CreateGuestModal = ({ isOpen, onClose, onSuccess }: CreateGuestModalProps) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [createdGuest, setCreatedGuest] = useState<{
    name: string;
    invitationCode: string;
  } | null>(null);

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
    if (!validate()) return;

    setLoading(true);
    setErrors({});

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/admin/guests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          email: email.trim() || undefined,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Error al crear el invitado');
      }

      const guest = await response.json();
      setCreatedGuest({ name: guest.name, invitationCode: guest.invitationCode });
      onSuccess(guest);
    } catch (err) {
      setErrors({
        general: err instanceof Error ? err.message : 'Ocurrió un error inesperado',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setName('');
    setPhone('');
    setEmail('');
    setErrors({});
    setCreatedGuest(null);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Agregar invitado" size="md">
      {createdGuest ? (
        /* ── Estado de éxito ── */
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center text-center gap-5 py-4"
        >
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
            <Ticket className="w-8 h-8 text-green-600" />
          </div>
          <div>
            <p className="text-textSecondary text-sm mb-1">¡Invitado creado exitosamente!</p>
            <h3 className="text-xl font-serif font-bold text-textPrimary">{createdGuest.name}</h3>
          </div>

          {/* Código generado destacado */}
          <div className="w-full bg-ivory border-2 border-dashed border-goldAccent rounded-xl p-5">
            <p className="text-xs font-semibold text-textSecondary uppercase tracking-widest mb-2">
              Código de invitación
            </p>
            <p className="text-3xl font-mono font-bold text-textPrimary tracking-widest">
              {createdGuest.invitationCode}
            </p>
            <p className="text-xs text-textLight mt-2">
              Comparte este código con {createdGuest.name.split(' ')[0]}
            </p>
          </div>

          <div className="flex gap-3 w-full">
            <Button
              variant="secondary"
              fullWidth
              onClick={() => {
                navigator.clipboard.writeText(createdGuest.invitationCode);
              }}
            >
              Copiar código
            </Button>
            <Button variant="primary" fullWidth onClick={handleClose}>
              Aceptar
            </Button>
          </div>
        </motion.div>
      ) : (
        /* ── Formulario ── */
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

          {/* Nombre */}
          <div className="relative">
            <div className="absolute left-3 top-9 text-textLight pointer-events-none">
              <User className="w-4 h-4" />
            </div>
            <Input
              id="guest-name"
              label="Nombre completo *"
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
              }}
              placeholder="María García"
              error={errors.name}
              disabled={loading}
              autoFocus
              className="pl-9"
            />
          </div>

          {/* Teléfono */}
          <div className="relative">
            <div className="absolute left-3 top-9 text-textLight pointer-events-none">
              <Phone className="w-4 h-4" />
            </div>
            <Input
              id="guest-phone"
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

          {/* Email (opcional) */}
          <div className="relative">
            <div className="absolute left-3 top-9 text-textLight pointer-events-none">
              <Mail className="w-4 h-4" />
            </div>
            <Input
              id="guest-email"
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

          {/* Nota sobre código */}
          <p className="text-xs text-textLight bg-ivory rounded-lg px-3 py-2 flex items-center gap-2">
            <Ticket className="w-3.5 h-3.5 flex-shrink-0 text-goldAccent" />
            El código de invitación (formato <strong>BS-XXXX</strong>) se generará automáticamente.
          </p>

          {/* Acciones */}
          <div className="flex gap-3 pt-1">
            <Button
              type="button"
              variant="secondary"
              fullWidth
              onClick={handleClose}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              fullWidth
              disabled={loading || !name.trim() || !phone.trim()}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Creando...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <UserPlus className="w-4 h-4" />
                  Agregar invitado
                </span>
              )}
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
};
