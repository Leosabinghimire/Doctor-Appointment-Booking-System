import type { ID } from './common.types';

export type PrescriptionStatus = 'active' | 'expired' | 'completed';

export interface Medication {
  id: ID;
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
}

export interface Prescription {
  id: ID;
  patientId: ID;
  doctorId: ID;
  doctorName: string;
  doctorSpecialty: string;
  date: string;
  diagnosis: string;
  medications: Medication[];
  refillable: boolean;
  refillsRemaining: number;
  status: PrescriptionStatus;
  notes?: string;
}
