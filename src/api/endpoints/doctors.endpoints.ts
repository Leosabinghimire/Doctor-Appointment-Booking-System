export const DOCTOR_ENDPOINTS = {
  list: '/doctors',
  detail: (id: string) => `/doctors/${id}`,
  availability: (id: string) => `/doctors/${id}/availability`,
} as const;
