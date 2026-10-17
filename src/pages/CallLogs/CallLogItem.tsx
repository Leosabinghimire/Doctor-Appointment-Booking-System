import { Avatar, Box, Button, Card, Chip, Stack, Typography, alpha } from '@mui/material';
import { CallMade, CallReceived, EventAvailable, Subject } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { formatDateTime } from '@/utils/format';
import type { CallLog, CallStatus } from '@/types';

const COLOR_BY_STATUS: Record<CallStatus, 'success' | 'warning' | 'error' | 'info' | 'primary'> = {
  completed: 'success',
  ongoing: 'primary',
  callback: 'info',
  voicemail: 'warning',
  missed: 'error',
};

const LABEL_BY_STATUS: Record<CallStatus, string> = {
  completed: 'Completed',
  ongoing: 'Ongoing',
  callback: 'Callback requested',
  voicemail: 'Voicemail',
  missed: 'Missed',
};

export const formatDuration = (sec: number): string =>
  `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, '0')}`;

interface CallLogItemProps {
  call: CallLog;
  onOpenTranscript: (call: CallLog) => void;
  index?: number;
}

export const CallLogItem = ({ call, onOpenTranscript, index = 0 }: CallLogItemProps) => {
  const inbound = call.direction === 'inbound';

  return (
    <Card
      component={motion.div}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
      sx={{ p: 2.5 }}
    >
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ sm: 'center' }}>
        <Avatar sx={{ bgcolor: (t) => alpha(t.palette.primary.main, 0.12), color: 'primary.main' }}>
          {inbound ? <CallReceived /> : <CallMade />}
        </Avatar>
        <Box flex={1} minWidth={0}>
          <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" rowGap={0.5}>
            <Typography fontWeight={700}>{call.contactName ?? call.contactPhone}</Typography>
            <Chip size="small" color={COLOR_BY_STATUS[call.status]} variant="outlined" label={LABEL_BY_STATUS[call.status]} />
            {call.appointmentId && (
              <Chip
                size="small"
                color="primary"
                icon={<EventAvailable sx={{ fontSize: 14 }} />}
                label="Appointment reminder"
              />
            )}
          </Stack>
          {call.summary && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {call.summary}
            </Typography>
          )}
          <Typography variant="caption" color="text.secondary">
            {formatDateTime(call.startedAt)} • {formatDuration(call.durationSec)} • {inbound ? 'Inbound' : 'Outbound'}
            {call.contactName && ` • ${call.contactPhone}`}
          </Typography>
        </Box>
        <Button
          variant="outlined"
          startIcon={<Subject />}
          disabled={call.transcript.length === 0}
          onClick={() => onOpenTranscript(call)}
        >
          {call.transcript.length === 0 ? 'No transcript' : 'Transcript'}
        </Button>
      </Stack>
    </Card>
  );
};
