import { test, expect } from '@playwright/test';
import { loginWithStorageSeed } from './_helpers/auth';

const E2E_EMAIL = process.env.E2E_EMAIL ?? 'admin@greenvaleyfarm.com';
const E2E_PASSWORD = process.env.E2E_PASSWORD ?? 'password123';

test('tasks: create task, show in list, and complete it', async ({ page }) => {
  await loginWithStorageSeed(page, { email: E2E_EMAIL, password: E2E_PASSWORD });

  await page.goto('/tasks');
  await expect(page.getByTestId('tasks-title')).toBeVisible();

  await page.getByTestId('tasks-add').click();
  await expect(page.getByTestId('task-form-dialog')).toBeVisible();

  const title = `E2E Task ${Date.now()}`;

  await page.getByTestId('task-form-title').fill(title);
  await page.getByTestId('task-form-submit').click();

  await expect(page.getByTestId('task-form-dialog')).toBeHidden();
  await expect(page.getByTestId('tasks-list')).toBeVisible();
  await expect(page.getByTestId('tasks-list')).toContainText(title);

  // Find the row that contains our title and complete it
  const row = page.locator('tr', { hasText: title });
  await row.getByRole('button', { name: 'Complete' }).click();

  // Status chip should reflect completion
  await expect(row).toContainText('COMPLETED');
});
