'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Button,
  Container,
  IconButton,
  InputAdornment,
  Link,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import {
  Agriculture,
  Email,
  Lock,
  Person,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';
import { authApi } from '@/lib/auth-api';
import { useAuthStore } from '@/store/authStore';

const emptyForm = {
  name: '',
  farmName: '',
  ownerName: '',
  email: '',
  contactNumber: '',
  location: '',
  totalArea: '',
  password: '',
  confirmPassword: '',
};

export default function RegisterPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [form, setForm] = useState(emptyForm);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (form.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    try {
      setLoading(true);
      const data = await authApi.register({
        name: form.name,
        farmName: form.farmName,
        ownerName: form.ownerName,
        email: form.email,
        contactNumber: form.contactNumber,
        location: form.location,
        password: form.password,
        ...(form.totalArea ? { totalArea: Number(form.totalArea) } : {}),
      });

      setAuth(data.user, data.accessToken);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #2e7d32 0%, #60ad5e 100%)',
        p: 2,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={8}
          sx={{
            p: 4,
            borderRadius: 3,
            backdropFilter: 'blur(10px)',
          }}
        >
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Agriculture sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
            <Typography variant="h4" fontWeight={700} gutterBottom>
              Create Your Farm Account
            </Typography>
            <Typography variant="body2" color="text.secondary">
              One signup creates your admin account and your farm workspace.
            </Typography>
          </Box>

          {error && (
            <Box
              sx={{
                p: 2,
                mb: 2,
                bgcolor: 'error.light',
                color: 'error.dark',
                borderRadius: 1,
              }}
            >
              <Typography variant="body2">{error}</Typography>
            </Box>
          )}

          <form onSubmit={handleRegister}>
            <Stack spacing={2}>
              <TextField
                fullWidth
                label="Full Name"
                value={form.name}
                onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person color="action" />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                fullWidth
                label="Farm Name"
                value={form.farmName}
                onChange={(e) => setForm((prev) => ({ ...prev, farmName: e.target.value }))}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Agriculture color="action" />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                fullWidth
                label="Owner Name"
                value={form.ownerName}
                onChange={(e) => setForm((prev) => ({ ...prev, ownerName: e.target.value }))}
                required
              />

              <TextField
                fullWidth
                label="Email Address"
                type="email"
                value={form.email}
                onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email color="action" />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                fullWidth
                label="Contact Number"
                value={form.contactNumber}
                onChange={(e) => setForm((prev) => ({ ...prev, contactNumber: e.target.value }))}
                required
              />

              <TextField
                fullWidth
                label="Farm Location"
                value={form.location}
                onChange={(e) => setForm((prev) => ({ ...prev, location: e.target.value }))}
                required
              />

              <TextField
                fullWidth
                label="Total Area (optional)"
                type="number"
                value={form.totalArea}
                onChange={(e) => setForm((prev) => ({ ...prev, totalArea: e.target.value }))}
              />

              <TextField
                fullWidth
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
                required
                helperText="At least 6 characters"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                fullWidth
                label="Confirm Password"
                type={showPassword ? 'text' : 'password'}
                value={form.confirmPassword}
                onChange={(e) => setForm((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Stack>

            <Button
              fullWidth
              type="submit"
              variant="contained"
              size="large"
              disabled={loading}
              sx={{
                mt: 3,
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 600,
                textTransform: 'none',
              }}
            >
              {loading ? 'Creating farm account...' : 'Create Farm Account'}
            </Button>
          </form>

          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Already have an account?{' '}
              <Link href="/login" sx={{ color: 'primary.main', fontWeight: 600, textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
                Sign In
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
