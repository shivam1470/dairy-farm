import { test, expect } from '@playwright/test';
import { loginWithStorageSeed } from './_helpers/auth';

const E2E_EMAIL = process.env.E2E_EMAIL ?? 'admin@greenvaleyfarm.com';
const E2E_PASSWORD = process.env.E2E_PASSWORD ?? 'password123';

test('animals: add dialog should not retain values after close/reopen', async ({ page }) => {
  await loginWithStorageSeed(page, { email: E2E_EMAIL, password: E2E_PASSWORD });

  await page.goto('/animals');
  await expect(page).toHaveURL(/\/animals/);

  // Open Add dialog
  await page.getByTestId('animals-add-button').click();
  await expect(page.getByRole('heading', { name: /add new animal/i })).toBeVisible();

  // Type a couple of fields
  await page.getByTestId('animal-tag-number').fill('TEMP-TAG');
  await page.getByTestId('animal-breed').fill('TEMP-BREED');

  // Close dialog
  await page.getByRole('button', { name: /cancel/i }).click();
  await expect(page.getByRole('heading', { name: /add new animal/i })).toBeHidden({ timeout: 10_000 });

  // Reopen Add dialog
  await page.getByTestId('animals-add-button').click();
  await expect(page.getByRole('heading', { name: /add new animal/i })).toBeVisible();

  // Assert values are reset
  await expect(page.getByTestId('animal-tag-number')).toHaveValue('');
  await expect(page.getByTestId('animal-breed')).toHaveValue('');
});
