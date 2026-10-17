import type { DoctorFilters } from '@/types';

export const queryKeys = {
  doctors: {
    all: ['doctors'] as const,
    lists: () => [...queryKeys.doctors.all, 'list'] as const,
    list: (filters?: DoctorFilters) => [...queryKeys.doctors.lists(), filters ?? {}] as const,
    details: () => [...queryKeys.doctors.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.doctors.details(), id] as const,
    availability: (id: string) => [...queryKeys.doctors.detail(id), 'availability'] as const,
  },
  appointments: {
    all: ['appointments'] as const,
    list: () => [...queryKeys.appointments.all, 'list'] as const,
    detail: (id: string) => [...queryKeys.appointments.all, 'detail', id] as const,
  },
  patients: {
    all: ['patients'] as const,
    me: () => [...queryKeys.patients.all, 'me'] as const,
    history: (id: string = 'me') => [...queryKeys.patients.all, id, 'history'] as const,
  },
  prescriptions: {
    all: ['prescriptions'] as const,
    list: () => [...queryKeys.prescriptions.all, 'list'] as const,
    detail: (id: string) => [...queryKeys.prescriptions.all, 'detail', id] as const,
  },
  notifications: {
    all: ['notifications'] as const,
    list: () => [...queryKeys.notifications.all, 'list'] as const,
  },
  admin: {
    all: ['admin'] as const,
    stats: () => [...queryKeys.admin.all, 'stats'] as const,
    doctors: () => [...queryKeys.admin.all, 'doctors'] as const,
    doctorSchedule: (id: string) => [...queryKeys.admin.all, 'doctors', id, 'schedule'] as const,
  },
  calls: {
    all: ['calls'] as const,
    list: () => [...queryKeys.calls.all, 'list'] as const,
  },
} as const;
