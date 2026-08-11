import { GiftCard } from './GiftCard';

interface GiftListProps {
  gifts: Array<{
    publicId: string;
    name: string;
    description: string | null;
    imageUrl: string | null;
    category: string | null;
    isReserved: boolean;
  }>;
  onReserve: (giftId: string) => void;
}

export const GiftList = ({ gifts, onReserve }: GiftListProps) => {
  if (gifts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-textSecondary">No hay regalos disponibles</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {gifts.map((gift) => (
        <GiftCard key={gift.publicId} gift={gift} onReserve={onReserve} />
      ))}
    </div>
  );
};
