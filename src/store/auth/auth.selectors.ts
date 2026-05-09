import { useAuthStore } from './auth.store';

export const useCurrentUser = () => useAuthStore((s) => s.user);
export const useUserRole = () => useAuthStore((s) => s.role);
export const useIsAuthenticated = () => useAuthStore((s) => s.isAuthenticated);
export const useAuthToken = () => useAuthStore((s) => s.token);
