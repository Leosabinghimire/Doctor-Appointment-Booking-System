import { Box, Button, Stack, Typography } from '@mui/material';
import { Home } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { popIn } from '@/lib/animations';
import { ROUTES } from '@/constants';

export const NotFound = () => (
  <Stack
    component={motion.div}
    variants={popIn}
    initial="hidden"
    animate="visible"
    spacing={2}
    alignItems="center"
    justifyContent="center"
    sx={{ minHeight: '60vh', textAlign: 'center' }}
  >
    <Typography
      variant="h1"
      fontWeight={900}
      sx={{
        backgroundImage: (t) => t.palette.gradient.primary,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        fontSize: { xs: 96, md: 140 },
        lineHeight: 1,
      }}
    >
      404
    </Typography>
    <Typography variant="h5" fontWeight={700}>
      We couldn't find that page
    </Typography>
    <Typography color="text.secondary" sx={{ maxWidth: 460 }}>
      The page you're looking for might have been moved or no longer exists. Let's get you back on track.
    </Typography>
    <Box>
      <Button component={Link} to={ROUTES.dashboard} variant="contained" startIcon={<Home />}>
        Back to dashboard
      </Button>
    </Box>
  </Stack>
);
