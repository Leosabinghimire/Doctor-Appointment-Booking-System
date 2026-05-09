import { Stack, Typography } from '@mui/material';

interface SummaryRowProps {
  label: string;
  value: string;
  bold?: boolean;
}

export const SummaryRow = ({ label, value, bold }: SummaryRowProps) => (
  <Stack direction="row" justifyContent="space-between">
    <Typography color="text.secondary">{label}</Typography>
    <Typography fontWeight={bold ? 800 : 600} sx={{ textTransform: 'capitalize' }}>
      {value}
    </Typography>
  </Stack>
);
