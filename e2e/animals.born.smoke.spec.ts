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

  // MUI v6 DateField renders separate spinbuttons for month/day/year.
  const dobGroup = page.getByRole('group', { name: /date of birth/i });
  await dobGroup.getByRole('spinbutton', { name: /month/i }).fill(mm);
  await dobGroup.getByRole('spinbutton', { name: /day/i }).fill(dd);
  await dobGroup.getByRole('spinbutton', { name: /year/i }).fill(yyyy);
  // Blur to trigger validation
  await dobGroup.getByRole('spinbutton', { name: /year/i }).blur();
}

test('animals: create BORN animal (smoke)', async ({ page }) => {
  // Deterministic auth: seeds token + zustand auth-storage (includes farmId)
  await loginWithStorageSeed(page, { email: E2E_EMAIL, password: E2E_PASSWORD });

  await page.goto('/animals');
  await expect(page).toHaveURL(/\/animals/);

  // If this fails, we’re still hitting the farm association gate.
  await expect(page.getByRole('heading', { name: /animal management/i })).toBeVisible();

  const tag = uniqueTag('PW-BORN');

  await page.getByTestId('animals-add-button').click();
  await expect(page.getByRole('heading', { name: /add new animal/i })).toBeVisible();

  // Regression: the create form should not retain values from a previous dialog session.
  await expect(page.getByTestId('animal-tag-number')).toHaveValue('');
  await expect(page.getByTestId('animal-breed')).toHaveValue('');

  await page.getByTestId('animal-acquisition-type').getByRole('combobox').click();
  await page.getByRole('option', { name: /born on farm/i }).click();

  await page.getByTestId('animal-tag-number').fill(tag);
  await page.getByTestId('animal-breed').fill('Holstein Friesian');

  await page.getByTestId('animal-gender').getByRole('combobox').click();
  await page.getByRole('option', { name: /female/i }).click();

  await page.getByTestId('animal-type').getByRole('combobox').click();
  await page.getByRole('option').first().click();

  await page.getByTestId('animal-life-stage').getByRole('combobox').click();
  await page.getByRole('option').first().click();

  await page.getByTestId('animal-status').getByRole('combobox').click();
  await page.getByRole('option').first().click();

  // Set DOB to a past date; UI renders this as Month/Day/Year spinbuttons.
  await setDobViaSpinbuttons(page, 60);

  // BORN animals require time of birth too.
  const tobGroup = page.getByRole('group', { name: /time of birth/i });
  await tobGroup.getByRole('spinbutton', { name: /hours/i }).fill('02');
  await tobGroup.getByRole('spinbutton', { name: /minutes/i }).fill('30');
  await tobGroup.getByRole('spinbutton', { name: /meridiem/i }).fill('AM');
  await tobGroup.getByRole('spinbutton', { name: /meridiem/i }).blur();

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
