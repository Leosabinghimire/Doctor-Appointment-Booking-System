import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authService } from '@/api/services';
import { useAuthStore } from '@/store/auth';
import type { LoginPayload, RegisterPayload } from '@/types';

export const useLogin = () => {
  const setSession = useAuthStore((s) => s.setSession);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: LoginPayload) => authService.login(payload),
    onSuccess: (session) => {
      qc.clear();
      setSession(session);
    },
  });
};

export const useRegister = () => {
  const setSession = useAuthStore((s) => s.setSession);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: RegisterPayload) => authService.register(payload),
    onSuccess: (session) => {
      qc.clear();
      setSession(session);
    },
  });
};

/** Signs out and drops all cached data so the next user never sees the previous user's records. */
export const useLogout = () => {
  const logout = useAuthStore((s) => s.logout);
  const qc = useQueryClient();
  return () => {
    logout();
    qc.clear();
  };
};
