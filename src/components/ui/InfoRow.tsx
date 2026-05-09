import { Box, Stack, Typography, alpha } from '@mui/material';
import { ReactNode } from 'react';

type InfoRowColor = 'primary' | 'info' | 'warning' | 'error' | 'success' | 'secondary';

interface InfoRowProps {
  icon: ReactNode;
  label: string;
  value: ReactNode;
  color?: InfoRowColor;
}

export const InfoRow = ({ icon, label, value, color = 'primary' }: InfoRowProps) => (
  <Stack direction="row" spacing={1.5} alignItems="center">
    <Box
      sx={{
        width: 36,
        height: 36,
        borderRadius: 2,
        display: 'grid',
        placeItems: 'center',
        bgcolor: (t) => alpha(t.palette[color].main, 0.12),
        color: `${color}.main`,
        flexShrink: 0,
      }}
    >
      {icon}
    </Box>
    <Box flex={1} minWidth={0}>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      <Typography fontWeight={600} noWrap>
        {value}
      </Typography>
    </Box>
  </Stack>
);
