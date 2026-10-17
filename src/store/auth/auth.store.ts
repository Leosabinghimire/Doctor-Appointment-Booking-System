import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthResponse, AuthUser } from '@/types';

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  setSession: (session: AuthResponse) => void;
  setUser: (user: AuthUser | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      setSession: ({ token, user }) => set({ token, user, isAuthenticated: true }),
      setUser: (user) => set({ user }),
      logout: () => set({ user: null, token: null, isAuthenticated: false }),
    }),
    // v2: the old key held a hard-coded demo session.
    { name: 'medicare-auth-v2' }
  )
);
