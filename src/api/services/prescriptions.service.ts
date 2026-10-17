import { axiosClient, fakeDelay } from '@/api/client';
import { PRESCRIPTION_ENDPOINTS } from '@/api/endpoints';
import { env } from '@/config';
import { mockPrescriptions } from '@/data/mock';
import type { Prescription } from '@/types';

export const prescriptionsService = {
  list: async (): Promise<Prescription[]> => {
    if (!env.useMockApi) {
      const { data } = await axiosClient.get<Prescription[]>(PRESCRIPTION_ENDPOINTS.list);
      return data;
    }
    return fakeDelay(mockPrescriptions, 350);
  },

  get: async (id: string): Promise<Prescription | undefined> => {
    if (!env.useMockApi) {
      const { data } = await axiosClient.get<Prescription>(PRESCRIPTION_ENDPOINTS.detail(id));
      return data;
    }
    return fakeDelay(mockPrescriptions.find((p) => p.id === id), 250);
  },
};
