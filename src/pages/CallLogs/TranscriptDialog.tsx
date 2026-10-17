import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Typography,
  alpha,
} from '@mui/material';
import { Close } from '@mui/icons-material';
import { formatDateTime, formatTime } from '@/utils/format';
import type { CallLog } from '@/types';

interface TranscriptDialogProps {
  call: CallLog | null;
  onClose: () => void;
}

export const TranscriptDialog = ({ call, onClose }: TranscriptDialogProps) => (
  <Dialog open={Boolean(call)} onClose={onClose} fullWidth maxWidth="sm">
    {call && (
      <>
        <DialogTitle sx={{ pr: 6 }}>
          Call transcript
          <Typography variant="body2" color="text.secondary">
            {call.contactName ?? call.contactPhone} • {formatDateTime(call.startedAt)}
          </Typography>
          <IconButton onClick={onClose} sx={{ position: 'absolute', right: 12, top: 12 }} aria-label="Close">
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Stack spacing={1.5}>
            {call.transcript.map((line, i) => {
              const isAgent = line.speaker === 'agent';
              return (
                <Box key={i} sx={{ alignSelf: isAgent ? 'flex-start' : 'flex-end', maxWidth: '85%' }}>
                  <Typography variant="caption" color="text.secondary">
                    {isAgent ? 'AI agent' : 'Caller'}
                    {line.at && ` • ${formatTime(line.at)}`}
                  </Typography>
                  <Box
                    sx={{
                      mt: 0.3,
                      px: 1.5,
                      py: 1,
                      borderRadius: 2,
                      bgcolor: (t) =>
                        isAgent ? alpha(t.palette.primary.main, 0.1) : alpha(t.palette.text.primary, 0.06),
                    }}
                  >
                    <Typography variant="body2">{line.text}</Typography>
                  </Box>
                </Box>
              );
            })}
          </Stack>
        </DialogContent>
      </>
    )}
  </Dialog>
);
