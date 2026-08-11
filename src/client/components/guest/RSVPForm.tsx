import { useState } from 'react';
import { Button } from '../ui/Button';
import { Check, X } from 'lucide-react';

interface RSVPFormProps {
  guestId: string;
  currentStatus: 'PENDING' | 'CONFIRMED' | 'DECLINED';
  onSuccess: (newStatus: 'CONFIRMED' | 'DECLINED') => void;
}

export const RSVPForm = ({ guestId, currentStatus, onSuccess }: RSVPFormProps) => {
  const [loading, setLoading] = useState(false);

  const handleRSVP = async (status: 'CONFIRMED' | 'DECLINED') => {
    setLoading(true);

    try {
      const response = await fetch(`/api/invitations/${guestId}/rsvp`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar RSVP');
      }

      onSuccess(status);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-soft">
      <h3 className="text-xl font-serif font-bold text-textPrimary mb-4">
        ¿Asistirás al evento?
      </h3>
      <div className="flex gap-4">
        <Button
          variant={currentStatus === 'CONFIRMED' ? 'primary' : 'outline'}
          onClick={() => handleRSVP('CONFIRMED')}
          disabled={loading}
          className="flex-1"
        >
          <Check className="w-5 h-5 mr-2" />
          Sí, asistiré
        </Button>
        <Button
          variant={currentStatus === 'DECLINED' ? 'primary' : 'outline'}
          onClick={() => handleRSVP('DECLINED')}
          disabled={loading}
          className="flex-1"
        >
          <X className="w-5 h-5 mr-2" />
          No podré
        </Button>
      </div>
      {currentStatus !== 'PENDING' && (
        <p className="text-sm text-textSecondary mt-4 text-center">
          Tu respuesta ha sido registrada
        </p>
      )}
    </div>
  );
};
