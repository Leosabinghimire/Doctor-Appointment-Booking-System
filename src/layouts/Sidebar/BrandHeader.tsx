import { Box, Stack, Typography } from '@mui/material';
import { APP_NAME } from '@/config';

export const BrandHeader = () => (
  <Stack direction="row" spacing={1.2} alignItems="center" sx={{ px: 2.5, py: 2.5 }}>
    <Box
      component="img"
      src="/favicon.svg"
      alt={`${APP_NAME} logo`}
      sx={{ width: 40, height: 40, display: 'block' }}
    />
    <Box>
      <Typography variant="h6" fontWeight={800} lineHeight={1.1}>
        {APP_NAME}
      </Typography>
      <Typography variant="caption" color="text.secondary">
        Healthcare dashboard
      </Typography>
    </Box>
  </Stack>
);
