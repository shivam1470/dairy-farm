import { test, expect } from '@playwright/test';
import { loginWithStorageSeed } from './_helpers/auth';

const E2E_EMAIL = process.env.E2E_EMAIL ?? 'admin@greenvaleyfarm.com';
const E2E_PASSWORD = process.env.E2E_PASSWORD ?? 'password123';

test('payments: create income payment and show in list', async ({ page }) => {
  await loginWithStorageSeed(page, { email: E2E_EMAIL, password: E2E_PASSWORD });

  await page.goto('/payments');
  await expect(page.getByTestId('payments-title')).toBeVisible();

  // Open income form
  await page.getByTestId('payments-add-income').click();
  await expect(page.getByTestId('payment-form-dialog')).toBeVisible();

  // Fill minimal required fields
  const description = `E2E income ${Date.now()}`;

  await page.getByTestId('payment-form-amount').fill('1234');
  await page.getByTestId('payment-form-description').fill(description);

  // Category/type/paymentMethod default based on mode; submit
  await page.getByTestId('payment-form-submit').click();

  // Wait for dialog to close and success snackbar to appear
  await expect(page.getByTestId('payment-form-dialog')).toBeHidden();

  // Verify in income list
  await expect(page.getByTestId('payments-income-list')).toBeVisible();
  await expect(page.getByTestId('payments-income-list')).toContainText(description);
});

test('payments: create expense payment and show in list', async ({ page }) => {
  await loginWithStorageSeed(page, { email: E2E_EMAIL, password: E2E_PASSWORD });

  await page.goto('/payments');
  await expect(page.getByTestId('payments-title')).toBeVisible();

  // Open expense form
  await page.getByTestId('payments-add-expense').click();
  await expect(page.getByTestId('payment-form-dialog')).toBeVisible();

  const description = `E2E expense ${Date.now()}`;

  await page.getByTestId('payment-form-amount').fill('321');
  await page.getByTestId('payment-form-description').fill(description);

  await page.getByTestId('payment-form-submit').click();

  await expect(page.getByTestId('payment-form-dialog')).toBeHidden();

  await expect(page.getByTestId('payments-expense-list')).toBeVisible();
  await expect(page.getByTestId('payments-expense-list')).toContainText(description);
});
