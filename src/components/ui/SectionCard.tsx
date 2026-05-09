import { Card, CardContent, Stack, Typography, Box } from '@mui/material';
import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { fadeInUp } from '@/lib/animations';

interface SectionCardProps {
  title?: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
  delay?: number;
  noPadding?: boolean;
}

export const SectionCard = ({
  title,
  subtitle,
  action,
  children,
  delay = 0,
  noPadding,
}: SectionCardProps) => (
  <Card
    component={motion.div}
    variants={fadeInUp}
    initial="hidden"
    animate="visible"
    transition={{ delay }}
    sx={{ height: '100%' }}
  >
    {(title || action) && (
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ p: 2.5, pb: 0 }}
      >
        <Box>
          {title && (
            <Typography variant="h6" fontWeight={700}>
              {title}
            </Typography>
          )}
          {subtitle && (
            <Typography variant="body2" color="text.secondary">
              {subtitle}
            </Typography>
          )}
        </Box>
        {action}
      </Stack>
    )}
    <CardContent sx={{ p: noPadding ? 0 : 2.5 }}>{children}</CardContent>
  </Card>
);
