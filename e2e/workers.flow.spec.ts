import { test, expect } from '@playwright/test';
import { loginWithStorageSeed } from './_helpers/auth';

const E2E_EMAIL = process.env.E2E_EMAIL ?? 'admin@greenvaleyfarm.com';
const E2E_PASSWORD = process.env.E2E_PASSWORD ?? 'password123';

test('workers: create worker and show in list', async ({ page }) => {
  await loginWithStorageSeed(page, { email: E2E_EMAIL, password: E2E_PASSWORD });

  await page.goto('/workers');
  await expect(page.getByTestId('workers-title')).toBeVisible();

  await page.getByTestId('workers-add').click();
  await expect(page.getByTestId('worker-form-dialog')).toBeVisible();

  const name = `E2E Worker ${Date.now()}`;

  await page.getByTestId('worker-form-name').fill(name);
  await page.getByTestId('worker-form-contactNumber').fill('9999999999');
  await page.getByTestId('worker-form-salary').fill('15000');

  await page.getByTestId('worker-form-submit').click();

  await expect(page.getByTestId('worker-form-dialog')).toBeHidden();
  await expect(page.getByTestId('workers-list')).toBeVisible();
  await expect(page.getByTestId('workers-list')).toContainText(name);
});
