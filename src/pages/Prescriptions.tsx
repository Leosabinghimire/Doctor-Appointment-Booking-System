import { useMemo, useState } from 'react';
import { Box, InputAdornment, Stack, Tab, Tabs, TextField } from '@mui/material';
import { Search } from '@mui/icons-material';
import { EmptyState, Loader, PageHeader } from '@/components/ui';
import { PrescriptionCard } from '@/components/prescription';
import { usePrescriptions } from '@/hooks/prescriptions';

export const Prescriptions = () => {
  const { data, isLoading } = usePrescriptions();
  const [tab, setTab] = useState(0);
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!data) return [];
    let list = [...data];
    if (tab === 1) list = list.filter((p) => p.status === 'active');
    if (tab === 2) list = list.filter((p) => p.status === 'completed' || p.status === 'expired');
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.diagnosis.toLowerCase().includes(q) ||
          p.doctorName.toLowerCase().includes(q) ||
          p.medications.some((m) => m.name.toLowerCase().includes(q))
      );
    }
    return list;
  }, [data, tab, search]);

  return (
    <Box>
      <PageHeader title="Prescriptions" subtitle="Your medications, refills, and care plans." />

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ sm: 'center' }} sx={{ mb: 3 }}>
        <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ flex: 1 }}>
          <Tab label="All" />
          <Tab label="Active" />
          <Tab label="Past" />
        </Tabs>
        <TextField
          placeholder="Search by medication or diagnosis"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search fontSize="small" />
              </InputAdornment>
            ),
          }}
          sx={{ minWidth: 260 }}
        />
      </Stack>

      {isLoading ? (
        <Loader label="Loading prescriptions..." />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No prescriptions found"
          description="Once a doctor issues a prescription, it'll appear here."
        />
      ) : (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
            gap: 2.5,
          }}
        >
          {filtered.map((p, i) => (
            <PrescriptionCard key={p.id} prescription={p} index={i} />
          ))}
        </Box>
      )}
    </Box>
  );
};
