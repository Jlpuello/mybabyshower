import { memo } from 'react';
import { Gift } from 'lucide-react';

interface GiftCardProps {
  gift: {
    publicId: string;
    name: string;
    description: string | null;
    imageUrl: string | null;
    category: string | null;
    isReserved: boolean;
    isReservedByMe?: boolean;
  };
  onReserve: (giftId: string) => void;
  primaryColor?: string | null;
  secondaryColor?: string | null;
}

export const GiftCard = memo(({ gift, onReserve, primaryColor, secondaryColor }: GiftCardProps) => {
  const mainColor = primaryColor || '#C9A962';
  const secColor = secondaryColor || '#D4C4B7';

  return (
    <div
      className="bg-white rounded-xl shadow-soft overflow-hidden hover:shadow-md transition-shadow border"
      style={{ borderColor: `${secColor}50` }}
    >
      {gift.imageUrl ? (
        <img
          src={gift.imageUrl}
          alt={gift.name}
          className="w-full h-48 object-cover"
          loading="lazy"
        />
      ) : (
        <div
          className="w-full h-48 flex items-center justify-center"
          style={{ backgroundColor: `${secColor}25` }}
        >
          <Gift className="w-16 h-16" style={{ color: mainColor }} />
        </div>
      )}
      <div className="p-4">
        {gift.category && (
          <span
            className="text-xs font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full inline-block mb-1"
            style={{ backgroundColor: `${secColor}30`, color: mainColor }}
          >
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
        <button
          type="button"
          onClick={() => onReserve(gift.publicId)}
          disabled={gift.isReserved}
          className={`w-full mt-4 py-2.5 px-4 rounded-lg font-medium transition-all text-sm cursor-pointer ${
            gift.isReserved
              ? 'bg-gray-100 text-textLight border border-gray-200 cursor-not-allowed'
              : 'text-white shadow-sm hover:opacity-95 active:scale-95'
          }`}
          style={{
            backgroundColor: gift.isReserved ? undefined : mainColor,
          }}
        >
          {gift.isReservedByMe ? 'Reservado por ti' : gift.isReserved ? 'Reservado' : 'Reservar regalo'}
        </button>
      </div>
    </div>
  );
});
