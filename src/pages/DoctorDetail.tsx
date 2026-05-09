import { useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Card,
  Chip,
  Divider,
  Rating,
  Stack,
  Tab,
  Tabs,
  Typography,
  alpha,
} from '@mui/material';
import {
  AccessTime,
  ArrowBack,
  LocalHospital,
  LocationOn,
  Star,
  Translate,
  Verified,
  Videocam,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { Loader, SectionCard } from '@/components/ui';
import { useDoctor } from '@/hooks/doctors';
import { formatCurrency } from '@/utils/format';
import { ROUTES } from '@/constants';
import { fadeInUp } from '@/lib/animations';

const REVIEWS = [
  {
    id: 'r1',
    name: 'Olivia R.',
    avatar: 'https://i.pravatar.cc/100?img=20',
    rating: 5,
    date: '2 weeks ago',
    comment: 'Truly attentive and thorough. Took the time to walk me through my report calmly.',
  },
  {
    id: 'r2',
    name: 'David L.',
    avatar: 'https://i.pravatar.cc/100?img=11',
    rating: 5,
    date: '1 month ago',
    comment: 'Very professional. Got a same-day video consult and clear next steps.',
  },
  {
    id: 'r3',
    name: 'Maya K.',
    avatar: 'https://i.pravatar.cc/100?img=32',
    rating: 4,
    date: '2 months ago',
    comment: 'Wait time was a bit long but the consultation was worth it.',
  },
];

export const DoctorDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: doctor, isLoading } = useDoctor(id);
  const [tab, setTab] = useState(0);

  if (isLoading) return <Loader label="Loading doctor profile..." />;
  if (!doctor) return <Typography>Doctor not found.</Typography>;

  return (
    <Box>
      <Button startIcon={<ArrowBack />} onClick={() => navigate(-1)} sx={{ mb: 2 }} color="inherit">
        Back
      </Button>

      <Card
        component={motion.div}
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        sx={{ p: { xs: 2.5, md: 3.5 }, mb: 3, position: 'relative', overflow: 'hidden' }}
      >
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            backgroundImage: (t) =>
              `radial-gradient(circle at 100% 0%, ${alpha(t.palette.primary.main, 0.12)} 0%, transparent 60%)`,
          }}
        />
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} sx={{ position: 'relative' }}>
          <Avatar src={doctor.avatar} sx={{ width: 120, height: 120 }} />
          <Box flex={1}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="h4" fontWeight={800}>
                {doctor.name}
              </Typography>
              <Verified color="primary" />
            </Stack>
            <Typography color="text.secondary" sx={{ mt: 0.5 }}>
              {doctor.specialty} • {doctor.qualifications}
            </Typography>
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mt: 1.5 }} flexWrap="wrap" rowGap={1}>
              <Stack direction="row" spacing={0.5} alignItems="center">
                <Rating value={doctor.rating} precision={0.1} readOnly size="small" />
                <Typography fontWeight={700} fontSize={14}>
                  {doctor.rating.toFixed(1)}
                </Typography>
                <Typography color="text.secondary" variant="caption">
                  ({doctor.reviewCount} reviews)
                </Typography>
              </Stack>
              <Chip icon={<AccessTime sx={{ fontSize: 14 }} />} label={`${doctor.experience} years exp`} size="small" />
              <Chip
                icon={<LocationOn sx={{ fontSize: 14 }} />}
                label={`${doctor.hospital}, ${doctor.city}`}
                size="small"
              />
            </Stack>

            <Stack direction="row" spacing={1} sx={{ mt: 2 }} flexWrap="wrap" rowGap={1}>
              {doctor.videoConsult && (
                <Chip
                  icon={<Videocam sx={{ fontSize: 14 }} />}
                  label={`Video • ${formatCurrency(doctor.consultationFee)}`}
                  color="success"
                  variant="outlined"
                />
              )}
              {doctor.inPersonConsult && (
                <Chip
                  icon={<LocalHospital sx={{ fontSize: 14 }} />}
                  label={`In-person • ${formatCurrency(doctor.consultationFee + 20)}`}
                  color="primary"
                  variant="outlined"
                />
              )}
              <Chip icon={<Translate sx={{ fontSize: 14 }} />} label={doctor.languages.join(', ')} variant="outlined" />
            </Stack>
          </Box>

          <Box
            sx={{
              minWidth: { md: 260 },
              p: 2.5,
              borderRadius: 3,
              bgcolor: (t) => alpha(t.palette.primary.main, 0.06),
              border: (t) => `1px dashed ${alpha(t.palette.primary.main, 0.4)}`,
            }}
          >
            <Typography variant="caption" color="text.secondary">
              Next available
            </Typography>
            <Typography variant="h5" fontWeight={800} color="primary.main">
              {doctor.nextSlot}
            </Typography>
            <Button
              fullWidth
              variant="contained"
              size="large"
              sx={{ mt: 2 }}
              onClick={() => navigate(ROUTES.bookWithDoctor(doctor.id))}
            >
              Book Appointment
            </Button>
          </Box>
        </Stack>
      </Card>

      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2 }}>
        <Tab label="About" />
        <Tab label="Reviews" />
        <Tab label="Availability" />
      </Tabs>

      {tab === 0 && (
        <SectionCard title="About the doctor">
          <Typography color="text.secondary" sx={{ lineHeight: 1.7 }}>
            {doctor.about}
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
            <Box flex={1}>
              <Typography variant="caption" color="text.secondary" fontWeight={700} textTransform="uppercase">
                Hospital
              </Typography>
              <Typography fontWeight={600}>{doctor.hospital}</Typography>
              <Typography color="text.secondary" variant="body2">
                {doctor.city}
              </Typography>
            </Box>
            <Box flex={1}>
              <Typography variant="caption" color="text.secondary" fontWeight={700} textTransform="uppercase">
                Languages
              </Typography>
              <Typography fontWeight={600}>{doctor.languages.join(', ')}</Typography>
            </Box>
            <Box flex={1}>
              <Typography variant="caption" color="text.secondary" fontWeight={700} textTransform="uppercase">
                Consultation
              </Typography>
              <Typography fontWeight={600}>{formatCurrency(doctor.consultationFee)}</Typography>
            </Box>
          </Stack>
        </SectionCard>
      )}

      {tab === 1 && (
        <SectionCard title={`${REVIEWS.length} patient reviews`} subtitle={`Average ${doctor.rating.toFixed(1)} out of 5`}>
          <Stack spacing={2}>
            {REVIEWS.map((r) => (
              <Box key={r.id} sx={{ p: 2, borderRadius: 2, border: (t) => `1px solid ${t.palette.divider}` }}>
                <Stack direction="row" spacing={2} alignItems="flex-start">
                  <Avatar src={r.avatar} />
                  <Box flex={1}>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography fontWeight={700}>{r.name}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {r.date}
                      </Typography>
                    </Stack>
                    <Rating value={r.rating} readOnly size="small" />
                    <Typography sx={{ mt: 0.5 }} color="text.secondary">
                      {r.comment}
                    </Typography>
                  </Box>
                </Stack>
              </Box>
            ))}
          </Stack>
        </SectionCard>
      )}

      {tab === 2 && (
        <SectionCard title="Schedule" subtitle="Click below to start booking">
          <Stack spacing={2} alignItems="flex-start">
            <Stack direction="row" spacing={1}>
              <Star sx={{ color: 'warning.main' }} />
              <Typography color="text.secondary">
                The next 7 days have multiple slots available. Tap the button to view and book.
              </Typography>
            </Stack>
            <Button variant="contained" onClick={() => navigate(ROUTES.bookWithDoctor(doctor.id))}>
              View available slots
            </Button>
          </Stack>
        </SectionCard>
      )}
    </Box>
  );
};
