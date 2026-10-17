import { AppBar, Toolbar, Box, IconButton, Stack, alpha } from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import { ThemeToggle } from '@/components/ui';
import { useUiStore } from '@/store/ui';
import { useIsAdmin } from '@/store/auth';
import { GlobalSearch } from './GlobalSearch';
import { NotificationsButton } from './NotificationsButton';
import { UserMenu } from './UserMenu';

export const TopBar = () => {
  const toggleMobileNav = useUiStore((s) => s.toggleMobileNav);
  const isAdmin = useIsAdmin();

  return (
    <AppBar
      position="sticky"
      sx={{
        backdropFilter: 'blur(12px)',
        bgcolor: (t) => alpha(t.palette.background.default, 0.85),
        borderBottom: (t) => `1px solid ${t.palette.divider}`,
      }}
    >
      <Toolbar sx={{ gap: 2 }}>
        <IconButton
          onClick={toggleMobileNav}
          sx={{ display: { md: 'none' } }}
          aria-label="open navigation"
        >
          <MenuIcon />
        </IconButton>

        <GlobalSearch />

        <Box flex={1} />

        <Stack direction="row" spacing={1} alignItems="center">
          <ThemeToggle />
          {!isAdmin && <NotificationsButton />}
          <UserMenu />
        </Stack>
      </Toolbar>
    </AppBar>
  );
};
