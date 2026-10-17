import { axiosClient, fakeDelay } from '@/api/client';
import { AUTH_ENDPOINTS } from '@/api/endpoints';
import { env } from '@/config';
import { mockPatient } from '@/data/mock';
import type { ApiError, AuthResponse, AuthUser, LoginPayload, RegisterPayload } from '@/types';

/** Mock mode only — same demo accounts the dev backend seeds. Never used against the real API. */
const MOCK_ACCOUNTS: (AuthUser & { password: string })[] = [
  {
    id: 'u-patient',
    email: mockPatient.email,
    name: mockPatient.name,
    role: 'patient',
    patientId: mockPatient.id,
    avatar: mockPatient.avatar,
    phone: mockPatient.phone,
    password: 'patient-dev-password',
  },
  {
    id: 'u-admin',
    email: 'admin@medicare.example',
    name: 'Clinic Admin',
    role: 'admin',
    password: 'admin-dev-password',
  },
];

const mockError = (status: number, message: string): ApiError => ({ status, message });

export const authService = {
  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    if (!env.useMockApi) {
      const { data } = await axiosClient.post<AuthResponse>(AUTH_ENDPOINTS.login, payload);
      return data;
    }
    const account = MOCK_ACCOUNTS.find(
      (a) => a.email === payload.email.trim().toLowerCase() && a.password === payload.password
    );
    if (!account) throw mockError(401, 'Incorrect email or password');
    const { password: _, ...user } = account;
    return fakeDelay({ token: `mock-${user.id}`, user }, 500);
  },

  register: async (payload: RegisterPayload): Promise<AuthResponse> => {
    if (!env.useMockApi) {
      const { data } = await axiosClient.post<AuthResponse>(AUTH_ENDPOINTS.register, payload);
      return data;
    }
    const user: AuthUser = {
      id: `u${Date.now()}`,
      email: payload.email.trim().toLowerCase(),
      name: payload.name.trim(),
      role: 'patient',
      patientId: mockPatient.id,
      phone: payload.phone,
    };
    return fakeDelay({ token: `mock-${user.id}`, user }, 600);
  },

  me: async (): Promise<AuthUser> => {
    const { data } = await axiosClient.get<AuthUser>(AUTH_ENDPOINTS.me);
    return data;
  },
};
