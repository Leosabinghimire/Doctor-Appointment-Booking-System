import {
  Box,
  Card,
  Stack,
  Typography,
  Chip,
  Divider,
  Button,
  alpha,
} from '@mui/material';
import { Medication, Refresh, FileDownload } from '@mui/icons-material';
import { motion } from 'framer-motion';
import type { Prescription } from '@/types';
import { formatDate } from '@/utils/format';

interface Props {
  prescription: Prescription;
  index?: number;
}

const statusColor: Record<Prescription['status'], 'success' | 'warning' | 'error'> = {
  active: 'success',
  completed: 'warning',
  expired: 'error',
};

export const PrescriptionCard = ({ prescription, index = 0 }: Props) => {
  const color = statusColor[prescription.status];
  return (
    <Card
      component={motion.div}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
      sx={{ p: 2.5 }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1}>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: 2,
              display: 'grid',
              placeItems: 'center',
              color: 'primary.main',
              bgcolor: (t) => alpha(t.palette.primary.main, 0.1),
            }}
          >
            <Medication />
          </Box>
          <Box>
            <Typography variant="subtitle1" fontWeight={700}>
              {prescription.diagnosis}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {prescription.doctorName} • {prescription.doctorSpecialty}
            </Typography>
          </Box>
        </Stack>
        <Chip
          size="small"
          label={prescription.status.toUpperCase()}
          sx={{
            bgcolor: (t) => alpha(t.palette[color].main, 0.12),
            color: `${color}.main`,
          }}
        />
      </Stack>

      <Divider sx={{ my: 2 }} />

      <Stack spacing={1.2}>
        {prescription.medications.map((med) => (
          <Box
            key={med.id}
            sx={{
              p: 1.5,
              borderRadius: 2,
              bgcolor: (t) => alpha(t.palette.text.secondary, 0.04),
            }}
          >
            <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap">
              <Typography fontWeight={700}>
                {med.name} <Typography component="span" variant="caption" color="text.secondary">{med.dosage}</Typography>
              </Typography>
              <Chip size="small" label={med.frequency} variant="outlined" />
            </Stack>
            <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>
              {med.duration} • {med.instructions}
            </Typography>
          </Box>
        ))}
      </Stack>

      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mt: 2, pt: 2, borderTop: (t) => `1px dashed ${t.palette.divider}` }}
      >
        <Typography variant="caption" color="text.secondary">
          Issued on {formatDate(prescription.date)} •{' '}
          {prescription.refillable ? `${prescription.refillsRemaining} refills left` : 'No refills'}
        </Typography>
        <Stack direction="row" spacing={1}>
          <Button size="small" startIcon={<FileDownload />}>
            Export
          </Button>
          {prescription.refillable && prescription.refillsRemaining > 0 && (
            <Button size="small" variant="contained" startIcon={<Refresh />}>
              Request refill
            </Button>
          )}
        </Stack>
      </Stack>
    </Card>
  );
};
