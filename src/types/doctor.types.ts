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
  /** Next open slot, e.g. "Today, 10:30 AM". Computed by the backend from the schedule. */
  nextSlot: string;
  /** False when archived by an admin — hidden from patients, kept for past appointments. */
  active?: boolean;
}

/** The fields an admin can edit. Ratings and availability are never typed in by hand. */
export type DoctorInput = Pick<
  Doctor,
  | 'name'
  | 'specialty'
  | 'qualifications'
  | 'experience'
  | 'consultationFee'
  | 'hospital'
  | 'city'
  | 'avatar'
  | 'about'
  | 'languages'
  | 'videoConsult'
  | 'inPersonConsult'
>;

/** Admin list row: the doctor plus how many upcoming visits they have. */
export interface AdminDoctor extends Doctor {
  active: boolean;
  upcomingAppointments: number;
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
