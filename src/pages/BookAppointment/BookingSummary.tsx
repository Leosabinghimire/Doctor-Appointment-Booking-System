import { Card, Divider, Stack, Typography, alpha } from '@mui/material';
import { SummaryRow } from '@/components/ui';
import { formatCurrency, formatDate } from '@/utils/format';
import type { AppointmentType, Doctor, TimeSlot } from '@/types';

interface BookingSummaryProps {
  doctor?: Doctor;
  date?: string;
  slot?: TimeSlot;
  type: AppointmentType;
}

export const BookingSummary = ({ doctor, date, slot, type }: BookingSummaryProps) => (
  <Card
    sx={{
      p: 2.5,
      position: 'sticky',
      top: 88,
      alignSelf: 'flex-start',
      backgroundImage: (t) =>
        `linear-gradient(160deg, ${alpha(t.palette.primary.main, 0.08)} 0%, transparent 60%)`,
    }}
  >
    <Typography variant="h6" fontWeight={700}>
      Booking summary
    </Typography>
    <Divider sx={{ my: 1.5 }} />
    <Stack spacing={1.2}>
      <SummaryRow label="Doctor" value={doctor?.name ?? '—'} />
      <SummaryRow label="Specialty" value={doctor?.specialty ?? '—'} />
      <SummaryRow label="Date" value={date ? formatDate(date) : '—'} />
      <SummaryRow label="Time" value={slot?.time ?? '—'} />
      <SummaryRow label="Visit type" value={type.replace('-', ' ')} />
      <Divider />
      <SummaryRow label="Consultation fee" value={doctor ? formatCurrency(doctor.consultationFee) : '—'} bold />
    </Stack>
  </Card>
);
