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
  /** True when the photo was uploaded (stored by the clinic) rather than pasted as a link. */
  hasUploadedPhoto: boolean;
}

export interface TimeSlot {
  id: ID;
  time: string;
  available: boolean;
}

export interface DoctorAvailability {
  date: string;
  slots: TimeSlot[];
  /** True when the doctor doesn't work that day (day off or time off) — as opposed to fully booked. */
  closed?: boolean;
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

/** One working day. Times are 24-hour "HH:MM". The break is optional. */
export interface WorkingDay {
  start: string;
  end: string;
  breakStart?: string;
  breakEnd?: string;
}

/** Index 0 = Sunday … 6 = Saturday. `null` means the doctor doesn't work that day. */
export type WeeklySchedule = (WorkingDay | null)[];

/** A period when the doctor can't be booked (holiday, leave, conference). Days are "YYYY-MM-DD", inclusive. */
export interface TimeOff {
  id: string;
  startDay: string;
  endDay: string;
  reason: string;
}

export interface DoctorSchedule {
  weekly: WeeklySchedule;
  /** True when the doctor uses the clinic's default hours. */
  isDefault: boolean;
  timeOff: TimeOff[];
}

/** Returned after a schedule change: how many already-booked visits now fall outside it. */
export interface ScheduleChangeResult {
  schedule: DoctorSchedule;
  affectedAppointments: number;
}
