import { useQuery } from '@tanstack/react-query';
import { appointmentsService } from '@/api/services';
import { queryKeys } from '@/lib/queryKeys';

export const useAppointments = () =>
  useQuery({
    queryKey: queryKeys.appointments.list(),
    queryFn: appointmentsService.list,
    staleTime: 30_000,
  });
