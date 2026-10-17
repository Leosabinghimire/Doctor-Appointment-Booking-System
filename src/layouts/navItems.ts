import {
  Dashboard,
  PeopleAlt,
  CalendarMonth,
  History,
  Medication,
  Videocam,
  Notifications,
  AdminPanelSettings,
  EventAvailable,
  PhoneInTalk,
  MedicalServices,
} from '@mui/icons-material';
import type { ComponentType } from 'react';
import { ROUTES } from '@/constants';
import type { UserRole } from '@/types';

export interface NavItem {
  label: string;
  to: string;
  icon: ComponentType;
  badge?: number;
  group: 'Main' | 'Health' | 'Manage';
  /** Who sees this link. Omitted = everyone. */
  roles?: UserRole[];
}

export const primaryNav: readonly NavItem[] = [
  { label: 'Dashboard', to: ROUTES.dashboard, icon: Dashboard, group: 'Main', roles: ['patient'] },
  { label: 'Find Doctors', to: ROUTES.doctors, icon: PeopleAlt, group: 'Main' },
  { label: 'Book Appointment', to: ROUTES.book, icon: EventAvailable, group: 'Main' },
  { label: 'Appointments', to: ROUTES.appointments, icon: CalendarMonth, group: 'Main' },
  { label: 'Medical History', to: ROUTES.history, icon: History, group: 'Health', roles: ['patient'] },
  { label: 'Prescriptions', to: ROUTES.prescriptions, icon: Medication, group: 'Health', roles: ['patient'] },
  { label: 'Video Consult', to: ROUTES.video, icon: Videocam, group: 'Health', roles: ['patient'] },
  { label: 'Notifications', to: ROUTES.notifications, icon: Notifications, group: 'Health', roles: ['patient'] },
  { label: 'Admin Panel', to: ROUTES.admin, icon: AdminPanelSettings, group: 'Manage', roles: ['admin'] },
  { label: 'Manage Doctors', to: ROUTES.manageDoctors, icon: MedicalServices, group: 'Manage', roles: ['admin'] },
  { label: 'Call Logs', to: ROUTES.calls, icon: PhoneInTalk, group: 'Manage', roles: ['admin'] },
] as const;
