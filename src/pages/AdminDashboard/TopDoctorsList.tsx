import { Avatar, Box, Stack, Typography, alpha } from '@mui/material';
import { EmptyState, SectionCard } from '@/components/ui';
import type { Doctor } from '@/types';

interface TopDoctorsListProps {
  doctors: Doctor[];
}

export const TopDoctorsList = ({ doctors }: TopDoctorsListProps) => {
  const sorted = doctors.filter((d) => d.reviewCount > 0).sort((a, b) => b.rating - a.rating).slice(0, 5);
  return (
    <SectionCard title="Top performing doctors" subtitle="By rating">
      {sorted.length === 0 && (
        <EmptyState title="No ratings yet" description="Doctors appear here once patients have rated them." />
      )}
      <Stack spacing={1.5}>
        {sorted.map((d, i) => (
          <Stack
            key={d.id}
            direction="row"
            spacing={2}
            alignItems="center"
            sx={{ p: 1.5, borderRadius: 2, border: (t) => `1px solid ${t.palette.divider}` }}
          >
            <Box
              sx={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                display: 'grid',
                placeItems: 'center',
                fontWeight: 700,
                fontSize: 12,
                bgcolor: (t) => alpha(t.palette.primary.main, 0.1),
                color: 'primary.main',
              }}
            >
              {i + 1}
            </Box>
            <Avatar src={d.avatar} />
            <Box flex={1} minWidth={0}>
              <Typography fontWeight={700} noWrap>
                {d.name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {d.specialty} • {d.experience}y exp
              </Typography>
            </Box>
            <Box textAlign="right">
              <Typography fontWeight={700}>{d.rating.toFixed(2)}★</Typography>
              <Typography variant="caption" color="text.secondary">
                {d.reviewCount} reviews
              </Typography>
            </Box>
          </Stack>
        ))}
      </Stack>
    </SectionCard>
  );
};
