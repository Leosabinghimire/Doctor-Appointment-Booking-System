import { FormEvent, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import { motion } from 'framer-motion';
import { APP_NAME } from '@/config';
import { ROUTES } from '@/constants';
import { useLogin, useRegister } from '@/hooks/auth';
import { fadeInUp } from '@/lib/animations';
import { useIsAuthenticated } from '@/store/auth';
import type { ApiError, AuthResponse } from '@/types';

type Mode = 'login' | 'register';

const errorMessage = (error: unknown) => (error as ApiError | null)?.message ?? 'Something went wrong. Please try again.';

export const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = useIsAuthenticated();
  const [mode, setMode] = useState<Mode>('login');
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });

  const login = useLogin();
  const register = useRegister();
  const active = mode === 'login' ? login : register;

  // Where the user was trying to go before being sent to the login page.
  const from = (location.state as { from?: string } | null)?.from;

  if (isAuthenticated) return <Navigate to={from ?? ROUTES.dashboard} replace />;

  const goHome = ({ user }: AuthResponse) =>
    navigate(from ?? (user.role === 'admin' ? ROUTES.admin : ROUTES.dashboard), { replace: true });

  const update = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (mode === 'login') {
      login.mutate({ email: form.email, password: form.password }, { onSuccess: goHome });
    } else {
      register.mutate(form, { onSuccess: goHome });
    }
  };

  const switchMode = (next: Mode) => {
    setMode(next);
    login.reset();
    register.reset();
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        bgcolor: 'background.default',
        px: 2,
        py: 4,
      }}
    >
      <Card component={motion.div} variants={fadeInUp} initial="hidden" animate="visible" sx={{ width: '100%', maxWidth: 420 }}>
        <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
          <Stack direction="row" spacing={1.2} alignItems="center" justifyContent="center" sx={{ mb: 3 }}>
            <Box component="img" src="/favicon.svg" alt="" sx={{ width: 40, height: 40 }} />
            <Typography variant="h5" fontWeight={800}>
              {APP_NAME}
            </Typography>
          </Stack>

          <Tabs value={mode} onChange={(_, v: Mode) => switchMode(v)} variant="fullWidth" sx={{ mb: 3 }}>
            <Tab value="login" label="Sign in" />
            <Tab value="register" label="Create account" />
          </Tabs>

          <Stack component="form" spacing={2} onSubmit={handleSubmit} noValidate>
            {active.isError && <Alert severity="error">{errorMessage(active.error)}</Alert>}

            {mode === 'register' && (
              <TextField label="Full name" value={form.name} onChange={update('name')} autoComplete="name" required />
            )}
            <TextField
              label="Email"
              type="email"
              value={form.email}
              onChange={update('email')}
              autoComplete="email"
              autoFocus
              required
            />
            {mode === 'register' && (
              <TextField label="Phone" type="tel" value={form.phone} onChange={update('phone')} autoComplete="tel" required />
            )}
            <TextField
              label="Password"
              type="password"
              value={form.password}
              onChange={update('password')}
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              helperText={mode === 'register' ? 'At least 8 characters' : undefined}
              required
            />

            <Button type="submit" variant="contained" size="large" disabled={active.isPending}>
              {active.isPending ? 'Please wait...' : mode === 'login' ? 'Sign in' : 'Create account'}
            </Button>
          </Stack>

          {import.meta.env.DEV && mode === 'login' && (
            <Alert severity="info" sx={{ mt: 3 }}>
              <Typography variant="body2" fontWeight={700}>
                Development accounts
              </Typography>
              <Typography variant="body2">Patient: alex.morgan@example.com / patient-dev-password</Typography>
              <Typography variant="body2">Admin: admin@medicare.example / admin-dev-password</Typography>
            </Alert>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};
