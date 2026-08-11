import { useState } from 'react';
import { Gift, GiftIcon, Plus, Trash2, Users, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '../ui/Button';
import { CreateGiftModal, type GiftRow } from './CreateGiftModal';
import { AnimatePresence, motion } from 'framer-motion';

export type { GiftRow };

const CATEGORY_LABEL: Record<string, string> = {
  ropa: '👕 Ropa',
  accesorios: '🎀 Accesorios',
  juguetes: '🧸 Juguetes',
  'habitación': '🛏 Habitación',
  otros: '📦 Otros',
};

const ATTENDANCE_BADGE: Record<string, string> = {
  CONFIRMED: 'bg-green-100 text-green-700',
  DECLINED: 'bg-red-100 text-red-700',
  PENDING: 'bg-amber-100 text-amber-700',
};
const ATTENDANCE_LABEL: Record<string, string> = {
  CONFIRMED: 'Confirmado',
  DECLINED: 'Declinado',
  PENDING: 'Pendiente',
};

interface GiftsTableProps {
  gifts: GiftRow[];
  onGiftCreated: (gift: GiftRow) => void;
  onGiftDeleted: (publicId: string) => void;
}

// ── Sub-componente: fila expandida con los invitados ──────────────────
const ReservedByRow = ({ reservations }: { reservations: GiftRow['reservations'] }) => (
  <motion.tr
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.15 }}
  >
    <td colSpan={7} className="bg-ivory px-6 py-4">
      {reservations.length === 0 ? (
        <p className="text-sm text-textLight italic">Nadie ha reservado este regalo aún.</p>
      ) : (
        <div className="space-y-2">
          <p className="text-xs font-semibold text-textSecondary uppercase tracking-wider mb-3">
            Personas que eligieron este regalo
          </p>
          <div className="flex flex-wrap gap-2">
            {reservations.map((r) => (
              <div
                key={r.guest.publicId}
                className="flex items-center gap-2 bg-white border border-warmBeige rounded-lg px-3 py-2 shadow-sm"
              >
                <div className="w-7 h-7 rounded-full bg-goldAccent/20 flex items-center justify-center text-sm font-bold text-textPrimary">
                  {r.guest.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-medium text-textPrimary leading-none">{r.guest.name}</p>
                  <p className="text-xs text-textLight mt-0.5">{r.guest.phone}</p>
                </div>
                <span
                  className={`ml-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
                    ATTENDANCE_BADGE[r.guest.attendanceStatus] ?? 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {ATTENDANCE_LABEL[r.guest.attendanceStatus] ?? r.guest.attendanceStatus}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </td>
  </motion.tr>
);

// ── Componente principal ───────────────────────────────────────────────
export const GiftsTable = ({ gifts, onGiftCreated, onGiftDeleted }: GiftsTableProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const toggleExpand = (id: string) =>
    setExpandedId((prev) => (prev === id ? null : id));

  const handleDelete = async (gift: GiftRow) => {
    if (!confirm(`¿Eliminar "${gift.name}"? Esta acción no se puede deshacer.`)) return;
    setDeletingId(gift.publicId);
    try {
      const token = localStorage.getItem('authToken');
      const res = await fetch(`/api/admin/gifts/${gift.publicId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Error al eliminar');
      onGiftDeleted(gift.publicId);
    } catch (err) {
      console.error(err);
      alert('No se pudo eliminar el regalo.');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-soft overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-serif font-semibold text-textPrimary">Mesa de regalos</h2>
            <p className="text-sm text-textSecondary mt-0.5">
              {gifts.length} {gifts.length === 1 ? 'regalo registrado' : 'regalos registrados'} ·{' '}
              {gifts.filter((g) => g.isFull).length} completamente reservados
            </p>
          </div>
          <Button id="btn-add-gift" variant="primary" size="sm" onClick={() => setIsModalOpen(true)}>
            <Plus className="w-4 h-4 mr-1.5" />
            Agregar regalo
          </Button>
        </div>

        {/* Tabla */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-ivory">
              <tr>
                {['', 'Regalo', 'Categoría', 'Disponibilidad', 'Reservas', 'Estado', 'Acciones'].map((col) => (
                  <th
                    key={col}
                    className="px-4 py-3 text-left text-xs font-semibold text-textSecondary uppercase tracking-wider first:pl-6 last:pr-6"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <AnimatePresence initial={false}>
                {gifts.map((gift) => {
                  const isExpanded = expandedId === gift.publicId;
                  const pct = gift.maxReservations > 0
                    ? Math.round((gift.reservationCount / gift.maxReservations) * 100)
                    : 0;

                  return (
                    <>
                      <motion.tr
                        key={gift.publicId}
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.18 }}
                        className={`hover:bg-gray-50/70 transition-colors ${isExpanded ? 'bg-ivory/50' : ''}`}
                      >
                        {/* Thumbnail */}
                        <td className="pl-6 py-3 w-14">
                          {gift.imageUrl ? (
                            <img
                              src={gift.imageUrl}
                              alt={gift.name}
                              className="w-11 h-11 rounded-lg object-cover border border-warmBeige"
                            />
                          ) : (
                            <div className="w-11 h-11 rounded-lg bg-cream flex items-center justify-center border border-warmBeige">
                              <GiftIcon className="w-5 h-5 text-textLight" />
                            </div>
                          )}
                        </td>

                        {/* Nombre */}
                        <td className="px-4 py-3">
                          <p className="text-sm font-medium text-textPrimary">{gift.name}</p>
                          {gift.description && (
                            <p className="text-xs text-textLight line-clamp-1 mt-0.5 max-w-xs">
                              {gift.description}
                            </p>
                          )}
                        </td>

                        {/* Categoría */}
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-textSecondary">
                          {gift.category
                            ? CATEGORY_LABEL[gift.category] ?? gift.category
                            : <span className="text-textLight">—</span>}
                        </td>

                        {/* Barra de disponibilidad */}
                        <td className="px-4 py-3 min-w-[130px]">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-1.5 rounded-full bg-gray-200 overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all ${
                                  gift.isFull ? 'bg-red-400' : pct > 60 ? 'bg-amber-400' : 'bg-green-400'
                                }`}
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                            <span className="text-xs text-textSecondary whitespace-nowrap">
                              {gift.reservationCount}/{gift.maxReservations}
                            </span>
                          </div>
                        </td>

                        {/* Quién lo eligió */}
                        <td className="px-4 py-3">
                          <button
                            onClick={() => toggleExpand(gift.publicId)}
                            className="flex items-center gap-1.5 text-sm text-textSecondary hover:text-textPrimary transition-colors group"
                            title="Ver personas"
                          >
                            <Users className="w-4 h-4" />
                            <span className="font-medium">{gift.reservationCount}</span>
                            {isExpanded
                              ? <ChevronUp className="w-3.5 h-3.5" />
                              : <ChevronDown className="w-3.5 h-3.5" />}
                          </button>
                        </td>

                        {/* Estado */}
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span
                            className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                              gift.isFull
                                ? 'bg-red-100 text-red-700'
                                : gift.reservationCount > 0
                                ? 'bg-amber-100 text-amber-700'
                                : 'bg-green-100 text-green-700'
                            }`}
                          >
                            {gift.isFull
                              ? 'Completo'
                              : gift.reservationCount > 0
                              ? 'Parcial'
                              : 'Disponible'}
                          </span>
                        </td>

                        {/* Acciones */}
                        <td className="pr-6 px-4 py-3 whitespace-nowrap">
                          <button
                            onClick={() => handleDelete(gift)}
                            disabled={deletingId === gift.publicId}
                            className="p-1.5 rounded-lg text-textLight hover:text-red-500 hover:bg-red-50 transition-colors disabled:opacity-40"
                            title="Eliminar regalo"
                          >
                            {deletingId === gift.publicId ? (
                              <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                              </svg>
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </button>
                        </td>
                      </motion.tr>

                      {/* Fila expandible con reservantes */}
                      <AnimatePresence>
                        {isExpanded && (
                          <ReservedByRow
                            key={`${gift.publicId}-reservations`}
                            reservations={gift.reservations}
                          />
                        )}
                      </AnimatePresence>
                    </>
                  );
                })}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Estado vacío */}
        {gifts.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <div className="w-14 h-14 rounded-full bg-ivory flex items-center justify-center mb-4">
              <Gift className="w-7 h-7 text-goldAccent" />
            </div>
            <p className="text-textSecondary font-medium">No hay regalos en la mesa</p>
            <p className="text-sm text-textLight mt-1 mb-5">
              Agrega regalos para que los invitados puedan reservarlos.
            </p>
            <Button variant="outline" size="sm" onClick={() => setIsModalOpen(true)}>
              <Plus className="w-4 h-4 mr-1.5" />
              Agregar el primero
            </Button>
          </div>
        )}
      </div>

      <CreateGiftModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={(gift) => {
          onGiftCreated(gift);
          setIsModalOpen(false);
        }}
      />
    </>
  );
};
