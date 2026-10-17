import { Router, type Request } from 'express';
import type { BookingPayload, Doctor } from '../../../src/types';
import { currentUser, isAdmin, requireAuth, requireRole } from '../auth/middleware';
import { authRoutes } from '../auth/routes';
import { bookAppointment, cancelAppointment } from '../booking';
import { db, samePhone, type Owned } from '../db';
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

const findOr404 = <T>(item: T | undefined, what: string): T => {
  if (!item) throw new HttpError(404, `${what} not found`, 'NOT_FOUND');
  return item;
};

/** Admins see everything; patients only see records that belong to them. */
const visibleTo = (req: Request) => (item: Owned) => isAdmin(req) || item.patientId === currentUser(req).patientId;

/** Strictly the signed-in user's own records — notifications are personal, even admins only see their own. */
const ownedBy = (req: Request) => (item: Owned) => item.patientId !== undefined && item.patientId === currentUser(req).patientId;

/** Like findOr404, but answers 404 (not 403) for other patients' records so IDs can't be probed. */
const findOwned = <T extends Owned>(req: Request, item: T | undefined, what: string): T =>
  findOr404(item && visibleTo(req)(item) ? item : undefined, what);

// ================= Public =================

api.get('/health', (_req, res) => {
  res.json({ ok: true, telentir: isTelentirEnabled() });
});

api.use(authRoutes);

api.get('/doctors', (req, res) => {
  res.json(filterDoctors(req.query as Record<string, unknown>));
});
api.get('/doctors/:id', (req, res) => {
  res.json(findOr404(db.doctors.find((d) => d.id === req.params.id), 'Doctor'));
});
api.get('/doctors/:id/availability', (req, res) => {
  res.json(findOr404(db.availability.get(req.params.id), 'Doctor'));
});

// Plain-text clinic info — the same content uploaded to the Telentir knowledge base. No patient data.
api.get('/public/clinic-info.txt', (_req, res) => {
  res.type('text/plain').send(buildClinicKnowledge());
});

// ================= Signed in =================

api.use(requireAuth);

// ---- Appointments ----
api.get('/appointments', (req, res) => {
  res.json(db.appointments.filter(visibleTo(req)));
});
api.get('/appointments/:id', (req, res) => {
  res.json(findOwned(req, db.appointments.find((a) => a.id === req.params.id), 'Appointment'));
});
api.post('/appointments', (req, res) => {
  const payload = req.body as Partial<BookingPayload>;
  const required = ['doctorId', 'date', 'slotId', 'type', 'reason', 'patientName', 'patientPhone'] as const;
  const missing = required.filter((k) => !payload[k]);
  if (missing.length) throw new HttpError(400, `Missing fields: ${missing.join(', ')}`, 'VALIDATION');

  // Patients always book for themselves; admins book for the patient with that phone number.
  const user = currentUser(req);
  const patientId = isAdmin(req)
    ? db.patients.find((p) => samePhone(p.phone, payload.patientPhone!))?.id
    : user.patientId;
  if (!patientId) throw new HttpError(400, 'No patient account with that phone number', 'PATIENT_NOT_FOUND');

  res.status(201).json(bookAppointment(payload as BookingPayload, patientId));
});
api.post('/appointments/:id/cancel', (req, res) => {
  findOwned(req, db.appointments.find((a) => a.id === req.params.id), 'Appointment');
  res.json(cancelAppointment(req.params.id));
});

// ---- Patients ----
api.get('/patients/me', (req, res) => {
  const { patientId } = currentUser(req);
  res.json(findOr404(db.patients.find((p) => p.id === patientId), 'Patient profile'));
});
api.get('/patients/me/history', (req, res) => {
  res.json(db.medicalHistory.filter(visibleTo(req)));
});

// ---- Prescriptions ----
api.get('/prescriptions', (req, res) => {
  res.json(db.prescriptions.filter(visibleTo(req)));
});
api.get('/prescriptions/:id', (req, res) => {
  res.json(findOwned(req, db.prescriptions.find((p) => p.id === req.params.id), 'Prescription'));
});
api.post('/prescriptions/:id/refill', (req, res) => {
  const rx = findOwned(req, db.prescriptions.find((p) => p.id === req.params.id), 'Prescription');
  if (!rx.refillable || rx.refillsRemaining <= 0) {
    throw new HttpError(400, 'No refills remaining', 'NO_REFILLS');
  }
  rx.refillsRemaining -= 1;
  res.json(rx);
});

// ---- Notifications ----
api.get('/notifications', (req, res) => {
  res.json(db.notifications.filter(ownedBy(req)));
});
api.post('/notifications/read-all', (req, res) => {
  db.notifications.filter(ownedBy(req)).forEach((n) => (n.read = true));
  res.status(204).end();
});
api.post('/notifications/:id/read', (req, res) => {
  const notification = db.notifications.find((n) => n.id === req.params.id);
  findOr404(notification && ownedBy(req)(notification) ? notification : undefined, 'Notification').read = true;
  res.status(204).end();
});

// ================= Admin only =================

api.get('/admin/stats', requireRole('admin'), (_req, res) => {
  res.json(db.adminStats);
});

// Telentir actions cost money (phone minutes), so only admins can trigger them.
api.get('/calls', requireRole('admin'), (_req, res) => {
  res.json(getCallLogs());
});
api.post(
  '/calls/sync',
  requireRole('admin'),
  asyncHandler(async (_req, res) => {
    res.json(await viaTelentir(syncCalls));
  })
);
api.post(
  '/appointments/:id/reminder-call',
  requireRole('admin'),
  asyncHandler(async (req, res) => {
    res.json(await viaTelentir(() => placeReminderCall(req.params.id)));
  })
);
