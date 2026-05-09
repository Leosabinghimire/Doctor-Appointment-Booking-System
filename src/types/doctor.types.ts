import type { ID } from './common.types';

export type DoctorSpecialty =
  | 'Cardiology'
  | 'Dermatology'
  | 'Neurology'
  | 'Pediatrics'
  | 'Orthopedics'
  | 'Psychiatry'
  | 'General Physician'
  | 'Gynecology'
  | 'Dentistry'
  | 'Ophthalmology';

export interface Doctor {
  id: ID;
  name: string;
  specialty: DoctorSpecialty;
  qualifications: string;
  experience: number;
  rating: number;
  reviewCount: number;
  consultationFee: number;
  hospital: string;
  city: string;
  avatar: string;
  about: string;
  languages: string[];
  availableToday: boolean;
  videoConsult: boolean;
  inPersonConsult: boolean;
  nextSlot: string;
}

export interface TimeSlot {
  id: ID;
  time: string;
  available: boolean;
}

export interface DoctorAvailability {
  date: string;
  slots: TimeSlot[];
}

export interface DoctorFilters {
  search?: string;
  specialty?: DoctorSpecialty | 'All';
  city?: string;
  availableToday?: boolean;
  videoOnly?: boolean;
  minRating?: number;
  maxFee?: number;
  sortBy?: 'rating' | 'experience' | 'fee';
}
