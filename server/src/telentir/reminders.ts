import type { Appointment, ReminderCallResult } from '../../../src/types';
import { config } from '../config';
import { appointmentsRepo } from '../repos/appointments';
import { reminderCallsRepo } from '../repos/calls';
import { patientsRepo } from '../repos/patients';
import { samePhone, toE164 } from '../util';
import { HttpError } from '../http';
import { formatAppointmentDate } from './knowledge';
import { getTelentir } from './client';

const buildReminderPrompt = (appointment: Appointment) =>
  [
    `You are the friendly scheduling assistant for MediCare+, calling ${appointment.patientName}.`,
    `Remind them of their ${appointment.type === 'video' ? 'video consultation' : 'in-person visit'} with ${appointment.doctorName} (${appointment.doctorSpecialty}) on ${formatAppointmentDate(appointment.date)} at ${appointment.time}.`,
    appointment.type === 'video'
      ? 'Tell them they can join from the Appointments page in the MediCare+ app a few minutes before the start time.'
      : 'Ask them to arrive 10 minutes early and bring a photo ID.',
    'Ask whether they will attend. If they want to cancel or reschedule, tell them they can do it in the MediCare+ app, or that clinic staff will call them back.',
    'Never give medical advice. If they mention an emergency, tell them to hang up and call their local emergency number.',
    'Keep the call short and polite, then say goodbye.',
  ].join(' ');

export const placeReminderCall = async (appointmentId: string): Promise<ReminderCallResult> => {
  const appointment = appointmentsRepo.get(appointmentId);
  if (!appointment) throw new HttpError(404, 'Appointment not found', 'NOT_FOUND');
  if (appointment.status !== 'upcoming') {
    throw new HttpError(400, 'Reminders can only be sent for upcoming appointments', 'NOT_UPCOMING');
  }
  if (!config.telentir.agentId) {
    throw new HttpError(503, 'Set TELENTIR_AGENT_ID in server/.env to place reminder calls.', 'TELENTIR_NO_AGENT');
  }

  const patient = patientsRepo.get(appointment.patientId);
  if (!patient?.phone) throw new HttpError(400, 'Patient has no phone number on file', 'NO_PHONE');

  const telentir = await getTelentir();
  const phone = toE164(patient.phone);

  // Reuse the Telentir contact for this patient if one exists.
  const contacts = await telentir.contacts.all();
  let contact = contacts.find((c) => samePhone(c.phone, phone));
  if (!contact) {
    const id = await telentir.contacts.create({
      name: patient.name,
      phone,
      email: patient.email,
      tags: ['medicare-patient'],
      status: 'active',
    });
    contact = await telentir.contacts.get(id);
  }

  const agent = await telentir.agents.get(config.telentir.agentId);

  await telentir.sessions.call({
    type: 'prompt',
    prompt: buildReminderPrompt(appointment),
    contact,
    agent,
    knowledgeBase: config.telentir.knowledgeBaseId,
  });

  // Remembered so call sync can link the resulting call back to this appointment.
  reminderCallsRepo.add(appointmentId, phone);
  return { placed: true, message: `Reminder call to ${patient.name} started.` };
};
