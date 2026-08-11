export interface Memory {
  id: string;
  publicId: string;
  eventId: string;
  title: string;
  description: string | null;
  mediaUrl: string;
  mediaType: 'IMAGE' | 'VIDEO';
  eventDate: Date | null;
  sortOrder: number;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface MemoryPublic {
  publicId: string;
  title: string;
  description: string | null;
  mediaUrl: string;
  mediaType: 'IMAGE' | 'VIDEO';
  eventDate: Date | null;
  sortOrder: number;
}
