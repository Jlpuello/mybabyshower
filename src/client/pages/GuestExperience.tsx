import { useState } from 'react';
import { InvitationForm } from '../components/guest/InvitationForm';
import { RSVPForm } from '../components/guest/RSVPForm';
import { GiftList } from '../components/guest/GiftList';
import { GiftReservationModal } from '../components/guest/GiftReservationModal';
import { Button } from '../components/ui/Button';
import { Toast } from '../components/ui/Toast';
import { ArrowLeft, Gift as GiftIcon, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const GuestExperience = () => {
  const navigate = useNavigate();
  const [guestData, setGuestData] = useState<any>(null);
  const [gifts, setGifts] = useState<any[]>([]);
  const [selectedGift, setSelectedGift] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [canceling, setCanceling] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const handleInvitationSuccess = (data: any) => {
    setGuestData(data);
    if (data?.event?.gifts) {
      setGifts(data.event.gifts);
    }
  };

  const handleReserveGift = (giftId: string) => {
    if (guestData?.reservedGift) {
      setToastMessage({
        message: 'Ya tienes un regalo reservado. Debes cancelar la reserva actual antes de elegir otro.',
        type: 'error',
      });
      return;
    }
    const gift = gifts.find((g: any) => g.publicId === giftId);
    if (gift) {
      setSelectedGift(gift);
      setIsModalOpen(true);
    }
  };

  const handleConfirmReservation = async () => {
    if (!selectedGift || !guestData) return;
    setLoading(true);
    try {
      const response = await fetch(`/api/invitations/${guestData.publicId}/gifts/${selectedGift.publicId}/reserve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al reservar regalo');
      }

      setGuestData({
        ...guestData,
        reservedGift: data.reservedGift,
      });
      setGifts(data.gifts);
      setIsModalOpen(false);
      setSelectedGift(null);
      setToastMessage({
        message: '¡Regalo reservado con éxito! Gracias por tu detalle.',
        type: 'success',
      });
    } catch (error: any) {
      setToastMessage({
        message: error.message || 'Error al procesar la reserva',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancelReservation = async () => {
    if (!guestData) return;
    setCanceling(true);
    try {
      const response = await fetch(`/api/invitations/${guestData.publicId}/gifts/reserve`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al cancelar la reserva');
      }

      setGuestData({
        ...guestData,
        reservedGift: null,
      });
      setGifts(data.gifts);
      setToastMessage({
        message: 'Reserva cancelada correctamente',
        type: 'success',
      });
    } catch (error: any) {
      setToastMessage({
        message: error.message || 'Error al cancelar la reserva',
        type: 'error',
      });
    } finally {
      setCanceling(false);
    }
  };

  if (!guestData) {
    return (
      <div className="min-h-screen bg-offWhite py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al inicio
          </Button>
          <InvitationForm onSuccess={handleInvitationSuccess} />
        </div>
      </div>
    );
  }

  const primaryColor = guestData?.event?.primaryColor || '#C9A962';
  const secondaryColor = guestData?.event?.secondaryColor || '#D4C4B7';

  return (
    <div className="min-h-screen bg-offWhite py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver al inicio
        </Button>

        <div className="mb-8">
          <h1
            className="text-3xl sm:text-4xl font-serif font-bold text-textPrimary mb-2"
            style={{ color: primaryColor }}
          >
            ¡Hola, {guestData.name}!
          </h1>
          <p className="text-textSecondary text-base">
            {guestData.event.title}
          </p>
        </div>

        <div className="mb-8">
          <RSVPForm
            guestId={guestData.publicId}
            currentStatus={guestData.attendanceStatus}
            onSuccess={(status) => {
              setGuestData({ ...guestData, attendanceStatus: status });
            }}
            primaryColor={primaryColor}
            secondaryColor={secondaryColor}
          />
        </div>

        {guestData.reservedGift && (
          <div
            className="bg-white p-6 rounded-xl shadow-soft mb-8 border"
            style={{ borderColor: `${secondaryColor}60` }}
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <GiftIcon className="w-5 h-5" style={{ color: primaryColor }} />
                  <h3 className="text-lg font-serif font-semibold text-textPrimary">
                    Tu regalo reservado
                  </h3>
                </div>
                <p className="text-lg font-medium text-textPrimary">{guestData.reservedGift.name}</p>
                {guestData.reservedGift.description && (
                  <p className="text-sm text-textSecondary mt-1">
                    {guestData.reservedGift.description}
                  </p>
                )}
              </div>
              <Button
                variant="outline"
                onClick={handleCancelReservation}
                disabled={canceling}
                className="text-error border-error/30 hover:bg-error/10 hover:border-error"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                {canceling ? 'Cancelando...' : 'Cancelar reserva'}
              </Button>
            </div>
          </div>
        )}

        <div>
          <h2 className="text-2xl font-serif font-bold text-textPrimary mb-6">
            Lista de regalos
          </h2>
          <GiftList
            gifts={gifts}
            onReserve={handleReserveGift}
            primaryColor={primaryColor}
            secondaryColor={secondaryColor}
          />
        </div>
      </div>

      <GiftReservationModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedGift(null);
        }}
        gift={selectedGift}
        onConfirm={handleConfirmReservation}
        loading={loading}
        primaryColor={primaryColor}
        secondaryColor={secondaryColor}
      />

      {toastMessage && (
        <Toast
          message={toastMessage.message}
          type={toastMessage.type}
          onClose={() => setToastMessage(null)}
        />
      )}
    </div>
  );
};

export default GuestExperience;
