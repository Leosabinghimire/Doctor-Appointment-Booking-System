import { Box } from '@mui/material';
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { SectionCard } from '@/components/ui';
import type { SpecialtyDistributionPoint } from '@/types';

const SLICE_COLORS = ['#0EA5E9', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#06B6D4'];

const tooltipStyle = {
  borderRadius: 12,
  border: 'none',
  background: 'rgba(15,23,42,0.92)',
  color: '#fff',
};

interface SpecialtyDistributionChartProps {
  data: SpecialtyDistributionPoint[];
}

export const SpecialtyDistributionChart = ({ data }: SpecialtyDistributionChartProps) => (
  <SectionCard title="Specialty distribution">
    <Box sx={{ height: 300 }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" innerRadius={50} outerRadius={90} paddingAngle={2}>
            {data.map((_, i) => (
              <Cell key={i} fill={SLICE_COLORS[i % SLICE_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip contentStyle={tooltipStyle} />
          <Legend wrapperStyle={{ fontSize: 12 }} />
        </PieChart>
      </ResponsiveContainer>
    </Box>
  </SectionCard>
);
