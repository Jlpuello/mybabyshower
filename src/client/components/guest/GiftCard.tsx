import { memo } from 'react';
import { Button } from '../ui/Button';
import { Gift } from 'lucide-react';

interface GiftCardProps {
  gift: {
    publicId: string;
    name: string;
    description: string | null;
    imageUrl: string | null;
    category: string | null;
    isReserved: boolean;
  };
  onReserve: (giftId: string) => void;
}

export const GiftCard = memo(({ gift, onReserve }: GiftCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-soft overflow-hidden hover:shadow-md transition-shadow">
      {gift.imageUrl ? (
        <img
          src={gift.imageUrl}
          alt={gift.name}
          className="w-full h-48 object-cover"
          loading="lazy"
        />
      ) : (
        <div className="w-full h-48 bg-cream flex items-center justify-center">
          <Gift className="w-16 h-16 text-textLight" />
        </div>
      )}
      <div className="p-4">
        {gift.category && (
          <span className="text-xs text-textLight uppercase tracking-wide">
            {gift.category}
          </span>
        )}
        <h3 className="text-lg font-serif font-semibold text-textPrimary mt-1">
          {gift.name}
        </h3>
        {gift.description && (
          <p className="text-sm text-textSecondary mt-2 line-clamp-2">
            {gift.description}
          </p>
        )}
        <Button
          variant={gift.isReserved ? 'outline' : 'primary'}
          onClick={() => onReserve(gift.publicId)}
          disabled={gift.isReserved}
          fullWidth
          className="mt-4"
        >
          {gift.isReserved ? 'Reservado' : 'Reservar regalo'}
        </Button>
      </div>
    </div>
  );
});
