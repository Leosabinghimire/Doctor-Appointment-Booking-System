import type {
  Appointment,
  AppointmentStatus,
  AppointmentType,
  Doctor,
  DoctorAvailability,
  TimeSlot,
  WeeklySchedule,
} from '../../../src/types';
import { slotsForDay } from '../../../src/utils/schedule';
import { sql } from '../db/connection';
import { addDays, localDay, minutesOf, weekdayOf } from '../util';
import { avatarUrl } from './doctorPhotos';
import { schedulesRepo } from './schedules';

interface Row {
  id: string;
  doctor_id: string;
  patient_id: string;
  patient_name: string;
  day: string;
  time: string;
  type: AppointmentType;
  status: AppointmentStatus;
  reason: string;
  notes: string | null;
  meeting_link: string | null;
  fee: number;
  doctor: string;
  photo_at: number | null;
}

const toAppointment = (r: Row): Appointment => {
  const doctor = JSON.parse(r.doctor) as Doctor;
  return {
    id: r.id,
    doctorId: r.doctor_id,
    doctorName: doctor.name,
    doctorSpecialty: doctor.specialty,
    doctorAvatar: avatarUrl(r.doctor_id, r.photo_at, doctor.avatar),
    patientId: r.patient_id,
    patientName: r.patient_name,
    date: r.day,
    time: r.time,
    type: r.type,
    status: r.status,
    reason: r.reason,
    notes: r.notes ?? undefined,
    meetingLink: r.meeting_link ?? undefined,
    fee: r.fee,
  };
};

const SELECT = `SELECT a.*, d.data AS doctor, p.updated_at AS photo_at
  FROM appointments a JOIN doctors d ON d.id = a.doctor_id LEFT JOIN doctor_photos p ON p.doctor_id = a.doctor_id`;
// Upcoming visits soonest first, then past ones newest first.
const ORDER = `ORDER BY a.status != 'upcoming', CASE WHEN a.status = 'upcoming' THEN a.day END ASC, a.day DESC`;
const ACTIVE = `('upcoming', 'in-progress')`;

export interface NewAppointment {
  id: string;
  doctorId: string;
  patientId: string;
  patientName: string;
  day: string;
  time: string;
  type: AppointmentType;
  status: AppointmentStatus;
  reason: string;
  notes?: string;
  meetingLink?: string;
  fee: number;
}

export const appointmentsRepo = {
  listAll: (): Appointment[] => (sql.prepare(`${SELECT} ${ORDER}`).all() as Row[]).map(toAppointment),

  listForPatient: (patientId: string): Appointment[] =>
    (sql.prepare(`${SELECT} WHERE a.patient_id = ? ${ORDER}`).all(patientId) as Row[]).map(toAppointment),

  get: (id: string): Appointment | undefined => {
    const row = sql.prepare(`${SELECT} WHERE a.id = ?`).get(id) as Row | undefined;
    return row && toAppointment(row);
  },

  /** Throws SQLITE_CONSTRAINT_UNIQUE if the slot is already booked. */
  insert: (a: NewAppointment) => {
    sql
      .prepare(
        `INSERT INTO appointments (id, doctor_id, patient_id, patient_name, day, time, type, status, reason, notes, meeting_link, fee)
         VALUES (@id, @doctorId, @patientId, @patientName, @day, @time, @type, @status, @reason, @notes, @meetingLink, @fee)`
      )
      .run({ ...a, notes: a.notes ?? null, meetingLink: a.meetingLink ?? null });
  },

  setStatus: (id: string, status: AppointmentStatus) => {
    sql.prepare('UPDATE appointments SET status = ? WHERE id = ?').run(status, id);
  },
};

// ---- Availability ----

const BOOKING_WINDOW_DAYS = 7;

/**
 * Next 7 days of slots for a doctor, from their weekly hours (or the clinic default).
 * A slot is free unless it's booked, already past, or inside the doctor's time off.
 * Computed from appointments, so it can't drift.
 */
export const getAvailability = (doctorId: string): DoctorAvailability[] => {
  const today = localDay();
  const now = new Date();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const lastDay = addDays(today, BOOKING_WINDOW_DAYS - 1);
  const { weekly } = schedulesRepo.weekly(doctorId);
  const timeOff = schedulesRepo.timeOff(doctorId, today);

  const booked = new Set(
    (
      sql
        .prepare(`SELECT day, time FROM appointments WHERE doctor_id = ? AND day BETWEEN ? AND ? AND status IN ${ACTIVE}`)
        .all(doctorId, today, lastDay) as { day: string; time: string }[]
    ).map((b) => `${b.day}|${minutesOf(b.time)}`)
  );

  return Array.from({ length: BOOKING_WINDOW_DAYS }, (_, i) => {
    const day = addDays(today, i);
    const away = timeOff.some((t) => t.startDay <= day && day <= t.endDay);
    const working = away ? [] : slotsForDay(weekly[weekdayOf(day)]);
    const slots: TimeSlot[] = working.map((slot) => ({
      id: slot.id,
      time: slot.time,
      available: !booked.has(`${day}|${slot.minutes}`) && !(day === today && slot.minutes <= nowMinutes),
    }));
    return { date: day, slots, closed: working.length === 0 };
  });
};

export const findSlot = (doctorId: string, day: string, slotId: string) =>
  getAvailability(doctorId)
    .find((d) => d.date === day)
    ?.slots.find((s) => s.id === slotId);

// ---- Schedule change impact ----

const upcomingFor = (doctorId: string, fromDay: string) =>
  sql
    .prepare(`SELECT day, time FROM appointments WHERE doctor_id = ? AND status = 'upcoming' AND day >= ?`)
    .all(doctorId, fromDay) as { day: string; time: string }[];

/** Upcoming visits that fall outside these weekly hours (they stay booked; the admin is told). */
export const countOutsideWeekly = (doctorId: string, weekly: WeeklySchedule) =>
  upcomingFor(doctorId, localDay()).filter(
    (a) => !slotsForDay(weekly[weekdayOf(a.day)]).some((s) => s.minutes === minutesOf(a.time))
  ).length;

/** Upcoming visits between two days, inclusive. */
export const countInRange = (doctorId: string, startDay: string, endDay: string) =>
  upcomingFor(doctorId, localDay()).filter((a) => startDay <= a.day && a.day <= endDay).length;
