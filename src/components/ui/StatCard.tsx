import { Card, CardContent, Stack, Typography, Box, alpha } from '@mui/material';
import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { TrendingUp, TrendingDown } from '@mui/icons-material';
import { fadeInUp } from '@/lib/animations';

type StatColor = 'primary' | 'success' | 'warning' | 'info' | 'error' | 'secondary';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: ReactNode;
  color?: StatColor;
  delta?: number;
  helper?: string;
}

export const StatCard = ({ label, value, icon, color = 'primary', delta, helper }: StatCardProps) => (
  <Card
    component={motion.div}
    variants={fadeInUp}
    initial="hidden"
    animate="visible"
    whileHover={{ y: -2 }}
    sx={{ height: '100%' }}
  >
    <CardContent sx={{ p: 2.5 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
        <Box>
          <Typography
            variant="caption"
            color="text.secondary"
            fontWeight={600}
            textTransform="uppercase"
            letterSpacing={0.5}
          >
            {label}
          </Typography>
          <Typography variant="h4" fontWeight={800} sx={{ mt: 0.5 }}>
            {value}
          </Typography>
          {(helper || typeof delta === 'number') && (
            <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mt: 1 }}>
              {typeof delta === 'number' && (
                <Stack
                  direction="row"
                  spacing={0.4}
                  alignItems="center"
                  sx={{
                    color: delta >= 0 ? 'success.main' : 'error.main',
                    fontWeight: 600,
                    fontSize: 13,
                  }}
                >
                  {delta >= 0 ? <TrendingUp sx={{ fontSize: 16 }} /> : <TrendingDown sx={{ fontSize: 16 }} />}
                  {Math.abs(delta)}%
                </Stack>
              )}
              {helper && (
                <Typography variant="caption" color="text.secondary">
                  {helper}
                </Typography>
              )}
            </Stack>
          )}
        </Box>
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: 2,
            display: 'grid',
            placeItems: 'center',
            color: `${color}.main`,
            bgcolor: (t) => alpha(t.palette[color].main, 0.08),
          }}
        >
          {icon}
        </Box>
      </Stack>
    </CardContent>
  </Card>
);
