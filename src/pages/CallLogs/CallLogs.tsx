import { useMemo, useState } from 'react';
import { Alert, Box, Button, Stack } from '@mui/material';
import { CallMade, PhoneInTalk, Refresh, SupportAgent, Timer } from '@mui/icons-material';
import { EmptyState, Loader, PageHeader, StatCard } from '@/components/ui';
import { useCallLogs, useSyncCalls } from '@/hooks/calls';
import type { CallLog } from '@/types';
import { CallLogItem, formatDuration } from './CallLogItem';
import { TranscriptDialog } from './TranscriptDialog';

export const CallLogs = () => {
  const { data: calls, isLoading } = useCallLogs();
  const { mutate: sync, isPending: syncing, error: syncError, reset: clearSyncError } = useSyncCalls();
  const [selected, setSelected] = useState<CallLog | null>(null);

  const stats = useMemo(() => {
    const list = calls ?? [];
    const outbound = list.filter((c) => c.direction === 'outbound').length;
    const callbacks = list.filter((c) => c.status === 'callback').length;
    const avg = list.length ? Math.round(list.reduce((s, c) => s + c.durationSec, 0) / list.length) : 0;
    return { total: list.length, outbound, callbacks, avg };
  }, [calls]);

  return (
    <Box>
      <PageHeader
        title="Call logs"
        subtitle="Phone calls handled by the Telentir AI voice agent, with transcripts."
        actions={
          <Button variant="outlined" startIcon={<Refresh />} onClick={() => sync()} disabled={syncing}>
            {syncing ? 'Syncing...' : 'Sync from Telentir'}
          </Button>
        }
      />

      {syncError && (
        <Alert severity="error" onClose={clearSyncError} sx={{ mb: 3 }}>
          {(syncError as { message?: string }).message ?? 'Could not sync calls from Telentir.'}
        </Alert>
      )}

      {isLoading ? (
        <Loader label="Loading call logs..." />
      ) : !calls || calls.length === 0 ? (
        <EmptyState
          icon={<PhoneInTalk sx={{ fontSize: 36 }} />}
          title="No calls yet"
          description="Calls show up here once the backend syncs call history from Telentir."
        />
      ) : (
        <>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' },
              gap: 2.5,
              mb: 3,
            }}
          >
            <StatCard label="Total calls" value={stats.total} icon={<PhoneInTalk />} />
            <StatCard label="Reminder calls" value={stats.outbound} icon={<CallMade />} color="success" />
            <StatCard label="Callbacks requested" value={stats.callbacks} icon={<SupportAgent />} color="info" />
            <StatCard label="Avg duration" value={formatDuration(stats.avg)} icon={<Timer />} color="warning" />
          </Box>
          <Stack spacing={1.5}>
            {calls.map((c, i) => (
              <CallLogItem key={c.id} call={c} onOpenTranscript={setSelected} index={i} />
            ))}
          </Stack>
        </>
      )}

      <TranscriptDialog call={selected} onClose={() => setSelected(null)} />
    </Box>
  );
};
