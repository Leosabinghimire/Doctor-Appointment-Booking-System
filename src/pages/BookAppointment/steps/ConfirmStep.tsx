import { Alert, Avatar, Box, Divider, Stack, Typography } from '@mui/material';
import { formatCurrency, formatDate } from '@/utils/format';
import type { AppointmentType, Doctor, TimeSlot } from '@/types';

interface ConfirmStepProps {
  doctor: Doctor;
  selectedDate: string;
  selectedSlot: TimeSlot;
  type: AppointmentType;
  reason: string;
}

export const ConfirmStep = ({ doctor, selectedDate, selectedSlot, type, reason }: ConfirmStepProps) => (
  <Box>
    <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
      Review & confirm
    </Typography>
    <Stack spacing={2}>
      <Stack direction="row" spacing={2} alignItems="center">
        <Avatar src={doctor.avatar} sx={{ width: 56, height: 56 }} />
        <Box>
          <Typography fontWeight={700}>{doctor.name}</Typography>
          <Typography color="text.secondary">{doctor.specialty}</Typography>
        </Box>
      </Stack>
      <Divider />
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={4}>
        <Box>
          <Typography variant="caption" color="text.secondary">Date</Typography>
          <Typography fontWeight={700}>{formatDate(selectedDate)}</Typography>
        </Box>
        <Box>
          <Typography variant="caption" color="text.secondary">Time</Typography>
          <Typography fontWeight={700}>{selectedSlot.time}</Typography>
        </Box>
        <Box>
          <Typography variant="caption" color="text.secondary">Visit type</Typography>
          <Typography fontWeight={700} sx={{ textTransform: 'capitalize' }}>
            {type.replace('-', ' ')}
          </Typography>
        </Box>
        <Box>
          <Typography variant="caption" color="text.secondary">Fee</Typography>
          <Typography fontWeight={700}>{formatCurrency(doctor.consultationFee)}</Typography>
        </Box>
      </Stack>
      <Divider />
      <Box>
        <Typography variant="caption" color="text.secondary">Reason</Typography>
        <Typography>{reason}</Typography>
      </Box>
      <Alert severity="info">
        You'll see a confirmation in your Notifications. You can cancel any time before the visit from the Appointments page.
      </Alert>
    </Stack>
  </Box>
);
