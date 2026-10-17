export const ADMIN_ENDPOINTS = {
  stats: '/admin/stats',
  users: '/admin/users',
  doctors: '/admin/doctors',
  doctor: (id: string) => `/admin/doctors/${id}`,
  doctorStatus: (id: string) => `/admin/doctors/${id}/status`,
  doctorPhoto: (id: string) => `/admin/doctors/${id}/photo`,
  doctorSchedule: (id: string) => `/admin/doctors/${id}/schedule`,
  doctorTimeOff: (id: string) => `/admin/doctors/${id}/time-off`,
  doctorTimeOffEntry: (id: string, timeOffId: string) => `/admin/doctors/${id}/time-off/${timeOffId}`,
} as const;
