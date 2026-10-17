import { axiosClient, fakeDelay } from '@/api/client';
import { NOTIFICATION_ENDPOINTS } from '@/api/endpoints';
import { env } from '@/config';
import { mockNotifications } from '@/data/mock';
import type { AppNotification } from '@/types';

let notificationsStore: AppNotification[] = [...mockNotifications];

export const notificationsService = {
  list: async (): Promise<AppNotification[]> => {
    if (!env.useMockApi) {
      const { data } = await axiosClient.get<AppNotification[]>(NOTIFICATION_ENDPOINTS.list);
      return data;
    }
    return fakeDelay([...notificationsStore], 250);
  },

  markRead: async (id: string): Promise<void> => {
    if (!env.useMockApi) {
      await axiosClient.post(NOTIFICATION_ENDPOINTS.markRead(id));
      return;
    }
    notificationsStore = notificationsStore.map((n) =>
      n.id === id ? { ...n, read: true } : n
    );
    return fakeDelay(undefined, 150);
  },

  markAllRead: async (): Promise<void> => {
    if (!env.useMockApi) {
      await axiosClient.post(NOTIFICATION_ENDPOINTS.markAllRead);
      return;
    }
    notificationsStore = notificationsStore.map((n) => ({ ...n, read: true }));
    return fakeDelay(undefined, 200);
  },
};
