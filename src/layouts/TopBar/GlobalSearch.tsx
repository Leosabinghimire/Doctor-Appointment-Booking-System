import { Box, InputBase, alpha } from '@mui/material';
import { Search } from '@mui/icons-material';

export const GlobalSearch = () => (
  <Box
    sx={{
      display: { xs: 'none', sm: 'flex' },
      alignItems: 'center',
      px: 1.5,
      py: 0.5,
      borderRadius: 2.5,
      bgcolor: (t) => alpha(t.palette.text.secondary, 0.06),
      border: (t) => `1px solid ${t.palette.divider}`,
      minWidth: 320,
      flex: { md: 0.5 },
    }}
  >
    <Search fontSize="small" sx={{ color: 'text.secondary', mr: 1 }} />
    <InputBase
      placeholder="Search doctors, specialties, prescriptions..."
      sx={{ flex: 1, fontSize: 14 }}
      inputProps={{ 'aria-label': 'global search' }}
    />
  </Box>
);
