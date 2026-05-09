import type { ID } from './common.types';

export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';

export type Gender = 'male' | 'female' | 'other';

export interface EmergencyContact {
  name: string;
  relation: string;
  phone: string;
}

export interface Patient {
  id: ID;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  age: number;
  gender: Gender;
  bloodGroup: BloodGroup;
  height: number;
  weight: number;
  allergies: string[];
  chronicConditions: string[];
  emergencyContact: EmergencyContact;
}

export interface MedicalRecord {
  id: ID;
  date: string;
  doctorName: string;
  specialty: string;
  diagnosis: string;
  symptoms: string[];
  treatment: string;
  notes?: string;
  attachments?: string[];
}

export interface VitalSign {
  label: string;
  value: string;
  unit: string;
  status: 'normal' | 'warning' | 'critical';
  trend: 'up' | 'down' | 'stable';
  icon: string;
}
