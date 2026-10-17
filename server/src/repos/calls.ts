import type { CallLog } from '../../../src/types';
import { sql } from '../db/connection';
import { phoneKey } from '../util';

type DataRow = { data: string };

const DEMO_PREFIX = 'demo-';

export const callLogsRepo = {
  list: (): CallLog[] =>
    (sql.prepare('SELECT data FROM call_logs ORDER BY started_at DESC').all() as DataRow[]).map(
      (r) => JSON.parse(r.data) as CallLog
    ),

  getByExternalId: (externalCallId: string): CallLog | undefined => {
    const row = sql.prepare('SELECT data FROM call_logs WHERE external_call_id = ?').get(externalCallId) as DataRow | undefined;
    return row && (JSON.parse(row.data) as CallLog);
  },

  upsert: (log: CallLog) => {
    sql
      .prepare(
        `INSERT INTO call_logs (id, external_call_id, started_at, appointment_id, data)
         VALUES (@id, @externalCallId, @startedAt, @appointmentId, @data)
         ON CONFLICT (external_call_id) DO UPDATE SET
           started_at = excluded.started_at, appointment_id = excluded.appointment_id, data = excluded.data`
      )
      .run({
        id: log.id,
        externalCallId: log.externalCallId,
        startedAt: log.startedAt,
        appointmentId: log.appointmentId ?? null,
        data: JSON.stringify(log),
      });
  },

  /** The seeded demo calls are removed once real Telentir data arrives. */
  deleteDemoCalls: () => {
    sql.prepare(`DELETE FROM call_logs WHERE external_call_id LIKE '${DEMO_PREFIX}%'`).run();
  },
};

export const reminderCallsRepo = {
  add: (appointmentId: string, phone: string, placedAt = Date.now()) => {
    sql
      .prepare('INSERT INTO reminder_calls (appointment_id, phone_key, placed_at) VALUES (?, ?, ?)')
      .run(appointmentId, phoneKey(phone), placedAt);
  },

  /** The appointment whose reminder we placed to this number shortly before the call started. */
  matchCall: (phone: string, startedAt: string): string | undefined => {
    const started = new Date(startedAt).getTime();
    const row = sql
      .prepare(
        `SELECT appointment_id FROM reminder_calls
         WHERE phone_key = ? AND placed_at BETWEEN ? AND ?
         ORDER BY placed_at DESC LIMIT 1`
      )
      .get(phoneKey(phone), started - 15 * 60_000, started + 60_000) as { appointment_id: string } | undefined;
    return row?.appointment_id;
  },
};
