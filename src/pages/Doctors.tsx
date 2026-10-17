import { useMemo, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { EmptyState, PageHeader, SkeletonCards } from '@/components/ui';
import { DoctorCard, DoctorFilters } from '@/components/doctor';
import { useDoctors } from '@/hooks/doctors';
import { useDebounce } from '@/hooks/common';
import type { DoctorFilters as Filters } from '@/types';

const INITIAL_FILTERS: Filters = {
  search: '',
  specialty: 'All',
  city: '',
  availableToday: false,
  videoOnly: false,
  minRating: 0,
  maxFee: undefined,
  sortBy: 'rating',
};

export const Doctors = () => {
  const [filters, setFilters] = useState<Filters>(INITIAL_FILTERS);
  const debouncedSearch = useDebounce(filters.search, 350);
  const queryFilters = useMemo(() => ({ ...filters, search: debouncedSearch }), [filters, debouncedSearch]);
  const { data: doctors, isLoading } = useDoctors(queryFilters);
  // Unfiltered list, for the filter options themselves.
  const { data: allDoctors } = useDoctors();
  const cities = useMemo(
    () => [...new Set((allDoctors ?? []).map((d) => d.city))].sort((a, b) => a.localeCompare(b)),
    [allDoctors]
  );
  const feeCeiling = useMemo(
    () => Math.max(10, Math.ceil(Math.max(0, ...(allDoctors ?? []).map((d) => d.consultationFee)) / 10) * 10),
    [allDoctors]
  );

  return (
    <Box>
      <PageHeader
        title="Find your specialist"
        subtitle="Browse trusted, board-certified doctors and book in seconds."
      />
      <DoctorFilters filters={filters} onChange={setFilters} cities={cities} feeCeiling={feeCeiling} />

      {isLoading ? (
        <SkeletonCards count={6} />
      ) : !doctors || doctors.length === 0 ? (
        <EmptyState
          title="No doctors match your filters"
          description="Try adjusting specialty, city, or removing rating/fee filters."
        />
      ) : (
        <>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
            {doctors.length} doctors found
          </Typography>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
              gap: 2.5,
            }}
          >
            {doctors.map((d, i) => (
              <DoctorCard key={d.id} doctor={d} index={i} />
            ))}
          </Box>
        </>
      )}
    </Box>
  );
};
