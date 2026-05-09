import { useQuery } from '@tanstack/react-query';
import { appointmentsService } from '@/api/services';
import { queryKeys } from '@/lib/queryKeys';

export const useAppointment = (id: string | undefined) =>
  useQuery({
    queryKey: id ? queryKeys.appointments.detail(id) : [...queryKeys.appointments.all, 'detail', 'unknown'],
    queryFn: () => appointmentsService.get(id!),
    enabled: Boolean(id),
  });
