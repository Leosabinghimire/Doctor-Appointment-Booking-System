import { HttpError } from '../http';

const WINDOW_MS = 15 * 60_000;
const MAX_FAILURES = 5;

const failures = new Map<string, { count: number; resetAt: number }>();

/** Throws 429 if this key (email + IP) has too many recent failed logins. */
export const assertNotLockedOut = (key: string) => {
  const entry = failures.get(key);
  if (entry && entry.resetAt > Date.now() && entry.count >= MAX_FAILURES) {
    const minutes = Math.ceil((entry.resetAt - Date.now()) / 60_000);
    throw new HttpError(429, `Too many failed attempts. Try again in ${minutes} minute(s).`, 'RATE_LIMITED');
  }
};

export const recordFailure = (key: string) => {
  const entry = failures.get(key);
  if (!entry || entry.resetAt <= Date.now()) {
    failures.set(key, { count: 1, resetAt: Date.now() + WINDOW_MS });
  } else {
    entry.count += 1;
  }
};

export const clearFailures = (key: string) => failures.delete(key);
