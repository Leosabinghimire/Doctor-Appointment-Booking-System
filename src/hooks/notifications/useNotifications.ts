import { useQuery } from '@tanstack/react-query';
import { notificationsService } from '@/api/services';
import { queryKeys } from '@/lib/queryKeys';

export const useNotifications = () =>
  useQuery({
    queryKey: queryKeys.notifications.list(),
    queryFn: notificationsService.list,
  });
