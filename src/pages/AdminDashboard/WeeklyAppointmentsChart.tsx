import { Box } from '@mui/material';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { SectionCard } from '@/components/ui';
import type { WeeklyAppointmentPoint } from '@/types';

const tooltipStyle = {
  borderRadius: 12,
  border: 'none',
  background: 'rgba(15,23,42,0.92)',
  color: '#fff',
};

interface WeeklyAppointmentsChartProps {
  data: WeeklyAppointmentPoint[];
}

export const WeeklyAppointmentsChart = ({ data }: WeeklyAppointmentsChartProps) => (
  <SectionCard title="Weekly appointments" subtitle="Past 7 days">
    <Box sx={{ height: 300 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <defs>
            <linearGradient id="weekly-bar" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0EA5E9" stopOpacity={0.95} />
              <stop offset="100%" stopColor="#22D3EE" stopOpacity={0.7} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
          <XAxis dataKey="day" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip contentStyle={tooltipStyle} />
          <Bar dataKey="count" fill="url(#weekly-bar)" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  </SectionCard>
);
