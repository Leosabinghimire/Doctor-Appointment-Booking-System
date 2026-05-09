import { Box, Stack, Typography } from '@mui/material';
import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { fadeInDown } from '@/lib/animations';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}

export const PageHeader = ({ title, subtitle, actions }: PageHeaderProps) => (
  <Stack
    component={motion.div}
    variants={fadeInDown}
    initial="hidden"
    animate="visible"
    direction={{ xs: 'column', sm: 'row' }}
    alignItems={{ xs: 'flex-start', sm: 'center' }}
    justifyContent="space-between"
    spacing={2}
    sx={{ mb: 3 }}
  >
    <Box>
      <Typography variant="h4" fontWeight={800}>
        {title}
      </Typography>
      {subtitle && (
        <Typography color="text.secondary" sx={{ mt: 0.5 }}>
          {subtitle}
        </Typography>
      )}
    </Box>
    {actions && <Box>{actions}</Box>}
  </Stack>
);
