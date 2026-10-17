import { format, formatDistanceToNow, parseISO, isValid } from 'date-fns';

export const formatDate = (date: string | Date, pattern = 'MMM dd, yyyy'): string => {
  try {
    const d = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(d)) return '—';
    return format(d, pattern);
  } catch {
    return '—';
  }
};

export const formatTime = (date: string | Date): string => formatDate(date, 'h:mm a');

export const formatDateTime = (date: string | Date): string =>
  formatDate(date, 'MMM dd, yyyy • h:mm a');

export const formatRelative = (date: string | Date): string => {
  try {
    const d = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(d)) return '—';
    return formatDistanceToNow(d, { addSuffix: true });
  } catch {
    return '—';
  }
};

/** "178 cm" or "Not set" for missing optional values. */
export const withUnit = (value: number | string | undefined, unit = ''): string =>
  value === undefined || value === '' ? 'Not set' : `${value}${unit ? ` ${unit}` : ''}`;

export const formatCurrency = (amount: number, currency = 'USD'): string =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount);

export const initials = (name: string): string =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('');
