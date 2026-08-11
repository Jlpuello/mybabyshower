import { useState } from 'react';
import { Check, X } from 'lucide-react';

interface RSVPFormProps {
  guestId: string;
  currentStatus: 'PENDING' | 'CONFIRMED' | 'DECLINED';
  onSuccess: (newStatus: 'CONFIRMED' | 'DECLINED') => void;
  primaryColor?: string | null;
  secondaryColor?: string | null;
}

export const RSVPForm = ({ guestId, currentStatus, onSuccess, primaryColor, secondaryColor }: RSVPFormProps) => {
  const [loading, setLoading] = useState(false);
  const mainColor = primaryColor || '#C9A962';
  const secColor = secondaryColor || '#D4C4B7';

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
    <div
      className="bg-white p-6 rounded-xl shadow-soft border"
      style={{ borderColor: `${secColor}60` }}
    >
      <h3 className="text-xl font-serif font-bold text-textPrimary mb-4">
        ¿Asistirás al evento?
      </h3>
      <div className="flex gap-4">
        <button
          type="button"
          onClick={() => handleRSVP('CONFIRMED')}
          disabled={loading}
          className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all flex items-center justify-center gap-2 cursor-pointer ${
            currentStatus === 'CONFIRMED'
              ? 'text-white shadow-md'
              : 'bg-white border text-textPrimary hover:bg-gray-50'
          }`}
          style={{
            backgroundColor: currentStatus === 'CONFIRMED' ? mainColor : undefined,
            borderColor: currentStatus === 'CONFIRMED' ? mainColor : `${secColor}80`,
          }}
        >
          <Check className="w-5 h-5" />
          <span>Sí, asistiré</span>
        </button>
        <button
          type="button"
          onClick={() => handleRSVP('DECLINED')}
          disabled={loading}
          className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all flex items-center justify-center gap-2 cursor-pointer ${
            currentStatus === 'DECLINED'
              ? 'bg-red-600 text-white shadow-md border-red-600'
              : 'bg-white border text-textPrimary hover:bg-gray-50'
          }`}
          style={{
            borderColor: currentStatus === 'DECLINED' ? '#DC2626' : `${secColor}80`,
          }}
        >
          <X className="w-5 h-5" />
          <span>No podré</span>
        </button>
      </div>
      {currentStatus !== 'PENDING' && (
        <p className="text-sm text-textSecondary mt-4 text-center">
          Tu respuesta ha sido registrada
        </p>
      )}
    </div>
  );
};
