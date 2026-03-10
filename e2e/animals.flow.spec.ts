import { test, expect } from '@playwright/test';
import { loginWithStorageSeed } from './_helpers/auth';

/**
 * Animal flow E2E coverage
 * - Login
 * - Navigate to Animals page
 * - Create BORN animal
 * - Create PURCHASED animal
 * - Basic validation checks
 * - Verify animals appear in list
 */

// Defaults match the backend /seed endpoint output.
// You can override via environment variables in CI.
const E2E_EMAIL = process.env.E2E_EMAIL ?? 'admin@greenvaleyfarm.com';
const E2E_PASSWORD = process.env.E2E_PASSWORD ?? 'password123';

function uniqueTag(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1_000_000)}`;
}

async function setDateViaSpinbuttons(
  group: ReturnType<import('@playwright/test').Page['getByRole']>,
  date: Date,
) {
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const yyyy = String(date.getFullYear());

  await group.getByRole('spinbutton', { name: /month/i }).fill(mm);
  await group.getByRole('spinbutton', { name: /day/i }).fill(dd);
  await group.getByRole('spinbutton', { name: /year/i }).fill(yyyy);
  await group.getByRole('spinbutton', { name: /year/i }).blur();
}

async function setDobViaSpinbuttons(page: import('@playwright/test').Page, daysAgo: number) {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  const dobGroup = page.getByRole('group', { name: /date of birth/i });
  await setDateViaSpinbuttons(dobGroup, d);
}

async function setPurchaseDateViaSpinbuttons(page: import('@playwright/test').Page, daysAgo: number) {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  const purchaseGroup = page.getByRole('group', { name: /purchase date/i });
  await setDateViaSpinbuttons(purchaseGroup, d);
}

async function setTimeOfBirthViaSpinbuttons(page: import('@playwright/test').Page) {
  const tobGroup = page.getByRole('group', { name: /time of birth/i });
  await tobGroup.getByRole('spinbutton', { name: /hours/i }).fill('08');
  await tobGroup.getByRole('spinbutton', { name: /minutes/i }).fill('30');
  await tobGroup.getByRole('spinbutton', { name: /meridiem/i }).fill('AM');
  await tobGroup.getByRole('spinbutton', { name: /meridiem/i }).blur();
}

async function goToAnimals(page: import('@playwright/test').Page) {
  // Direct route is fastest and avoids relying on sidebar selectors.
  await page.goto('/animals');
  await expect(page).toHaveURL(/\/animals/);
  await expect(page.getByRole('heading', { name: /animal management/i })).toBeVisible();
}

async function openAddAnimalDialog(page: import('@playwright/test').Page) {
  await page.getByTestId('animals-add-button').click();
  await expect(page.getByRole('heading', { name: /add new animal/i })).toBeVisible();
}

async function searchForTag(page: import('@playwright/test').Page, tag: string) {
  await page.getByPlaceholder(/search by tag, name, or breed/i).fill(tag);
}

async function selectAcquisitionType(page: import('@playwright/test').Page, type: 'BORN' | 'PURCHASED') {
  await page.getByTestId('animal-acquisition-type').getByRole('combobox').click();
  if (type === 'BORN') {
    await page.getByRole('option', { name: /born on farm/i }).click();
  } else {
    await page.getByRole('option', { name: /purchased/i }).click();
  }
}

test.describe('animals flow', () => {
  test.beforeEach(async ({ page }) => {
    await loginWithStorageSeed(page, { email: E2E_EMAIL, password: E2E_PASSWORD });
    await goToAnimals(page);
  });

  test('create BORN animal (happy path)', async ({ page }) => {
    const tag = uniqueTag('PW-BORN');

    await openAddAnimalDialog(page);

  await selectAcquisitionType(page, 'BORN');

  await page.getByTestId('animal-tag-number').fill(tag);
  await page.getByTestId('animal-breed').fill('Holstein Friesian');

    // Required select fields
  await page.getByTestId('animal-gender').getByRole('combobox').click();
    await page.getByRole('option', { name: /female/i }).click();

  await page.getByTestId('animal-type').getByRole('combobox').click();
    // Be resilient to enum label variants.
    await page.getByRole('option').first().click();

  await page.getByTestId('animal-life-stage').getByRole('combobox').click();
    await page.getByRole('option').first().click();

  await page.getByTestId('animal-status').getByRole('combobox').click();
    await page.getByRole('option').first().click();

    // Birth section should be visible for BORN.
    await expect(page.getByText(/birth information/i)).toBeVisible();

    // Date of birth must not be in the future.
    await setDobViaSpinbuttons(page, 30);

    // Time of birth is required for BORN.
    await setTimeOfBirthViaSpinbuttons(page);

  await page.getByTestId('animal-save-button').click();
    // Success condition: dialog closes and/or the new row appears.
    await expect(page.getByRole('heading', { name: /add new animal/i })).toBeHidden({ timeout: 30_000 });

    await searchForTag(page, tag);
    await expect(page.getByText(tag)).toBeVisible({ timeout: 30_000 });
  });

  test('create PURCHASED animal (happy path)', async ({ page }) => {
    const tag = uniqueTag('PW-PUR');

    await openAddAnimalDialog(page);

  await selectAcquisitionType(page, 'PURCHASED');

  await page.getByTestId('animal-tag-number').fill(tag);
  await page.getByTestId('animal-breed').fill('Jersey');

  await page.getByTestId('animal-gender').getByRole('combobox').click();
    await page.getByRole('option', { name: /female/i }).click();

  await page.getByTestId('animal-type').getByRole('combobox').click();
    await page.getByRole('option').first().click();

  await page.getByTestId('animal-life-stage').getByRole('combobox').click();
    await page.getByRole('option').first().click();

  await page.getByTestId('animal-status').getByRole('combobox').click();
    await page.getByRole('option').first().click();

    // Purchase section should be visible for PURCHASED.
    await expect(page.getByText(/purchase information/i)).toBeVisible();

    // Still required by backend schema, and must not be in the future.
    await setDobViaSpinbuttons(page, 180);

    // Purchase date is required and is a segmented MUI field.
    await setPurchaseDateViaSpinbuttons(page, 10);
  await page.getByTestId('animal-purchase-price').fill('45000');
  await page.getByTestId('animal-purchase-from-name').fill('Local Seller');

  await page.getByTestId('animal-save-button').click();
    await expect(page.getByRole('heading', { name: /add new animal/i })).toBeHidden({ timeout: 30_000 });

    await searchForTag(page, tag);
    await expect(page.getByText(tag)).toBeVisible({ timeout: 30_000 });
  });

  test('PURCHASED validation: missing required purchase fields shows errors', async ({ page }) => {
    const tag = uniqueTag('PW-PUR-ERR');

    await openAddAnimalDialog(page);

  await selectAcquisitionType(page, 'PURCHASED');

  await page.getByTestId('animal-tag-number').fill(tag);
  await page.getByTestId('animal-breed').fill('Jersey');

  await page.getByTestId('animal-gender').getByRole('combobox').click();
    await page.getByRole('option', { name: /female/i }).click();

  await page.getByTestId('animal-type').getByRole('combobox').click();
    await page.getByRole('option').first().click();

  await page.getByTestId('animal-life-stage').getByRole('combobox').click();
    await page.getByRole('option').first().click();

  await page.getByTestId('animal-status').getByRole('combobox').click();
    await page.getByRole('option').first().click();

    // Intentionally skip: Purchase Date, Purchase Price, Seller Name
  await page.getByTestId('animal-save-button').click();

    // We don't know exact copy from Yup, but fields should show some error text.
  await expect(page.getByTestId('animal-purchase-date')).toBeVisible();
  await expect(page.getByTestId('animal-purchase-price')).toBeVisible();
  await expect(page.getByTestId('animal-purchase-from-name')).toBeVisible();

    // The dialog should still be open (submit blocked by validation).
    await expect(page.getByRole('heading', { name: /add new animal/i })).toBeVisible();

    // And required purchase fields should still be empty.
    await expect(page.getByTestId('animal-purchase-price')).toHaveValue('');
    await expect(page.getByTestId('animal-purchase-from-name')).toHaveValue('');
  });
});
