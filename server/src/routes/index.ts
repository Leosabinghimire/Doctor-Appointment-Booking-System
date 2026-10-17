import { Router } from 'express';
import type { BookingPayload, Doctor } from '../../../src/types';
import { bookAppointment, cancelAppointment } from '../booking';
import { CURRENT_PATIENT_ID, db } from '../db';
import { HttpError, asyncHandler } from '../http';
import { isTelentirEnabled } from '../telentir/client';
import { getCallLogs, syncCalls } from '../telentir/calls';
import { placeReminderCall } from '../telentir/reminders';
import { buildClinicKnowledge } from '../telentir/knowledge';

export const api = Router();

const str = (v: unknown) => (typeof v === 'string' && v !== '' ? v : undefined);

const filterDoctors = (query: Record<string, unknown>): Doctor[] => {
  let result = [...db.doctors];
  const search = str(query.search)?.toLowerCase();
  const specialty = str(query.specialty);
  const city = str(query.city);
  const minRating = str(query.minRating);
  const maxFee = str(query.maxFee);

  if (search) {
    result = result.filter(
      (d) =>
        d.name.toLowerCase().includes(search) ||
        d.specialty.toLowerCase().includes(search) ||
        d.hospital.toLowerCase().includes(search)
    );
  }
  if (specialty && specialty !== 'All') result = result.filter((d) => d.specialty === specialty);
  if (city) result = result.filter((d) => d.city === city);
  if (query.availableToday === 'true') result = result.filter((d) => d.availableToday);
  if (query.videoOnly === 'true') result = result.filter((d) => d.videoConsult);
  if (minRating) result = result.filter((d) => d.rating >= Number(minRating));
  if (maxFee) result = result.filter((d) => d.consultationFee <= Number(maxFee));

  switch (str(query.sortBy)) {
    case 'rating':
      result.sort((a, b) => b.rating - a.rating);
      break;
    case 'experience':
      result.sort((a, b) => b.experience - a.experience);
      break;
    case 'fee':
      result.sort((a, b) => a.consultationFee - b.consultationFee);
      break;
  }
  return result;
};

/** Surfaces Telentir API failures to the UI instead of a generic 500. */
const viaTelentir = async <T>(fn: () => Promise<T>): Promise<T> => {
  try {
    return await fn();
  } catch (err) {
    if (err instanceof HttpError) throw err;
    throw new HttpError(502, `Telentir request failed: ${(err as Error).message}`, 'TELENTIR_ERROR');
  }
};

const findOr404 =<T>(item: T | undefined, what: string): T => {
  if (!item) throw new HttpError(404, `${what} not found`, 'NOT_FOUND');
  return item;
};

api.get('/health', (_req, res) => {
  res.json({ ok: true, telentir: isTelentirEnabled() });
});

// ---- Doctors ----
api.get('/doctors', (req, res) => {
  res.json(filterDoctors(req.query as Record<string, unknown>));
});
api.get('/doctors/:id', (req, res) => {
  res.json(findOr404(db.doctors.find((d) => d.id === req.params.id), 'Doctor'));
});
api.get('/doctors/:id/availability', (req, res) => {
  res.json(findOr404(db.availability.get(req.params.id), 'Doctor'));
});

// ---- Appointments ----
api.get('/appointments', (_req, res) => {
  res.json(db.appointments);
});
api.get('/appointments/:id', (req, res) => {
  res.json(findOr404(db.appointments.find((a) => a.id === req.params.id), 'Appointment'));
});
api.post('/appointments', (req, res) => {
  const payload = req.body as Partial<BookingPayload>;
  const required = ['doctorId', 'date', 'slotId', 'type', 'reason', 'patientName', 'patientPhone'] as const;
  const missing = required.filter((k) => !payload[k]);
  if (missing.length) throw new HttpError(400, `Missing fields: ${missing.join(', ')}`, 'VALIDATION');
  res.status(201).json(bookAppointment(payload as BookingPayload));
});
api.post('/appointments/:id/cancel', (req, res) => {
  res.json(cancelAppointment(req.params.id));
});
api.post(
  '/appointments/:id/reminder-call',
  asyncHandler(async (req, res) => {
    res.json(await viaTelentir(() => placeReminderCall(req.params.id)));
  })
);

// ---- Patients ----
api.get('/patients/me', (_req, res) => {
  res.json(db.patients.find((p) => p.id === CURRENT_PATIENT_ID));
});
api.get('/patients/me/history', (_req, res) => {
  res.json(db.medicalHistory);
});

// ---- Prescriptions ----
api.get('/prescriptions', (_req, res) => {
  res.json(db.prescriptions);
});
api.get('/prescriptions/:id', (req, res) => {
  res.json(findOr404(db.prescriptions.find((p) => p.id === req.params.id), 'Prescription'));
});
api.post('/prescriptions/:id/refill', (req, res) => {
  const rx = findOr404(db.prescriptions.find((p) => p.id === req.params.id), 'Prescription');
  if (!rx.refillable || rx.refillsRemaining <= 0) {
    throw new HttpError(400, 'No refills remaining', 'NO_REFILLS');
  }
  rx.refillsRemaining -= 1;
  res.json(rx);
});

// ---- Notifications ----
api.get('/notifications', (_req, res) => {
  res.json(db.notifications);
});
api.post('/notifications/read-all', (_req, res) => {
  db.notifications.forEach((n) => (n.read = true));
  res.status(204).end();
});
api.post('/notifications/:id/read', (req, res) => {
  findOr404(db.notifications.find((n) => n.id === req.params.id), 'Notification').read = true;
  res.status(204).end();
});

// ---- Admin ----
api.get('/admin/stats', (_req, res) => {
  res.json(db.adminStats);
});

// ---- Calls (Telentir) ----
api.get('/calls', (_req, res) => {
  res.json(getCallLogs());
});
api.post(
  '/calls/sync',
  asyncHandler(async (_req, res) => {
    res.json(await viaTelentir(syncCalls));
  })
);

// Plain-text clinic info — the same content uploaded to the Telentir knowledge base.
api.get('/public/clinic-info.txt', (_req, res) => {
  res.type('text/plain').send(buildClinicKnowledge());
});
