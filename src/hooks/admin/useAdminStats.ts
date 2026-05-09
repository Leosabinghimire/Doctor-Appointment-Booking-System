import { useQuery } from '@tanstack/react-query';
import { adminService } from '@/api/services';
import { queryKeys } from '@/lib/queryKeys';

export const useAdminStats = () =>
  useQuery({
    queryKey: queryKeys.admin.stats(),
    queryFn: adminService.stats,
  });
