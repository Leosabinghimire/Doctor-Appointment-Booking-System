import type { ID } from './common.types';

export type UserRole = 'patient' | 'doctor' | 'admin';

export interface AuthUser {
  id: ID;
  email: string;
  name: string;
  role: UserRole;
  /** Set for patients — links the account to their patient record. */
  patientId?: ID;
  avatar?: string;
  phone?: string;
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  phone: string;
  password: string;
}
