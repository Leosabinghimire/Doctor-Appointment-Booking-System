import { fakeDelay } from '@/api/client';
import { mockAppointments, mockDoctors } from '@/data/mock';
import type { Appointment, BookingPayload } from '@/types';

let appointmentsStore: Appointment[] = [...mockAppointments];

export const appointmentsService = {
  list: async (): Promise<Appointment[]> => {
    // const { data } = await axiosClient.get<Appointment[]>(APPOINTMENT_ENDPOINTS.list);
    // return data;
    return fakeDelay([...appointmentsStore], 350);
  },

  get: async (id: string): Promise<Appointment | undefined> => {
    // const { data } = await axiosClient.get<Appointment>(APPOINTMENT_ENDPOINTS.detail(id));
    // return data;
    return fakeDelay(appointmentsStore.find((a) => a.id === id), 250);
  },

  book: async (payload: BookingPayload): Promise<Appointment> => {
    // const { data } = await axiosClient.post<Appointment>(APPOINTMENT_ENDPOINTS.book, payload);
    // return data;
    const doctor = mockDoctors.find((d) => d.id === payload.doctorId);
    const newAppointment: Appointment = {
      id: `a${Date.now()}`,
      doctorId: payload.doctorId,
      doctorName: doctor?.name ?? '—',
      doctorSpecialty: doctor?.specialty ?? '—',
      doctorAvatar: doctor?.avatar ?? '',
      patientId: 'p1',
      patientName: payload.patientName,
      date: payload.date,
      time: payload.time,
      type: payload.type,
      status: 'upcoming',
      reason: payload.reason,
      fee: doctor?.consultationFee ?? 0,
      meetingLink: payload.type === 'video' ? `https://meet.medicare.io/${Date.now()}` : undefined,
    };
    appointmentsStore = [newAppointment, ...appointmentsStore];
    return fakeDelay(newAppointment, 700);
  },

  cancel: async (id: string): Promise<Appointment | undefined> => {
    // const { data } = await axiosClient.post<Appointment>(APPOINTMENT_ENDPOINTS.cancel(id));
    // return data;
    appointmentsStore = appointmentsStore.map((a) =>
      a.id === id ? { ...a, status: 'cancelled' as const } : a
    );
    return fakeDelay(appointmentsStore.find((a) => a.id === id), 400);
  },
};
