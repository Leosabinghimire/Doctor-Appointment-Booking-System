import { Chip, alpha, useTheme } from '@mui/material';
import type { AppointmentStatus } from '@/types';

const COLOR_BY_STATUS: Record<AppointmentStatus, 'primary' | 'success' | 'error' | 'warning'> = {
  upcoming: 'primary',
  completed: 'success',
  cancelled: 'error',
  'in-progress': 'warning',
};

const LABEL_BY_STATUS: Record<AppointmentStatus, string> = {
  upcoming: 'Upcoming',
  completed: 'Completed',
  cancelled: 'Cancelled',
  'in-progress': 'In Progress',
};

interface StatusChipProps {
  status: AppointmentStatus;
}

export const StatusChip = ({ status }: StatusChipProps) => {
  const theme = useTheme();
  const palette = theme.palette[COLOR_BY_STATUS[status]];
  return (
    <Chip
      size="small"
      label={LABEL_BY_STATUS[status]}
      sx={{
        bgcolor: alpha(palette.main, 0.12),
        color: palette.main,
        border: `1px solid ${alpha(palette.main, 0.25)}`,
      }}
    />
  );
};
