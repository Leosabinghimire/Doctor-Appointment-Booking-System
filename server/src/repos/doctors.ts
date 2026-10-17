import type { AdminDoctor, Doctor, DoctorInput } from '../../../src/types';
import { sql } from '../db/connection';
import { localDay, newId } from '../util';
import { getAvailability } from './appointments';

type Row = { data: string; active: number };

/** Weekday + time of the doctor's next open slot, from the real schedule. */
const liveAvailability = (doctorId: string): Pick<Doctor, 'availableToday' | 'nextSlot'> => {
  const days = getAvailability(doctorId);
  const today = localDay();
  const availableToday = days.some((d) => d.date === today && d.slots.some((s) => s.available));
  for (const day of days) {
    const slot = day.slots.find((s) => s.available);
    if (slot) {
      const label =
        day.date === today
          ? 'Today'
          : new Date(`${day.date}T12:00:00`).toLocaleDateString('en-US', { weekday: 'short' });
      return { availableToday, nextSlot: `${label}, ${slot.time}` };
    }
  }
  return { availableToday, nextSlot: 'No openings this week' };
};

const toDoctor = (row: Row): Doctor => {
  const doctor = JSON.parse(row.data) as Doctor;
  return { ...doctor, ...liveAvailability(doctor.id), active: row.active === 1 };
};

export const doctorsRepo = {
  /** Doctors patients can see and book. */
  all: (): Doctor[] =>
    (sql.prepare('SELECT data, active FROM doctors WHERE active = 1 ORDER BY rowid').all() as Row[]).map(toDoctor),

  /** Active doctor by id — archived doctors are hidden from patients and can't be booked. */
  get: (id: string): Doctor | undefined => {
    const row = sql.prepare('SELECT data, active FROM doctors WHERE id = ? AND active = 1').get(id) as Row | undefined;
    return row && toDoctor(row);
  },

  /** Every doctor, archived included, with their upcoming appointment count. */
  adminList: (): AdminDoctor[] =>
    (
      sql
        .prepare(
          `SELECT d.data, d.active,
             (SELECT COUNT(*) FROM appointments a WHERE a.doctor_id = d.id AND a.status = 'upcoming') AS upcoming
           FROM doctors d ORDER BY d.active DESC, d.rowid`
        )
        .all() as (Row & { upcoming: number })[]
    ).map((row) => ({ ...toDoctor(row), active: row.active === 1, upcomingAppointments: row.upcoming })),

  exists: (id: string) => Boolean(sql.prepare('SELECT 1 FROM doctors WHERE id = ?').get(id)),

  /** Seeding: inserts a full doctor record as-is. */
  insert: (doctor: Doctor) => {
    sql.prepare('INSERT INTO doctors (id, data) VALUES (?, ?)').run(doctor.id, JSON.stringify(doctor));
  },

  create: (input: DoctorInput): string => {
    const id = newId('d');
    const doctor: Doctor = {
      ...input,
      id,
      // No review system yet: new doctors start unrated.
      rating: 0,
      reviewCount: 0,
      availableToday: false,
      nextSlot: '',
    };
    sql.prepare('INSERT INTO doctors (id, data) VALUES (?, ?)').run(id, JSON.stringify(doctor));
    return id;
  },

  /** Replaces the editable fields; keeps id and rating. */
  update: (id: string, input: DoctorInput) => {
    const row = sql.prepare('SELECT data FROM doctors WHERE id = ?').get(id) as { data: string } | undefined;
    if (!row) return false;
    const current = JSON.parse(row.data) as Doctor;
    sql.prepare('UPDATE doctors SET data = ? WHERE id = ?').run(JSON.stringify({ ...current, ...input, id }), id);
    return true;
  },

  setActive: (id: string, active: boolean) =>
    sql.prepare('UPDATE doctors SET active = ? WHERE id = ?').run(active ? 1 : 0, id).changes > 0,

  count: () => (sql.prepare('SELECT COUNT(*) AS n FROM doctors WHERE active = 1').get() as { n: number }).n,

  countAll: () => (sql.prepare('SELECT COUNT(*) AS n FROM doctors').get() as { n: number }).n,
};
