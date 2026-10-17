import type { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '@/store/auth';
import { queryClient } from '@/lib/queryClient';
import type { ApiError } from '@/types';

const attachAuthToken = (config: InternalAxiosRequestConfig) => {
  const token = useAuthStore.getState().token;
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

const normalizeError = (error: AxiosError<{ message?: string; code?: string }>): Promise<ApiError> => {
  // Expired or invalid session: sign out (RequireAuth then redirects to /login).
  // Skip when not signed in, e.g. a wrong password on the login form.
  if (error.response?.status === 401 && useAuthStore.getState().isAuthenticated) {
    useAuthStore.getState().logout();
    queryClient.clear();
  }
  const apiError: ApiError = {
    status: error.response?.status ?? 0,
    message: error.response?.data?.message ?? error.message ?? 'Unknown error',
    code: error.response?.data?.code,
  };
  return Promise.reject(apiError);
};

export const setupInterceptors = (instance: AxiosInstance): void => {
  instance.interceptors.request.use(attachAuthToken);
  instance.interceptors.response.use(
    (response) => response,
    (error: AxiosError<{ message?: string; code?: string }>) => normalizeError(error)
  );
};
