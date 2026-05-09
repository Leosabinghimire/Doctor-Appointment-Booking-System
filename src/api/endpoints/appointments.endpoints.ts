export const APPOINTMENT_ENDPOINTS = {
  list: '/appointments',
  detail: (id: string) => `/appointments/${id}`,
  book: '/appointments',
  cancel: (id: string) => `/appointments/${id}/cancel`,
} as const;
