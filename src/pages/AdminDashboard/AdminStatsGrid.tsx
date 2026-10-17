import { Box } from '@mui/material';
import { CalendarMonth, LocalHospital, PaidOutlined, PeopleAlt } from '@mui/icons-material';
import { StatCard } from '@/components/ui';
import { formatCurrency } from '@/utils/format';
import type { AdminStats } from '@/types';

interface AdminStatsGridProps {
  stats: AdminStats;
}

export const AdminStatsGrid = ({ stats }: AdminStatsGridProps) => (
  <Box
    sx={{
      display: 'grid',
      gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' },
      gap: 2.5,
      mb: 3,
    }}
  >
    <StatCard
      label="Total patients"
      value={stats.totalPatients.toLocaleString()}
      icon={<PeopleAlt />}
    />
    <StatCard
      label="Total doctors"
      value={stats.totalDoctors}
      icon={<LocalHospital />}
    />
    <StatCard
      label="Today's bookings"
      value={stats.appointmentsToday}
      icon={<CalendarMonth />}
    />
    <StatCard
      label="Revenue this month"
      value={formatCurrency(stats.revenueThisMonth)}
      icon={<PaidOutlined />}
    />
  </Box>
);
