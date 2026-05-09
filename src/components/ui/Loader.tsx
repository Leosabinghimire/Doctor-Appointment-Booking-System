import { Box, CircularProgress, Skeleton, Stack, Typography } from '@mui/material';

interface LoaderProps {
  label?: string;
}

export const Loader = ({ label = 'Loading...' }: LoaderProps) => (
  <Stack
    direction="row"
    spacing={2}
    alignItems="center"
    justifyContent="center"
    sx={{ minHeight: 240 }}
  >
    <CircularProgress size={28} thickness={4} />
    <Typography color="text.secondary" fontWeight={500}>
      {label}
    </Typography>
  </Stack>
);

interface SkeletonCardsProps {
  count?: number;
  height?: number;
}

export const SkeletonCards = ({ count = 6, height = 210 }: SkeletonCardsProps) => (
  <Box
    sx={{
      display: 'grid',
      gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
      gap: 2.5,
    }}
  >
    {Array.from({ length: count }).map((_, i) => (
      <Skeleton key={i} variant="rounded" height={height} sx={{ borderRadius: 3 }} animation="wave" />
    ))}
  </Box>
);
