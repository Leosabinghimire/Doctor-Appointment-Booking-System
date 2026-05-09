import { Box } from '@mui/material';
import { Loader, PageHeader } from '@/components/ui';
import { useAdminStats } from '@/hooks/admin';
import { useDoctors } from '@/hooks/doctors';
import { AdminStatsGrid } from './AdminStatsGrid';
import { WeeklyAppointmentsChart } from './WeeklyAppointmentsChart';
import { SpecialtyDistributionChart } from './SpecialtyDistributionChart';
import { TopDoctorsList } from './TopDoctorsList';
import { RecentSignupsList } from './RecentSignupsList';

export const AdminDashboard = () => {
  const { data: stats, isLoading } = useAdminStats();
  const { data: doctors } = useDoctors();

  if (isLoading || !stats) return <Loader label="Loading admin dashboard..." />;

  return (
    <Box>
      <PageHeader
        title="Admin dashboard"
        subtitle="Platform health, growth, and operations at a glance."
      />

      <AdminStatsGrid stats={stats} />

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' }, gap: 2.5, mb: 3 }}>
        <WeeklyAppointmentsChart data={stats.weeklyAppointments} />
        <SpecialtyDistributionChart data={stats.specialtyDistribution} />
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' }, gap: 2.5 }}>
        <TopDoctorsList doctors={doctors ?? []} />
        <RecentSignupsList users={stats.recentSignups} />
      </Box>
    </Box>
  );
};
