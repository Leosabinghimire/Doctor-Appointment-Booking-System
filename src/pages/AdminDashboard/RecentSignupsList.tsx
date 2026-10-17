import { Avatar, Box, Chip, Stack, Typography, alpha } from '@mui/material';
import { SectionCard } from '@/components/ui';
import { formatRelative, initials } from '@/utils/format';
import type { RecentSignup } from '@/types';

interface RecentSignupsListProps {
  users: RecentSignup[];
}

export const RecentSignupsList = ({ users }: RecentSignupsListProps) => (
  <SectionCard title="Recent sign-ups" subtitle="Newest patients">
    <Stack spacing={1.5}>
      {users.map((u) => (
        <Stack
          key={u.id}
          direction="row"
          spacing={2}
          alignItems="center"
          sx={{ p: 1.5, borderRadius: 2, border: (t) => `1px solid ${t.palette.divider}` }}
        >
          <Avatar
            sx={{
              bgcolor: (t) => alpha(t.palette.primary.main, 0.12),
              color: 'primary.main',
            }}
          >
            {initials(u.name)}
          </Avatar>
          <Box flex={1}>
            <Typography fontWeight={700}>{u.name}</Typography>
            <Typography variant="caption" color="text.secondary">
              {formatRelative(u.date)}
            </Typography>
          </Box>
          <Chip label={u.role} size="small" variant="outlined" />
        </Stack>
      ))}
    </Stack>
  </SectionCard>
);
