import { Box, Button, Stack, Typography, alpha } from '@mui/material';
import { ChevronRight } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { SectionCard } from '@/components/ui';
import { ROUTES } from '@/constants';
import type { AppNotification } from '@/types';

interface RecentActivityCardProps {
  notifications: AppNotification[];
}

export const RecentActivityCard = ({ notifications }: RecentActivityCardProps) => {
  const navigate = useNavigate();
  const unread = notifications.filter((n) => !n.read).length;

  return (
    <SectionCard
      title="Recent activity"
      subtitle={`${unread} unread`}
      action={
        <Button size="small" endIcon={<ChevronRight />} onClick={() => navigate(ROUTES.notifications)}>
          View all
        </Button>
      }
    >
      <Stack spacing={1.2}>
        {notifications.slice(0, 5).map((n) => (
          <Stack
            key={n.id}
            direction="row"
            spacing={1.5}
            alignItems="flex-start"
            sx={{
              p: 1.5,
              borderRadius: 2,
              bgcolor: (t) => (n.read ? 'transparent' : alpha(t.palette.primary.main, 0.06)),
            }}
          >
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                mt: 0.7,
                bgcolor: n.read ? 'text.disabled' : 'primary.main',
              }}
            />
            <Box flex={1}>
              <Typography fontWeight={600} fontSize={14}>
                {n.title}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {n.message}
              </Typography>
            </Box>
          </Stack>
        ))}
      </Stack>
    </SectionCard>
  );
};
