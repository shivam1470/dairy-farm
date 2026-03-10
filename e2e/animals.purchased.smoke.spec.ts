import { test, expect } from '@playwright/test';
import { loginWithStorageSeed } from './_helpers/auth';

const E2E_EMAIL = process.env.E2E_EMAIL ?? 'admin@greenvaleyfarm.com';
const E2E_PASSWORD = process.env.E2E_PASSWORD ?? 'password123';

function uniqueTag(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1_000_000)}`;
}

async function setDobViaSpinbuttons(page: import('@playwright/test').Page, daysAgo: number) {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  const yyyy = String(d.getFullYear());

  const dobGroup = page.getByRole('group', { name: /date of birth/i });
  await dobGroup.getByRole('spinbutton', { name: /month/i }).fill(mm);
  await dobGroup.getByRole('spinbutton', { name: /day/i }).fill(dd);
  await dobGroup.getByRole('spinbutton', { name: /year/i }).fill(yyyy);
  await dobGroup.getByRole('spinbutton', { name: /year/i }).blur();
}

async function setPurchaseDateViaSpinbuttons(
  page: import('@playwright/test').Page,
  mm: string,
  dd: string,
  yyyy: string,
) {
  const purchaseGroup = page.getByRole('group', { name: /purchase date/i });
  await purchaseGroup.getByRole('spinbutton', { name: /month/i }).fill(mm);
  await purchaseGroup.getByRole('spinbutton', { name: /day/i }).fill(dd);
  await purchaseGroup.getByRole('spinbutton', { name: /year/i }).fill(yyyy);
  await purchaseGroup.getByRole('spinbutton', { name: /year/i }).blur();
}

test('animals: create PURCHASED animal (smoke)', async ({ page }) => {
  await loginWithStorageSeed(page, { email: E2E_EMAIL, password: E2E_PASSWORD });

  await page.goto('/animals');
  await expect(page).toHaveURL(/\/animals/);
  await expect(page.getByRole('heading', { name: /animal management/i })).toBeVisible();

  const tag = uniqueTag('PW-PUR');

  await page.getByTestId('animals-add-button').click();
  await expect(page.getByRole('heading', { name: /add new animal/i })).toBeVisible();

  await page.getByTestId('animal-acquisition-type').getByRole('combobox').click();
  await page.getByRole('option', { name: /purchased/i }).click();

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

  // Approximate DOB still can’t be in the future.
  await setDobViaSpinbuttons(page, 180);

  // Purchase information (required for PURCHASED)
  await expect(page.getByText(/purchase information/i)).toBeVisible();

  // MUI DateField renders as segmented inputs (spinbuttons), not a plain textbox.
  await setPurchaseDateViaSpinbuttons(page, '01', '15', '2026');

  await page.getByTestId('animal-purchase-price').fill('45000');
  await page.getByTestId('animal-purchase-from-name').fill('Local Seller');

  // Optional but should be valid if provided.
  await page.getByTestId('animal-purchase-from-email').fill('seller@example.com');

  const save = page.waitForResponse((r) => r.url().includes('/animals') && r.request().method() === 'POST');
  await page.getByTestId('animal-save-button').click();
  const saveResponse = await save;

  if (saveResponse.status() >= 400) {
    let bodyText = '';
    try {
      bodyText = await saveResponse.text();
    } catch {
      bodyText = '<unable to read response body>';
    }
    throw new Error(`POST /animals failed: ${saveResponse.status()} ${saveResponse.url()}\n${bodyText}`);
  }

  await expect(page.getByRole('heading', { name: /add new animal/i })).toBeHidden({ timeout: 20_000 });

  // The animals table is paginated/sorted; search ensures the new row is visible.
  await page.getByPlaceholder(/search by tag, name, or breed/i).fill(tag);
  await expect(page.getByText(tag)).toBeVisible();
});
