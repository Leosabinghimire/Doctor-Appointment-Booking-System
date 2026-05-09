import { useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationsService } from '@/api/services';
import { queryKeys } from '@/lib/queryKeys';

export const useMarkNotificationRead = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => notificationsService.markRead(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.notifications.all }),
  });
};
