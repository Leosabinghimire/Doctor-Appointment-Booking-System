import { FormEvent, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Checkbox,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControlLabel,
  IconButton,
  Stack,
  Switch,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { Delete } from '@mui/icons-material';
import { Loader } from '@/components/ui';
import { useChangeSchedule, useDoctorSchedule } from '@/hooks/admin';
import { formatDate } from '@/utils/format';
import { DEFAULT_WEEKLY_SCHEDULE, SLOT_MINUTES, WEEKDAY_NAMES, scheduleProblems, slotsForDay } from '@/utils/schedule';
import type { AdminDoctor, ApiError, ScheduleChangeResult, WeeklySchedule, WorkingDay } from '@/types';

// Monday first, Sunday last — how most clinics read a week. Values are WeeklySchedule indexes.
const DISPLAY_ORDER = [1, 2, 3, 4, 5, 6, 0];
const NEW_DAY: WorkingDay = { start: '09:00', end: '17:00' };
const TIME_INPUT = { step: 300 } as const; // 5-minute steps in the time picker

interface ScheduleDialogProps {
  doctor: AdminDoctor | null;
  onClose: () => void;
}

type Notice = { severity: 'success' | 'warning' | 'error'; message: string } | null;

const sameWeek = (a: WeeklySchedule, b: WeeklySchedule) => JSON.stringify(a) === JSON.stringify(b);

export const ScheduleDialog = ({ doctor, onClose }: ScheduleDialogProps) => {
  const doctorId = doctor?.id;
  const { data: schedule, isLoading } = useDoctorSchedule(doctorId);
  const change = useChangeSchedule(doctorId ?? '');

  const [draft, setDraft] = useState<WeeklySchedule>(DEFAULT_WEEKLY_SCHEDULE);
  const [notice, setNotice] = useState<Notice>(null);
  const [timeOff, setTimeOff] = useState({ startDay: '', endDay: '', reason: '' });

  // Load the saved hours whenever a different doctor's schedule arrives.
  useEffect(() => {
    if (schedule) setDraft(schedule.weekly);
  }, [schedule]);

  // Reopening the dialog discards unsaved edits.
  useEffect(() => {
    if (schedule) setDraft(schedule.weekly);
    setNotice(null);
    setTimeOff({ startDay: '', endDay: '', reason: '' });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only when the dialog opens for a doctor
  }, [doctorId]);

  const problems = useMemo(() => scheduleProblems(draft), [draft]);
  const dirty = Boolean(schedule) && !sameWeek(draft, schedule!.weekly);

  const setDay = (index: number, day: WorkingDay | null) =>
    setDraft((week) => week.map((d, i) => (i === index ? day : d)));

  const report = (done: string) => (result: ScheduleChangeResult) => {
    const n = result.affectedAppointments;
    setNotice(
      n > 0
        ? {
            severity: 'warning',
            message: `${done} ${n} upcoming ${n === 1 ? 'visit is' : 'visits are'} outside the new availability. ${
              n === 1 ? 'It stays' : 'They stay'
            } booked — contact ${n === 1 ? 'that patient' : 'those patients'} if needed.`,
          }
        : { severity: 'success', message: done }
    );
  };
  const fail = (err: unknown) => setNotice({ severity: 'error', message: (err as ApiError).message });

  const saveWeekly = (weekly: WeeklySchedule | null, done: string) =>
    change.mutate({ kind: 'weekly', weekly }, { onSuccess: report(done), onError: fail });

  const addTimeOff = (e: FormEvent) => {
    e.preventDefault();
    change.mutate(
      { kind: 'addTimeOff', entry: { ...timeOff, endDay: timeOff.endDay || timeOff.startDay } },
      {
        onSuccess: (result) => {
          setTimeOff({ startDay: '', endDay: '', reason: '' });
          report('Time off added.')(result);
        },
        onError: fail,
      }
    );
  };

  return (
    <Dialog open={Boolean(doctor)} onClose={change.isPending ? undefined : onClose} fullWidth maxWidth="md">
      <DialogTitle>
        Schedule — {doctor?.name}
        <Typography variant="body2" color="text.secondary">
          Patients can book {SLOT_MINUTES}-minute visits in these hours, up to 7 days ahead.
        </Typography>
      </DialogTitle>
      <DialogContent dividers>
        {isLoading || !schedule ? (
          <Loader label="Loading schedule..." />
        ) : (
          <Stack spacing={3}>
            {notice && (
              <Alert severity={notice.severity} onClose={() => setNotice(null)}>
                {notice.message}
              </Alert>
            )}

            <Box>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
                <Typography variant="h6" fontWeight={700}>
                  Weekly hours
                </Typography>
                {schedule.isDefault && !dirty && <Chip size="small" label="Clinic default" variant="outlined" />}
              </Stack>

              <Stack divider={<Divider flexItem />} spacing={1}>
                {DISPLAY_ORDER.map((index) => {
                  const day = draft[index];
                  const slots = slotsForDay(day);
                  const dayProblems = problems.filter((p) => p.startsWith(`${WEEKDAY_NAMES[index]}:`));
                  const hasBreak = Boolean(day?.breakStart || day?.breakEnd);
                  return (
                    <Stack
                      key={index}
                      direction={{ xs: 'column', md: 'row' }}
                      spacing={1.5}
                      alignItems={{ md: 'center' }}
                      sx={{ py: 0.5 }}
                    >
                      <FormControlLabel
                        sx={{ minWidth: 150 }}
                        control={
                          <Switch checked={Boolean(day)} onChange={(_, on) => setDay(index, on ? { ...NEW_DAY } : null)} />
                        }
                        label={<Typography fontWeight={600}>{WEEKDAY_NAMES[index]}</Typography>}
                      />
                      {day ? (
                        <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap flex={1}>
                          <TextField
                            type="time"
                            size="small"
                            label="From"
                            value={day.start}
                            onChange={(e) => setDay(index, { ...day, start: e.target.value })}
                            inputProps={TIME_INPUT}
                            InputLabelProps={{ shrink: true }}
                          />
                          <TextField
                            type="time"
                            size="small"
                            label="To"
                            value={day.end}
                            onChange={(e) => setDay(index, { ...day, end: e.target.value })}
                            inputProps={TIME_INPUT}
                            InputLabelProps={{ shrink: true }}
                          />
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={hasBreak}
                                onChange={(_, on) =>
                                  setDay(
                                    index,
                                    on
                                      ? { ...day, breakStart: '12:00', breakEnd: '13:00' }
                                      : { start: day.start, end: day.end }
                                  )
                                }
                              />
                            }
                            label="Break"
                          />
                          {hasBreak && (
                            <>
                              <TextField
                                type="time"
                                size="small"
                                label="Break from"
                                value={day.breakStart ?? ''}
                                onChange={(e) => setDay(index, { ...day, breakStart: e.target.value })}
                                inputProps={TIME_INPUT}
                                InputLabelProps={{ shrink: true }}
                              />
                              <TextField
                                type="time"
                                size="small"
                                label="Break to"
                                value={day.breakEnd ?? ''}
                                onChange={(e) => setDay(index, { ...day, breakEnd: e.target.value })}
                                inputProps={TIME_INPUT}
                                InputLabelProps={{ shrink: true }}
                              />
                            </>
                          )}
                        </Stack>
                      ) : (
                        <Typography color="text.secondary" flex={1}>
                          Not working
                        </Typography>
                      )}
                      <Typography
                        variant="caption"
                        color={dayProblems.length ? 'error' : 'text.secondary'}
                        sx={{ minWidth: { md: 170 }, textAlign: { md: 'right' } }}
                      >
                        {dayProblems.length
                          ? dayProblems.map((p) => p.replace(`${WEEKDAY_NAMES[index]}: `, '')).join('; ')
                          : day
                            ? `${slots.length} slots · ${slots[0]?.time ?? ''}–${slots[slots.length - 1]?.time ?? ''}`
                            : ''}
                      </Typography>
                    </Stack>
                  );
                })}
              </Stack>

              <Stack direction="row" spacing={1} justifyContent="flex-end" sx={{ mt: 2 }} flexWrap="wrap" useFlexGap>
                {!schedule.isDefault && (
                  <Button
                    color="inherit"
                    disabled={change.isPending}
                    onClick={() => saveWeekly(null, 'Back to the clinic default hours.')}
                  >
                    Use clinic default
                  </Button>
                )}
                {dirty && (
                  <Button color="inherit" disabled={change.isPending} onClick={() => setDraft(schedule.weekly)}>
                    Undo changes
                  </Button>
                )}
                <Button
                  variant="contained"
                  disabled={!dirty || problems.length > 0 || change.isPending}
                  onClick={() => saveWeekly(draft, 'Weekly hours saved.')}
                >
                  Save hours
                </Button>
              </Stack>
            </Box>

            <Divider />

            <Box>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 0.5 }}>
                Time off
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                Holidays, leave or conferences. Patients can't book on these days.
              </Typography>

              {schedule.timeOff.length === 0 ? (
                <Typography color="text.secondary" sx={{ mb: 2 }}>
                  No upcoming time off.
                </Typography>
              ) : (
                <Stack spacing={1} sx={{ mb: 2 }}>
                  {schedule.timeOff.map((t) => (
                    <Stack
                      key={t.id}
                      direction="row"
                      alignItems="center"
                      spacing={2}
                      sx={{ px: 1.5, py: 1, borderRadius: 2, border: (th) => `1px solid ${th.palette.divider}` }}
                    >
                      <Box flex={1}>
                        <Typography fontWeight={600}>
                          {t.startDay === t.endDay
                            ? formatDate(t.startDay, 'EEE, MMM d, yyyy')
                            : `${formatDate(t.startDay, 'MMM d')} – ${formatDate(t.endDay, 'MMM d, yyyy')}`}
                        </Typography>
                        {t.reason && (
                          <Typography variant="body2" color="text.secondary">
                            {t.reason}
                          </Typography>
                        )}
                      </Box>
                      <Tooltip title="Remove">
                        <IconButton
                          aria-label="Remove time off"
                          disabled={change.isPending}
                          onClick={() =>
                            change.mutate(
                              { kind: 'removeTimeOff', timeOffId: t.id },
                              { onSuccess: report('Time off removed.'), onError: fail }
                            )
                          }
                        >
                          <Delete />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  ))}
                </Stack>
              )}

              <Stack
                component="form"
                onSubmit={addTimeOff}
                direction={{ xs: 'column', sm: 'row' }}
                spacing={1.5}
                alignItems={{ sm: 'flex-start' }}
              >
                <TextField
                  type="date"
                  size="small"
                  label="From"
                  value={timeOff.startDay}
                  onChange={(e) => setTimeOff((t) => ({ ...t, startDay: e.target.value }))}
                  InputLabelProps={{ shrink: true }}
                  required
                />
                <TextField
                  type="date"
                  size="small"
                  label="To"
                  value={timeOff.endDay}
                  onChange={(e) => setTimeOff((t) => ({ ...t, endDay: e.target.value }))}
                  InputLabelProps={{ shrink: true }}
                  helperText="Leave empty for one day"
                />
                <TextField
                  size="small"
                  label="Reason (optional)"
                  value={timeOff.reason}
                  onChange={(e) => setTimeOff((t) => ({ ...t, reason: e.target.value }))}
                  sx={{ flex: 1 }}
                  inputProps={{ maxLength: 200 }}
                />
                <Button type="submit" variant="outlined" disabled={!timeOff.startDay || change.isPending}>
                  Add time off
                </Button>
              </Stack>
            </Box>
          </Stack>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        {dirty && (
          <Typography variant="body2" color="warning.main" sx={{ mr: 'auto' }}>
            Weekly hours have unsaved changes.
          </Typography>
        )}
        <Button onClick={onClose} disabled={change.isPending}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};
