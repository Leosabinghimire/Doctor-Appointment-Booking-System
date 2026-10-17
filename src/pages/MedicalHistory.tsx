import { Avatar, Box, Card, Chip, Divider, Stack, Typography, alpha } from '@mui/material';
import { Bloodtype, Height, LocalHospital, Person, Scale, Warning } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { InfoRow, Loader, PageHeader, SectionCard } from '@/components/ui';
import { useMedicalHistory, usePatient } from '@/hooks/patients';
import { formatDate, initials, withUnit } from '@/utils/format';
import { fadeInUp } from '@/lib/animations';

export const MedicalHistory = () => {
  const { data: patient, isLoading: loadingPatient } = usePatient();
  const { data: history, isLoading: loadingHistory } = useMedicalHistory();

  if (loadingPatient || loadingHistory) return <Loader label="Loading medical history..." />;

  return (
    <Box>
      <PageHeader title="Medical history" subtitle="Your complete health record at a glance." />

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 2fr' }, gap: 2.5 }}>
        <SectionCard title="Profile snapshot">
          <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
            <Avatar src={patient?.avatar} sx={{ width: 64, height: 64 }}>
              {patient ? initials(patient.name) : 'U'}
            </Avatar>
            <Box>
              <Typography fontWeight={700}>{patient?.name}</Typography>
              <Typography color="text.secondary" variant="body2">
                {[patient?.age !== undefined && `${patient.age} yrs`, patient?.gender].filter(Boolean).join(' • ')}
              </Typography>
            </Box>
          </Stack>
          <Stack spacing={1.2}>
            <InfoRow icon={<Bloodtype />} label="Blood group" value={withUnit(patient?.bloodGroup)} />
            <InfoRow icon={<Height />} label="Height" value={withUnit(patient?.height, 'cm')} />
            <InfoRow icon={<Scale />} label="Weight" value={withUnit(patient?.weight, 'kg')} />
            <InfoRow
              icon={<Person />}
              label="Emergency contact"
              value={`${patient?.emergencyContact.name} (${patient?.emergencyContact.relation})`}
              color="primary"
            />
          </Stack>

          <Divider sx={{ my: 2 }} />
          <Typography variant="caption" color="text.secondary" fontWeight={700} textTransform="uppercase">
            Allergies
          </Typography>
          <Stack direction="row" spacing={1} sx={{ mt: 1, mb: 2 }} flexWrap="wrap">
            {patient?.allergies.map((a) => (
              <Chip
                key={a}
                icon={<Warning sx={{ fontSize: 14 }} />}
                label={a}
                color="error"
                variant="outlined"
                size="small"
              />
            ))}
          </Stack>
          <Typography variant="caption" color="text.secondary" fontWeight={700} textTransform="uppercase">
            Chronic conditions
          </Typography>
          <Stack direction="row" spacing={1} sx={{ mt: 1 }} flexWrap="wrap">
            {patient?.chronicConditions.map((c) => (
              <Chip key={c} label={c} color="warning" variant="outlined" size="small" />
            ))}
          </Stack>
        </SectionCard>

        <SectionCard title="Visit timeline" subtitle={`${history?.length ?? 0} records`}>
          <Box sx={{ position: 'relative', pl: { xs: 2, sm: 4 } }}>
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: { xs: 8, sm: 16 },
                width: 2,
                bgcolor: (t) => alpha(t.palette.primary.main, 0.2),
                borderRadius: 2,
              }}
            />
            <Stack spacing={2.5}>
              {history?.map((rec, i) => (
                <Card
                  key={rec.id}
                  component={motion.div}
                  variants={fadeInUp}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: i * 0.05 }}
                  sx={{ p: 2.5, position: 'relative' }}
                >
                  <Box
                    sx={{
                      position: 'absolute',
                      left: { xs: -25, sm: -33 },
                      top: 26,
                      width: 14,
                      height: 14,
                      borderRadius: '50%',
                      bgcolor: 'primary.main',
                      border: (t) => `3px solid ${t.palette.background.paper}`,
                      boxShadow: (t) => `0 0 0 3px ${alpha(t.palette.primary.main, 0.2)}`,
                    }}
                  />
                  <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        {formatDate(rec.date)}
                      </Typography>
                      <Typography variant="h6" fontWeight={700}>
                        {rec.diagnosis}
                      </Typography>
                      <Stack direction="row" spacing={0.5} alignItems="center" color="text.secondary">
                        <LocalHospital sx={{ fontSize: 16 }} />
                        <Typography variant="body2">
                          {rec.doctorName} • {rec.specialty}
                        </Typography>
                      </Stack>
                    </Box>
                  </Stack>
                  {rec.symptoms.length > 0 && (
                    <Stack direction="row" spacing={0.7} flexWrap="wrap" sx={{ mt: 1.5 }}>
                      {rec.symptoms.map((s) => (
                        <Chip key={s} label={s} size="small" variant="outlined" />
                      ))}
                    </Stack>
                  )}
                  <Divider sx={{ my: 1.5 }} />
                  <Typography variant="caption" color="text.secondary" fontWeight={700} textTransform="uppercase">
                    Treatment
                  </Typography>
                  <Typography sx={{ mt: 0.4 }}>{rec.treatment}</Typography>
                  {rec.notes && (
                    <Typography color="text.secondary" sx={{ mt: 1.5, fontSize: 13.5, fontStyle: 'italic' }}>
                      "{rec.notes}"
                    </Typography>
                  )}
                </Card>
              ))}
            </Stack>
          </Box>
        </SectionCard>
      </Box>
    </Box>
  );
};
