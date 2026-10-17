import { useMutation, useQueryClient } from '@tanstack/react-query';
import { appointmentsService } from '@/api/services';
import { queryKeys } from '@/lib/queryKeys';
import type { BookingPayload } from '@/types';

export const useBookAppointment = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: BookingPayload) => appointmentsService.book(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.appointments.all });
      // The backend adds an "Appointment confirmed" notification.
      qc.invalidateQueries({ queryKey: queryKeys.notifications.all });
    },
  });
};
