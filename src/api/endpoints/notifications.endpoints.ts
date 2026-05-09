export const NOTIFICATION_ENDPOINTS = {
  list: '/notifications',
  markRead: (id: string) => `/notifications/${id}/read`,
  markAllRead: '/notifications/read-all',
} as const;
