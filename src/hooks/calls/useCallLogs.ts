import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { callsService } from '@/api/services';
import { queryKeys } from '@/lib/queryKeys';

export const useCallLogs = () =>
  useQuery({
    queryKey: queryKeys.calls.list(),
    queryFn: callsService.list,
    refetchInterval: 30_000,
  });

export const useSyncCalls = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: callsService.sync,
    onSuccess: (calls) => qc.setQueryData(queryKeys.calls.list(), calls),
  });
};

export const useReminderCall = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (appointmentId: string) => callsService.reminderCall(appointmentId),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.calls.all }),
  });
};
