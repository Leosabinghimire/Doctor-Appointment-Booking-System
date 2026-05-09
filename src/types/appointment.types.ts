import type { ID } from './common.types';

export type AppointmentStatus =
  | 'upcoming'
  | 'completed'
  | 'cancelled'
  | 'in-progress';

export type AppointmentType = 'video' | 'in-person';

export interface Appointment {
  id: ID;
  doctorId: ID;
  doctorName: string;
  doctorSpecialty: string;
  doctorAvatar: string;
  patientId: ID;
  patientName: string;
  date: string;
  time: string;
  type: AppointmentType;
  status: AppointmentStatus;
  reason: string;
  notes?: string;
  meetingLink?: string;
  fee: number;
}

export interface BookingPayload {
  doctorId: ID;
  date: string;
  slotId: ID;
  time: string;
  type: AppointmentType;
  reason: string;
  patientName: string;
  patientPhone: string;
  patientEmail: string;
}
