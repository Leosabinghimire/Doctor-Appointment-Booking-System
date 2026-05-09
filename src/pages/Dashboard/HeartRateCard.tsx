import { Box, Chip, useTheme } from '@mui/material';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { SectionCard } from '@/components/ui';
import { heartRateSeries } from './dashboard.data';

const tooltipStyle = {
  borderRadius: 12,
  border: 'none',
  background: 'rgba(15,23,42,0.92)',
  color: '#fff',
};

export const HeartRateCard = () => {
  const theme = useTheme();
  const accent = theme.palette.primary.main;
  return (
    <SectionCard
      title="Heart rate trends"
      subtitle="Last 7 days"
      action={<Chip label="Avg 74 bpm" color="primary" variant="outlined" size="small" />}
    >
      <Box sx={{ height: 280 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={heartRateSeries}>
            <defs>
              <linearGradient id="hr-gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={accent} stopOpacity={0.3} />
                <stop offset="95%" stopColor={accent} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            <XAxis dataKey="day" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} domain={[60, 90]} />
            <Tooltip contentStyle={tooltipStyle} />
            <Area type="monotone" dataKey="value" stroke={accent} strokeWidth={2.5} fill="url(#hr-gradient)" />
          </AreaChart>
        </ResponsiveContainer>
      </Box>
    </SectionCard>
  );
};
