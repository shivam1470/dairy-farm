import { test, expect } from '@playwright/test';
import { loginWithStorageSeed } from './_helpers/auth';

// Basic happy-path coverage for the Milk Records screen.
// Assumes backend already has at least one animal for the logged-in user's farm.

test('milk records: create record and show in list', async ({ page }) => {
  await loginWithStorageSeed(page, {
    email: process.env.E2E_EMAIL ?? 'admin@greenvaleyfarm.com',
    password: process.env.E2E_PASSWORD ?? 'password123',
  });

  await page.goto('/milk-records');

  await expect(page.getByTestId('milk-records-title')).toBeVisible();

  await page.getByTestId('add-milk-record-button').click();

  await expect(page.getByTestId('milk-record-animal-select')).toBeVisible();
  await page.getByTestId('milk-record-animal-select').click();

  // Pick first animal
  const option = page.getByRole('option').first();
  await option.click();

  await page.getByTestId('milk-record-session-select').click();
  await page.getByRole('option', { name: 'MORNING' }).click();

  await page.getByTestId('milk-record-quantity').fill('7.5');
  await page.getByTestId('milk-record-fat').fill('4.2');

  await page.getByTestId('milk-record-save').click();

  await expect(page.getByTestId('milk-records-list')).toBeVisible();
  await expect(
    page
      .getByTestId('milk-records-list')
      .locator('[data-testid^="milk-record-row-"]')
      .first()
  ).toBeVisible();
});
