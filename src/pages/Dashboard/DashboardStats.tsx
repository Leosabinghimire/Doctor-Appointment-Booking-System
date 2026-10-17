import { Box } from '@mui/material';
import { CalendarMonth, EventAvailable, Medication, NotificationsActive } from '@mui/icons-material';
import { StatCard } from '@/components/ui';

interface DashboardStatsProps {
  upcomingCount: number;
  activePrescriptionCount: number;
  completedCount: number;
  unreadCount: number;
}

export const DashboardStats = ({
  upcomingCount,
  activePrescriptionCount,
  completedCount,
  unreadCount,
}: DashboardStatsProps) => (
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
    <StatCard label="Completed" value={completedCount} icon={<EventAvailable />} helper="past visits" />
    <StatCard label="Unread" value={unreadCount} icon={<NotificationsActive />} helper="notifications" />
  </Box>
);
