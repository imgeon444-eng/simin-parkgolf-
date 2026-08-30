export interface FacilityItem {
  id: string;
  title: string;
  subtitle: string;
  tag: string;
  description: string;
  features: string[];
  badge?: string;
  iconName: string;
  imageAlt: string;
  accent?: string;
}

export interface ReservationSlot {
  time: string;
  isAvailable: boolean;
}

export interface StepItem {
  number: string;
  title: string;
  subtitle: string;
  description: string;
  highlights: string[];
  icon: string;
}

export type ReservationStatus = 'new' | 'contacting' | 'confirmed' | 'completed' | 'cancelled';

export interface ReservationData {
  id: string;
  facility: string; // 'outdoor' | 'screen' | 'lesson'
  facilityLabel: string;
  date: string;
  timeSlot: string;
  name: string;
  phone: string;
  peopleCount: string;
  memo?: string;
  status: ReservationStatus;
  createdAt: string;
  price?: number;
}

export interface PromoEventItem {
  id: string;
  title: string;
  subtitle: string;
  discountBadge: string;
  benefit: string;
  description: string;
  icon: string;
}

export interface EventPromoConfig {
  isActive: boolean;
  selectedPresetId: string;
  updatedAt?: string;
}
