import { Box, Button, Stack, Typography, alpha } from '@mui/material';
import { motion } from 'framer-motion';
import type { DoctorAvailability, TimeSlot } from '@/types';
import { formatDate } from '@/utils/format';

interface Props {
  availability: DoctorAvailability[];
  selectedDate?: string;
  selectedSlot?: TimeSlot;
  onSelectDate: (date: string) => void;
  onSelectSlot: (slot: TimeSlot) => void;
}

export const TimeSlotPicker = ({
  availability,
  selectedDate,
  selectedSlot,
  onSelectDate,
  onSelectSlot,
}: Props) => {
  const activeDay = availability.find((d) => d.date === selectedDate) ?? availability[0];
  return (
    <Box>
      <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1 }}>
        Select date
      </Typography>
      <Stack direction="row" spacing={1.2} sx={{ overflowX: 'auto', pb: 1 }}>
        {availability.map((day, i) => {
          const isSelected = day.date === activeDay?.date;
          const slotsLeft = day.slots.filter((s) => s.available).length;
          return (
            <Box
              key={day.date}
              component={motion.div}
              whileHover={{ y: -2 }}
              onClick={() => onSelectDate(day.date)}
              sx={{
                px: 2,
                py: 1.5,
                minWidth: 96,
                cursor: 'pointer',
                borderRadius: 2,
                border: (t) =>
                  `1px solid ${isSelected ? t.palette.primary.main : t.palette.divider}`,
                bgcolor: (t) =>
                  isSelected
                    ? alpha(t.palette.primary.main, 0.12)
                    : 'background.paper',
                color: isSelected ? 'primary.main' : 'text.primary',
                textAlign: 'center',
                transition: 'all .2s',
              }}
            >
              <Typography variant="caption" color="text.secondary">
                {i === 0 ? 'Today' : formatDate(day.date, 'EEE')}
              </Typography>
              <Typography fontWeight={800} fontSize={18}>
                {formatDate(day.date, 'd')}
              </Typography>
              <Typography
                variant="caption"
                color={slotsLeft ? 'success.main' : day.closed ? 'text.secondary' : 'error.main'}
              >
                {slotsLeft ? `${slotsLeft} slots` : day.closed ? 'Closed' : 'Full'}
              </Typography>
            </Box>
          );
        })}
      </Stack>

      <Typography variant="subtitle1" fontWeight={700} sx={{ mt: 3, mb: 1 }}>
        Available time slots
      </Typography>
      {activeDay?.closed && (
        <Typography color="text.secondary">The doctor isn't seeing patients on this day. Please choose another date.</Typography>
      )}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: 'repeat(3, 1fr)', sm: 'repeat(4, 1fr)', md: 'repeat(5, 1fr)' },
          gap: 1.2,
        }}
      >
        {activeDay?.slots.map((slot) => {
          const isSelected = selectedSlot?.id === slot.id;
          return (
            <Button
              key={slot.id}
              disabled={!slot.available}
              variant={isSelected ? 'contained' : 'outlined'}
              onClick={() => onSelectSlot(slot)}
              sx={{
                py: 1.2,
                fontWeight: 600,
                color: isSelected ? '#fff' : slot.available ? 'text.primary' : 'text.disabled',
                borderColor: isSelected ? 'primary.main' : 'divider',
              }}
            >
              {slot.time}
            </Button>
          );
        })}
      </Box>
    </Box>
  );
};
