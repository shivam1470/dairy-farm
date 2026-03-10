import { test, expect } from '@playwright/test';
import { loginWithStorageSeed } from './_helpers/auth';

const uniq = () => `e2e-${Date.now()}`;
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3001';

test.describe('Feeding flow', () => {
  test('create feeding log shows in list', async ({ page }) => {
    const email = process.env.E2E_EMAIL ?? 'admin@greenvaleyfarm.com';
    const password = process.env.E2E_PASSWORD ?? 'password123';

    await loginWithStorageSeed(page, { email, password });

    await page.goto('/feeding');
    await expect(page.getByTestId('feeding-title')).toBeVisible();

    await page.getByTestId('feeding-add').click();
    await expect(page.getByTestId('feeding-form-dialog')).toBeVisible();

    // Find an existing animal via API (DB constraint requires a real animalId)
    const loginRes = await page.request.post(`${API_URL}/auth/login`, {
      data: { email, password },
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

    await page.getByTestId('feeding-form-animalId').fill(animalId);
    await page.getByTestId('feeding-form-date').fill(new Date().toISOString().split('T')[0]);
    await page.getByTestId('feeding-form-quantity').fill('5');
    await page.getByTestId('feeding-form-cost').fill('100');
    await page.getByTestId('feeding-form-notes').fill(`notes-${uniq()}`);

    await page.getByTestId('feeding-form-submit').click();

    await expect(page.getByTestId('feeding-list')).toBeVisible();
    await expect(page.locator('[data-testid^="feeding-row-"]').first()).toBeVisible();
  });
});
