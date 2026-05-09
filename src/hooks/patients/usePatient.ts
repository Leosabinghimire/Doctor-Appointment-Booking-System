import { useQuery } from '@tanstack/react-query';
import { patientsService } from '@/api/services';
import { queryKeys } from '@/lib/queryKeys';

export const usePatient = () =>
  useQuery({
    queryKey: queryKeys.patients.me(),
    queryFn: patientsService.me,
  });
