import {
  Card,
  Stack,
  Avatar,
  Box,
  Typography,
  Button,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  CalendarMonth,
  AccessTime,
  Videocam,
  LocalHospital,
  Cancel,
  ArrowForward,
  PhoneInTalk,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { StatusChip } from '@/components/ui';
import { formatDate, formatCurrency } from '@/utils/format';
import type { Appointment } from '@/types';
import { ROUTES } from '@/constants';

interface Props {
  appointment: Appointment;
  onCancel?: (id: string) => void;
  onReminderCall?: (id: string) => void;
  index?: number;
}

export const AppointmentCard = ({ appointment, onCancel, onReminderCall, index = 0 }: Props) => {
  const navigate = useNavigate();
  const isUpcoming = appointment.status === 'upcoming';
  const isVideo = appointment.type === 'video';

  return (
    <Card
      component={motion.div}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
      sx={{ p: 2.5 }}
    >
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        alignItems={{ sm: 'center' }}
        justifyContent="space-between"
      >
        <Stack direction="row" spacing={2} alignItems="center" flex={1}>
          <Avatar src={appointment.doctorAvatar} sx={{ width: 56, height: 56 }} />
          <Box minWidth={0}>
            <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
              <Typography variant="subtitle1" fontWeight={700}>
                {appointment.doctorName}
              </Typography>
              <StatusChip status={appointment.status} />
            </Stack>
            <Typography variant="body2" color="text.secondary">
              {appointment.doctorSpecialty} • {appointment.reason}
            </Typography>
            <Stack direction="row" spacing={2} sx={{ mt: 1 }} flexWrap="wrap" rowGap={0.6}>
              <Stack direction="row" spacing={0.5} alignItems="center">
                <CalendarMonth sx={{ fontSize: 16, color: 'text.secondary' }} />
                <Typography variant="caption" color="text.secondary">
                  {formatDate(appointment.date)}
                </Typography>
              </Stack>
              <Stack direction="row" spacing={0.5} alignItems="center">
                <AccessTime sx={{ fontSize: 16, color: 'text.secondary' }} />
                <Typography variant="caption" color="text.secondary">
                  {appointment.time}
                </Typography>
              </Stack>
              <Chip
                size="small"
                variant="outlined"
                icon={isVideo ? <Videocam sx={{ fontSize: 14 }} /> : <LocalHospital sx={{ fontSize: 14 }} />}
                label={isVideo ? 'Video consult' : 'In-person'}
                sx={{ height: 22, color: 'text.secondary' }}
              />
            </Stack>
          </Box>
        </Stack>

        <Stack direction="row" spacing={1} alignItems="center">
          <Box textAlign="right" sx={{ display: { xs: 'none', sm: 'block' } }}>
            <Typography variant="caption" color="text.secondary">
              Fee
            </Typography>
            <Typography fontWeight={700}>{formatCurrency(appointment.fee)}</Typography>
          </Box>
          {isUpcoming && isVideo && (
            <Button
              variant="contained"
              startIcon={<Videocam />}
              onClick={() => navigate(ROUTES.videoSession(appointment.id))}
            >
              Join
            </Button>
          )}
          {isUpcoming && !isVideo && (
            <Button
              variant="outlined"
              endIcon={<ArrowForward />}
              onClick={() => navigate(ROUTES.appointments)}
            >
              Details
            </Button>
          )}
          {isUpcoming && onReminderCall && (
            <Tooltip title="Get a phone reminder">
              <IconButton color="primary" onClick={() => onReminderCall(appointment.id)}>
                <PhoneInTalk />
              </IconButton>
            </Tooltip>
          )}
          {isUpcoming && onCancel && (
            <Tooltip title="Cancel appointment">
              <IconButton color="error" onClick={() => onCancel(appointment.id)}>
                <Cancel />
              </IconButton>
            </Tooltip>
          )}
        </Stack>
      </Stack>
    </Card>
  );
};
