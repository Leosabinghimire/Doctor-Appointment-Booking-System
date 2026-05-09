import { Box, Button } from '@mui/material';
import { CalendarMonth } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { Loader, PageHeader } from '@/components/ui';
import { useAppointments } from '@/hooks/appointments';
import { usePatient } from '@/hooks/patients';
import { usePrescriptions } from '@/hooks/prescriptions';
import { useNotifications } from '@/hooks/notifications';
import { ROUTES } from '@/constants';
import { PatientHeroCard } from './PatientHeroCard';
import { DashboardStats } from './DashboardStats';
import { HeartRateCard } from './HeartRateCard';
import { VitalsCard } from './VitalsCard';
import { UpcomingAppointmentsCard } from './UpcomingAppointmentsCard';
import { RecentActivityCard } from './RecentActivityCard';

export const Dashboard = () => {
  const navigate = useNavigate();
  const { data: patient, isLoading } = usePatient();
  const { data: appointments } = useAppointments();
  const { data: prescriptions } = usePrescriptions();
  const { data: notifications } = useNotifications();

  if (isLoading || !patient) return <Loader label="Preparing your dashboard..." />;

  const upcoming = appointments?.filter((a) => a.status === 'upcoming') ?? [];
  const activePrescriptions = prescriptions?.filter((p) => p.status === 'active').length ?? 0;

  return (
    <Box>
      <PageHeader
        title={`Welcome back, ${patient.name.split(' ')[0]} 👋`}
        subtitle="Here's a quick overview of your health and upcoming visits."
        actions={
          <Button
            variant="contained"
            size="large"
            startIcon={<CalendarMonth />}
            onClick={() => navigate(ROUTES.book)}
          >
            Book Appointment
          </Button>
        }
      />

      <PatientHeroCard patient={patient} />

      <DashboardStats upcomingCount={upcoming.length} activePrescriptionCount={activePrescriptions} />

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' }, gap: 2.5, mb: 3 }}>
        <HeartRateCard />
        <VitalsCard />
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1.5fr 1fr' }, gap: 2.5 }}>
        <UpcomingAppointmentsCard appointments={upcoming} />
        <RecentActivityCard notifications={notifications ?? []} />
      </Box>
    </Box>
  );
};
