import { IconButton, Badge } from '@mui/material';
import { Notifications as NotificationsIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '@/hooks/notifications';
import { ROUTES } from '@/constants';

export const NotificationsButton = () => {
  const navigate = useNavigate();
  const { data } = useNotifications();
  const unread = data?.filter((n) => !n.read).length ?? 0;

  return (
    <IconButton
      onClick={() => navigate(ROUTES.notifications)}
      aria-label={`Notifications (${unread} unread)`}
      sx={{
        border: (t) => `1px solid ${t.palette.divider}`,
        borderRadius: 2,
        width: 40,
        height: 40,
      }}
    >
      <Badge badgeContent={unread} color="error" overlap="circular">
        <NotificationsIcon fontSize="small" />
      </Badge>
    </IconButton>
  );
};
