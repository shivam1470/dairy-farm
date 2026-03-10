import { createApiClient } from '@dairy-farm/api-client';

// Central place for web to create a typed API client.
// Falls back to localhost for local dev.
const baseUrl =
  process.env.NEXT_PUBLIC_API_URL ??
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  'http://127.0.0.1:3001';

export const api = createApiClient(baseUrl);
