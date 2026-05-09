import { useQuery } from '@tanstack/react-query';
import { prescriptionsService } from '@/api/services';
import { queryKeys } from '@/lib/queryKeys';

export const usePrescriptions = () =>
  useQuery({
    queryKey: queryKeys.prescriptions.list(),
    queryFn: prescriptionsService.list,
  });
