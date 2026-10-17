import { useMemo, useState } from 'react';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  Chip,
  IconButton,
  InputAdornment,
  Snackbar,
  Stack,
  Tab,
  Tabs,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  Add,
  Archive,
  CalendarMonth,
  Edit,
  LocalHospital,
  MedicalServices,
  Search,
  Unarchive,
  Videocam,
} from '@mui/icons-material';
import { ConfirmDialog, EmptyState, Loader, PageHeader } from '@/components/ui';
import { useAdminDoctors, useSetDoctorActive } from '@/hooks/admin';
import { formatCurrency, initials } from '@/utils/format';
import type { AdminDoctor, ApiError } from '@/types';
import { DoctorFormDialog } from './DoctorFormDialog';
import { ScheduleDialog } from './ScheduleDialog';

type Toast = { severity: 'success' | 'warning' | 'error'; message: string } | null;

export const ManageDoctors = () => {
  const { data: doctors, isLoading } = useAdminDoctors();
  const setActive = useSetDoctorActive();

  const [tab, setTab] = useState<'active' | 'archived'>('active');
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState<AdminDoctor | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [archiving, setArchiving] = useState<AdminDoctor | null>(null);
  const [scheduling, setScheduling] = useState<AdminDoctor | null>(null);
  const [toast, setToast] = useState<Toast>(null);

  const counts = useMemo(
    () => ({
      active: doctors?.filter((d) => d.active).length ?? 0,
      archived: doctors?.filter((d) => !d.active).length ?? 0,
    }),
    [doctors]
  );

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    return (doctors ?? [])
      .filter((d) => d.active === (tab === 'active'))
      .filter(
        (d) =>
          !q ||
          d.name.toLowerCase().includes(q) ||
          d.specialty.toLowerCase().includes(q) ||
          d.hospital.toLowerCase().includes(q) ||
          d.city.toLowerCase().includes(q)
      );
  }, [doctors, tab, search]);

  const openAdd = () => {
    setEditing(null);
    setFormOpen(true);
  };
  const openEdit = (doctor: AdminDoctor) => {
    setEditing(doctor);
    setFormOpen(true);
  };

  const changeStatus = (doctor: AdminDoctor, active: boolean) =>
    setActive.mutate(
      { id: doctor.id, active },
      {
        onSuccess: () =>
          setToast({
            severity: 'success',
            message: active ? `${doctor.name} is visible to patients again.` : `${doctor.name} archived.`,
          }),
        onError: (err) => setToast({ severity: 'error', message: (err as unknown as ApiError).message }),
      }
    );

  return (
    <Box>
      <PageHeader
        title="Manage doctors"
        subtitle="Add your clinic's doctors, keep their details current, and archive doctors who have left."
        actions={
          <Button variant="contained" startIcon={<Add />} onClick={openAdd}>
            Add doctor
          </Button>
        }
      />

      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ md: 'center' }} sx={{ mb: 3 }}>
        <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ flex: 1 }}>
          <Tab value="active" label={`Active (${counts.active})`} />
          <Tab value="archived" label={`Archived (${counts.archived})`} />
        </Tabs>
        <TextField
          placeholder="Search name, specialty, hospital, city"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          size="small"
          sx={{ minWidth: { md: 340 } }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search fontSize="small" />
              </InputAdornment>
            ),
          }}
        />
      </Stack>

      {isLoading ? (
        <Loader label="Loading doctors..." />
      ) : visible.length === 0 ? (
        <EmptyState
          icon={<MedicalServices sx={{ fontSize: 36 }} />}
          title={search ? 'No doctors match your search' : tab === 'active' ? 'No doctors yet' : 'No archived doctors'}
          description={
            tab === 'active' && !search
              ? 'Add your first doctor so patients can find and book them.'
              : 'Try a different search.'
          }
          actionLabel={tab === 'active' && !search ? 'Add doctor' : undefined}
          onAction={tab === 'active' && !search ? openAdd : undefined}
        />
      ) : (
        <Stack spacing={1.5}>
          {visible.map((d) => (
            <Card key={d.id} sx={{ p: 2, opacity: d.active ? 1 : 0.75 }}>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ sm: 'center' }}>
                <Avatar src={d.avatar || undefined} sx={{ width: 52, height: 52 }}>
                  {initials(d.name)}
                </Avatar>
                <Box flex={1} minWidth={0}>
                  <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" rowGap={0.5}>
                    <Typography fontWeight={700}>{d.name}</Typography>
                    {d.reviewCount === 0 && <Chip label="New" size="small" color="primary" variant="outlined" />}
                    {!d.active && <Chip label="Archived" size="small" />}
                  </Stack>
                  <Typography variant="body2" color="text.secondary">
                    {d.specialty} • {d.qualifications} • {d.hospital}, {d.city}
                  </Typography>
                  <Stack direction="row" spacing={1} sx={{ mt: 0.8 }} flexWrap="wrap" rowGap={0.5}>
                    <Chip size="small" label={formatCurrency(d.consultationFee)} variant="outlined" />
                    {d.videoConsult && (
                      <Chip size="small" icon={<Videocam sx={{ fontSize: 14 }} />} label="Video" variant="outlined" />
                    )}
                    {d.inPersonConsult && (
                      <Chip size="small" icon={<LocalHospital sx={{ fontSize: 14 }} />} label="In-person" variant="outlined" />
                    )}
                    <Chip
                      size="small"
                      label={`${d.upcomingAppointments} upcoming ${d.upcomingAppointments === 1 ? 'visit' : 'visits'}`}
                      color={d.upcomingAppointments > 0 ? 'info' : 'default'}
                      variant="outlined"
                    />
                  </Stack>
                </Box>
                <Stack direction="row" spacing={0.5}>
                  <Tooltip title="Schedule and time off">
                    <IconButton onClick={() => setScheduling(d)} aria-label={`Schedule for ${d.name}`}>
                      <CalendarMonth />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Edit">
                    <IconButton onClick={() => openEdit(d)} aria-label={`Edit ${d.name}`}>
                      <Edit />
                    </IconButton>
                  </Tooltip>
                  {d.active ? (
                    <Tooltip title="Archive">
                      <IconButton onClick={() => setArchiving(d)} aria-label={`Archive ${d.name}`} color="warning">
                        <Archive />
                      </IconButton>
                    </Tooltip>
                  ) : (
                    <Tooltip title="Restore">
                      <IconButton onClick={() => changeStatus(d, true)} aria-label={`Restore ${d.name}`} color="primary">
                        <Unarchive />
                      </IconButton>
                    </Tooltip>
                  )}
                </Stack>
              </Stack>
            </Card>
          ))}
        </Stack>
      )}

      <DoctorFormDialog
        open={formOpen}
        doctor={editing}
        onClose={() => setFormOpen(false)}
        onSaved={(message, severity = 'success') => setToast({ severity, message })}
      />

      <ScheduleDialog doctor={scheduling} onClose={() => setScheduling(null)} />

      <ConfirmDialog
        open={Boolean(archiving)}
        title={`Archive ${archiving?.name ?? 'doctor'}?`}
        message={
          archiving && archiving.upcomingAppointments > 0
            ? `Patients will no longer see or book this doctor. Their ${archiving.upcomingAppointments} upcoming ${
                archiving.upcomingAppointments === 1 ? 'visit stays' : 'visits stay'
              } booked — contact those patients if the visits can't go ahead. You can restore the doctor later.`
            : 'Patients will no longer see or book this doctor. Past appointments are kept. You can restore the doctor later.'
        }
        confirmLabel="Archive"
        destructive
        onConfirm={() => {
          if (archiving) changeStatus(archiving, false);
          setArchiving(null);
        }}
        onClose={() => setArchiving(null)}
      />

      <Snackbar
        open={Boolean(toast)}
        autoHideDuration={toast?.severity === 'warning' ? 8000 : 3000}
        onClose={() => setToast(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity={toast?.severity ?? 'success'} variant="filled">
          {toast?.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};
