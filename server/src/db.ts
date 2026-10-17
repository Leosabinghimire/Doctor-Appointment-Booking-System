import {
  mockAdminStats,
  mockAppointments,
  mockAvailability,
  mockCallLogs,
  mockDoctors,
  mockMedicalHistory,
  mockNotifications,
  mockPatient,
  mockPrescriptions,
} from '../../src/data/mock';
import type {
  AppNotification,
  Appointment,
  CallLog,
  DoctorAvailability,
  MedicalRecord,
  Patient,
  Prescription,
} from '../../src/types';

/** Anything that belongs to one patient. Used to scope what each user can see. */
export interface Owned {
  patientId?: string;
}

// The seeded history and notifications have no owner field in the frontend types; they belong to the demo patient.
type OwnedRecord<T> = T & { patientId: string };

/**
 * In-memory store seeded from the frontend's mock data so both sides agree.
 * Swap this module for a real database — routes only talk to `db`.
 * Everything resets when the server restarts.
 */
export const db = {
  doctors: mockDoctors,
  patients: [mockPatient] as Patient[],
  medicalHistory: mockMedicalHistory.map((r) => ({ ...r, patientId: mockPatient.id })) as OwnedRecord<MedicalRecord>[],
  prescriptions: [...mockPrescriptions] as Prescription[],
  adminStats: mockAdminStats,
  appointments: [...mockAppointments] as Appointment[],
  notifications: mockNotifications.map((n) => ({ ...n, patientId: mockPatient.id })) as OwnedRecord<AppNotification>[],
  // Demo calls are shown until the first successful Telentir sync replaces them.
  callLogs: [...mockCallLogs] as CallLog[],
  // Generated once so booked slots stay booked for the life of the process.
  availability: new Map<string, DoctorAvailability[]>(
    mockDoctors.map((d) => [d.id, mockAvailability(d.id)])
  ),
};

export const newId = (prefix: string) =>
  `${prefix}${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;

const digits = (s: string) => s.replace(/\D/g, '');

/** Compare phone numbers by their last 10 digits, ignoring formatting. */
export const samePhone = (a: string, b: string) => {
  const x = digits(a).slice(-10);
  return x.length > 0 && x === digits(b).slice(-10);
};

/** "+1 (555) 234-7890" → "+15552347890" */
export const toE164 = (phone: string) => `+${digits(phone)}`;
