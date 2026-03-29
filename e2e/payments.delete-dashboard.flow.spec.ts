import { expect, test } from '@playwright/test';
import { loginWithStorageSeed } from './_helpers/auth';

const E2E_EMAIL = process.env.E2E_EMAIL ?? 'admin@greenvaleyfarm.com';
const E2E_PASSWORD = process.env.E2E_PASSWORD ?? 'password123';

test('payments: deleting a payment removes it from dashboard recent activity', async ({
  page,
}) => {
  await loginWithStorageSeed(page, {
    email: E2E_EMAIL,
    password: E2E_PASSWORD,
  });

  const description = `E2E delete payment ${Date.now()}`;

  await page.goto('/payments');
  await expect(page.getByTestId('payments-title')).toBeVisible();

  await page.getByTestId('payments-add-income').click();
  await expect(page.getByTestId('payment-form-dialog')).toBeVisible();

  await page.getByTestId('payment-form-amount').fill('987');
  await page.getByTestId('payment-form-description').fill(description);
  await page.getByTestId('payment-form-submit').click();

  await expect(page.getByTestId('payment-form-dialog')).toBeHidden();
  await expect(page.getByTestId('payments-income-list')).toContainText(description);

  await page.goto('/dashboard');
  await expect(page.getByTestId('dashboard-recent-activity')).toContainText(
    description,
  );

  await page.goto('/payments');
  const paymentRow = page.locator('tr', { hasText: description });
  await expect(paymentRow).toBeVisible();
  await paymentRow.locator('[data-testid^="payment-delete-"]').click();

  const deleteDialog = page.getByRole('dialog');
  await expect(deleteDialog).toContainText('Confirm Delete');
  await deleteDialog.getByRole('button', { name: 'Delete' }).click();

  await expect(page.getByTestId('payments-income-list')).not.toContainText(
    description,
  );

  await page.goto('/dashboard');
  await expect(page.getByTestId('dashboard-recent-activity')).not.toContainText(
    description,
  );
});
