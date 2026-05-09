import { Box, Stack, Typography, IconButton, alpha } from '@mui/material';
import {
  CalendarMonth,
  Medication,
  Notifications as Bell,
  Mail,
  Settings,
  CheckCircle,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import type { AppNotification, NotificationType } from '@/types';
import { formatRelative } from '@/utils/format';

const iconMap: Record<NotificationType, JSX.Element> = {
  appointment: <CalendarMonth />,
  prescription: <Medication />,
  reminder: <Bell />,
  message: <Mail />,
  system: <Settings />,
};

interface Props {
  notification: AppNotification;
  onMarkRead?: (id: string) => void;
  index?: number;
}

export const NotificationItem = ({ notification, onMarkRead, index = 0 }: Props) => {
  return (
    <Stack
      component={motion.div}
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.03 }}
      direction="row"
      spacing={2}
      alignItems="flex-start"
      sx={{
        p: 2,
        borderRadius: 2,
        bgcolor: (t) => (notification.read ? 'transparent' : alpha(t.palette.primary.main, 0.04)),
        border: (t) => `1px solid ${t.palette.divider}`,
        transition: 'background-color .2s',
      }}
    >
      <Box
        sx={{
          width: 40,
          height: 40,
          borderRadius: 2,
          display: 'grid',
          placeItems: 'center',
          flexShrink: 0,
          bgcolor: (t) => alpha(t.palette.primary.main, 0.08),
          color: 'primary.main',
        }}
      >
        {iconMap[notification.type]}
      </Box>
      <Box flex={1} minWidth={0}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1}>
          <Typography fontWeight={700}>{notification.title}</Typography>
          {!notification.read && (
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                bgcolor: 'primary.main',
                mt: 1,
                flexShrink: 0,
              }}
            />
          )}
        </Stack>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.3 }}>
          {notification.message}
        </Typography>
        <Typography variant="caption" color="text.disabled" sx={{ mt: 0.6, display: 'block' }}>
          {formatRelative(notification.timestamp)}
        </Typography>
      </Box>
      {!notification.read && onMarkRead && (
        <IconButton size="small" onClick={() => onMarkRead(notification.id)} title="Mark read">
          <CheckCircle fontSize="small" color="primary" />
        </IconButton>
      )}
    </Stack>
  );
};
