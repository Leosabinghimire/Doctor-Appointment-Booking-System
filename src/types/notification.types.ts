import type { ID } from './common.types';

export type NotificationType =
  | 'appointment'
  | 'prescription'
  | 'reminder'
  | 'message'
  | 'system';

export interface AppNotification {
  id: ID;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}
