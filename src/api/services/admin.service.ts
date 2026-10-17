import { axiosClient, fakeDelay } from '@/api/client';
import { ADMIN_ENDPOINTS } from '@/api/endpoints';
import { env } from '@/config';
import { mockAdminStats } from '@/data/mock';
import type { AdminStats } from '@/types';

export const adminService = {
  stats: async (): Promise<AdminStats> => {
    if (!env.useMockApi) {
      const { data } = await axiosClient.get<AdminStats>(ADMIN_ENDPOINTS.stats);
      return data;
    }
    return fakeDelay(mockAdminStats, 400);
  },
};
