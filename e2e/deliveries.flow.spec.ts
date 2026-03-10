import { test, expect } from '@playwright/test';
import { loginWithStorageSeed } from './_helpers/auth';

const E2E_EMAIL = process.env.E2E_EMAIL ?? 'admin@greenvaleyfarm.com';
const E2E_PASSWORD = process.env.E2E_PASSWORD ?? 'password123';

test('deliveries: create delivery and show in list', async ({ page }) => {
  await loginWithStorageSeed(page, { email: E2E_EMAIL, password: E2E_PASSWORD });

  await page.goto('/deliveries');
  await expect(page.getByTestId('deliveries-title')).toBeVisible();

  await page.getByTestId('deliveries-add').click();
  await expect(page.getByTestId('delivery-form-dialog')).toBeVisible();

  const buyerName = `E2E Buyer ${Date.now()}`;

  await page.getByTestId('delivery-form-buyerName').fill(buyerName);
  await page.getByTestId('delivery-form-quantity').fill('10');
  await page.getByTestId('delivery-form-pricePerLiter').fill('50');

  await page.getByTestId('delivery-form-submit').click();

  await expect(page.getByTestId('delivery-form-dialog')).toBeHidden();
  await expect(page.getByTestId('deliveries-list')).toBeVisible();
  await expect(page.getByTestId('deliveries-list')).toContainText(buyerName);
});
