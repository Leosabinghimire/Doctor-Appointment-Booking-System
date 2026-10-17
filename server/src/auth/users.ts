import type { AuthUser, UserRole } from '../../../src/types';
import { config } from '../config';
import { db } from '../db';
import { hashPassword } from './passwords';

export interface UserRecord {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  patientId?: string;
  passwordHash: string;
}

export const users: UserRecord[] = [];

export const normalizeEmail = (email: string) => email.trim().toLowerCase();

export const findUserByEmail = (email: string) => users.find((u) => u.email === normalizeEmail(email));

export const findUserById = (id: string) => users.find((u) => u.id === id);

/** The public shape sent to the browser — never includes the password hash. */
export const toAuthUser = (user: UserRecord): AuthUser => {
  const patient = user.patientId ? db.patients.find((p) => p.id === user.patientId) : undefined;
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    patientId: user.patientId,
    avatar: patient?.avatar,
    phone: patient?.phone,
  };
};

/**
 * Seeds the admin account (and, outside production, a demo patient).
 * Passwords come from env vars; config.ts refuses to start in production without them.
 */
export const seedUsers = async () => {
  users.push({
    id: 'u-admin',
    email: normalizeEmail(config.auth.adminEmail),
    name: 'Clinic Admin',
    role: 'admin',
    passwordHash: await hashPassword(config.auth.adminPassword),
  });

  if (config.auth.demoPatientPassword) {
    const patient = db.patients[0];
    users.push({
      id: 'u-patient',
      email: normalizeEmail(patient.email),
      name: patient.name,
      role: 'patient',
      patientId: patient.id,
      passwordHash: await hashPassword(config.auth.demoPatientPassword),
    });
  }
};
