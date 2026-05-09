import { Avatar, Box, Card, Chip, Divider, LinearProgress, Stack, Typography, alpha } from '@mui/material';
import { motion } from 'framer-motion';
import type { Patient } from '@/types';
import { initials } from '@/utils/format';
import { fadeInUp } from '@/lib/animations';

interface PatientHeroCardProps {
  patient: Patient;
  healthScore?: number;
}

export const PatientHeroCard = ({ patient, healthScore = 86 }: PatientHeroCardProps) => (
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
            {patient.age} yrs • {patient.gender} • Blood {patient.bloodGroup}
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
          Health score
        </Typography>
        <Stack direction="row" alignItems="baseline" spacing={1} sx={{ mt: 0.5 }}>
          <Typography variant="h3" fontWeight={800} color="primary.main" sx={{ lineHeight: 1 }}>
            {healthScore}
          </Typography>
          <Typography color="text.secondary" fontWeight={600}>
            / 100
          </Typography>
        </Stack>
        <LinearProgress
          variant="determinate"
          value={healthScore}
          sx={{
            mt: 1.2,
            height: 6,
            borderRadius: 4,
            bgcolor: (t) => alpha(t.palette.primary.main, 0.1),
            '& .MuiLinearProgress-bar': { borderRadius: 4 },
          }}
        />
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
          You're on track. Keep up your morning walks and balanced meals.
        </Typography>
      </Box>
    </Stack>
  </Card>
);
