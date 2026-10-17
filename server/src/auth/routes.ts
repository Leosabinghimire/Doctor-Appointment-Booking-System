import { Router } from 'express';
import type { AuthResponse, LoginPayload, Patient, RegisterPayload } from '../../../src/types';
import { db, newId, samePhone } from '../db';
import { HttpError, asyncHandler } from '../http';
import { currentUser, requireAuth } from './middleware';
import { hashPassword, verifyPassword } from './passwords';
import { assertNotLockedOut, clearFailures, recordFailure } from './rateLimit';
import { signToken } from './tokens';
import { findUserByEmail, normalizeEmail, toAuthUser, users, type UserRecord } from './users';

export const authRoutes = Router();

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 8;

// Compared against when the email doesn't exist, so response time doesn't reveal which emails are registered.
const DUMMY_HASH = hashPassword('not-a-real-password');

const respond = async (user: UserRecord): Promise<AuthResponse> => ({
  token: await signToken({ sub: user.id, role: user.role }),
  user: toAuthUser(user),
});

authRoutes.post(
  '/auth/login',
  asyncHandler(async (req, res) => {
    const { email, password } = (req.body ?? {}) as Partial<LoginPayload>;
    if (typeof email !== 'string' || typeof password !== 'string' || !email || !password) {
      throw new HttpError(400, 'Email and password are required', 'VALIDATION');
    }

    const key = `${normalizeEmail(email)}|${req.ip}`;
    assertNotLockedOut(key);

    const user = findUserByEmail(email);
    const ok = await verifyPassword(password, user?.passwordHash ?? (await DUMMY_HASH));
    if (!user || !ok) {
      recordFailure(key);
      throw new HttpError(401, 'Incorrect email or password', 'INVALID_CREDENTIALS');
    }

    clearFailures(key);
    res.json(await respond(user));
  })
);

authRoutes.post(
  '/auth/register',
  asyncHandler(async (req, res) => {
    const { name, email, phone, password } = (req.body ?? {}) as Partial<RegisterPayload>;
    if (!name?.trim() || !email || !phone?.trim() || !password) {
      throw new HttpError(400, 'Name, email, phone and password are required', 'VALIDATION');
    }
    if (!EMAIL_RE.test(email)) throw new HttpError(400, 'Please enter a valid email address', 'VALIDATION');
    if (password.length < MIN_PASSWORD_LENGTH) {
      throw new HttpError(400, `Password must be at least ${MIN_PASSWORD_LENGTH} characters`, 'VALIDATION');
    }
    if (findUserByEmail(email)) {
      throw new HttpError(409, 'An account with this email already exists', 'EMAIL_TAKEN');
    }
    if (db.patients.some((p) => samePhone(p.phone, phone))) {
      throw new HttpError(409, 'An account with this phone number already exists', 'PHONE_TAKEN');
    }

    const patient: Patient = {
      id: newId('p'),
      name: name.trim(),
      email: normalizeEmail(email),
      phone: phone.trim(),
      avatar: '',
      // Health details stay empty until the patient provides them.
      allergies: [],
      chronicConditions: [],
      emergencyContact: { name: '', relation: '', phone: '' },
    };
    db.patients.push(patient);

    const user: UserRecord = {
      id: newId('u'),
      email: patient.email,
      name: patient.name,
      role: 'patient',
      patientId: patient.id,
      passwordHash: await hashPassword(password),
    };
    users.push(user);

    res.status(201).json(await respond(user));
  })
);

authRoutes.get('/auth/me', requireAuth, (req, res) => {
  res.json(toAuthUser(currentUser(req)));
});
