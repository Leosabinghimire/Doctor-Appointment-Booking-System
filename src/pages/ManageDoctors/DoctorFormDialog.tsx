import { FormEvent, useEffect, useState } from 'react';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  InputAdornment,
  MenuItem,
  Stack,
  Switch,
  TextField,
} from '@mui/material';
import { SPECIALTIES } from '@/constants';
import { useSaveDoctor } from '@/hooks/admin';
import { initials } from '@/utils/format';
import type { AdminDoctor, ApiError, DoctorInput, DoctorSpecialty } from '@/types';

interface DoctorFormDialogProps {
  open: boolean;
  /** The doctor being edited, or null to add a new one. */
  doctor: AdminDoctor | null;
  onClose: () => void;
  onSaved: (message: string) => void;
}

/** Form state keeps numbers and the language list as text while the admin types. */
interface FormState {
  name: string;
  specialty: DoctorSpecialty | '';
  qualifications: string;
  experience: string;
  consultationFee: string;
  hospital: string;
  city: string;
  avatar: string;
  about: string;
  languages: string;
  videoConsult: boolean;
  inPersonConsult: boolean;
}

const EMPTY: FormState = {
  name: '',
  specialty: '',
  qualifications: '',
  experience: '',
  consultationFee: '',
  hospital: '',
  city: '',
  avatar: '',
  about: '',
  languages: '',
  videoConsult: true,
  inPersonConsult: true,
};

const fromDoctor = (d: AdminDoctor): FormState => ({
  name: d.name,
  specialty: d.specialty,
  qualifications: d.qualifications,
  experience: String(d.experience),
  consultationFee: String(d.consultationFee),
  hospital: d.hospital,
  city: d.city,
  avatar: d.avatar,
  about: d.about,
  languages: d.languages.join(', '),
  videoConsult: d.videoConsult,
  inPersonConsult: d.inPersonConsult,
});

const toInput = (f: FormState): DoctorInput => ({
  name: f.name,
  specialty: f.specialty as DoctorSpecialty,
  qualifications: f.qualifications,
  // Empty stays NaN (sent as null) so the server reports it as missing instead of saving 0.
  experience: f.experience.trim() === '' ? NaN : Number(f.experience),
  consultationFee: f.consultationFee.trim() === '' ? NaN : Number(f.consultationFee),
  hospital: f.hospital,
  city: f.city,
  avatar: f.avatar,
  about: f.about,
  languages: f.languages.split(',').map((l) => l.trim()).filter(Boolean),
  videoConsult: f.videoConsult,
  inPersonConsult: f.inPersonConsult,
});

export const DoctorFormDialog = ({ open, doctor, onClose, onSaved }: DoctorFormDialogProps) => {
  const [form, setForm] = useState<FormState>(EMPTY);
  const save = useSaveDoctor();
  const isEdit = Boolean(doctor);

  useEffect(() => {
    if (open) {
      setForm(doctor ? fromDoctor(doctor) : EMPTY);
      save.reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- reset only when the dialog opens
  }, [open, doctor]);

  const set = (field: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));
  const toggle = (field: 'videoConsult' | 'inPersonConsult') => (_: unknown, checked: boolean) =>
    setForm((f) => ({ ...f, [field]: checked }));

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    save.mutate(
      { id: doctor?.id, input: toInput(form) },
      {
        onSuccess: (saved) => {
          onSaved(isEdit ? `${saved.name} updated.` : `${saved.name} added.`);
          onClose();
        },
      }
    );
  };

  const errorMessage = (save.error as ApiError | null)?.message;

  return (
    <Dialog open={open} onClose={save.isPending ? undefined : onClose} fullWidth maxWidth="md">
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <DialogTitle>{isEdit ? 'Edit doctor' : 'Add doctor'}</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2.5}>
            {errorMessage && <Alert severity="error">{errorMessage}</Alert>}

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ sm: 'center' }}>
              <Avatar src={form.avatar || undefined} sx={{ width: 64, height: 64 }}>
                {form.name ? initials(form.name) : '?'}
              </Avatar>
              <TextField
                label="Photo URL (optional)"
                placeholder="https://…"
                value={form.avatar}
                onChange={set('avatar')}
                fullWidth
                helperText="Leave empty to show initials"
              />
            </Stack>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField label="Full name" placeholder="Dr. …" value={form.name} onChange={set('name')} required fullWidth />
              <TextField select label="Specialty" value={form.specialty} onChange={set('specialty')} required fullWidth>
                {SPECIALTIES.map((s) => (
                  <MenuItem key={s} value={s}>
                    {s}
                  </MenuItem>
                ))}
              </TextField>
            </Stack>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                label="Qualifications"
                placeholder="MBBS, MD"
                value={form.qualifications}
                onChange={set('qualifications')}
                required
                fullWidth
              />
              <TextField
                label="Experience"
                type="number"
                value={form.experience}
                onChange={set('experience')}
                required
                InputProps={{ endAdornment: <InputAdornment position="end">years</InputAdornment> }}
                InputLabelProps={{ shrink: true }}
                inputProps={{ min: 0, max: 70, step: 1 }}
                sx={{ minWidth: { sm: 160 } }}
              />
              <TextField
                label="Consultation fee"
                type="number"
                value={form.consultationFee}
                onChange={set('consultationFee')}
                required
                InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
                inputProps={{ min: 0, step: 1 }}
                sx={{ minWidth: { sm: 180 } }}
              />
            </Stack>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField label="Hospital / clinic" value={form.hospital} onChange={set('hospital')} required fullWidth />
              <TextField label="City" value={form.city} onChange={set('city')} required fullWidth />
            </Stack>

            <TextField
              label="Languages"
              placeholder="English, Nepali"
              value={form.languages}
              onChange={set('languages')}
              helperText="Separate with commas"
              required
            />

            <TextField
              label="About"
              value={form.about}
              onChange={set('about')}
              multiline
              minRows={3}
              helperText="Shown on the doctor's profile page"
            />

            <Stack direction="row" spacing={3}>
              <FormControlLabel
                control={<Switch checked={form.videoConsult} onChange={toggle('videoConsult')} />}
                label="Video consults"
              />
              <FormControlLabel
                control={<Switch checked={form.inPersonConsult} onChange={toggle('inPersonConsult')} />}
                label="In-person visits"
              />
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={onClose} disabled={save.isPending} color="inherit">
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={save.isPending}>
            {save.isPending ? 'Saving...' : isEdit ? 'Save changes' : 'Add doctor'}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};
