import { alpha, type PaletteOptions } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Palette {
    gradient: {
      primary: string;
      success: string;
      warning: string;
      info: string;
    };
  }
  interface PaletteOptions {
    gradient?: {
      primary: string;
      success: string;
      warning: string;
      info: string;
    };
  }
}

export const lightPalette: PaletteOptions = {
  mode: 'light',
  primary: {
    main: '#4338CA',
    light: '#6366F1',
    dark: '#3730A3',
    contrastText: '#fff',
  },
  secondary: {
    main: '#64748B',
    light: '#94A3B8',
    dark: '#475569',
    contrastText: '#fff',
  },
  success: { main: '#059669', light: '#10B981', dark: '#047857' },
  warning: { main: '#D97706', light: '#F59E0B', dark: '#B45309' },
  error: { main: '#DC2626', light: '#EF4444', dark: '#B91C1C' },
  info: { main: '#4F46E5', light: '#6366F1', dark: '#4338CA' },
  background: {
    default: '#F8FAFC',
    paper: '#FFFFFF',
  },
  text: {
    primary: '#0F172A',
    secondary: '#64748B',
  },
  divider: '#E2E8F0',
  gradient: {
    primary: 'linear-gradient(135deg, #3730A3 0%, #6366F1 100%)',
    success: 'linear-gradient(135deg, #047857 0%, #10B981 100%)',
    warning: 'linear-gradient(135deg, #B45309 0%, #F59E0B 100%)',
    info: 'linear-gradient(135deg, #4338CA 0%, #6366F1 100%)',
  },
};

export const darkPalette: PaletteOptions = {
  mode: 'dark',
  primary: {
    main: '#818CF8',
    light: '#A5B4FC',
    dark: '#6366F1',
    contrastText: '#0B1220',
  },
  secondary: {
    main: '#94A3B8',
    light: '#CBD5E1',
    dark: '#64748B',
    contrastText: '#0B1220',
  },
  success: { main: '#34D399', light: '#6EE7B7', dark: '#059669' },
  warning: { main: '#FBBF24', light: '#FCD34D', dark: '#D97706' },
  error: { main: '#F87171', light: '#FCA5A5', dark: '#DC2626' },
  info: { main: '#A5B4FC', light: '#C7D2FE', dark: '#818CF8' },
  background: {
    default: '#0B1220',
    paper: '#111A2E',
  },
  text: {
    primary: '#E2E8F0',
    secondary: '#94A3B8',
  },
  divider: alpha('#94A3B8', 0.12),
  gradient: {
    primary: 'linear-gradient(135deg, #6366F1 0%, #A5B4FC 100%)',
    success: 'linear-gradient(135deg, #059669 0%, #34D399 100%)',
    warning: 'linear-gradient(135deg, #D97706 0%, #FBBF24 100%)',
    info: 'linear-gradient(135deg, #4F46E5 0%, #A5B4FC 100%)',
  },
};
