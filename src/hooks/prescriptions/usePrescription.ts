import { useQuery } from '@tanstack/react-query';
import { prescriptionsService } from '@/api/services';
import { queryKeys } from '@/lib/queryKeys';

export const usePrescription = (id: string | undefined) =>
  useQuery({
    queryKey: id ? queryKeys.prescriptions.detail(id) : [...queryKeys.prescriptions.all, 'detail', 'unknown'],
    queryFn: () => prescriptionsService.get(id!),
    enabled: Boolean(id),
  });
