import { Box } from '@mui/material';
import { CalendarMonth, Medication, MonitorHeart, Speed } from '@mui/icons-material';
import { StatCard } from '@/components/ui';

interface DashboardStatsProps {
  upcomingCount: number;
  activePrescriptionCount: number;
}

export const DashboardStats = ({ upcomingCount, activePrescriptionCount }: DashboardStatsProps) => (
  <Box
    sx={{
      display: 'grid',
      gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' },
      gap: 2.5,
      mb: 3,
    }}
  >
    <StatCard label="Upcoming" value={upcomingCount} icon={<CalendarMonth />} helper="appointments" />
    <StatCard
      label="Active Rx"
      value={activePrescriptionCount}
      icon={<Medication />}
      helper="prescriptions"
    />
    <StatCard label="Heart rate" value="74" icon={<MonitorHeart />} delta={-3} helper="vs last week" />
    <StatCard label="Activity" value="6.2k" icon={<Speed />} delta={12} helper="avg daily steps" />
  </Box>
);
