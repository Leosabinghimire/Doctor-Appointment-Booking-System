import { fakeDelay } from '@/api/client';
import { mockDoctors, mockAvailability } from '@/data/mock';
import type { Doctor, DoctorAvailability, DoctorFilters } from '@/types';

const applyFilters = (list: Doctor[], filters?: DoctorFilters): Doctor[] => {
  let result = [...list];
  if (!filters) return result;

  if (filters.search) {
    const q = filters.search.toLowerCase();
    result = result.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.specialty.toLowerCase().includes(q) ||
        d.hospital.toLowerCase().includes(q)
    );
  }
  if (filters.specialty && filters.specialty !== 'All') {
    result = result.filter((d) => d.specialty === filters.specialty);
  }
  if (filters.city) {
    result = result.filter((d) => d.city === filters.city);
  }
  if (filters.availableToday) {
    result = result.filter((d) => d.availableToday);
  }
  if (filters.videoOnly) {
    result = result.filter((d) => d.videoConsult);
  }
  if (typeof filters.minRating === 'number') {
    result = result.filter((d) => d.rating >= filters.minRating!);
  }
  if (typeof filters.maxFee === 'number') {
    result = result.filter((d) => d.consultationFee <= filters.maxFee!);
  }
  switch (filters.sortBy) {
    case 'rating':
      result.sort((a, b) => b.rating - a.rating);
      break;
    case 'experience':
      result.sort((a, b) => b.experience - a.experience);
      break;
    case 'fee':
      result.sort((a, b) => a.consultationFee - b.consultationFee);
      break;
  }
  return result;
};

export const doctorsService = {
  list: async (filters?: DoctorFilters): Promise<Doctor[]> => {
    // const { data } = await axiosClient.get<Doctor[]>(DOCTOR_ENDPOINTS.list, { params: filters });
    // return data;
    return fakeDelay(applyFilters(mockDoctors, filters), 400);
  },

  get: async (id: string): Promise<Doctor | undefined> => {
    // const { data } = await axiosClient.get<Doctor>(DOCTOR_ENDPOINTS.detail(id));
    // return data;
    return fakeDelay(mockDoctors.find((d) => d.id === id), 300);
  },

  availability: async (id: string): Promise<DoctorAvailability[]> => {
    // const { data } = await axiosClient.get<DoctorAvailability[]>(DOCTOR_ENDPOINTS.availability(id));
    // return data;
    return fakeDelay(mockAvailability(id), 350);
  },
};
