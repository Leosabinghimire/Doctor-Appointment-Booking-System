import { Box, Stack, Typography, Button } from '@mui/material';
import { ReactNode } from 'react';
import { Inbox } from '@mui/icons-material';

interface EmptyStateProps {
  icon?: ReactNode;
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState = ({
  icon = <Inbox sx={{ fontSize: 36 }} />,
  title = 'Nothing here yet',
  description = 'There are no items to display.',
  actionLabel,
  onAction,
}: EmptyStateProps) => (
  <Stack spacing={1.5} alignItems="center" justifyContent="center" sx={{ py: 8, px: 2, textAlign: 'center' }}>
    <Box
      sx={{
        width: 72,
        height: 72,
        borderRadius: '50%',
        display: 'grid',
        placeItems: 'center',
        bgcolor: (t) =>
          t.palette.mode === 'dark' ? 'rgba(56,189,248,0.1)' : 'rgba(14,165,233,0.08)',
        color: 'primary.main',
      }}
    >
      {icon}
    </Box>
    <Typography variant="h6">{title}</Typography>
    <Typography color="text.secondary" sx={{ maxWidth: 380 }}>
      {description}
    </Typography>
    {actionLabel && onAction && (
      <Button variant="contained" onClick={onAction} sx={{ mt: 1 }}>
        {actionLabel}
      </Button>
    )}
  </Stack>
);
