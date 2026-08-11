export interface Event {
  id: string;
  publicId: string;
  title: string;
  babyName: string | null;
  description: string | null;
  eventDate: Date;
  eventTime: string;
  location: string;
  address: string;
  latitude: number | null;
  longitude: number | null;
  heroImage: string | null;
  locationImage: string | null;
  storyTitle: string | null;
  storyContent: string | null;
  revelationTitle: string | null;
  revelationContent: string | null;
  revelationMediaUrl: string | null;
  revelationMediaType: string | null;
  isRevealed: boolean;
  primaryColor: string | null;
  secondaryColor: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  ogImage: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface EventPublic {
  publicId: string;
  title: string;
  babyName: string | null;
  description: string | null;
  eventDate: Date;
  eventTime: string;
  location: string;
  address: string;
  latitude: number | null;
  longitude: number | null;
  heroImage: string | null;
  locationImage: string | null;
  storyTitle: string | null;
  storyContent: string | null;
  revelationTitle: string | null;
  revelationContent: string | null;
  revelationMediaUrl: string | null;
  revelationMediaType: string | null;
  isRevealed: boolean;
  primaryColor: string | null;
  secondaryColor: string | null;
}
