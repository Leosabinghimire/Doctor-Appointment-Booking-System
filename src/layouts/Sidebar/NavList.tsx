import {
  Box,
  Typography,
  alpha,
  useTheme,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { NavLink, useLocation } from 'react-router-dom';
import { useMemo } from 'react';
import { primaryNav, type NavItem } from '../navItems';
import { ROUTES } from '@/constants';

interface Props {
  onNavigate?: () => void;
}

const groupBy = <T, K extends string>(items: readonly T[], by: (t: T) => K): Record<K, T[]> => {
  return items.reduce((acc, item) => {
    const key = by(item);
    (acc[key] = acc[key] ?? []).push(item);
    return acc;
  }, {} as Record<K, T[]>);
};

export const NavList = ({ onNavigate }: Props) => {
  const theme = useTheme();
  const location = useLocation();

  const groups = useMemo(() => groupBy(primaryNav, (i: NavItem) => i.group), []);

  const isActive = (to: string) =>
    to === ROUTES.dashboard ? location.pathname === to : location.pathname.startsWith(to);

  return (
    <Box sx={{ px: 1.5, pb: 3 }}>
      {Object.entries(groups).map(([group, items]) => (
        <Box key={group} sx={{ mb: 2 }}>
          <Typography
            variant="caption"
            color="text.secondary"
            fontWeight={700}
            sx={{
              px: 1.5,
              mb: 0.5,
              display: 'block',
              textTransform: 'uppercase',
              letterSpacing: 0.6,
              fontSize: 11,
            }}
          >
            {group}
          </Typography>
          <List disablePadding>
            {items.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.to);
              return (
                <ListItemButton
                  key={item.to}
                  component={NavLink}
                  to={item.to}
                  end={item.to === ROUTES.dashboard}
                  onClick={onNavigate}
                  sx={{
                    borderRadius: 2,
                    mb: 0.4,
                    px: 1.5,
                    py: 1,
                    color: active ? 'primary.main' : 'text.secondary',
                    bgcolor: active ? alpha(theme.palette.primary.main, 0.1) : 'transparent',
                    '&:hover': {
                      bgcolor: alpha(theme.palette.primary.main, active ? 0.14 : 0.06),
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 36, color: 'inherit' }}>
                    <Icon />
                  </ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{ fontWeight: active ? 700 : 500, fontSize: 14.5 }}
                  />
                </ListItemButton>
              );
            })}
          </List>
        </Box>
      ))}
    </Box>
  );
};
