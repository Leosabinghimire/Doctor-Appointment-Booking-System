import { SPECIALTIES } from '../../src/constants/specialties';
import type { DoctorInput, DoctorSpecialty } from '../../src/types';
import { HttpError } from './http';

const text = (v: unknown) => (typeof v === 'string' ? v.trim() : '');

/** Missing, null and blank all become NaN (not 0), so they fail validation. */
const num = (v: unknown) =>
  typeof v === 'number' || (typeof v === 'string' && v.trim() !== '') ? Number(v) : NaN;

const isHttpUrl = (v: string) => {
  try {
    const url = new URL(v);
    return url.protocol === 'https:' || url.protocol === 'http:';
  } catch {
    return false;
  }
};

/** Checks an admin's doctor form. Throws 400 listing every problem at once, so the form can show them together. */
export const parseDoctorInput = (body: unknown): DoctorInput => {
  const b = (body ?? {}) as Record<string, unknown>;
  const problems: string[] = [];

  const name = text(b.name);
  const specialty = text(b.specialty) as DoctorSpecialty;
  const qualifications = text(b.qualifications);
  const hospital = text(b.hospital);
  const city = text(b.city);
  const avatar = text(b.avatar);
  const about = text(b.about);
  const experience = num(b.experience);
  const consultationFee = num(b.consultationFee);
  const languages = (Array.isArray(b.languages) ? b.languages : []).map(text).filter(Boolean);
  const videoConsult = b.videoConsult === true;
  const inPersonConsult = b.inPersonConsult === true;

  if (!name) problems.push('Name is required');
  if (name.length > 100) problems.push('Name is too long');
  if (!SPECIALTIES.includes(specialty)) problems.push('Choose a specialty from the list');
  if (!qualifications) problems.push('Qualifications are required');
  if (!hospital) problems.push('Hospital is required');
  if (!city) problems.push('City is required');
  if (!Number.isInteger(experience) || experience < 0 || experience > 70) {
    problems.push('Experience must be a whole number of years between 0 and 70');
  }
  if (!Number.isFinite(consultationFee) || consultationFee < 0 || consultationFee > 10_000) {
    problems.push('Consultation fee must be between 0 and 10,000');
  }
  if (languages.length === 0) problems.push('Add at least one language');
  if (!videoConsult && !inPersonConsult) problems.push('Turn on video, in-person, or both');
  if (avatar && !isHttpUrl(avatar)) problems.push('Photo must be a web address starting with https://');
  if (about.length > 2000) problems.push('About is too long (2,000 characters max)');

  if (problems.length) throw new HttpError(400, problems.join('. '), 'VALIDATION');

  return {
    name,
    specialty,
    qualifications,
    experience,
    consultationFee: Math.round(consultationFee * 100) / 100,
    hospital,
    city,
    avatar,
    about,
    languages,
    videoConsult,
    inPersonConsult,
  };
};
