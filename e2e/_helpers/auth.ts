import { expect, type Page } from '@playwright/test';

export type LoginParams = {
  email: string;
  password: string;
};

type LoginResponse = {
  accessToken: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
    farmId?: string | null;
  };
};

export async function login(page: Page, { email, password }: LoginParams) {
  await page.goto('/login');
  await expect(page).toHaveURL(/\/login/);

  await page.getByLabel(/email address/i).fill(email);
  await page.getByLabel(/password/i).fill(password);
  await page.getByRole('button', { name: /sign in/i }).click();

  // App pushes to /dashboard after login.
  await expect(page).toHaveURL(/\/dashboard/);
}

/**
 * Deterministic E2E login:
 * - logs in via backend API (fast, no UI dependencies)
 * - sets both `token` and Zustand persist key `auth-storage` so pages relying on `useAuthStore().user`
 *   (like `/animals`) see `farmId` immediately.
 */
export async function loginWithStorageSeed(
  page: Page,
  {
    email,
    password,
    // Use IPv4 loopback to avoid environments where `localhost` resolves to ::1
    // while backend dev server only listens on 127.0.0.1.
    apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3001',
  }: LoginParams & { apiUrl?: string }
) {
  const res = await page.request.post(`${apiUrl}/auth/login`, {
    data: { email, password },
  });

  if (!res.ok()) {
    let bodyText = '';
    try {
      bodyText = await res.text();
    } catch {
      bodyText = '<unable to read response body>';
    }
    throw new Error(
      `E2E login failed: ${res.status()} ${res.url()}\n` +
        `email=${email}\n` +
        `${bodyText}`
    );
  }
  const body = (await res.json()) as LoginResponse;

  const token = body.accessToken;
  const user = body.user;

  // Seed before first navigation to app routes.
  await page.addInitScript(
    ({ token: t, user: u }) => {
      // eslint-disable-next-line no-eval
  const ls = eval('localStorage') as any;
      ls.setItem('token', t);

      // zustand/persist stores `{ state, version }` by default.
      ls.setItem(
        'auth-storage',
        JSON.stringify({
          state: {
            user: { ...u, farmId: u.farmId ?? undefined },
            token: t,
          },
          version: 0,
        })
      );
    },
    { token, user }
  );

  // Visiting any route triggers rehydration with seeded storage.
  await page.goto('/dashboard');
  await expect(page).toHaveURL(/\/dashboard/);
}
