import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { mockPatient } from '@/data/mock';
import type { Patient, UserRole } from '@/types';

interface AuthState {
  user: Patient | null;
  role: UserRole;
  token: string | null;
  isAuthenticated: boolean;
  setRole: (role: UserRole) => void;
  setUser: (user: Patient | null) => void;
  setToken: (token: string | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: mockPatient,
      role: 'patient',
      token: 'demo-token',
      isAuthenticated: true,
      setRole: (role) => set({ role }),
      setUser: (user) => set({ user }),
      setToken: (token) => set({ token, isAuthenticated: Boolean(token) }),
      logout: () => set({ user: null, token: null, isAuthenticated: false }),
    }),
    { name: 'medicare-auth' }
  )
);
