import type { UserRole } from '../../../src/types';
import { sql } from '../db/connection';

export interface UserRecord {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  patientId?: string;
  passwordHash: string;
  createdAt: string;
}

interface Row {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  patient_id: string | null;
  password_hash: string;
  created_at: string;
}

const toUser = (r: Row): UserRecord => ({
  id: r.id,
  email: r.email,
  name: r.name,
  role: r.role,
  patientId: r.patient_id ?? undefined,
  passwordHash: r.password_hash,
  createdAt: r.created_at,
});

export const normalizeEmail = (email: string) => email.trim().toLowerCase();

export const usersRepo = {
  findById: (id: string): UserRecord | undefined => {
    const row = sql.prepare('SELECT * FROM users WHERE id = ?').get(id) as Row | undefined;
    return row && toUser(row);
  },

  findByEmail: (email: string): UserRecord | undefined => {
    const row = sql.prepare('SELECT * FROM users WHERE email = ?').get(normalizeEmail(email)) as Row | undefined;
    return row && toUser(row);
  },

  insert: (u: Omit<UserRecord, 'createdAt'>) => {
    sql
      .prepare(
        `INSERT INTO users (id, email, name, role, patient_id, password_hash)
         VALUES (@id, @email, @name, @role, @patientId, @passwordHash)`
      )
      .run({ ...u, email: normalizeEmail(u.email), patientId: u.patientId ?? null });
  },

  recentPatients: (limit: number): UserRecord[] =>
    (
      sql.prepare(`SELECT * FROM users WHERE role = 'patient' ORDER BY created_at DESC LIMIT ?`).all(limit) as Row[]
    ).map(toUser),
};
