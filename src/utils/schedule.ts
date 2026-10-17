/**
 * Appointment slot rules, shared by the backend (to decide what can be booked) and the
 * admin schedule editor (to preview it). Keep this file free of browser- or server-only code.
 */
import type { WeeklySchedule, WorkingDay } from '../types/doctor.types';

export const SLOT_MINUTES = 30;

export const WEEKDAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const CLINIC_DAY: WorkingDay = { start: '09:00', end: '17:30', breakStart: '12:00', breakEnd: '13:00' };

/** Used for doctors without their own schedule: Monday–Saturday 09:00–17:30, lunch 12:00–13:00. */
export const DEFAULT_WEEKLY_SCHEDULE: WeeklySchedule = [null, CLINIC_DAY, CLINIC_DAY, CLINIC_DAY, CLINIC_DAY, CLINIC_DAY, CLINIC_DAY];

const HHMM = /^([01]\d|2[0-3]):([0-5]\d)$/;

/** "13:30" → 810, or NaN if malformed. */
export const toMinutes = (hhmm: string | undefined) => {
  const m = HHMM.exec(hhmm ?? '');
  return m ? Number(m[1]) * 60 + Number(m[2]) : NaN;
};

/** 810 → "01:30 PM" — the label patients see and appointments store. */
export const formatSlotTime = (minutes: number) => {
  const h24 = Math.floor(minutes / 60);
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  return `${String(h12).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')} ${h24 < 12 ? 'AM' : 'PM'}`;
};

export interface SlotTime {
  id: string;
  time: string;
  minutes: number;
}

/**
 * The 30-minute slots in one working day. The morning runs from `start` to the break,
 * the afternoon from the end of the break to `end`; a slot must fit entirely inside.
 */
export const slotsForDay = (day: WorkingDay | null | undefined): SlotTime[] => {
  if (!day) return [];
  const start = toMinutes(day.start);
  const end = toMinutes(day.end);
  const hasBreak = Boolean(day.breakStart && day.breakEnd);
  const segments: [number, number][] = hasBreak
    ? [
        [start, toMinutes(day.breakStart)],
        [toMinutes(day.breakEnd), end],
      ]
    : [[start, end]];

  const slots: SlotTime[] = [];
  for (const [from, to] of segments) {
    for (let t = from; t + SLOT_MINUTES <= to; t += SLOT_MINUTES) {
      slots.push({ id: `slot-${String(t).padStart(4, '0')}`, time: formatSlotTime(t), minutes: t });
    }
  }
  return slots;
};

/** Every problem with a weekly schedule, worded for the admin. Empty when valid. */
export const scheduleProblems = (weekly: unknown): string[] => {
  if (!Array.isArray(weekly) || weekly.length !== 7) return ['The schedule must list all 7 days'];
  const problems: string[] = [];

  weekly.forEach((day: unknown, i) => {
    if (day === null) return;
    const name = WEEKDAY_NAMES[i];
    const dayProblems: string[] = [];
    const d = (day ?? {}) as Partial<WorkingDay>;
    const start = toMinutes(d.start);
    const end = toMinutes(d.end);
    if (Number.isNaN(start) || Number.isNaN(end)) {
      problems.push(`${name}: enter a start and end time`);
      return;
    }
    if (end <= start) dayProblems.push(`${name}: the end time must be after the start time`);
    else if (end - start < SLOT_MINUTES) dayProblems.push(`${name}: the day must be at least ${SLOT_MINUTES} minutes long`);

    if (d.breakStart || d.breakEnd) {
      const bs = toMinutes(d.breakStart);
      const be = toMinutes(d.breakEnd);
      if (Number.isNaN(bs) || Number.isNaN(be)) dayProblems.push(`${name}: enter both break times, or remove the break`);
      else if (bs >= be) dayProblems.push(`${name}: the break must end after it starts`);
      else if (bs <= start || be >= end) dayProblems.push(`${name}: the break must be inside working hours`);
    }
    if (dayProblems.length === 0 && slotsForDay(d as WorkingDay).length === 0) {
      dayProblems.push(`${name}: these hours leave no ${SLOT_MINUTES}-minute slots`);
    }
    problems.push(...dayProblems);
  });

  return problems;
};
