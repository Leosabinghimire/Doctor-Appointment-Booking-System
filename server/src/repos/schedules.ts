import type { DoctorSchedule, TimeOff, WeeklySchedule } from '../../../src/types';
import { DEFAULT_WEEKLY_SCHEDULE } from '../../../src/utils/schedule';
import { sql } from '../db/connection';
import { newId } from '../util';

type TimeOffRow = { id: string; start_day: string; end_day: string; reason: string };

const toTimeOff = (r: TimeOffRow): TimeOff => ({ id: r.id, startDay: r.start_day, endDay: r.end_day, reason: r.reason });

export const schedulesRepo = {
  /** The doctor's weekly hours, or the clinic default when they have none of their own. */
  weekly: (doctorId: string): { weekly: WeeklySchedule; isDefault: boolean } => {
    const row = sql.prepare('SELECT schedule FROM doctors WHERE id = ?').get(doctorId) as { schedule: string | null } | undefined;
    return row?.schedule
      ? { weekly: JSON.parse(row.schedule) as WeeklySchedule, isDefault: false }
      : { weekly: DEFAULT_WEEKLY_SCHEDULE, isDefault: true };
  },

  setWeekly: (doctorId: string, weekly: WeeklySchedule | null) => {
    sql.prepare('UPDATE doctors SET schedule = ? WHERE id = ?').run(weekly ? JSON.stringify(weekly) : null, doctorId);
  },

  /** Time off that hasn't ended before `fromDay`, earliest first. */
  timeOff: (doctorId: string, fromDay: string): TimeOff[] =>
    (
      sql
        .prepare('SELECT id, start_day, end_day, reason FROM doctor_time_off WHERE doctor_id = ? AND end_day >= ? ORDER BY start_day')
        .all(doctorId, fromDay) as TimeOffRow[]
    ).map(toTimeOff),

  addTimeOff: (doctorId: string, startDay: string, endDay: string, reason: string): TimeOff => {
    const id = newId('t');
    sql
      .prepare('INSERT INTO doctor_time_off (id, doctor_id, start_day, end_day, reason) VALUES (?, ?, ?, ?, ?)')
      .run(id, doctorId, startDay, endDay, reason);
    return { id, startDay, endDay, reason };
  },

  removeTimeOff: (doctorId: string, id: string) =>
    sql.prepare('DELETE FROM doctor_time_off WHERE id = ? AND doctor_id = ?').run(id, doctorId).changes > 0,

  full: (doctorId: string, today: string): DoctorSchedule => ({
    ...schedulesRepo.weekly(doctorId),
    timeOff: schedulesRepo.timeOff(doctorId, today),
  }),
};
