import { test, expect } from '@playwright/test';
import { loginWithStorageSeed } from './_helpers/auth';

const E2E_EMAIL = process.env.E2E_EMAIL ?? 'admin@greenvaleyfarm.com';
const E2E_PASSWORD = process.env.E2E_PASSWORD ?? 'password123';

function uniq(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1_000_000)}`;
}

test('farm development: phase + milestone + complete (full flow)', async ({ page }) => {
  await loginWithStorageSeed(page, { email: E2E_EMAIL, password: E2E_PASSWORD });

  await page.goto('/farm-development');
  await expect(page).toHaveURL(/\/farm-development/);
  await expect(page.getByRole('heading', { name: /farm development progress/i })).toBeVisible();

  const phaseName = uniq('PW-Phase');
  const milestoneTitle = uniq('PW-Milestone');

  // Create phase
  await page.getByTestId('farmdev-add-phase-button').click();
  await expect(page.getByRole('heading', { name: /add new phase/i })).toBeVisible();

  await page.getByTestId('farmdev-phase-name').fill(phaseName);
  await page.getByTestId('farmdev-phase-description').fill('E2E phase created by Playwright');
  await page.getByTestId('farmdev-phase-budget').fill('1000');

  await page.getByTestId('farmdev-phase-submit').click();

  // Phase should show up in grid
  await expect(page.getByText(phaseName)).toBeVisible({ timeout: 30_000 });

  // Open phase detail
  // The View button lives on the same card as the phase heading.
  // We locate the card container by the unique heading, then click "View" within that card.
  const phaseCard = page
    .getByRole('heading', { name: phaseName })
    .locator('xpath=ancestor::*[.//button[normalize-space()="View"]][1]');
  await expect(phaseCard).toBeVisible({ timeout: 30_000 });
  await phaseCard.getByRole('button', { name: /^view$/i }).click();

  // Phase detail dialog is the one with the phase name in the dialog title.
  // Avoid strict-mode collisions by scoping to the dialog and the dialog title element.
  const phaseDetailDialog = page.getByRole('dialog');
  await expect(phaseDetailDialog).toBeVisible({ timeout: 30_000 });
  await expect(
    phaseDetailDialog.locator('.MuiDialogTitle-root', { hasText: phaseName }),
  ).toBeVisible({ timeout: 30_000 });

  // Add milestone
  await page.getByTestId('farmdev-add-milestone-button').click();
  await page.getByTestId('farmdev-milestone-title').fill(milestoneTitle);
  await page.getByTestId('farmdev-milestone-description').fill('E2E milestone');
  await page.getByTestId('farmdev-milestone-submit').click();

  // Give the UI a moment to persist + refetch/update the milestones list.
  await page.waitForLoadState('networkidle');

  // Milestone should appear in the milestones list
  await expect(page.locator('li', { hasText: milestoneTitle }).first()).toBeVisible({ timeout: 30_000 });

  // Complete milestone (click the complete icon on the row)
  const row = page.locator('li').filter({ hasText: milestoneTitle }).first();
  const completeButton = row.getByTitle(/mark as complete/i);
  await completeButton.click();

  await page.waitForLoadState('networkidle');

  // Completed chip should be visible for the milestone
  await expect(row.getByText('COMPLETED', { exact: true })).toBeVisible({ timeout: 30_000 });
});
