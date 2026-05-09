import type { DoctorSpecialty } from '@/types';

export const SPECIALTIES: readonly DoctorSpecialty[] = [
  'Cardiology',
  'Dermatology',
  'Neurology',
  'Pediatrics',
  'Orthopedics',
  'Psychiatry',
  'General Physician',
  'Gynecology',
  'Dentistry',
  'Ophthalmology',
] as const;
