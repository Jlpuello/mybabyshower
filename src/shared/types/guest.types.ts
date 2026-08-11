export interface Guest {
  id: string;
  publicId: string;
  eventId: string;
  name: string;
  phone: string;
  email: string | null;
  invitationCode: string;
  attendanceStatus: 'PENDING' | 'CONFIRMED' | 'DECLINED';
  attendanceUpdatedAt: Date | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface GuestPublic {
  publicId: string;
  name: string;
  attendanceStatus: 'PENDING' | 'CONFIRMED' | 'DECLINED';
}

export interface GuestWithReservation extends GuestPublic {
  reservedGift?: {
    name: string;
    description: string | null;
  };
}
