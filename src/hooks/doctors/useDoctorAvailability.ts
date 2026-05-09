import { useQuery } from '@tanstack/react-query';
import { doctorsService } from '@/api/services';
import { queryKeys } from '@/lib/queryKeys';

export const useDoctorAvailability = (id: string | undefined) =>
  useQuery({
    queryKey: id ? queryKeys.doctors.availability(id) : [...queryKeys.doctors.all, 'availability', 'unknown'],
    queryFn: () => doctorsService.availability(id!),
    enabled: Boolean(id),
  });
