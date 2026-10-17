import { doctorsRepo } from '../repos/doctors';

/** "2026-10-18" → "Sunday, October 18". Parsed at local noon so the day can't shift across time zones. */
export const formatAppointmentDate = (day: string) =>
  new Date(`${day.slice(0, 10)}T12:00:00`).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

/**
 * Plain-text clinic directory for the Telentir knowledge base, so an inbound
 * agent can answer "which cardiologists do you have?" from real data.
 * Contains no patient information.
 */
export const buildClinicKnowledge = (): string => {
  const doctors = doctorsRepo
    .all()
    .map((d) =>
      [
        `${d.name} — ${d.specialty}`,
        `  Hospital: ${d.hospital}, ${d.city}`,
        `  Qualifications: ${d.qualifications}; ${d.experience} years of experience`,
        `  Consultation fee: $${d.consultationFee}`,
        `  Visit types: ${[d.inPersonConsult && 'in-person', d.videoConsult && 'video'].filter(Boolean).join(', ')}`,
        `  Languages: ${d.languages.join(', ')}`,
        `  Rating: ${d.rating} (${d.reviewCount} reviews)`,
        `  About: ${d.about}`,
      ].join('\n')
    )
    .join('\n\n');

  return [
    'MediCare+ clinic information',
    '',
    'Booking: patients book, cancel and join video consultations in the MediCare+ app (Book Appointment page).',
    'The phone assistant cannot book or change appointments; it can answer questions and request a staff callback.',
    'Emergencies: callers with an emergency must hang up and call their local emergency number.',
    'The phone assistant never gives medical advice.',
    '',
    'Doctors',
    '',
    doctors,
  ].join('\n');
};
