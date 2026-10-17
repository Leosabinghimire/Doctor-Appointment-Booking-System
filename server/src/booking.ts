import type { Appointment, BookingPayload } from '../../src/types';
import { CURRENT_PATIENT_ID, db, newId, samePhone } from './db';
import { HttpError } from './http';

const sameDay = (a: string, b: string) => a.slice(0, 10) === b.slice(0, 10);

export const bookAppointment = (payload: BookingPayload): Appointment => {
  const doctor = db.doctors.find((d) => d.id === payload.doctorId);
  if (!doctor) throw new HttpError(404, 'Doctor not found', 'DOCTOR_NOT_FOUND');

  if (payload.type === 'video' && !doctor.videoConsult) {
    throw new HttpError(400, `${doctor.name} does not offer video consultations`, 'TYPE_UNAVAILABLE');
  }
  if (payload.type === 'in-person' && !doctor.inPersonConsult) {
    throw new HttpError(400, `${doctor.name} does not offer in-person visits`, 'TYPE_UNAVAILABLE');
  }

  const day = db.availability.get(doctor.id)?.find((d) => sameDay(d.date, payload.date));
  const slot = day?.slots.find((s) => s.id === payload.slotId);
  if (!day || !slot) throw new HttpError(404, 'Time slot not found', 'SLOT_NOT_FOUND');
  if (!slot.available) throw new HttpError(409, 'That time slot was just taken', 'SLOT_TAKEN');

  slot.available = false;

  const patient = db.patients.find((p) => samePhone(p.phone, payload.patientPhone));
  const appointment: Appointment = {
    id: newId('a'),
    doctorId: doctor.id,
    doctorName: doctor.name,
    doctorSpecialty: doctor.specialty,
    doctorAvatar: doctor.avatar,
    patientId: patient?.id ?? CURRENT_PATIENT_ID,
    patientName: payload.patientName,
    date: day.date,
    time: slot.time,
    type: payload.type,
    status: 'upcoming',
    reason: payload.reason,
    fee: doctor.consultationFee,
    meetingLink: payload.type === 'video' ? `https://meet.medicare.io/${Date.now()}` : undefined,
  };
  db.appointments.unshift(appointment);

  db.notifications.unshift({
    id: newId('n'),
    type: 'appointment',
    title: 'Appointment confirmed',
    message: `${appointment.type === 'video' ? 'Video consult' : 'Visit'} with ${doctor.name} at ${slot.time}.`,
    timestamp: new Date().toISOString(),
    read: false,
    actionUrl: '/appointments',
  });

  return appointment;
};

export const cancelAppointment = (id: string): Appointment => {
  const appointment = db.appointments.find((a) => a.id === id);
  if (!appointment) throw new HttpError(404, 'Appointment not found', 'APPOINTMENT_NOT_FOUND');
  if (appointment.status !== 'upcoming') {
    throw new HttpError(400, 'Only upcoming appointments can be cancelled', 'NOT_CANCELLABLE');
  }
  appointment.status = 'cancelled';

  // Free the slot again so someone else can take it.
  const day = db.availability.get(appointment.doctorId)?.find((d) => sameDay(d.date, appointment.date));
  const slot = day?.slots.find((s) => s.time === appointment.time);
  if (slot) slot.available = true;

  return appointment;
};
