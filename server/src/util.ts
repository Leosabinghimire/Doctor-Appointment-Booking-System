export const newId = (prefix: string) =>
  `${prefix}${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;

const digits = (s: string) => s.replace(/\D/g, '');

/** Last 10 digits — how phone numbers are compared and indexed, ignoring formatting and country code. */
export const phoneKey = (phone: string) => digits(phone).slice(-10);

export const samePhone = (a: string, b: string) => {
  const key = phoneKey(a);
  return key.length > 0 && key === phoneKey(b);
};

/** "+1 (555) 234-7890" → "+15552347890" */
export const toE164 = (phone: string) => `+${digits(phone)}`;

const pad = (n: number) => String(n).padStart(2, '0');

/** Calendar day in the server's local time zone, as "YYYY-MM-DD". */
export const localDay = (d: Date = new Date()) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

export const addDays = (day: string, n: number) => {
  const [y, m, d] = day.split('-').map(Number);
  return localDay(new Date(y, m - 1, d + n));
};

export const weekdayOf = (day: string) => {
  const [y, m, d] = day.split('-').map(Number);
  return new Date(y, m - 1, d).getDay(); // 0 = Sunday
};

/** "02:30 PM" → 870 */
export const minutesOf = (time: string) => {
  const [, h, m, ampm] = time.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i) ?? [];
  if (!h) return 0;
  return ((Number(h) % 12) + (ampm.toUpperCase() === 'PM' ? 12 : 0)) * 60 + Number(m);
};
