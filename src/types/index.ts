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
