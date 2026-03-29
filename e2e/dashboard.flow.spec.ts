import { test, expect } from '@playwright/test';
import { loginWithStorageSeed } from './_helpers/auth';

const E2E_EMAIL = process.env.E2E_EMAIL ?? 'admin@greenvaleyfarm.com';
const E2E_PASSWORD = process.env.E2E_PASSWORD ?? 'password123';

test('dashboard: renders live overview sections', async ({ page }) => {
  await loginWithStorageSeed(page, { email: E2E_EMAIL, password: E2E_PASSWORD });

  await page.goto('/dashboard');
  await expect(page).toHaveURL(/\/dashboard/);

  await expect(page.getByTestId('dashboard-title')).toBeVisible();
  await expect(page.getByTestId('dashboard-stat-animals')).toContainText('Total Animals');
  await expect(page.getByTestId('dashboard-stat-milk')).toContainText("Today's Milk");
  await expect(page.getByTestId('dashboard-stat-finance')).toContainText('Monthly Income');
  await expect(page.getByTestId('dashboard-stat-operations')).toContainText('Workers & Tasks');
  await expect(page.getByTestId('dashboard-overview')).toBeVisible();
  await expect(page.getByTestId('dashboard-quick-actions')).toBeVisible();
  await expect(page.getByTestId('dashboard-recent-activity')).toBeVisible();
  await expect(page.getByTestId('dashboard-financial-pulse')).toBeVisible();
});
