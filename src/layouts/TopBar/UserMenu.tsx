import {
  Avatar,
  Box,
  Divider,
  ListItemIcon,
  Menu,
  MenuItem,
  Typography,
  alpha,
} from '@mui/material';
import { Logout, Person, Settings } from '@mui/icons-material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCurrentUser } from '@/store/auth';
import { useLogout } from '@/hooks/auth';
import { initials } from '@/utils/format';
import { ROUTES } from '@/constants';

export const UserMenu = () => {
  const user = useCurrentUser();
  const logout = useLogout();
  const isPatient = user?.role === 'patient';
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const close = () => setAnchorEl(null);

  return (
    <>
      <Box
        onClick={(e) => setAnchorEl(e.currentTarget)}
        role="button"
        aria-haspopup="menu"
        aria-expanded={open}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          p: 0.5,
          pr: 1.5,
          borderRadius: 2,
          cursor: 'pointer',
          border: (t) => `1px solid ${t.palette.divider}`,
          transition: 'background-color .2s',
          '&:hover': { bgcolor: (t) => alpha(t.palette.primary.main, 0.06) },
        }}
      >
        <Avatar src={user?.avatar} sx={{ width: 32, height: 32 }}>
          {user ? initials(user.name) : 'U'}
        </Avatar>
        <Box sx={{ display: { xs: 'none', md: 'block' }, lineHeight: 1 }}>
          <Typography fontSize={13.5} fontWeight={700} lineHeight={1.1}>
            {user?.name ?? 'Guest'}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'capitalize' }}>
            {user?.role}
          </Typography>
        </Box>
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={close}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        slotProps={{ paper: { sx: { mt: 1, minWidth: 200, borderRadius: 2 } } }}
      >
        {isPatient && (
          <MenuItem
            onClick={() => {
              navigate(ROUTES.profile);
              close();
            }}
          >
            <ListItemIcon><Person fontSize="small" /></ListItemIcon> Profile
          </MenuItem>
        )}
        <MenuItem onClick={close}>
          <ListItemIcon><Settings fontSize="small" /></ListItemIcon> Settings
        </MenuItem>
        <Divider />
        <MenuItem
          onClick={() => {
            logout();
            close();
            navigate(ROUTES.login, { replace: true });
          }}
          sx={{ color: 'error.main' }}
        >
          <ListItemIcon sx={{ color: 'error.main' }}>
            <Logout fontSize="small" />
          </ListItemIcon>
          Sign out
        </MenuItem>
      </Menu>
    </>
  );
};
