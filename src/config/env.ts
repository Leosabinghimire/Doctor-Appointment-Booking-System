interface Env {
  apiUrl: string;
  apiTimeout: number;
  useMockApi: boolean;
  mockDelayMs: number;
}

export const env: Env = {
  apiUrl: import.meta.env.VITE_API_URL ?? 'http://localhost:4000/v1',
  apiTimeout: 15_000,
  useMockApi: (import.meta.env.VITE_USE_MOCK ?? 'true') === 'true',
  mockDelayMs: 500,
};
