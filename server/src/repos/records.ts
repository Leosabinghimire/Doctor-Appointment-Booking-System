import type { AppNotification, MedicalRecord, NotificationType, Prescription } from '../../../src/types';
import { sql } from '../db/connection';

// ---- Prescriptions ----

type DataRow = { data: string };

export const prescriptionsRepo = {
  list: (patientId?: string): Prescription[] =>
    (
      (patientId
        ? sql.prepare('SELECT data FROM prescriptions WHERE patient_id = ? ORDER BY rowid').all(patientId)
        : sql.prepare('SELECT data FROM prescriptions ORDER BY rowid').all()) as DataRow[]
    ).map((r) => JSON.parse(r.data) as Prescription),

  get: (id: string): Prescription | undefined => {
    const row = sql.prepare('SELECT data FROM prescriptions WHERE id = ?').get(id) as DataRow | undefined;
    return row && (JSON.parse(row.data) as Prescription);
  },

  insert: (rx: Prescription) => {
    sql.prepare('INSERT INTO prescriptions (id, patient_id, data) VALUES (?, ?, ?)').run(rx.id, rx.patientId, JSON.stringify(rx));
  },

  update: (rx: Prescription) => {
    sql.prepare('UPDATE prescriptions SET data = ? WHERE id = ?').run(JSON.stringify(rx), rx.id);
  },
};

// ---- Medical history ----

export const medicalRecordsRepo = {
  list: (patientId?: string): MedicalRecord[] =>
    (
      (patientId
        ? sql.prepare('SELECT data FROM medical_records WHERE patient_id = ? ORDER BY date DESC').all(patientId)
        : sql.prepare('SELECT data FROM medical_records ORDER BY date DESC').all()) as DataRow[]
    ).map((r) => JSON.parse(r.data) as MedicalRecord),

  insert: (patientId: string, record: MedicalRecord) => {
    sql
      .prepare('INSERT INTO medical_records (id, patient_id, date, data) VALUES (?, ?, ?, ?)')
      .run(record.id, patientId, record.date, JSON.stringify(record));
  },
};

// ---- Notifications ----

interface NotificationRow {
  id: string;
  patient_id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  read: number;
  action_url: string | null;
}

const toNotification = (r: NotificationRow): AppNotification => ({
  id: r.id,
  type: r.type,
  title: r.title,
  message: r.message,
  timestamp: r.timestamp,
  read: r.read === 1,
  actionUrl: r.action_url ?? undefined,
});

/** Notifications are always scoped to one patient — every query takes the owner's id. */
export const notificationsRepo = {
  listFor: (patientId: string): AppNotification[] =>
    (
      sql.prepare('SELECT * FROM notifications WHERE patient_id = ? ORDER BY timestamp DESC').all(patientId) as NotificationRow[]
    ).map(toNotification),

  insert: (patientId: string, n: AppNotification) => {
    sql
      .prepare(
        `INSERT INTO notifications (id, patient_id, type, title, message, timestamp, read, action_url)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .run(n.id, patientId, n.type, n.title, n.message, n.timestamp, n.read ? 1 : 0, n.actionUrl ?? null);
  },

  /** Returns false if the notification doesn't exist or belongs to someone else. */
  markRead: (id: string, patientId: string): boolean =>
    sql.prepare('UPDATE notifications SET read = 1 WHERE id = ? AND patient_id = ?').run(id, patientId).changes > 0,

  markAllRead: (patientId: string) => {
    sql.prepare('UPDATE notifications SET read = 1 WHERE patient_id = ?').run(patientId);
  },
};
