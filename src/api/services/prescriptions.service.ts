import { fakeDelay } from '@/api/client';
import { mockPrescriptions } from '@/data/mock';
import type { Prescription } from '@/types';

export const prescriptionsService = {
  list: async (): Promise<Prescription[]> => {
    // const { data } = await axiosClient.get<Prescription[]>(PRESCRIPTION_ENDPOINTS.list);
    // return data;
    return fakeDelay(mockPrescriptions, 350);
  },

  get: async (id: string): Promise<Prescription | undefined> => {
    // const { data } = await axiosClient.get<Prescription>(PRESCRIPTION_ENDPOINTS.detail(id));
    // return data;
    return fakeDelay(mockPrescriptions.find((p) => p.id === id), 250);
  },
};
