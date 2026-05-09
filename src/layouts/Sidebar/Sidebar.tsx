import { Box, Drawer } from '@mui/material';
import { useUiStore } from '@/store/ui';
import { BrandHeader } from './BrandHeader';
import { NavList } from './NavList';

export const SIDEBAR_WIDTH = 264;

export const Sidebar = () => {
  const { mobileNavOpen, setMobileNavOpen } = useUiStore();

  const content = (
    <>
      <BrandHeader />
      <NavList onNavigate={() => setMobileNavOpen(false)} />
    </>
  );

  return (
    <>
      <Box
        component="nav"
        aria-label="Primary navigation"
        sx={{
          width: SIDEBAR_WIDTH,
          flexShrink: 0,
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'column',
          borderRight: (t) => `1px solid ${t.palette.divider}`,
          bgcolor: 'background.paper',
          height: '100vh',
          position: 'sticky',
          top: 0,
        }}
      >
        {content}
      </Box>

      <Drawer
        anchor="left"
        open={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
        PaperProps={{ sx: { width: SIDEBAR_WIDTH, display: 'flex', flexDirection: 'column' } }}
        sx={{ display: { md: 'none' } }}
      >
        {content}
      </Drawer>
    </>
  );
};
