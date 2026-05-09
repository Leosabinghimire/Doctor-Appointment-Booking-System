export const PRESCRIPTION_ENDPOINTS = {
  list: '/prescriptions',
  detail: (id: string) => `/prescriptions/${id}`,
  refill: (id: string) => `/prescriptions/${id}/refill`,
} as const;
