import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { adminService } from '@/api/services';
import { queryKeys } from '@/lib/queryKeys';
import type { AdminDoctor, ApiError, DoctorInput, ScheduleChangeResult, TimeOff, WeeklySchedule } from '@/types';

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

interface SaveDoctorVars {
  /** Undefined to create a new doctor. */
  id?: string;
  input: DoctorInput;
  /** A new photo to upload after saving (already resized). */
  photo?: Blob;
  /** Delete the uploaded photo. */
  removePhoto?: boolean;
}

export interface SaveDoctorResult {
  doctor: AdminDoctor;
  /** Set when the doctor was saved but the photo step failed. */
  photoError?: string;
}

/**
 * Saves the doctor, then uploads or removes the photo. The photo needs the doctor's id,
 * so for a new doctor it can only be sent after the doctor exists. A photo failure is
 * returned (not thrown): the doctor is already saved, and retrying "Add" would duplicate it.
 */
export const useSaveDoctor = () => {
  const invalidate = useInvalidateDoctors();
  return useMutation({
    mutationFn: async ({ id, input, photo, removePhoto }: SaveDoctorVars): Promise<SaveDoctorResult> => {
      // Remove first: while an uploaded photo exists the server ignores the photo link field.
      if (id && removePhoto) await adminService.removeDoctorPhoto(id);
      const doctor = id ? await adminService.updateDoctor(id, input) : await adminService.createDoctor(input);
      if (!photo) return { doctor };
      try {
        return { doctor: await adminService.uploadDoctorPhoto(doctor.id, photo) };
      } catch (err) {
        return { doctor, photoError: (err as ApiError).message ?? 'Unknown error' };
      }
    },
    onSuccess: invalidate,
  });
};

export const useDoctorSchedule = (doctorId: string | undefined) =>
  useQuery({
    queryKey: queryKeys.admin.doctorSchedule(doctorId ?? ''),
    queryFn: () => adminService.getSchedule(doctorId!),
    enabled: Boolean(doctorId),
  });

type ScheduleAction =
  | { kind: 'weekly'; weekly: WeeklySchedule | null }
  | { kind: 'addTimeOff'; entry: Omit<TimeOff, 'id'> }
  | { kind: 'removeTimeOff'; timeOffId: string };

/** Every schedule change; afterwards the schedule, availability and "next slot" are refreshed. */
export const useChangeSchedule = (doctorId: string) => {
  const qc = useQueryClient();
  const invalidate = useInvalidateDoctors();
  return useMutation({
    mutationFn: (action: ScheduleAction): Promise<ScheduleChangeResult> => {
      switch (action.kind) {
        case 'weekly':
          return adminService.saveWeeklySchedule(doctorId, action.weekly);
        case 'addTimeOff':
          return adminService.addTimeOff(doctorId, action.entry);
        case 'removeTimeOff':
          return adminService.removeTimeOff(doctorId, action.timeOffId);
      }
    },
    onSuccess: ({ schedule }) => {
      qc.setQueryData(queryKeys.admin.doctorSchedule(doctorId), schedule);
      invalidate();
    },
  });
};

export const useSetDoctorActive = () => {
  const invalidate = useInvalidateDoctors();
  return useMutation({
    mutationFn: ({ id, active }: { id: string; active: boolean }) => adminService.setDoctorActive(id, active),
    onSuccess: invalidate,
  });
};
