import type { ReactNode } from 'react';
import { Air, Bloodtype, Favorite, MonitorHeart } from '@mui/icons-material';
import React from 'react';

export interface VitalEntry {
  label: string;
  value: string;
  unit: string;
  status: string;
  color: 'primary' | 'error' | 'info' | 'warning' | 'success' | 'secondary';
  icon: ReactNode;
}

export const heartRateSeries = [
  { day: 'Mon', value: 72 },
  { day: 'Tue', value: 78 },
  { day: 'Wed', value: 74 },
  { day: 'Thu', value: 81 },
  { day: 'Fri', value: 70 },
  { day: 'Sat', value: 76 },
  { day: 'Sun', value: 73 },
];

export const vitals: VitalEntry[] = [
  { label: 'Heart rate', value: '74', unit: 'bpm', icon: React.createElement(MonitorHeart), color: 'primary', status: 'Normal' },
  { label: 'Blood pressure', value: '118/76', unit: 'mmHg', icon: React.createElement(Favorite), color: 'primary', status: 'Optimal' },
  { label: 'Oxygen', value: '98', unit: '%', icon: React.createElement(Air), color: 'primary', status: 'Healthy' },
  { label: 'Glucose', value: '94', unit: 'mg/dL', icon: React.createElement(Bloodtype), color: 'primary', status: 'Stable' },
];
