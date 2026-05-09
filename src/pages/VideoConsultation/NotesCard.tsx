import { Box, Card, Stack, TextField, Typography } from '@mui/material';
import { Notes } from '@mui/icons-material';

export const NotesCard = () => (
  <Card sx={{ p: 2.5, mt: 2.5 }}>
    <Stack direction="row" spacing={2} alignItems="center">
      <Notes color="primary" />
      <Box flex={1}>
        <Typography fontWeight={700}>Consultation notes</Typography>
        <Typography variant="caption" color="text.secondary">
          These will be saved to your medical history after the call.
        </Typography>
      </Box>
    </Stack>
    <TextField
      fullWidth
      multiline
      minRows={3}
      placeholder="Jot down questions or observations during the consult..."
      sx={{ mt: 2 }}
    />
  </Card>
);
