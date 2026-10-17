import { axiosClient, fakeDelay } from '@/api/client';
import { ADMIN_ENDPOINTS } from '@/api/endpoints';
import { env } from '@/config';
import { mockAdminStats, mockDoctors } from '@/data/mock';
import type { AdminDoctor, AdminStats, DoctorInput } from '@/types';

// Mock mode only: an in-memory copy so add/edit/archive work without a backend.
let doctorsStore: AdminDoctor[] = mockDoctors.map((d) => ({
  ...d,
  active: true,
  upcomingAppointments: 0,
  hasUploadedPhoto: false,
}));

const readAsDataUrl = (blob: Blob) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });

export const adminService = {
  stats: async (): Promise<AdminStats> => {
    if (!env.useMockApi) {
      const { data } = await axiosClient.get<AdminStats>(ADMIN_ENDPOINTS.stats);
      return data;
    }
    return fakeDelay(mockAdminStats, 400);
  },

  listDoctors: async (): Promise<AdminDoctor[]> => {
    if (!env.useMockApi) {
      const { data } = await axiosClient.get<AdminDoctor[]>(ADMIN_ENDPOINTS.doctors);
      return data;
    }
    return fakeDelay([...doctorsStore], 300);
  },

  createDoctor: async (input: DoctorInput): Promise<AdminDoctor> => {
    if (!env.useMockApi) {
      const { data } = await axiosClient.post<AdminDoctor>(ADMIN_ENDPOINTS.doctors, input);
      return data;
    }
    const doctor: AdminDoctor = {
      ...input,
      id: `d${Date.now()}`,
      rating: 0,
      reviewCount: 0,
      availableToday: false,
      nextSlot: '',
      active: true,
      upcomingAppointments: 0,
      hasUploadedPhoto: false,
    };
    doctorsStore = [...doctorsStore, doctor];
    return fakeDelay(doctor, 400);
  },

  updateDoctor: async (id: string, input: DoctorInput): Promise<AdminDoctor> => {
    if (!env.useMockApi) {
      const { data } = await axiosClient.put<AdminDoctor>(ADMIN_ENDPOINTS.doctor(id), input);
      return data;
    }
    doctorsStore = doctorsStore.map((d) => (d.id === id ? { ...d, ...input } : d));
    return fakeDelay(doctorsStore.find((d) => d.id === id)!, 400);
  },

  /** Uploads a photo (already resized in the browser). It replaces any pasted photo link. */
  uploadDoctorPhoto: async (id: string, photo: Blob): Promise<AdminDoctor> => {
    if (!env.useMockApi) {
      const { data } = await axiosClient.put<AdminDoctor>(ADMIN_ENDPOINTS.doctorPhoto(id), photo, {
        headers: { 'Content-Type': photo.type },
      });
      return data;
    }
    const avatar = await readAsDataUrl(photo);
    doctorsStore = doctorsStore.map((d) => (d.id === id ? { ...d, avatar, hasUploadedPhoto: true } : d));
    return fakeDelay(doctorsStore.find((d) => d.id === id)!, 400);
  },

  removeDoctorPhoto: async (id: string): Promise<AdminDoctor> => {
    if (!env.useMockApi) {
      const { data } = await axiosClient.delete<AdminDoctor>(ADMIN_ENDPOINTS.doctorPhoto(id));
      return data;
    }
    doctorsStore = doctorsStore.map((d) => (d.id === id ? { ...d, avatar: '', hasUploadedPhoto: false } : d));
    return fakeDelay(doctorsStore.find((d) => d.id === id)!, 300);
  },

  setDoctorActive: async (id: string, active: boolean): Promise<AdminDoctor> => {
    if (!env.useMockApi) {
      const { data } = await axiosClient.patch<AdminDoctor>(ADMIN_ENDPOINTS.doctorStatus(id), { active });
      return data;
    }
    doctorsStore = doctorsStore.map((d) => (d.id === id ? { ...d, active } : d));
    return fakeDelay(doctorsStore.find((d) => d.id === id)!, 300);
  },
};
