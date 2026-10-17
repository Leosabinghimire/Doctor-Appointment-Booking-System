import {
  Box,
  Stack,
  TextField,
  MenuItem,
  Chip,
  Button,
  InputAdornment,
  FormControlLabel,
  Switch,
  Slider,
  Typography,
} from '@mui/material';
import { Search, FilterAltOff } from '@mui/icons-material';
import { SPECIALTIES } from '@/constants';
import type { DoctorFilters as Filters } from '@/types';

interface Props {
  filters: Filters;
  onChange: (next: Filters) => void;
  /** Cities that actually have doctors. */
  cities: string[];
  /** Highest fee among all doctors — the top of the fee slider ("Any"). */
  feeCeiling: number;
}

const sortOptions = [
  { value: 'rating', label: 'Rating' },
  { value: 'experience', label: 'Experience' },
  { value: 'fee', label: 'Lowest fee' },
];

export const DoctorFilters = ({ filters, onChange, cities, feeCeiling }: Props) => {
  const update = <K extends keyof Filters>(key: K, value: Filters[K]) =>
    onChange({ ...filters, [key]: value });

  const reset = () =>
    onChange({
      search: '',
      specialty: 'All',
      city: '',
      availableToday: false,
      videoOnly: false,
      minRating: 0,
      maxFee: undefined,
      sortBy: 'rating',
    });

  const feeIsAny = filters.maxFee === undefined || filters.maxFee >= feeCeiling;

  return (
    <Box
      sx={{
        p: 2.5,
        bgcolor: 'background.paper',
        border: (t) => `1px solid ${t.palette.divider}`,
        borderRadius: 3,
        mb: 3,
      }}
    >
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ md: 'center' }}>
        <TextField
          fullWidth
          placeholder="Search by name, specialty, hospital"
          value={filters.search ?? ''}
          onChange={(e) => update('search', e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search fontSize="small" />
              </InputAdornment>
            ),
          }}
          sx={{ flex: 1.4 }}
        />
        <TextField
          select
          label="Specialty"
          value={filters.specialty ?? 'All'}
          onChange={(e) => update('specialty', e.target.value as Filters['specialty'])}
          sx={{ minWidth: 180 }}
        >
          <MenuItem value="All">All specialties</MenuItem>
          {SPECIALTIES.map((s) => (
            <MenuItem key={s} value={s}>
              {s}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          label="City"
          value={filters.city ?? ''}
          onChange={(e) => update('city', e.target.value)}
          sx={{ minWidth: 160 }}
        >
          <MenuItem value="">All cities</MenuItem>
          {cities.map((c) => (
            <MenuItem key={c} value={c}>
              {c}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          label="Sort by"
          value={filters.sortBy ?? 'rating'}
          onChange={(e) => update('sortBy', e.target.value as Filters['sortBy'])}
          sx={{ minWidth: 140 }}
        >
          {sortOptions.map((o) => (
            <MenuItem key={o.value} value={o.value}>
              {o.label}
            </MenuItem>
          ))}
        </TextField>
      </Stack>

      <Stack
        direction={{ xs: 'column', md: 'row' }}
        spacing={3}
        alignItems={{ md: 'center' }}
        sx={{ mt: 2 }}
      >
        <FormControlLabel
          control={
            <Switch
              checked={filters.availableToday ?? false}
              onChange={(e) => update('availableToday', e.target.checked)}
            />
          }
          label="Available today"
        />
        <FormControlLabel
          control={
            <Switch
              checked={filters.videoOnly ?? false}
              onChange={(e) => update('videoOnly', e.target.checked)}
            />
          }
          label="Video consult"
        />
        <Box sx={{ minWidth: 200 }}>
          <Typography variant="caption" color="text.secondary">
            Min rating: {(filters.minRating ?? 0).toFixed(1)}
          </Typography>
          <Slider
            value={filters.minRating ?? 0}
            min={0}
            max={5}
            step={0.5}
            onChange={(_, v) => update('minRating', v as number)}
          />
        </Box>
        <Box sx={{ minWidth: 200 }}>
          <Typography variant="caption" color="text.secondary">
            Max fee: {feeIsAny ? 'Any' : `$${filters.maxFee}`}
          </Typography>
          <Slider
            value={feeIsAny ? feeCeiling : filters.maxFee}
            min={0}
            max={feeCeiling}
            step={10}
            // At the top of the range, remove the limit so no doctor is hidden.
            onChange={(_, v) => update('maxFee', (v as number) >= feeCeiling ? undefined : (v as number))}
          />
        </Box>
        <Button
          variant="outlined"
          color="inherit"
          startIcon={<FilterAltOff />}
          onClick={reset}
          sx={{ ml: 'auto' }}
        >
          Reset
        </Button>
      </Stack>

      {filters.specialty && filters.specialty !== 'All' && (
        <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
          <Chip
            label={filters.specialty}
            color="primary"
            variant="outlined"
            onDelete={() => update('specialty', 'All')}
          />
        </Stack>
      )}
    </Box>
  );
};
