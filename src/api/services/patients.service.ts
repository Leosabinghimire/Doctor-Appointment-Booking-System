import { axiosClient, fakeDelay } from '@/api/client';
import { PATIENT_ENDPOINTS } from '@/api/endpoints';
import { env } from '@/config';
import { mockPatient, mockMedicalHistory } from '@/data/mock';
import type { Patient, MedicalRecord } from '@/types';

export const patientsService = {
  me: async (): Promise<Patient> => {
    if (!env.useMockApi) {
      const { data } = await axiosClient.get<Patient>(PATIENT_ENDPOINTS.me);
      return data;
    }
    return fakeDelay(mockPatient, 250);
  },

  history: async (): Promise<MedicalRecord[]> => {
    if (!env.useMockApi) {
      const { data } = await axiosClient.get<MedicalRecord[]>(PATIENT_ENDPOINTS.history);
      return data;
    }
    return fakeDelay(mockMedicalHistory, 350);
  },
};
