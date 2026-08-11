import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Gift } from 'lucide-react';

interface GiftReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  gift: {
    name: string;
    description: string | null;
  } | null;
  onConfirm: () => void;
  loading?: boolean;
  primaryColor?: string | null;
  secondaryColor?: string | null;
}

export const GiftReservationModal = ({
  isOpen,
  onClose,
  gift,
  onConfirm,
  loading = false,
  primaryColor,
  secondaryColor,
}: GiftReservationModalProps) => {
  if (!gift) return null;

  const mainColor = primaryColor || '#C9A962';
  const secColor = secondaryColor || '#D4C4B7';

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <div className="text-center">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border"
          style={{ backgroundColor: `${secColor}30`, borderColor: `${secColor}60` }}
        >
          <Gift className="w-8 h-8" style={{ color: mainColor }} />
        </div>
        <h3 className="text-2xl font-serif font-bold text-textPrimary mb-2">
          Reservar regalo
        </h3>
        <p className="text-lg font-semibold text-textPrimary mb-2">
          {gift.name}
        </p>
        {gift.description && (
          <p className="text-sm text-textSecondary mb-6">
            {gift.description}
          </p>
        )}
        <p className="text-textSecondary mb-6">
          ¿Estás seguro de que deseas reservar este regalo? Esta acción no se puede deshacer.
        </p>
        <div className="flex gap-4">
          <Button variant="outline" onClick={onClose} disabled={loading} className="flex-1">
            Cancelar
          </Button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 py-2 px-4 rounded-lg font-medium text-white shadow-sm hover:opacity-95 active:scale-95 transition-all cursor-pointer"
            style={{ backgroundColor: mainColor }}
          >
            {loading ? 'Reservando...' : 'Confirmar'}
          </button>
        </div>
      </div>
    </Modal>
  );
};
