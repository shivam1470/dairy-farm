import apiClient from '@/lib/api';

export type AuthUser = {
  id: string;
  email: string;
  name: string;
  role: string;
  farmId?: string | null;
};

export type AuthResponse = {
  accessToken: string;
  user: AuthUser;
};

export type RegisterPayload = {
  name: string;
  email: string;
  password: string;
  farmName: string;
  ownerName: string;
  contactNumber: string;
  location: string;
  totalArea?: number;
};

export type GoogleOnboardingPayload = {
  onboardingToken: string;
  name: string;
  farmName: string;
  ownerName: string;
  contactNumber: string;
  location: string;
  totalArea?: number;
};

export type GoogleAuthResult =
  | AuthResponse
  | {
      status: 'ONBOARDING_REQUIRED';
      onboardingToken: string;
      email: string;
      name: string;
    };

export const authApi = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/login', { email, password });
    return response.data;
  },

  register: async (payload: RegisterPayload): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/register', payload);
    return response.data;
  },

  googleLogin: async (credential: string): Promise<GoogleAuthResult> => {
    const response = await apiClient.post('/auth/google', { credential });
    return response.data;
  },

  completeGoogleSignup: async (
    payload: GoogleOnboardingPayload,
  ): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/google/complete-signup', payload);
    return response.data;
  },
};
