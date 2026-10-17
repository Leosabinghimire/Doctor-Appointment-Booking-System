import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { adminService } from '@/api/services';
import { queryKeys } from '@/lib/queryKeys';
import type { DoctorInput } from '@/types';

export const useAdminDoctors = () =>
  useQuery({
    queryKey: queryKeys.admin.doctors(),
    queryFn: adminService.listDoctors,
  });

/** Refreshes the admin list and every patient-facing doctor query (search, detail, availability). */
const useInvalidateDoctors = () => {
  const qc = useQueryClient();
  return () => {
    qc.invalidateQueries({ queryKey: queryKeys.admin.doctors() });
    qc.invalidateQueries({ queryKey: queryKeys.admin.stats() });
    qc.invalidateQueries({ queryKey: queryKeys.doctors.all });
  };
};

/** Creates a doctor when `id` is undefined, otherwise updates it. */
export const useSaveDoctor = () => {
  const invalidate = useInvalidateDoctors();
  return useMutation({
    mutationFn: ({ id, input }: { id?: string; input: DoctorInput }) =>
      id ? adminService.updateDoctor(id, input) : adminService.createDoctor(input),
    onSuccess: invalidate,
  });
};

export const useSetDoctorActive = () => {
  const invalidate = useInvalidateDoctors();
  return useMutation({
    mutationFn: ({ id, active }: { id: string; active: boolean }) => adminService.setDoctorActive(id, active),
    onSuccess: invalidate,
  });
};
