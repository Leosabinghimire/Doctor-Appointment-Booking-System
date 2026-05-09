import { Box, Button, Card, Stack, Typography, alpha } from '@mui/material';
import { SupportAgent } from '@mui/icons-material';

export const HelpCard = () => (
  <Card sx={{ p: 2.5, height: '100%', display: 'flex', flexDirection: 'column' }}>
    <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1.5 }}>
      <Box
        sx={{
          width: 44,
          height: 44,
          borderRadius: 2,
          display: 'grid',
          placeItems: 'center',
          color: 'primary.main',
          bgcolor: (t) => alpha(t.palette.primary.main, 0.1),
          flexShrink: 0,
        }}
      >
        <SupportAgent />
      </Box>
      <Typography variant="h6" fontWeight={700}>
        Need help?
      </Typography>
    </Stack>
    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
      Reach out 24/7 to our care team for any health or account concerns.
    </Typography>
    <Button
      variant="contained"
      size="small"
      href="mailto:care@medicare.io"
      sx={{ alignSelf: 'flex-start', mt: 'auto' }}
    >
      Contact support
    </Button>
  </Card>
);
