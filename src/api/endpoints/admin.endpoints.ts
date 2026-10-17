export const ADMIN_ENDPOINTS = {
  stats: '/admin/stats',
  users: '/admin/users',
  doctors: '/admin/doctors',
  doctor: (id: string) => `/admin/doctors/${id}`,
  doctorStatus: (id: string) => `/admin/doctors/${id}/status`,
} as const;
