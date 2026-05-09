import { useQuery } from '@tanstack/react-query';
import { patientsService } from '@/api/services';
import { queryKeys } from '@/lib/queryKeys';

export const useMedicalHistory = () =>
  useQuery({
    queryKey: queryKeys.patients.history(),
    queryFn: patientsService.history,
  });
