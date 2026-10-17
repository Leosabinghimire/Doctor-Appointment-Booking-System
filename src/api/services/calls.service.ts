import { axiosClient, fakeDelay } from '@/api/client';
import { CALL_ENDPOINTS } from '@/api/endpoints';
import { env } from '@/config';
import { mockAppointments, mockCallLogs } from '@/data/mock';
import type { CallLog, ReminderCallResult } from '@/types';

let callsStore: CallLog[] = [...mockCallLogs];

export const callsService = {
  list: async (): Promise<CallLog[]> => {
    if (!env.useMockApi) {
      const { data } = await axiosClient.get<CallLog[]>(CALL_ENDPOINTS.list);
      return data;
    }
    return fakeDelay([...callsStore], 350);
  },

  sync: async (): Promise<CallLog[]> => {
    if (!env.useMockApi) {
      const { data } = await axiosClient.post<CallLog[]>(CALL_ENDPOINTS.sync);
      return data;
    }
    return fakeDelay([...callsStore], 600);
  },

  reminderCall: async (appointmentId: string): Promise<ReminderCallResult> => {
    if (!env.useMockApi) {
      const { data } = await axiosClient.post<ReminderCallResult>(CALL_ENDPOINTS.reminder(appointmentId));
      return data;
    }
    const appointment = mockAppointments.find((a) => a.id === appointmentId);
    const now = new Date().toISOString();
    callsStore = [
      {
        id: `c${Date.now()}`,
        provider: 'telentir',
        externalCallId: `demo-${Date.now()}`,
        direction: 'outbound',
        contactName: appointment?.patientName,
        contactPhone: '+1 (555) 234-7890',
        clinicNumber: '+1 (555) 010-0100',
        startedAt: now,
        durationSec: 0,
        status: 'ongoing',
        summary: `Reminder call for ${appointment?.doctorName ?? 'appointment'} (demo mode — no real call placed).`,
        transcript: [],
        appointmentId,
      },
      ...callsStore,
    ];
    return fakeDelay({ placed: true, message: 'Demo mode: reminder call simulated.' }, 700);
  },
};
