import { useQuery } from '@tanstack/react-query';
import { doctorsService } from '@/api/services';
import { queryKeys } from '@/lib/queryKeys';

export const useDoctor = (id: string | undefined) =>
  useQuery({
    queryKey: id ? queryKeys.doctors.detail(id) : [...queryKeys.doctors.details(), 'unknown'],
    queryFn: () => doctorsService.get(id!),
    enabled: Boolean(id),
  });
