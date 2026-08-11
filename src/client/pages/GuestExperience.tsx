import { useState } from 'react';
import { InvitationForm } from '../components/guest/InvitationForm';
import { RSVPForm } from '../components/guest/RSVPForm';
import { GiftList } from '../components/guest/GiftList';
import { GiftReservationModal } from '../components/guest/GiftReservationModal';
import { Button } from '../components/ui/Button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const GuestExperience = () => {
  const navigate = useNavigate();
  const [guestData, setGuestData] = useState<any>(null);
  const [selectedGift, setSelectedGift] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleInvitationSuccess = (data: any) => {
    setGuestData(data);
  };

  const handleReserveGift = (giftId: string) => {
    const gift = guestData?.event?.gifts?.find((g: any) => g.publicId === giftId);
    if (gift) {
      setSelectedGift(gift);
      setIsModalOpen(true);
    }
  };

  const handleConfirmReservation = async () => {
    setLoading(true);
    try {
      // TODO: Implementar API call para reservar regalo
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsModalOpen(false);
      setSelectedGift(null);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
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
          <h1 className="text-3xl font-serif font-bold text-textPrimary mb-2">
            ¡Hola, {guestData.name}!
          </h1>
          <p className="text-textSecondary">
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
          />
        </div>

        {guestData.reservedGift && (
          <div className="bg-white p-6 rounded-lg shadow-soft mb-8">
            <h3 className="text-lg font-serif font-semibold text-textPrimary mb-2">
              Tu regalo reservado
            </h3>
            <p className="text-textPrimary">{guestData.reservedGift.name}</p>
            {guestData.reservedGift.description && (
              <p className="text-sm text-textSecondary mt-1">
                {guestData.reservedGift.description}
              </p>
            )}
          </div>
        )}

        <div>
          <h2 className="text-2xl font-serif font-bold text-textPrimary mb-6">
            Lista de regalos
          </h2>
          {/* TODO: Fetch gifts from API */}
          <GiftList gifts={[]} onReserve={handleReserveGift} />
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
      />
    </div>
  );
};

export default GuestExperience;
