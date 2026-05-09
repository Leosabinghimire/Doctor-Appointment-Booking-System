import { Avatar, Box, Chip, MenuItem, Stack, TextField, Typography } from '@mui/material';
import { useDoctors } from '@/hooks/doctors';
import type { Doctor } from '@/types';

interface DoctorSelectStepProps {
  selectedDoctorId?: string;
  doctor?: Doctor;
  onChange: (id: string) => void;
}

export const DoctorSelectStep = ({ selectedDoctorId, doctor, onChange }: DoctorSelectStepProps) => {
  const { data: doctors } = useDoctors();
  return (
    <Box>
      <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
        Choose a doctor
      </Typography>
      <TextField
        select
        fullWidth
        label="Doctor"
        value={selectedDoctorId ?? ''}
        onChange={(e) => onChange(e.target.value)}
      >
        {doctors?.map((d) => (
          <MenuItem key={d.id} value={d.id}>
            {d.name} • {d.specialty}
          </MenuItem>
        ))}
      </TextField>
      {doctor && (
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mt: 3 }}>
          <Avatar src={doctor.avatar} sx={{ width: 64, height: 64 }} />
          <Box>
            <Typography fontWeight={700}>{doctor.name}</Typography>
            <Typography color="text.secondary">{doctor.specialty}</Typography>
            <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
              {doctor.videoConsult && <Chip label="Video" size="small" color="success" variant="outlined" />}
              {doctor.inPersonConsult && <Chip label="In-person" size="small" color="primary" variant="outlined" />}
            </Stack>
          </Box>
        </Stack>
      )}
    </Box>
  );
};
