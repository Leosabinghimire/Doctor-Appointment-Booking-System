import { Component, ErrorInfo, ReactNode } from 'react';
import { Box, Button, Stack, Typography } from '@mui/material';
import { Refresh } from '@mui/icons-material';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('[ErrorBoundary]', error, info);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined });
    window.location.reload();
  };

  render() {
    if (!this.state.hasError) return this.props.children;
    if (this.props.fallback) return this.props.fallback;

    return (
      <Stack
        spacing={2}
        alignItems="center"
        justifyContent="center"
        sx={{ minHeight: '60vh', textAlign: 'center', px: 2 }}
      >
        <Box>
          <Typography variant="h4" fontWeight={800}>
            Something went wrong
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 1, maxWidth: 460 }}>
            {this.state.error?.message ?? 'An unexpected error occurred. Try reloading the app.'}
          </Typography>
        </Box>
        <Button startIcon={<Refresh />} variant="contained" onClick={this.handleReset}>
          Reload
        </Button>
      </Stack>
    );
  }
}
