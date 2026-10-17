import type Database from 'better-sqlite3';

const NOW = `(strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))`;

/**
 * Schema changes, applied in order and tracked with SQLite's `user_version`.
 * Never edit a migration that has shipped — append a new one instead.
 *
 * Nested values the app only reads as a whole (a doctor's profile, a prescription's
 * medications, a call transcript) are stored as JSON text.
 */
const MIGRATIONS: string[] = [
  // 1 — initial schema
  `
  CREATE TABLE doctors (
    id   TEXT PRIMARY KEY,
    data TEXT NOT NULL
  );

  CREATE TABLE patients (
    id                 TEXT PRIMARY KEY,
    name               TEXT NOT NULL,
    email              TEXT NOT NULL,
    phone              TEXT NOT NULL,
    phone_key          TEXT NOT NULL UNIQUE,
    avatar             TEXT NOT NULL DEFAULT '',
    age                INTEGER,
    gender             TEXT,
    blood_group        TEXT,
    height             REAL,
    weight             REAL,
    allergies          TEXT NOT NULL DEFAULT '[]',
    chronic_conditions TEXT NOT NULL DEFAULT '[]',
    emergency_contact  TEXT,
    created_at         TEXT NOT NULL DEFAULT ${NOW}
  );

  CREATE TABLE users (
    id            TEXT PRIMARY KEY,
    email         TEXT NOT NULL UNIQUE,
    name          TEXT NOT NULL,
    role          TEXT NOT NULL CHECK (role IN ('patient', 'doctor', 'admin')),
    patient_id    TEXT REFERENCES patients(id) ON DELETE CASCADE,
    password_hash TEXT NOT NULL,
    created_at    TEXT NOT NULL DEFAULT ${NOW}
  );

  CREATE TABLE appointments (
    id           TEXT PRIMARY KEY,
    doctor_id    TEXT NOT NULL REFERENCES doctors(id),
    patient_id   TEXT NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    patient_name TEXT NOT NULL,
    day          TEXT NOT NULL,
    time         TEXT NOT NULL,
    type         TEXT NOT NULL CHECK (type IN ('video', 'in-person')),
    status       TEXT NOT NULL CHECK (status IN ('upcoming', 'completed', 'cancelled', 'in-progress')),
    reason       TEXT NOT NULL,
    notes        TEXT,
    meeting_link TEXT,
    fee          REAL NOT NULL,
    created_at   TEXT NOT NULL DEFAULT ${NOW}
  );
  -- The database itself guarantees a slot can't be double-booked, even under concurrent requests.
  CREATE UNIQUE INDEX appointments_one_per_slot
    ON appointments (doctor_id, day, time) WHERE status IN ('upcoming', 'in-progress');
  CREATE INDEX appointments_patient ON appointments (patient_id);

  CREATE TABLE prescriptions (
    id         TEXT PRIMARY KEY,
    patient_id TEXT NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    data       TEXT NOT NULL
  );
  CREATE INDEX prescriptions_patient ON prescriptions (patient_id);

  CREATE TABLE medical_records (
    id         TEXT PRIMARY KEY,
    patient_id TEXT NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    date       TEXT NOT NULL,
    data       TEXT NOT NULL
  );
  CREATE INDEX medical_records_patient ON medical_records (patient_id, date);

  CREATE TABLE notifications (
    id         TEXT PRIMARY KEY,
    patient_id TEXT NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    type       TEXT NOT NULL,
    title      TEXT NOT NULL,
    message    TEXT NOT NULL,
    timestamp  TEXT NOT NULL,
    read       INTEGER NOT NULL DEFAULT 0,
    action_url TEXT
  );
  CREATE INDEX notifications_patient ON notifications (patient_id, timestamp);

  CREATE TABLE call_logs (
    id               TEXT PRIMARY KEY,
    external_call_id TEXT NOT NULL UNIQUE,
    started_at       TEXT NOT NULL,
    appointment_id   TEXT REFERENCES appointments(id) ON DELETE SET NULL,
    data             TEXT NOT NULL
  );

  -- Reminder calls we started, so call sync can link the resulting call to its appointment.
  CREATE TABLE reminder_calls (
    id             INTEGER PRIMARY KEY AUTOINCREMENT,
    appointment_id TEXT NOT NULL REFERENCES appointments(id) ON DELETE CASCADE,
    phone_key      TEXT NOT NULL,
    placed_at      INTEGER NOT NULL
  );
  `,

  // 2 — doctors can be archived instead of deleted (past appointments still reference them)
  `
  ALTER TABLE doctors ADD COLUMN active INTEGER NOT NULL DEFAULT 1;
  `,
];

export const migrate = (db: Database.Database) => {
  const current = db.pragma('user_version', { simple: true }) as number;
  for (let version = current; version < MIGRATIONS.length; version++) {
    db.transaction(() => {
      db.exec(MIGRATIONS[version]);
      db.pragma(`user_version = ${version + 1}`);
    })();
    console.log(`[db] applied migration ${version + 1}`);
  }
};
