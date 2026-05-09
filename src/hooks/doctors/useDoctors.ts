import { useQuery } from '@tanstack/react-query';
import { doctorsService } from '@/api/services';
import { queryKeys } from '@/lib/queryKeys';
import type { DoctorFilters } from '@/types';

export const useDoctors = (filters?: DoctorFilters) =>
  useQuery({
    queryKey: queryKeys.doctors.list(filters),
    queryFn: () => doctorsService.list(filters),
    staleTime: 60_000,
  });
