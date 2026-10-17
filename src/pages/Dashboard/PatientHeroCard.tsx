import { Avatar, Box, Card, Chip, Divider, Stack, Typography, alpha } from '@mui/material';
import { motion } from 'framer-motion';
import type { Appointment, Patient } from '@/types';
import { formatDate, initials } from '@/utils/format';
import { fadeInUp } from '@/lib/animations';

interface PatientHeroCardProps {
  patient: Patient;
  /** The soonest upcoming appointment, if any. */
  nextAppointment?: Appointment;
}

export const PatientHeroCard = ({ patient, nextAppointment }: PatientHeroCardProps) => (
  <Card
    component={motion.div}
    variants={fadeInUp}
    initial="hidden"
    animate="visible"
    sx={{
      p: { xs: 2.5, md: 3.5 },
      mb: 3,
    }}
  >
    <Stack
      direction={{ xs: 'column', md: 'row' }}
      spacing={3}
      alignItems={{ md: 'center' }}
      divider={<Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', md: 'block' } }} />}
    >
      <Stack direction="row" spacing={2.5} alignItems="center" flex={1}>
        <Avatar
          src={patient.avatar}
          sx={{
            width: 72,
            height: 72,
            border: (t) => `2px solid ${alpha(t.palette.primary.main, 0.2)}`,
          }}
        >
          {initials(patient.name)}
        </Avatar>
        <Box minWidth={0}>
          <Typography variant="h5" fontWeight={700}>
            {patient.name}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.3 }}>
            {[
              patient.age !== undefined && `${patient.age} yrs`,
              patient.gender,
              patient.bloodGroup && `Blood ${patient.bloodGroup}`,
            ]
              .filter(Boolean)
              .join(' • ') || 'Complete your profile to add health details'}
          </Typography>
          <Stack direction="row" spacing={0.7} sx={{ mt: 1.2 }} flexWrap="wrap" useFlexGap>
            {patient.chronicConditions.map((c) => (
              <Chip key={c} size="small" label={c} variant="outlined" />
            ))}
            {patient.allergies.map((a) => (
              <Chip
                key={a}
                size="small"
                label={`Allergy: ${a}`}
                variant="outlined"
                sx={{ color: 'text.secondary' }}
              />
            ))}
          </Stack>
        </Box>
      </Stack>

      <Box sx={{ minWidth: { md: 240 } }}>
        <Typography
          variant="caption"
          color="text.secondary"
          fontWeight={600}
          textTransform="uppercase"
          letterSpacing={0.5}
        >
          Next appointment
        </Typography>
        {nextAppointment ? (
          <>
            <Typography variant="h6" fontWeight={800} color="primary.main" sx={{ mt: 0.5 }}>
              {formatDate(nextAppointment.date, 'EEE, MMM d')} • {nextAppointment.time}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {nextAppointment.doctorName} • {nextAppointment.type === 'video' ? 'Video consult' : 'In-person'}
            </Typography>
          </>
        ) : (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            No upcoming visits. Book one when you need it.
          </Typography>
        )}
      </Box>
    </Stack>
  </Card>
);
