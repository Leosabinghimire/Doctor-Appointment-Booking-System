import { Box, Stack, TextField, Typography } from '@mui/material';

interface PatientDetailsStepProps {
  patientName: string;
  patientPhone: string;
  patientEmail: string;
  reason: string;
  onChangeName: (v: string) => void;
  onChangePhone: (v: string) => void;
  onChangeEmail: (v: string) => void;
  onChangeReason: (v: string) => void;
}

export const PatientDetailsStep = ({
  patientName,
  patientPhone,
  patientEmail,
  reason,
  onChangeName,
  onChangePhone,
  onChangeEmail,
  onChangeReason,
}: PatientDetailsStepProps) => (
  <Box>
    <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
      Patient details
    </Typography>
    <Stack spacing={2}>
      <TextField label="Full name" value={patientName} onChange={(e) => onChangeName(e.target.value)} fullWidth />
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <TextField label="Phone" value={patientPhone} onChange={(e) => onChangePhone(e.target.value)} fullWidth />
        <TextField label="Email" value={patientEmail} onChange={(e) => onChangeEmail(e.target.value)} fullWidth />
      </Stack>
      <TextField
        label="Reason for visit"
        value={reason}
        onChange={(e) => onChangeReason(e.target.value)}
        multiline
        rows={3}
        placeholder="Brief description of symptoms or concerns..."
      />
    </Stack>
  </Box>
);
