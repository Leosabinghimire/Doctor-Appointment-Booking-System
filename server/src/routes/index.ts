import express, { Router, type Request } from 'express';
import type { BookingPayload, Doctor } from '../../../src/types';
import { currentUser, isAdmin, requireAuth, requireRole } from '../auth/middleware';
import { authRoutes } from '../auth/routes';
import { bookAppointment, cancelAppointment } from '../booking';
import { appointmentsRepo, getAvailability } from '../repos/appointments';
import { doctorsRepo } from '../repos/doctors';
import { PHOTO_MAX_BYTES, doctorPhotosRepo, sniffImageType } from '../repos/doctorPhotos';
import { patientsRepo } from '../repos/patients';
import { medicalRecordsRepo, notificationsRepo, prescriptionsRepo } from '../repos/records';
import { computeAdminStats } from '../repos/stats';
import { parseDoctorInput } from '../doctorInput';
import { HttpError, asyncHandler } from '../http';
import { isTelentirEnabled } from '../telentir/client';
import { getCallLogs, syncCalls } from '../telentir/calls';
import { placeReminderCall } from '../telentir/reminders';
import { buildClinicKnowledge } from '../telentir/knowledge';

export const api = Router();

const str = (v: unknown) => (typeof v === 'string' && v !== '' ? v : undefined);

const filterDoctors = (query: Record<string, unknown>): Doctor[] => {
  let result = doctorsRepo.all();
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

/** Admins see everything; patients only their own records. `undefined` means "no filter". */
const scopeOf = (req: Request): string | undefined => (isAdmin(req) ? undefined : (currentUser(req).patientId ?? '-'));

/** Like findOr404, but answers 404 (not 403) for other patients' records so IDs can't be probed. */
const findOwned = <T extends { patientId?: string }>(req: Request, item: T | undefined, what: string): T => {
  const scope = scopeOf(req);
  return findOr404(item && (scope === undefined || item.patientId === scope) ? item : undefined, what);
};

/** Notifications are personal — even admins only see their own (they have none). */
const ownPatientId = (req: Request) => currentUser(req).patientId ?? '-';

// ================= Public =================

api.get('/health', (_req, res) => {
  res.json({ ok: true, telentir: isTelentirEnabled() });
});

api.use(authRoutes);

api.get('/doctors', (req, res) => {
  res.json(filterDoctors(req.query as Record<string, unknown>));
});
api.get('/doctors/:id', (req, res) => {
  res.json(findOr404(doctorsRepo.get(req.params.id), 'Doctor'));
});
// Public: patients see photos, and appointment cards still show archived doctors' photos.
api.get('/doctors/:id/photo', (req, res) => {
  const photo = findOr404(doctorPhotosRepo.get(req.params.id), 'Photo');
  res.set({
    'Content-Type': photo.mime,
    // URLs carry ?v=<updated_at>, so a cached copy is never stale.
    'Cache-Control': 'public, max-age=31536000, immutable',
    'X-Content-Type-Options': 'nosniff',
    'Content-Security-Policy': "default-src 'none'",
  });
  res.send(photo.data);
});
api.get('/doctors/:id/availability', (req, res) => {
  findOr404(doctorsRepo.get(req.params.id), 'Doctor');
  res.json(getAvailability(req.params.id));
});

// Plain-text clinic info — the same content uploaded to the Telentir knowledge base. No patient data.
api.get('/public/clinic-info.txt', (_req, res) => {
  res.type('text/plain').send(buildClinicKnowledge());
});

// ================= Signed in =================

api.use(requireAuth);

// ---- Appointments ----
api.get('/appointments', (req, res) => {
  const scope = scopeOf(req);
  res.json(scope === undefined ? appointmentsRepo.listAll() : appointmentsRepo.listForPatient(scope));
});
api.get('/appointments/:id', (req, res) => {
  res.json(findOwned(req, appointmentsRepo.get(req.params.id), 'Appointment'));
});
api.post('/appointments', (req, res) => {
  const payload = req.body as Partial<BookingPayload>;
  const required = ['doctorId', 'date', 'slotId', 'type', 'reason', 'patientName', 'patientPhone'] as const;
  const missing = required.filter((k) => !payload[k]);
  if (missing.length) throw new HttpError(400, `Missing fields: ${missing.join(', ')}`, 'VALIDATION');

  // Patients always book for themselves; admins book for the patient with that phone number.
  const user = currentUser(req);
  const patientId = isAdmin(req)
    ? patientsRepo.findByPhone(payload.patientPhone!)?.id
    : user.patientId;
  if (!patientId) throw new HttpError(400, 'No patient account with that phone number', 'PATIENT_NOT_FOUND');

  res.status(201).json(bookAppointment(payload as BookingPayload, patientId));
});
api.post('/appointments/:id/cancel', (req, res) => {
  findOwned(req, appointmentsRepo.get(req.params.id), 'Appointment');
  res.json(cancelAppointment(req.params.id));
});

// ---- Patients ----
api.get('/patients/me', (req, res) => {
  const { patientId } = currentUser(req);
  res.json(findOr404(patientId ? patientsRepo.get(patientId) : undefined, 'Patient profile'));
});
api.get('/patients/me/history', (req, res) => {
  res.json(medicalRecordsRepo.list(scopeOf(req)));
});

// ---- Prescriptions ----
api.get('/prescriptions', (req, res) => {
  res.json(prescriptionsRepo.list(scopeOf(req)));
});
api.get('/prescriptions/:id', (req, res) => {
  res.json(findOwned(req, prescriptionsRepo.get(req.params.id), 'Prescription'));
});
api.post('/prescriptions/:id/refill', (req, res) => {
  const rx = findOwned(req, prescriptionsRepo.get(req.params.id), 'Prescription');
  if (!rx.refillable || rx.refillsRemaining <= 0) {
    throw new HttpError(400, 'No refills remaining', 'NO_REFILLS');
  }
  const updated = { ...rx, refillsRemaining: rx.refillsRemaining - 1 };
  prescriptionsRepo.update(updated);
  res.json(updated);
});

// ---- Notifications ----
api.get('/notifications', (req, res) => {
  res.json(notificationsRepo.listFor(ownPatientId(req)));
});
api.post('/notifications/read-all', (req, res) => {
  notificationsRepo.markAllRead(ownPatientId(req));
  res.status(204).end();
});
api.post('/notifications/:id/read', (req, res) => {
  if (!notificationsRepo.markRead(req.params.id, ownPatientId(req))) {
    throw new HttpError(404, 'Notification not found', 'NOT_FOUND');
  }
  res.status(204).end();
});

// ================= Admin only =================

api.get('/admin/stats', requireRole('admin'), (_req, res) => {
  res.json(computeAdminStats());
});

// ---- Doctor management ----
api.get('/admin/doctors', requireRole('admin'), (_req, res) => {
  res.json(doctorsRepo.adminList());
});
api.post('/admin/doctors', requireRole('admin'), (req, res) => {
  const id = doctorsRepo.create(parseDoctorInput(req.body));
  res.status(201).json(doctorsRepo.adminList().find((d) => d.id === id));
});
api.put('/admin/doctors/:id', requireRole('admin'), (req, res) => {
  const input = parseDoctorInput(req.body);
  if (!doctorsRepo.update(req.params.id, input)) throw new HttpError(404, 'Doctor not found', 'NOT_FOUND');
  res.json(doctorsRepo.adminList().find((d) => d.id === req.params.id));
});
// Photo upload: the request body is the image itself (Content-Type: image/jpeg|png|webp).
api.put(
  '/admin/doctors/:id/photo',
  requireRole('admin'),
  express.raw({ type: () => true, limit: PHOTO_MAX_BYTES }),
  (req, res) => {
    if (!doctorsRepo.exists(req.params.id)) throw new HttpError(404, 'Doctor not found', 'NOT_FOUND');
    const data = req.body as Buffer;
    if (!Buffer.isBuffer(data) || data.length === 0) throw new HttpError(400, 'No photo was sent', 'VALIDATION');
    const mime = sniffImageType(data);
    if (!mime) throw new HttpError(400, 'Photo must be a JPEG, PNG or WebP image', 'UNSUPPORTED_IMAGE');
    doctorPhotosRepo.save(req.params.id, mime, data);
    res.json(doctorsRepo.adminList().find((d) => d.id === req.params.id));
  }
);
api.delete('/admin/doctors/:id/photo', requireRole('admin'), (req, res) => {
  if (!doctorsRepo.exists(req.params.id)) throw new HttpError(404, 'Doctor not found', 'NOT_FOUND');
  doctorPhotosRepo.remove(req.params.id);
  res.json(doctorsRepo.adminList().find((d) => d.id === req.params.id));
});
// Archive / restore. Archived doctors are hidden from patients; their existing appointments are kept.
api.patch('/admin/doctors/:id/status', requireRole('admin'), (req, res) => {
  const { active } = (req.body ?? {}) as { active?: unknown };
  if (typeof active !== 'boolean') throw new HttpError(400, '`active` must be true or false', 'VALIDATION');
  if (!doctorsRepo.setActive(req.params.id, active)) throw new HttpError(404, 'Doctor not found', 'NOT_FOUND');
  res.json(doctorsRepo.adminList().find((d) => d.id === req.params.id));
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
