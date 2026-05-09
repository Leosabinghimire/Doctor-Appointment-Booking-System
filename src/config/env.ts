interface Env {
  apiUrl: string;
  apiTimeout: number;
  useMockApi: boolean;
  mockDelayMs: number;
}

export const env: Env = {
  apiUrl: import.meta.env.VITE_API_URL ?? 'https://api.medicare.example.com/v1',
  apiTimeout: 15_000,
  useMockApi: (import.meta.env.VITE_USE_MOCK ?? 'true') === 'true',
  mockDelayMs: 500,
};
