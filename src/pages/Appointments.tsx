import { useMemo, useState } from 'react';
import { Alert, Box, Button, Snackbar, Stack, Tab, Tabs } from '@mui/material';
import { CalendarMonth } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { ConfirmDialog, EmptyState, Loader, PageHeader } from '@/components/ui';
import { AppointmentCard } from '@/components/appointment';
import { useAppointments, useCancelAppointment } from '@/hooks/appointments';
import { useReminderCall } from '@/hooks/calls';
import { ROUTES } from '@/constants';
import type { AppointmentStatus } from '@/types';

const TAB_FILTERS: Record<number, AppointmentStatus | 'all'> = {
  0: 'upcoming',
  1: 'completed',
  2: 'cancelled',
  3: 'all',
};

export const Appointments = () => {
  const navigate = useNavigate();
  const { data: appointments, isLoading } = useAppointments();
  const { mutate: cancelAppointment } = useCancelAppointment();
  const { mutate: requestReminderCall } = useReminderCall();
  const [tab, setTab] = useState(0);
  const [pendingCancel, setPendingCancel] = useState<string | null>(null);
  const [toast, setToast] = useState<{ severity: 'success' | 'error'; message: string } | null>(null);

  const filtered = useMemo(() => {
    const status = TAB_FILTERS[tab];
    if (!appointments) return [];
    if (status === 'all') return appointments;
    return appointments.filter((a) => a.status === status);
  }, [appointments, tab]);

  const handleCancelConfirm = () => {
    if (pendingCancel) {
      cancelAppointment(pendingCancel);
      setPendingCancel(null);
      setToast({ severity: 'success', message: 'Appointment cancelled.' });
    }
  };

  const handleReminderCall = (id: string) =>
    requestReminderCall(id, {
      onSuccess: (result) =>
        setToast({ severity: result.placed ? 'success' : 'error', message: result.message }),
      onError: (error) =>
        setToast({ severity: 'error', message: (error as { message?: string }).message ?? 'Could not place call.' }),
    });

  return (
    <Box>
      <PageHeader
        title="My appointments"
        subtitle="Track and manage your visits."
        actions={
          <Button variant="contained" startIcon={<CalendarMonth />} onClick={() => navigate(ROUTES.book)}>
            Book new
          </Button>
        }
      />

      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 3 }}>
        <Tab label="Upcoming" />
        <Tab label="Completed" />
        <Tab label="Cancelled" />
        <Tab label="All" />
      </Tabs>

      {isLoading ? (
        <Loader label="Loading appointments..." />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No appointments here"
          description="Book your next consultation in just a few clicks."
          actionLabel="Book Appointment"
          onAction={() => navigate(ROUTES.book)}
        />
      ) : (
        <Stack spacing={2}>
          {filtered.map((a, i) => (
            <AppointmentCard
              key={a.id}
              appointment={a}
              onCancel={(id) => setPendingCancel(id)}
              onReminderCall={handleReminderCall}
              index={i}
            />
          ))}
        </Stack>
      )}

      <ConfirmDialog
        open={Boolean(pendingCancel)}
        title="Cancel appointment?"
        message="This action cannot be undone. The doctor will be notified of your cancellation."
        confirmLabel="Yes, cancel"
        destructive
        onConfirm={handleCancelConfirm}
        onClose={() => setPendingCancel(null)}
      />

      <Snackbar
        open={Boolean(toast)}
        autoHideDuration={2200}
        onClose={() => setToast(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity={toast?.severity ?? 'success'} variant="filled">
          {toast?.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};
