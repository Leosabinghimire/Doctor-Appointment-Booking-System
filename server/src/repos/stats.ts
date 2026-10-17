import type { AdminStats } from '../../../src/types';
import { sql } from '../db/connection';
import { addDays, localDay, weekdayOf } from '../util';
import { doctorsRepo } from './doctors';
import { patientsRepo } from './patients';
import { usersRepo } from './users';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const NOT_CANCELLED = `status != 'cancelled'`;

/** Admin dashboard numbers, computed live from the database. */
export const computeAdminStats = (): AdminStats => {
  const today = localDay();
  const weekStart = addDays(today, -6);

  const appointmentsToday = (
    sql.prepare(`SELECT COUNT(*) AS n FROM appointments WHERE day = ? AND ${NOT_CANCELLED}`).get(today) as { n: number }
  ).n;

  const revenueThisMonth = (
    sql
      .prepare(`SELECT COALESCE(SUM(fee), 0) AS total FROM appointments WHERE substr(day, 1, 7) = ? AND ${NOT_CANCELLED}`)
      .get(today.slice(0, 7)) as { total: number }
  ).total;

  const perDay = new Map(
    (
      sql
        .prepare(`SELECT day, COUNT(*) AS n FROM appointments WHERE day BETWEEN ? AND ? AND ${NOT_CANCELLED} GROUP BY day`)
        .all(weekStart, today) as { day: string; n: number }[]
    ).map((r) => [r.day, r.n])
  );
  const weeklyAppointments = Array.from({ length: 7 }, (_, i) => {
    const day = addDays(weekStart, i);
    return { day: WEEKDAYS[weekdayOf(day)], count: perDay.get(day) ?? 0 };
  });

  const bySpecialty = sql
    .prepare(
      `SELECT json_extract(d.data, '$.specialty') AS name, COUNT(*) AS value
       FROM appointments a JOIN doctors d ON d.id = a.doctor_id
       WHERE a.${NOT_CANCELLED} GROUP BY name ORDER BY value DESC`
    )
    .all() as { name: string; value: number }[];
  const top = bySpecialty.slice(0, 5);
  const other = bySpecialty.slice(5).reduce((sum, s) => sum + s.value, 0);
  const specialtyDistribution = other > 0 ? [...top, { name: 'Other', value: other }] : top;

  const recentSignups = usersRepo.recentPatients(5).map((u) => ({
    id: u.id,
    name: u.name,
    role: 'Patient' as const,
    date: u.createdAt,
  }));

  return {
    totalPatients: patientsRepo.count(),
    totalDoctors: doctorsRepo.count(),
    appointmentsToday,
    revenueThisMonth,
    weeklyAppointments,
    specialtyDistribution,
    recentSignups,
  };
};
