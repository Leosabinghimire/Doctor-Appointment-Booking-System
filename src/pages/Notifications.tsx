import { useMemo, useState } from 'react';
import { Box, Button, Stack, Tab, Tabs } from '@mui/material';
import { DoneAll } from '@mui/icons-material';
import { EmptyState, Loader, PageHeader } from '@/components/ui';
import { NotificationItem } from '@/components/notification';
import {
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
  useNotifications,
} from '@/hooks/notifications';

export const NotificationsPage = () => {
  const { data, isLoading } = useNotifications();
  const { mutate: markAll } = useMarkAllNotificationsRead();
  const { mutate: markOne } = useMarkNotificationRead();
  const [tab, setTab] = useState(0);

  const filtered = useMemo(() => {
    if (!data) return [];
    if (tab === 1) return data.filter((n) => !n.read);
    return data;
  }, [data, tab]);

  const unread = data?.filter((n) => !n.read).length ?? 0;

  return (
    <Box>
      <PageHeader
        title="Notifications"
        subtitle={`${unread} unread updates`}
        actions={
          unread > 0 && (
            <Button variant="outlined" startIcon={<DoneAll />} onClick={() => markAll()}>
              Mark all as read
            </Button>
          )
        }
      />

      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 3 }}>
        <Tab label="All" />
        <Tab label={`Unread (${unread})`} />
      </Tabs>

      {isLoading ? (
        <Loader label="Loading notifications..." />
      ) : filtered.length === 0 ? (
        <EmptyState title="You're all caught up" description="No new notifications right now." />
      ) : (
        <Stack spacing={1.2}>
          {filtered.map((n, i) => (
            <NotificationItem
              key={n.id}
              notification={n}
              onMarkRead={(id) => markOne(id)}
              index={i}
            />
          ))}
        </Stack>
      )}
    </Box>
  );
};
