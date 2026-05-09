import { Box, Chip, Stack, Typography, alpha } from '@mui/material';
import { SectionCard } from '@/components/ui';
import { vitals } from './dashboard.data';

export const VitalsCard = () => (
  <SectionCard title="Vitals snapshot">
    <Stack spacing={1.5}>
      {vitals.map((v) => (
        <Box
          key={v.label}
          sx={{
            p: 1.5,
            borderRadius: 2,
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            border: (t) => `1px solid ${t.palette.divider}`,
          }}
        >
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 2,
              display: 'grid',
              placeItems: 'center',
              bgcolor: (t) => alpha(t.palette[v.color].main, 0.12),
              color: `${v.color}.main`,
            }}
          >
            {v.icon}
          </Box>
          <Box flex={1}>
            <Typography variant="caption" color="text.secondary">
              {v.label}
            </Typography>
            <Typography fontWeight={700}>
              {v.value}{' '}
              <Typography component="span" variant="caption" color="text.secondary">
                {v.unit}
              </Typography>
            </Typography>
          </Box>
          <Chip size="small" label={v.status} color={v.color} variant="outlined" />
        </Box>
      ))}
    </Stack>
  </SectionCard>
);
