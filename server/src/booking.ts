import type { Appointment, BookingPayload } from '../../src/types';
import { isUniqueViolation, sql } from './db/connection';
import { HttpError } from './http';
import { appointmentsRepo, findSlot } from './repos/appointments';
import { doctorsRepo } from './repos/doctors';
import { notificationsRepo } from './repos/records';
import { newId } from './util';

/** The one booking path for everyone. Runs in a transaction; the database rejects double bookings. */
export const bookAppointment = (payload: BookingPayload, patientId: string): Appointment =>
  sql.transaction(() => {
    const doctor = doctorsRepo.get(payload.doctorId);
    if (!doctor) throw new HttpError(404, 'Doctor not found', 'DOCTOR_NOT_FOUND');

    if (payload.type === 'video' && !doctor.videoConsult) {
      throw new HttpError(400, `${doctor.name} does not offer video consultations`, 'TYPE_UNAVAILABLE');
    }
    if (payload.type === 'in-person' && !doctor.inPersonConsult) {
      throw new HttpError(400, `${doctor.name} does not offer in-person visits`, 'TYPE_UNAVAILABLE');
    }

    const day = payload.date.slice(0, 10);
    const slot = findSlot(doctor.id, day, payload.slotId);
    if (!slot) throw new HttpError(404, 'Time slot not found', 'SLOT_NOT_FOUND');
    if (!slot.available) throw new HttpError(409, 'That time slot is no longer available', 'SLOT_TAKEN');

    const id = newId('a');
    try {
      appointmentsRepo.insert({
        id,
        doctorId: doctor.id,
        patientId,
        patientName: payload.patientName,
        day,
        time: slot.time,
        type: payload.type,
        status: 'upcoming',
        reason: payload.reason,
        fee: doctor.consultationFee,
        meetingLink: payload.type === 'video' ? `https://meet.medicare.io/${id}` : undefined,
      });
    } catch (err) {
      if (isUniqueViolation(err)) throw new HttpError(409, 'That time slot was just taken', 'SLOT_TAKEN');
      throw err;
    }

    notificationsRepo.insert(patientId, {
      id: newId('n'),
      type: 'appointment',
      title: 'Appointment confirmed',
      message: `${payload.type === 'video' ? 'Video consult' : 'Visit'} with ${doctor.name} at ${slot.time}.`,
      timestamp: new Date().toISOString(),
      read: false,
      actionUrl: '/appointments',
    });

    return appointmentsRepo.get(id)!;
  })();

export const cancelAppointment = (id: string): Appointment => {
  const appointment = appointmentsRepo.get(id);
  if (!appointment) throw new HttpError(404, 'Appointment not found', 'APPOINTMENT_NOT_FOUND');
  if (appointment.status !== 'upcoming') {
    throw new HttpError(400, 'Only upcoming appointments can be cancelled', 'NOT_CANCELLABLE');
  }
  // Cancelled appointments drop out of the one-booking-per-slot index, so the slot frees up automatically.
  appointmentsRepo.setStatus(id, 'cancelled');
  return { ...appointment, status: 'cancelled' };
};
