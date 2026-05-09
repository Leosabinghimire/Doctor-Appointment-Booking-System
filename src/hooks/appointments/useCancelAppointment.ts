import { useMutation, useQueryClient } from '@tanstack/react-query';
import { appointmentsService } from '@/api/services';
import { queryKeys } from '@/lib/queryKeys';

export const useCancelAppointment = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => appointmentsService.cancel(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.appointments.all }),
  });
};
