import type { ID } from './common.types';

export interface WeeklyAppointmentPoint {
  day: string;
  count: number;
}

export interface SpecialtyDistributionPoint {
  name: string;
  value: number;
}

export interface RecentSignup {
  id: ID;
  name: string;
  role: 'Patient' | 'Doctor';
  date: string;
}

export interface AdminStats {
  totalPatients: number;
  totalDoctors: number;
  appointmentsToday: number;
  revenueThisMonth: number;
  weeklyAppointments: WeeklyAppointmentPoint[];
  specialtyDistribution: SpecialtyDistributionPoint[];
  recentSignups: RecentSignup[];
}
