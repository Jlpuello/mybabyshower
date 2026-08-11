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
}

export const GiftReservationModal = ({
  isOpen,
  onClose,
  gift,
  onConfirm,
  loading = false,
}: GiftReservationModalProps) => {
  if (!gift) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <div className="text-center">
        <div className="w-16 h-16 bg-cream rounded-full flex items-center justify-center mx-auto mb-4">
          <Gift className="w-8 h-8 text-goldAccent" />
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
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={onConfirm} disabled={loading}>
            {loading ? 'Reservando...' : 'Confirmar'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
