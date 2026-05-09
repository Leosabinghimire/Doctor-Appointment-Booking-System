import { fakeDelay } from '@/api/client';
import { mockPatient, mockMedicalHistory } from '@/data/mock';
import type { Patient, MedicalRecord } from '@/types';

export const patientsService = {
  me: async (): Promise<Patient> => {
    // const { data } = await axiosClient.get<Patient>(PATIENT_ENDPOINTS.me);
    // return data;
    return fakeDelay(mockPatient, 250);
  },

  history: async (): Promise<MedicalRecord[]> => {
    // const { data } = await axiosClient.get<MedicalRecord[]>(PATIENT_ENDPOINTS.history);
    // return data;
    return fakeDelay(mockMedicalHistory, 350);
  },
};
