import { env } from '@/config';

export const fakeDelay = <T>(data: T, ms = env.mockDelayMs): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(data), ms));
