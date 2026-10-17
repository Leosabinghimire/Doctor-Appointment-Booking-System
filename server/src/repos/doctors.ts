import type { Doctor } from '../../../src/types';
import { sql } from '../db/connection';

type Row = { data: string };

const toDoctor = (row: Row) => JSON.parse(row.data) as Doctor;

export const doctorsRepo = {
  all: (): Doctor[] => (sql.prepare('SELECT data FROM doctors ORDER BY rowid').all() as Row[]).map(toDoctor),

  get: (id: string): Doctor | undefined => {
    const row = sql.prepare('SELECT data FROM doctors WHERE id = ?').get(id) as Row | undefined;
    return row && toDoctor(row);
  },

  insert: (doctor: Doctor) => {
    sql.prepare('INSERT INTO doctors (id, data) VALUES (?, ?)').run(doctor.id, JSON.stringify(doctor));
  },

  count: () => (sql.prepare('SELECT COUNT(*) AS n FROM doctors').get() as { n: number }).n,
};
