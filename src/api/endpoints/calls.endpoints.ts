export const CALL_ENDPOINTS = {
  list: '/calls',
  sync: '/calls/sync',
  reminder: (appointmentId: string) => `/appointments/${appointmentId}/reminder-call`,
} as const;
