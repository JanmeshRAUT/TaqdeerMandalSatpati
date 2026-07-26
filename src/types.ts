export type Language = 'mr' | 'en';

export interface CommitteeMember {
  id: string;
  nameMr: string;
  nameEn: string;
  roleMr: string;
  roleEn: string;
  photoUrl: string;
  phone?: string;
  bioMr?: string;
  bioEn?: string;
  order: number;
  termYear: string; // e.g. "2026-2027"
}

export interface DirectoryMember {
  id: string;
  nameMr: string;
  nameEn: string;
  joinedYear: number;
  bloodGroup?: string;
  phone?: string;
  locationMr?: string;
  locationEn?: string;
  photoUrl?: string;
  isLifetimeMember?: boolean;
}

export interface GalleryItem {
  id: string;
  titleMr: string;
  titleEn: string;
  category: 'idol' | 'decoration' | 'aarti' | 'cultural' | 'social' | 'visarjan' | 'memories' | 'instagram';
  imageUrl: string;
  year: number;
  descriptionMr?: string;
  descriptionEn?: string;
}

export interface EventScheduleItem {
  id: string;
  titleMr: string;
  titleEn: string;
  date: string;
  timeMr: string;
  timeEn: string;
  categoryMr: string;
  categoryEn: string;
  locationMr: string;
  locationEn: string;
  descriptionMr?: string;
  descriptionEn?: string;
  isImportant?: boolean;
}

export interface HistoryMilestone {
  id: string;
  year: string;
  titleMr: string;
  titleEn: string;
  descriptionMr: string;
  descriptionEn: string;
  imageUrl?: string;
}

export interface SocialActivity {
  id: string;
  titleMr: string;
  titleEn: string;
  descriptionMr: string;
  descriptionEn: string;
  dateMr: string;
  dateEn: string;
  impactStatMr: string;
  impactStatEn: string;
  imageUrl: string;
}

export interface Sponsor {
  id: string;
  nameMr: string;
  nameEn: string;
  amountOrTypeMr: string;
  amountOrTypeEn: string;
  year: number;
  logoUrl?: string;
}

export interface Announcement {
  id: string;
  textMr: string;
  textEn: string;
  linkSection?: string;
  isActive: boolean;
  date: string;
}

export interface JerseyBooking {
  id: string;
  name: string;
  size: number;
  sleeveType: string;
  bookingDate: string;
}

export type NavTab = 
  | 'home' 
  | 'history' 
  | 'committee' 
  | 'members' 
  | 'gallery' 
  | 'events' 
  | 'social' 
  | 'contact' 
  | 'admin';
