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
} from '@mui/icons-material';
import type { ComponentType } from 'react';
import { ROUTES } from '@/constants';

export interface NavItem {
  label: string;
  to: string;
  icon: ComponentType;
  badge?: number;
  group: 'Main' | 'Health' | 'Manage';
}

export const primaryNav: readonly NavItem[] = [
  { label: 'Dashboard', to: ROUTES.dashboard, icon: Dashboard, group: 'Main' },
  { label: 'Find Doctors', to: ROUTES.doctors, icon: PeopleAlt, group: 'Main' },
  { label: 'Book Appointment', to: ROUTES.book, icon: EventAvailable, group: 'Main' },
  { label: 'Appointments', to: ROUTES.appointments, icon: CalendarMonth, group: 'Main' },
  { label: 'Medical History', to: ROUTES.history, icon: History, group: 'Health' },
  { label: 'Prescriptions', to: ROUTES.prescriptions, icon: Medication, group: 'Health' },
  { label: 'Video Consult', to: ROUTES.video, icon: Videocam, group: 'Health' },
  { label: 'Notifications', to: ROUTES.notifications, icon: Notifications, group: 'Health' },
  { label: 'Admin Panel', to: ROUTES.admin, icon: AdminPanelSettings, group: 'Manage' },
] as const;
