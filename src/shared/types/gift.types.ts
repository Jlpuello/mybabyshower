export interface Gift {
  id: string;
  publicId: string;
  eventId: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  category: string | null;
  isActive: boolean;
  isReserved: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface GiftPublic {
  publicId: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  category: string | null;
  isReserved: boolean;
}

export interface GiftWithReservation extends GiftPublic {
  reservedBy?: {
    name: string;
  };
  reservedAt?: Date;
}
