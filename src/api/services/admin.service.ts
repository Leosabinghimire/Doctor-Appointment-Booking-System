import { fakeDelay } from '@/api/client';
import { mockAdminStats } from '@/data/mock';
import type { AdminStats } from '@/types';

export const adminService = {
  stats: async (): Promise<AdminStats> => {
    // const { data } = await axiosClient.get<AdminStats>(ADMIN_ENDPOINTS.stats);
    // return data;
    return fakeDelay(mockAdminStats, 400);
  },
};
