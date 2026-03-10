import { test, expect } from '@playwright/test';
import { loginWithStorageSeed } from './_helpers/auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3001';
const E2E_EMAIL = process.env.E2E_EMAIL ?? 'admin@greenvaleyfarm.com';
const E2E_PASSWORD = process.env.E2E_PASSWORD ?? 'password123';

test('vet: create vet visit and show in list', async ({ page }) => {
  await loginWithStorageSeed(page, { email: E2E_EMAIL, password: E2E_PASSWORD });

  // Need a real animalId (DB relation constraint). Fetch one via API.
  const loginRes = await page.request.post(`${API_URL}/auth/login`, {
    data: { email: E2E_EMAIL, password: E2E_PASSWORD },
  });
  expect(loginRes.ok()).toBeTruthy();
  const loginBody = (await loginRes.json()) as { accessToken: string; user: { farmId?: string | null } };
  const token = loginBody.accessToken;
  const farmId = loginBody.user.farmId;
  expect(farmId).toBeTruthy();

  const animalsRes = await page.request.get(`${API_URL}/animals?farmId=${farmId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  expect(animalsRes.ok()).toBeTruthy();
  const animals = (await animalsRes.json()) as Array<{ id: string }>;
  expect(animals.length).toBeGreaterThan(0);
  const animalId = animals[0].id;

  await page.goto('/vet');
  await expect(page.getByTestId('vet-title')).toBeVisible();

  await page.getByTestId('vet-add').click();
  await expect(page.getByTestId('vet-form-dialog')).toBeVisible();

  const reason = `E2E Vet ${Date.now()}`;

  await page.getByTestId('vet-form-animalId').fill(animalId);
  await page.getByTestId('vet-form-visitReason').fill(reason);
  await page.getByTestId('vet-form-veterinarian').fill('Dr. E2E');
  await page.getByTestId('vet-form-cost').fill('500');

  await page.getByTestId('vet-form-submit').click();

  await expect(page.getByTestId('vet-form-dialog')).toBeHidden();
  await expect(page.getByTestId('vet-list')).toBeVisible();
  await expect(page.getByTestId('vet-list')).toContainText(reason);
});
