import { useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationsService } from '@/api/services';
import { queryKeys } from '@/lib/queryKeys';

export const useMarkAllNotificationsRead = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: notificationsService.markAllRead,
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.notifications.all }),
  });
};
