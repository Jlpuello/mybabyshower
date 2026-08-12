import { useState } from 'react';
import { InvitationForm } from '../components/guest/InvitationForm';
import { RSVPForm } from '../components/guest/RSVPForm';
import { GiftList } from '../components/guest/GiftList';
import { GiftReservationModal } from '../components/guest/GiftReservationModal';
import { Button } from '../components/ui/Button';
import { Toast } from '../components/ui/Toast';
import { ArrowLeft, Gift as GiftIcon, Trash2, CheckCircle2 } from 'lucide-react';
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

        <div
          className="bg-white p-5 sm:p-6 rounded-2xl shadow-soft mb-8 border"
          style={{ borderColor: `${secondaryColor}60` }}
        >
          <h1
            className="text-3xl sm:text-4xl font-serif font-bold text-textPrimary mb-2"
            style={{ color: primaryColor }}
          >
            ¡Hola, {guestData.name}!
          </h1>
          {guestData.event.invitationMessage && (
            <p className="text-textSecondary text-sm sm:text-base leading-relaxed mb-3 font-normal whitespace-pre-line">
              {guestData.event.invitationMessage}
            </p>
          )}
          <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-textLight">
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
            className="bg-white rounded-2xl shadow-md p-5 sm:p-6 mb-8 border transition-all"
            style={{ borderColor: `${secondaryColor}80` }}
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 mb-4 border-b border-gray-100 gap-3">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${primaryColor}20`, color: primaryColor }}
                >
                  <GiftIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-serif font-bold text-textPrimary">
                    Tu regalo reservado
                  </h3>
                  <p className="text-xs text-emerald-600 font-medium flex items-center gap-1 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Confirmado para la ocasión
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                onClick={handleCancelReservation}
                disabled={canceling}
                className="text-error border-error/30 hover:bg-error/10 hover:border-error text-xs sm:text-sm self-end sm:self-auto"
              >
                <Trash2 className="w-4 h-4 mr-1.5" />
                {canceling ? 'Cancelando...' : 'Cambiar / Cancelar reserva'}
              </Button>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-center sm:items-start">
              {guestData.reservedGift.imageUrl ? (
                <img
                  src={guestData.reservedGift.imageUrl}
                  alt={guestData.reservedGift.name}
                  className="w-full sm:w-36 h-36 object-cover rounded-xl border flex-shrink-0 shadow-xs"
                  style={{ borderColor: `${secondaryColor}60` }}
                />
              ) : (
                <div
                  className="w-full sm:w-36 h-36 rounded-xl flex flex-col items-center justify-center flex-shrink-0 border"
                  style={{ backgroundColor: `${secondaryColor}20`, borderColor: `${secondaryColor}50` }}
                >
                  <GiftIcon className="w-10 h-10 mb-1" style={{ color: primaryColor }} />
                  <span className="text-xs text-textSecondary font-medium">Sin fotografía</span>
                </div>
              )}

              <div className="flex-1 text-center sm:text-left w-full">
                {guestData.reservedGift.category && (
                  <span
                    className="text-[11px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full inline-block mb-1.5"
                    style={{ backgroundColor: `${secondaryColor}30`, color: primaryColor }}
                  >
                    {guestData.reservedGift.category}
                  </span>
                )}
                <h4 className="text-xl font-serif font-bold text-textPrimary mb-1">
                  {guestData.reservedGift.name}
                </h4>
                {guestData.reservedGift.description && (
                  <p className="text-sm text-textSecondary leading-relaxed">
                    {guestData.reservedGift.description}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {!guestData.reservedGift && (
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
        )}
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
