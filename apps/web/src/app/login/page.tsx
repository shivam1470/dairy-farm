'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Script from 'next/script';
import { useRouter } from 'next/navigation';
import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
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

declare global {
  interface Window {
    google?: any;
  }
}

const GOOGLE_CLIENT_ID =
  process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
  '1086488745184-91l5g0rsb04hmr8bquhbgcg628gfbh0h.apps.googleusercontent.com';

type GoogleOnboardingState = {
  onboardingToken: string;
  email: string;
  name: string;
};

const emptyFarmForm = {
  name: '',
  farmName: '',
  ownerName: '',
  contactNumber: '',
  location: '',
  totalArea: '',
};

export default function LoginPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const googleButtonRef = useRef<HTMLDivElement | null>(null);

  const [googleScriptLoaded, setGoogleScriptLoaded] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [onboarding, setOnboarding] = useState<GoogleOnboardingState | null>(null);
  const [farmForm, setFarmForm] = useState(emptyFarmForm);

  const handleGoogleCredential = useCallback(
    async (response: { credential?: string }) => {
      if (!response?.credential) {
        setError('Google sign-in failed. Please try again.');
        return;
      }

      try {
        setError('');
        setGoogleLoading(true);
        const result = await authApi.googleLogin(response.credential);

        if ('status' in result && result.status === 'ONBOARDING_REQUIRED') {
          setOnboarding({
            onboardingToken: result.onboardingToken,
            email: result.email,
            name: result.name,
          });
          setFarmForm({
            ...emptyFarmForm,
            name: result.name,
            ownerName: result.name,
          });
          return;
        }

        setAuth(result.user, result.accessToken);
        router.push('/dashboard');
      } catch (err: any) {
        setError(err?.response?.data?.message || 'Google sign-in failed');
      } finally {
        setGoogleLoading(false);
      }
    },
    [router, setAuth],
  );

  useEffect(() => {
    if (!googleScriptLoaded || !googleButtonRef.current || !window.google) {
      return;
    }

    googleButtonRef.current.innerHTML = '';

    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: handleGoogleCredential,
    });

    window.google.accounts.id.renderButton(googleButtonRef.current, {
      theme: 'outline',
      size: 'large',
      width: 360,
      text: 'continue_with',
      shape: 'pill',
    });
  }, [googleScriptLoaded, handleGoogleCredential]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await authApi.login(email, password);
      setAuth(data.user, data.accessToken);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteGoogleSignup = async () => {
    if (!onboarding) return;

    if (!farmForm.name || !farmForm.farmName || !farmForm.ownerName || !farmForm.contactNumber || !farmForm.location) {
      setError('Please fill in all required farm details');
      return;
    }

    try {
      setGoogleLoading(true);
      setError('');
      const data = await authApi.completeGoogleSignup({
        onboardingToken: onboarding.onboardingToken,
        name: farmForm.name,
        farmName: farmForm.farmName,
        ownerName: farmForm.ownerName,
        contactNumber: farmForm.contactNumber,
        location: farmForm.location,
        ...(farmForm.totalArea ? { totalArea: Number(farmForm.totalArea) } : {}),
      });

      setAuth(data.user, data.accessToken);
      setOnboarding(null);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to complete farm setup');
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <>
      <Script
        src="https://accounts.google.com/gsi/client"
        strategy="afterInteractive"
        onLoad={() => setGoogleScriptLoaded(true)}
      />

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
                Dairy Farm Manager
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Sign in to manage your farm, people, and production in one place.
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

            <Stack spacing={2} sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Box ref={googleButtonRef} sx={{ minHeight: 40 }} />
              </Box>
              <Typography variant="body2" color="text.secondary" textAlign="center">
                {googleLoading ? 'Processing Google sign-in...' : 'Use Google for faster sign-in and onboarding'}
              </Typography>
            </Stack>

            <Divider sx={{ my: 3 }}>
              <Typography variant="body2" color="text.secondary">
                OR
              </Typography>
            </Divider>

            <form onSubmit={handleLogin}>
              <TextField
                fullWidth
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                margin="normal"
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
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                margin="normal"
                required
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

              <Box sx={{ textAlign: 'right', mt: 1, mb: 3 }}>
                <Link href="#" variant="body2" sx={{ color: 'primary.main' }}>
                  Forgot Password?
                </Link>
              </Box>

              <Button
                fullWidth
                type="submit"
                variant="contained"
                size="large"
                disabled={loading}
                sx={{
                  py: 1.5,
                  fontSize: '1rem',
                  fontWeight: 600,
                  textTransform: 'none',
                }}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Don&apos;t have an account?{' '}
                <Link href="/register" sx={{ color: 'primary.main', fontWeight: 600, textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
                  Create your farm account
                </Link>
              </Typography>
            </Box>
          </Paper>
        </Container>
      </Box>

      <Dialog open={!!onboarding} onClose={() => !googleLoading && setOnboarding(null)} maxWidth="sm" fullWidth>
        <DialogTitle>Complete Your Farm Setup</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            We verified your Google account. Finish these farm details once, and we&apos;ll create your admin account.
          </Typography>

          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Full Name"
              value={farmForm.name}
              onChange={(e) => setFarmForm((prev) => ({ ...prev, name: e.target.value }))}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person color="action" />
                  </InputAdornment>
                ),
              }}
              fullWidth
              required
            />
            <TextField label="Email Address" value={onboarding?.email ?? ''} fullWidth disabled />
            <TextField
              label="Farm Name"
              value={farmForm.farmName}
              onChange={(e) => setFarmForm((prev) => ({ ...prev, farmName: e.target.value }))}
              fullWidth
              required
            />
            <TextField
              label="Owner Name"
              value={farmForm.ownerName}
              onChange={(e) => setFarmForm((prev) => ({ ...prev, ownerName: e.target.value }))}
              fullWidth
              required
            />
            <TextField
              label="Contact Number"
              value={farmForm.contactNumber}
              onChange={(e) => setFarmForm((prev) => ({ ...prev, contactNumber: e.target.value }))}
              fullWidth
              required
            />
            <TextField
              label="Farm Location"
              value={farmForm.location}
              onChange={(e) => setFarmForm((prev) => ({ ...prev, location: e.target.value }))}
              fullWidth
              required
            />
            <TextField
              label="Total Area (optional)"
              type="number"
              value={farmForm.totalArea}
              onChange={(e) => setFarmForm((prev) => ({ ...prev, totalArea: e.target.value }))}
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOnboarding(null)} disabled={googleLoading}>
            Cancel
          </Button>
          <Button onClick={handleCompleteGoogleSignup} variant="contained" disabled={googleLoading}>
            {googleLoading ? 'Saving...' : 'Create Farm Account'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
