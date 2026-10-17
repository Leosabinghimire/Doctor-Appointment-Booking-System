import {
  mockAppointments,
  mockCallLogs,
  mockDoctors,
  mockMedicalHistory,
  mockNotifications,
  mockPatient,
  mockPrescriptions,
} from '../../../src/data/mock';
import { hashPassword } from '../auth/passwords';
import { config } from '../config';
import { appointmentsRepo } from '../repos/appointments';
import { callLogsRepo } from '../repos/calls';
import { doctorsRepo } from '../repos/doctors';
import { patientsRepo } from '../repos/patients';
import { medicalRecordsRepo, notificationsRepo, prescriptionsRepo } from '../repos/records';
import { usersRepo } from '../repos/users';
import { localDay } from '../util';
import { sql } from './connection';

/**
 * Fills an empty database. Safe to run on every start — each part only runs once.
 * - Always: the admin account.
 * - Development only: sample doctors, and the demo patient with sample appointments,
 *   prescriptions and calls. Production starts with no doctors — add real ones in Manage Doctors.
 */
export const seedDatabase = async () => {
  const demoPassword = config.auth.demoPatientPassword; // set only outside production
  const isDev = Boolean(demoPassword);

  if (isDev && doctorsRepo.countAll() === 0) {
    sql.transaction(() => mockDoctors.forEach(doctorsRepo.insert))();
    console.log(`[db] seeded ${mockDoctors.length} sample doctors`);
  }

  if (!usersRepo.findByEmail(config.auth.adminEmail)) {
    usersRepo.insert({
      id: 'u-admin',
      email: config.auth.adminEmail,
      name: 'Clinic Admin',
      role: 'admin',
      passwordHash: await hashPassword(config.auth.adminPassword),
    });
    console.log(`[db] created admin account ${config.auth.adminEmail}`);
  }

  if (demoPassword && !patientsRepo.get(mockPatient.id)) {
    const passwordHash = await hashPassword(demoPassword);
    sql.transaction(() => {
      patientsRepo.insert(mockPatient);
      usersRepo.insert({
        id: 'u-patient',
        email: mockPatient.email,
        name: mockPatient.name,
        role: 'patient',
        patientId: mockPatient.id,
        passwordHash,
      });
      for (const a of mockAppointments) {
        appointmentsRepo.insert({ ...a, day: localDay(new Date(a.date)) });
      }
      mockPrescriptions.forEach(prescriptionsRepo.insert);
      mockMedicalHistory.forEach((r) => medicalRecordsRepo.insert(mockPatient.id, r));
      mockNotifications.forEach((n) => notificationsRepo.insert(mockPatient.id, n));
      mockCallLogs.forEach(callLogsRepo.upsert);
    })();
    console.log('[db] seeded demo patient alex.morgan@example.com with sample data');
  }
};
