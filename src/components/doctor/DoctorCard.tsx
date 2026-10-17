import {
  Avatar,
  Box,
  Card,
  Chip,
  Stack,
  Typography,
  Button,
  Rating,
} from '@mui/material';
import { Videocam, LocationOn, Verified, AccessTime } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import type { Doctor } from '@/types';
import { formatCurrency, initials } from '@/utils/format';
import { ROUTES } from '@/constants';

interface Props {
  doctor: Doctor;
  index?: number;
}

export const DoctorCard = ({ doctor, index = 0 }: Props) => {
  const navigate = useNavigate();
  return (
    <Card
      component={motion.div}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.04 }}
      whileHover={{ y: -4 }}
      sx={{
        p: 2.5,
        cursor: 'pointer',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
      onClick={() => navigate(ROUTES.doctorDetail(doctor.id))}
    >
      <Stack direction="row" spacing={2} alignItems="flex-start">
        <Box sx={{ position: 'relative' }}>
          <Avatar src={doctor.avatar || undefined} sx={{ width: 64, height: 64 }}>
            {initials(doctor.name)}
          </Avatar>
          {doctor.availableToday && (
            <Box
              sx={{
                position: 'absolute',
                bottom: 2,
                right: 2,
                width: 14,
                height: 14,
                borderRadius: '50%',
                bgcolor: 'success.main',
                border: (t) => `2px solid ${t.palette.background.paper}`,
              }}
            />
          )}
        </Box>
        <Box flex={1} minWidth={0}>
          <Stack direction="row" spacing={0.5} alignItems="center">
            <Typography variant="subtitle1" fontWeight={700} noWrap>
              {doctor.name}
            </Typography>
            <Verified sx={{ fontSize: 16, color: 'primary.main' }} />
          </Stack>
          <Typography color="text.secondary" variant="body2">
            {doctor.specialty} • {doctor.qualifications}
          </Typography>
          {doctor.reviewCount > 0 ? (
            <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mt: 0.5 }}>
              <Rating value={doctor.rating} precision={0.1} size="small" readOnly />
              <Typography variant="caption" color="text.secondary">
                {doctor.rating.toFixed(1)} ({doctor.reviewCount})
              </Typography>
            </Stack>
          ) : (
            <Chip label="New" size="small" color="primary" variant="outlined" sx={{ mt: 0.5, height: 20 }} />
          )}
        </Box>
      </Stack>

      <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mt: 2, gap: 0.8 }}>
        <Chip
          size="small"
          variant="outlined"
          icon={<AccessTime sx={{ fontSize: 14 }} />}
          label={`${doctor.experience} yrs exp`}
          sx={{ color: 'text.secondary' }}
        />
        {doctor.videoConsult && (
          <Chip
            size="small"
            variant="outlined"
            icon={<Videocam sx={{ fontSize: 14 }} />}
            label="Video"
            sx={{ color: 'text.secondary' }}
          />
        )}
      </Stack>

      <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mt: 1.5 }}>
        <LocationOn sx={{ fontSize: 16, color: 'text.secondary' }} />
        <Typography variant="caption" color="text.secondary" noWrap>
          {doctor.hospital}, {doctor.city}
        </Typography>
      </Stack>

      <Box flex={1} />

      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{
          mt: 2,
          pt: 2,
          borderTop: (t) => `1px dashed ${t.palette.divider}`,
        }}
      >
        <Box>
          <Typography variant="caption" color="text.secondary">
            Next slot
          </Typography>
          <Typography fontWeight={700} fontSize={14} color="primary.main">
            {doctor.nextSlot}
          </Typography>
        </Box>
        <Box textAlign="right">
          <Typography variant="caption" color="text.secondary">
            From
          </Typography>
          <Typography fontWeight={800} fontSize={16}>
            {formatCurrency(doctor.consultationFee)}
          </Typography>
        </Box>
      </Stack>

      <Button
        fullWidth
        variant="contained"
        sx={{ mt: 2 }}
        onClick={(e) => {
          e.stopPropagation();
          navigate(ROUTES.bookWithDoctor(doctor.id));
        }}
      >
        Book Appointment
      </Button>
    </Card>
  );
};
