import { useState } from 'react';
import { UserPlus, Copy, Check, Ticket, Pencil } from 'lucide-react';
import { Button } from '../ui/Button';
import { CreateGuestModal } from './CreateGuestModal';
import { EditGuestModal } from './EditGuestModal';
import { AnimatePresence, motion } from 'framer-motion';

export interface GuestRow {
  publicId: string;
  name: string;
  phone: string;
  email: string | null;
  invitationCode: string;
  attendanceStatus: 'PENDING' | 'CONFIRMED' | 'DECLINED';
  isActive: boolean;
  createdAt: string;
  reservations?: Array<{ gift: { name: string } }>;
}

interface GuestsTableProps {
  guests: GuestRow[];
  onGuestCreated: (guest: GuestRow) => void;
  onGuestUpdated?: (updatedGuest: GuestRow) => void;
}

const STATUS_LABEL: Record<GuestRow['attendanceStatus'], string> = {
  PENDING: 'Pendiente',
  CONFIRMED: 'Confirmado',
  DECLINED: 'Declinado',
};

const STATUS_STYLE: Record<GuestRow['attendanceStatus'], string> = {
  PENDING: 'bg-amber-100 text-amber-800',
  CONFIRMED: 'bg-green-100 text-green-800',
  DECLINED: 'bg-red-100 text-red-800',
};

const CopyCode = ({ code }: { code: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <button
      onClick={handleCopy}
      title="Copiar código"
      className="group flex items-center gap-1.5 font-mono text-sm text-textPrimary hover:text-goldAccent transition-colors cursor-pointer"
    >
      <span>{code}</span>
      <span className="opacity-0 group-hover:opacity-100 transition-opacity">
        {copied ? (
          <Check className="w-3.5 h-3.5 text-green-500" />
        ) : (
          <Copy className="w-3.5 h-3.5" />
        )}
      </span>
    </button>
  );
};

export const GuestsTable = ({ guests, onGuestCreated, onGuestUpdated }: GuestsTableProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGuest, setEditingGuest] = useState<GuestRow | null>(null);

  return (
    <>
      <div className="bg-white rounded-xl shadow-soft overflow-hidden">
        {/* ── Header con botón ── */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-serif font-semibold text-textPrimary">Invitados</h2>
            <p className="text-sm text-textSecondary mt-0.5">
              {guests.length} {guests.length === 1 ? 'invitado registrado' : 'invitados registrados'}
            </p>
          </div>
          <Button
            id="btn-add-guest"
            variant="primary"
            size="sm"
            onClick={() => setIsModalOpen(true)}
          >
            <UserPlus className="w-4 h-4 mr-1.5" />
            Agregar invitado
          </Button>
        </div>

        {/* ── Tabla ── */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-ivory">
              <tr>
                {['Nombre', 'Código', 'Teléfono', 'Email', 'Asistencia', 'Regalo Elegido', 'Acciones'].map((col) => (
                  <th
                    key={col}
                    className="px-6 py-3 text-left text-xs font-semibold text-textSecondary uppercase tracking-wider"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <AnimatePresence initial={false}>
                {guests.map((guest) => {
                  const hasGift = guest.reservations && guest.reservations.length > 0;
                  const giftName = hasGift ? guest.reservations![0].gift.name : null;

                  return (
                    <motion.tr
                      key={guest.publicId}
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="hover:bg-gray-50/70 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-textPrimary">{guest.name}</span>
                          {!guest.isActive && (
                            <span className="text-xs text-red-400 mt-0.5">Desactivado</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <CopyCode code={guest.invitationCode} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-textSecondary">
                        {guest.phone}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-textSecondary">
                        {guest.email || <span className="text-textLight">—</span>}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_STYLE[guest.attendanceStatus]}`}
                        >
                          {STATUS_LABEL[guest.attendanceStatus]}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {hasGift ? (
                          <span
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-pink-50 text-pink-700 border border-pink-200"
                            title={`Regalo reservado: ${giftName}`}
                          >
                            <span>🎁</span>
                            <span className="truncate max-w-[140px]">{giftName}</span>
                          </span>
                        ) : (
                          <span className="text-xs text-textLight italic">Sin regalo</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => setEditingGuest(guest)}
                          className="text-textSecondary hover:text-goldAccent transition-colors rounded-lg p-1.5 hover:bg-warmBeige/50 cursor-pointer"
                          title="Editar invitado"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* ── Estado vacío ── */}
        {guests.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <div className="w-14 h-14 rounded-full bg-ivory flex items-center justify-center mb-4">
              <Ticket className="w-7 h-7 text-goldAccent" />
            </div>
            <p className="text-textSecondary font-medium">No hay invitados registrados</p>
            <p className="text-sm text-textLight mt-1 mb-5">
              Agrega el primer invitado para empezar.
            </p>
            <Button variant="outline" size="sm" onClick={() => setIsModalOpen(true)}>
              <UserPlus className="w-4 h-4 mr-1.5" />
              Agregar el primero
            </Button>
          </div>
        )}
      </div>

      <CreateGuestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={(guest) => {
          onGuestCreated(guest);
          setIsModalOpen(false);
        }}
      />

      <EditGuestModal
        guest={editingGuest}
        isOpen={!!editingGuest}
        onClose={() => setEditingGuest(null)}
        onSuccess={(updatedGuest) => {
          if (onGuestUpdated) {
            onGuestUpdated(updatedGuest);
          }
          setEditingGuest(null);
        }}
      />
    </>
  );
};
