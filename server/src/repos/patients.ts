import type { BloodGroup, EmergencyContact, Gender, Patient } from '../../../src/types';
import { parseJson, sql } from '../db/connection';
import { phoneKey } from '../util';

interface Row {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  age: number | null;
  gender: string | null;
  blood_group: string | null;
  height: number | null;
  weight: number | null;
  allergies: string;
  chronic_conditions: string;
  emergency_contact: string | null;
}

const orUndefined = <T>(v: T | null) => (v === null ? undefined : v);

const toPatient = (r: Row): Patient => ({
  id: r.id,
  name: r.name,
  email: r.email,
  phone: r.phone,
  avatar: r.avatar,
  age: orUndefined(r.age),
  gender: orUndefined(r.gender) as Gender | undefined,
  bloodGroup: orUndefined(r.blood_group) as BloodGroup | undefined,
  height: orUndefined(r.height),
  weight: orUndefined(r.weight),
  allergies: parseJson<string[]>(r.allergies, []),
  chronicConditions: parseJson<string[]>(r.chronic_conditions, []),
  emergencyContact: parseJson<EmergencyContact>(r.emergency_contact, { name: '', relation: '', phone: '' }),
});

export const patientsRepo = {
  get: (id: string): Patient | undefined => {
    const row = sql.prepare('SELECT * FROM patients WHERE id = ?').get(id) as Row | undefined;
    return row && toPatient(row);
  },

  findByPhone: (phone: string): Patient | undefined => {
    const row = sql.prepare('SELECT * FROM patients WHERE phone_key = ?').get(phoneKey(phone)) as Row | undefined;
    return row && toPatient(row);
  },

  insert: (p: Patient) => {
    sql
      .prepare(
        `INSERT INTO patients (id, name, email, phone, phone_key, avatar, age, gender, blood_group, height, weight,
           allergies, chronic_conditions, emergency_contact)
         VALUES (@id, @name, @email, @phone, @phoneKey, @avatar, @age, @gender, @bloodGroup, @height, @weight,
           @allergies, @chronicConditions, @emergencyContact)`
      )
      .run({
        id: p.id,
        name: p.name,
        email: p.email,
        phone: p.phone,
        phoneKey: phoneKey(p.phone),
        avatar: p.avatar,
        age: p.age ?? null,
        gender: p.gender ?? null,
        bloodGroup: p.bloodGroup ?? null,
        height: p.height ?? null,
        weight: p.weight ?? null,
        allergies: JSON.stringify(p.allergies),
        chronicConditions: JSON.stringify(p.chronicConditions),
        emergencyContact: p.emergencyContact.name ? JSON.stringify(p.emergencyContact) : null,
      });
  },

  count: () => (sql.prepare('SELECT COUNT(*) AS n FROM patients').get() as { n: number }).n,
};
