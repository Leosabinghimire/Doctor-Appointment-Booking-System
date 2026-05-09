import { Box, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import { LocalHospital, Videocam } from '@mui/icons-material';
import { Loader } from '@/components/ui';
import { TimeSlotPicker } from '@/components/appointment';
import type { AppointmentType, DoctorAvailability, TimeSlot } from '@/types';

interface SlotSelectStepProps {
  loading: boolean;
  availability?: DoctorAvailability[];
  selectedDate?: string;
  selectedSlot?: TimeSlot;
  type: AppointmentType;
  onTypeChange: (type: AppointmentType) => void;
  onSelectDate: (date: string) => void;
  onSelectSlot: (slot: TimeSlot) => void;
}

export const SlotSelectStep = ({
  loading,
  availability,
  selectedDate,
  selectedSlot,
  type,
  onTypeChange,
  onSelectDate,
  onSelectSlot,
}: SlotSelectStepProps) => (
  <Box>
    <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
      Choose visit type & slot
    </Typography>
    <ToggleButtonGroup
      exclusive
      value={type}
      onChange={(_, v) => v && onTypeChange(v)}
      sx={{ mb: 3 }}
    >
      <ToggleButton value="video" sx={{ px: 3 }}>
        <Videocam sx={{ mr: 1 }} fontSize="small" /> Video consult
      </ToggleButton>
      <ToggleButton value="in-person" sx={{ px: 3 }}>
        <LocalHospital sx={{ mr: 1 }} fontSize="small" /> In-person
      </ToggleButton>
    </ToggleButtonGroup>

    {loading ? (
      <Loader label="Loading availability..." />
    ) : availability ? (
      <TimeSlotPicker
        availability={availability}
        selectedDate={selectedDate}
        selectedSlot={selectedSlot}
        onSelectDate={onSelectDate}
        onSelectSlot={onSelectSlot}
      />
    ) : null}
  </Box>
);
