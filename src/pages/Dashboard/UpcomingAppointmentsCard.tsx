import { Button, Stack } from '@mui/material';
import { ChevronRight } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { EmptyState, SectionCard } from '@/components/ui';
import { AppointmentCard } from '@/components/appointment';
import { ROUTES } from '@/constants';
import type { Appointment } from '@/types';

interface UpcomingAppointmentsCardProps {
  appointments: Appointment[];
}

export const UpcomingAppointmentsCard = ({ appointments }: UpcomingAppointmentsCardProps) => {
  const navigate = useNavigate();
  return (
    <SectionCard
      title="Upcoming appointments"
      action={
        <Button size="small" endIcon={<ChevronRight />} onClick={() => navigate(ROUTES.appointments)}>
          View all
        </Button>
      }
    >
      {appointments.length === 0 ? (
        <EmptyState
          title="No upcoming visits"
          description="Book a new appointment to get started."
          actionLabel="Book Now"
          onAction={() => navigate(ROUTES.book)}
        />
      ) : (
        <Stack spacing={1.5}>
          {appointments.slice(0, 3).map((a, i) => (
            <AppointmentCard key={a.id} appointment={a} index={i} />
          ))}
        </Stack>
      )}
    </SectionCard>
  );
};
