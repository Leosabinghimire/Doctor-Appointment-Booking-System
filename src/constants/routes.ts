export const ROUTES = {
  dashboard: '/',
  login: '/login',
  doctors: '/doctors',
  doctorDetail: (id: string = ':id') => `/doctors/${id}`,
  book: '/book',
  bookWithDoctor: (doctorId: string = ':doctorId') => `/book/${doctorId}`,
  appointments: '/appointments',
  history: '/history',
  prescriptions: '/prescriptions',
  video: '/video',
  videoSession: (appointmentId: string = ':appointmentId') => `/video/${appointmentId}`,
  notifications: '/notifications',
  profile: '/profile',
  admin: '/admin',
  calls: '/calls',
  manageDoctors: '/manage-doctors',
  notFound: '/404',
} as const;

export const ROUTE_PATTERNS = {
  doctorDetail: '/doctors/:id',
  bookWithDoctor: '/book/:doctorId',
  videoSession: '/video/:appointmentId',
} as const;
